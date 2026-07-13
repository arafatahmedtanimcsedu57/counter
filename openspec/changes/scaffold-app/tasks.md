## 1. Bootstrap the Next.js project

- [x] 1.1 Run `create-next-app` non-interactively (App Router, TypeScript, Tailwind, ESLint, `src/` dir, `@/*` alias) into the repo root without clobbering existing docs/`openspec/`
- [x] 1.2 Confirm `tsconfig.json` has `strict: true`; enable it if not
- [x] 1.3 Verify `npm run dev` serves `/` and `npm run build` succeeds

## 2. Formatting, linting, and scripts

- [x] 2.1 Add Prettier + config and align ESLint (`next/core-web-vitals` + TS) to not conflict with Prettier
- [x] 2.2 Add npm scripts: `dev`, `build`, `start`, `lint`, `format`, `test`, `test:e2e`
- [x] 2.3 Run `npm run lint` and `npm run format`; ensure both pass clean on the baseline

## 3. Unit test runner (Vitest + RTL)

- [x] 3.1 Install Vitest, `@testing-library/react` (≥16 for React 19), `@testing-library/jest-dom`, and jsdom
- [x] 3.2 Add `vitest.config.*` (jsdom env, `src/**/*.test.ts(x)` glob) and a test setup file
- [ ] 3.3 Add a smoke unit test that renders the home page placeholder and asserts it appears; confirm `npm test` exits 0

## 4. E2E test runner (Playwright)

- [ ] 4.1 Install Playwright and its browsers
- [ ] 4.2 Add `playwright.config.*` scoped to `e2e/**`, with a `webServer` that starts the app (generous timeout, `reuseExistingServer` locally)
- [ ] 4.3 Add `e2e/smoke.spec.ts` that loads `/` and asserts the placeholder renders; confirm `npm run test:e2e` passes

## 5. Onion-layer skeleton and placeholder page

- [ ] 5.1 Create `src/{domain,application,infrastructure,store,hooks,components,lib}` with `.gitkeep` (no feature logic, no barrels yet)
- [ ] 5.2 Wire Tailwind into `src/app/globals.css` and replace the default home page with a minimal placeholder using at least one Tailwind utility
- [ ] 5.3 Confirm the placeholder contains no counter behavior (increment/decrement/reset/step/persistence)

## 6. Verify the baseline

- [ ] 6.1 Run all commands end to end — `dev` (manual check), `build`, `lint`, `format`, `test`, `test:e2e` — and confirm every one is green
- [ ] 6.2 Record the resolved Next.js/React/Tailwind versions in `package.json` and update `CLAUDE.md`'s Commands section with the actual scripts
