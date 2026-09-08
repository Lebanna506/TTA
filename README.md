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

## Skills tab

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
- Each character has 5 base stats (Strength, Spirit, Constitution, Speed,
  Dexterity) shown with their starting values — adjust with the **-** / **+**
  buttons as they change in-game.
- **Undo** reverses the most recent point spent in that tree (for the rare
  case a character dies and skill points roll back). It only undoes points
  spent during play — a character's starting kit isn't affected.
- Skill names are colour-coded to match the in-game speed tiers: white/grey
  = normal, green = fast, and three shades of red = slow, very slow, and
  extremely slow.

## Party tab

Pick up to 3 characters (in the game's default order) to pull into a combat
view showing just their 2 active skills, each with a big **+1** button, for
quick logging mid-fight without digging through the full Skills tab.

## Boss Fight tab

- Set the boss's total health.
- Log each hit as you land it; HP left, % left, average hit, and estimated
  hits remaining update automatically.
- **Undo Last Hit** or the ✕ on any row removes a hit; **New Boss** clears
  the log to start fresh.

This is a fresh-playthrough starting point — all skill points start at 0.
