# Risks and Assumptions

This document captures the major risks and assumptions at the vision layer for the Ardtire Civic Governance Platform.

The goal is not to eliminate all uncertainty in advance. The goal is to make uncertainty explicit so that design and implementation proceed with awareness rather than accidental optimism.

## Relationship between risks and assumptions

Assumptions are propositions currently treated as sufficiently true to proceed.
Risks are ways in which those assumptions or surrounding conditions may fail, distort, or complicate the project.

Both matter.

## Major assumptions

## 1. The Society’s core governance concepts can be modeled explicitly in software
This project assumes that the Society’s intended institutional structures and processes are sufficiently definable that they can be represented in documents, state machines, permissions, workflows, and records models.

If this assumption proves false or remains underspecified, platform ambiguity will persist.

## 2. A documentation-first approach will reduce long-term confusion
This project assumes that investing heavily in explicit docs, source-of-truth discipline, ADRs, specs, and AI-context materials will improve continuity and implementation quality over time.

If documentation becomes performative rather than useful, this benefit will erode.

## 3. The initial platform can be scoped to a coherent core
This project assumes that the first serious implementation can remain focused on a manageable core rather than expanding into every adjacent civic or institutional concern.

If scope discipline fails, the platform may become bloated before it becomes coherent.

## 4. Future contributors will need repository-native context
This project assumes that the system must be understandable by people who were not present for the original ideation and build process.

This assumption drives the unusually strong emphasis on documentation and explicitness.

## 5. AI can be used safely if grounded in repository truth
This project assumes AI assistance can materially accelerate work without corrupting coherence, provided it is constrained by canonical documentation and review discipline.

If those constraints weaken, AI usage could increase drift rather than reduce it.

## 6. Trustworthiness matters more than generic app speed
This project assumes that, for the Ardtire context, correctness, legitimacy, and clarity are more valuable than maximizing early shipping speed through shortcuts.

This assumption shapes architecture, docs, and process decisions.

## Major risks

## 1. Domain ambiguity risk
The governance domain may contain unresolved or evolving concepts that are not yet sufficiently crisp to encode cleanly.

Potential consequences:
- unstable specs
- architecture churn
- inconsistent implementation
- repeated rewrites of core workflow logic

Mitigation direction:
- define domain language early
- document invariants explicitly
- separate settled truth from open questions
- avoid pretending ambiguity does not exist

## 2. Scope expansion risk
The platform could expand too early into adjacent areas and lose coherence.

Potential consequences:
- partial implementations everywhere
- architecture that optimizes for hypothetical breadth rather than real need
- contributor confusion
- delayed delivery of the core governance loop

Mitigation direction:
- maintain clear scope and non-goals
- prefer coherent vertical slices
- require strategic justification for scope expansion

## 3. Over-abstraction risk
Because the domain is complex, there is a risk of designing an architecture that is too abstract, too framework-heavy, or too generalized before real workflows are proven.

Potential consequences:
- slower implementation
- harder onboarding
- fragile abstractions
- needless indirection

Mitigation direction:
- keep abstractions earned, not speculative
- use domain documents and specs to justify structure
- prefer clear bounded contexts over ornamental architecture

## 4. Under-modeling risk
The opposite risk also exists: implementing too casually and flattening important distinctions.

Potential consequences:
- weak authority handling
- incorrect lifecycle behavior
- records/publication confusion
- legitimacy damage
- expensive redesign later

Mitigation direction:
- model domain semantics explicitly
- define state machines and invariants
- do not reduce institutional process to arbitrary status flags

## 5. Documentation drift risk
The project’s large documentation surface could become stale or contradictory if not actively governed.

Potential consequences:
- false confidence
- review breakdown
- AI misalignment
- future contributor confusion

Mitigation direction:
- source-of-truth policy
- documentation governance
- change manifests
- AI-context compilation
- validation and drift checks

## 6. Founder-memory risk
Too much truth may remain in personal memory, chat history, or tacit understanding rather than in the repository.

Potential consequences:
- continuity failure
- inconsistent implementation decisions
- inability to hand off work cleanly
- strategic fragility

Mitigation direction:
- aggressively promote important truth into repo docs
- maintain handoff and continuation artifacts
- write ADRs and specs for consequential choices

## 7. Operational immaturity risk
The platform may become feature-rich before it becomes operationally trustworthy.

Potential consequences:
- poor release discipline
- weak observability
- unsafe secrets handling
- brittle recovery paths

Mitigation direction:
- include runbooks and operations docs early enough
- require deploy and rollback thinking as part of platform maturity
- treat observability as part of the design, not a late add-on

## 8. Legitimacy perception risk
Even technically correct workflows may not be perceived as legitimate if the platform presents unclear states, ambiguous labels, or hidden process logic.

Potential consequences:
- user mistrust
- internal confusion
- reluctance to rely on the platform

Mitigation direction:
- prioritize clarity in product and publication design
- preserve official/draft/internal distinctions
- use consistent terminology everywhere

## 9. Tooling fragmentation risk
The broader ecosystem may tempt use of multiple overlapping tools that pull process truth out of the platform.

Potential consequences:
- duplicate state
- conflicting records
- unclear authority
- reduced trust in the platform as the canonical operating surface

Mitigation direction:
- be explicit about the platform’s responsibility boundaries
- integrate thoughtfully rather than fragment casually
- keep source-of-truth rules visible

## 10. Sustainability risk
The project may become too ambitious for its maintenance model.

Potential consequences:
- unfinished subsystems
- decaying docs
- abandoned automation
- overly bespoke infrastructure

Mitigation direction:
- phase work deliberately
- prefer maintainable patterns
- ensure every subsystem justifies its cost
- prioritize the core governance loop first

## Open assumptions requiring later confirmation

The following are likely to need refinement in downstream docs:

- exact governance body structures
- exact office-holder workflows
- public/private publication boundaries in detail
- retention policy specifics
- advanced notification needs
- the eventual breadth of transparency features
- long-term external integration requirements

These are not blockers to vision, but they will require downstream clarification.

## Summary

This project is ambitious, semantically rich, and continuity-sensitive. Its risks are therefore not only technical. They are also institutional, procedural, and epistemic.

The correct response is not fear.
The correct response is disciplined explicitness.
