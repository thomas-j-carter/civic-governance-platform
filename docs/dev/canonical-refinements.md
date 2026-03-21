canonical-refinements.md

Proceeding with the canonical refinements.

My recommendation is:

* use **aggressively separate read DTOs and write DTOs**
* use **explicit action enums** for lifecycle commands
* use **RFC 9457 / RFC 7807-style problem details** for errors
* use **resource-plus-action endpoints** for authoritative governance mutations, and plain resource endpoints for reads and simple creation

That is the strongest fit for Ardtire’s platform because this is not generic CRUD software. It is a **procedural governance system** with authority-checked transitions.

# Canonical refinement 1 — split read DTOs from write DTOs more aggressively

## Recommendation

Adopt a clear contract split:

* **Read DTOs** = optimized for retrieval, UI rendering, dashboards, and audit visibility
* **Write DTOs** = minimal command payloads for authoritative mutations
* never reuse a read DTO as a mutation request body
* avoid “mirror CRUD DTOs” for governance lifecycles

This is especially important for:

* proposals
* ballots
* certifications

## Why this is the right choice

In governance systems, reads and writes are fundamentally different:

* reads are rich, contextual, denormalized, and projection-friendly
* writes should be narrow, explicit, authority-aware, and transition-safe

If you reuse the same DTO for both, you create ambiguity such as:

* fields that appear mutable but should not be
* unclear ownership of derived state
* accidental pseudo-PUT semantics
* weak lifecycle boundaries

So the canonical approach should be:

## DTO taxonomy

### Read DTOs

Use names like:

* `ProposalListItemDto`
* `ProposalDetailDto`
* `ProposalVersionDto`
* `BallotDetailDto`
* `BallotTallyDto`
* `CertificationDetailDto`

These are response objects only.

### Write DTOs

Use names like:

* `CreateProposalDraftRequest`
* `CreateProposalVersionRequest`
* `SubmitProposalRequest`
* `AssignCommitteeRequest`
* `CreateBallotRequest`
* `OpenBallotRequest`
* `CloseBallotRequest`
* `CastVoteRequest`
* `CreateCertificationRequest`
* `RejectCertificationRequest`

These are request objects only.

### Command result DTOs

For authoritative mutations, return either:

* the updated canonical read DTO, or
* an action result DTO with summary + links

For your platform, I recommend returning the updated canonical read DTO for most actions, because it simplifies client behavior.

---

## Canonical DTO split for proposals

### Read DTOs

* `ProposalListItemDto`
* `ProposalDetailDto`
* `ProposalVersionDto`
* `ProposalStageHistoryEntryDto`
* `AmendmentDto`
* `CommitteeAssignmentDto`

### Write DTOs

* `CreateProposalDraftRequest`
* `UpdateProposalMetadataRequest` only if you explicitly allow draft metadata editing
* `CreateProposalVersionRequest`
* `SetCurrentProposalVersionRequest`
* `SubmitProposalRequest`
* `AssignCommitteeRequest`
* `TransitionProposalActionRequest`

### Important rule

Do **not** allow arbitrary “update proposal” payloads once the proposal leaves draft.
After that point, changes should happen through:

* new versions
* amendments
* explicit actions
* state transitions

That is much safer.

---

## Canonical DTO split for ballots

### Read DTOs

* `BallotListItemDto`
* `BallotDetailDto`
* `BallotEligibilityEntryDto`
* `VoteDto`
* `BallotTallyDto`
* `BallotStateHistoryEntryDto`

### Write DTOs

* `CreateBallotRequest`
* `OpenBallotRequest`
* `CloseBallotRequest`
* `CancelBallotRequest`
* `CastVoteRequest`

### Important rule

Do not expose a generic “update ballot” DTO for operational state once created.
Use explicit actions.

---

## Canonical DTO split for certifications

### Read DTOs

* `CertificationDetailDto`
* `CertificationReviewNoteDto`
* `RatificationDetailDto`

### Write DTOs

* `CreateCertificationRequest`
* `RejectCertificationRequest`
* `AddCertificationReviewNoteRequest`
* `CreateRatificationRequest`

### Important rule

Certification is not editable in a CRUD sense.
It is a governed process.
So all certification writes should be explicit commands.

---

# Canonical refinement 2 — formalize transition action vocabularies

## Recommendation

Do not use free-form or target-state-driven transition requests as the primary production contract.

Instead, use **explicit action vocabularies**.

That means:

* the client requests an action
* the server decides whether that action is valid in the current state
* the server computes the resulting state transition

This is better than sending `targetStage` because:

* it is safer
* it matches institutional procedure
* it prevents clients from pretending they control state directly
* it aligns better with audit and authority models

## Canonical pattern

### Bad / weaker

```json
{
  "targetStage": "CERTIFIED"
}
```

### Better / canonical

```json
{
  "action": "CERTIFY",
  "notes": "Quorum and threshold satisfied under applicable rule versions."
}
```

The server then validates:

* current state
* actor authority
* applicable rules
* whether `CERTIFY` is allowed from this state

---

## Canonical action vocabularies

### Proposal actions

Use a dedicated enum:

* `SUBMIT`
* `START_ELIGIBILITY_REVIEW`
* `ASSIGN_COMMITTEE`
* `MARK_IN_COMMITTEE`
* `MARK_READY_FOR_READING`
* `OPEN_FIRST_READING`
* `OPEN_AMENDMENT_WINDOW`
* `CLOSE_AMENDMENT_WINDOW`
* `OPEN_SECOND_READING`
* `SCHEDULE_FINAL_VOTE`
* `MARK_VOTING_OPEN`
* `MARK_VOTING_CLOSED`
* `MARK_RESULT_PENDING_CERTIFICATION`
* `CERTIFY`
* `RATIFY`
* `PUBLISH`
* `ARCHIVE`
* `WITHDRAW`
* `REJECT`

### Ballot actions

* `SCHEDULE`
* `OPEN`
* `CLOSE`
* `START_TALLY`
* `MARK_RESULT_COMPUTED`
* `EXPIRE`
* `CANCEL`

### Certification actions

* `START_REVIEW`
* `CERTIFY`
* `REJECT`

### Membership application actions

* `SUBMIT`
* `START_REVIEW`
* `REQUEST_INFORMATION`
* `RESUBMIT`
* `APPROVE`
* `REJECT`
* `WITHDRAW`

### Member standing actions

* `ACTIVATE`
* `RESTRICT`
* `SUSPEND`
* `REINSTATE`
* `REVOKE`
* `MARK_FORMER`

---

## Canonical request shape

Use action-specific command bodies like:

```yaml
TransitionProposalActionRequest:
  type: object
  properties:
    action:
      $ref: "#/components/schemas/ProposalAction"
    notes:
      type: string
    governanceBodyId:
      type: string
      format: uuid
  required: [action]
```

But even stronger is to use **resource-plus-action endpoints** for the major mutations instead of a single transition endpoint. More on that below.

---

# Canonical refinement 3 — add problem-details style errors

## Recommendation

Use **Problem Details for HTTP APIs** style responses.

That means error responses should look like this:

```json
{
  "type": "https://gov-api.ardtiresociety.org/problems/invalid-state-transition",
  "title": "Invalid state transition",
  "status": 409,
  "detail": "Proposal cannot be certified from stage SECOND_READING.",
  "instance": "/api/v1/proposals/0f3.../actions/certify",
  "code": "invalid_state_transition",
  "traceId": "9b7b0d6f-...",
  "errors": {
    "currentStage": ["Expected RESULT_PENDING_CERTIFICATION."]
  }
}
```

## Why this is correct

This gives you:

* standardized HTTP error shape
* machine-readable error contracts
* human-readable diagnostics
* better client handling
* easier observability and tracing

## Canonical schema

Add a shared schema like:

```yaml
ProblemDetails:
  type: object
  properties:
    type:
      type: string
      format: uri
    title:
      type: string
    status:
      type: integer
    detail:
      type: string
    instance:
      type: string
    code:
      type: string
    traceId:
      type: string
    errors:
      type: object
      additionalProperties:
        type: array
        items:
          type: string
  required: [type, title, status]
```

## Canonical error categories

Use stable internal codes such as:

* `bad_request`
* `validation_error`
* `unauthorized`
* `forbidden`
* `insufficient_authority`
* `resource_not_found`
* `invalid_state_transition`
* `rule_violation`
* `conflict`
* `duplicate_vote`
* `eligibility_failed`
* `ballot_closed`
* `version_proposal_mismatch`
* `certification_failed`

## Recommended status mapping

* `400` malformed or invalid request payload
* `401` unauthenticated
* `403` authenticated but lacking authority
* `404` not found
* `409` invalid transition, duplicate vote, lifecycle conflict
* `422` semantically valid JSON but domain validation failed
* `500` internal server error

For this system, `409` and `422` will both matter a lot.

---

# Canonical refinement 4 — decide which endpoints should be resource-plus-action style

## Recommendation

Use this rule:

### Use resource-plus-action style for:

* lifecycle transitions
* authority-sensitive mutations
* procedural commands
* stateful domain operations

### Use plain resource style for:

* reads
* creation of root resources
* list retrieval
* detail retrieval
* append-only subordinate resource creation where the meaning is obvious

This is the best balance.

## Why this is the right choice

This system is not normal CRUD.

A proposal is not just “updated.”
A ballot is not just “patched.”
A certification is not just “edited.”

These are governed actions.

So the endpoint design should make that explicit.

---

## Canonical endpoint style decisions

### Plain resource style

Keep these:

* `GET /proposals`
* `POST /proposals`
* `GET /proposals/{proposalId}`
* `GET /proposals/{proposalId}/versions`
* `POST /proposals/{proposalId}/versions`
* `GET /ballots`
* `POST /ballots`
* `GET /ballots/{ballotId}`
* `GET /ballots/{ballotId}/votes`
* `POST /ballots/{ballotId}/votes`
* `GET /records`
* `POST /records`
* `GET /records/{recordId}`
* `GET /gazette/issues`
* `POST /gazette/issues`
* `GET /gazette/issues/{issueId}`
* `GET /rules`
* `POST /rules`
* `GET /rules/{ruleId}/versions`
* `POST /rules/{ruleId}/versions`

These are fine because they are either reads or obvious append/create operations.

---

### Resource-plus-action style

This should be canonical for governance commands.

#### Proposals

Prefer:

* `POST /proposals/{proposalId}/actions/submit`
* `POST /proposals/{proposalId}/actions/assign-committee`
* `POST /proposals/{proposalId}/actions/start-eligibility-review`
* `POST /proposals/{proposalId}/actions/mark-ready-for-reading`
* `POST /proposals/{proposalId}/actions/open-first-reading`
* `POST /proposals/{proposalId}/actions/open-amendment-window`
* `POST /proposals/{proposalId}/actions/close-amendment-window`
* `POST /proposals/{proposalId}/actions/open-second-reading`
* `POST /proposals/{proposalId}/actions/schedule-final-vote`
* `POST /proposals/{proposalId}/actions/withdraw`
* `POST /proposals/{proposalId}/actions/reject`
* `POST /proposals/{proposalId}/actions/publish`
* `POST /proposals/{proposalId}/actions/archive`

Do **not** keep a generic `POST /proposals/{proposalId}/transitions` as canonical production design.
You can keep it internally if you want, but public server contract should be action-specific.

#### Proposal current version

This one is a judgment call.

I recommend:

* `POST /proposals/{proposalId}/actions/set-current-version`

rather than

* `POST /proposals/{proposalId}/current-version`

because this is an authoritative command, not just a nested resource create/update.

#### Ballots

Use:

* `POST /ballots/{ballotId}/actions/open`
* `POST /ballots/{ballotId}/actions/close`
* `POST /ballots/{ballotId}/actions/cancel`
* `POST /ballots/{ballotId}/actions/start-tally`
* `POST /ballots/{ballotId}/actions/mark-result-computed`

#### Certifications

Use:

* `POST /certifications/actions/certify`
* or, if certification records already exist,
* `POST /certifications/{certificationId}/actions/certify`
* `POST /certifications/{certificationId}/actions/reject`

My recommendation is:

* create certification with `POST /certifications`
* then act on it with:

  * `POST /certifications/{certificationId}/actions/certify`
  * `POST /certifications/{certificationId}/actions/reject`

That is the cleanest lifecycle expression.

#### Gazette

Use:

* `POST /gazette/issues/{issueId}/actions/publish`

not just `/publish` flatly embedded unless you want a simpler naming convention. Either is acceptable, but I recommend the `/actions/*` family consistently.

#### Membership applications

Use:

* `POST /membership/applications/{applicationId}/actions/start-review`
* `POST /membership/applications/{applicationId}/actions/request-information`
* `POST /membership/applications/{applicationId}/actions/approve`
* `POST /membership/applications/{applicationId}/actions/reject`
* `POST /membership/applications/{applicationId}/actions/withdraw`

This is much stronger than a generic `/review` endpoint.

#### Members

Use:

* `POST /members/{memberId}/actions/activate`
* `POST /members/{memberId}/actions/restrict`
* `POST /members/{memberId}/actions/suspend`
* `POST /members/{memberId}/actions/reinstate`
* `POST /members/{memberId}/actions/revoke`
* `POST /members/{memberId}/actions/mark-former`

This matches institutional reality much better than generic status-setting.

---

# Final canonical decision set

Here is the decision set I recommend you freeze as source of truth.

## 1. DTO strategy

Adopt **strict separation** between read DTOs and write DTOs.

## 2. Transition vocabulary

Adopt **explicit action enums**, not target-stage mutation payloads.

## 3. Error shape

Adopt **problem-details style error bodies** with stable internal codes and trace IDs.

## 4. Endpoint style

Adopt **resource-plus-action** for governance commands, while keeping plain resource style for reads and root/subresource creation.

This is the strongest architecture for Ardtire’s governance platform.

# What I recommend doing next

Proceed with the **route-by-route implementation manifest for `apps/gov-api`** before the typed gov-client plan.

That sequencing is better because:

* the gov-client should be generated from the finalized route contract
* the route manifest will freeze handler names, request DTOs, response DTOs, authority requirements, and domain service mappings
* then the typed client plan can be derived cleanly from that source of truth

5… 4… 3… next best step: generate the **route-by-route implementation manifest for `apps/gov-api`**.
