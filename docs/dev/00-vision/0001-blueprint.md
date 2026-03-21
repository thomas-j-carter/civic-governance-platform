0001-blueprint.md


Below is the fuller senior-level blueprint, split into the three parts I mentioned.

# Part I. How elite software architects would design the complete Ardtire governance architecture

An elite architect would frame Ardtire not as “a site with some member features,” but as a **constitutional civic operating system** with multiple public and private surfaces, strict authority boundaries, auditable workflows, and long-lived records.

They would begin by naming the system correctly.

**System name:** Ardtire Society Digital Governance Platform
**System type:** institutional governance platform
**Primary mission:** enable lawful, traceable, rules-driven civic participation and institutional administration for Ardtire Society

From there, they would separate the system into distinct planes.

## 1. Experience plane

This is what users see and interact with.

It would include:

* public website
* member portal
* officer/admin console
* editorial/CMS workspace
* governance workflow interfaces
* public records and gazette views

A senior engineer would insist that these are **different user experiences on top of shared backend rules**, not separate ad hoc apps with duplicated logic.

So the frontend strategy would likely be:

* `apps/web` for public, member, and admin surfaces
* role-aware routing
* server-side permission checks
* shared design system
* CMS-driven public content where possible
* application-driven workflow UIs where determinism matters

## 2. Governance rules plane

This is the real heart of the platform.

An elite architect would identify that the system’s most valuable asset is not its UI or database. It is the **governance rules kernel**:

* proposal lifecycle rules
* membership eligibility rules
* office/term rules
* quorum rules
* threshold rules
* certification rules
* ratification rules
* publication rules
* record finalization rules

These rules should not be scattered across controllers, React components, or SQL triggers. They should live in a dedicated, testable domain layer.

That means something like:

* `packages/governance-core`
* `packages/policy-engine`
* `packages/workflow-engine`
* `packages/rule-definitions`

The governance kernel would be designed as a set of explicit state machines plus policy evaluators.

## 3. Application services plane

This plane orchestrates use cases.

Examples:

* submit membership application
* approve member
* create proposal
* advance proposal to committee
* open ballot
* certify result
* publish gazette item
* appoint office holder
* issue administrative notice

These are not raw CRUD actions. They are institutional commands with business meaning.

A seasoned engineer would define service-level use cases like:

* `SubmitProposal`
* `ScheduleReading`
* `OpenVote`
* `CertifyOutcome`
* `PublishRecord`
* `ApproveMembership`

Each use case would:

* validate authority
* validate current state
* apply domain rules
* produce domain events
* persist a new state
* write an audit trail

## 4. Data and record plane

This is where the system stores institutional memory.

An elite architect would distinguish between:

* operational data
* policy/rule data
* content
* immutable records
* audit events
* derived/publication views

That separation matters enormously.

For example:

Operational data:

* active proposals
* current member status
* office assignments
* in-progress ballots

Policy/rule data:

* quorum configuration
* majority thresholds
* eligibility rules
* constitutional version references
* procedural rule versions

Content:

* public pages
* articles
* explanatory documents
* announcements

Immutable records:

* certified votes
* ratified instruments
* official gazette publications
* archived proposal versions
* signed records

Audit events:

* all state transitions
* actor actions
* policy evaluations
* system-generated side effects

Derived/publication views:

* public proposal register
* office-holder register
* legislative history timeline
* gazette index
* transparency reports

A senior engineer would never let the CMS become the source of truth for constitutional processes. CMS is for content, not authority.

## 5. Identity and authorization plane

A serious governance platform must treat identity and permissions as foundational.

Given your earlier direction, an experienced engineer would likely adopt:

* Keycloak for authentication and SSO
* local application authorization in governance API
* internal role model mapped from identity claims plus application state

They would separate:

* authentication: “who are you?”
* authorization: “what may you do here, now, in this context?”
* eligibility: “are you currently qualified to take this institutional action?”

Those are not the same.

Example:

A person may be:

* authenticated successfully
* authorized generally as a member
* but ineligible to vote in a specific ballot due to membership class, suspension, timing, or rule version

That nuance is exactly the kind of thing a staff engineer catches early.

## 6. Publication and transparency plane

Ardtire’s platform has a public-institutional dimension. A senior architect would therefore design explicit publication flows.

Not everything becomes public automatically. There must be publication states and publication authorities.

Examples:

* draft
* internally approved
* certified
* ratified
* published
* archived
* superseded

This yields separate concepts:

* internal truth
* official truth
* public truth

For instance, a vote result may exist operationally before it is certified. A ratified act may exist before it is published in the Gazette. Public views should reflect the official publication status, not raw internal state.

## 7. Integration plane

Your platform already implies multiple systems:

* web app
* governance API
* Payload CMS
* Keycloak
* Decidim
* PostgreSQL
* object storage
* email/notification layer

An elite architect would define integration boundaries very carefully.

### Decidim boundary

They would decide whether Decidim is:

* merely a participation adjunct
* or a constitutional execution engine

The senior answer is usually: **Decidim should be adjunct, not sovereign**.

Meaning:

* Decidim may host public participation, consultation, comments, petitions, or some engagement workflows
* but the canonical legal outcomes should be persisted and certified by the governance platform’s own domain model

That preserves institutional control.

### CMS boundary

Payload should own:

* pages
* articles
* media
* editorial publishing workflows
* structured public content

It should not own:

* proposal authority state
* member status of record
* ballot certification outcomes
* officeholder legality

### Auth boundary

Keycloak should own:

* login
* SSO
* identity federation
* session issuance

It should not be the final source of governance permissions or membership legitimacy.

## 8. Deployment plane

A seasoned engineer thinks early about operability.

The system likely needs at least:

* `apps/web`
* `apps/gov-api`
* `apps/cms`
* PostgreSQL
* Keycloak
* object storage
* optional queue/cache
* monitoring stack

They would also define:

* environment strategy
* secret management
* migration flow
* backup and recovery
* audit retention
* deployment promotion policy
* operational runbooks

That is senior thinking: not just “can it run?” but “can it be trusted and recovered?”

---

# Part II. The exact architecture-spec set a world-class team would produce before writing code

A serious team would usually create a document set in the 25–35 document range before major implementation. For Ardtire, I would recommend a 30-document set.

## A. Executive and product foundation

### 1. `docs/vision/product-mission.md`

Defines what the platform is, why it exists, who it serves, what success means, and what it is explicitly not.

### 2. `docs/vision/institutional-model.md`

Explains Ardtire Society as an institution: bodies, roles, authority sources, public/private boundaries, and constitutional posture.

### 3. `docs/vision/personas-and-actors.md`

Defines public visitors, applicants, members, officers, editors, moderators, admins, founders, certifiers, and system actors.

### 4. `docs/vision/problem-statements-and-goals.md`

Captures the institutional problems the platform must solve and measurable product goals.

## B. Domain and governance core

### 5. `docs/domain/bounded-contexts.md`

Defines the system’s major bounded contexts: identity, membership, governance, legislative, voting, records, publication, administration.

### 6. `docs/domain/ubiquitous-language.md`

Defines the canonical vocabulary. This is one of the most important documents. It prevents endless confusion between terms like proposal, motion, act, resolution, ballot, certification, promulgation, publication, etc.

### 7. `docs/domain/domain-model.md`

Defines major entities, aggregates, value objects, relationships, and invariants.

### 8. `docs/domain/state-machines.md`

Defines every major lifecycle as an explicit state machine.

### 9. `docs/domain/governance-rules-model.md`

Explains how procedural rules are represented, versioned, evaluated, and persisted alongside outcomes.

### 10. `docs/domain/authority-model.md`

Defines sources of authority, delegated authorities, approval rights, certification rights, publication rights, and escalation boundaries.

## C. Application behavior

### 11. `docs/application/use-cases.md`

Defines the canonical use cases, commands, inputs, outcomes, permissions, preconditions, and side effects.

### 12. `docs/application/workflow-orchestration.md`

Explains how multi-step workflows are executed and coordinated across subsystems.

### 13. `docs/application/notifications-and-communications.md`

Defines notices, reminders, invitations, status changes, publication notices, and delivery boundaries.

### 14. `docs/application/error-handling-and-recovery.md`

Defines how business errors, invalid transitions, partial failures, retries, and operator interventions are handled.

## D. Data and persistence

### 15. `docs/data/canonical-data-model.md`

Defines the canonical relational data model and table-level responsibilities.

### 16. `docs/data/record-immutability-and-versioning.md`

Defines mutable vs immutable entities, snapshots, version chains, supersession rules, and record locks.

### 17. `docs/data/audit-and-event-model.md`

Defines audit log schema, event naming, event payload conventions, and traceability expectations.

### 18. `docs/data/storage-and-document-architecture.md`

Defines how files, attachments, exhibits, signed records, and rendered publications are stored.

## E. API and service architecture

### 19. `docs/api/governance-api-spec.md`

Defines the service boundary, resource model, command endpoints, query endpoints, contracts, and domain semantics.

### 20. `docs/api/service-boundaries.md`

Defines what belongs in web, governance API, CMS, Keycloak, Decidim, and shared packages.

### 21. `docs/api/integration-architecture.md`

Defines external system interactions, sync patterns, failure modes, reconciliation, and source-of-truth boundaries.

## F. Frontend and content architecture

### 22. `docs/frontend/information-architecture.md`

Defines route map, major surfaces, navigation, and experience segmentation.

### 23. `docs/frontend/ui-system-and-design-rules.md`

Defines the design system, components, accessibility, layout rules, and interaction patterns.

### 24. `docs/frontend/content-ownership.md`

Defines what content is CMS-driven versus application-driven versus derived from official records.

## G. Security and trust

### 25. `docs/security/authentication-and-authorization.md`

Defines auth, roles, claims, permission evaluation, policy checks, and server-side enforcement.

### 26. `docs/security/privacy-security-and-compliance.md`

Defines data handling, least privilege, PII boundaries, retention concerns, secrets handling, incident posture, and baseline controls.

## H. Delivery and operations

### 27. `docs/ops/deployment-architecture.md`

Defines environments, topology, services, networking assumptions, secrets, backups, and deployment flow.

### 28. `docs/ops/observability-and-runbooks.md`

Defines metrics, logs, tracing, health checks, alerts, and operational procedures.

### 29. `docs/ops/testing-strategy.md`

Defines unit, integration, contract, workflow, and end-to-end testing strategy.

### 30. `docs/ops/implementation-roadmap.md`

Defines phases, dependencies, milestones, sequencing, acceptance criteria, and delivery order.

That 30-document set is not bureaucratic overhead. It is what keeps a high-stakes platform from collapsing into ambiguity and rework.

---

# Part III. The reference architecture that could scale Ardtire into a full digital civic operating system

Now I will give you the architecture a truly experienced engineer would likely converge on for your specific project.

## 1. Monorepo shape

Given your preferences and prior decisions, I would recommend a non-Bazel polyglot monorepo with a TypeScript-first application layer and room for future adjunct services.

A strong layout would be:

```text
repo/
├─ apps/
│  ├─ web/
│  ├─ gov-api/
│  ├─ cms/
│  ├─ worker/
│  └─ docs-site/               # optional later
├─ packages/
│  ├─ database/
│  ├─ auth/
│  ├─ permissions/
│  ├─ governance-core/
│  ├─ workflow-engine/
│  ├─ legislative-domain/
│  ├─ membership-domain/
│  ├─ records-domain/
│  ├─ publication-domain/
│  ├─ gov-client/
│  ├─ cms-types/
│  ├─ ui/
│  ├─ config/
│  ├─ observability/
│  └─ test-helpers/
├─ infra/
│  ├─ docker/
│  ├─ k8s/                     # optional later
│  ├─ terraform/               # optional later
│  └─ keycloak/
├─ prisma/
├─ docs/
├─ scripts/
└─ tools/
```

This structure allows discipline without over-fragmentation.

## 2. Core runtime components

### `apps/web`

Primary user-facing application.

Responsibilities:

* public site
* member portal
* officer/admin workflows
* dashboards
* proposal drafting/editing UI
* voting UI
* records browsing
* public register interfaces

It should not implement business rules directly. It should call typed service clients.

### `apps/gov-api`

Canonical application API for domain mutations and authoritative queries.

Responsibilities:

* membership actions
* governance body actions
* proposal actions
* voting and certification actions
* records actions
* official register projections
* permission enforcement
* workflow orchestration
* domain event production
* audit logging

This is the constitutional backend.

### `apps/cms`

Payload CMS.

Responsibilities:

* editorial pages
* navigation
* announcements
* public explanatory content
* media
* structured content models
* editorial workflows

Not authoritative for governance state.

### `apps/worker`

Background processing.

Responsibilities:

* notification dispatch
* projection refresh
* publication rendering
* document generation
* reconciliation jobs
* scheduled checks
* import/export jobs

A senior engineer isolates asynchronous work here rather than hiding it inside request handlers.

## 3. Shared packages

### `packages/database`

Contains Prisma schema, database access wiring, migrations support, and canonical data access utilities.

### `packages/auth`

Encapsulates Keycloak/session integration and normalized identity extraction.

### `packages/permissions`

Implements permission evaluation, policy checks, actor-context evaluation, and role mappings.

### `packages/governance-core`

The most important package. Holds:

* domain types
* aggregates
* state machine definitions
* command handlers
* invariant checks
* rule evaluation hooks
* domain events

### `packages/workflow-engine`

Supports general lifecycle execution:

* transition definitions
* guards
* side effects
* transition history
* terminal states
* failure states

### Domain-specific packages

Such as:

* `legislative-domain`
* `membership-domain`
* `records-domain`
* `publication-domain`

These can either remain separate or live inside governance-core initially. A senior engineer may start consolidated, then split only when justified.

### `packages/gov-client`

Typed client for web-to-API communication.

### `packages/ui`

Shared design system and reusable UI primitives.

### `packages/observability`

Logging, metrics, tracing wrappers, correlation ID support, structured event helpers.

## 4. Canonical domain structure

An experienced engineer would likely choose these initial domains.

## Identity domain

Entities:

* User
* ExternalIdentity
* SessionContext
* RoleAssignment

Purpose:

* normalize actor identity
* support policy evaluation context

## Membership domain

Entities:

* MembershipApplication
* MemberProfile
* MembershipStatus
* MembershipClass
* MembershipDecision
* MembershipHistory

Key concerns:

* application intake
* review
* approval/rejection
* suspension
* reinstatement
* class changes

## Governance domain

Entities:

* GovernanceBody
* Office
* OfficeHolder
* Term
* Delegation
* AuthorityGrant

Key concerns:

* body composition
* office appointment
* authority scoping
* tenure and vacancy

## Legislative domain

Entities:

* Proposal
* ProposalVersion
* ProposalStage
* Amendment
* Reading
* CommitteeAssignment
* LegislativeOutcome

Key concerns:

* drafting
* review
* readings
* amendments
* votes
* certification
* ratification
* promulgation/publication

## Voting domain

Entities:

* Ballot
* BallotEligibilitySnapshot
* Vote
* VoteTally
* QuorumResult
* ThresholdEvaluation
* CertifiedResult

Key concerns:

* opening/closing ballots
* voter eligibility snapshotting
* tally logic
* quorum and thresholds
* result certification

## Records domain

Entities:

* OfficialRecord
* RecordEntry
* RecordArtifact
* RecordVersion
* SignatureMarker
* ArchiveIndex

Key concerns:

* institutional memory
* immutability
* archival retrieval
* traceability

## Publication domain

Entities:

* GazetteIssue
* GazetteEntry
* PublicationJob
* PublicRegisterEntry
* Notice

Key concerns:

* official publication
* sequencing
* discoverability
* public register views

## 5. State-machine-first design

A senior engineer would explicitly define the state machines early.

## Membership application example

```text
Draft
→ Submitted
→ UnderReview
→ InformationRequested
→ Resubmitted
→ Approved
→ Rejected
→ Withdrawn
```

Each transition needs:

* allowed actor roles
* input requirements
* validation rules
* side effects
* audit event emission

## Proposal example

```text
Draft
→ Submitted
→ EligibilityReview
→ CommitteeAssigned
→ InCommittee
→ ReadyForReading
→ FirstReading
→ AmendmentWindow
→ SecondReading
→ FinalVoteScheduled
→ VotingOpen
→ VotingClosed
→ ResultPendingCertification
→ Certified
→ Ratified
→ Published
```

Terminal/exception states:

* Rejected
* Withdrawn
* Lapsed
* Void
* Superseded

A seasoned engineer does this because ambiguity in workflow logic is where governance platforms fail.

## 6. Rule versioning architecture

This is one of the biggest “senior-level” moves.

The platform should not merely store outcomes. It should store the **rule set under which the outcome was produced**.

For example, when certifying a ballot, persist:

* quorum rule version
* eligibility rule version
* threshold rule version
* constitutional version reference
* procedural regulation version

That way, years later, the platform can answer:

“By what rule framework was this result certified?”

This is essential for institutional legitimacy.

## 7. Data architecture principles

A serious engineer would apply these principles.

### Principle 1: separate mutable workflow state from immutable official record

In-progress objects can evolve. Certified records should lock or snapshot.

### Principle 2: every consequential mutation emits an audit event

Not optional.

### Principle 3: public views are projections, not the raw transactional model

This improves safety and clarity.

### Principle 4: documents and rendered artifacts are first-class

This matters because governance often depends on official text artifacts, not only form data.

### Principle 5: “current status” and “historical status” must both be queryable

Institutional systems need both.

## 8. API design approach

A senior engineer would avoid purely CRUD-shaped APIs. They would prefer command-oriented semantics where appropriate.

Instead of only:

* `PATCH /proposal/:id`

they would define meaningful actions such as:

* `POST /proposals/:id/submit`
* `POST /proposals/:id/assign-committee`
* `POST /proposals/:id/open-amendment-window`
* `POST /ballots/:id/open`
* `POST /ballots/:id/close`
* `POST /results/:id/certify`
* `POST /gazette/issues/:id/publish`

This makes institutional intent explicit.

Query endpoints can remain read-oriented:

* proposal register
* public acts register
* current office holders
* member status summaries
* gazette index
* legislative history

## 9. UI architecture approach

The frontend should be segmented into surfaces, not a chaotic route soup.

### Public surface

Purpose:

* explain the institution
* show public records
* show gazette/publications
* show transparency information
* show public consultations where relevant

### Member surface

Purpose:

* profile
* membership status
* ballots
* proposal participation
* notices
* committee assignments
* personal action queue

### Officer/admin surface

Purpose:

* application review
* proposal administration
* vote administration
* records certification
* office management
* publication queue
* governance monitoring

### Editorial surface

Mostly inside CMS, possibly with selective links into application records.

A senior engineer keeps these surfaces distinct even if they share code.

## 10. Security architecture approach

At senior level, the approach would be:

* all sensitive checks server-side
* no trust in client role displays
* permissions plus state-based guards
* least privilege admin model
* action-specific audit trails
* immutable certification history
* secure secret management
* migration discipline
* backup and recovery rehearsals

Additional institutional concerns:

* prevention of hidden state changes
* reproducibility of vote outcomes
* clear actor attribution
* tamper-evident audit patterns where feasible

## 11. Testing architecture approach

A seasoned engineer would not rely mostly on UI tests. They would emphasize domain and workflow correctness.

### Unit tests

For:

* state transitions
* invariants
* rule evaluators
* permission evaluators
* tally logic

### Integration tests

For:

* API + DB behavior
* transaction boundaries
* audit event creation
* publication generation

### Contract tests

For:

* web ↔ gov-api
* gov-api ↔ Decidim
* gov-api ↔ Keycloak assumptions
* gov-api ↔ CMS published data assumptions where relevant

### Workflow tests

For end-to-end domain flows:

* membership approval
* proposal progression
* ballot lifecycle
* certification and publication

### E2E tests

Thin but important:

* public browsing
* member login
* officer actions
* publication visibility

## 12. Delivery strategy a senior engineer would recommend

They would not try to build “the whole kingdom OS” at once. They would define a disciplined implementation ladder.

## Phase 0. Foundation

Deliver:

* monorepo
* shared configs
* Keycloak integration
* Prisma schema baseline
* governance API skeleton
* web shell
* CMS shell
* CI
* observability baseline

## Phase 1. Membership foundation

Deliver:

* applications
* review
* member records
* statuses
* role assignment hooks
* admin screens
* audit trails

## Phase 2. Governance bodies and offices

Deliver:

* bodies
* offices
* terms
* office holders
* vacancy and appointment flows

## Phase 3. Legislative kernel

Deliver:

* proposals
* proposal versions
* readings
* committee states
* amendments
* transitions
* audit and registers

## Phase 4. Voting and certification

Deliver:

* ballots
* eligibility snapshots
* tally engine
* quorum and threshold evaluation
* certification records

## Phase 5. Gazette and official publication

Deliver:

* publication queue
* gazette issue generation
* public register projections
* records publication pages

## Phase 6. Decidim integration

Deliver:

* participation sync
* consultation linkage
* public process connectors
* reconciliation logic

That is how a truly seasoned engineer reduces risk while preserving long-term architecture integrity.

---

# What a senior engineer would do in the first 2–4 weeks

This is worth stating plainly.

They would not spend the first month “building screens.”

They would spend it on:

* clarifying institutional rules
* producing the 30-document architecture set
* defining the bounded contexts
* defining the canonical vocabulary
* defining state machines
* defining source-of-truth boundaries
* defining the Prisma model
* defining the governance API contracts
* defining permission architecture
* defining the implementation roadmap

Only after that would they begin serious coding.

That is not delay. That is professional risk reduction.

---

# The most important senior-level principles for Ardtire specifically

For your project, I think the most important principles are these.

## 1. Governance logic must be explicit

No hidden business rules inside UI or ad hoc handlers.

## 2. Every important lifecycle must be modeled as a state machine

This is non-negotiable for your system.

## 3. Rule versions must be stored with outcomes

Especially around eligibility, quorum, thresholds, certification, and ratification.

## 4. Institutional authority must be modeled directly

Not approximated with generic “admin” permissions.

## 5. CMS must never become constitutional source of truth

Content system and governance engine are separate concerns.

## 6. Public truth should be projection-based

Only certified/published information should appear publicly.

## 7. Auditability must be designed in from day one

Not added later.

## 8. The system should be optimized for decades of institutional memory

Not just launch-day UX.

---

# My strongest recommendation

If approaching this as a senior staff engineer for Ardtire, I would do the following in order:

**1. Freeze the constitutional and institutional model.**
Define actors, bodies, authorities, procedures, and publication model.

**2. Write the 30-document architecture set.**
This becomes the authoritative system blueprint.

**3. Produce the canonical data model and state-machine spec.**
These two artifacts will drive almost everything else.

**4. Define the governance API commands and domain events.**
This locks in the operational semantics.

**5. Implement the governance kernel before the fancy frontend.**
Because the real product is the institutional engine.

3… 2… 1… next best step:

I can now draft the **actual Ardtire-specific 30-document architecture specification set in the exact order I recommend**, starting with Document 1 and proceeding like a real staff engineer would.
