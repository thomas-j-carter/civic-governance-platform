# docs/dev/README.md

# Internal Development Documentation

This subtree is the internal engineering and product documentation corpus.

It is the primary internal human-readable source of truth for system design, domain modeling, specs, operations, and implementation guidance.

## Section map

- `00-vision` — mission, goals, scope, constraints, stakeholders, principles
- `01-product` — IA, personas, route map, journeys, feature map, UX principles
- `02-domain` — domain models, authority, invariants, identifiers, temporal rules
- `03-architecture` — system context, boundaries, deployment, storage, security, request lifecycle
- `04-decisions` — ADRs and decision index
- `05-specs` — behavior-level specifications by domain
- `06-api` — API-facing internal reference material and OpenAPI sources
- `07-runbooks` — operational and deployment procedures
- `08-operations` — observability, SLOs, environments, backups, incident management
- `09-adr` — optional future split if ADR volume grows
- `10-changelog` — internal release/change history
- `application` / `governance` / `implementation` / `infrastructure` — deeper implementation or domain-specific internal material
- `_meta` — governance metadata, ownership, canonical maps, publishing rules

## Canonicality rules

A document in `docs/dev` may be:
- canonical
- draft
- review
- superseded
- archived

Canonicality must be declared in frontmatter or tracked in `_meta/CANONICAL_MAP.yaml`.

## Publishing rules

A document in `docs/dev` is not public merely because it is well-written.

Promotion to `docs/docs` must be explicit and governed by:
- visibility
- owner approval
- public-safety review
- editorial review for public tone and structure

## Required metadata for maintained docs

Recommended frontmatter:

```yaml
id: example-doc-id
title: Example Doc
status: canonical
visibility: internal
owner: platform-team
last_reviewed: 2026-03-22
public_candidate: false
supersedes: []
```

## Maintenance expectations
- mark stale docs explicitly
- avoid duplicate canonical documents
- add or update README files at major section roots
- keep _meta/CANONICAL_MAP.yaml current when canonical truth moves