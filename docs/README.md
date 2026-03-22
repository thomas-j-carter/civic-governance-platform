# README.md

# Documentation System

This repository uses a three-part documentation architecture:

- `docs/ai` — compact AI continuity and handoff context
- `docs/dev` — internal engineering, product, architecture, and operational documentation
- `docs/docs` — public documentation website application

## Purpose of each subtree

### `docs/ai`
Use this subtree to preserve a small, high-signal context layer that can be used to continue implementation work across chats and sessions without requiring the entire internal documentation corpus to be loaded every time.

This subtree is intentionally distilled and compact.

Canonical for:
- project context summaries
- current implementation state summaries
- architecture summaries
- repo blueprints
- continuation prompts
- source-of-truth maps for AI-assisted implementation

Not canonical for:
- full technical specifications
- internal runbooks
- authoritative API contracts
- detailed product or architecture design records

### `docs/dev`
Use this subtree as the internal documentation corpus for engineering, architecture, product, domain modeling, specifications, operations, and implementation planning.

This is the primary internal human-readable source of truth for how the system works and how it should be built and operated.

Canonical for:
- architecture
- specs
- runbooks
- ADRs
- internal APIs
- operational policy
- domain models
- implementation planning

### `docs/docs`
Use this subtree for the public documentation website.

This is a standalone Docusaurus application and is the published public-facing documentation product. It may contain docs written directly for the public website and docs promoted from `docs/dev`.

Canonical for:
- public documentation information architecture
- public docs pages
- tutorials
- public changelog
- public blog
- public API reference presentation

## Source-of-truth rule

Truth flows in this direction:

1. Code, schema, APIs, decisions, and implementation work inform `docs/dev`
2. `docs/dev` is distilled into `docs/ai`
3. Approved public-safe material is promoted from `docs/dev` into `docs/docs` when appropriate

`docs/docs` must never be treated as a mirror of `docs/dev`.

## Status vocabulary

Every maintained doc should carry one of:

- `draft`
- `review`
- `canonical`
- `superseded`
- `archived`

## Visibility vocabulary

Every maintained doc should carry one of:

- `internal`
- `public`
- `ai-context`

## Ownership rule

No document may be marked `canonical` without an explicit owner.

## Generated content rule

Generated artifacts must be clearly marked as generated and must not be manually edited unless the file explicitly says otherwise.