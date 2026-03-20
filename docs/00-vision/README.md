# Vision Documentation

This folder defines the strategic intent of the Ardtire Civic Governance Platform.

These documents answer the highest-level questions:

- why this platform exists
- what problem it is intended to solve
- who it is for
- what outcomes matter
- what constraints shape it
- what is intentionally out of scope

This layer is intentionally upstream of product, domain, architecture, and implementation detail. Its job is not to specify endpoints, tables, or UI components. Its job is to establish stable strategic direction so that downstream decisions can be evaluated coherently.

## What belongs here

This folder should contain:

- the problem statement
- mission and goals
- stakeholder and user framing
- scope and non-goals
- key constraints
- success metrics
- major risks and assumptions
- durable design principles

## What does not belong here

This folder should not contain:

- detailed API behavior
- database design
- low-level system architecture
- detailed operational procedures
- implementation tasks
- sprint planning
- vendor-specific configuration
- speculative feature lists without strategic grounding

Those belong downstream in product, domain, architecture, specs, API, runbooks, and operations documentation.

## How to use these documents

Use this folder when:

- evaluating whether a proposed feature belongs in the platform
- deciding between competing product directions
- checking whether a new technical idea supports the real mission
- deciding whether a shortcut damages the long-term platform goal
- onboarding someone who needs to understand why the platform matters

## Relationship to the rest of the repository

The documents in this folder inform all downstream documentation layers:

- `docs/01-product/` translates vision into product shape
- `docs/02-domain/` translates vision into governance and institutional semantics
- `docs/03-architecture/` translates vision into technical structure
- `docs/05-specs/` translates vision into implementable feature behavior

The vision layer should be durable. It should not need to change every time implementation details evolve. When it does change, the change is usually strategically significant.

## Ardtire-specific note

For the Ardtire Civic Governance Platform, the vision layer matters more than it would in an ordinary CRUD application because this platform is not merely a generic web app. It is intended to serve as a serious civic-institutional operating system for membership, governance, records, publication, and legitimacy-bearing process.

That means the platform must be designed not just for convenience, but for:

- legitimacy
- clarity
- auditability
- continuity
- institutional trustworthiness
- long-term evolvability

## Reading order

Read the files in this folder in roughly this order:

1. `problem-statement.md`
2. `mission-and-goals.md`
3. `stakeholders-and-users.md`
4. `scope-and-non-goals.md`
5. `constraints.md`
6. `success-metrics.md`
7. `risks-and-assumptions.md`
8. `design-principles.md`

## Final principle

This folder exists so that the platform is not built as a pile of disconnected features. It exists so that decisions can be evaluated against a stable understanding of purpose.
