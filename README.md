# Instant Pick Block

Workshop: [Instant Pick Block](https://steamcommunity.com/sharedfiles/filedetails/?id=3789565734).

Replaces vanilla **Picker** (default **middle click**) with Minecraft-style pick block.
Vanilla pick logic runs unchanged.
The mod only skips the hold-and-click step.

## Controls

- **Picker** (default **middle click**) — pick the structure under the cursor once.
  No extra click.

Vanilla flow was: hold **Picker**, left click, then release.

If the vanilla Picker binding is missing, the mod registers **Instant pick block** (default **F**).

## Options

- **Mod enabled** — turn off to restore vanilla Picker (hold to pick) immediately.

Rebind under **Options → Controls → Pick Block**.

## Notes

- Requires **Sandustry 0.5.6** or newer.
- Pick rules, filters, colors, data copy, grabber block, and toasts are vanilla.
- Pressing the binding over empty ground does not start placing.
- The shortcut helper may still say to hold **Picker**.
  The binding now picks on press when the mod is enabled.
- This version does not patch `js/bundle.js`.

## Workshop

`npm run publish` uploads from `build/` with [`workshop.json`](workshop/workshop.json) and **preview.png** (or **preview.gif**).
It uses a dedicated [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD) cache.
[`workshop.md`](workshop/workshop.md) supplies the Steam description.
`README.md`, `CHANGELOG.md`, and [`screenshots/`](workshop/screenshots/) stay in the repo.
Change notes for Steam come from `CHANGELOG.md` at upload time.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).
