## Why

The repository has design docs (`feature.md`, `ARCHITECTURE.md`) but no code — there is no `package.json`, `src/`, or tooling. Before any counter feature can be built, the project needs a Next.js App Router skeleton, strict TypeScript, styling, and a working test/lint toolchain so subsequent changes (domain, UI, persistence) have somewhere to land and a green baseline to build on.

## What Changes

- Initialize **Next.js 15 (App Router)** + **React 19** with **TypeScript `strict: true`** (no `any`).
- Add **Tailwind CSS** as the styling layer.
- Configure **ESLint** (`next/core-web-vitals` + TS rules) and **Prettier**.
- Configure **Vitest + React Testing Library** for unit tests and **Playwright** for e2e, each with a trivial passing smoke test so the runners are proven green.
- Create the **onion-layer directory skeleton** from `ARCHITECTURE.md` (`domain/`, `application/`, `infrastructure/`, `store/`, `hooks/`, `components/`, `lib/`) as empty/placeholder scaffolding — no counter logic yet.
- Add npm scripts: `dev`, `build`, `start`, `lint`, `format`, `test`, `test:e2e`.
- Render a minimal placeholder home page (no counter — that arrives in later changes).

Explicitly **out of scope**: any counter behavior (increment/decrement/reset/step) and persistence. Those are separate follow-on changes (`counter-domain`, `counter-ui`, `counter-persistence`).

## Capabilities

### New Capabilities

- `project-scaffold`: the buildable Next.js App Router project and its verification toolchain — the app serves a page, and `lint`, `format`, `test`, and `test:e2e` are configured and pass on an empty baseline.

### Modified Capabilities

<!-- None — no existing specs. -->

## Impact

- **New files**: `package.json`, `tsconfig.json`, `next.config.*`, Tailwind/PostCSS config, ESLint/Prettier config, `vitest.config.*` + test setup, `playwright.config.*`, `src/app/{layout,page,globals.css}`, and the empty `src/` layer directories; `e2e/` with a smoke spec.
- **New dependencies**: Next.js, React, TypeScript, Tailwind, ESLint/Prettier, Vitest + RTL, Playwright.
- **No product behavior** yet; this is the foundation the counter changes depend on.
- Establishes the `src/` structure and conventions that `ARCHITECTURE.md` mandates for all later work.
