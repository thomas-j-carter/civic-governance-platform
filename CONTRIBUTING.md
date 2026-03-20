# Contributing to the Ardtire Civic Governance Platform

This repository is developed under a documentation-first, domain-first, and audit-first engineering model. Contributions are expected to preserve clarity, institutional consistency, and long-term maintainability.

This is not a repository where implementation should race ahead of meaning. In this project, semantic correctness and explicitness matter more than raw velocity.

## Core contribution principles

Every contribution should preserve or improve the following:

- domain clarity
- architectural coherence
- institutional auditability
- explicit source-of-truth boundaries
- documentation coverage
- operational safety
- implementation quality
- future maintainability

## Required mindset

Contributors should behave as if they are maintaining both:

1. a production software platform, and
2. a long-lived institutional system of record

That means:

- avoid accidental ambiguity
- avoid hidden assumptions
- avoid undocumented behavior
- avoid architecture drift
- avoid local optimizations that damage global coherence

## Before you start work

Before beginning non-trivial work:

1. identify the affected product and domain area
2. read the relevant canonical docs
3. confirm whether an ADR is needed
4. confirm whether a spec is needed
5. confirm the relevant API and operational impacts
6. identify whether AI context artifacts will need refresh

At minimum, contributors should read:

- `README.md`
- `docs/README.md`
- `docs/SOURCE_OF_TRUTH_POLICY.md`
- `docs/DOCUMENTATION_GOVERNANCE.md`

Then read the area-specific documents for the work being done.

## Canonical workflow

The default contribution workflow is:

1. understand the problem
2. identify the canonical source-of-truth docs
3. write or refine the relevant spec
4. write or refine an ADR if the decision is consequential
5. implement the code
6. update impacted docs
7. record the change in `.changes/`
8. refresh derived artifacts where applicable
9. validate the repo state
10. submit the change for review

## When an ADR is required

Create or update an ADR when the change affects any of the following:

- major architecture boundaries
- service ownership or decomposition
- data ownership or data flow
- identity and access architecture
- external system boundaries
- caching or consistency model
- API design conventions
- dependency strategy
- deployment topology
- a decision that future engineers are likely to revisit

Do not create ADRs for trivial implementation details.

## When a spec is required

Create or update a spec when the change affects:

- user-visible behavior
- domain workflows
- feature lifecycle rules
- validation rules
- authorization behavior
- API contract semantics
- failure and retry behavior
- state transition behavior
- acceptance criteria for a feature

## Documentation responsibilities

If a code change affects repository truth, the corresponding docs must also be updated.

Examples:

- a domain rule change should update `docs/02-domain/**`
- a feature behavior change should update `docs/05-specs/**`
- an API contract change should update `docs/06-api/**`
- an operational change should update `docs/07-runbooks/**` or `docs/08-operations/**`
- a major design change may require an ADR in `docs/04-decisions/**`

## `.changes/` requirement

Every non-trivial change should have a corresponding entry or generated manifest in `.changes/` unless the repository’s process later automates this completely.

The change record should describe:

- what changed
- which domains were affected
- whether the change is user-visible
- whether the change affects operations
- which docs should be impacted
- whether the change is breaking or migration-sensitive

## Commit discipline

Commits should be:

- focused
- reviewable
- coherent
- scoped to one logical change where possible

Avoid commits that mix unrelated concerns.

Preferred commit types include:

- `feat:`
- `fix:`
- `refactor:`
- `docs:`
- `test:`
- `chore:`
- `perf:`
- `security:`

Examples:

- `feat(governance): add proposal stage transition actions`
- `docs(domain): refine publication lifecycle invariants`
- `refactor(api): separate proposal write DTOs from read DTOs`

## Pull request expectations

A pull request should make it easy for a reviewer to answer:

- what changed
- why it changed
- what source-of-truth docs were consulted
- whether an ADR was needed
- whether specs were updated
- whether the API contract changed
- whether operations are affected
- what remains unresolved

A good PR description should include:

- summary
- motivation
- impacted domains
- impacted docs
- validation performed
- known gaps or follow-ups

## Code quality expectations

Code in this repository should prefer:

- explicit names over clever abbreviations
- deterministic behavior over implicit magic
- typed boundaries over loose contracts
- narrow interfaces over sprawling ones
- readable control flow over compressed trickery
- meaningful tests over noisy quantity
- comments that explain non-obvious intent, not obvious syntax

## Documentation quality expectations

Documentation should be:

- precise
- durable
- structured
- explicit about uncertainty
- consistent in terminology
- written for future maintainers, not just current authors

Avoid:

- vague placeholders presented as final truth
- contradictory wording across documents
- casual terminology where canonical terms exist
- burying key rules in chat history instead of docs

## AI-assisted contribution rules

AI may assist with drafting, implementation, summarization, and scaffolding, but the contributor remains responsible for correctness.

AI-generated output must not:

- invent domain rules not grounded in canonical docs
- change architecture boundaries silently
- redefine permissions or workflows without documentation
- introduce dependencies against policy
- produce fake completeness claims
- treat derived AI context docs as more authoritative than canonical docs

When using AI, contributors should anchor the work in:

- `docs/09-ai-context/*`
- the relevant canonical docs
- current repo structure
- current specs and ADRs

## Review criteria

Reviewers should evaluate:

- semantic correctness
- fit with existing architecture
- fit with existing domain model
- clarity of docs
- contract and boundary discipline
- operational implications
- migration risk
- auditability

The question is not only “does it work?”  
The question is also “does it belong here, in this form, under these rules?”

## Do not do the following

Do not:

- add major behavior without corresponding documentation
- merge architecture drift without explicit acknowledgment
- treat tutorial material as canonical truth
- change domain meaning via code comments only
- introduce hidden policy in controllers or UI code
- bypass documented invariants because the implementation seems easier
- use “temporary” ambiguity as a permanent design strategy

## Escalation rule

If the docs and code disagree, stop and resolve the disagreement. Do not proceed by guessing which one is correct unless the discrepancy is trivial and clearly accidental.

The repository should move toward consistency, not rely on interpretation.

## Final standard

Contributing here means helping maintain a system that is meant to be:

- institutionally serious
- technically rigorous
- operationally trustworthy
- understandable by future engineers
- compatible with disciplined AI assistance
