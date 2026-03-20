# docs-engine

`docs-engine` is a TypeScript CLI for keeping a repository's documentation system coherent.

It does five jobs:

1. discovers what exists in the repo
2. detects what changed
3. determines which docs are impacted
4. compiles AI context from canonical truth
5. validates coverage and drift

## Commands

```bash
pnpm --dir tools/docs-engine inventory
pnpm --dir tools/docs-engine manifest
pnpm --dir tools/docs-engine impact
pnpm --dir tools/docs-engine compile-ai
pnpm --dir tools/docs-engine changelog
pnpm --dir tools/docs-engine tutorial-draft
pnpm --dir tools/docs-engine validate
pnpm --dir tools/docs-engine watch
```

## Output artifacts

The engine writes machine-readable reports to `tools/docs-engine/src/output/` when run from this package, or to the configured output directory when embedded in a larger monorepo.

- `repo-inventory.json`
- `docs-index.json`
- `route-inventory.json`
- `env-inventory.json`
- `api-inventory.json`
- `entity-inventory.json`
- `impact-report.json`
- `drift-report.json`
- `validation-report.json`

## Configuration

Optional config file:

- `docs-engine.config.json`

The configuration shape is defined in `src/config/docs-engine.config.schema.json`.
