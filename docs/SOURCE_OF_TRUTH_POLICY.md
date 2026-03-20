# Source of Truth Policy

This document defines where truth lives in the Ardtire Civic Governance Platform repository and how conflicts between artifacts must be resolved.

The repository contains many useful artifacts, but they do not all have equal authority. This policy exists to prevent ambiguity, drift, and accidental redefinition of the system through less authoritative channels.

## Why this policy exists

In a complex system, confusion often comes from one of four failures:

1. multiple documents appear to define the same thing
2. old summaries continue to circulate after truth has changed
3. implementation details are mistaken for domain truth
4. narrative or AI-generated artifacts are treated as canonical

This policy is designed to prevent those failures.

## Source-of-truth categories

Repository artifacts are divided into the following categories:

## 1. Canonical
These define official project truth in their area.

## 2. Derived
These summarize, compile, index, or restate canonical truth plus repository state.

## 3. Narrative / educational
These explain, teach, or record history but do not define governing truth by themselves.

## 4. Local implementation artifacts
These support implementation and usage close to code but do not replace canonical documentation for broader truth.

## Canonical truth locations

The following locations are canonical unless a more specific rule inside them says otherwise:

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

## Derived truth-supporting locations

These are important and expected to be maintained, but they are usually derived from canonical truth and repo state:

- `docs/09-ai-context/**`
- `docs/10-changelog/**`

These documents are highly useful, but when they conflict with canonical docs, canonical docs win unless the canonical docs are clearly stale and in need of correction.

## Narrative and educational locations

These are explicitly non-canonical unless a specific document says otherwise:

- `docs/tutorials/**`
- `blog/**`
- `journal/**`

These may explain and illuminate, but they must not be used as the sole authority for product, domain, architecture, API, or operational truth.

## Code and comments

Source code is authoritative for the behavior that is currently implemented, but code alone is not the canonical authority for all classes of truth.

The rule is:

- code is authoritative for exact current implementation behavior
- canonical docs are authoritative for intended system meaning, boundaries, contracts, policies, and operations
- where implementation and canonical intent diverge, the divergence must be resolved intentionally

Inline comments and docstrings are useful, but they do not supersede canonical domain, architecture, or policy documents.

## Practical precedence rules

When two artifacts disagree, resolve using the following order.

## Domain meaning
Primary authority:
1. `docs/02-domain/**`
2. relevant accepted ADRs
3. relevant feature specs
4. implementation
5. derived AI context
6. tutorials/blog/journal

## Product behavior
Primary authority:
1. `docs/01-product/**`
2. `docs/05-specs/**`
3. `docs/06-api/**` where applicable
4. implementation
5. derived AI context
6. tutorials/blog/journal

## Architecture
Primary authority:
1. `docs/03-architecture/**`
2. accepted ADRs in `docs/04-decisions/**`
3. specs where implementation detail is feature-specific
4. implementation
5. derived AI context
6. tutorials/blog/journal

## API contract
Primary authority:
1. `docs/06-api/openapi.yaml`
2. `docs/06-api/**`
3. relevant specs in `docs/05-specs/**`
4. implementation
5. examples and tutorials

## Operational procedure
Primary authority:
1. `docs/07-runbooks/**`
2. `docs/08-operations/**`
3. implementation scripts and automation
4. changelog or journal references

## AI continuation context
Primary authority:
1. canonical docs
2. repo structure and implementation state
3. `docs/09-ai-context/**`

AI context docs are for acceleration, not for replacing canonical sources.

## Specificity rule

When two canonical documents both speak to the same topic, the more specific governing document usually takes precedence over the more general summary.

Examples:
- a domain-specific invariant document may govern over a broad project summary
- an accepted ADR may govern a particular architectural choice over a generic README statement
- a detailed API convention may govern over a looser product description

That said, true contradiction should be resolved, not normalized.

## Freshness rule

A newer document is not automatically more authoritative than an older one.

Authority comes from document class and repository role, not just timestamp.

A recent blog post does not override an older accepted ADR.
A generated AI summary does not override a canonical domain document.
A code comment does not override the API contract.

## Draft status rule

Draft materials are useful but should not be treated as final authority where active canonical docs exist.

If a draft is intended to replace an active source, the transition should be explicit.

## Chat and conversation rule

Conversation history, planning notes, and generated drafts outside the repository are useful inputs, but they are not repository truth until intentionally placed in the correct canonical location.

This is especially important for AI-assisted workflows.

## Change propagation rule

When a canonical truth changes, the change must be propagated to impacted derived artifacts.

Examples:
- updated routes should refresh route inventory
- updated architecture should refresh architecture summary
- new features should update current state summaries and changelog material
- changed env vars should update env references

Derived artifacts should not be manually allowed to drift indefinitely.

## Conflict resolution procedure

When artifacts disagree:

1. identify the truth category involved
2. identify the highest-authority artifact for that category
3. determine whether the lower-authority artifact is stale or the higher-authority artifact is incomplete
4. update the repository so that the conflict is resolved explicitly
5. do not leave the conflict to interpretation

## Anti-patterns prohibited by this policy

The following are specifically discouraged:

- treating AI summaries as canonical
- treating tutorials as policy
- treating code comments as architecture governance
- redefining domain rules only in code
- relying on PR descriptions as durable truth
- keeping stale docs active because implementation moved faster

## Summary doctrine

The repository should make it easy to answer:
- what is true
- where that truth is defined
- what is merely derived
- what is merely explanatory

The point of this policy is not rigidity.
The point is to keep the project legible as it grows.
