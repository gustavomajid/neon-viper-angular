# Study Log

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
