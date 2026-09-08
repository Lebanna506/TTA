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
  var STAT_SHORT = {
    strength: "STR",
    spirit: "SPT",
    constitution: "CON",
    speed: "SPD",
    dexterity: "DEX"
  };

  // Attribute points earned per level-up: 2 base, +1 more on a level
  // divisible by 5, +1 more (or +2 past level 50) on a level divisible by
  // 10. Level 99 counts as level 100 for these checks.
  function pointsForLevel(level) {
    var L = level === 99 ? 100 : level;
    var pts = 2;
    if (L % 5 === 0) pts += 1;
    if (L % 10 === 0) pts += L <= 50 ? 1 : 2;
    return pts;
  }

  // Characters starting above level 1 get a fixed banked amount instead of
  // the full sum they'd have earned levelling there normally (by design).
  var STARTING_BONUS_POINTS = {
    elegost: 9,
    hadhod: 6,
    morwen: 15,
    eaoden: 58
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

  var ELFSTONE_MAX = 4;

  function getBaseStats(charId, level) {
    var lv = TTA_LEVELS[charId];
    if (!lv) return { strength: 0, spirit: 0, constitution: 0, speed: 0, dexterity: 0 };
    var idx = Math.min(lv.byLevel.length - 1, Math.max(0, level - lv.startLevel));
    return lv.byLevel[idx];
  }

  function freshEntityState(entityDef) {
    var trees = {};
    var level = entityDef.startLevel || 1;
    entityDef.trees.forEach(function (t) {
      var simPoints = t.kind === "passive" ? Math.max(0, level - 1) : 0;
      trees[t.id] = freshTreeState(t, simPoints);
    });
    var equipment = {};
    getEquipmentSlots(entityDef.id).forEach(function (slot) {
      equipment[slot.slotId] = slot.maxCount ? new Array(slot.maxCount).fill(null) : null;
    });
    var starting = TTA_EQUIPMENT.startingEquipment && TTA_EQUIPMENT.startingEquipment[entityDef.id];
    if (starting) {
      Object.keys(starting).forEach(function (slotId) {
        if (equipment.hasOwnProperty(slotId) && !Array.isArray(equipment[slotId])) {
          equipment[slotId] = starting[slotId];
        }
      });
    }
    var allocated = {};
    STAT_KEYS.forEach(function (k) { allocated[k] = 0; });
    var levelBonus = { unspent: STARTING_BONUS_POINTS[entityDef.id] || 0, allocated: allocated };
    return { level: level, trees: trees, equipment: equipment, levelBonus: levelBonus };
  }

  // ---------- Equipment ----------

  function getEquipmentSlots(charId) {
    var slots = (TTA_EQUIPMENT.equipment[charId] || []).slice();
    if (slots.length) {
      slots.push({ slotId: "elfstone", label: "Elfstone", items: TTA_EQUIPMENT.elfstones, maxCount: ELFSTONE_MAX });
    }
    return slots;
  }

  function getEquippedItem(entityState, charId, slotId) {
    var slot = getEquipmentSlots(charId).find(function (s) { return s.slotId === slotId; });
    if (!slot) return null;
    var idx = entityState.equipment ? entityState.equipment[slotId] : null;
    if (idx === null || idx === undefined || !slot.items[idx]) return null;
    return slot.items[idx];
  }

  function getEquippedElfstones(entityState) {
    var arr = (entityState.equipment && entityState.equipment.elfstone) || [];
    return arr.map(function (idx) {
      return (idx === null || idx === undefined) ? null : TTA_EQUIPMENT.elfstones[idx];
    });
  }

  function equipItem(charId, slotId, itemIndex) {
    var entityState = findEntityState(charId);
    if (!entityState.equipment) entityState.equipment = {};
    entityState.equipment[slotId] = itemIndex === null ? null : itemIndex;
    save();
  }

  // Elfstones can be duplicated (the player owns multiple copies), so no
  // uniqueness is enforced across or within characters - just set the slot.
  function equipElfstone(charId, slotIndex, itemIndex) {
    var entityState = findEntityState(charId);
    if (!entityState.equipment.elfstone) entityState.equipment.elfstone = new Array(ELFSTONE_MAX).fill(null);
    entityState.equipment.elfstone[slotIndex] = itemIndex === null ? null : itemIndex;
    save();
    return true;
  }

  function computeStatBreakdown(charId, entityState, statKey) {
    var base = getBaseStats(charId, entityState.level)[statKey] || 0;
    var sources = [{ label: "Base (Lv " + entityState.level + ")", value: base }];
    var total = base;
    var bonus = entityState.levelBonus.allocated[statKey];
    if (bonus) {
      sources.push({ label: "Level-up", value: bonus });
      total += bonus;
    }
    getEquipmentSlots(charId).forEach(function (slot) {
      if (slot.maxCount) {
        getEquippedElfstones(entityState).forEach(function (item, i) {
          if (item && item[statKey]) {
            sources.push({ label: slot.label + " " + (i + 1), value: item[statKey] });
            total += item[statKey];
          }
        });
        return;
      }
      var item = getEquippedItem(entityState, charId, slot.slotId);
      if (item && item[statKey]) {
        sources.push({ label: slot.label, value: item[statKey] });
        total += item[statKey];
      }
    });
    return { total: total, sources: sources };
  }

  function computeArmorBreakdown(charId, entityState) {
    var sources = [{ label: "Base", value: 0 }];
    var total = 0;
    getEquipmentSlots(charId).forEach(function (slot) {
      if (slot.maxCount) {
        getEquippedElfstones(entityState).forEach(function (item, i) {
          if (item && item.armor) {
            sources.push({ label: slot.label + " " + (i + 1), value: item.armor });
            total += item.armor;
          }
        });
        return;
      }
      var item = getEquippedItem(entityState, charId, slot.slotId);
      if (item && item.armor) {
        sources.push({ label: slot.label, value: item.armor });
        total += item.armor;
      }
    });
    return { total: total, sources: sources };
  }

  function computeWeaponDamage(charId, entityState) {
    var weaponSlot = getEquipmentSlots(charId).find(function (s) { return s.slotId === "weapon"; });
    if (!weaponSlot) return null;
    var item = getEquippedItem(entityState, charId, "weapon");
    if (!item) return { total: 0, sources: [{ label: "No weapon equipped", value: 0 }] };
    var perLevel = item.damagePerLevel * entityState.level;
    var sources = [
      { label: "Weapon Base", value: item.baseDamage },
      { label: "Per Level (×" + entityState.level + ")", value: perLevel }
    ];
    return { total: item.baseDamage + perLevel, sources: sources };
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
      if (savedEntity.levelBonus) {
        if (typeof savedEntity.levelBonus.unspent === "number") fe.levelBonus.unspent = Math.max(0, savedEntity.levelBonus.unspent);
        if (savedEntity.levelBonus.allocated) {
          STAT_KEYS.forEach(function (k) {
            if (typeof savedEntity.levelBonus.allocated[k] === "number") fe.levelBonus.allocated[k] = Math.max(0, savedEntity.levelBonus.allocated[k]);
          });
        }
      }
      if (savedEntity.equipment) {
        getEquipmentSlots(defEntity.id).forEach(function (slot) {
          var saved = savedEntity.equipment[slot.slotId];
          if (slot.maxCount) {
            if (!Array.isArray(saved)) return;
            for (var i = 0; i < fe.equipment[slot.slotId].length; i++) {
              var idx = saved[i];
              if (typeof idx === "number" && slot.items[idx]) fe.equipment[slot.slotId][i] = idx;
            }
          } else if (typeof saved === "number" && slot.items[saved]) {
            fe.equipment[slot.slotId] = saved;
          }
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
    entityState.levelBonus.unspent += pointsForLevel(entityState.level);
    if (passiveTree) addPoint(entityId, passiveTree.id);
    save();
  }

  function levelDown(entityId) {
    var entityDef = findEntityDef(entityId);
    var entityState = findEntityState(entityId);
    if (entityState.level <= entityDef.startLevel) return;
    var passiveTree = entityDef.trees.find(function (t) { return t.kind === "passive"; });
    entityState.levelBonus.unspent = Math.max(0, entityState.levelBonus.unspent - pointsForLevel(entityState.level));
    entityState.level--;
    if (passiveTree) undoPoint(entityId, passiveTree.id);
    save();
  }

  function allocateStatPoint(entityId, statKey, delta) {
    var entityState = findEntityState(entityId);
    var lb = entityState.levelBonus;
    if (delta > 0) {
      if (lb.unspent <= 0) return;
      lb.unspent--;
      lb.allocated[statKey]++;
    } else {
      if (lb.allocated[statKey] <= 0) return;
      lb.allocated[statKey]--;
      lb.unspent++;
    }
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

  // Tints a card with the character's colour: a strong border and a light
  // fill, so every box on a character's page reads as unmistakably theirs.
  function applyCharColor(el, color) {
    if (!color) return;
    el.style.border = "2px solid " + color;
    el.style.background = hexToRgba(color, 0.1);
  }

  function styleChip(btn, entity, active, label) {
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
    btn.appendChild(document.createTextNode(label || entity.name));
  }

  // Tap: select this hero, or level them up if they're already selected.
  // Long-press: level them down. Long-press suppresses the click that follows it.
  var LONG_PRESS_MS = 550;
  function attachTapAndHold(el, onTap, onHold) {
    var timer = null;
    var held = false;
    function start() {
      held = false;
      timer = setTimeout(function () {
        held = true;
        onHold();
      }, LONG_PRESS_MS);
    }
    function cancel() {
      if (timer) { clearTimeout(timer); timer = null; }
    }
    el.addEventListener("pointerdown", start);
    el.addEventListener("pointerup", cancel);
    el.addEventListener("pointerleave", cancel);
    el.addEventListener("pointercancel", cancel);
    el.addEventListener("contextmenu", function (e) { e.preventDefault(); });
    el.addEventListener("click", function (e) {
      if (held) {
        held = false;
        e.preventDefault();
        return;
      }
      onTap();
    });
  }

  function renderCharPicker() {
    charPickerEl.innerHTML = "";
    var entries = TTA_DATA.characters.concat([TTA_DATA.crafting]);
    entries.forEach(function (entity) {
      var active = state.selectedCharId === entity.id;
      var isCharacter = entity.id !== TTA_DATA.crafting.id;
      var btn = document.createElement("button");
      btn.className = "char-chip" + (active ? " active" : "");
      var label = isCharacter ? entity.name + " - " + findEntityState(entity.id).level : entity.name;
      styleChip(btn, entity, active, label);

      attachTapAndHold(btn, function () {
        if (active && isCharacter) {
          levelUp(entity.id);
        } else {
          state.selectedCharId = entity.id;
          save();
        }
        renderCharPicker();
        renderCharContent();
      }, function () {
        if (!isCharacter) return;
        state.selectedCharId = entity.id;
        levelDown(entity.id);
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
    applyCharColor(card, entity.color);

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
        '<span class="cs-progress-text">' + curSpent + ' / ' + curSkill.required + ' (' + pct(curPct) + ')</span>' +
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

  // Keeps breakdown panels open across re-renders triggered by other actions.
  var openBreakdowns = {};

  function buildBreakdownRow(label, opts) {
    opts = opts || {};
    var row = document.createElement("div");
    row.className = "stat-row";

    if (opts.onMinus) {
      var minus = document.createElement("button");
      minus.className = "btn btn-secondary btn-round";
      minus.textContent = "-";
      minus.disabled = !!opts.minusDisabled;
      minus.addEventListener("click", opts.onMinus);
      row.appendChild(minus);
    }

    var main = document.createElement("button");
    main.className = "stat-toggle";
    main.type = "button";

    var nameEl = document.createElement("span");
    nameEl.className = "stat-name";
    nameEl.textContent = label;

    var valueEl = document.createElement("span");
    valueEl.className = "stat-num";
    valueEl.textContent = opts.total;

    main.appendChild(nameEl);
    main.appendChild(valueEl);
    row.appendChild(main);

    if (opts.onPlus) {
      var plus = document.createElement("button");
      plus.className = "btn btn-primary btn-round";
      plus.textContent = "+";
      plus.disabled = !!opts.plusDisabled;
      plus.addEventListener("click", opts.onPlus);
      row.appendChild(plus);
    }

    var wrap = document.createElement("div");
    wrap.className = "stat-block";
    wrap.appendChild(row);

    var open = !!openBreakdowns[opts.key];
    var panel = document.createElement("div");
    panel.className = "stat-breakdown";
    panel.hidden = !open;
    opts.sources.forEach(function (s) {
      var line = document.createElement("div");
      line.className = "sb-line";
      var sign = s.value > 0 ? "+" : "";
      line.innerHTML = '<span class="sb-label">' + s.label + '</span><span class="sb-value">' + sign + s.value + '</span>';
      panel.appendChild(line);
    });
    wrap.appendChild(panel);

    main.addEventListener("click", function () {
      openBreakdowns[opts.key] = !openBreakdowns[opts.key];
      panel.hidden = !openBreakdowns[opts.key];
    });

    return wrap;
  }

  function renderStats(entity, entityState) {
    var lb = entityState.levelBonus;
    var wrap = document.createElement("div");
    wrap.className = "stats-card card";
    applyCharColor(wrap, entity.color);
    var title = document.createElement("div");
    title.className = "stats-title";
    title.innerHTML = 'Stats <span class="levelup-points">Level-up Points: <strong>' + lb.unspent + '</strong></span>';
    wrap.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "stats-grid";

    STAT_KEYS.forEach(function (key) {
      var b = computeStatBreakdown(entity.id, entityState, key);
      grid.appendChild(buildBreakdownRow(STAT_SHORT[key], {
        key: entity.id + ":" + key,
        total: b.total,
        sources: b.sources,
        minusDisabled: lb.allocated[key] <= 0,
        onMinus: function () { allocateStatPoint(entity.id, key, -1); renderCharContent(); },
        plusDisabled: lb.unspent <= 0,
        onPlus: function () { allocateStatPoint(entity.id, key, 1); renderCharContent(); }
      }));
    });

    var armor = computeArmorBreakdown(entity.id, entityState);
    grid.appendChild(buildBreakdownRow("Armor", {
      key: entity.id + ":armor",
      total: armor.total,
      sources: armor.sources
    }));

    var weaponDmg = computeWeaponDamage(entity.id, entityState);
    if (weaponDmg) {
      grid.appendChild(buildBreakdownRow("Weapon Damage", {
        key: entity.id + ":weapondmg",
        total: weaponDmg.total,
        sources: weaponDmg.sources
      }));
    }

    wrap.appendChild(grid);
    return wrap;
  }

  function buildEquipCell(label, items, currentIdx, onChange) {
    var cell = document.createElement("div");
    cell.className = "equip-cell";

    var labelEl = document.createElement("label");
    labelEl.className = "equip-label";
    labelEl.textContent = label;
    cell.appendChild(labelEl);

    var select = document.createElement("select");
    select.className = "equip-select";
    var noneOpt = document.createElement("option");
    noneOpt.value = "";
    noneOpt.textContent = "— None —";
    select.appendChild(noneOpt);

    items.forEach(function (item, i) {
      var opt = document.createElement("option");
      opt.value = i;
      opt.textContent = item.name;
      select.appendChild(opt);
    });

    select.value = (currentIdx === null || currentIdx === undefined) ? "" : currentIdx;
    select.addEventListener("change", function () {
      var v = select.value === "" ? null : Number(select.value);
      var applied = onChange(v);
      if (applied === false) {
        select.value = (currentIdx === null || currentIdx === undefined) ? "" : currentIdx;
      } else {
        renderCharContent();
      }
    });
    cell.appendChild(select);

    var equippedItem = (currentIdx === null || currentIdx === undefined) ? null : items[currentIdx];
    var summary = document.createElement("div");
    summary.className = "equip-summary";
    summary.textContent = equippedItem ? summarizeItem(equippedItem) : "";
    cell.appendChild(summary);

    return cell;
  }

  function renderEquipment(entity, entityState) {
    var slots = getEquipmentSlots(entity.id).filter(function (s) { return !s.maxCount; });
    if (!slots.length) return null;

    var wrap = document.createElement("div");
    wrap.className = "equip-card card";
    applyCharColor(wrap, entity.color);
    var title = document.createElement("div");
    title.className = "stats-title";
    title.textContent = "Equipment";
    wrap.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "equip-grid";

    slots.forEach(function (slot) {
      var currentIdx = entityState.equipment ? entityState.equipment[slot.slotId] : null;
      grid.appendChild(buildEquipCell(slot.label, slot.items, currentIdx, function (v) {
        equipItem(entity.id, slot.slotId, v);
        return true;
      }));
    });

    wrap.appendChild(grid);
    return wrap;
  }

  function renderElfstones(entity, entityState) {
    var slot = getEquipmentSlots(entity.id).find(function (s) { return s.maxCount; });
    if (!slot) return null;

    var wrap = document.createElement("div");
    wrap.className = "equip-card card";
    applyCharColor(wrap, entity.color);
    var title = document.createElement("div");
    title.className = "stats-title";
    title.textContent = "Elfstones";
    wrap.appendChild(title);

    var grid = document.createElement("div");
    grid.className = "elfstone-grid";
    var equippedStones = entityState.equipment.elfstone || [];
    for (var i = 0; i < slot.maxCount; i++) {
      (function (slotIndex) {
        grid.appendChild(buildEquipCell(slot.label + " " + (slotIndex + 1), slot.items, equippedStones[slotIndex], function (v) {
          return equipElfstone(entity.id, slotIndex, v);
        }));
      })(i);
    }

    wrap.appendChild(grid);
    return wrap;
  }

  function summarizeItem(item) {
    var parts = [];
    if (item.armor) parts.push("Armor " + item.armor);
    if (typeof item.baseDamage === "number") {
      parts.push("Dmg " + item.baseDamage + (item.damagePerLevel ? " (+" + item.damagePerLevel + "/lvl)" : ""));
    }
    STAT_KEYS.forEach(function (k) {
      if (item[k]) parts.push(STAT_LABEL[k] + " " + (item[k] > 0 ? "+" : "") + item[k]);
    });
    return parts.join(", ");
  }

  function renderCharContent() {
    var entity = findEntityDef(state.selectedCharId);
    var entityState = findEntityState(state.selectedCharId);
    charContentEl.innerHTML = "";

    var isCharacter = entity.id !== TTA_DATA.crafting.id;

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

    if (isCharacter) {
      var equipCard = renderEquipment(entity, entityState);
      if (equipCard) charContentEl.appendChild(equipCard);
      var elfstoneCard = renderElfstones(entity, entityState);
      if (elfstoneCard) charContentEl.appendChild(elfstoneCard);
    }
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
      applyCharColor(card, entity.color);

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
            '<span class="cs-progress-text">' + curSpent + '/' + curSkill.required + ' (' + pct(curPct) + ')</span>' +
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

      var availableBox = document.createElement("div");
      availableBox.className = "party-skill-box party-available-box";
      var availTitle = document.createElement("div");
      availTitle.className = "party-tree-name";
      availTitle.textContent = "Available Skills";
      availableBox.appendChild(availTitle);

      var branchesWrap = document.createElement("div");
      branchesWrap.className = "party-available-branches";

      entity.trees.filter(function (t) { return t.kind === "active"; }).forEach(function (treeDef) {
        var treeState = entityState.trees[treeDef.id];
        var unlockedSkills = treeDef.skills.filter(function (skill, i) {
          return treeState.spent[i] >= skill.required;
        });

        var branch = document.createElement("div");
        branch.className = "party-available-branch";

        var branchTitle = document.createElement("div");
        branchTitle.className = "party-available-branch-title";
        branchTitle.textContent = treeDef.name;
        branch.appendChild(branchTitle);

        if (unlockedSkills.length) {
          var availList = document.createElement("div");
          availList.className = "party-available-list";
          unlockedSkills.forEach(function (skill) {
            var item = document.createElement("span");
            item.className = "party-available-skill";
            item.title = TIER_LABEL[skill.tier] || "";
            item.innerHTML = '<span class="sk-dot tier-' + skill.tier + '"></span><span class="sk-name">' + skill.name + '</span>';
            availList.appendChild(item);
          });
          branch.appendChild(availList);
        } else {
          var noneMsg = document.createElement("div");
          noneMsg.className = "cs-progress-text";
          noneMsg.textContent = "None yet.";
          branch.appendChild(noneMsg);
        }

        branchesWrap.appendChild(branch);
      });

      availableBox.appendChild(branchesWrap);
      card.appendChild(availableBox);

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

  // Each tab's DOM is only rebuilt on demand (by its own actions), so a tab
  // can go stale if another tab changed shared state (e.g. spending a skill
  // point from Party). Refresh the tab being switched into every time.
  var tabRefresh = {
    skills: renderCharContent,
    party: renderPartyContent,
    boss: renderBoss
  };

  tabBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      tabBtns.forEach(function (b) { b.classList.remove("active"); });
      btn.classList.add("active");
      Object.keys(views).forEach(function (k) { views[k].classList.remove("active"); });
      views[btn.dataset.tab].classList.add("active");
      tabRefresh[btn.dataset.tab]();
    });
  });

  // ---------- Save export / import ----------

  var exportSaveBtn = document.getElementById("exportSaveBtn");
  var importSaveBtn = document.getElementById("importSaveBtn");
  var importSaveInput = document.getElementById("importSaveInput");

  function exportSave() {
    var blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = "third-age-tracker-save-" + stamp + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function refreshAllTabs() {
    renderCharPicker();
    renderCharContent();
    renderPartyPicker();
    renderPartyContent();
    renderBoss();
  }

  function importSaveFile(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var parsed;
      try {
        parsed = JSON.parse(reader.result);
      } catch (e) {
        alert("That file isn't valid save data.");
        return;
      }
      if (!confirm("Import this save? This replaces all current progress in this browser.")) return;
      state = reconcileState(parsed);
      save();
      refreshAllTabs();
    };
    reader.onerror = function () {
      alert("Couldn't read that file.");
    };
    reader.readAsText(file);
  }

  exportSaveBtn.addEventListener("click", exportSave);
  importSaveBtn.addEventListener("click", function () { importSaveInput.click(); });
  importSaveInput.addEventListener("change", function () {
    var file = importSaveInput.files[0];
    if (file) importSaveFile(file);
    importSaveInput.value = "";
  });

  // ---------- Sticky header height ----------
  // The char/party pickers pin themselves just below the app header, whose
  // height varies (the header-top row wraps on narrow screens), so measure
  // it and keep a CSS var in sync rather than guessing a fixed offset.

  var appHeaderEl = document.querySelector(".app-header");
  function syncHeaderHeight() {
    document.documentElement.style.setProperty("--header-h", appHeaderEl.offsetHeight + "px");
  }
  window.addEventListener("resize", syncHeaderHeight);

  // ---------- Init ----------

  renderCharPicker();
  renderCharContent();
  renderPartyPicker();
  renderPartyContent();
  renderBoss();
  syncHeaderHeight();
})();
