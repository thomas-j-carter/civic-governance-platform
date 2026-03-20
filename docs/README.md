# Documentation Map

This directory contains the canonical, derived, and educational documentation for the Ardtire Civic Governance Platform.

The documentation system is structured deliberately. Different folders serve different purposes. The goal is to prevent ambiguity about where truth lives and to keep product intent, domain semantics, technical design, operational procedure, and AI context aligned over time.

## Documentation philosophy

The platform is too semantically rich and procedurally important to be governed by source code alone.

This repository therefore treats documentation as part of the platform itself.

The documentation system is designed to answer five different classes of questions:

1. why does this platform exist
2. what should it do
3. what rules govern it
4. how is it built and operated
5. how should humans and AI continue the work correctly

## Directory overview

## `00-vision/`
Strategic and foundational intent.

This folder explains why the platform exists, what it is intended to achieve, what constraints it operates under, and what is explicitly out of scope.

Use this folder when answering:
- why are we building this
- what problem are we solving
- what outcomes matter most

## `01-product/`
Product-level behavior and surface area.

This folder explains what the product does from a product and user-flow perspective.

Use this folder when answering:
- what are the major features
- what routes exist
- what journeys do users follow
- what is in MVP

## `02-domain/`
Canonical domain semantics.

This folder is one of the most important folders in the repository. It defines the meaning of actors, authority, membership, governance, publication, records, state machines, invariants, and other domain rules.

Use this folder when answering:
- what does this term mean
- what rules must always hold
- what lifecycle governs this entity
- what authority is required for this action

## `03-architecture/`
Technical system design.

This folder defines the architecture of the platform: system context, components, boundaries, trust model, identity and access architecture, data strategy, async model, integrations, and operationally relevant technical constraints.

Use this folder when answering:
- how is the system structured
- where does this responsibility belong
- what are the technical boundaries
- how do requests and data move through the platform

## `04-decisions/`
Architectural Decision Records.

This folder records consequential decisions and their rationale.

Use this folder when answering:
- why was this approach chosen
- what alternatives were considered
- what decision is currently governing

## `05-specs/`
Implementation-facing feature specifications.

This folder defines feature behavior in an implementable way. Specs should connect product and domain intent to code and tests.

Use this folder when answering:
- what exactly should this feature do
- what validations and permissions apply
- what acceptance criteria must be satisfied

## `06-api/`
API contracts and conventions.

This folder contains API overview, conventions, authentication model, error model, versioning policy, cross-cutting API behaviors, and machine-readable contracts.

Use this folder when answering:
- how should clients call the platform
- what resource model exists
- what errors and DTOs should be expected

## `07-runbooks/`
Task-oriented procedures.

These are step-by-step instructions for recurring operational tasks such as local development, deployments, rollback, secret rotation, restore, and incident response.

Use this folder when answering:
- how do I perform this operational task
- what exact steps should I follow
- how do I verify success safely

## `08-operations/`
Steady-state operational policy.

This folder defines how the system is monitored, logged, audited, backed up, retained, and run in practice.

Use this folder when answering:
- how do we operate this system over time
- what is the observability model
- what is the incident model
- what are the reliability expectations

## `09-ai-context/`
AI-oriented derived context.

This folder contains AI-friendly summaries, inventories, state snapshots, and continuation artifacts. These are important, but they are generally derived from canonical docs and repo state rather than being the primary source of truth.

Use this folder when:
- handing off to a new AI session
- reestablishing implementation context
- summarizing current state
- guiding AI-generated work within repository rules

## `10-changelog/`
Structured change history.

This folder captures human-readable change records and releases over time.

Use this folder when answering:
- what changed
- when did it change
- what is unreleased
- what shipped in a given release

## `tutorials/`
Guided educational material.

This folder is for onboarding and teaching. Tutorials are intentionally non-canonical. They explain how to work with the system, but they do not define official truth by themselves.

Use this folder when:
- onboarding a contributor
- demonstrating a workflow
- teaching the preferred implementation approach

## Related non-doc folders

## `blog/`
Long-form narrative or outward-facing explanatory writing.

## `journal/`
Internal narrative build history, reflections, and day-by-day engineering notes.

## `.changes/`
Structured change manifests that connect implementation changes to documentation, AI context, and changelog updates.

## How to read this repository

A new engineer should usually read in this order:

1. `README.md`
2. `docs/SOURCE_OF_TRUTH_POLICY.md`
3. `docs/DOCUMENTATION_GOVERNANCE.md`
4. `docs/00-vision/README.md`
5. `docs/01-product/README.md`
6. `docs/02-domain/README.md`
7. `docs/03-architecture/README.md`
8. `docs/09-ai-context/PROJECT_CONTEXT.md`

Then move into the specific feature, domain, or architectural area being worked on.

## Canonical vs derived vs narrative

The most important rule in this documentation system is that not every document has equal authority.

Canonical truth primarily lives in:

- `README.md`
- `docs/00-vision/**`
- `docs/01-product/**`
- `docs/02-domain/**`
- `docs/03-architecture/**`
- `docs/04-decisions/**`
- `docs/05-specs/**`
- `docs/06-api/**`
- `docs/07-runbooks/**`
- `docs/08-operations/**`

Derived truth-supporting material lives in:

- `docs/09-ai-context/**`
- `docs/10-changelog/**`

Narrative and educational content lives in:

- `docs/tutorials/**`
- `blog/**`
- `journal/**`

See `SOURCE_OF_TRUTH_POLICY.md` for the definitive policy.

## Expected maintenance model

Documentation is expected to evolve with the codebase.

For meaningful changes:
- update the relevant canonical docs
- update or create a change manifest
- refresh derived AI context where needed
- preserve consistency across related areas

The documentation system should get clearer over time, not noisier.

## Final principle

This documentation tree exists to reduce ambiguity, reduce drift, improve review quality, preserve institutional memory, and enable disciplined development of a complex civic governance platform.
