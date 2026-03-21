24 → 23 docs remaining after this one.

# Document 7 — `docs/domain/domain-model.md`

## Purpose of this document

This document defines the **core domain model** of the Ardtire Society Digital Governance Platform.

Where previous documents established:

* mission and institutional posture
* actor landscape
* problem statements
* bounded contexts
* ubiquitous terminology

This document now defines the **actual conceptual objects that exist in the system and how they relate to one another**.

In Domain-Driven Design terms, this includes:

* **Entities**
* **Aggregates**
* **Value Objects**
* **Domain relationships**
* **Invariant rules**

This document is intentionally **technology-agnostic**. It describes the conceptual model before database schema, ORM implementation, or API details are introduced.

Later documents (Prisma schema, API contracts, etc.) will implement this model.

---

# 1. Modeling principles

The Ardtire domain model must follow several key principles.

## Principle 1 — Institutional meaning over technical convenience

Entities should reflect real institutional concepts, not just convenient database structures.

Example:

* `Member` exists because membership matters institutionally.
* `OfficeHolder` exists because offices matter institutionally.

---

## Principle 2 — Aggregates protect invariants

Related entities are grouped into **aggregates** so that domain invariants remain consistent.

Example:

* A **Proposal aggregate** ensures that amendments and versions cannot diverge from the proposal they belong to.

---

## Principle 3 — Identity matters

Entities with institutional significance should have stable identifiers.

Examples:

* Proposal ID
* Member ID
* Office ID
* Ballot ID

These identifiers persist across system operations.

---

## Principle 4 — State transitions must be explicit

Entities that move through procedures must have **clearly defined states**.

Examples:

* membership status
* proposal stage
* ballot lifecycle
* publication state

These states will later be implemented as **state machines**.

---

# 2. Top-level aggregates

The platform’s domain can be organized into the following **primary aggregates**:

1. Person
2. Member
3. Governance Structure
4. Proposal
5. Ballot
6. Certification
7. Record
8. Publication

Each aggregate represents a cluster of related entities with a clear consistency boundary.

---

# 3. Person aggregate

## Purpose

Represents a real human interacting with the system.

Identity and membership attach to this entity.

---

## Entities

### Person

Represents a unique individual.

Attributes:

* person_id
* name
* contact information
* identity references

A person may or may not have:

* a user account
* membership status
* offices

---

### UserAccount

Represents an authenticated platform account.

Attributes:

* account_id
* identity provider reference
* authentication metadata

A person may have multiple external identities but typically one primary account.

---

## Invariants

* A person must have a stable identity reference.
* A user account must link to exactly one person.

---

# 4. Member aggregate

## Purpose

Represents institutional membership and membership lifecycle.

---

## Entities

### Member

Represents a person admitted to membership.

Attributes:

* member_id
* person_id
* membership_class
* membership_status
* admission_date

---

### MembershipApplication

Represents an application for membership.

Attributes:

* application_id
* applicant_person_id
* submission_date
* review_state

---

### MembershipHistory

Represents historical membership changes.

Attributes:

* change_type
* timestamp
* authority_reference

---

## Invariants

* A member must reference an existing person.
* Membership transitions must follow defined status rules.

---

# 5. Governance structure aggregate

## Purpose

Represents institutional structure and authority.

---

## Entities

### GovernanceBody

Represents an institutional body.

Examples:

* council
* committee
* assembly

Attributes:

* body_id
* body_name
* description

---

### Office

Represents a defined institutional position.

Attributes:

* office_id
* office_name
* authority_scope

---

### OfficeHolder

Represents a person occupying an office.

Attributes:

* office_holder_id
* office_id
* person_id
* term_start
* term_end

---

### Term

Represents a defined tenure period for an office.

---

## Invariants

* An officeholder must reference a valid office and person.
* Term boundaries must be valid time intervals.

---

# 6. Proposal aggregate

## Purpose

Represents legislative proposals and their lifecycle.

---

## Entities

### Proposal

Core legislative unit.

Attributes:

* proposal_id
* title
* proposer_member_id
* submission_date
* lifecycle_stage

---

### ProposalVersion

Represents a version of proposal text.

Attributes:

* version_id
* proposal_id
* version_number
* text_content

---

### Amendment

Represents a modification to a proposal.

Attributes:

* amendment_id
* proposal_id
* amendment_text
* amendment_status

---

### CommitteeAssignment

Represents assignment to a governance body.

---

## Invariants

* A proposal must have at least one version.
* Amendments must reference a valid proposal.

---

# 7. Ballot aggregate

## Purpose

Represents voting processes.

---

## Entities

### Ballot

Represents a voting instance.

Attributes:

* ballot_id
* proposal_id
* opening_time
* closing_time

---

### Vote

Represents a vote cast by a participant.

Attributes:

* vote_id
* ballot_id
* voter_member_id
* vote_choice

---

### BallotEligibilitySnapshot

Captures eligible voters at ballot opening.

---

### VoteTally

Represents aggregated results.

Attributes:

* yes_count
* no_count
* abstain_count

---

## Invariants

* A vote must reference a valid ballot.
* Votes may only be cast during ballot open period.

---

# 8. Certification aggregate

## Purpose

Represents validation of governance outcomes.

---

## Entities

### CertificationRecord

Represents official confirmation of results.

Attributes:

* certification_id
* ballot_id
* certifying_authority
* certification_timestamp

---

### RatificationRecord

Represents institutional acceptance of outcome.

---

## Invariants

* Certification must reference a completed ballot.
* Ratification may require certification.

---

# 9. Record aggregate

## Purpose

Represents institutional memory.

---

## Entities

### OfficialRecord

Represents a preserved institutional artifact.

Attributes:

* record_id
* record_type
* creation_timestamp

---

### RecordVersion

Represents historical versions of a record.

---

### RecordArtifact

Represents associated documents.

---

## Invariants

* Records must preserve historical lineage.
* Official records cannot be silently deleted.

---

# 10. Publication aggregate

## Purpose

Represents public dissemination of official information.

---

## Entities

### GazetteIssue

Represents a collection of official notices.

Attributes:

* issue_id
* publication_date

---

### GazetteEntry

Represents an individual published item.

Attributes:

* entry_id
* issue_id
* referenced_record

---

### PublicRegisterEntry

Represents a public-facing institutional listing.

---

## Invariants

* Gazette entries must reference official records.
* Publication timestamps must be immutable.

---

# 11. Supporting value objects

Some domain concepts do not need full entity identity.

Examples:

### Timestamp

Represents a moment in time.

### AuthorityScope

Represents the scope of institutional power.

### LifecycleStage

Represents a stage in a workflow.

### ThresholdRule

Represents vote thresholds.

---

# 12. Cross-aggregate relationships

Key relationships include:

```text
Person
  └─ Member

Member
  └─ Proposal proposer

Proposal
  └─ Ballot

Ballot
  └─ Certification

Certification
  └─ Record

Record
  └─ Publication
```

This chain represents **the institutional lifecycle of governance decisions**.

---

# 13. Lifecycle chains

Certain domain objects follow predictable lifecycle chains.

Example proposal chain:

```text
Draft
Submitted
Under Review
Reading
Voting
Certified
Ratified
Published
Archived
```

These will later become explicit state machines.

---

# 14. Event generation

Domain actions should generate events.

Examples:

* ProposalSubmitted
* BallotOpened
* VoteCast
* BallotClosed
* ResultCertified
* GazettePublished

Events allow:

* auditing
* notifications
* projections
* integrations

---

# 15. Data ownership boundaries

Each aggregate owns its internal entities.

Examples:

* Proposal aggregate owns versions and amendments.
* Ballot aggregate owns votes and tallies.

External aggregates should reference them **by ID only**.

This prevents tight coupling.

---

# 16. Domain invariants

Some rules must always hold true.

Examples:

* Votes cannot be cast outside ballot window.
* A proposal must exist before a ballot exists.
* Certification requires completed voting.
* Publication requires official record.

These invariants will later be enforced in domain services.

---

# 17. Domain services

Some behaviors belong to **domain services**, not entities.

Examples:

* eligibility evaluation
* quorum calculation
* vote tallying
* certification validation

These services operate across aggregates.

---

# 18. Model evolution

This domain model will evolve as the system matures.

However, the following aggregates are unlikely to disappear:

* Person
* Member
* GovernanceStructure
* Proposal
* Ballot
* Certification
* Record
* Publication

These represent **the institutional backbone of the system**.

---

# 19. Summary

The Ardtire domain model defines the core conceptual entities and aggregates required to represent governance in software.

The most important aggregates are:

* Person
* Member
* Governance Structure
* Proposal
* Ballot
* Certification
* Record
* Publication

Together they represent the full lifecycle of institutional governance:

```text
Person → Member → Proposal → Ballot → Certification → Record → Publication
```

This model provides the conceptual structure for all later implementation work.

---

## Status

**Status:** Draft.
**Next document:**

`docs/domain/state-machines.md`

3… 2… 1… next: **Document 8 — State Machines**, where we define the **formal lifecycle transitions for proposals, ballots, membership, and publication.**

This will be one of the most important documents in the entire architecture.
