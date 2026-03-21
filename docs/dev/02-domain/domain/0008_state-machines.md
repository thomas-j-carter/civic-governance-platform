# Document 8 — `docs/domain/state-machines.md`

## Purpose of this document

This document defines the **state machines** governing the lifecycle of key institutional entities in the Ardtire Society Digital Governance Platform.

Governance systems are fundamentally **procedural systems**. Important institutional actions do not occur arbitrarily; they occur within **structured sequences of stages** governed by rules and authority.

A **state machine** formalizes these procedures by defining:

* valid **states**
* allowed **transitions**
* required **guards (conditions)**
* responsible **actors**
* resulting **side effects**

This ensures that:

* institutional processes remain consistent
* invalid transitions cannot occur
* the platform reflects real governance procedures
* audit trails capture procedural movement clearly

This document specifies the core lifecycle state machines for:

1. Membership Application
2. Membership Standing
3. Proposal Lifecycle
4. Ballot Lifecycle
5. Certification Lifecycle
6. Publication Lifecycle
7. Record Lifecycle

---

# 1. State machine modeling principles

All state machines in the platform must follow these principles.

## Principle 1 — Explicit states

Each stage in a process must be explicitly represented.

Example:

```text
Draft → Submitted → Under Review → Approved
```

Implicit states must be avoided.

---

## Principle 2 — Guarded transitions

A transition must only occur if defined **guards** pass.

Guards may include:

* actor authority
* timing constraints
* workflow prerequisites
* rule validation

---

## Principle 3 — Auditable transitions

Each transition must produce an **audit event** recording:

* actor
* timestamp
* previous state
* new state
* context

---

## Principle 4 — Deterministic state progression

The system must prevent ambiguous states such as:

* partially approved
* implicitly closed ballots
* unclear publication readiness

---

# 2. Membership Application state machine

## Purpose

Represents the lifecycle of a membership application.

---

## States

```text
Draft
Submitted
UnderReview
InformationRequested
Resubmitted
Approved
Rejected
Withdrawn
```

---

## Transitions

### Draft → Submitted

Triggered by: Applicant

Guards:

* required fields completed

Side effects:

* application timestamp recorded
* review queue entry created

---

### Submitted → UnderReview

Triggered by: Officer / Reviewer

Guards:

* reviewer authority

Side effects:

* review assignment recorded

---

### UnderReview → InformationRequested

Triggered by: Reviewer

Guards:

* reviewer authority

Side effects:

* request notice sent to applicant

---

### InformationRequested → Resubmitted

Triggered by: Applicant

Guards:

* response provided

---

### UnderReview → Approved

Triggered by: Authorized decision actor

Guards:

* decision authority

Side effects:

* member record created
* membership status initialized

---

### UnderReview → Rejected

Triggered by: Authorized decision actor

Guards:

* decision authority

---

### Submitted / UnderReview → Withdrawn

Triggered by: Applicant

---

# 3. Membership Standing state machine

## States

```text
Pending
Active
Restricted
Suspended
Revoked
Former
```

---

## Transitions

### Pending → Active

Triggered by: Membership approval

---

### Active → Restricted

Triggered by: rule violation or provisional condition

---

### Restricted → Active

Triggered by: remediation

---

### Active → Suspended

Triggered by: disciplinary action

---

### Suspended → Active

Triggered by: reinstatement

---

### Active → Revoked

Triggered by: formal termination

---

### Revoked → Former

Terminal historical status.

---

# 4. Proposal lifecycle state machine

## Purpose

Represents the lifecycle of governance proposals.

---

## States

```text
Draft
Submitted
EligibilityReview
CommitteeAssigned
InCommittee
ReadyForReading
FirstReading
AmendmentWindow
SecondReading
FinalVoteScheduled
VotingOpen
VotingClosed
ResultPendingCertification
Certified
Ratified
Published
Archived
Withdrawn
Rejected
```

---

## Key transitions

### Draft → Submitted

Triggered by: proposer

Guards:

* proposer eligibility
* proposal completeness

---

### Submitted → EligibilityReview

Triggered by: governance officer

Guards:

* submission accepted

---

### EligibilityReview → CommitteeAssigned

Triggered by: officer

Guards:

* proposal admissible

---

### CommitteeAssigned → InCommittee

Triggered by: committee body

---

### InCommittee → ReadyForReading

Triggered by: committee completion

---

### ReadyForReading → FirstReading

Triggered by: governance body

---

### FirstReading → AmendmentWindow

Triggered by: procedural rule

---

### AmendmentWindow → SecondReading

Triggered by: amendment window close

---

### SecondReading → FinalVoteScheduled

Triggered by: procedural authority

---

### FinalVoteScheduled → VotingOpen

Triggered by: ballot creation

---

### VotingOpen → VotingClosed

Triggered by: ballot closing event

---

### VotingClosed → ResultPendingCertification

Triggered by: tally completion

---

### ResultPendingCertification → Certified

Triggered by: certification authority

---

### Certified → Ratified

Triggered by: ratification authority

---

### Ratified → Published

Triggered by: publication authority

---

### Published → Archived

Triggered by: archival process

---

# 5. Ballot lifecycle state machine

## States

```text
Draft
Scheduled
Open
Closed
Tallying
ResultComputed
Expired
Cancelled
```

---

## Transitions

### Draft → Scheduled

Ballot created.

---

### Scheduled → Open

Triggered by scheduled start time or authority action.

---

### Open → Closed

Triggered by closing time.

---

### Closed → Tallying

Vote counting begins.

---

### Tallying → ResultComputed

Vote tally completed.

---

### Open → Cancelled

Exceptional authority.

---

### Scheduled → Expired

If never opened.

---

# 6. Certification lifecycle state machine

## States

```text
Pending
UnderReview
Certified
Rejected
```

---

## Transitions

### Pending → UnderReview

Triggered by certification review start.

---

### UnderReview → Certified

Triggered by certification authority.

Side effects:

* certification record created

---

### UnderReview → Rejected

Triggered by certification authority.

Side effects:

* proposal returned for correction

---

# 7. Publication lifecycle state machine

## States

```text
Draft
ReadyForPublication
Scheduled
Published
Superseded
Retracted
Archived
```

---

## Transitions

### Draft → ReadyForPublication

Triggered by publication authority.

---

### ReadyForPublication → Scheduled

Publication scheduled.

---

### Scheduled → Published

Publication executed.

Side effects:

* gazette entry created
* public register updated

---

### Published → Superseded

Triggered by later replacement.

---

### Published → Retracted

Exceptional correction.

---

### Superseded / Retracted → Archived

Historical storage.

---

# 8. Record lifecycle state machine

## States

```text
Draft
Official
Published
Superseded
Archived
```

---

## Transitions

### Draft → Official

Triggered by official acceptance.

---

### Official → Published

Triggered by publication.

---

### Official → Superseded

Triggered by later update.

---

### Published → Archived

Historical preservation.

---

# 9. Guard conditions

Transitions may require:

### Authority guards

Actor must hold appropriate authority.

---

### State guards

Transition must originate from correct state.

---

### Rule guards

Institutional rule must allow transition.

---

### Temporal guards

Time windows must be satisfied.

---

# 10. Side effects

Transitions may trigger side effects.

Examples:

* notification dispatch
* audit event recording
* record generation
* register updates
* publication pipeline events

Side effects must never bypass state validation.

---

# 11. State machine implementation pattern

Recommended implementation structure:

```text
state_machine
  states
  transitions
  guards
  side_effects
```

Transitions should be handled through **domain services**, not UI logic.

---

# 12. Example transition pseudocode

Example proposal transition:

```text
transitionProposal(proposal, action, actor):
  validateActorAuthority(actor)
  validateCurrentState(proposal.state)

  nextState = stateMachine.next(proposal.state, action)

  applySideEffects(nextState)

  recordAuditEvent(actor, proposal.state, nextState)

  proposal.state = nextState
```

---

# 13. Benefits of state machines

Explicit state machines provide:

* procedural clarity
* predictable workflows
* auditability
* easier testing
* strong guardrails

This is especially important for governance platforms.

---

# 14. Event generation

Each transition should generate a domain event.

Examples:

* MembershipApproved
* ProposalSubmitted
* BallotOpened
* VoteCast
* BallotClosed
* ResultCertified
* GazettePublished

These events power:

* notifications
* projections
* audit logs
* integrations

---

# 15. Summary

The Ardtire platform uses state machines to model governance procedures.

Key lifecycles include:

* membership applications
* membership standing
* proposals
* ballots
* certifications
* records
* publications

These lifecycles enforce:

* valid procedural progression
* authority validation
* auditability
* institutional integrity

State machines therefore form the **procedural backbone of the platform**.

---

## Status

**Status:** Draft.
**Next document:**

`docs/domain/governance-rules-model.md`

3… 2… 1… next: **Document 9 — Governance Rules Model**, where we define **how procedural rules, quorum requirements, thresholds, and constitutional references are stored and versioned in the system.**
