# ARCHITECTURE_SUMMARY

## Document Status
- Status: Canonical working baseline
- Purpose: provide the high-level technical architecture for the Ardtire digital governance platform
- Audience: principal/staff engineers, backend/frontend engineers, platform engineers, future AI implementation agents

---

## 1. Architectural Intent

The platform architecture must support a governance-oriented institution whose software needs include:
- public presence
- authenticated member interaction
- administrative operations
- canonical governance state transitions
- official records and publication
- long-term procedural and historical integrity

The architecture must prioritize:
- correctness over novelty
- explicit boundaries over convenience coupling
- auditability over hidden behavior
- phased extensibility over speculative complexity

---

## 2. Top-Level Architecture

The recommended top-level architecture is a modular monorepo with a small number of major application surfaces and shared packages.

### Primary applications
- `apps/web` — public, member, and admin user experience
- `apps/gov-api` — canonical governance domain API and mutation boundary
- `apps/cms` — editorial/public content management

### Core infrastructure
- PostgreSQL — transactional source of truth
- Prisma — canonical schema/modeling layer
- Keycloak — authentication and SSO
- Payload CMS storage/database integration as needed
- optional queue/job worker — notifications, publication jobs, projections, sync tasks

### Optional external boundary
- Decidim — bounded integration for selected participatory/public governance use cases, never canonical for Ardtire’s authoritative institutional state unless explicitly changed later

---

## 3. Architectural Philosophy

### 3.1 Canonical Mutation Boundary
All authoritative governance state changes must occur through `apps/gov-api`.

Examples:
- membership approval
- proposal submission/admission
- vote opening/closing
- certification
- office-holder appointment changes
- publication event creation for official records

This prevents business logic drift across:
- frontend route handlers
- CMS hooks
- one-off scripts
- direct database writes

### 3.2 Separation of Canonical State from Editorial Content
The CMS manages narrative, informational, and editorial content.
The governance core manages official state, procedural transitions, and official records.

The public web layer may render both, but it must not blur them conceptually or technically.

### 3.3 State-Machine-Driven Workflow Modeling
Critical workflows must not be modeled as loose flags. They must be explicit, testable state machines with:
- states
- transitions
- guards
- actor permissions
- side effects
- terminal outcomes

### 3.4 Versioned Procedure Awareness
Where procedural rules materially affect outcomes, the outcome record must retain the policy/rule version applied.

Examples:
- eligibility
- quorum
- thresholds
- ratification requirements
- certification rules

### 3.5 Modular Monorepo, Not Premature Microservices
The platform should maintain strong internal modularity without exploding into many distributed services too early.

This yields:
- lower cognitive overhead
- stronger contract consistency
- easier local development
- simpler operational maturity curve

---

## 4. Application Roles

## 4.1 `apps/web`
Purpose:
- deliver public website
- deliver member portal
- deliver administrative operator experience

Responsibilities:
- user interface rendering
- route protection
- form workflows
- presentation logic
- public rendering of canonical records and editorial content
- interaction with gov-api and CMS

Non-responsibilities:
- canonical governance mutation logic
- deep procedural rule enforcement
- direct database-level domain orchestration

### Major route domains
- public site
- applications/membership
- member dashboard
- governance viewing/participation surfaces
- admin operations
- public registers/gazette

---

## 4.2 `apps/gov-api`
Purpose:
- canonical application layer for institutional state changes

Responsibilities:
- enforce domain invariants
- evaluate policy and authority
- execute workflow transitions
- persist canonical records
- emit audit events
- expose typed application API
- coordinate with async jobs

Non-responsibilities:
- editorial content authoring
- broad presentation logic
- unmanaged direct user experience

### Example governed operations
- submit membership application
- review/approve/reject application
- create/update body or office
- submit/admit/reject proposal
- open/close vote
- certify outcome
- create publication event
- update membership status through authorized transitions

---

## 4.3 `apps/cms`
Purpose:
- manage editorial and public informational content

Responsibilities:
- pages
- announcements
- public informational content
- biographies
- educational/explanatory materials
- potentially structured content for menus, navigation, hero sections, etc.

Non-responsibilities:
- authoritative governance workflow state
- official procedural outcomes as source of truth
- permission-critical institutional decisions

---

## 5. Shared Package Model

A suggested package layout:

### `packages/domain`
- domain types
- entity models
- value objects
- domain service contracts
- state enum definitions
- core invariants expressed in reusable structures

### `packages/authz`
- role definitions
- policy evaluation helpers
- actor capability checks
- permission constants
- authority resolution helpers

### `packages/contracts`
- API request/response schemas
- DTO definitions
- validation schemas
- error models
- OpenAPI/shared contract artifacts

### `packages/gov-client`
- typed client for `gov-api`
- request helpers
- auth-aware API wrappers for server/client use as appropriate

### `packages/workflows`
- state machine definitions
- transition maps
- guard helpers
- workflow metadata

### `packages/audit`
- audit event schemas
- event emission interfaces
- trace/correlation helpers
- audit display helpers

### `packages/ui`
- design system primitives
- tables, forms, modals, layout components
- admin UI building blocks
- shared presentational utilities

### `packages/config`
- shared config loaders
- environment validation
- constants
- deployment/runtime config helpers

### `packages/test-helpers`
- fixtures
- factories
- integration harnesses
- transition assertion helpers

---

## 6. Data and Persistence Architecture

### 6.1 Canonical Database
PostgreSQL is the primary transactional system of record for:
- identities as needed at application boundary
- membership state
- bodies, offices, office holders
- proposals, amendments, votes, outcomes
- records and publication events
- audit/event data where appropriate
- policy/rule version references

### 6.2 ORM and Schema Authority
Prisma is the canonical application schema/model representation.
Any secondary schema representations are subordinate unless an ADR explicitly changes this.

### 6.3 Persistence Principles
- prefer explicit normalized models for canonical workflows
- use JSON only for bounded, justified cases
- preserve version lineage where history matters
- distinguish mutable draft state from official finalized state where necessary
- do not encode procedural state solely in timestamps or ad hoc booleans

---

## 7. Identity and Access Architecture

### 7.1 Authentication
Keycloak is the authoritative authentication system.

Responsibilities:
- login
- realm/client management
- identity brokering
- session/auth token issuance
- group/role mapping where applicable

### 7.2 Authorization
Application authorization is enforced in the Ardtire application layer.

Key rule:
Authentication proves identity.
Authorization determines allowed actions.

The application must not assume that raw login state implies institutional authority.

### 7.3 Authorization Model
Hybrid model:
- RBAC for broad surface access
- policy/attribute checks for procedural and object-level authority

Examples:
- an admin may access an admin area
- only an authorized reviewer may advance an application from review to approved
- only a qualified operator/certifier may certify an outcome
- office-dependent powers may require office-holder context, not just app role

---

## 8. Workflow and Domain Control Architecture

Critical institutional workflows are modeled in the application layer as explicit stateful processes.

### Candidate workflow families
- membership application lifecycle
- membership status lifecycle
- proposal lifecycle
- amendment lifecycle
- voting lifecycle
- certification lifecycle
- publication lifecycle
- office-holder lifecycle

Workflow definitions should live in code and docs, with the docs serving as source-of-truth planning artifacts and the code reflecting them precisely.

---

## 9. Audit and Observability Architecture

### 9.1 Audit
Every privileged or procedurally meaningful action should generate an audit event containing:
- actor
- action type
- target entity/type
- timestamp
- reason/notes where required
- correlation/trace ID
- resulting state or transition metadata

### 9.2 Operational Observability
The system should support:
- structured logs
- trace IDs
- health endpoints
- background job visibility
- failed publication/notification visibility
- workflow bottleneck reporting
- privileged-action reporting

### 9.3 Why This Matters
For governance systems, observability is not just operational. It is part of institutional accountability.

---

## 10. Asynchronous Processing

The first phase may begin with minimal async infrastructure, but the architecture should anticipate background jobs for:
- notifications
- publication rendering
- search indexing
- projection refreshes
- Decidim sync tasks if used
- email delivery
- scheduled reminders or escalations

Principles:
- canonical transaction occurs first
- background work reacts to committed outcomes
- retries must be traceable
- failed async work must not silently erase institutional visibility

---

## 11. CMS Boundary

The CMS is for:
- pages
- media
- public editorial materials
- non-canonical narrative content

The CMS is not for:
- official proposal state
- authoritative vote state
- office-holder legality
- certification truth
- canonical registers of record

The web app may combine CMS material and canonical records in presentation, but the sources must remain conceptually separate.

---

## 12. Decidim Boundary

If Decidim is used, it should be treated as an integration boundary, not as the canonical institutional core.

Potential uses:
- selected participatory workflows
- civic engagement surfaces
- external/community discussion or proposal collection
- public participation adjuncts

Non-uses in initial scope:
- authoritative internal governance mutation storage
- replacement for official records system
- replacement for core authority and certification logic

A later ADR can expand this if necessary, but initial design should preserve Ardtire-owned canonical control.

---

## 13. Deployment Model

A practical initial deployment model:
- separate deployable services for `web`, `gov-api`, and `cms`
- managed Postgres
- Keycloak deployment managed separately
- object storage where needed
- optional worker process for background jobs
- environment-per-stage configuration: local, preview/dev, staging, production

Principles:
- keep deployables few and clear
- preserve configuration discipline
- maintain environment validation
- protect secrets and credentials
- support repeatable local development

---

## 14. Security Principles

- least privilege
- explicit authorization checks on all governed mutations
- server-side validation of all critical actions
- strong audit for privileged operations
- secrets managed through environment discipline
- controlled admin surface exposure
- careful handling of personally identifying/member-related data
- no trust in frontend-only enforcement

---

## 15. Testing Strategy at Architecture Level

The architecture must support:
- unit testing of rules and guards
- integration testing of workflow transitions
- contract testing of API schemas
- end-to-end testing of critical user/operator flows
- historical consistency tests for rule-versioned outcomes
- permission boundary tests

The system is not complete unless the architecture makes these tests natural to write.

---

## 16. Principal Architecture Decisions

1. `gov-api` is the canonical mutation boundary.
2. `web` is the primary user-facing surface.
3. `cms` is editorial, not canonical governance state.
4. PostgreSQL + Prisma is the canonical transactional modeling stack.
5. Keycloak is authoritative for authentication.
6. Workflows are modeled explicitly as state machines.
7. Rule-bearing outcomes retain rule version references.
8. Modular monorepo is preferred over premature microservice sprawl.
9. Deferred domains remain out of scope until intentionally activated.

---

## 17. Future Evolution Without Replatforming

The architecture should be able to later accommodate:
- advanced ratification and constitutional workflows
- richer public registers
- stronger operator oversight tools
- analytics and reporting
- land/registry domains
- judicial/dispute domains
- treasury/governance finance domains
- AI-assisted drafting and review tooling

These must be evolutions of the architecture, not reasons to overbuild the initial platform.

---

## 18. Summary

The architecture is intentionally conservative and institution-first:

- a web application for public/member/admin experiences
- a dedicated governance API for authoritative institutional state changes
- a CMS for editorial/public content
- a relational canonical record system
- strong authorization, auditability, and workflow modeling

This architecture is designed to let Ardtire become operationally credible early while preserving long-term flexibility and procedural integrity.