# Document 31 — `docs/implementation/monorepo-blueprint.md`

## Purpose of this document

This document defines the **complete monorepo blueprint** for the Ardtire Society Digital Governance Platform.

The prior 30 architecture documents established:

* the institutional model
* the bounded contexts
* the domain model
* the state machines
* the governance rule system
* the authority model
* the application service layer
* the API architecture
* the event system
* the database strategy
* the operational and deployment model

This document translates that architecture into a **concrete repository structure** that engineers can build against.

Its purpose is to answer:

* What repositories or packages exist?
* What applications exist?
* Where does each responsibility live?
* What should be created first?
* How should code be organized to preserve architectural integrity?

This is the first implementation-facing artifact after the architecture set.

---

# 1. Blueprint design principles

The monorepo must reflect the architecture directly.

## Principle 1 — Structure follows domain

Repository structure must mirror the major bounded contexts and architectural layers.

The monorepo must not become a random pile of folders based on temporary implementation convenience.

---

## Principle 2 — Separate apps from packages

Top-level runnable systems belong in `apps/`.

Reusable libraries, shared domain modules, and internal SDKs belong in `packages/`.

---

## Principle 3 — Preserve governance kernel integrity

The governance core must remain distinct from:

* UI code
* CMS code
* infrastructure code
* projection code
* integrations

This is essential because the governance kernel is the institutional heart of the platform.

---

## Principle 4 — Optimize for gradual implementation

The blueprint should allow the system to be implemented in phases without requiring major structural rewrites later.

---

## Principle 5 — Avoid premature fragmentation

The system should be modular, but not fragmented into dozens of tiny services too early.

A strong internal modular monorepo is preferable to premature distributed microservices.

---

# 2. High-level monorepo shape

The recommended root layout is:

```text
repo/
├─ apps/
├─ packages/
├─ docs/
├─ infra/
├─ scripts/
├─ tools/
├─ prisma/
├─ .github/
├─ package.json
├─ pnpm-workspace.yaml
├─ tsconfig.base.json
├─ turbo.json
├─ .editorconfig
├─ .gitignore
├─ .env.example
└─ README.md
```

This is the canonical top-level structure.

---

# 3. Top-level directory purposes

## `apps/`

Contains deployable applications and long-running services.

## `packages/`

Contains reusable internal libraries and domain modules.

## `docs/`

Contains all architecture, governance, operational, and implementation documents.

## `infra/`

Contains deployment, orchestration, identity, container, and infrastructure code.

## `scripts/`

Contains operational, setup, migration, seed, and maintenance scripts.

## `tools/`

Contains developer tooling and helper utilities.

## `prisma/`

Contains canonical Prisma schema, migrations, and seed assets.

## `.github/`

Contains CI/CD workflows, issue templates, PR templates, and repo automation.

---

# 4. Applications

The following applications should exist.

```text
apps/
├─ web/
├─ gov-api/
├─ worker/
├─ cms/
└─ docs-site/           # optional later
```

---

## 4.1 `apps/web`

### Purpose

Primary user-facing application.

### Responsibilities

* public website
* member portal
* officer/admin dashboards
* governance workflow UI
* public records and gazette browsing
* authenticated user experiences
* server-side integration with governance API

### Stack

* TanStack Start
* SolidJS
* TypeScript
* shared UI package
* shared auth/client packages

### Must not contain

* canonical governance business rules
* vote tally logic
* certification logic
* authority model internals

Those belong in backend/domain packages.

---

## 4.2 `apps/gov-api`

### Purpose

Canonical application API for all authoritative governance-domain mutations and authoritative reads.

### Responsibilities

* command endpoints
* query endpoints
* authority enforcement
* domain orchestration
* governance workflows
* event emission
* audit event creation
* repository coordination
* projection triggering

### Stack

* Hono
* TypeScript
* OpenAPI generation
* domain packages
* Prisma/database packages

### This is the constitutional backend.

---

## 4.3 `apps/worker`

### Purpose

Background execution service for asynchronous jobs.

### Responsibilities

* event handling
* projection updates
* notification dispatch
* tally jobs
* publication jobs
* cleanup jobs
* projection rebuilds
* scheduled tasks

### Stack

* TypeScript
* queue client
* shared worker/job packages
* domain event handlers

---

## 4.4 `apps/cms`

### Purpose

Editorial and structured content management.

### Responsibilities

* pages
* articles
* navigation
* media
* informational content
* editorial workflows
* structured public content

### Stack

* Payload CMS
* TypeScript

### Must not be source of truth for governance state.

---

## 4.5 `apps/docs-site/` (optional later)

### Purpose

Public or internal rendered documentation site.

### Responsibilities

* governance documentation browsing
* architecture docs rendering
* procedural docs access
* public institutional explanatory docs

This can be deferred initially.

---

# 5. Packages overview

The recommended package structure is:

```text
packages/
├─ config/
├─ database/
├─ auth/
├─ permissions/
├─ shared-kernel/
├─ identity-domain/
├─ membership-domain/
├─ governance-domain/
├─ legislative-domain/
├─ voting-domain/
├─ certification-domain/
├─ records-domain/
├─ publication-domain/
├─ rules-engine/
├─ workflow-engine/
├─ application-services/
├─ repositories/
├─ projections/
├─ events/
├─ jobs/
├─ notifications/
├─ gov-client/
├─ cms-types/
├─ ui/
├─ observability/
├─ security/
├─ testing/
└─ types/
```

This is the core modular package plan.

---

# 6. Foundational cross-cutting packages

## 6.1 `packages/config`

### Purpose

Central typed runtime configuration loader and validator.

### Responsibilities

* environment variable parsing
* config schema validation
* environment-specific configuration access
* shared config types

### Typical exports

* `loadConfig()`
* `AppConfig`
* `DatabaseConfig`
* `QueueConfig`
* `AuthConfig`

---

## 6.2 `packages/database`

### Purpose

Database access foundation.

### Responsibilities

* Prisma client initialization
* transaction helpers
* shared persistence utilities
* DB lifecycle helpers
* migration support helpers

### Must not contain domain business logic.

---

## 6.3 `packages/auth`

### Purpose

Authentication integration layer.

### Responsibilities

* Keycloak/OIDC token handling
* session/user identity extraction
* auth helpers for API and web
* auth context normalization

### Boundary

Authentication only, not final authority decisions.

---

## 6.4 `packages/permissions`

### Purpose

Permission and authority evaluation adapters.

### Responsibilities

* permission vocabulary
* policy checks
* permission resolution helpers
* actor-context evaluation utilities

This package may consume office/role/delegation data, but the full domain semantics still live in the domain packages.

---

## 6.5 `packages/shared-kernel`

### Purpose

Small set of truly shared abstractions.

### Responsibilities

* IDs
* timestamps
* result/error types
* common domain primitives
* domain event base types
* value object helpers

### Important

Keep this package very small. Do not let it become a dumping ground.

---

# 7. Domain packages

These packages implement the institutional model.

## 7.1 `packages/identity-domain`

### Purpose

Identity domain model.

### Responsibilities

* person model
* user account concepts
* identity-link concepts
* identity domain events

---

## 7.2 `packages/membership-domain`

### Purpose

Membership application and standing model.

### Responsibilities

* membership application aggregate
* member aggregate
* membership lifecycle logic
* membership events

---

## 7.3 `packages/governance-domain`

### Purpose

Institutional structural model.

### Responsibilities

* governance bodies
* offices
* officeholders
* terms
* delegations
* institutional structural concepts

---

## 7.4 `packages/legislative-domain`

### Purpose

Proposal and amendment system.

### Responsibilities

* proposal aggregate
* proposal versions
* amendments
* committee assignments
* legislative lifecycle transitions

---

## 7.5 `packages/voting-domain`

### Purpose

Voting and ballot mechanics.

### Responsibilities

* ballot aggregate
* vote entity
* eligibility snapshots
* tally models
* quorum and threshold result types

---

## 7.6 `packages/certification-domain`

### Purpose

Outcome certification and ratification.

### Responsibilities

* certification records
* certification workflow
* ratification model
* certification domain events

---

## 7.7 `packages/records-domain`

### Purpose

Institutional records and archival constructs.

### Responsibilities

* official record model
* record versions
* archive semantics
* record immutability policies

---

## 7.8 `packages/publication-domain`

### Purpose

Official publication and gazette.

### Responsibilities

* gazette issue
* gazette entry
* public register entry
* publication workflow
* publication events

---

# 8. Governance mechanics packages

These packages contain the generalized machinery that the domains rely on.

## 8.1 `packages/rules-engine`

### Purpose

Governance rule versioning and evaluation.

### Responsibilities

* rule definitions
* rule version resolution
* parameter evaluation
* scope selection
* rule evaluation results

### Example concerns

* quorum rule resolution
* threshold evaluation
* eligibility rule evaluation
* publication rule evaluation

---

## 8.2 `packages/workflow-engine`

### Purpose

Generalized state machine infrastructure.

### Responsibilities

* state machine definitions
* transition execution
* guard evaluation
* side-effect registration
* transition result types

This should be generic enough to support multiple lifecycles but not so abstract that it becomes meaningless.

---

# 9. Application orchestration packages

## 9.1 `packages/application-services`

### Purpose

Use-case orchestration layer shared by API and workers.

### Responsibilities

* command handlers
* query handlers
* transaction orchestration
* authority checks
* rule invocation
* aggregate coordination

### Example handlers

* `SubmitProposalHandler`
* `CastVoteHandler`
* `CertifyResultHandler`
* `PublishGazetteEntryHandler`

---

## 9.2 `packages/repositories`

### Purpose

Repository interfaces and concrete infrastructure adapters.

### Responsibilities

* repository contracts
* Prisma-backed repository implementations
* projection repositories
* transaction-aware persistence coordination

---

# 10. Eventing and job packages

## 10.1 `packages/events`

### Purpose

Event taxonomy and event infrastructure.

### Responsibilities

* domain event types
* event metadata contracts
* event publishing interfaces
* event serialization helpers
* event naming conventions

---

## 10.2 `packages/jobs`

### Purpose

Background job definitions and handlers.

### Responsibilities

* job payload schemas
* queue names
* worker contracts
* retry metadata
* job handler registration

---

## 10.3 `packages/projections`

### Purpose

Projection definitions and projection updaters.

### Responsibilities

* projection schemas
* projection handler logic
* rebuild logic
* read model utilities

---

## 10.4 `packages/notifications`

### Purpose

Notification orchestration.

### Responsibilities

* notification templates
* delivery policies
* email/in-app notifications
* event-to-notification mapping

---

# 11. Interface and client packages

## 11.1 `packages/gov-client`

### Purpose

Typed client for `apps/web` and internal consumers to call `apps/gov-api`.

### Responsibilities

* request types
* response types
* endpoint clients
* query helpers
* auth-aware client integration

---

## 11.2 `packages/cms-types`

### Purpose

Shared generated types from Payload CMS schemas.

### Responsibilities

* CMS content types
* content query result types
* schema-derived helpers

---

## 11.3 `packages/ui`

### Purpose

Shared design system and reusable UI primitives.

### Responsibilities

* buttons
* forms
* tables
* layout primitives
* governance status badges
* timeline components
* record/panel components

---

# 12. Operational packages

## 12.1 `packages/observability`

### Purpose

Shared logging, metrics, and tracing adapters.

### Responsibilities

* logger factory
* metrics helpers
* trace context helpers
* audit metadata helpers

---

## 12.2 `packages/security`

### Purpose

Security utilities and enforcement helpers.

### Responsibilities

* token validation helpers
* security headers
* secret access wrappers
* input validation helpers
* crypto helpers where needed

---

## 12.3 `packages/testing`

### Purpose

Shared testing infrastructure.

### Responsibilities

* test fixtures
* factories
* seeded datasets
* helper assertions
* domain simulation helpers

---

## 12.4 `packages/types`

### Purpose

Small package for shared non-domain DTO-style types if needed.

This should stay disciplined and not swallow domain concepts.

---

# 13. Prisma and persistence layout

The canonical Prisma area should be:

```text
prisma/
├─ schema.prisma
├─ migrations/
├─ seed/
│  ├─ seed.ts
│  ├─ governance/
│  ├─ roles/
│  └─ development/
└─ fixtures/
```

### Principles

* Prisma schema is canonical for application persistence
* migrations are checked into version control
* seed data is explicit and repeatable
* governance rule seeds are versioned intentionally

---

# 14. Infrastructure layout

```text
infra/
├─ docker/
├─ k8s/
├─ keycloak/
├─ monitoring/
├─ terraform/          # optional if adopted
└─ environments/
    ├─ development/
    ├─ staging/
    └─ production/
```

---

## 14.1 `infra/docker`

Contains container definitions.

Possible contents:

* `Dockerfile.web`
* `Dockerfile.gov-api`
* `Dockerfile.worker`
* `Dockerfile.cms`
* compose files for local dev

---

## 14.2 `infra/k8s`

Contains Kubernetes manifests or Helm charts if used.

Possible contents:

* deployments
* services
* configmaps
* secrets references
* ingress
* cronjobs

---

## 14.3 `infra/keycloak`

Contains realm export/config and bootstrap material for identity setup.

---

## 14.4 `infra/monitoring`

Contains Prometheus, Grafana, alerting, and log aggregation config.

---

# 15. Scripts layout

```text
scripts/
├─ setup/
├─ db/
├─ dev/
├─ release/
├─ maintenance/
└─ governance/
```

Examples:

* bootstrap local environment
* run migrations
* seed development data
* rebuild projections
* replay events
* verify tally consistency
* generate OpenAPI bundle

---

# 16. Tools layout

```text
tools/
├─ generators/
├─ validators/
├─ codemods/
└─ internal-cli/
```

Examples:

* code generation
* architecture checks
* schema validators
* repo health checks

---

# 17. Docs layout refinement

You already have substantial `docs/` content. The next recommended organization is:

```text
docs/
├─ vision/
├─ domain/
├─ application/
├─ infrastructure/
├─ operations/
├─ governance/
├─ implementation/
├─ api/
├─ state-machines/
└─ decisions/
```

### Notes

* the 30 architecture docs should be placed into these folders consistently
* ADR-style decisions can go in `docs/decisions/`
* implementation-facing artifacts go in `docs/implementation/`

---

# 18. GitHub automation layout

```text
.github/
├─ workflows/
├─ ISSUE_TEMPLATE/
├─ pull_request_template.md
└─ CODEOWNERS
```

Recommended workflows:

* ci.yml
* typecheck.yml
* test.yml
* build.yml
* release.yml
* migrate.yml
* deploy-staging.yml
* deploy-production.yml

---

# 19. Root file manifest

Recommended root files:

```text
.
├─ README.md
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json
├─ .node-version
├─ .npmrc
├─ .editorconfig
├─ .gitignore
├─ .env.example
├─ .prettierrc
├─ eslint.config.js
└─ LICENSE                # if/when selected
```

---

# 20. Example full monorepo tree

```text
repo/
├─ apps/
│  ├─ web/
│  ├─ gov-api/
│  ├─ worker/
│  └─ cms/
├─ packages/
│  ├─ config/
│  ├─ database/
│  ├─ auth/
│  ├─ permissions/
│  ├─ shared-kernel/
│  ├─ identity-domain/
│  ├─ membership-domain/
│  ├─ governance-domain/
│  ├─ legislative-domain/
│  ├─ voting-domain/
│  ├─ certification-domain/
│  ├─ records-domain/
│  ├─ publication-domain/
│  ├─ rules-engine/
│  ├─ workflow-engine/
│  ├─ application-services/
│  ├─ repositories/
│  ├─ events/
│  ├─ projections/
│  ├─ jobs/
│  ├─ notifications/
│  ├─ gov-client/
│  ├─ cms-types/
│  ├─ ui/
│  ├─ observability/
│  ├─ security/
│  ├─ testing/
│  └─ types/
├─ prisma/
│  ├─ schema.prisma
│  ├─ migrations/
│  ├─ seed/
│  └─ fixtures/
├─ infra/
│  ├─ docker/
│  ├─ k8s/
│  ├─ keycloak/
│  ├─ monitoring/
│  └─ environments/
├─ scripts/
│  ├─ setup/
│  ├─ db/
│  ├─ dev/
│  ├─ release/
│  ├─ maintenance/
│  └─ governance/
├─ tools/
│  ├─ generators/
│  ├─ validators/
│  ├─ codemods/
│  └─ internal-cli/
├─ docs/
│  ├─ vision/
│  ├─ domain/
│  ├─ application/
│  ├─ infrastructure/
│  ├─ operations/
│  ├─ governance/
│  ├─ implementation/
│  ├─ api/
│  ├─ state-machines/
│  └─ decisions/
├─ .github/
│  ├─ workflows/
│  ├─ ISSUE_TEMPLATE/
│  ├─ pull_request_template.md
│  └─ CODEOWNERS
├─ package.json
├─ pnpm-workspace.yaml
├─ turbo.json
├─ tsconfig.base.json
├─ .node-version
├─ .npmrc
├─ .editorconfig
├─ .gitignore
├─ .env.example
├─ eslint.config.js
├─ .prettierrc
└─ README.md
```

---

# 21. Package dependency rules

To preserve architecture, the following dependency rules should apply.

## Allowed

* apps may depend on packages
* application-services may depend on domain packages
* repositories may depend on database package
* web may depend on gov-client, ui, auth, config
* worker may depend on jobs, projections, events, repositories, application-services

## Disallowed

* domain packages must not depend on apps
* UI packages must not depend on domain internals
* CMS package/content types must not become governance source of truth
* database package must not depend on UI
* shared-kernel must not depend on feature/domain packages

---

# 22. Recommended implementation order from this blueprint

A senior engineer would not build every folder at once. The recommended order is:

## Phase 1 — foundation

* root config files
* workspace config
* tooling config
* base package scaffolds
* `packages/config`
* `packages/database`
* `packages/shared-kernel`
* `packages/auth`

## Phase 2 — governance kernel

* workflow-engine
* rules-engine
* identity-domain
* membership-domain
* governance-domain
* legislative-domain
* voting-domain
* certification-domain
* records-domain
* publication-domain

## Phase 3 — orchestration and persistence

* repositories
* application-services
* events
* projections
* jobs
* observability

## Phase 4 — applications

* gov-api
* worker
* web
* cms

## Phase 5 — infra and operational hardening

* docker
* keycloak
* monitoring
* k8s
* CI/CD
* runbooks and release automation

---

# 23. Minimum viable initial implementation subset

To get to a real first working vertical slice, the minimum recommended subset is:

```text
apps/
  gov-api
  web

packages/
  config
  database
  auth
  shared-kernel
  governance-domain
  legislative-domain
  voting-domain
  certification-domain
  rules-engine
  workflow-engine
  application-services
  repositories
  events
  gov-client
  ui

prisma/
  schema.prisma
```

This subset is enough to build a first meaningful governance slice:

* create proposal
* submit proposal
* create ballot
* cast vote
* compute tally
* certify result
* render public result

---

# 24. Risks this blueprint prevents

This structure is designed to prevent several common failure modes.

## Risk 1 — governance logic buried in frontend

Prevented by centralizing it in domain and application packages.

## Risk 2 — CMS becomes source of truth

Prevented by hard architectural separation.

## Risk 3 — random package sprawl

Prevented by explicit package taxonomy.

## Risk 4 — premature microservices

Prevented by modular monorepo first.

## Risk 5 — inability to scale later

Prevented by bounded-context-aligned package boundaries.

---

# 25. Summary

This monorepo blueprint provides the concrete repository structure for implementing the Ardtire Society Digital Governance Platform.

It establishes:

* deployable apps
* modular packages
* canonical storage layout
* infrastructure directories
* tooling directories
* dependency boundaries
* phased implementation order

This is the correct bridge from the architecture docs into buildable software structure.

---

## Status

**Status:** Draft — implementation blueprint begins here.
**Next recommended artifact:** `docs/implementation/prisma-schema-plan.md`

5… 4… 3… next best step: I will proceed to the **complete Prisma schema plan**, which will turn the architecture and monorepo blueprint into the canonical table-by-table database design.
