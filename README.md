# Ardtire Civic Governance Platform

The Ardtire Civic Governance Platform is the canonical digital governance system for the Ardtire Society. It is the software platform through which identity, membership, proposals, ballots, certifications, publications, records, and institutional transparency are administered in a structured, auditable, and evolvable way.

This repository is intended to house the full platform implementation and its governing documentation. The platform is designed around a domain-first, documentation-first, and audit-first engineering model. The codebase is not treated as the only source of truth. Instead, the repository contains a coordinated system of canonical product, domain, architecture, specification, API, operational, and AI-context documents that define how the platform must behave and how it is to be implemented and operated.

## Repository purpose

This repository exists to do five things well:

1. Define the institutional and software rules of the Ardtire civic governance platform.
2. Provide a clean and evolvable implementation of those rules.
3. Maintain a high-fidelity documentation system from ideation through operations.
4. Enable safe AI-assisted development without surrendering architectural control.
5. Preserve auditable engineering and governance history over time.

## What the platform does

At a high level, the platform supports the following capabilities:

- identity and access management
- membership application and review workflows
- role and authority resolution
- governance proposal drafting and versioning
- proposal stage transitions and committee handling
- ballots, voting windows, and certification workflows
- records creation, versioning, publication, and retention
- gazette and publication pipelines
- audit logging and institutional transparency
- operational tooling, release discipline, and observability

## Documentation-first operating model

This repository follows a documentation-first engineering model.

That means:

- domain rules are written down explicitly
- major architectural choices are captured in ADRs
- feature work is grounded in specs
- API contracts are documented deliberately
- operational procedures are written as runbooks
- AI context is derived from canonical documentation, not invented ad hoc

The documentation system is not an afterthought. It is part of the product.

## Top-level documentation map

The primary documentation lives under `docs/`.

- `docs/00-vision/` — why the platform exists
- `docs/01-product/` — what product capabilities exist
- `docs/02-domain/` — canonical governance and domain rules
- `docs/03-architecture/` — technical system design
- `docs/04-decisions/` — architectural decision records
- `docs/05-specs/` — implementation-facing feature specs
- `docs/06-api/` — API contracts and conventions
- `docs/07-runbooks/` — step-by-step operational procedures
- `docs/08-operations/` — steady-state operational policy
- `docs/09-ai-context/` — AI-oriented derived context artifacts
- `docs/10-changelog/` — structured project change history
- `docs/tutorials/` — guided learning material

See `docs/README.md` for the full documentation map.

## Source-of-truth model

Not every document is equally authoritative.

Canonical truth lives primarily in:

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

Derived but important material lives in:

- `docs/09-ai-context/**`
- `docs/10-changelog/**`

Narrative and educational content lives in:

- `docs/tutorials/**`
- `blog/**`
- `journal/**`

See `docs/SOURCE_OF_TRUTH_POLICY.md` for the definitive rules.

## Expected engineering posture

This repository is intended to be developed and maintained with staff/principal-level engineering discipline:

- domain-first design
- explicit invariants
- bounded contexts
- documented decision records
- typed interfaces and contracts
- safe migrations
- auditable changes
- operational clarity
- minimal ambiguity
- AI assistance constrained by repository truth

## Project status

This repository is in active structured definition and implementation.

The platform is being developed with the intent that documentation and implementation proceed in lockstep. Some documentation will exist before its corresponding code. That is expected and desirable. In this repository, well-defined future intent is preferable to undocumented improvisation.

## Getting started

At the beginning of work in this repository, read in this order:

1. `README.md`
2. `docs/README.md`
3. `docs/SOURCE_OF_TRUTH_POLICY.md`
4. `docs/DOCUMENTATION_GOVERNANCE.md`
5. `docs/02-domain/README.md`
6. `docs/03-architecture/README.md`
7. `docs/09-ai-context/PROJECT_CONTEXT.md`

Then read the feature/domain-specific documents relevant to the work you are doing.

## How to contribute

Before making substantial changes:

1. identify which domain or product area is affected
2. confirm the existing source-of-truth documents
3. write or update specs where needed
4. write or update an ADR where needed
5. implement code
6. update impacted documentation
7. update change records and AI context artifacts as required

See `CONTRIBUTING.md` for the full contributor workflow.

## Documentation scaffolding philosophy

This repository intentionally contains a large documentation surface area. That is not accidental. The Ardtire platform is institutionally sensitive, procedurally rich, and semantically dense. A shallow documentation model would not be sufficient.

The goal is not maximal paperwork. The goal is maximal clarity.

## Naming and terminology

Use repository terminology consistently. Where a term has a defined meaning, prefer the canonical glossary definition over ad hoc wording.

See:

- `docs/GLOSSARY.md`
- `docs/02-domain/glossary.md`
- `docs/01-product/glossary-product.md`

## AI-assisted development

AI assistance is permitted and expected, but only under repository rules. AI-generated content must be aligned with canonical documentation, must not invent authoritative behavior without clear support, and must not silently redefine domain or architecture boundaries.

See:

- `docs/09-ai-context/AI_RULES.md`
- `docs/SOURCE_OF_TRUTH_POLICY.md`
- `docs/DOCUMENTATION_GOVERNANCE.md`

## License / usage

Add the project’s formal license and usage terms here when finalized.
