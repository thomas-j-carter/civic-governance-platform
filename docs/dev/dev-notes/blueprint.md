# Execution blueprint for the Ardtire digital governance platform

## 1) Strategic frame

Treat this as a constitutional operations platform, not a website project.

That means the build order is:

1. institutional model
2. governance workflows
3. authority and records integrity
4. public/member/admin surfaces
5. automation and scale



The principal-engineer objective is to make Ardtire operable as a trustworthy digital institution with explicit rules, durable records, and auditable outcomes.


---

## 2) Target product shape

Use a four-surface model.

A. Public institutional surface

Purpose:

- present Ardtire publicly
- publish official notices, governance outcomes, registers, gazette items, constitutional texts, officer pages, diaries/news


Characteristics:

- public read access
- CMS-backed editorial content
- selected canonical governance records rendered publicly


B. Member surface

Purpose:

- applications
- membership status
- member-facing notices
- proposal review/voting access where authorized
- internal records visibility by scope


Characteristics:

authenticated

permissions and visibility rules

role-aware experience


C. Administrative operations surface

Purpose:

review queues

governance administration

officer/body management

certification/publication control

audit and exception handling


Characteristics:

strict authorization

strong traceability

operator ergonomics matter


D. Canonical governance core

Purpose:

authoritative state transitions

proposal/voting/certification/ratification logic

records lineage

rule version enforcement

audit/event emission


Characteristics:

API-first

explicit state machines

database-backed source of truth



---

1) Recommended architecture

Based on the current direction, the shape I recommend is:

Applications

apps/web — TanStack Start with SolidJS; public/member/admin UX

apps/gov-api — Hono TypeScript service; canonical governance mutations

apps/cms — Payload CMS; editorial/public content management


Core services and systems

Keycloak — authentication, SSO, identity brokering, realm/client/role management

PostgreSQL — canonical transactional data store

Prisma — canonical schema and application ORM

Decidim — optional civic participation boundary for selected public participation workflows, not source of truth for Ardtire governance state

async jobs/queues — notifications, publication generation, indexing, projections


Core packages

packages/domain

packages/authz

packages/contracts

packages/gov-client

packages/ui

packages/config

packages/test-helpers

packages/workflows

packages/audit


Architectural rule

All authoritative governance state changes flow through gov-api.
Not through CMS.
Not directly through the web app.
Not via random scripts.


---

Phase plan

Phase 0 — Institutional modeling and decision freeze

Goal: remove ambiguity before broad implementation.

Deliverables

project context

institutional scope statement

authority model

actor model

public/private information model

governance lifecycle specs

records model

publication model

initial ADR set

initial schema draft

initial API surface draft


Questions that must be frozen

What is Ardtire Society in-system today?

What governance bodies exist now?

What kinds of membership exist now?

What outcomes require certification?

What becomes public automatically, manually, or never?

Which rules are already authoritative?

Which domains are explicitly deferred?


Exit criteria

You can answer, in writing:

who may do what

under what rule

with what evidence

producing what record

visible to whom

finalized how



---

Phase 1 — Foundation platform

Goal: establish operational skeleton without overbuilding.

Deliverables

monorepo scaffold

auth integration with Keycloak

base app shells: public, member, admin

canonical database setup

audit/event infrastructure

CMS integration

shared contracts/types/config

initial admin navigation and review queues

observability baseline


Core capabilities

sign-in / sign-out / session handling

role mapping

profile and identity shell

admin shell with protected routes

content-managed public pages

audit event recording

health/readiness/dependency checks


Exit criteria

A real user can authenticate, an admin can operate a protected control surface, and the system can record and trace privileged actions.


---

Phase 2 — Membership domain

Goal: make the institution capable of admitting and managing members.

Deliverables

membership application model

application intake flow

review workflow

approval/rejection workflow

membership status lifecycle

member classes

suspension/reinstatement support

member directory visibility rules

notification hooks


Core lifecycle

draft → submitted → under_review → approved / rejected / returned → active_member with post-admission states like: active → suspended → reinstated → ended

Critical invariants

no active membership without approval event

no hidden status change without audit

all decisions attributable to actor + timestamp + reason

visibility rules enforced consistently


Exit criteria

Ardtire can process membership from intake to status management through a governed workflow.


---

Phase 3 — Governance core

Goal: make the institution capable of lawful internal decision-making.

Deliverables

bodies

offices

office holders

terms

sessions/meetings

agendas

proposals

amendments

voting

outcome certification

decision registers


Core lifecycle examples

Proposal

draft → submitted → admissibility_review → admitted / rejected → amendment_window → scheduled → voting_open → voting_closed → certified → ratified / failed → published

Appointment

vacant → nomination → review → confirmed / declined → active_term → ended

Meeting item

draft_agenda_item → placed_on_agenda → in_session → resolved / deferred / withdrawn

Critical invariants

no voting without admissibility

no certification before closure of voting

no publication of official outcome before certification

office holder changes must be event-backed

rule versions must be persisted on governed outcomes


Exit criteria

Ardtire can run a proposal end-to-end through a controlled governance workflow.


---

Phase 4 — Publication, records, and gazette

Goal: make the institution legible and historically trustworthy.

Deliverables

canonical records registry

document/version lineage

certification records

publication events

official notices

gazette surface

public register views

supersession/replacement handling

archival status model


Core principle

Separate:

canonical governance records from

editorial/public explanatory content


Public record rules to define

what is public by default

what is delayed-public

what is internal-only

when a draft becomes official

how corrections are represented

how historical versions are displayed


Exit criteria

A public visitor can see trustworthy official outputs, and an operator can trace each one back to its authoritative source record.


---

Phase 5 — Procedural maturity and hardening

Goal: move from “working” to “institution-grade.”

Deliverables

rule version engine hardening

procedural policy evaluation layer

exception handling flows

stronger audit/reporting

operational dashboards

certification tools

historical consistency checks

migration/backfill utilities

test matrix completion


Exit criteria

The system is stable under rule change, operator turnover, and procedural edge cases.


---

Recommended 90-day implementation plan

Days 1–15

freeze project context and domain definitions

write ADRs

establish repo structure

scaffold apps/packages

connect Keycloak, DB, Prisma, Payload

create initial contracts and health checks


Days 16–30

implement base authz model

implement audit/event primitives

build public/member/admin route shells

implement membership application schema and APIs

build membership review queue


Days 31–45

finish membership lifecycle

add notifications/projections

begin bodies/offices/terms schema

implement governance-admin pages

write proposal workflow spec into code contracts


Days 46–60

implement proposals and amendments

implement agenda/session scheduling

implement vote opening/closing flows

add policy checks and transition guards


Days 61–75

implement certification layer

implement public register and gazette pipeline

connect selected canonical records to public rendering

add richer audit and reporting


Days 76–90

test hardening

operational runbooks

back-office exception tools

security review

release candidate for phase-1 institutional operation



---

Exact artifact set a principal engineer would want

Governance and product docs

docs/ai/PROJECT_CONTEXT.md

docs/ai/ARCHITECTURE_SUMMARY.md

docs/domain/ACTOR_MODEL.md

docs/domain/AUTHORITY_MODEL.md

docs/domain/MEMBERSHIP_MODEL.md

docs/domain/GOVERNANCE_MODEL.md

docs/domain/RECORDS_MODEL.md

docs/domain/PUBLICATION_MODEL.md

docs/domain/STATE_MACHINES.md

docs/domain/RULE_VERSIONING.md


Technical design docs

docs/architecture/SYSTEM_CONTEXT.md

docs/architecture/BOUNDED_CONTEXTS.md

docs/architecture/INTERACTION_DIAGRAM.md

docs/architecture/IDENTITY_AND_ACCESS.md

docs/architecture/AUDIT_AND_OBSERVABILITY.md

docs/architecture/ASYNC_AND_JOBS.md

docs/architecture/CMS_BOUNDARY.md

docs/architecture/DECIDIM_BOUNDARY.md

docs/architecture/DATABASE_STRATEGY.md

docs/architecture/API_CONVENTIONS.md


Delivery docs

docs/ai/REPO_BLUEPRINT.md

docs/ai/FILE_IMPLEMENTATION_ORDER.md

docs/ai/AI_RULES.md

docs/delivery/ROADMAP.md

docs/delivery/MILESTONES.md

docs/delivery/TEST_STRATEGY.md

docs/delivery/DEFINITION_OF_DONE.md

docs/delivery/RISK_REGISTER.md


ADRs

docs/adr/001-gov-api-is-canonical.md

docs/adr/002-cms-is-not-canonical-state.md

docs/adr/003-rule-versions-persisted-on-outcomes.md

docs/adr/004-governance-lifecycles-are-state-machines.md

docs/adr/005-keycloak-authoritative-authentication.md

docs/adr/006-prisma-canonical-schema.md



---

Recommended repo blueprint

.
├── apps
│   ├── web
│   ├── gov-api
│   └── cms
├── packages
│   ├── audit
│   ├── authz
│   ├── config
│   ├── contracts
│   ├── domain
│   ├── gov-client
│   ├── test-helpers
│   ├── ui
│   └── workflows
├── prisma
│   ├── schema.prisma
│   ├── migrations
│   └── seed
├── docs
│   ├── adr
│   ├── ai
│   ├── architecture
│   ├── delivery
│   ├── domain
│   └── runbooks
├── infra
│   ├── docker
│   ├── k8s
│   └── scripts
├── tools
│   ├── codegen
│   ├── lint
│   └── validation
└── .github
    └── workflows


---

Team topology a principal engineer would use

Even if one person is doing much of the work, this is the conceptual split.

Principal/staff engineering lane

architecture

bounded contexts

lifecycle modeling

decision quality

schema/API integrity

implementation sequencing


Product/governance design lane

procedural correctness

actor journeys

public/private rules

institutional legitimacy requirements


Platform/backend lane

gov-api

authz

Prisma/Postgres

jobs/events

audit/observability


Frontend lane

public/member/admin UX

route architecture

forms/tables/workflows

policy-aware presentation


Content/editorial lane

Payload modeling

public content operations

publishing workflows

editorial governance


Operations/security lane

deployment

backups

secrets

logging

incident response

environment discipline


Keep these concerns separate even if the same human wears multiple hats.


---

Core engineering standards

1. Every governed workflow is a state machine

No loose booleans for serious process control.

2. Every important action emits an audit event

Actor, action, object, time, reason, correlation ID.

3. Every major outcome persists governing rule version

Especially eligibility, quorum, thresholds, ratification logic.

4. Every canonical mutation goes through a single application boundary

gov-api.

5. Public rendering never invents canonical truth

It only reflects or derives from authoritative records.

6. Exceptions are modeled explicitly

Not hidden in admin folklore.

7. Deferred domains stay deferred

Do not let phase 4 ideas contaminate phase 1 execution.


---

What to implement first, in exact order

Batch 1 — foundations

monorepo scaffold

shared config

environment validation

Prisma base schema

auth integration

base route protection

audit/event primitives


Batch 2 — membership

application tables

status transitions

review actions

member directory policy

admin queue UI

notifications


Batch 3 — governance skeleton

bodies

offices

office holders

sessions/agendas

proposal draft model

amendment model


Batch 4 — decision engine

admissibility review

vote scheduling

vote open/close

tally/certification

outcome recording


Batch 5 — publication

canonical record views

public registers

gazette entries

publication events

historical lineage


Batch 6 — hardening

procedural versioning

richer authorization

reporting

observability

exception tooling

full test coverage for critical workflows



---

Definition of done for each major slice

We will not call a slice “done” just because the UI exists.

A slice is done when:

the domain model is documented

the schema exists

transitions are explicit

permissions are enforced

audit events are emitted

tests cover happy path and critical invalid paths

the UI works

operational runbook exists

public/private visibility is correct

errors and exception paths are understandable


That standard prevents false progress.


---

High-risk areas to watch early

Procedural ambiguity

Mitigation: freeze source-of-truth docs and ADRs before deeper build-out.

CMS creep into canonical domain logic

Mitigation: strict boundary; CMS for content, gov-api for state.

Authorization oversimplification

Mitigation: start with RBAC plus policy guards.

Rule changes breaking historical interpretation

Mitigation: version rules and persist references on outcomes.

Overbuilding deferred constitutional/state-like domains too early

Mitigation: milestone discipline and written non-goals.

Admin operations becoming opaque

Mitigation: strong audit logs, event traces, reason fields, review queues.


---


For Ardtire specifically, the smartest path is:

build a narrow but fully legitimate institutional core first.

That core is:

identity

membership

bodies/offices

proposals

voting

certification

publication

records


Everything else should orbit that core until it is stable.

The wrong move would be trying to build:

a huge public site

elaborate constitutional abstractions

advanced participatory tooling

many future-state governance modules


before the institutional core is operational and trustworthy.


---

Immediate next move

The next best step is to produce the authoritative planning packet and freeze it as the implementation source of truth, in this order:

1. PROJECT_CONTEXT.md


2. ARCHITECTURE_SUMMARY.md


3. DOMAIN_MODEL.md


4. AUTHORITY_MODEL.md


5. STATE_MACHINES.md


6. RECORDS_MODEL.md


7. PUBLICATION_MODEL.md


8. API_SPEC.yaml


9. schema.prisma


10. REPO_BLUEPRINT.md


11. FILE_IMPLEMENTATION_ORDER.md


12. TEST_STRATEGY.md



Then implementation begins from that frozen packet, not from drifting conversation memory.
