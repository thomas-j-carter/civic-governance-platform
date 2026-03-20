# Documentation Governance

This document defines how documentation in the Ardtire Civic Governance Platform repository is created, updated, reviewed, promoted, and retired.

The purpose of documentation governance is not bureaucracy for its own sake. The purpose is to preserve clarity and consistency in a platform whose domain model, procedural rules, and institutional semantics are too important to be left implicit.

## Objectives

The documentation governance model exists to ensure that repository documentation remains:

- accurate
- coherent
- navigable
- durable
- reviewable
- aligned with implementation
- aligned with institutional intent
- useful to both humans and AI

## Documentation classes

Repository documentation is divided into three high-level classes.

## 1. Canonical documentation
These documents define official repository truth.

Examples:
- vision docs
- product docs
- domain docs
- architecture docs
- ADRs
- specs
- API docs
- runbooks
- operations docs

## 2. Derived documentation
These documents are produced or curated from canonical truth and repo state.

Examples:
- AI context summaries
- inventories
- current state summaries
- route inventories
- changelog summaries

## 3. Narrative / educational documentation
These documents help explain, teach, or record the project journey, but do not govern repository truth by themselves.

Examples:
- tutorials
- blog posts
- journal entries

## Documentation authority rule

When documents disagree, authority is determined by the repository source-of-truth model, not by convenience.

The general precedence is:

1. canonical docs
2. derived docs
3. narrative / educational docs

Within canonical docs, more specific governing documents generally override broader summaries when the two are in legitimate tension, but contradictions should be resolved explicitly rather than tolerated.

## Required documentation updates

A change must update documentation when it affects any of the following:

- strategic intent
- product behavior
- domain meaning
- lifecycle rules
- invariants
- architecture boundaries
- API contracts
- operational procedures
- environment variables
- deployment behavior
- reliability or incident handling expectations
- AI continuation context

## Change categories and required documentation response

## Product behavior changes
Must update one or more of:
- `docs/01-product/**`
- `docs/05-specs/**`
- `docs/06-api/**`

## Domain rule changes
Must update one or more of:
- `docs/02-domain/**`
- `docs/05-specs/**`
- possibly `docs/04-decisions/**`

## Architecture changes
Must update one or more of:
- `docs/03-architecture/**`
- `docs/04-decisions/**`
- `docs/09-ai-context/**`

## API changes
Must update one or more of:
- `docs/06-api/**`
- relevant specs in `docs/05-specs/**`
- relevant AI-context inventories

## Operational changes
Must update one or more of:
- `docs/07-runbooks/**`
- `docs/08-operations/**`

## Contributor workflow changes
Must update one or more of:
- `README.md`
- `CONTRIBUTING.md`
- `docs/DOCUMENTATION_GOVERNANCE.md`

## Documentation ownership model

Documentation ownership is functional, not merely file-based.

The effective ownership model is:

- vision/product docs are owned by product and system-shaping decision makers
- domain docs are owned by domain architects and maintainers
- architecture docs are owned by staff/principal engineers or architecture owners
- ADRs are owned by the decision-makers responsible for the decision
- specs are owned by the feature owner or implementation lead
- API docs are owned by API maintainers
- runbooks and operations docs are owned by platform/operations maintainers
- AI-context docs are owned by the repository governance process and supporting tooling

In small teams, one person may occupy multiple roles. The ownership rule still matters because it clarifies the nature of review required.

## Review expectations

Documentation should be reviewed in proportion to its authority.

## High-review documentation
These should receive careful review:
- domain docs
- architecture docs
- ADRs
- specs
- API contracts
- operational procedures

## Moderate-review documentation
These should still be reviewed, but usually with lighter scrutiny:
- changelog updates
- AI context updates
- tutorial refinements

## Local editing rule

Contributors should prefer updating the most local, most canonical relevant document rather than compensating elsewhere.

Example:
If a domain invariant changes, update the domain document that defines the invariant. Do not merely mention the change in a tutorial, PR description, or code comment.

## Documentation lifecycle states

A document may be in one of the following practical states:

- draft
- active
- deprecated
- superseded
- archived

These states do not need to appear in every document frontmatter, but the concept matters.

## Draft
The document is under active formation and is not yet fully authoritative.

## Active
The document is current and governs repository understanding in its area.

## Deprecated
The document remains present but should no longer be used as the preferred reference.

## Superseded
The document has been replaced by a newer source.

## Archived
The document is retained for history only.

## ADR-specific status model

ADRs should use explicit statuses such as:
- proposed
- accepted
- superseded
- rejected
- deprecated

## Required qualities of canonical docs

Canonical documents should strive to be:

- explicit about scope
- explicit about uncertainty
- internally structured
- consistent in terminology
- stable in meaning
- amendable without chaos
- written for future maintainers

Canonical docs should not attempt to be literary. They should attempt to be durable.

## What documentation should not become

Documentation in this repository should not become:

- a dumping ground for half-decided ideas
- a mirror copy of chat history
- a substitute for actual decisions
- a contradictory maze of overlapping truth claims
- a set of stale placeholders presented as complete
- a collection of tutorial prose masquerading as policy

## AI-generated documentation policy

AI may assist in drafting documentation, but repository truth must still be governed by repository process.

AI-generated documentation must:
- align with canonical sources
- clearly preserve distinctions between settled and unsettled material
- avoid invented specifics unsupported by repo truth
- avoid silently redefining architecture, domain rules, or policy
- be reviewed proportionate to its authority level

AI should be treated as an accelerator, not as the sovereign author of repository truth.

## Promotion rule

A document, summary, or idea should only be treated as canonical after it is placed in the proper canonical location and reviewed appropriately.

Conversation alone does not make truth.
Draft text alone does not make truth.
A generated file alone does not make truth.

Truth becomes repository truth when it is intentionally placed and maintained in the correct source-of-truth layer.

## Retirement rule

When a canonical document becomes obsolete, it should not simply be abandoned in place if that would create confusion.

Preferred retirement actions:
- supersede it explicitly
- move it to a deprecated or archived location if appropriate
- update references
- explain what replaced it

## Drift prevention rule

If code and docs diverge, the divergence must be resolved intentionally.

The acceptable resolutions are:
- update code to match docs
- update docs to match approved new reality
- write an ADR or spec clarifying the transition
- mark the affected doc as draft or superseded where justified

The unacceptable resolution is to leave the disagreement unaddressed.

## Minimal required governance loop

For any substantial change, the minimum governance loop is:

1. identify impacted canonical areas
2. update or create spec and/or ADR if needed
3. implement or revise code
4. update canonical docs
5. record the change
6. refresh derived docs
7. review for consistency

## Final doctrine

The documentation system exists to make the platform understandable, governable, operable, and evolvable.

Good documentation governance does not slow the project down.
It prevents the project from becoming incoherent.
