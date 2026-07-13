# UI Design — Counter

Two fully-working, self-contained prototypes of the counter defined in [`../feature.md`](../feature.md).
They exist to choose an **aesthetic direction** before building the real Next.js app
(see [`../ARCHITECTURE.md`](../ARCHITECTURE.md)). No build step — open the HTML files in a browser.

## Files

| File              | Direction        | Aesthetic                                    |
| ----------------- | ---------------- | -------------------------------------------- |
| `index.html`      | —                | Gallery / chooser landing page               |
| `instrument.html` | **A — TALLY.01** | Dark retro-industrial _precision instrument_ |
| `editorial.html`  | **B — COUNT**    | Light Swiss-brutalist _editorial_ sheet      |

Open `index.html` first to compare, or open a prototype directly.

## Direction A — TALLY.01 (dark instrument)

- **Mood:** tactile hardware device — a lab/counting instrument rendered in CSS.
- **Hero:** a mechanical **odometer** — each digit is a 0–9 reel that rolls on change (leading-zero padded).
- **Type:** Oxanium (display) + Spline Sans Mono (engraved micro-labels).
- **Palette:** warm graphite chassis, recessed panel, cream-amber phosphor digits, single amber accent, red reset.
- **Details:** corner screws, film-grain overlay, scanlines, depressible buttons with real press physics, blinking status LED.

## Direction B — COUNT (light editorial)

- **Mood:** a printed magazine spread — bold, typographic, gridded.
- **Hero:** a giant high-contrast **Fraunces** numeral that _ink-stamps_ in on change with a red registration ghost.
- **Type:** Fraunces (display serif) + Archivo (labels).
- **Palette:** warm newsprint paper, black ink, one risograph-red accent.
- **Details:** hard offset drop-shadow border, graph-paper grid, printed ruler gauge with a needle, ✕-stamp checkbox.

## Feature coverage (both prototypes)

Every prototype implements the complete spec, so you can _feel_ the interactions, not just see them:

- ✅ Increment / decrement by the current **step**
- ✅ **Reset** to 0 (config preserved)
- ✅ **Min / Max bounds** — count clamps; +/− disable at a limit; invalid range (`min > max`) keeps last valid config
- ✅ **Floor at zero** toggle (effective min ≥ 0)
- ✅ **Keyboard shortcuts** — `▲`/`+` inc, `▼`/`−` dec, `R` reset (ignored while typing in a field)
- ✅ **Animated count** (odometer roll in A, ink-stamp in B) with `tabular-nums`
- ✅ **Persistence** via `localStorage` (separate keys per prototype)
- ✅ A live **range gauge** showing the count's position within `[min, max]`

## Notes for production

- These are static mockups; the shipped app moves the counting rules into `domain/`, the persistence
  behind the `CounterStoragePort`, and state into a Zustand store — per `ARCHITECTURE.md`.
- Fonts load from Google Fonts via `<link>`; in Next.js use `next/font` to self-host them instead.
- Pick a direction (or mix — e.g. A's odometer with B's type) and I'll build it out.
