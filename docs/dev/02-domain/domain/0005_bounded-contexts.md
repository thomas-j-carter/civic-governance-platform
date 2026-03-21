# Document 5 — `docs/domain/bounded-contexts.md`

## Purpose of this document

This document defines the **bounded contexts** of the Ardtire Society Digital Governance Platform.

A bounded context is a central concept in **Domain-Driven Design (DDD)**. It defines a **logical boundary inside which a specific domain model is valid and internally consistent**. Within that boundary, terminology, rules, data structures, and workflows share a coherent meaning.

Large institutional systems inevitably contain **multiple domains with different rules and vocabularies**. Attempting to model everything as one monolithic domain produces confusion, tight coupling, and brittle code.

This document therefore establishes the **primary domain boundaries** for the Ardtire platform so that:

* domain models remain coherent
* system modules remain maintainable
* teams can reason about different areas independently
* authority and workflows remain understandable
* integrations between subsystems are explicit

This document is the **bridge between conceptual vision and concrete architecture**.

---

# 1. Why bounded contexts are necessary

Governance platforms contain **many overlapping conceptual domains**, each with different rules.

For example:

| Concept     | Meaning in one domain         | Meaning in another      |
| ----------- | ----------------------------- | ----------------------- |
| Member      | person with membership status | eligible voter          |
| Role        | permission grouping           | organizational position |
| Record      | archival artifact             | database row            |
| Publication | CMS page                      | official notice         |

Without bounded contexts, these meanings collide and systems become inconsistent.

A senior engineer therefore separates the system into **contexts where specific meanings are stable**.

This separation allows:

* better code organization
* clearer domain models
* safer architectural evolution
* improved testability
* reduced accidental coupling

---

# 2. Context mapping overview

The Ardtire platform should initially be divided into the following major bounded contexts:

1. **Identity**
2. **Membership**
3. **Authority**
4. **Governance**
5. **Legislative / Proposals**
6. **Voting**
7. **Certification / Ratification**
8. **Records**
9. **Publication**
10. **Content / Editorial**
11. **Notifications**
12. **Operational Infrastructure**

These contexts correspond to **institutional functions** rather than UI features.

---

# 3. Context interaction map

A simplified conceptual relationship between contexts:

```
Identity
   │
   ▼
Membership
   │
   ▼
Authority
   │
   ▼
Governance
   │
   ├──── Legislative
   │         │
   │         ▼
   │       Voting
   │         │
   │         ▼
   │     Certification
   │
   ▼
Records
   │
   ▼
Publication
   │
   ▼
Public Website
```

Supporting contexts:

```
Notifications
Operational Infrastructure
Content / Editorial
```

This map reflects **how governance decisions flow through the institution**.

---

# 4. Identity context

## Purpose

The Identity context manages **who a person is in the system**.

It answers questions such as:

* Who is this user?
* How are they authenticated?
* What identity providers exist?
* How are sessions established?

Identity **does not determine authority** by itself.

---

## Core entities

* User
* Identity Provider
* External Identity
* Session
* Authentication Event

---

## Responsibilities

* user authentication
* identity federation
* account linkage
* session management
* identity normalization

---

## Boundaries

The Identity context **must not determine governance authority**. It only answers **who the actor is**, not **what they may do**.

---

# 5. Membership context

## Purpose

The Membership context manages **institutional membership status**.

It answers questions such as:

* Is this person a member?
* What class of membership do they hold?
* When did membership begin?
* Is the member active, suspended, or provisional?

---

## Core entities

* MembershipApplication
* MemberProfile
* MembershipStatus
* MembershipClass
* MembershipDecision
* MembershipHistory

---

## Responsibilities

* application intake
* application review
* membership decisions
* membership status transitions
* membership record management

---

## Boundaries

Membership **does not directly grant authority**.

Instead it provides **input into authority evaluation**.

---

# 6. Authority context

## Purpose

The Authority context determines **what powers an actor has in a given situation**.

It answers questions such as:

* Does this actor have authority to perform this action?
* Is authority derived from role, office, delegation, or rule context?
* Is authority currently valid?

---

## Core entities

* RoleAssignment
* Office
* OfficeHolder
* Delegation
* AuthorityGrant
* AuthorityScope

---

## Responsibilities

* authority evaluation
* role mapping
* office-based powers
* delegated powers
* scope restrictions

---

## Boundaries

Authority logic must remain separate from:

* authentication
* membership data
* workflow logic

Authority evaluation uses information from those contexts but remains conceptually independent.

---

# 7. Governance context

## Purpose

The Governance context defines **institutional structure**.

It answers questions such as:

* What governance bodies exist?
* What offices exist?
* What is the composition of governance bodies?
* How are responsibilities distributed?

---

## Core entities

* GovernanceBody
* Office
* OfficeHolder
* Term
* GovernanceRule

---

## Responsibilities

* maintain governance structures
* track officeholders
* define institutional bodies
* manage term transitions

---

## Boundaries

Governance defines **institutional structure**, not the procedural mechanics of proposals or voting.

---

# 8. Legislative / Proposals context

## Purpose

The Legislative context manages **proposal lifecycles**.

It answers questions such as:

* What proposals exist?
* What stage is a proposal in?
* What amendments have occurred?
* What text versions exist?

---

## Core entities

* Proposal
* ProposalVersion
* ProposalStage
* Amendment
* Reading
* CommitteeAssignment

---

## Responsibilities

* proposal drafting
* proposal submission
* lifecycle progression
* version tracking
* amendment handling

---

## Boundaries

The legislative context **does not determine voting results**. That belongs to the Voting context.

---

# 9. Voting context

## Purpose

The Voting context manages **ballots and vote aggregation**.

It answers questions such as:

* Who is eligible to vote?
* What ballots are open?
* What votes were cast?
* What is the tally result?

---

## Core entities

* Ballot
* BallotEligibilitySnapshot
* Vote
* VoteTally
* QuorumEvaluation
* ThresholdEvaluation

---

## Responsibilities

* ballot lifecycle management
* eligibility determination
* vote recording
* tally computation
* quorum checking
* threshold evaluation

---

## Boundaries

Voting determines **raw results**, but does not finalize them. Finalization occurs in the Certification context.

---

# 10. Certification / Ratification context

## Purpose

This context manages **the official finalization of outcomes**.

It answers questions such as:

* Has the result been certified?
* Has the matter been ratified?
* What authority confirmed the result?

---

## Core entities

* CertificationRecord
* RatificationRecord
* OutcomeStatus
* CertificationAuthority

---

## Responsibilities

* result certification
* procedural validation
* outcome finalization
* authority verification

---

## Boundaries

Certification converts **procedural result → official institutional outcome**.

---

# 11. Records context

## Purpose

The Records context manages **institutional memory**.

It answers questions such as:

* What official records exist?
* What historical artifacts are preserved?
* What versions exist?

---

## Core entities

* OfficialRecord
* RecordEntry
* RecordVersion
* RecordArtifact
* ArchiveIndex

---

## Responsibilities

* official record storage
* version preservation
* archival retrieval
* historical indexing

---

## Boundaries

Records represent **institutional memory**, not operational workflow.

---

# 12. Publication context

## Purpose

The Publication context controls **how official information becomes public**.

It answers questions such as:

* What official items are published?
* When were they published?
* Where do they appear publicly?

---

## Core entities

* GazetteIssue
* GazetteEntry
* PublicationJob
* PublicRegisterEntry
* Notice

---

## Responsibilities

* official publication
* gazette generation
* public register projection
* publication scheduling

---

## Boundaries

Publication converts **official state → public projection**.

---

# 13. Content / Editorial context

## Purpose

The Content context manages **non-governance informational material**.

It answers questions such as:

* What pages exist?
* What articles exist?
* What media is available?

---

## Core entities

* Page
* Article
* MediaAsset
* ContentBlock

---

## Responsibilities

* editorial publishing
* page management
* media storage
* informational content

---

## Boundaries

Content must not become the **source of governance truth**.

---

# 14. Notifications context

## Purpose

The Notifications context manages **communication events**.

---

## Responsibilities

* sending notifications
* email delivery
* system reminders
* event-triggered alerts

---

## Boundaries

Notifications are triggered by events but do not determine domain state.

---

# 15. Operational infrastructure context

## Purpose

This context includes **cross-cutting technical capabilities**.

---

## Responsibilities

* logging
* observability
* background jobs
* metrics
* deployment concerns

---

## Boundaries

Operational infrastructure should never contain domain logic.

---

# 16. Context ownership in the architecture

Each bounded context should ideally map to **distinct packages or modules** in the monorepo.

Example structure:

```
packages/
  identity
  membership
  authority
  governance
  legislative
  voting
  certification
  records
  publication
  content
  notifications
```

This structure mirrors the conceptual domain map.

---

# 17. Context integration strategy

Contexts interact through:

* service calls
* domain events
* API boundaries
* shared identifiers

A senior engineer avoids letting contexts reach directly into each other’s databases.

Instead they communicate through **well-defined interfaces**.

---

# 18. Context boundary principles

Boundaries should follow these principles:

### Principle 1 — Domain language consistency

Within a context, terms must have a single meaning.

### Principle 2 — Explicit integration

Contexts should communicate intentionally, not implicitly.

### Principle 3 — Internal autonomy

Each context should be able to evolve independently where possible.

### Principle 4 — Clear ownership

Each domain concept should belong to exactly one context.

---

# 19. Evolution strategy

Contexts may evolve over time.

Initial implementation may combine several contexts for simplicity, but the architecture should anticipate eventual separation if needed.

For example:

* legislative and voting may initially share infrastructure
* certification may initially live inside governance
* notifications may be a small subsystem

But conceptual separation should remain.

---

# 20. Summary

The Ardtire Society Digital Governance Platform should be organized around the following bounded contexts:

1. Identity
2. Membership
3. Authority
4. Governance
5. Legislative
6. Voting
7. Certification
8. Records
9. Publication
10. Content
11. Notifications
12. Operational Infrastructure

These contexts define the **domain architecture** of the platform and form the basis for:

* package structure
* API design
* data modeling
* service boundaries
* development organization

Maintaining these boundaries will significantly reduce architectural complexity and enable the platform to grow without collapsing into an unmaintainable monolith.

---

## Status

**Status:** Draft.
**Next document:**
`docs/domain/ubiquitous-language.md`

3… 2… 1… next: **Document 6 — Ubiquitous Language**, which will define the canonical terminology the entire codebase and governance system must use consistently.
