# Document 6 — `docs/domain/ubiquitous-language.md`

## Purpose of this document

This document defines the **Ubiquitous Language** for the Ardtire Society Digital Governance Platform.

In **Domain-Driven Design (DDD)**, a ubiquitous language is the **shared vocabulary used consistently across the entire system**:

* product documentation
* governance documents
* software architecture
* API design
* database schema
* code identifiers
* UI terminology

The goal is that **the same terms mean the same thing everywhere**.

Without this discipline, large systems degrade quickly because:

* different teams use the same words with different meanings
* database names diverge from governance concepts
* UI labels conflict with internal terminology
* documentation drifts from the code

A well-defined ubiquitous language prevents these problems.

For a governance platform, this is especially critical because many terms (proposal, resolution, act, record, notice, member, authority, publication) already have **institutional meanings**.

This document establishes the canonical vocabulary the system must follow.

---

# 1. Principles of the ubiquitous language

The language used across the platform must follow several principles.

## Principle 1 — One concept, one name

Each important concept must have **exactly one canonical name**.

Synonyms must be avoided.

For example:

* if the system uses **Proposal**, it should not also use Motion, Bill, Item, Issue, or Suggestion interchangeably.

---

## Principle 2 — Words must reflect institutional meaning

Terms should align with **how the institution understands itself**, not arbitrary developer naming.

Example:

* **Member** is not simply a “user”
* **Record** is not merely a database row

---

## Principle 3 — Domain words should appear in code

Entities, APIs, and database tables should use the same terminology as the domain model.

For example:

```text
Proposal
Ballot
OfficeHolder
CertificationRecord
GazetteEntry
```

This reduces translation overhead between domain experts and engineers.

---

## Principle 4 — Avoid overloaded terms

Some words have many meanings in software.

Examples:

* record
* role
* event
* status
* object

Where necessary, these terms should be clarified or expanded.

---

## Principle 5 — Governance terms override generic software terms

If a governance concept exists, it should be preferred over a generic technical concept.

Example:

* **Ballot** instead of generic “Poll”
* **OfficeHolder** instead of generic “AdminUser”

---

# 2. Core actor terminology

## Person

A **Person** is a real human being represented in the system.

A person may have:

* an account
* an identity
* a membership status
* roles
* offices

But the person concept remains fundamental.

---

## User

A **User** is a person with an authenticated system account.

A user is not necessarily a member.

---

## Member

A **Member** is a person recognized by the institution as belonging to Ardtire Society according to its membership framework.

Membership includes:

* membership status
* membership history
* membership class

---

## Applicant

An **Applicant** is a person seeking membership who has not yet been admitted.

---

## Officer

An **Officer** is a person holding an institutional office with specific responsibilities.

---

## OfficeHolder

An **OfficeHolder** is a person currently occupying a defined office.

---

## GovernanceBody

A **Governance Body** is a structured group within the institution responsible for governance functions.

Examples could include councils, committees, or assemblies.

---

# 3. Identity terminology

## Identity

An **Identity** represents the authenticated digital identity of a person.

It may be linked to external providers.

---

## Identity Provider

An **Identity Provider** is a system responsible for authenticating users.

Examples include:

* Keycloak
* OAuth providers
* SAML providers

---

## Session

A **Session** represents a currently authenticated interaction between a user and the platform.

---

# 4. Membership terminology

## Membership

Membership is the institutional relationship between a person and Ardtire Society.

---

## MembershipApplication

A **MembershipApplication** is a formal request to become a member.

---

## MembershipStatus

MembershipStatus represents the current standing of a member.

Examples:

* Pending
* Active
* Suspended
* Revoked
* Former

---

## MembershipClass

A **MembershipClass** represents categories of membership.

Examples could include:

* provisional
* full
* honorary

(Exact classes are defined by institutional rules.)

---

# 5. Authority terminology

## Authority

Authority represents the institutional power to perform an action.

Authority may derive from:

* role
* office
* delegation
* procedural eligibility

---

## Role

A **Role** represents a permission grouping used in software.

Roles are not identical to offices.

---

## Office

An **Office** is a defined institutional position with associated powers.

Examples:

* Secretary
* Chair
* Registrar

---

## Term

A **Term** represents the time period during which an officeholder occupies an office.

---

## Delegation

A **Delegation** represents temporary or scoped transfer of authority.

---

# 6. Legislative terminology

## Proposal

A **Proposal** is a formal governance item submitted for consideration.

A proposal may eventually become:

* adopted
* rejected
* withdrawn
* superseded

---

## ProposalVersion

A **ProposalVersion** represents a specific textual version of a proposal.

---

## Amendment

An **Amendment** is a modification proposed to an existing proposal.

---

## Reading

A **Reading** is a formal stage in which a proposal is considered.

---

## CommitteeAssignment

A **CommitteeAssignment** represents the delegation of a proposal to a governance body for review.

---

# 7. Voting terminology

## Ballot

A **Ballot** represents a voting instance for a specific proposal or matter.

---

## Vote

A **Vote** is the action of casting a choice on a ballot.

---

## Tally

A **Tally** represents the aggregated vote count.

---

## Quorum

A **Quorum** represents the minimum participation required for a vote to be valid.

---

## Threshold

A **Threshold** represents the minimum approval level required for passage.

Examples:

* simple majority
* supermajority

---

# 8. Certification terminology

## Certification

**Certification** is the act of confirming that a result is valid according to rules.

---

## CertificationRecord

A **CertificationRecord** documents the official confirmation of an outcome.

---

## Ratification

**Ratification** is the institutional acceptance of a certified outcome.

---

# 9. Records terminology

## Record

A **Record** is a preserved institutional artifact representing an official fact or event.

---

## RecordEntry

A **RecordEntry** is a specific item within the institutional record system.

---

## RecordArtifact

A **RecordArtifact** is a file or document associated with a record.

---

## Archive

The **Archive** is the long-term storage of historical records.

---

# 10. Publication terminology

## Publication

Publication is the act of making official information publicly accessible.

---

## Gazette

The **Gazette** is the formal publication channel for official notices and records.

---

## GazetteIssue

A **GazetteIssue** is a collection of published notices or records.

---

## GazetteEntry

A **GazetteEntry** is an individual published item.

---

## Public Register

A **Public Register** is a publicly accessible list of official institutional information.

Examples:

* officeholder register
* adopted acts register

---

# 11. Content terminology

## Page

A **Page** is a CMS-managed content page.

---

## Article

An **Article** is a structured editorial content item.

---

## MediaAsset

A **MediaAsset** is a stored file such as an image or document used in content.

---

# 12. Workflow terminology

## Lifecycle

A **Lifecycle** represents the stages an entity moves through.

Examples:

* proposal lifecycle
* ballot lifecycle

---

## Stage

A **Stage** represents a specific point in a lifecycle.

---

## Transition

A **Transition** is the movement from one stage to another.

---

## Guard

A **Guard** is a rule that determines whether a transition is allowed.

---

# 13. Audit terminology

## Audit Event

An **Audit Event** records an action taken in the system.

---

## Actor

An **Actor** is the entity performing an action.

Actors may be:

* users
* system processes

---

## Event Timestamp

A **Timestamp** records when an event occurred.

---

# 14. System terminology

## Command

A **Command** represents an instruction to change system state.

Examples:

* SubmitProposal
* CastVote

---

## Query

A **Query** retrieves system information without changing state.

---

## Domain Event

A **Domain Event** represents something meaningful that has happened in the system.

Example:

* ProposalSubmitted
* BallotClosed

---

# 15. Naming conventions

To maintain consistency, the following conventions should be used.

### Entity names

Use **PascalCase**.

Examples:

```text
Proposal
Ballot
OfficeHolder
CertificationRecord
```

---

### Database tables

Use **snake_case**.

Examples:

```text
proposals
ballots
office_holders
certification_records
```

---

### API endpoints

Use **resource-based naming**.

Examples:

```text
/proposals
/ballots
/members
/records
/gazette
```

---

# 16. Terminology to avoid

The following generic terms should be avoided unless clearly scoped.

Avoid:

* item
* object
* entry
* thing
* record (unless referring specifically to institutional records)
* admin action

Prefer domain-specific terminology.

---

# 17. Governance terminology hierarchy

Important conceptual hierarchy:

```id="lzzq0r"
Person
  └─ User
      └─ Member
          └─ OfficeHolder
```

Authority derives from membership and offices rather than simply from user accounts.

---

# 18. Maintaining the ubiquitous language

This document should evolve alongside the platform.

Whenever a new domain concept appears:

1. define the term here
2. update architecture documentation
3. ensure consistent usage across code and UI

If two terms appear to overlap, one must be chosen as canonical.

---

# 19. Summary

The ubiquitous language ensures that:

* developers
* architects
* governance participants
* documentation authors
* and users

all use the **same terminology** to describe the platform.

By establishing canonical meanings for actors, processes, records, and governance concepts, the system avoids semantic drift and ensures that the software faithfully represents the institution it serves.

---

## Status

**Status:** Draft.
**Next document:**

`docs/domain/domain-model.md`

3… 2… 1… next: **Document 7 — Domain Model**, where we define the **actual entities, aggregates, and relationships forming the core data model of the platform.**
