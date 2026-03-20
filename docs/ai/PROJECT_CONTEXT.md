# PROJECT_CONTEXT

## Document Status
- Status: Canonical working baseline
- Intended audience: founders, principal/staff engineers, product/operations, future AI implementation agents
- Purpose: define what the Ardtire digital governance platform is, what it is not, what it must do, and what constraints govern implementation

---

## 1. Executive Summary

The Ardtire digital governance platform is an institution-grade software system for operating the public, member, administrative, and governance functions of the Ardtire Society in a durable, auditable, and procedurally explicit manner.

This is not merely a content website and not merely a member portal. It is a software system intended to support a real governance and institutional operating model.

The platform must be designed so that:
- institutional roles and authority are explicit
- governance workflows are procedurally modeled
- official outcomes are auditable and historically interpretable
- public-facing content and canonical governance records are related but distinct
- rule changes over time do not invalidate historical understanding of prior outcomes
- the system can expand in sophistication without requiring foundational rearchitecture

The platform should begin with a narrow but fully credible institutional core and expand in phases.

---

## 2. Product Thesis

The product thesis is:

> Build a constitutional operations platform that allows Ardtire to present itself publicly, administer membership, operate governance workflows, publish official outcomes, and preserve a trustworthy historical record.

The software must act as:
- a public institutional surface
- a member interaction surface
- an administrative control surface
- a canonical governance operations core

The platform must favor correctness, traceability, and procedural clarity over superficial feature breadth.

---

## 3. Current Problem the Platform Solves

Without a unified platform, institutions like Ardtire typically suffer from:
- fragmented records
- unclear authority boundaries
- ad hoc decision workflows
- poor public transparency discipline
- inconsistent publication practices
- weak historical traceability
- governance knowledge trapped in documents, chats, or individual memory
- high operational dependency on founders or a small number of operators

This platform exists to replace ad hoc institutional operations with an explicit, durable, software-mediated operating system.

---

## 4. Primary Goals

### 4.1 Institutional Goals
- Enable Ardtire to operate through explicit digital procedures
- Preserve legitimacy and traceability of official actions
- Support internal governance while presenting a coherent public face
- Create continuity beyond any one operator or founder
- Establish a durable historical record of official institutional activity

### 4.2 Product Goals
- Provide a public-facing institutional website
- Support member identity and membership workflows
- Support governance bodies, offices, office holders, and terms
- Support proposals, amendments, voting, certification, and publication
- Support records, registers, notices, and gazette-like publication
- Support strong administrative operations with auditability

### 4.3 Engineering Goals
- Maintain a clear canonical mutation boundary
- Model workflows as explicit state machines
- Preserve strong typing and schema discipline
- Keep architecture modular without premature service fragmentation
- Make the system testable at the rule, workflow, and integration levels
- Ensure long-term evolvability without rewriting core concepts

---

## 5. Non-Goals for Initial Scope

The following are explicitly out of scope for the first credible operational release unless specifically brought into scope by later planning documents:

- full judicial or dispute-resolution subsystem
- land registry or cadastral platform
- treasury, budgeting, or financial governance beyond minimal administrative needs
- sophisticated public plebiscite ecosystem beyond bounded governance workflows
- advanced constitutional simulation tooling
- federated or multi-polity governance support
- generalized social network/community platform
- broad low-trust user-generated content systems
- large-scale document intelligence or AI-native drafting workflows as a dependency for core operation

These may become future domains, but they must not distort phase-1 architecture or execution.

---

## 6. Operating Principle

The platform must be built around this principle:

> The software must faithfully encode institutional operations such that official outcomes are understandable, attributable, and historically reconstructable.

This means the platform is not judged only by usability or aesthetics. It is judged by whether it can answer:
- who acted
- under what authority
- under which procedural rule
- on what record
- at what time
- producing what outcome
- visible to whom
- with what finality

---

## 7. Core Platform Surfaces

### 7.1 Public Surface
Purpose:
- present Ardtire publicly
- publish official notices, registers, diaries/news, officer pages, governance outcomes, constitutional materials

Characteristics:
- largely public read access
- editorial content managed separately from canonical governance state
- selective rendering of official records

### 7.2 Member Surface
Purpose:
- support applicants and members
- show status, notices, limited records, participation flows where authorized

Characteristics:
- authenticated
- role-aware
- visibility constrained by permissions and institutional policy

### 7.3 Administrative Surface
Purpose:
- support operators, moderators, reviewers, certifiers, and administrators
- manage workflows, queues, exceptions, publication, and oversight

Characteristics:
- highly restricted
- audit-heavy
- designed for correctness and efficiency

### 7.4 Canonical Governance Core
Purpose:
- execute official state transitions
- persist records and rule references
- enforce workflow constraints
- emit audit events
- support historically correct reconstruction

Characteristics:
- API-first
- database-backed
- strongly modeled
- authoritative for institutional state changes

---

## 8. Primary Users and Actors

This section is simplified here; canonical actor definitions live in ACTOR and AUTHORITY documents.

Broad actor classes:
- public visitor
- applicant
- member
- moderator/reviewer
- editor
- officer
- body member
- certifier
- administrator
- founder/super-admin equivalent where applicable in early phases
- automated system actor

The platform must distinguish between:
- human identity
- application user account
- membership status
- held office
- delegated authority
- application role/permission
- procedural participation eligibility

These are related but not interchangeable.

---

## 9. Core Capability Areas

The initial platform must support the following capability areas.

### 9.1 Identity and Access
- authentication
- SSO
- account/session management
- role mapping
- policy enforcement

### 9.2 Membership
- membership applications
- review flows
- approval/rejection
- status changes
- member classes
- suspension/reinstatement
- visibility controls

### 9.3 Governance Core
- bodies
- offices
- office holders
- sessions/meetings
- agendas
- proposals
- amendments
- votes
- outcomes
- certification
- ratification where in scope

### 9.4 Records and Registers
- canonical records
- official versions
- certification metadata
- publication metadata
- lineage and supersession
- archival states

### 9.5 Publication
- notices
- gazette/register entries
- public rendering of selected canonical records
- controlled publication workflow

### 9.6 Content
- editorial/public pages
- explanatory content
- institutional storytelling
- structured informational pages

### 9.7 Administration and Oversight
- review queues
- audit views
- exception handling
- operational controls
- support utilities

---

## 10. Product Quality Bar

The product quality bar is not “feature-rich demo quality.” It is:

- procedurally coherent
- operationally usable
- legally/institutionally intelligible
- security-conscious
- auditable
- historically stable
- extensible without core redesign

---

## 11. Architectural Principles

1. Canonical governance mutations must pass through a dedicated governance application boundary.
2. Editorial CMS content must not become the canonical source of governance state.
3. Core workflows must be explicit state machines.
4. Important outcomes must retain references to the governing rule/policy version.
5. Audit trails must exist for privileged and procedurally meaningful actions.
6. Public rendering must derive from authoritative records or editorial content with explicit separation.
7. Domain boundaries must be explicit even if deployables are consolidated.
8. Deferred domains must remain deferred until intentionally activated.

---

## 12. Constraints and Preferences

### 12.1 Stack and Repo Constraints
- Frontend: TanStack Start with SolidJS
- Governance API: Hono-based TypeScript service
- Database: PostgreSQL
- Canonical ORM/schema workflow: Prisma
- Auth/SSO: Keycloak
- CMS: Payload
- Civic participation integration: Decidim may exist as an integration boundary, not canonical source of truth
- Package manager: pnpm
- Repository style: polyglot monorepo without Bazel
- API style: explicit application contracts, ideally OpenAPI-backed for governance API

### 12.2 Process Constraints
- documentation must lead implementation in critical areas
- foundational rules and workflows must be frozen before broad feature buildout
- implementation order must be deliberate
- AI-assisted implementation must respect canonical documents
- no hidden business logic split inconsistently across frontend, CMS, and scripts

### 12.3 Operational Constraints
- system must be operable by a small team
- operator actions must be inspectable
- system should tolerate future growth without requiring service explosion
- sensitive actions should be designed with reviewability and recoverability

---

## 13. Risks to Actively Manage

- procedural ambiguity
- authority confusion
- coupling CMS content to canonical governance state
- under-modeled permissions
- scope expansion into future domains too early
- weak auditability
- poor historical interpretation under rule changes
- admin operations becoming opaque or founder-dependent
- excessive architectural complexity before operational maturity

---

## 14. Success Criteria

A successful phase-1 platform allows Ardtire to:
- present itself publicly with coherence
- manage identity and membership operationally
- define bodies, offices, and office holders
- move proposals through defined workflows
- open/close and record decisions
- certify and publish official outcomes
- preserve a trustworthy historical record
- operate with less dependence on informal memory or ad hoc process

---

## 15. Immediate Planning Priority

Before major implementation continues, the following must be treated as the frozen planning packet:
- PROJECT_CONTEXT
- ARCHITECTURE_SUMMARY
- DOMAIN_MODEL
- AUTHORITY_MODEL
- STATE_MACHINES
- RECORDS_MODEL
- PUBLICATION_MODEL
- API_SPEC
- PRISMA_SCHEMA
- REPO_BLUEPRINT
- FILE_IMPLEMENTATION_ORDER
- TEST_STRATEGY

These documents become the working source of truth for engineering and AI-assisted implementation.

---

## 16. One-Sentence Product Definition

The Ardtire digital governance platform is an institution-grade system for operating membership, governance, publication, and records through explicit, auditable workflows while preserving a clear separation between canonical institutional state and public/editorial presentation.