# Constraints

This document describes the major constraints that shape the design and implementation of the Ardtire Civic Governance Platform.

A good platform vision is not merely aspiration. It is aspiration under real constraints. This document exists so that downstream design choices remain grounded in reality.

## Constraint categories

The platform is constrained by:

- institutional constraints
- domain complexity constraints
- engineering constraints
- operational constraints
- adoption constraints
- continuity constraints
- documentation and AI workflow constraints

## 1. Institutional constraints

The platform serves a governance-bearing institution rather than a generic consumer product.

This creates constraints such as:

- process legitimacy matters
- records integrity matters
- authority distinctions matter
- workflow semantics matter
- public and internal trust matter
- traceability matters

A shortcut that might be acceptable in a casual content app may be unacceptable here if it undermines institutional clarity.

## 2. Domain complexity constraints

The domain is not shallow.

Key complexities include:
- multiple actor classes
- distinctions between roles, permissions, and authority
- version-aware governance artifacts
- formal lifecycle transitions
- certification and publication semantics
- archival and records concerns
- time-sensitive process rules
- evolving institutional rules

This means the platform cannot be safely designed as a single undifferentiated CRUD surface.

## 3. Engineering constraints

The platform must be implementable and maintainable by a finite engineering effort.

Practical engineering constraints include:
- limited initial implementation bandwidth
- need for clean monorepo organization
- need for maintainable bounded contexts
- need to avoid premature over-generalization
- need to support disciplined AI-assisted development
- need for documentation and code to stay aligned

The architecture must be rigorous without becoming gratuitously complex.

## 4. Operational constraints

The system must be operable in the real world, not just conceptually well-modeled.

Operational constraints include:
- environments must be understandable
- releases must be manageable
- rollback paths must exist
- secrets and credentials must be handled safely
- observability must be sufficient
- incident response must be feasible
- future operators must be able to understand the system

A platform that is elegant in theory but operationally brittle would fail this constraint.

## 5. Adoption constraints

Users and stewards will only trust and use the platform if it is understandable.

Adoption constraints include:
- workflows must be comprehensible
- institutional states must be visible
- terminology must be consistent
- admin workflows must not feel arbitrary
- public outputs must feel authoritative and legible

A system that is technically correct but unusable or opaque will not succeed.

## 6. Continuity constraints

The platform must survive beyond the memory of any single contributor.

This creates strong continuity constraints:
- core meaning must live in the repository
- architecture must be explainable
- docs must be sufficiently complete
- AI-context materials must be grounded in source-of-truth docs
- future contributors must be able to resume work with confidence

This is one of the most important constraints in the project.

## 7. AI workflow constraints

AI assistance is valuable in this project, but only if it is governed.

This creates constraints such as:
- documentation must be structured enough for AI to consume reliably
- source-of-truth layers must be explicit
- AI context must be derived from canonical docs
- ambiguity must be reduced
- important assumptions must be recorded
- generated output must be reviewable against repo truth

The repository should be AI-friendly without becoming AI-dependent in an undisciplined way.

## 8. Scope discipline constraints

The platform cannot solve every adjacent institutional or civic problem in phase one.

This means:
- the first implementation must focus on the core workflow loop
- adjacent modules should be deferred unless clearly necessary
- architecture should remain extensible, but initial scope must remain disciplined

## 9. Time and sequencing constraints

Some truths must be defined before others.

For example:
- domain semantics should be clarified before deep implementation
- architecture boundaries should be clear before aggressive code generation
- specs should exist before complex feature work
- runbooks can mature after deployable paths exist, but not indefinitely later

This repository therefore requires sequencing discipline, not merely task accumulation.

## 10. Public/private boundary constraints

The platform must support both internal process and public-facing outputs.

That creates tension:
- some information should be visible
- some should be restricted
- some artifacts have draft versus official states
- some actions must be auditable internally without being broadly exposed

The platform must preserve those distinctions carefully.

## Constraint implications

These constraints lead to several practical implications:

- documentation cannot be optional
- boundaries cannot be hand-wavy
- state machines should be explicit
- authority cannot be reduced to simplistic admin flags
- records and publication must be treated seriously
- operations must be intentionally designed
- AI context must not become a shadow truth system

## Summary

The platform is constrained not just by time and technology, but by the fact that it is meant to carry institutional meaning responsibly.

These constraints are not obstacles to design quality.
They are the conditions under which good design must be achieved.
