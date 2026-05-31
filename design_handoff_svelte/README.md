# Handoff: Quiet Utility design system → Svelte app

## Overview
This package contains the **Quiet Utility** design system and asks you to implement it in an
existing **Svelte + Vite** app (currently the barebones `npm create vite@latest -- --template svelte`
starter). The product is a calm, minimal, **local-only utilities web app** ("Quietkit") — a static
site (no backend) destined for **GitHub Pages**. Build everything client-side.

## About the design files
The files in `reference_app/` are a **design reference built in HTML + React (Babel)** — a working
prototype that shows the intended look, layout, and behavior. **Do not copy the React code.**
Recreate these screens as idiomatic **Svelte components** using the design tokens provided. The
React files are only there so you can read exact markup, class names, spacing, and interaction logic.

`tokens.css` is the one file you **use directly** — it is plain CSS custom properties and works in
Svelte unchanged.

## Fidelity
**High-fidelity.** Colors, type, spacing, radii, shadows, and interactions are final. Match them
precisely. The hex values and rules below are authoritative.

---

## The 4 design rules that matter most
These were iterated heavily — honor them everywhere:

1. **No borders. Ever.** No element may have a border line in a color different from its own fill.
   Define separation with **soft shadows** or **subtle fills** only.
   - ⚠️ **Critical gotcha:** native `<button>`, `<input>`, `<select>`, `<textarea>` ship with a
     default browser border. Add this global reset once:
     ```css
     button, input, select, textarea { border: none; font-family: inherit; }
     ```
     Forgetting this is what produced stray "dark borderlines" during design — don't skip it.
2. **Light & airy.** The palette is very light. Text uses pale warm-taupe ink
   (`--ink: #9A8B74`); surfaces are white/feather-white on a warm porcelain canvas. Keep it soft.
3. **Subtle shadows.** Shadows are whisper-soft and warm-tinted (see `--shadow-xs/sm/md/lg`).
   Resting elements use `xs`/`sm`; never heavy.
4. **Borderless buttons.** Buttons have **no fill and no border** — just a soft shadow on white.
   Primary ("Convert") is distinguished only by **accent-colored bold text** (`--clay-strong`).
   The exception is the destructive button (filled `--danger`/rust with light text).

---

## Setup in the Svelte app

1. **Tokens.** Copy `tokens.css` into `src/` and import it once globally (e.g. in `src/main.js`:
   `import './tokens.css'`, or `@import './tokens.css';` at the top of a global `app.css`). It
   already `@import`s the Google Fonts (Hanken Grotesk + JetBrains Mono) — the app is online, so CDN
   fonts are fine.
2. **Global base.** Add a tiny global stylesheet:
   ```css
   *{margin:0;padding:0;box-sizing:border-box}
   html,body,#app{height:100%}
   body{font-family:var(--font-sans);background:var(--bg-canvas);color:var(--ink);-webkit-font-smoothing:antialiased}
   button,input,select,textarea{font-family:inherit;border:none}
   ::selection{background:var(--accent-soft)}
   ```
3. **Icons.** Install **`lucide-svelte`** (`npm i lucide-svelte`). Icons are line-style, ~1.75
   stroke, sized 16–22px, colored with `currentColor`. Import per-icon, e.g.
   `import { Plus, Ruler, Timer } from 'lucide-svelte'`. Icon names used in the reference map 1:1
   (kebab→PascalCase): `plus`→`Plus`, `layout-grid`→`LayoutGrid`, `chevron-right`→`ChevronRight`,
   `ruler`, `timer`, `palette`→`Palette`, `pilcrow`→`Pilcrow`, `case-sensitive`→`CaseSensitive`,
   `binary`→`Binary`, `copy`→`Copy`, `search`→`Search`, `shapes`→`Shapes`, `dot`→`Dot`,
   `arrow-left`→`ArrowLeft`, `arrow-left-right`→`ArrowLeftRight`, `play`/`pause`,
   `rotate-ccw`→`RotateCcw`, `trash-2`→`Trash2`, `eraser`→`Eraser`, `clock`→`Clock`,
   `check`→`Check`, `info`→`Info`.
4. **No emoji** anywhere; **sentence case** for all copy except the wide-tracked uppercase labels.

---

## Component map (React reference → Svelte)
Build these as `.svelte` components. Read the matching file in `reference_app/` for exact markup &
logic.

| Svelte component | Reference file | Notes |
|---|---|---|
| `Icon` | `ui.jsx` | Thin wrapper — in Svelte just use `lucide-svelte` directly; no wrapper needed. |
| `Button` | `ui.jsx` | Variants: primary (accent bold text), secondary (ink text), ghost, danger (filled). All white + soft shadow except danger + ghost. |
| `Segmented` | `ui.jsx` | Pill track (`--bg-sunken`), active segment = white pill + `--shadow-xs`. |
| `Toast` | `ui.jsx` | Global toast store (use a Svelte writable store + a `<ToastHost>`). White pill, soft shadow, auto-dismiss ~2.2s. |
| `Menu` | `Sidebar.jsx` | The collapsible **`+` menu** — see below. |
| `TopBar` | `TopBar.jsx` | Just the `+` trigger (left) + a search pill. No avatar, no other icons. |
| `Home` | `Home.jsx` | Hero + responsive tool-card grid; "recently used" + "all tools" sections; live search filter. |
| `UnitConverter` | `UnitConverter.jsx` | Categories Length/Weight/Volume/Data; conversion factors are in the file. Accepts an initial category from the menu tree. |
| `Timer` | `Timer.jsx` | Presets + working countdown + SVG progress ring. |
| `ColorTool` | `ColorTool.jsx` | Native color input + hex field + brand swatches; live HEX/RGB/HSL with copy. |
| `WordCounter` | `WordCounter.jsx` | Live word/char/sentence counts + read-time. |
| `CaseConverter` | `CaseConverter.jsx` | UPPER/lower/Title/Sentence transforms. |
| `Base64Tool` | `Base64Tool.jsx` | btoa/atob encode/decode (UTF-8 safe variant in file). |
| App shell + routing | `app.jsx` | `TOOLS` registry + view state. Use Svelte state or a tiny router; routes are just `home` + one per tool. |

---

## Screens

### App shell
- Single column: a top bar, then a scrolling content area (`max-width ~1000px`, centered,
  padding `40px 32px 64px`). Canvas background `--bg-canvas`.

### Top bar
- Left: the **`+` button** — a 44px circle, `background: var(--accent)`, icon color
  `var(--on-accent)`, `box-shadow: var(--shadow-xs)` (→ `sm` on hover). It **rotates 135° to an ×**
  when the menu is open.
- A **search pill**: white, `--shadow-sm`, `border-radius: var(--r-pill)`, search icon + input;
  focus shows the focus ring (`--shadow-focus`). Typing jumps to Home and filters.
- Nothing else (no avatar/status icons).

### The `+` menu (popover)
Starts **closed** (only the `+` shows). On click, a popover opens anchored top-left:
- Panel: `background: var(--surface)`, `border-radius: var(--r-xl)`, `box-shadow: var(--shadow-lg)`,
  width ~308px, padding 14px, gentle pop-in animation (opacity/scale, ~200ms).
- A scrim behind it closes on outside click.
- **Header:** small accent brand mark (`Shapes` icon) + "Quietkit" / "Everyday utilities".
- "All tools" item, then a section row **"TOOLS" · count**.
- Tool items: icon + label; **active item = white pill + `--shadow-sm` + `--clay-strong` text**.
- **Unit converter is expandable:** a chevron (rotates 90° when open) reveals a **tree** of
  Length / Weight / Volume / Data, connected by a 1.5px `--border` vertical line
  (`.nav-tree::before`). Picking a category opens the converter on that unit.
- A "New" **badge** on Base64 (small pill, `--accent` bg, `--on-accent` text).
- Footer: Settings / About.
- Selecting any tool closes the menu.

### Home
- Eyebrow ("A QUIETER TOOLBOX", uppercase wide-tracked label), big light display title
  ("Small tools, **done well.**"), sub-paragraph.
- Section label "RECENTLY USED", then a grid (`repeat(auto-fill, minmax(208px, 1fr))`, gap 16px) of
  **tool tiles**: white (`--surface-raised`), `--r-lg`, `--shadow-sm`, no border, padding 22px,
  min-height 150px; hover lifts (`--shadow-md` + `translateY(-2px)`). Each tile: an accent-soft icon
  square, name, one-line description, and an "Open →" footer.
- Section label "ALL TOOLS" + the full grid. Search replaces these with filtered results / an empty
  state.

### Tool views
- A ghost "← All tools" back button, an eyebrow + light display title, then one or more
  **panels**: white (`--surface-raised`), `--r-xl`, padding 32px, `--shadow-sm`, **no border**.
- Inputs are **filled wells** (`background: var(--bg-sunken)`, `--r-sm`, **no border**); on focus
  they go white + focus ring. Mono inputs use `--font-mono` with tabular numerals.
- Readouts use `--font-mono`, tabular numerals, large sizes.
- See each reference file for the precise control layout and logic.

---

## Interactions & behavior
- **Motion:** gentle, no bounce. ~120–360ms, `cubic-bezier(0.4,0,0.2,1)` / soft ease-out
  (`--ease`, `--ease-out`, `--dur*`). Page/tool entrance is a subtle slide-up
  (**transform only — never animate opacity from 0**, so content is never invisible if a tab is
  backgrounded).
- **Hover:** surfaces warm slightly / lift one shadow step. **Press:** an **inset** shadow makes
  buttons look pushed in (`box-shadow: inset 0 2px 5px rgba(46,40,35,.11)`), same background as rest.
- **Focus:** 3px soft clay ring (`--shadow-focus`) — keep visible for keyboard users.
- All tools run **entirely client-side**; every "Copy" writes to clipboard and fires a toast.

## State
- Global: current view (`home` | tool id), search query, and the converter's selected category.
- Per-tool local state only (input values, timer ticks, picked color). No data fetching.

## Design tokens
All in `tokens.css`. Highlights:
- **Neutrals/base:** `--bg-canvas #F4F1EA`, `--bg-sunken #F3EEE4`, `--surface #FAF9F6`,
  `--surface-raised #FFFFFF`.
- **Ink:** `--ink #9A8B74`, `--ink-2 #BCAE99`, `--ink-3 #D4CABA`.
- **Accent:** `--accent #CBB9A4`, `--clay-strong #9C8059` (primary text), `--accent-soft #EFE8DC`,
  `--on-accent #2E2823`.
- **Retro spectrum (brand):** `--rust #A9503B`, `--burnt #CE8A52`, `--cream #E6E0D2`,
  `--sage #91A38D`, `--slate-blue #5E7B8E`, `--navy #41506E`, `--charcoal #2C2D35`, `--greige #D9D3C5`.
- **Status:** success `--sage`, warning `--burnt`, danger `--rust`, info `--slate-blue` (+ `*-soft`).
- **Type:** `--font-sans` Hanken Grotesk, `--font-mono` JetBrains Mono; scale `--text-*`; signature
  uppercase label = 11px / 600 / `letter-spacing:.18em`.
- **Radii:** `--r-sm 10`, `--r-md 14`, `--r-lg 20`, `--r-xl 28`, `--r-pill`.
- **Shadows:** `--shadow-xs/sm/md/lg` (use sparingly, keep subtle).

## Assets
- **Fonts:** Google Fonts CDN (already imported in `tokens.css`). Self-host later if you want full
  offline.
- **Icons:** `lucide-svelte` (substitution for the design's Lucide set — same icons).
- **Brand reference palette image:** `../assets/brand-palette.jpeg` in the design system (not needed
  at runtime).

## Files in this bundle
- `tokens.css` — **use directly**: all design tokens + font import.
- `DESIGN_GUIDELINES.md` — full brand/voice/visual guidelines (the design system README).
- `reference_app/` — the HTML/React prototype (read for markup, layout, exact logic). Open
  `reference_app/index.html` in a browser to see the target look & behavior.
