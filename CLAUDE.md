# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

The app is **designed but not yet scaffolded**. There is no `package.json`, `src/`, or tooling — the `src/` tree and scripts in `ARCHITECTURE.md` describe the intended structure, not existing files. First implementation step is a Next.js scaffold (App Router, TypeScript, Tailwind).

Documents of record:
- `feature.md` — product spec (what the counter does): increment/decrement by step, reset, `localStorage` persistence of count + step, custom step with fallback to `1`.
- `ARCHITECTURE.md` — the authoritative technical design (stack, layering, file layout, SSR strategy, testing). **Read it before writing app code**; don't restate or diverge from it here.

## Development workflow — OpenSpec (spec-driven)

This repo uses **OpenSpec** (`openspec/config.yaml`, `schema: spec-driven`). Non-trivial work goes through a change proposal before implementation rather than straight to code. Layout: `openspec/specs/` = current capabilities, `openspec/changes/` = active proposals, `openspec/changes/archive/` = completed.

Slash commands (backed by skills in `.claude/skills/openspec-*`):
- `/opsx:explore` — think through an idea / clarify requirements before committing to a change.
- `/opsx:propose` — create a change with design, specs, and tasks in one step.
- `/opsx:apply` — implement the tasks of an existing change.
- `/opsx:archive` — finalize and archive a change once implemented.

## Architecture invariants

Full detail is in `ARCHITECTURE.md`; the cross-cutting rules that span multiple files and are easy to violate:

- **Onion / clean architecture.** Dependencies point inward only: `Presentation → Application → Domain`, and `Infrastructure → Application/Domain`. Inner layers never import outer ones.
- **Domain is pure** (`src/domain/counter/`) — no React, Next.js, or `window`. All counting logic (`increment`/`decrement` by step, `reset`, `withStep` coercion) lives here as total, immutable, side-effect-free functions. The count is unbounded (may go negative — no min/max). Components and the store contain **no** business logic; they only call Application use cases.
- **Persistence is behind a port.** Application depends on `CounterStoragePort`; only `src/infrastructure/storage/` touches `localStorage`, and it is SSR-guarded (no-ops when `window` is undefined).
- **SSR/hydration (App Router).** The Zustand store is created **per request** via `store-provider.tsx` (no module-level store — avoids cross-request leakage). `persist` uses `skipHydration: true` with `rehydrate()` in a client effect; `use-counter` exposes a `hydrated` flag and the UI renders defaults until it's true, so server and first client render match.
- **TypeScript `strict`, never `any`** (use `unknown` + narrowing); immutable domain updates; `{Component}Props` interfaces; explicit return types on exports; React 19 (`ref` as a plain prop, no `forwardRef`).

## Commands

Not wired up yet — no `package.json`. Once scaffolded, `ARCHITECTURE.md` §10 calls for: `dev`, `build`, `start`, `lint`, `format`, `test` (Vitest + React Testing Library), `test:e2e` (Playwright). Update this section with the actual commands after scaffolding.

## Constraints (non-goals)

Keep scope narrow — `feature.md` excludes accounts/backend/database, multiple counters, and history/undo. `ARCHITECTURE.md` §11 notes how each would extend the design if ever needed, but don't build them without a spec change.
