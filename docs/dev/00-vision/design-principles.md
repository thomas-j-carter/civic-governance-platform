# Design Principles

This document defines the durable design principles that should guide the Ardtire Civic Governance Platform across product design, domain modeling, architecture, implementation, and operations.

These principles are not feature requirements. They are judgment tools. When tradeoffs appear, these principles help determine which option better fits the platform’s mission.

## 1. Model meaning, not just data

The platform should represent institutional meaning explicitly rather than merely storing loosely labeled records.

This means:
- distinguish lifecycles rather than relying on arbitrary statuses
- distinguish authority from simplistic admin flags
- distinguish draft, official, certified, and published artifacts where relevant
- preserve relationships among governance, records, and publication

A row in a table is not yet a civic concept.
The platform should model the civic concept.

## 2. Prefer explicitness over hidden magic

Important behavior should be visible in docs, code, and workflow design.

Prefer:
- explicit transitions
- explicit validations
- explicit authority checks
- explicit invariants
- explicit contracts
- explicit documentation

Avoid:
- hidden side effects
- mysterious automation
- policy buried in UI code
- semantics discoverable only by reading source deeply

## 3. Treat auditability as a first-class concern

The platform should support reconstructable history, not only current state.

This means:
- preserve version history where relevant
- capture important transitions
- maintain meaningful audit trails
- design records and publication with historical integrity in mind
- avoid destructive workflows that erase institutional memory casually

## 4. Preserve legitimacy-bearing distinctions

The platform should not flatten away distinctions that matter institutionally.

Examples:
- public vs internal
- draft vs current
- current vs certified
- role vs authority
- member vs office holder
- editable artifact vs official record

These distinctions are not bureaucratic decoration. They are part of how the institution preserves meaning.

## 5. Build for continuity, not only for the present moment

The platform should remain understandable and maintainable by future contributors who were not present at its birth.

This means:
- documentation-first practice
- ADRs for consequential decisions
- specs for substantial features
- clear boundaries
- AI-context artifacts grounded in repo truth
- avoidance of founder-memory dependence

## 6. Prefer coherent bounded structure over accidental sprawl

The platform should grow by bounded contexts and clear responsibility lines rather than by piling unrelated concerns into a single undifferentiated application core.

This means:
- deliberate architecture boundaries
- explicit ownership of concerns
- thoughtful API and package boundaries
- resistance to convenience-driven sprawl

## 7. Optimize for institutional clarity before convenience

When a choice exists between a slightly more convenient workflow and a much clearer institutional model, the platform should generally prefer clarity.

This applies especially to:
- lifecycle semantics
- publication state
- role and authority handling
- records integrity
- visible status and standing

Convenience matters, but not at the price of confusion.

## 8. Keep the first implementation narrow but complete

The platform should begin with a coherent core vertical slice rather than a large scattered feature surface.

This means:
- focus on the core governance loop first
- ensure end-to-end coherence
- defer adjacent modules until the center holds
- prefer finished foundational capability over broad partial coverage

## 9. Let abstractions be earned

The platform should avoid both under-modeling and premature abstraction.

This means:
- do not flatten real domain distinctions
- do not invent generalized machinery before real use cases justify it
- allow actual workflow patterns to shape abstractions
- prefer clear simple structures that can evolve

## 10. Make public-facing outputs feel authoritative

Where the platform produces public or semi-public institutional outputs, they should feel intentional, legible, and authoritative.

This means:
- clear content status
- clear provenance where relevant
- stable terminology
- clean information architecture
- distinction between working state and official release

## 11. Design the docs as part of the system

Documentation should not be treated as external commentary on the platform. It is part of the platform’s operating system.

This means:
- docs define truth categories
- docs guide implementation
- docs support review
- docs support operations
- docs support AI continuation
- docs preserve institutional memory

A project like this cannot rely on code alone.

## 12. Use AI as an amplifier, not a substitute for judgment

AI should help accelerate drafting, implementation, summarization, and continuity, but it should not silently replace explicit repository governance.

This means:
- AI must be grounded in canonical docs
- AI outputs must be reviewable
- AI should not invent authority-bearing rules
- AI context should be derived rather than autonomous
- human judgment remains responsible for repository truth

## 13. Prefer durable language and durable structure

The platform should be documented and architected in ways that remain valid across multiple implementation iterations.

This means:
- avoid tying core truth too tightly to transient tooling where possible
- write docs around responsibility and meaning, not ephemeral code trivia
- keep naming intentional and stable
- avoid needless churn in core concepts

## 14. Treat operational readiness as part of design quality

A platform is not well-designed if it cannot be safely deployed, observed, recovered, and maintained.

This means:
- runbooks matter
- observability matters
- secret handling matters
- release discipline matters
- backup and recovery matter
- incident response matters

## 15. Reduce ambiguity wherever ambiguity is expensive

Some ambiguity is unavoidable early in design. But ambiguity around core domain meaning, authority, lifecycle, record status, or operational procedure is expensive and should be reduced proactively.

This means:
- define terms
- define states
- define boundaries
- define source-of-truth rules
- define open questions separately from settled truth

## Summary

The Ardtire Civic Governance Platform should be built as a serious institutional software system: explicit in meaning, coherent in structure, auditable in history, maintainable over time, and grounded in clear repository truth.

These principles should guide choices even when no detailed spec yet exists.
