(function () {
  "use strict";

  var SAVE_KEY = "tta-save-v1";

  var TIER_LABEL = {
    normal: "Normal",
    slow: "Slow",
    very_slow: "Very Slow",
    extremely_slow: "Extremely Slow",
    fast: "Fast"
  };

  // ---------- State ----------

  function freshTreeState() {
    return { currentIndex: 0, spent: [], history: [] };
  }

  function freshEntityState(entityDef) {
    var trees = {};
    entityDef.trees.forEach(function (t) {
      var ts = freshTreeState();
      ts.spent = t.skills.map(function () { return 0; });
      trees[t.id] = ts;
    });
    return { level: 1, trees: trees };
  }

  function freshState() {
    var characters = {};
    TTA_DATA.characters.forEach(function (c) {
      characters[c.id] = freshEntityState(c);
    });
    var crafting = freshEntityState(TTA_DATA.crafting);
    return {
      characters: characters,
      crafting: crafting,
      boss: { maxHealth: null, hits: [] },
      selectedCharId: TTA_DATA.characters[0].id
    };
  }

  function loadState() {
    var raw;
    try {
      raw = localStorage.getItem(SAVE_KEY);
    } catch (e) {
      raw = null;
    }
    if (!raw) return freshState();
    try {
      var parsed = JSON.parse(raw);
      return reconcileState(parsed);
    } catch (e) {
      return freshState();
    }
  }

  // Ensures saved data still lines up with the current skill definitions
  // (adds any missing character/tree/skill slots without wiping progress).
  function reconcileState(saved) {
    var fresh = freshState();
    var out = {
      characters: {},
      crafting: null,
      boss: saved.boss || fresh.boss,
      selectedCharId: saved.selectedCharId || fresh.selectedCharId
    };

    function reconcileEntity(defEntity, savedEntity) {
      var fe = freshEntityState(defEntity);
      if (!savedEntity) return fe;
      fe.level = typeof savedEntity.level === "number" ? savedEntity.level : fe.level;
      defEntity.trees.forEach(function (t) {
        var savedTree = savedEntity.trees && savedEntity.trees[t.id];
        if (!savedTree) return;
        var ts = fe.trees[t.id];
        for (var i = 0; i < ts.spent.length; i++) {
          if (typeof savedTree.spent[i] === "number") ts.spent[i] = savedTree.spent[i];
        }
        ts.currentIndex = typeof savedTree.currentIndex === "number" ? savedTree.currentIndex : ts.currentIndex;
        ts.history = Array.isArray(savedTree.history) ? savedTree.history.slice() : [];
      });
      return fe;
    }

    TTA_DATA.characters.forEach(function (c) {
      out.characters[c.id] = reconcileEntity(c, saved.characters && saved.characters[c.id]);
    });
    out.crafting = reconcileEntity(TTA_DATA.crafting, saved.crafting);

    if (!out.boss || typeof out.boss !== "object") out.boss = { maxHealth: null, hits: [] };
    if (!Array.isArray(out.boss.hits)) out.boss.hits = [];

    return out;
  }

  var state = loadState();

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    } catch (e) {
      // storage unavailable / full - fail silently, nothing else we can do here
    }
  }

  // ---------- Skill tree logic ----------

  function findEntityDef(entityId) {
    if (entityId === TTA_DATA.crafting.id) return TTA_DATA.crafting;
    return TTA_DATA.characters.find(function (c) { return c.id === entityId; });
  }

  function findEntityState(entityId) {
    if (entityId === TTA_DATA.crafting.id) return state.crafting;
    return state.characters[entityId];
  }

  function findFirstUnlockedIndex(treeState, treeDef) {
    for (var i = 0; i < treeDef.skills.length; i++) {
      if (treeState.spent[i] < treeDef.skills[i].required) return i;
    }
    return treeDef.skills.length - 1; // fully maxed, stay put on the last skill
  }

  function isTreeMaxed(treeState, treeDef) {
    return treeState.spent.every(function (s, i) { return s >= treeDef.skills[i].required; });
  }

  function addPoint(entityId, treeId) {
    var entityDef = findEntityDef(entityId);
    var treeDef = entityDef.trees.find(function (t) { return t.id === treeId; });
    var entityState = findEntityState(entityId);
    var treeState = entityState.trees[treeId];

    if (isTreeMaxed(treeState, treeDef)) return;

    var idx = treeState.currentIndex;
    var skill = treeDef.skills[idx];
    if (treeState.spent[idx] >= skill.required) {
      idx = findFirstUnlockedIndex(treeState, treeDef);
      treeState.currentIndex = idx;
      skill = treeDef.skills[idx];
      if (treeState.spent[idx] >= skill.required) return; // maxed
    }

    treeState.spent[idx]++;
    treeState.history.push(idx);

    if (treeState.spent[idx] >= skill.required) {
      treeState.currentIndex = findFirstUnlockedIndex(treeState, treeDef);
    }

    save();
  }

  function undoPoint(entityId, treeId) {
    var entityState = findEntityState(entityId);
    var treeState = entityState.trees[treeId];
    if (!treeState.history.length) return;
    var idx = treeState.history.pop();
    treeState.spent[idx] = Math.max(0, treeState.spent[idx] - 1);
    treeState.currentIndex = idx;
    save();
  }

  function selectSkill(entityId, treeId, index) {
    var entityDef = findEntityDef(entityId);
    var treeDef = entityDef.trees.find(function (t) { return t.id === treeId; });
    var entityState = findEntityState(entityId);
    var treeState = entityState.trees[treeId];
    var skill = treeDef.skills[index];
    if (treeState.spent[index] >= skill.required) return; // already unlocked, nothing to redirect
    treeState.currentIndex = index;
    save();
  }

  function levelUp(entityId) {
    var entityState = findEntityState(entityId);
    var entityDef = findEntityDef(entityId);
    var passiveTree = entityDef.trees.find(function (t) { return t.kind === "passive"; });
    entityState.level++;
    if (passiveTree) addPoint(entityId, passiveTree.id);
    save();
  }

  function levelDown(entityId) {
    var entityState = findEntityState(entityId);
    var entityDef = findEntityDef(entityId);
    if (entityState.level <= 1) return;
    var passiveTree = entityDef.trees.find(function (t) { return t.kind === "passive"; });
    entityState.level--;
    if (passiveTree) undoPoint(entityId, passiveTree.id);
    save();
  }

  // ---------- Rendering: Skills tab ----------

  var charPickerEl = document.getElementById("charPicker");
  var charContentEl = document.getElementById("charContent");

  function renderCharPicker() {
    charPickerEl.innerHTML = "";
    var entries = TTA_DATA.characters.concat([TTA_DATA.crafting]);
    entries.forEach(function (entity) {
      var btn = document.createElement("button");
      btn.className = "char-chip" + (state.selectedCharId === entity.id ? " active" : "");
      btn.textContent = entity.name;
      btn.addEventListener("click", function () {
        state.selectedCharId = entity.id;
        save();
        renderCharPicker();
        renderCharContent();
      });
      charPickerEl.appendChild(btn);
    });
  }

  function pct(n) {
    return Math.round(n * 100) + "%";
  }

  function renderTreeCard(entity, entityState, treeDef) {
    var treeState = entityState.trees[treeDef.id];
    var maxed = isTreeMaxed(treeState, treeDef);
    var curIdx = maxed ? treeDef.skills.length - 1 : treeState.currentIndex;
    var curSkill = treeDef.skills[curIdx];
    var curSpent = treeState.spent[curIdx];
    var curPct = Math.min(1, curSpent / curSkill.required);

    var card = document.createElement("div");
    card.className = "card tree-card";

    var titleRow = document.createElement("div");
    titleRow.className = "tree-title-row";
    titleRow.innerHTML =
      '<span class="tree-title">' + treeDef.name + '</span>' +
      '<span class="tree-kind">' + (treeDef.kind === "passive" ? "Passive" : "Active") + '</span>';
    card.appendChild(titleRow);

    var curBox = document.createElement("div");
    curBox.className = "current-skill-box";
    curBox.innerHTML =
      '<div class="cs-top">' +
        '<span class="cs-name">' + (maxed ? "Maxed &mdash; " + curSkill.name : curSkill.name) + '</span>' +
        '<span class="cs-progress-text">' + curSpent + ' / ' + curSkill.required + '</span>' +
      '</div>' +
      '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct(curPct) + '"></div></div>';

    var actions = document.createElement("div");
    actions.className = "cs-actions";

    if (treeDef.kind === "active") {
      var useBtn = document.createElement("button");
      useBtn.className = "btn btn-primary";
      useBtn.textContent = "Use Skill (+1)";
      useBtn.disabled = maxed;
      useBtn.addEventListener("click", function () {
        addPoint(entity.id, treeDef.id);
        renderCharContent();
      });
      actions.appendChild(useBtn);
    } else {
      var hint = document.createElement("span");
      hint.className = "cs-progress-text";
      hint.style.flex = "1";
      hint.style.display = "flex";
      hint.style.alignItems = "center";
      hint.textContent = "Gains a point automatically on Level Up";
      actions.appendChild(hint);
    }

    var undoBtn = document.createElement("button");
    undoBtn.className = "btn btn-secondary";
    undoBtn.textContent = "Undo";
    undoBtn.disabled = treeState.history.length === 0;
    undoBtn.addEventListener("click", function () {
      undoPoint(entity.id, treeDef.id);
      renderCharContent();
    });
    actions.appendChild(undoBtn);

    curBox.appendChild(actions);
    card.appendChild(curBox);

    var list = document.createElement("ul");
    list.className = "skill-list";
    treeDef.skills.forEach(function (skill, i) {
      var spent = treeState.spent[i];
      var unlocked = spent >= skill.required;
      var isCurrent = !maxed && i === treeState.currentIndex;
      var row = document.createElement("li");
      row.className = "skill-row " + (unlocked ? "unlocked" : "locked") + (isCurrent ? " current" : "");
      row.title = TIER_LABEL[skill.tier] || "";
      row.innerHTML =
        '<span class="sk-dot tier-' + skill.tier + '"></span>' +
        '<span class="sk-name">' + skill.name + '</span>' +
        '<span class="sk-cost">' + spent + '/' + skill.required + '</span>';
      if (!unlocked) {
        row.addEventListener("click", function () {
          selectSkill(entity.id, treeDef.id, i);
          renderCharContent();
        });
      }
      list.appendChild(row);
    });
    card.appendChild(list);

    return card;
  }

  function renderCharContent() {
    var entity = findEntityDef(state.selectedCharId);
    var entityState = findEntityState(state.selectedCharId);
    charContentEl.innerHTML = "";

    var header = document.createElement("div");
    header.className = "char-header card";
    var h2 = document.createElement("h2");
    h2.textContent = entity.name;
    header.appendChild(h2);

    if (entity.id !== TTA_DATA.crafting.id) {
      var lvlWrap = document.createElement("div");
      lvlWrap.className = "level-control";
      lvlWrap.innerHTML =
        '<span class="level-label">Level</span>' +
        '<span class="level-value">' + entityState.level + '</span>';

      var minusBtn = document.createElement("button");
      minusBtn.className = "btn btn-secondary btn-round";
      minusBtn.textContent = "-";
      minusBtn.disabled = entityState.level <= 1;
      minusBtn.addEventListener("click", function () {
        levelDown(entity.id);
        renderCharContent();
      });

      var plusBtn = document.createElement("button");
      plusBtn.className = "btn btn-primary btn-round";
      plusBtn.textContent = "+";
      plusBtn.addEventListener("click", function () {
        levelUp(entity.id);
        renderCharContent();
      });

      lvlWrap.insertBefore(minusBtn, lvlWrap.firstChild);
      lvlWrap.appendChild(plusBtn);
      header.appendChild(lvlWrap);
    }

    charContentEl.appendChild(header);

    var legend = document.createElement("div");
    legend.className = "legend";
    legend.innerHTML = [
      ["normal", "Normal"],
      ["slow", "Slow"],
      ["very_slow", "Very Slow"],
      ["extremely_slow", "Extremely Slow"],
      ["fast", "Fast"]
    ].map(function (t) {
      return '<span><span class="sk-dot tier-' + t[0] + '"></span>' + t[1] + '</span>';
    }).join("");
    charContentEl.appendChild(legend);

    var grid = document.createElement("div");
    grid.className = "tree-grid";
    entity.trees.forEach(function (treeDef) {
      grid.appendChild(renderTreeCard(entity, entityState, treeDef));
    });
    charContentEl.appendChild(grid);
  }

  // ---------- Rendering: Boss Fight tab ----------

  var bossMaxHealthEl = document.getElementById("bossMaxHealth");
  var newBossBtn = document.getElementById("newBossBtn");
  var hitForm = document.getElementById("hitForm");
  var hitInput = document.getElementById("hitInput");
  var undoHitBtn = document.getElementById("undoHitBtn");
  var hitListEl = document.getElementById("hitList");
  var hitCountEl = document.getElementById("hitCount");
  var statHpLeftEl = document.getElementById("statHpLeft");
  var statPctLeftEl = document.getElementById("statPctLeft");
  var statAvgHitEl = document.getElementById("statAvgHit");
  var statHitsLeftEl = document.getElementById("statHitsLeft");

  function renderBoss() {
    bossMaxHealthEl.value = state.boss.maxHealth === null ? "" : state.boss.maxHealth;

    var hits = state.boss.hits;
    var totalDamage = hits.reduce(function (a, h) { return a + h.dmg; }, 0);
    var maxHealth = state.boss.maxHealth;

    hitListEl.innerHTML = "";
    if (!hits.length) {
      var empty = document.createElement("li");
      empty.className = "empty-msg";
      empty.textContent = "No hits logged yet.";
      hitListEl.appendChild(empty);
    } else {
      hits.slice().reverse().forEach(function (hit, i) {
        var row = document.createElement("li");
        row.className = "hit-row";
        var num = hits.length - i;
        row.innerHTML =
          '<span class="hit-num">#' + num + '</span>' +
          '<span class="hit-dmg">' + hit.dmg + '</span>';
        var del = document.createElement("button");
        del.className = "hit-del";
        del.textContent = "✕";
        del.addEventListener("click", function () {
          state.boss.hits = state.boss.hits.filter(function (h) { return h.id !== hit.id; });
          save();
          renderBoss();
        });
        row.appendChild(del);
        hitListEl.appendChild(row);
      });
    }

    hitCountEl.textContent = hits.length;
    undoHitBtn.disabled = hits.length === 0;

    if (maxHealth === null || maxHealth === undefined || maxHealth === "") {
      statHpLeftEl.textContent = "-";
      statPctLeftEl.textContent = "-";
    } else {
      var hpLeft = maxHealth - totalDamage;
      statHpLeftEl.textContent = hpLeft;
      statPctLeftEl.textContent = maxHealth > 0 ? pct(Math.max(0, hpLeft) / maxHealth) : "-";
    }

    if (hits.length > 0) {
      var avg = totalDamage / hits.length;
      statAvgHitEl.textContent = Math.round(avg * 10) / 10;
      if (maxHealth !== null && maxHealth !== undefined && maxHealth !== "" && avg > 0) {
        var hpLeft2 = Math.max(0, maxHealth - totalDamage);
        statHitsLeftEl.textContent = Math.ceil(hpLeft2 / avg);
      } else {
        statHitsLeftEl.textContent = "-";
      }
    } else {
      statAvgHitEl.textContent = "-";
      statHitsLeftEl.textContent = "-";
    }
  }

  bossMaxHealthEl.addEventListener("input", function () {
    var v = bossMaxHealthEl.value;
    state.boss.maxHealth = v === "" ? null : Number(v);
    save();
    renderBoss();
  });

  newBossBtn.addEventListener("click", function () {
    if (state.boss.hits.length && !confirm("Start a new boss fight? This clears the current hit log.")) return;
    state.boss.hits = [];
    save();
    renderBoss();
  });

  hitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = Number(hitInput.value);
    if (!hitInput.value || isNaN(v)) return;
    state.boss.hits.push({ id: Date.now() + "-" + Math.random(), dmg: v });
    hitInput.value = "";
    hitInput.focus();
    save();
    renderBoss();
  });

  undoHitBtn.addEventListener("click", function () {
    state.boss.hits.pop();
    save();
    renderBoss();
  });

  // ---------- Tabs ----------

  var tabBtns = document.querySelectorAll(".tab-btn");
  var views = { skills: document.getElementById("skillsView"), boss: document.getElementById("bossView") };

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      Object.keys(views).forEach(function (k) { views[k].classList.remove("active"); });
      views[btn.dataset.tab].classList.add("active");
    });
  });

  // ---------- Init ----------

  renderCharPicker();
  renderCharContent();
  renderBoss();
})();
