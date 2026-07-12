## Context

The repo currently holds only design docs (`feature.md`, `ARCHITECTURE.md`) and OpenSpec tooling — no application code. This change stands up the project skeleton and toolchain so later changes (`counter-domain`, `counter-ui`, `counter-persistence`) have a green baseline to build on. This is a portfolio project, so the scaffold should reflect production conventions (strict TS, layered structure, real unit + e2e test runners), even though no product behavior ships here.

Constraints come from `ARCHITECTURE.md`: Next.js 15 App Router, React 19, TypeScript `strict`, Tailwind, Zustand (later), Vitest + RTL, Playwright, ESLint + Prettier.

## Goals / Non-Goals

**Goals:**
- A buildable, servable Next.js App Router app with a placeholder home page.
- Strict TypeScript with no `any`.
- Tailwind wired into the global stylesheet.
- ESLint + Prettier with `lint`/`format` scripts, green on baseline.
- Vitest + RTL (`test`) and Playwright (`test:e2e`), each proven by a passing smoke test.
- The `src/` onion-layer directory skeleton present but empty of feature logic.
- npm scripts: `dev`, `build`, `start`, `lint`, `format`, `test`, `test:e2e`.

**Non-Goals:**
- Any counter behavior (increment/decrement/reset/step) or persistence — later changes.
- Zustand store, domain rules, use cases, or storage adapter (folders exist, code does not).
- CI configuration, deployment, or a component library beyond what create-next-app provides.

## Decisions

**Bootstrap with `create-next-app`, then layer in the rest.**
Use `create-next-app` (App Router, TypeScript, Tailwind, ESLint, `src/` dir, `@/*` alias) for a canonical, low-risk base, then add Prettier, Vitest, and Playwright manually. Alternative — fully manual setup — was rejected: more surface area to get wrong for no benefit on a greenfield app.

**Vitest + React Testing Library over Jest.**
Vitest is ESM-native, fast, and needs minimal config alongside Next 15; RTL provides component testing. Environment: `jsdom`. React 19 requires `@testing-library/react` v16+. Jest was rejected for heavier ESM/transform configuration with the App Router.

**Playwright over Cypress.**
Playwright is already named in `ARCHITECTURE.md`, runs headless in CI cleanly, and its config can auto-start the app via `webServer`. The e2e smoke test just loads `/` and asserts the placeholder renders.

**Placeholder home page, not a stubbed counter.**
The page renders a simple placeholder (e.g. app title). Building even a fake counter now would bleed scope into `counter-ui` and risk a throwaway that contradicts the real design. The e2e/unit smoke tests target this placeholder.

**Keep empty layer directories with `.gitkeep`.**
`src/{domain,application,infrastructure,store,hooks,components,lib}` are created with `.gitkeep` so the structure is visible and later changes have a home. Empty barrel `index.ts` files are deferred to the changes that add real exports (an empty barrel that exports nothing trips TS "not a module"), so we use `.gitkeep` rather than placeholder barrels.

**Tailwind version follows create-next-app's current default (v4, PostCSS-based).**
Accept whatever `create-next-app` scaffolds rather than pinning an older major; the global stylesheet imports Tailwind and one utility on the page proves it works.

## Risks / Trade-offs

- **create-next-app interactivity / version drift** → run it non-interactively with explicit flags; record the resolved Next/React versions in `package.json` so the baseline is reproducible.
- **React 19 peer-dependency friction** with Testing Library / other libs → use `@testing-library/react` ≥ 16 (React 19 support); if any dep lags, pin a compatible version and note it.
- **Playwright `webServer` startup flakiness** (port in use, slow first build) → point `webServer` at `next dev` with a generous `timeout` and `reuseExistingServer` locally; keep the smoke test to a single navigation.
- **Test-runner glob overlap** → scope Vitest to `src/**/*.test.ts(x)` and Playwright to `e2e/**`, so unit and e2e suites never pick up each other's files.
- **Tailwind v4 config differences** vs the v3 examples in older docs → treat the create-next-app output as source of truth for Tailwind wiring.

## Open Questions

- Package manager: assume **npm** (create-next-app default) unless the user prefers pnpm/yarn.
- Node version to target/pin (e.g. an `.nvmrc`) — default to the current Next 15 LTS baseline unless specified.
