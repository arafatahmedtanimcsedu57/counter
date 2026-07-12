# Counter App — Architecture

## 1. Overview

A single-screen counter built with **Next.js (App Router)**, structured with **onion (clean)
architecture**. The product is deliberately tiny (see `feature.md`) — the point of this repo is to
demonstrate a clean, testable, SSR-safe architecture on a domain small enough that the *structure*
is the thing on display, not the problem. The layers keep the business rules (stepping, reset,
step-coercion) testable in isolation and independent of React, Next.js, and the browser.

**Stack**

| Concern        | Choice                                             |
| -------------- | -------------------------------------------------- |
| Framework      | Next.js 15 (App Router) + React 19                 |
| Language       | TypeScript (`strict: true`, no `any`)              |
| Styling        | Tailwind CSS                                       |
| Client state   | Zustand + `persist` (localStorage) + `devtools`    |
| Unit tests     | Vitest + React Testing Library                     |
| E2E tests      | Playwright                                         |
| Lint / format  | ESLint (next) + Prettier                           |

## 2. Architecture Principles

- **Dependency rule** — dependencies point inward only:
  `Presentation → Application → Domain` and `Infrastructure → Application/Domain`.
  Inner layers never import outer layers.
- **Domain is pure** — zero framework/browser dependencies. No React, no Next.js, no `window`.
- **Business logic lives in Domain/Application**, never in components. Components only compose UI
  and wire events.
- **Persistence is an implementation detail** hidden behind a port; Domain/Application don't know
  localStorage exists.

```
┌──────────────────────────────────────────────┐
│ Presentation  app/ · components/ · hooks/ ·   │
│               store/ (Zustand)                 │
│  ┌──────────────────────────────────────────┐ │
│  │ Infrastructure  storage adapter (port impl)│ │
│  │  ┌────────────────────────────────────────┐│ │
│  │  │ Application  use-cases · ports · dto    ││ │
│  │  │  ┌──────────────────────────────────────┐│ │
│  │  │  │ Domain  counter rules · types         ││ │
│  │  │  └──────────────────────────────────────┘│ │
│  │  └────────────────────────────────────────┘│ │
│  └──────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

## 3. Directory Structure

```
src/
├── app/                                  # Presentation — Next.js App Router
│   ├── layout.tsx                        # Root layout, metadata, <StoreProvider>
│   ├── page.tsx                          # Renders <Counter />
│   └── globals.css                       # Tailwind entry
│
├── domain/                               # Innermost — pure TypeScript, zero deps
│   └── counter/
│       ├── types.ts                      # CounterState
│       ├── config.ts                     # DEFAULT_STATE, DEFAULT_STEP
│       ├── rules.ts                      # increment / decrement / reset / withStep
│       └── index.ts                      # barrel
│
├── application/                          # Use cases + ports
│   ├── use-cases/
│   │   ├── increment-counter.ts
│   │   ├── decrement-counter.ts
│   │   ├── reset-counter.ts
│   │   └── set-step.ts
│   ├── ports/
│   │   └── counter-storage.port.ts       # CounterStoragePort (getItem/setItem/removeItem)
│   ├── dto/
│   │   └── counter.dto.ts                # PersistedCounter (serialized shape)
│   └── index.ts
│
├── infrastructure/                       # External world adapters
│   ├── storage/
│   │   └── local-counter-storage.ts      # implements CounterStoragePort over localStorage (SSR-guarded)
│   └── config/
│       └── storage-keys.ts               # STORAGE_KEY, STORAGE_VERSION
│
├── store/                                # Presentation state
│   ├── zustand/
│   │   └── counter-store.ts              # createCounterStore(): persist + devtools; actions call use cases
│   └── store-provider.tsx                # React context → per-request store (SSR-safe)
│
├── hooks/                                # Presentation hooks
│   └── use-counter.ts                    # selects state + actions + `hydrated` flag
│
├── components/
│   ├── ui/                               # Dumb primitives
│   │   ├── button.tsx
│   │   └── number-input.tsx
│   └── features/counter/                 # Counter feature UI
│       ├── counter.tsx                   # composition root ('use client')
│       ├── counter-display.tsx           # the current count (large, centered)
│       ├── counter-controls.tsx          # −/+ and Reset buttons
│       └── step-input.tsx                # numeric step field
│
└── lib/
    └── coerce-number.ts                  # safe parse for the step input

e2e/
└── counter.spec.ts                       # Playwright end-to-end flow
```

## 4. Layer Responsibilities

### Domain (`src/domain/counter/`)
Pure, framework-free heart of the app.

```ts
// types.ts
export interface CounterState {
  count: number;
  step: number; // how much +/- changes the count; defaults to 1
}
```

`rules.ts` holds pure transition functions — the only place counting logic exists:

- `increment(state)` → `count + step`
- `decrement(state)` → `count − step`
- `reset(state)` → `count = 0`, step unchanged
- `withStep(state, step)` → coerce step (empty/invalid → `DEFAULT_STEP` of `1`), set it

All functions are total, side-effect-free, and return **new** state objects (immutable). The count
is unbounded — it may go negative; there are intentionally no min/max bounds.

### Application (`src/application/`)
Thin orchestration over Domain; still no React/browser.

- **use-cases/** — one function per operation, e.g.
  `incrementCounter(state: CounterState): CounterState`,
  `setStep(state, step: number): CounterState`. Each validates its input and delegates to domain
  rules. This is where "empty/invalid step falls back to 1" is enforced.
- **ports/** — `CounterStoragePort` describes persistence as a `getItem/setItem/removeItem`
  contract (a superset compatible with Zustand's `StateStorage`). Application depends on the
  interface, never the implementation.
- **dto/** — `PersistedCounter` is the serialized shape written to storage (with `version`).

### Infrastructure (`src/infrastructure/`)
Implements ports; the only place that touches the browser.

- `local-counter-storage.ts` implements `CounterStoragePort` over `window.localStorage`,
  **guarded for SSR** (returns `null` / no-ops when `window` is undefined).
- `storage-keys.ts` centralizes the storage key and a `STORAGE_VERSION` for future migrations.

### Presentation (`app/`, `store/`, `hooks/`, `components/`)
React/Next.js only. Composes UI and wires events to use cases via the store.

## 5. State Management — Zustand + persist

**Why Zustand:** the counter state is shared down one parent→child branch (Counter → Display /
Controls / step input), which the architecture decision tree maps to Zustand. `persist` removes
manual localStorage effects; `devtools` aids debugging.

**Store shape** (`store/zustand/counter-store.ts`):

```ts
interface CounterStore extends CounterState {
  increment: () => void;
  decrement: () => void;
  reset: () => void;
  setStep: (step: number) => void;
}
```

Actions are one-liners that call the **application use cases** and `set` the result — no logic in
the store itself:

```ts
increment: () => set((s) => incrementCounter(s)),
```

**Persistence** is configured with `persist`, using `createJSONStorage(() => localCounterStorage)`
(the infrastructure adapter fulfilling `CounterStoragePort`), keyed by `STORAGE_KEY`, and
`partialize`d to persist `{ count, step }` only. A `migrate`/`version` pair handles
`STORAGE_VERSION` bumps.

### SSR / hydration strategy (Next.js App Router)
Two problems, two fixes:

1. **Cross-request leakage** — a module-level store is shared across requests on the server.
   Fix: `store-provider.tsx` creates the store **per request** with `createCounterStore()` and
   supplies it through React context. `use-counter` reads from that context store.
2. **Hydration mismatch** — server has no localStorage. Fix: `persist({ skipHydration: true })`,
   then call `store.persist.rehydrate()` inside a client `useEffect`. `use-counter` exposes a
   `hydrated: boolean` flag; the UI shows the default (or a skeleton) until `hydrated` is true, so
   server and first client render match.

## 6. Data Flow

```
User action (click)
        │
        ▼
components/features/counter/*  ──calls──►  hooks/use-counter
        │                                          │
        │                                   store action (Zustand)
        │                                          │
        │                                 application/use-cases
        │                                          │
        │                                   domain/counter/rules  ── returns new CounterState
        │                                          │
        │                                   set() updates store
        │                                          │
        │                         persist middleware ──► infrastructure/local-counter-storage ──► localStorage
        ▼
UI re-renders (updated count)
```

## 7. Feature → Layer Mapping

| Feature            | Where it lives                                                       |
| ------------------ | ------------------------------------------------------------------- |
| Increment / Decr.  | `domain/rules` (± step) ← `application/use-cases` ← store action     |
| Reset              | `domain/rules.reset` ← `resetCounter` use case                      |
| Custom step        | `withStep` (domain, coerces to 1) ← `setStep` use case; `step-input.tsx` UI |
| Persist            | `store` persist middleware → `infrastructure/local-counter-storage` |

## 8. TypeScript Conventions
- `strict: true`; never `any` (use `unknown` + narrowing).
- Props interface per component named `{Component}Props`; explicit return types on exported
  functions, hooks, and use cases; components return `React.ReactNode`.
- Immutable domain updates (return new objects); no in-place mutation.
- Barrel `index.ts` per layer module. `ref` is a plain prop (React 19) — no `forwardRef`.

## 9. Testing Strategy

**Unit (Vitest + RTL)** — the pyramid's base sits in Domain/Application:
- `domain/counter/rules.test.ts` — step math, reset leaves step unchanged, step coercion of
  empty/invalid input. Pure functions → fast, exhaustive.
- `application/use-cases/*.test.ts` — input validation + delegation.
- `store/zustand/counter-store.test.ts` — actions produce expected state; persistence via a mock
  `CounterStoragePort`.
- Component tests — `step-input` coerces bad input to 1; controls dispatch the right actions.

**E2E (Playwright)** — `e2e/counter.spec.ts`:
increment/decrement by step → reset → change step → **reload page and assert count + step
persisted**.

## 10. Tooling
- **Tailwind** for styling (create-next-app default); design tokens via Tailwind theme.
- **ESLint** (`next/core-web-vitals` + TS rules) and **Prettier**; a single `format`/`lint` script.
- Suggested scripts: `dev`, `build`, `start`, `lint`, `format`, `test` (Vitest), `test:e2e`
  (Playwright).

## 11. Non-Goals / Future
Kept intentionally out of scope to keep the product minimal (see `feature.md`):
- Min/max bounds, floor-at-zero, keyboard shortcuts, animated count — deliberately excluded polish.
- Multiple named counters (would generalize `CounterState` into a keyed collection).
- Undo/redo (append a history reducer in Application).
- Accounts / backend / server-side persistence (swap the `CounterStoragePort` implementation for an
  API repository — Domain/Application unchanged).
```
