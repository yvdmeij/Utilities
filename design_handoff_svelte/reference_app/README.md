# Utilities App — UI kit

A high-fidelity recreation of **Quietkit**, the Quiet Utility utilities web app: a calm, local-only
toolbox. Static (no backend), so every tool runs in the browser.

## Run
Open `index.html`. It loads React 18 + Babel (in-browser) and Lucide icons from CDN, plus the
shared tokens at `../../colors_and_type.css` via `app.css`.

## Structure
- `app.css` — layout + all component styles (imports the root tokens).
- `ui.jsx` — primitives: `Icon` (Lucide wrapper), `Button`, `Segmented`, `ToastHost`, `copy()`.
- `Sidebar.jsx` / `TopBar.jsx` — app shell chrome.
- `Home.jsx` — searchable tool grid + tiles.
- Tools: `UnitConverter.jsx`, `Timer.jsx`, `ColorTool.jsx`, `WordCounter.jsx`,
  `CaseConverter.jsx`, `Base64Tool.jsx`.
- `app.jsx` — tool registry (`TOOLS`) + view routing; mounts `<App>`.

Each `.jsx` exports its components to `window` (Babel scripts don't share scope).

## What it demonstrates
The full component vocabulary in real use: sidebar nav, search bar, tool tiles, panels, fields
(text / unit-suffixed / textarea), segmented controls, the circular timer dial, color swatches &
code rows, stat blocks, primary/secondary/ghost buttons, and toast notifications — all on the warm
Quiet Utility palette with monospace readouts.

## Interactions (all functional)
- **Search** filters tools live; clicking a tile or sidebar item opens it.
- **Unit converter** — real conversions across Length / Weight / Volume / Data, with swap + copy.
- **Timer** — working countdown with presets and an animated progress dial.
- **Color picker** — native picker + hex input + brand swatches; live HEX/RGB/HSL with copy.
- **Word counter** — live word/character/sentence counts + read-time estimate.
- **Case converter** & **Base64** — live text transforms with copy.

These are cosmetic-fidelity recreations meant for composing mocks, not production code.
