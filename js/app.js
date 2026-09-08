(function () {
  "use strict";

  var SAVE_KEY = "tta-save-v2";
  var MAX_LEVEL = 99;

  var TIER_ORDER = ["extremely_slow", "very_slow", "slow", "normal", "fast"];
  var TIER_LABEL = {
    extremely_slow: "Extremely Slow",
    very_slow: "Very Slow",
    slow: "Slow",
    normal: "Normal",
    fast: "Fast"
  };
  var STAT_KEYS = ["strength", "spirit", "constitution", "speed", "dexterity"];
  var STAT_LABEL = {
    strength: "Strength",
    spirit: "Spirit",
    constitution: "Constitution",
    speed: "Speed",
    dexterity: "Dexterity"
  };

  // ---------- Tree / row-gating helpers ----------

  function findRowOf(treeDef, skillIndex) {
    for (var r = 0; r < treeDef.rows.length; r++) {
      if (treeDef.rows[r].indexOf(skillIndex) !== -1) return r;
    }
    return -1;
  }

  function isRowAvailable(spent, treeDef, rowIndex) {
    if (rowIndex === 0) return true;
    var prevRow = treeDef.rows[rowIndex - 1];
    return prevRow.some(function (i) { return spent[i] >= treeDef.skills[i].required; });
  }

  // A skill in an available row is learnable, UNLESS it's a lone final-row
  // "capstone" skill, which additionally needs every other skill maxed first.
  function isSkillAvailable(spent, treeDef, skillIndex) {
    var rowIndex = findRowOf(treeDef, skillIndex);
    if (rowIndex === -1) return false;
    if (!isRowAvailable(spent, treeDef, rowIndex)) return false;
    var row = treeDef.rows[rowIndex];
    if (row.length === 1 && rowIndex === treeDef.rows.length - 1) {
      return treeDef.skills.every(function (s, i) { return i === skillIndex || spent[i] >= s.required; });
    }
    return true;
  }

  function isTreeMaxed(spent, treeDef) {
    return spent.every(function (s, i) { return s >= treeDef.skills[i].required; });
  }

  function findFirstAvailableUnlockedIndex(spent, treeDef) {
    for (var i = 0; i < treeDef.skills.length; i++) {
      if (spent[i] < treeDef.skills[i].required && isSkillAvailable(spent, treeDef, i)) return i;
    }
    return -1;
  }

  // ---------- State ----------

  function freshTreeState(treeDef, simulatedPoints) {
    var spent = treeDef.skills.map(function () { return 0; });
    (treeDef.startUnlocked || []).forEach(function (i) { spent[i] = treeDef.skills[i].required; });

    if (simulatedPoints) {
      for (var p = 0; p < simulatedPoints; p++) {
        var idx = findFirstAvailableUnlockedIndex(spent, treeDef);
        if (idx === -1) break;
        spent[idx]++;
      }
    }

    var currentIndex = findFirstAvailableUnlockedIndex(spent, treeDef);
    if (currentIndex === -1) currentIndex = treeDef.skills.length - 1;

    // Starting points (pre-unlocked kit + level-derived passives) are the
    // baseline, not something the player did - keep them out of history so
    // Undo can't roll back below where the character actually starts.
    return { currentIndex: currentIndex, spent: spent, history: [] };
  }

  function freshEntityState(entityDef) {
    var trees = {};
    var level = entityDef.startLevel || 1;
    entityDef.trees.forEach(function (t) {
      var simPoints = t.kind === "passive" ? Math.max(0, level - 1) : 0;
      trees[t.id] = freshTreeState(t, simPoints);
    });
    var stats = {};
    STAT_KEYS.forEach(function (k) {
      stats[k] = entityDef.stats ? entityDef.stats[k] : 0;
    });
    return { level: level, stats: stats, trees: trees };
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
      party: [],
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
      return reconcileState(JSON.parse(raw));
    } catch (e) {
      return freshState();
    }
  }

  // Ensures saved data still lines up with the current skill/character
  // definitions (adds any missing slots without wiping existing progress).
  function reconcileState(saved) {
    var fresh = freshState();
    var out = {
      characters: {},
      crafting: null,
      party: Array.isArray(saved.party) ? saved.party.filter(function (id) {
        return TTA_DATA.characters.some(function (c) { return c.id === id; });
      }).slice(0, 3) : [],
      boss: saved.boss || fresh.boss,
      selectedCharId: saved.selectedCharId || fresh.selectedCharId
    };

    function reconcileEntity(defEntity, savedEntity) {
      var fe = freshEntityState(defEntity);
      if (!savedEntity) return fe;
      if (typeof savedEntity.level === "number") {
        fe.level = Math.min(MAX_LEVEL, Math.max(defEntity.startLevel || 1, savedEntity.level));
      }
      if (savedEntity.stats) {
        STAT_KEYS.forEach(function (k) {
          if (typeof savedEntity.stats[k] === "number") fe.stats[k] = savedEntity.stats[k];
        });
      }
      defEntity.trees.forEach(function (t) {
        var savedTree = savedEntity.trees && savedEntity.trees[t.id];
        if (!savedTree || !Array.isArray(savedTree.spent) || savedTree.spent.length !== t.skills.length) return;
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
      // storage unavailable / full - fail silently
    }
  }

  // ---------- Skill tree mutation ----------

  function findEntityDef(entityId) {
    if (entityId === TTA_DATA.crafting.id) return TTA_DATA.crafting;
    return TTA_DATA.characters.find(function (c) { return c.id === entityId; });
  }

  function findEntityState(entityId) {
    if (entityId === TTA_DATA.crafting.id) return state.crafting;
    return state.characters[entityId];
  }

  function addPoint(entityId, treeId) {
    var entityDef = findEntityDef(entityId);
    var treeDef = entityDef.trees.find(function (t) { return t.id === treeId; });
    var treeState = findEntityState(entityId).trees[treeId];

    if (isTreeMaxed(treeState.spent, treeDef)) return;

    var idx = treeState.currentIndex;
    if (treeState.spent[idx] >= treeDef.skills[idx].required || !isSkillAvailable(treeState.spent, treeDef, idx)) {
      idx = findFirstAvailableUnlockedIndex(treeState.spent, treeDef);
      if (idx === -1) return;
      treeState.currentIndex = idx;
    }

    treeState.spent[idx]++;
    treeState.history.push(idx);

    if (treeState.spent[idx] >= treeDef.skills[idx].required) {
      var next = findFirstAvailableUnlockedIndex(treeState.spent, treeDef);
      if (next !== -1) treeState.currentIndex = next;
    }

    save();
  }

  function undoPoint(entityId, treeId) {
    var treeState = findEntityState(entityId).trees[treeId];
    if (!treeState.history.length) return;
    var idx = treeState.history.pop();
    treeState.spent[idx] = Math.max(0, treeState.spent[idx] - 1);
    treeState.currentIndex = idx;
    save();
  }

  function selectSkill(entityId, treeId, index) {
    var entityDef = findEntityDef(entityId);
    var treeDef = entityDef.trees.find(function (t) { return t.id === treeId; });
    var treeState = findEntityState(entityId).trees[treeId];
    if (treeState.spent[index] >= treeDef.skills[index].required) return; // already unlocked
    if (!isSkillAvailable(treeState.spent, treeDef, index)) return; // row not open yet
    treeState.currentIndex = index;
    save();
  }

  function levelUp(entityId) {
    var entityDef = findEntityDef(entityId);
    var entityState = findEntityState(entityId);
    if (entityState.level >= MAX_LEVEL) return;
    var passiveTree = entityDef.trees.find(function (t) { return t.kind === "passive"; });
    entityState.level++;
    if (passiveTree) addPoint(entityId, passiveTree.id);
    save();
  }

  function levelDown(entityId) {
    var entityDef = findEntityDef(entityId);
    var entityState = findEntityState(entityId);
    if (entityState.level <= entityDef.startLevel) return;
    var passiveTree = entityDef.trees.find(function (t) { return t.kind === "passive"; });
    entityState.level--;
    if (passiveTree) undoPoint(entityId, passiveTree.id);
    save();
  }

  function adjustStat(entityId, statKey, delta) {
    var entityState = findEntityState(entityId);
    entityState.stats[statKey] = Math.max(0, (entityState.stats[statKey] || 0) + delta);
    save();
  }

  // ---------- Rendering: legend ----------

  function legendHtml() {
    return TIER_ORDER.map(function (t) {
      return '<span><span class="sk-dot tier-' + t + '"></span>' + TIER_LABEL[t] + '</span>';
    }).join("");
  }

  // ---------- Rendering: Skills tab ----------

  var charPickerEl = document.getElementById("charPicker");
  var charContentEl = document.getElementById("charContent");

  function hexToRgba(hex, alpha) {
    var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!m) return null;
    var r = parseInt(m[1], 16), g = parseInt(m[2], 16), b = parseInt(m[3], 16);
    return "rgba(" + r + "," + g + "," + b + "," + alpha + ")";
  }

  function styleChip(btn, entity, active) {
    btn.innerHTML = "";
    if (entity.color) {
      var dot = document.createElement("span");
      dot.className = "char-dot";
      dot.style.background = entity.color;
      btn.appendChild(dot);
      btn.style.borderColor = active ? entity.color : "";
      btn.style.color = active ? entity.color : "";
      btn.style.background = active ? hexToRgba(entity.color, 0.16) : "";
    }
    btn.appendChild(document.createTextNode(entity.name));
  }

  function renderCharPicker() {
    charPickerEl.innerHTML = "";
    var entries = TTA_DATA.characters.concat([TTA_DATA.crafting]);
    entries.forEach(function (entity) {
      var active = state.selectedCharId === entity.id;
      var btn = document.createElement("button");
      btn.className = "char-chip" + (active ? " active" : "");
      styleChip(btn, entity, active);
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

  function skillStateClass(spent, treeDef, i, treeState, maxed) {
    var unlocked = spent[i] >= treeDef.skills[i].required;
    if (unlocked) return "unlocked";
    if (!maxed && i === treeState.currentIndex) return "current";
    if (isSkillAvailable(spent, treeDef, i)) return "available";
    return "locked";
  }

  function buildSkillNode(entity, treeDef, treeState, i, maxed, onChange) {
    var spent = treeState.spent;
    var skill = treeDef.skills[i];
    var cls = skillStateClass(spent, treeDef, i, treeState, maxed);
    var node = document.createElement("div");
    node.className = "tree-node state-" + cls;
    node.title = TIER_LABEL[skill.tier] || "";
    node.innerHTML =
      '<span class="sk-dot tier-' + skill.tier + '"></span>' +
      '<span class="sk-name">' + skill.name + '</span>' +
      '<span class="sk-cost">' + spent[i] + '/' + skill.required + '</span>';
    if (cls === "available") {
      node.addEventListener("click", function () {
        selectSkill(entity.id, treeDef.id, i);
        onChange();
      });
    }
    return node;
  }

  function renderTreeCard(entity, entityState, treeDef) {
    var treeState = entityState.trees[treeDef.id];
    var maxed = isTreeMaxed(treeState.spent, treeDef);
    var curIdx = maxed ? treeDef.skills.length - 1 : treeState.currentIndex;
    var curSkill = treeDef.skills[curIdx];
    var curSpent = treeState.spent[curIdx];
    var curPct = Math.min(1, curSpent / (curSkill.required || 1));

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

    var treeRows = document.createElement("div");
    treeRows.className = "tree-rows";
    treeDef.rows.forEach(function (row) {
      var rowEl = document.createElement("div");
      rowEl.className = "tree-row";
      row.forEach(function (i) {
        rowEl.appendChild(buildSkillNode(entity, treeDef, treeState, i, maxed, renderCharContent));
      });
      treeRows.appendChild(rowEl);
    });
    card.appendChild(treeRows);

    return card;
  }

  function renderStats(entity, entityState) {
    var wrap = document.createElement("div");
    wrap.className = "stats-card card";
    var title = document.createElement("div");
    title.className = "stats-title";
    title.textContent = "Stats";
    wrap.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "stats-grid";
    STAT_KEYS.forEach(function (key) {
      var row = document.createElement("div");
      row.className = "stat-row";

      var minus = document.createElement("button");
      minus.className = "btn btn-secondary btn-round btn-small";
      minus.textContent = "-";
      minus.addEventListener("click", function () {
        adjustStat(entity.id, key, -1);
        renderCharContent();
      });

      var plus = document.createElement("button");
      plus.className = "btn btn-primary btn-round btn-small";
      plus.textContent = "+";
      plus.addEventListener("click", function () {
        adjustStat(entity.id, key, 1);
        renderCharContent();
      });

      var label = document.createElement("span");
      label.className = "stat-name";
      label.textContent = STAT_LABEL[key];

      var value = document.createElement("span");
      value.className = "stat-num";
      value.textContent = entityState.stats[key];

      row.appendChild(label);
      row.appendChild(minus);
      row.appendChild(value);
      row.appendChild(plus);
      grid.appendChild(row);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function renderCharContent() {
    var entity = findEntityDef(state.selectedCharId);
    var entityState = findEntityState(state.selectedCharId);
    charContentEl.innerHTML = "";

    var header = document.createElement("div");
    header.className = "char-header card";
    if (entity.color) {
      header.style.borderLeft = "4px solid " + entity.color;
    }
    var h2 = document.createElement("h2");
    h2.textContent = entity.name;
    if (entity.color) h2.style.color = entity.color;
    header.appendChild(h2);

    var isCharacter = entity.id !== TTA_DATA.crafting.id;

    if (isCharacter) {
      var lvlWrap = document.createElement("div");
      lvlWrap.className = "level-control";
      lvlWrap.innerHTML = '<span class="level-label">Level</span><span class="level-value">' + entityState.level + '</span>';

      var minusBtn = document.createElement("button");
      minusBtn.className = "btn btn-secondary btn-round";
      minusBtn.textContent = "-";
      minusBtn.disabled = entityState.level <= entity.startLevel;
      minusBtn.addEventListener("click", function () {
        levelDown(entity.id);
        renderCharContent();
      });

      var plusBtn = document.createElement("button");
      plusBtn.className = "btn btn-primary btn-round";
      plusBtn.textContent = "+";
      plusBtn.disabled = entityState.level >= MAX_LEVEL;
      plusBtn.addEventListener("click", function () {
        levelUp(entity.id);
        renderCharContent();
      });

      lvlWrap.insertBefore(minusBtn, lvlWrap.firstChild);
      lvlWrap.appendChild(plusBtn);
      header.appendChild(lvlWrap);
    }

    charContentEl.appendChild(header);

    if (isCharacter) {
      charContentEl.appendChild(renderStats(entity, entityState));
    }

    var legend = document.createElement("div");
    legend.className = "legend";
    legend.innerHTML = legendHtml();
    charContentEl.appendChild(legend);

    var grid = document.createElement("div");
    grid.className = "tree-grid";
    entity.trees.forEach(function (treeDef) {
      grid.appendChild(renderTreeCard(entity, entityState, treeDef));
    });
    charContentEl.appendChild(grid);
  }

  // ---------- Rendering: Party tab ----------

  var partyPickerEl = document.getElementById("partyPicker");
  var partyContentEl = document.getElementById("partyContent");

  function renderPartyPicker() {
    partyPickerEl.innerHTML = "";
    TTA_DATA.characters.forEach(function (c) {
      var selected = state.party.indexOf(c.id) !== -1;
      var btn = document.createElement("button");
      btn.className = "char-chip" + (selected ? " active" : "");
      styleChip(btn, c, selected);
      if (!selected && state.party.length >= 3) btn.disabled = true;
      btn.addEventListener("click", function () {
        if (selected) {
          state.party = state.party.filter(function (id) { return id !== c.id; });
        } else if (state.party.length < 3) {
          state.party.push(c.id);
        }
        save();
        renderPartyPicker();
        renderPartyContent();
      });
      partyPickerEl.appendChild(btn);
    });
  }

  function renderPartyContent() {
    partyContentEl.innerHTML = "";
    if (!state.party.length) {
      var empty = document.createElement("p");
      empty.className = "empty-msg";
      empty.textContent = "No party members selected yet.";
      partyContentEl.appendChild(empty);
      return;
    }

    var orderedIds = TTA_DATA.characters
      .map(function (c) { return c.id; })
      .filter(function (id) { return state.party.indexOf(id) !== -1; });

    var grid = document.createElement("div");
    grid.className = "party-grid";

    orderedIds.forEach(function (id) {
      var entity = findEntityDef(id);
      var entityState = findEntityState(id);
      var card = document.createElement("div");
      card.className = "card party-card";
      if (entity.color) card.style.borderLeft = "4px solid " + entity.color;

      var h3 = document.createElement("h3");
      h3.textContent = entity.name + " (Lv " + entityState.level + ")";
      if (entity.color) h3.style.color = entity.color;
      card.appendChild(h3);

      entity.trees.filter(function (t) { return t.kind === "active"; }).forEach(function (treeDef) {
        var treeState = entityState.trees[treeDef.id];
        var maxed = isTreeMaxed(treeState.spent, treeDef);
        var curIdx = maxed ? treeDef.skills.length - 1 : treeState.currentIndex;
        var curSkill = treeDef.skills[curIdx];
        var curSpent = treeState.spent[curIdx];
        var curPct = Math.min(1, curSpent / (curSkill.required || 1));

        var box = document.createElement("div");
        box.className = "party-skill-box";
        box.innerHTML =
          '<div class="party-skill-top">' +
            '<span class="party-tree-name">' + treeDef.name + '</span>' +
            '<span class="cs-progress-text">' + curSpent + '/' + curSkill.required + '</span>' +
          '</div>' +
          '<div class="cs-name">' + (maxed ? "Maxed &mdash; " + curSkill.name : curSkill.name) + '</div>' +
          '<div class="progress-bar"><div class="progress-bar-fill" style="width:' + pct(curPct) + '"></div></div>';

        var actions = document.createElement("div");
        actions.className = "cs-actions";
        var useBtn = document.createElement("button");
        useBtn.className = "btn btn-primary";
        useBtn.textContent = "+1";
        useBtn.disabled = maxed;
        useBtn.addEventListener("click", function () {
          addPoint(id, treeDef.id);
          renderPartyContent();
        });
        var undoBtn = document.createElement("button");
        undoBtn.className = "btn btn-secondary";
        undoBtn.textContent = "Undo";
        undoBtn.disabled = treeState.history.length === 0;
        undoBtn.addEventListener("click", function () {
          undoPoint(id, treeDef.id);
          renderPartyContent();
        });
        actions.appendChild(useBtn);
        actions.appendChild(undoBtn);
        box.appendChild(actions);

        card.appendChild(box);
      });

      grid.appendChild(card);
    });

    partyContentEl.appendChild(grid);
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
        row.innerHTML = '<span class="hit-num">#' + num + '</span><span class="hit-dmg">' + hit.dmg + '</span>';
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
  var views = {
    skills: document.getElementById("skillsView"),
    party: document.getElementById("partyView"),
    boss: document.getElementById("bossView")
  };

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
  renderPartyPicker();
  renderPartyContent();
  renderBoss();
})();
