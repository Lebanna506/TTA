# Third Age Tracker

A local-only skill and boss-fight tracker for *The Third Age*, covering the
6 playable characters (Berethor, Idrial, Elegost, Hadhod, Morwen, Eoden)
plus the shared Crafting trees.

All progress is saved in the browser's local storage on whichever device
you're using — nothing syncs between devices, and nothing leaves the device.

## Run it on PC (Windows)

```
git clone https://github.com/Lebanna506/TTA.git
```

Then double-click `run.bat` inside the cloned folder (or run it from a
terminal). It will pull the latest changes, install dependencies, and start
a local server at http://localhost:8080, opening it in your browser.

Requires [Node.js](https://nodejs.org) (for `npm`) and `git` on your PATH.

## Run it on iPad

The app is a plain static site with no backend, so the simplest option is
to open `index.html` directly in Safari (e.g. via the Files app, or by
hosting the folder somewhere you can browse to). Progress you make on the
iPad stays on the iPad.

## Hero tab

- Pick a character (or Crafting) at the top.
- Each character has 2 active skill trees and 1 passive tree; Crafting has
  3 active trees, shared by everyone.
- Skills are laid out as a tree of rows (1 or 2 skills per row). A row
  unlocks once at least one skill in the row above it is fully learned. A
  row with a single "capstone" skill at the very end of a tree needs every
  other skill in that tree learned first.
- Tap **Use Skill (+1)** on an active tree each time that character uses a
  skill from that tree in-game — the point goes to whichever skill is
  currently "in progress". Once it's fully unlocked, progress automatically
  moves to the next available locked skill.
- Tap any highlighted (available) skill in the tree to redirect future
  points to it instead.
- Passive skills gain a point automatically whenever you tap **+** on the
  character's Level counter. Characters that don't start at level 1 (per
  the game's own starting kits) begin with the matching passive skills
  already progressed.
- **Undo** reverses the most recent point spent in that tree (for the rare
  case a character dies and skill points roll back). It only undoes points
  spent during play — a character's starting kit isn't affected.
- Skill names are colour-coded to match the in-game speed tiers: white/grey
  = normal, green = fast, and three shades of red = slow, very slow, and
  extremely slow.
- The **Stats** row (Strength, Spirit, Constitution, Speed, Dexterity, plus
  derived Armor and Weapon Damage) sits directly under the character header,
  above the skill trees, all in one scrollable row. The 5 base stats come
  straight from the character's level-progression table (levels 1-99). Tap
  any tile to expand a breakdown of exactly what's contributing to it (base
  value, level-up bonus, then each piece of gear).
- Levelling up grants **Level-up Points** — 2 per level, +1 more on a level
  divisible by 5, and +1 more (or +2 past level 50) on a level divisible by
  10 (so 1→99 earns 231 total; characters who start above level 1 begin
  with a fixed banked amount instead, by design usually less than they'd
  have earned levelling there normally). Unspent points carry over if you
  level up multiple times without spending them — the running total shows
  next to the Stats heading. Spend them with the **-**/**+** buttons right
  on each stat tile; each allocation shows as its own line in that stat's
  breakdown.
- The 3 skill trees sit in their own row under Stats, followed by
  **Equipment** — one card per slot the character actually has (not every
  character has every slot — e.g. only Berethor and Eaoden carry a Shield),
  laid out in columns of 3 (a partial final row is centered). Each character
  starts with their canonical starting kit already equipped, and equipping
  an item feeds its bonuses straight into the Stats row above.
- **Elfstones** get their own section below Equipment: a single row of 4
  slots, drawn from one shared list of elfstone types. The same elfstone
  can be equipped on multiple characters (or multiple times on one) —
  duplicates are allowed, so keep track of what you actually own yourself.

## Party tab

Pick up to 3 characters (in the game's default order) to pull into a combat
view showing just their 2 active skills, each with a big **+1** button, for
quick logging mid-fight without digging through the full Hero tab.

## Boss Fight tab

- Set the boss's total health.
- Log each hit as you land it; HP left, % left, average hit, and estimated
  hits remaining update automatically.
- **Undo Last Hit** or the ✕ on any row removes a hit; **New Boss** clears
  the log to start fresh.

This is a fresh-playthrough starting point — all skill points start at 0.

## Backing up your save

**Export Save** / **Import Save** in the top-right of the header let you
download your entire save (every character's skills, stats, equipment, and
the boss fight log) as a single JSON file, and load it back in later.
Useful as a manual backup, or for moving your progress to a different
browser or device — importing asks for confirmation since it replaces
whatever is currently saved.
