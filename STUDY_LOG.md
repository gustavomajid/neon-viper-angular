# Study Log

## 2026-07-28 — Deterministic game-engine tests

### Changes

- Added stable one-shot and watch-mode test commands.
- Extended the game-engine suite to verify that idle, countdown, paused, and game-over states never advance.
- Added the 22-test Vitest suite to the CI quality gate.
- Updated the roadmap and validation documentation.

### Concepts practiced

- Testing pure state transitions without browser or timer dependencies.
- Table-driven tests for multiple equivalent state scenarios.
- Separating the deterministic CI command from the interactive watch command.
- Treating tests as a required delivery gate alongside linting, type checking, and builds.

### Trade-offs

- The suite focuses on the framework-independent engine and storage boundary; Angular interaction tests remain a later roadmap item.
- Vitest runs directly instead of through Angular's test builder because the current tests do not need Angular dependency injection or a DOM.
- The CI workflow remains a single sequential job so failures are easy to read, at the cost of slightly longer feedback than parallel jobs.

### Commands to practice locally

```bash
npm ci
npm run format
npm run lint
npm run typecheck
npm test
npm run build
```

### Exercise

Add a difficulty setting that changes board size and speed, then write table-driven tests for every supported difficulty before connecting it to the Angular interface.

## 2026-07-27 — Repository workflow and continuous integration

### Changes

- Added a phased roadmap for the project.
- Added a GitHub Actions workflow that installs dependencies and validates formatting, linting, TypeScript types, and the production build.

### Concepts practiced

- Branch-based delivery and pull-request review.
- Conventional commit messages.
- Continuous integration as a quality gate.
- Dependency caching and workflow concurrency.
- Separating product work from delivery infrastructure.

### Trade-offs

- The workflow currently builds but does not run unit tests because a stable test command has not yet been defined in `package.json`.
- Node.js 22 is pinned for reproducibility while remaining compatible with the Angular toolchain.
- CI triggers on `main`, study branches, feature branches, fix branches, and pull requests to avoid unnecessary executions on unrelated branches.

### Commands to practice locally

```bash
npm ci
npm run format
npm run lint
npm run typecheck
npm run build
```

### Exercise

Add a deterministic `test` script, create unit tests for the framework-independent game engine, and add `npm test` to the CI workflow.
