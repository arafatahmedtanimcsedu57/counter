## ADDED Requirements

### Requirement: Runnable Next.js App Router application
The system SHALL provide a Next.js 15 application using the App Router that serves a home page.

#### Scenario: Dev server serves the home page
- **WHEN** the developer runs `npm run dev` and a browser requests `/`
- **THEN** the home page renders and responds with HTTP 200

#### Scenario: Production build succeeds
- **WHEN** the developer runs `npm run build`
- **THEN** the build completes with a zero exit code and no errors

### Requirement: Strict TypeScript
The project SHALL be authored in TypeScript with `strict: true` enabled and SHALL NOT use `any`.

#### Scenario: Type checking passes on the baseline
- **WHEN** the TypeScript compiler runs over the scaffolded project
- **THEN** it reports no type errors and `compilerOptions.strict` is `true`

### Requirement: Tailwind styling
The system SHALL have Tailwind CSS configured and wired into the global stylesheet so utility classes take effect.

#### Scenario: Tailwind utilities apply
- **WHEN** a Tailwind utility class is applied to an element on the home page
- **THEN** the corresponding styles are visibly applied in the rendered page

### Requirement: Lint and format tooling
The system SHALL provide `lint` and `format` npm scripts backed by ESLint (`next/core-web-vitals` + TypeScript rules) and Prettier, passing on the scaffolded baseline.

#### Scenario: Lint passes on the baseline
- **WHEN** the developer runs `npm run lint`
- **THEN** it exits with code 0 and reports no errors

#### Scenario: Formatting is enforced
- **WHEN** the developer runs `npm run format`
- **THEN** the source is formatted per the Prettier configuration with a zero exit code

### Requirement: Unit test runner
The system SHALL provide a Vitest + React Testing Library setup runnable via `npm test`, proven by a passing smoke test.

#### Scenario: Unit smoke test passes
- **WHEN** the developer runs `npm test`
- **THEN** a smoke test executes and the runner exits with code 0

### Requirement: End-to-end test runner
The system SHALL provide a Playwright setup runnable via `npm run test:e2e`, proven by a passing smoke test that loads the home page.

#### Scenario: E2E smoke test passes
- **WHEN** the developer runs `npm run test:e2e`
- **THEN** Playwright starts the app, loads `/`, and the smoke test passes with a zero exit code

### Requirement: Onion-layer directory skeleton
The project SHALL contain the layered `src/` directory structure defined in `ARCHITECTURE.md`, present but unpopulated by feature logic.

#### Scenario: Layer directories exist
- **WHEN** the repository is inspected after scaffolding
- **THEN** `src/app`, `src/domain`, `src/application`, `src/infrastructure`, `src/store`, `src/hooks`, `src/components`, and `src/lib` all exist

#### Scenario: No counter behavior is present
- **WHEN** the home page is loaded
- **THEN** it renders a placeholder and no increment, decrement, reset, step, or persistence behavior exists yet
