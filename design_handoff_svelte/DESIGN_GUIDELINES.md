# Quiet Utility — Design System

**Quiet Utility** is the design system for a minimal, modern **utilities web app** — a calm
collection of small everyday tools (converters, timers, calculators, generators, notes) presented
with the care and restraint of a premium stationery brand. The product is a **static web app**
(no backend) hosted on **GitHub Pages**, so everything here is built for the browser with no
server dependencies.

> **Aesthetic in one line:** warm editorial minimalism — sand, oat & porcelain neutrals, espresso
> ink, hairline borders, whisper-soft warm shadows, and crisp monospace numerals for the moments a
> tool needs to feel like a precise instrument.

---

## Sources

This system was created from a single brand input — there was **no codebase or Figma file**:

- `uploads/_ (9).jpeg` — the brand color swatch (Soft Sandstone, Creamed Oat, Porcelain Mist,
  Feather White). Preserved at `assets/brand-palette.jpeg`.
- Written brief: *"Minimal & Modern Utilities Web App… very minimalistic, clean, modern, and the
  colors and design should really fit with each other. Static, hosted on GitHub Pages."*

Everything beyond the four brand swatches (extended neutrals, ink colors, the single clay accent,
muted earthy status colors, type, spacing, radii, shadows) was **derived** to harmonize with that
palette. Those derivations are flagged in **Visual Foundations** below.

---

## Content Fundamentals

How copy is written across the product.

- **Voice:** calm, plain, confident. The app does small jobs well and says so without fuss. Think
  of a well-made tool, not a chirpy assistant.
- **Person:** address the user as **you**; the product refers to itself rarely and never as "I".
  ("Paste your text below." not "I'll convert your text!")
- **Casing:** **Sentence case** for everything readable — headings, buttons, menu items
  ("Copy result", "New timer"). The **only** uppercase is the signature **wide-tracked label**
  (see Visual Foundations) used for section eyebrows and field labels: `CONVERT FROM`, `RESULT`.
- **Tone:** quiet and precise. Short sentences. No marketing adjectives, no exclamation marks in UI
  copy. Empty states are gentle and instructive, never cute.
- **Numbers & units:** numeric output is king — show it in monospace, with tabular figures, and
  spell units in full on first use (`1,024 kilobytes`) but abbreviate in dense readouts (`1,024 KB`).
- **Emoji:** **none.** The brand expresses warmth through color and type, not emoji.
- **Microcopy examples:**
  - Button: `Convert`, `Copy`, `Reset`, `Add tool`
  - Empty state: `Nothing here yet. Pick a tool to get started.`
  - Helper: `Drop a file or paste a value.`
  - Confirmation (transient toast): `Copied to clipboard`
  - Label (eyebrow): `RECENTLY USED`, `SETTINGS`, `RESULT`

---

## Visual Foundations

### Color
- **Palette is warm-neutral and monochromatic by intent.** The four brand swatches —
  Feather White `#FAF9F6`, Porcelain Mist `#F4F1EA`, Creamed Oat `#E6DAC8`, Soft Sandstone
  `#CBB9A4` — form a tight tonal ramp. Cohesion comes from staying inside this warm family.
- **Layering:** page canvas is the warm **Porcelain Mist**; cards/panels lift to **Feather White**
  or pure white; wells & input tracks sink to a slightly darker **`#ECE5D8`**. The whole UI is one
  warm material catching gentle light.
- **Ink** is warm, never pure black: primary `#2E2823` (espresso), secondary `#6E6052` (taupe),
  tertiary `#9C8E7C`. *(Derived.)*
- **One accent only:** **clay `#B49A78`** (a deeper sandstone) for primary actions, active states &
  focus. Selected/hover backgrounds use the soft **Creamed Oat** tints. Restraint is the point —
  there is no second brand color. *(Derived from Soft Sandstone.)*
- **Status colors map to a warm retro spectrum** so they carry character while staying tasteful:
  sage success `#91A38D`, burnt-orange warning `#CE8A52`, rust danger `#A9503B`, slate-blue info
  `#5E7B8E`. The full brand spectrum — **rust, burnt orange, cream, sage, slate blue, navy `#41506E`,
  charcoal `#2C2D35`** — is available as named tokens for accents and data viz. The light warm-neutral
  base (canvas, surfaces, ink) stays as the calm ground these brighter tones sit on. *(From the brand
  reference palette.)*

### Typography
- **Two families.** UI workhorse **Hanken Grotesk** (a warm humanist grotesque) for everything
  readable; **JetBrains Mono** for numeric readouts, code, and units — the "instrument" voice.
  *(Both substituted from Google Fonts — see note at end.)*
- **Display headings use Light (300)** for an editorial, airy feel; body is Regular; labels & button
  text are Semibold.
- **Signature label style:** 11px, Semibold, `UPPERCASE`, `0.18em` letter-spacing, tertiary ink —
  lifted directly from the brand swatch ("SOFT SANDSTONE"). Used for eyebrows and field labels.
- **Tabular numerals** everywhere numbers update (`font-variant-numeric: tabular-nums`) so readouts
  don't jitter.

### Spacing & Layout
- **4px base grid.** Generous negative space is a feature — utility tools breathe. Default card
  padding is 24–32px; section rhythm is 48–80px.
- **Layouts are calm and centered**, often a single comfortable column or a tidy responsive grid of
  equal cards. Asymmetry is used sparingly (a left-aligned eyebrow + large heading).
- Max content width ~960–1120px; tools center within it.

### Shape, Borders & Elevation
- **Generous soft radii** echoing the swatch cards: inputs `10px`, cards `20px`, large panels `28px`,
  pills `999px`.
- **Hairline borders** (`#E7DDCD`, or `rgba(46,40,35,.08)`) define most surfaces. Borders do the
  separating; shadows only hint at lift.
- **Shadows are whisper-soft and warm-tinted** (espresso-based, never neutral gray). Four steps from
  `xs` (1px) to `lg` (16px blur). Most cards use `sm`/`md`. No hard or colored drop shadows.
- **No gradients** beyond the faintest tonal washes; no glassmorphism, no heavy blur. Transparency is
  used only for hairlines, overlays (scrims) and disabled states.

### Motion & Interaction
- **Gentle, no bounce.** Transitions are 120–360ms on `cubic-bezier(0.4,0,0.2,1)` / a soft
  `ease-out`. Page/tool loads use a quiet staggered fade-up.
- **Hover:** surfaces warm slightly (move toward Creamed Oat tint) and/or lift one shadow step;
  primary buttons darken toward `#A88E6B`. No scale-up on hover.
- **Press:** color deepens to `#9C8059` and the element settles ~1px (translateY) — a subtle press,
  not a squash.
- **Focus:** a 3px soft clay focus ring (`rgba(180,154,120,.45)`), always visible for keyboard users.
- **Disabled:** reduced opacity (~0.45) and `not-allowed` cursor; no color change.

### Imagery
- The brand leans on **type and color, not photography.** When imagery appears (e.g. the palette
  reference) it is **warm, soft, natural-light, matte** — stone, paper, ceramic textures. Cool tones
  and high-contrast/glossy imagery are off-brand. Keep imagery rare and quiet.

---

## Iconography

- **Icon set: [Lucide](https://lucide.dev)** loaded from CDN. Lucide's clean, even **1.75px stroke,
  rounded line caps** matches the soft warm minimalism perfectly. *(Substitution — no icon assets
  were provided. Flagged for the user.)*
- **Style rules:** line icons only (no filled/duotone), stroke `1.75`, sized 18–22px in UI, colored
  with `currentColor` so they inherit ink. Icons are quiet companions to labels, never decorative
  clutter.
- **No emoji** anywhere. **No** Unicode dingbats used as icons. A few mathematical/unit glyphs
  (`×`, `÷`, `→`, `±`) appear inside tools as content, set in the mono face.
- Usage in HTML: `<i data-lucide="timer"></i>` then `lucide.createIcons()`. CDN:
  `https://unpkg.com/lucide@latest`.

---

## Index — what's in this system

Root files:
- `README.md` — this file.
- `colors_and_type.css` — all design tokens (CSS variables) + semantic type classes. **Import this
  first** in any artifact.
- `SKILL.md` — agent-skill manifest for using this system in Claude Code.
- `assets/` — brand assets: `brand-palette.jpeg` (source swatch).
- `preview/` — Design System tab cards (color, type, spacing, component specimens).
- `ui_kits/app/` — the Utilities Web App UI kit: `README.md`, `index.html`, and JSX components
  (recreations of core screens — tool dashboard + individual tools).

Fonts: served from Google Fonts CDN (the app is hosted online). See the substitution note below if
you need self-hosted files.

---

## Font substitution note

No font files were provided, so this system uses the closest high-quality Google Fonts matches:
**Hanken Grotesk** (UI) and **JetBrains Mono** (numeric/mono). If you have specific brand fonts,
send them and I'll swap them in and re-tune the type scale.
