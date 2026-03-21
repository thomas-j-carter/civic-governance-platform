# STATE_MACHINES

## Document Status
- Status: Canonical working baseline
- Purpose: define the initial workflow state machines for the Ardtire digital governance platform
- Audience: product, engineering, QA, future AI implementation agents

---

## 1. Why State Machines Are Required

The Ardtire platform models institutional workflows whose correctness matters.

Critical workflows must therefore be represented as explicit state machines rather than:
- loose status strings without transition rules
- scattered booleans
- inferred lifecycle logic from timestamps
- implicit “admin knows what to do” behavior

Every serious workflow should define:
- states
- allowed transitions
- transition initiators
- guards/preconditions
- side effects
- terminal states
- exception states where needed

---

## 2. Global Conventions

### 2.1 State Names
Use stable, explicit names that describe procedural meaning.

### 2.2 Transition Names
Prefer verb-oriented transition names.
Examples:
- submit
- return_for_revision
- approve
- reject
- admit
- open_vote
- close_vote
- certify
- publish

### 2.3 Transition Metadata
Every transition should be capable of recording:
- actor
- timestamp
- prior state
- next state
- reason/notes
- correlation ID
- applied policy/rule version where relevant

### 2.4 Invalid Transition Handling
Invalid transitions must fail explicitly and not silently mutate state.

---

## 3. Membership Application State Machine

### Purpose
Represent the lifecycle of a membership application.

### States
- `draft`
- `submitted`
- `under_review`
- `returned_for_revision`
- `approved`
- `rejected`
- `withdrawn`

### Initial State
- `draft`

### Terminal States
- `approved`
- `rejected`
- `withdrawn`

### Allowed Transitions

#### `submit`
- from: `draft`, `returned_for_revision`
- to: `submitted`
- initiator: applicant
- guards:
  - required fields complete
  - applicant identity established as required
- side effects:
  - audit event
  - queue for review

#### `start_review`
- from: `submitted`
- to: `under_review`
- initiator: reviewer/admin
- guards:
  - actor authorized to review
- side effects:
  - assignment or review metadata

#### `return_for_revision`
- from: `under_review`
- to: `returned_for_revision`
- initiator: reviewer/admin
- guards:
  - reason required
- side effects:
  - applicant notification
  - audit event

#### `approve`
- from: `under_review`
- to: `approved`
- initiator: authorized reviewer/admin
- guards:
  - all required checks complete
  - policy permits approval
- side effects:
  - create membership record/status
  - audit decision
  - notification

#### `reject`
- from: `under_review`
- to: `rejected`
- initiator: authorized reviewer/admin
- guards:
  - reason required
- side effects:
  - audit decision
  - notification

#### `withdraw`
- from: `draft`, `submitted`, `returned_for_revision`
- to: `withdrawn`
- initiator: applicant or authorized operator
- guards:
  - application not already terminal
- side effects:
  - audit event

---

## 4. Membership Status State Machine

### Purpose
Represent the lifecycle of an approved member’s standing.

### States
- `pending_activation`
- `active`
- `suspended`
- `ended`

### Initial State
- `pending_activation` or direct `active` depending on policy

### Terminal State
- `ended`

### Allowed Transitions

#### `activate`
- from: `pending_activation`
- to: `active`
- initiator: authorized system/operator
- guards:
  - approval exists
- side effects:
  - membership activation event

#### `suspend`
- from: `active`
- to: `suspended`
- initiator: authorized actor
- guards:
  - valid suspension reason/policy basis
- side effects:
  - audit event
  - notification

#### `reinstate`
- from: `suspended`
- to: `active`
- initiator: authorized actor
- guards:
  - reinstatement conditions met
- side effects:
  - audit event
  - notification

#### `end_membership`
- from: `active`, `suspended`
- to: `ended`
- initiator: authorized actor or policy-driven process
- guards:
  - valid end reason
- side effects:
  - audit event
  - historical closure

---

## 5. Proposal State Machine

### Purpose
Represent the lifecycle of a governance proposal.

### States
- `draft`
- `submitted`
- `admissibility_review`
- `admitted`
- `rejected`
- `amendment_window`
- `scheduled`
- `voting_open`
- `voting_closed`
- `certified`
- `ratified`
- `failed`
- `withdrawn`
- `published`
- `archived`

### Initial State
- `draft`

### Terminal-ish Outcome States
- `rejected`
- `withdrawn`
- `ratified`
- `failed`
- `archived`

### Notes
Some implementations may model `published` as a separate publication state rather than proposal state. If separated later, retain mapping consistency.

### Allowed Transitions

#### `submit_proposal`
- from: `draft`
- to: `submitted`
- initiator: authorized proposer
- guards:
  - proposal content complete enough to submit
- side effects:
  - audit event
  - review queue entry

#### `start_admissibility_review`
- from: `submitted`
- to: `admissibility_review`
- initiator: authorized reviewer/body admin
- guards:
  - actor authorized
- side effects:
  - assignment metadata

#### `admit_proposal`
- from: `admissibility_review`
- to: `admitted`
- initiator: authorized reviewer/body authority
- guards:
  - admissibility criteria satisfied
- side effects:
  - audit decision
  - potential amendment window opening

#### `reject_proposal`
- from: `admissibility_review`
- to: `rejected`
- initiator: authorized reviewer/body authority
- guards:
  - reason required
- side effects:
  - audit decision
  - notification

#### `open_amendment_window`
- from: `admitted`
- to: `amendment_window`
- initiator: authorized actor/system
- guards:
  - amendment phase applicable
- side effects:
  - amendment participation enabled

#### `schedule_proposal`
- from: `admitted`, `amendment_window`
- to: `scheduled`
- initiator: authorized scheduler/body authority
- guards:
  - scheduling prerequisites met
- side effects:
  - agenda/session linkage

#### `open_vote`
- from: `scheduled`
- to: `voting_open`
- initiator: authorized actor
- guards:
  - proposal eligible for vote
  - voting window configured
- side effects:
  - voting begins
  - audit event

#### `close_vote`
- from: `voting_open`
- to: `voting_closed`
- initiator: authorized actor/system
- guards:
  - voting window complete or manually closed per policy
- side effects:
  - vote tally finalized or prepared

#### `certify_outcome`
- from: `voting_closed`
- to: `certified`
- initiator: certifier/authorized actor
- guards:
  - tally available
  - certification prerequisites met
- side effects:
  - certification record
  - outcome frozen for official use

#### `ratify`
- from: `certified`
- to: `ratified`
- initiator: authorized actor/system
- guards:
  - ratification applicable and successful
- side effects:
  - official outcome status updated

#### `mark_failed`
- from: `certified`, `voting_closed`
- to: `failed`
- initiator: authorized actor/system
- guards:
  - failure determined per rule
- side effects:
  - official outcome status updated

#### `withdraw_proposal`
- from: `draft`, `submitted`, `admissibility_review`, `admitted`
- to: `withdrawn`
- initiator: authorized proposer or authority
- guards:
  - withdrawal allowed by current stage rules
- side effects:
  - audit event

#### `publish_proposal_outcome`
- from: `ratified`, `failed`, `certified`
- to: `published`
- initiator: authorized publisher/system
- guards:
  - publication allowed by policy
- side effects:
  - publication event
  - public register/gazette update

#### `archive_proposal`
- from: `published`, `ratified`, `failed`, `withdrawn`, `rejected`
- to: `archived`
- initiator: authorized actor/system
- guards:
  - archival policy conditions met
- side effects:
  - archival metadata

---

## 6. Amendment State Machine

### States
- `draft`
- `submitted`
- `under_review`
- `accepted`
- `rejected`
- `withdrawn`
- `incorporated`
- `archived`

### Notes
An amendment may be incorporated into a proposal before voting or handled through another policy-specific process.

### Key Transitions
- `submit_amendment`
- `start_review`
- `accept_amendment`
- `reject_amendment`
- `withdraw_amendment`
- `incorporate_amendment`
- `archive_amendment`

---

## 7. Voting State Machine

### Purpose
Represent the lifecycle of an individual vote event.

### States
- `configured`
- `open`
- `closed`
- `tallied`
- `certified`
- `voided`

### Allowed Transitions
- `open`
- `close`
- `tally`
- `certify`
- `void`

### Important Guards
- eligible electorate resolved
- configuration valid
- no duplicate/illegal participation
- closure conditions met
- tally integrity established
- certification authority valid

---

## 8. Certification State Machine

### Purpose
Represent certification of outcomes or records.

### States
- `pending`
- `under_review`
- `certified`
- `rejected`
- `superseded`

### Notes
This may attach to proposal outcomes, votes, records, or publication packages depending on implementation.

### Key Transitions
- `begin_certification_review`
- `certify`
- `reject_certification`
- `supersede_certification`

### Critical Principle
No official finality should be implied merely by closure of a workflow if certification is required by policy.

---

## 9. Publication State Machine

### Purpose
Represent official publication lifecycle for canonical materials.

### States
- `not_publishable`
- `eligible`
- `scheduled`
- `published`
- `withdrawn`
- `corrected`
- `superseded`
- `archived`

### Allowed Transitions
- `mark_eligible`
- `schedule_publication`
- `publish`
- `withdraw_publication`
- `issue_correction`
- `mark_superseded`
- `archive_publication`

### Principle
Publication status should be modeled independently enough to represent:
- eligible but unpublished
- published then corrected
- published then superseded
- withdrawn from public display

---

## 10. Office Holder Assignment State Machine

### Purpose
Represent lifecycle of office occupancy.

### States
- `vacant`
- `nominated`
- `under_review`
- `appointed`
- `active`
- `ended`
- `removed`

### Key Transitions
- `nominate`
- `start_review`
- `appoint`
- `activate_term`
- `end_term`
- `remove_from_office`

### Principle
Office occupancy must be event-backed and time-bounded.

---

## 11. Record Version State Machine

### Purpose
Represent document/record progression from draft to official and historical states.

### States
- `draft`
- `under_review`
- `official`
- `published`
- `superseded`
- `archived`

### Key Transitions
- `submit_for_review`
- `approve_as_official`
- `publish_record`
- `supersede_record`
- `archive_record`

---

## 12. Cross-Workflow Invariants

1. No terminal institutional decision should appear official without the required workflow steps.
2. Certification-required workflows cannot skip certification.
3. Publication cannot imply certification unless policy explicitly binds them.
4. Supersession must preserve historical lineage.
5. Invalid transitions must be blocked and auditable.
6. Transition authority must be policy-checked.
7. Significant transitions should emit audit events.
8. Rule-bearing transitions should preserve policy version references where relevant.

---

## 13. Testing Implications

Every state machine should have tests for:
- valid transitions
- invalid transitions
- permission failures
- guard failures
- side effects
- terminal state behavior
- historical/audit metadata emission

This is not optional. Workflow correctness is core product correctness.

---

## 14. Summary

The Ardtire platform should treat institutional workflows as explicit stateful processes.

The first canonical state machines are:
- membership application
- membership status
- proposal
- amendment
- voting
- certification
- publication
- office-holder assignment
- record version lifecycle

These state machines form the backbone of the governance platform’s correctness model.