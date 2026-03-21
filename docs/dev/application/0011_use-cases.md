# Document 11 — `docs/application/use-cases.md`

## Purpose of this document

This document defines the **application use cases** of the Ardtire Society Digital Governance Platform.

Earlier documents established:

* domain model
* actors and authority
* governance rules
* state machines

However, those describe the **internal structure of the system**, not the **actual actions people perform**.

Use cases define:

* what actors do
* what commands the system supports
* which domain services execute them
* what state transitions occur
* what events are produced

Use cases form the **bridge between domain architecture and application APIs**.

Every API endpoint, command handler, and UI interaction should correspond to a **use case defined here**.

---

# 1. Use case modeling principles

Use cases must follow several principles.

## Principle 1 — Actor driven

A use case begins with an **actor attempting an action**.

Example:

```
Member submits proposal
Officer reviews application
Voter casts vote
Authority certifies result
```

---

## Principle 2 — Command oriented

Use cases should be framed as **commands**.

Examples:

```
SubmitProposal
ReviewApplication
CastVote
CertifyResult
PublishGazetteEntry
```

Commands change system state.

---

## Principle 3 — Domain model integrity

Use cases must interact with domain aggregates through domain services.

The UI must **never manipulate domain state directly**.

---

## Principle 4 — Authority enforcement

Before executing a use case, the system must validate authority.

---

## Principle 5 — Rule evaluation

If the use case involves procedural outcomes, governance rules must be evaluated.

---

# 2. Use case categories

The platform supports several categories of use cases.

1. Identity management
2. Membership management
3. Governance management
4. Proposal management
5. Voting
6. Certification
7. Record management
8. Publication
9. Administrative operations

---

# 3. Identity use cases

## RegisterUser

Registers a new user account.

Actor:

* public user

Steps:

1. user provides identity credentials
2. identity provider validates identity
3. person record created
4. user account linked to person

Events:

```
UserRegistered
```

---

## AuthenticateUser

Authenticates a user.

Actor:

* user

Steps:

1. authentication request sent to identity provider
2. session created

Events:

```
UserAuthenticated
```

---

# 4. Membership use cases

## SubmitMembershipApplication

Actor:

* applicant

Steps:

1. applicant submits application
2. system validates required fields
3. application state transitions to `Submitted`

Events:

```
MembershipApplicationSubmitted
```

---

## ReviewMembershipApplication

Actor:

* membership officer

Steps:

1. reviewer opens application
2. reviewer evaluates eligibility
3. reviewer updates application status

Possible outcomes:

```
ApplicationApproved
ApplicationRejected
InformationRequested
```

---

## ApproveMembership

Actor:

* authorized officer

Steps:

1. approval decision recorded
2. member record created
3. membership status set to `Active`

Events:

```
MembershipApproved
MemberCreated
```

---

# 5. Governance structure use cases

## CreateGovernanceBody

Actor:

* governance administrator

Steps:

1. define body name
2. define scope
3. record governance body

Events:

```
GovernanceBodyCreated
```

---

## AssignOfficeHolder

Actor:

* governance authority

Steps:

1. select office
2. assign person
3. define term

Events:

```
OfficeHolderAssigned
```

---

# 6. Proposal use cases

## CreateProposalDraft

Actor:

* member

Steps:

1. create proposal entity
2. initial version stored
3. proposal state = `Draft`

Events:

```
ProposalDraftCreated
```

---

## SubmitProposal

Actor:

* member

Steps:

1. validate proposer eligibility
2. transition proposal `Draft → Submitted`
3. queue for review

Events:

```
ProposalSubmitted
```

---

## AssignProposalCommittee

Actor:

* governance officer

Steps:

1. choose committee
2. create committee assignment
3. transition to `CommitteeAssigned`

Events:

```
ProposalCommitteeAssigned
```

---

## AmendProposal

Actor:

* authorized member

Steps:

1. create amendment
2. attach to proposal
3. update amendment status

Events:

```
ProposalAmended
```

---

# 7. Voting use cases

## CreateBallot

Actor:

* governance authority

Steps:

1. create ballot
2. snapshot voter eligibility
3. schedule voting window

Events:

```
BallotCreated
```

---

## OpenBallot

Actor:

* system or authority

Steps:

1. ballot state `Scheduled → Open`
2. voters notified

Events:

```
BallotOpened
```

---

## CastVote

Actor:

* eligible voter

Steps:

1. validate eligibility
2. record vote
3. confirm receipt

Events:

```
VoteCast
```

---

## CloseBallot

Actor:

* system or authority

Steps:

1. ballot state `Open → Closed`
2. initiate tally

Events:

```
BallotClosed
```

---

# 8. Result evaluation use cases

## ComputeVoteTally

Actor:

* system

Steps:

1. aggregate votes
2. evaluate thresholds
3. evaluate quorum

Events:

```
VoteTallyComputed
```

---

## ValidateBallotIntegrity

Actor:

* certification authority

Steps:

1. verify ballot integrity
2. verify rules satisfied

Events:

```
BallotIntegrityValidated
```

---

# 9. Certification use cases

## CertifyResult

Actor:

* certification authority

Steps:

1. confirm quorum
2. confirm thresholds
3. create certification record

Events:

```
ResultCertified
```

---

## RejectCertification

Actor:

* certification authority

Steps:

1. identify procedural issue
2. mark certification rejected

Events:

```
CertificationRejected
```

---

# 10. Publication use cases

## CreateGazetteIssue

Actor:

* publication authority

Steps:

1. create gazette issue
2. define publication date

Events:

```
GazetteIssueCreated
```

---

## PublishGazetteEntry

Actor:

* publication authority

Steps:

1. select official record
2. create gazette entry
3. mark publication state

Events:

```
GazetteEntryPublished
```

---

## PublishPublicRegisterEntry

Actor:

* system or publication authority

Steps:

1. project official record to public register
2. update public interface

Events:

```
PublicRegisterUpdated
```

---

# 11. Record management use cases

## CreateOfficialRecord

Actor:

* system or authority

Steps:

1. generate record from domain event
2. store artifact
3. mark record as official

Events:

```
OfficialRecordCreated
```

---

## ArchiveRecord

Actor:

* system

Steps:

1. move record to archival state
2. preserve historical metadata

Events:

```
RecordArchived
```

---

# 12. Administrative use cases

## AssignRole

Actor:

* system administrator

Steps:

1. assign role to user
2. define scope and expiration

Events:

```
RoleAssigned
```

---

## RevokeRole

Actor:

* administrator

Steps:

1. remove role assignment

Events:

```
RoleRevoked
```

---

## DelegateAuthority

Actor:

* office holder

Steps:

1. define delegation scope
2. assign delegate

Events:

```
AuthorityDelegated
```

---

# 13. Use case structure template

Each use case in implementation should follow a template.

```
Use Case Name
Actor
Preconditions
Steps
State Transitions
Events Generated
Authority Requirements
Rules Evaluated
```

---

# 14. Relationship to APIs

Use cases will map directly to application commands.

Example mapping:

| Use Case            | API                      |
| ------------------- | ------------------------ |
| SubmitProposal      | POST /proposals          |
| CastVote            | POST /ballots/{id}/votes |
| CertifyResult       | POST /certifications     |
| PublishGazetteEntry | POST /gazette            |

---

# 15. Relationship to domain services

Each use case should be implemented by a **domain service** or **command handler**.

Example:

```
SubmitProposalHandler
CastVoteHandler
CertifyResultHandler
```

These handlers orchestrate:

* authority validation
* rule evaluation
* state transitions
* event generation

---

# 16. Event emission

Each use case must produce domain events.

Examples:

```
ProposalSubmitted
BallotOpened
VoteCast
ResultCertified
GazetteEntryPublished
```

These events power:

* audit logs
* notifications
* projections
* analytics

---

# 17. Use case orchestration

Complex use cases may trigger chains of actions.

Example:

```
BallotClosed
 → ComputeVoteTally
 → ResultPendingCertification
```

This orchestration may occur through background jobs.

---

# 18. Idempotency

Certain use cases must be idempotent.

Example:

* CastVote must prevent duplicate voting.

The system must detect repeated commands safely.

---

# 19. Error handling

If a use case fails:

* transaction rolled back
* error returned
* audit event recorded

Example:

```
error: vote_not_eligible
```

---

# 20. Summary

Use cases represent the **actions actors perform in the governance platform**.

They provide the operational layer between:

* domain model
* APIs
* user interfaces

Key use cases include:

* membership application management
* proposal submission
* voting
* certification
* publication
* record management

Every system capability should correspond to a well-defined use case.

---

## Status

**Status:** Draft.
**Next document:**

`docs/application/application-services.md`

3… 2… 1… next: **Document 12 — Application Services**, where we define **how use cases are implemented through service orchestration and command handlers in the system architecture.**
