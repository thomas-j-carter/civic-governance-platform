# Ardtire Civic Governance Platform

The Ardtire Civic Governance Platform is the canonical digital governance system for the Ardtire Society. It administers identity, membership, proposals, ballots, certifications, publications, records, and institutional transparency in a structured, auditable, and evolvable way. The platform is built on a domain-first, documentation-first, and audit-first engineering model: domain rules are written down explicitly, architectural decisions are recorded with rationale, and documentation is treated as part of the product itself.

---

## Current status

Active structured definition and implementation. Documentation and implementation proceed in lockstep. Some documentation intentionally precedes its corresponding code — well-defined future intent is preferable to undocumented improvisation.

| Area | Status |
|------|--------|
| Domain model and Prisma schema | Complete |
| CMS (Payload CMS) | Scaffolded and runnable |
| Governance API (Hono) | Routes defined; implementation in progress |
| Web application (TanStack Start + SolidJS) | Scaffolded |
| Shared packages (contracts, domain, gov-client, workflows) | Scaffolded |
| Documentation system | Canonical structure in place; content filling in |

---

## High-level architecture

The platform is a **pnpm monorepo** with three applications and four shared packages.

```
┌──────────────────────────────────────────────────────┐
│          apps/web (TanStack Start + SolidJS)         │
│   governance, member, admin surfaces                 │
└────────────────────┬─────────────────────────────────┘
                     │ packages/gov-client
┌────────────────────▼─────────────────────────────────┐
│               apps/gov-api (Hono)                    │
│   auth, membership, governance bodies, proposals,    │
│   amendments, sessions, agendas, offices, ballots    │
└────────────────────┬─────────────────────────────────┘
                     │ Prisma / PostgreSQL
┌────────────────────▼─────────────────────────────────┐
│               apps/cms (Payload CMS)                 │
│   content management, gazette, publication pipeline  │
└──────────────────────────────────────────────────────┘
```

Cross-cutting:
- `packages/contracts` — typed API/service contracts
- `packages/domain` — canonical domain models and enums
- `packages/workflows` — business process orchestration
- `tools/` — repo validation, context compilation, client codegen

---

## Apps and packages

| Name | Path | Purpose |
|------|------|---------|
| web | `apps/web` | TanStack Start + SolidJS frontend — member, governance, and admin surfaces |
| gov-api | `apps/gov-api` | Hono REST API — all governance business logic and data access |
| cms | `apps/cms` | Payload CMS — content management and publication pipeline; runs on port 3001 |
| contracts | `packages/contracts` | TypeScript service contracts shared between gov-api and gov-client |
| domain | `packages/domain` | Canonical domain models, enums, and shared types |
| gov-client | `packages/gov-client` | Typed API client and server functions for the web app |
| workflows | `packages/workflows` | Amendment and governance workflow definitions |

---

## Quickstart for local development

**Prerequisites:** Node 20+, pnpm 10+, PostgreSQL

```bash
# 1. Clone and install
git clone <repo-url>
cd civic-governance-platform
pnpm install

# 2. Configure environment
cp apps/cms/.env.example apps/cms/.env        # set DATABASE_URL and secrets
cp apps/gov-api/.env.example apps/gov-api/.env

# 3. Set up the database
pnpm --filter gov-api exec prisma migrate dev

# 4. Start applications
pnpm --filter cms dev          # CMS on http://localhost:3001
pnpm --filter gov-api dev      # Governance API
pnpm --filter web dev          # Web frontend
```

See `docs/07-runbooks/` for detailed local development, seed data, and troubleshooting procedures.

---

## Basic commands

```bash
# Install all dependencies
pnpm install

# Run an app in development mode
pnpm --filter cms dev
pnpm --filter gov-api dev
pnpm --filter web dev

# Run tests
pnpm --filter cms test
pnpm --filter cms test:watch

# Type-check
pnpm --filter cms typecheck
pnpm --filter gov-api typecheck

# Build for production
pnpm --filter cms build

# Validate repository structure
pnpm validate:repo

# Regenerate AI context artifacts
pnpm compile:context

# Regenerate the gov-client from API contracts
pnpm codegen:gov-client
```

---

## Link map — most important docs

| What you want to know | Where to look |
|-----------------------|---------------|
| Why does this platform exist? | [`docs/00-vision/`](00-vision/) |
| What does the product do? | [`docs/01-product/`](01-product/) |
| What do domain terms mean? | [`docs/02-domain/`](02-domain/) · [`docs/GLOSSARY.md`](GLOSSARY.md) |
| How is the system designed? | [`docs/03-architecture/`](03-architecture/) |
| Why was X decided? | [`docs/04-decisions/`](04-decisions/) |
| What should this feature do? | [`docs/05-specs/`](05-specs/) |
| How do I call the API? | [`docs/06-api/`](06-api/) |
| How do I run an operational task? | [`docs/07-runbooks/`](07-runbooks/) |
| How is the system monitored? | [`docs/08-operations/`](08-operations/) |
| What is the current project state? (AI handoff) | [`docs/09-ai-context/`](09-ai-context/) |
| What changed? | [`docs/10-changelog/`](10-changelog/) |
| Full documentation map | [`docs/README.md`](README.md) ← you are here |
| Authority hierarchy | [`docs/SOURCE_OF_TRUTH_POLICY.md`](SOURCE_OF_TRUTH_POLICY.md) |
| How to contribute | [`CONTRIBUTING.md`](../CONTRIBUTING.md) |
| API route manifest | [`docs/implementation/gov-api-route-manifest.md`](implementation/gov-api-route-manifest.md) |

---

## Supported environments

| Environment | Notes |
|-------------|-------|
| Local development | macOS, Linux; Node 20+, pnpm 10+, PostgreSQL |
| CI | GitHub Actions; Node 20, Python 3.11 |
| Staging / production | Not yet provisioned |

---

## Glossary of core terms

| Term | Meaning |
|------|---------|
| **Actor** | A person, system, service, or institutional role that performs actions in the platform |
| **Authority** | A recognized institutional grant of ability — broader than a technical permission |
| **Bounded context** | A boundary within which a model and vocabulary are consistently defined |
| **Governance body** | A formal committee or assembly with defined authority and membership |
| **Invariant** | A rule that must always hold, enforced by the platform |
| **Lifecycle** | The full set of states an entity moves through, with defined transitions |
| **Proposal** | A formal motion that follows a defined drafting, reading, voting, and publication workflow |
| **Record** | A persistent institutional artifact subject to versioning and retention rules |
| **Role** | A named classification used for authorization and authority resolution |
| **Workflow** | A defined sequence of actions, transitions, and guards for a business process |

Full glossary: [`docs/GLOSSARY.md`](GLOSSARY.md) and [`docs/02-domain/glossary.md`](02-domain/glossary.md).

---

## Repository conventions

- **Documentation-first.** Domain rules, architectural decisions, and feature specs are written before or alongside implementation. See [`docs/DOCUMENTATION_GOVERNANCE.md`](DOCUMENTATION_GOVERNANCE.md).
- **Source-of-truth hierarchy.** Not all documents are equally authoritative. See [`docs/SOURCE_OF_TRUTH_POLICY.md`](SOURCE_OF_TRUTH_POLICY.md).
- **ADRs for consequential decisions.** Any significant architectural or domain choice gets a record in `docs/04-decisions/`.
- **Specs for user-visible behavior.** Feature work is grounded in `docs/05-specs/`.
- **Commit discipline.** Commits are focused and use semantic prefixes: `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`.
- **Change manifests.** Meaningful changes are recorded in `.changes/` and linked to docs, AI context, and changelog.
- **AI assistance is permitted but constrained.** AI-generated content must align with canonical docs and must not invent domain rules or architecture. See [`docs/09-ai-context/AI_RULES.md`](09-ai-context/AI_RULES.md).

---

## Top-level route and app map

| Surface | Entry point |
|---------|-------------|
| Member portal | `apps/web/src/` — `/member/*` |
| Governance surfaces | `apps/web/src/` — `/governance/*` |
| Admin surfaces | `apps/web/src/` — `/admin/*` |
| REST API | `apps/gov-api/src/app.ts` — see route manifest |
| CMS | `apps/cms/src/` — Payload CMS admin at `/admin` |

Full API route inventory: [`docs/implementation/gov-api-route-manifest.md`](implementation/gov-api-route-manifest.md).

---

## Where decisions and specs live

- **Architectural Decision Records** — `docs/04-decisions/` — one file per decision, with context, options, and rationale
- **Feature specs** — `docs/05-specs/` — implementable behavior definitions with acceptance criteria
- **Domain rules** — `docs/02-domain/` — canonical source for what domain terms mean and what invariants hold
- **API contracts** — `docs/06-api/` — resource model, error model, authentication, versioning

---

## What should I read first?

If you are new to this repository, read in this order:

1. This file
2. [`docs/SOURCE_OF_TRUTH_POLICY.md`](SOURCE_OF_TRUTH_POLICY.md) — understand document authority before reading anything else
3. [`docs/00-vision/`](00-vision/) — why the platform exists
4. [`docs/02-domain/`](02-domain/) — what the domain terms mean
5. [`docs/03-architecture/`](03-architecture/) — how the system is structured
6. [`docs/09-ai-context/PROJECT_CONTEXT.md`](09-ai-context/PROJECT_CONTEXT.md) — current implementation state

Then move into the specific feature, domain, or architectural area you are working on.

---

## Contribution entry point

Before making any non-trivial change:

1. Read the relevant canonical docs for the affected area
2. Confirm whether a spec is needed (`docs/05-specs/`)
3. Confirm whether an ADR is needed (`docs/04-decisions/`)
4. Implement code, update impacted documentation, and record the change in `.changes/`

Full workflow: [`CONTRIBUTING.md`](../CONTRIBUTING.md)

---

## License

Formal license and usage terms not yet finalized. This repository is private until a license is applied.
