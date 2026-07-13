# Counter App — Feature Specification

A simple counter app built with **Next.js (App Router)** + **TypeScript** + **Tailwind CSS**,
with state managed by **Zustand** (persisted to `localStorage`).

## Features

### 1. Increment / Decrement

- A `+` button increases the count, a `−` button decreases it.
- Each click changes the count by the current **step** value.
- Buttons are **disabled at the bounds** (can't go past min/max).

### 2. Reset

- A **Reset** button sets the count back to `0`.
- Configuration (step, bounds, floor-at-zero) is left unchanged on reset.

### 3. Persist State

- Count **and** configuration (step, min, max, floor-at-zero) survive reloads and browser restarts.
- Stored in `localStorage` via Zustand's `persist` middleware.
- Hydration-safe: the UI renders the default state on the server, then rehydrates from storage on
  the client to avoid SSR hydration mismatches.

### 4. Custom Step

- A numeric input sets how much each `+`/`−` click changes the count. Default `1`.
- Empty or invalid input falls back to `1`. Step must be a positive integer.

### 5. Min / Max Bounds

- Configurable **minimum** and **maximum** values; the count is always clamped into `[min, max]`.
- At a bound, the corresponding button is disabled.
- Defaults: `min = 0`, `max = 100`.

### 6. Floor at Zero

- A toggle that forces the effective minimum to be `≥ 0` (the count can never go negative),
  regardless of the configured `min`.
- **On by default.** Turn it off (and set a negative `min`) to allow negative counts.

### 7. Keyboard Shortcuts

- `ArrowUp` / `+` → increment; `ArrowDown` / `−` → decrement (by the current step).
- `r` → reset. Shortcuts respect bounds and are ignored while typing in an input.

### 8. Animated Count

- The displayed number animates on change (subtle transition/roll), using `tabular-nums` so the
  layout doesn't shift.

## Screen (single page)

- Large, centered, animated count display.
- `−` and `+` buttons (disabled at bounds).
- **Reset** button.
- **Step** input.
- **Min** / **Max** inputs and a **floor-at-zero** toggle.

## Rules & Edge Cases

- Any state change re-clamps the count into the effective range.
- If `min > max` after an edit, treat the range as invalid and keep the last valid config.
- Changing the step never changes the current count.
- All numeric inputs coerce empty/invalid values to sensible defaults.

## Non-Goals (for now)

- No accounts, backend, or database.
- No multiple counters.
- No history/undo/redo.
