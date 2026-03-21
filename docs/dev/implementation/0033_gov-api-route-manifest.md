# Document 33 — `docs/implementation/gov-api-route-manifest.md`

## Purpose of this document

This document defines the **route-by-route implementation manifest** for `apps/gov-api`.

It converts the API contract into an engineering execution artifact that answers, for each route:

* what the route does
* whether it is read or command
* which request and response DTOs it uses
* which authority checks apply
* which domain/application services are invoked
* which aggregates are loaded
* which rules are evaluated
* which events are emitted
* which audit records should be created
* which projection updates are expected

This is the direct bridge from:

* architecture
* OpenAPI contract
* Prisma schema

into:

* Hono route files
* command/query handlers
* service orchestration
* testing scope

---

# 1. Manifest design principles

## Principle 1 — Each route maps to exactly one primary use case

A route may orchestrate multiple internal steps, but it should correspond to one clear primary use case.

---

## Principle 2 — Reads and commands are treated differently

Every route must be classified as either:

* **Query route**
* **Command route**

This determines handler style, transaction boundaries, and audit behavior.

---

## Principle 3 — Command routes must declare authority and lifecycle semantics explicitly

Governance commands are never “just POST endpoints.”
They must specify:

* required authority
* allowed prior states
* resulting state changes
* emitted events

---

## Principle 4 — The manifest is implementation-facing

This document should be detailed enough that an engineer can scaffold:

* route file
* request validator
* auth guard
* handler
* service call
* test cases

without guessing at responsibilities.

---

# 2. Recommended `apps/gov-api` route structure

```text
apps/gov-api/
├─ src/
│  ├─ app.ts
│  ├─ server.ts
│  ├─ routes/
│  │  ├─ identity/
│  │  ├─ membership/
│  │  ├─ governance/
│  │  ├─ roles/
│  │  ├─ proposals/
│  │  ├─ ballots/
│  │  ├─ certifications/
│  │  ├─ records/
│  │  ├─ gazette/
│  │  ├─ registers/
│  │  ├─ rules/
│  │  ├─ notifications/
│  │  ├─ jobs/
│  │  └─ audit/
│  ├─ middleware/
│  ├─ presenters/
│  ├─ validators/
│  └─ http/
│     ├─ errors/
│     ├─ problem-details/
│     └─ response-shapes/
```

---

# 3. Handler style conventions

Use two internal handler categories.

## Query handlers

Used by:

* `GET` routes
* read-only lookups
* projection-backed retrievals

Naming convention:

* `GetCurrentIdentityQueryHandler`
* `ListProposalsQueryHandler`
* `GetBallotTallyQueryHandler`

---

## Command handlers

Used by:

* authoritative mutations
* action routes
* lifecycle transitions
* authority-sensitive writes

Naming convention:

* `SubmitProposalCommandHandler`
* `AssignCommitteeCommandHandler`
* `OpenBallotCommandHandler`
* `CertifyResultCommandHandler`

---

# 4. Route manifest format

Each route below will be described using this format:

* **Route**
* **Method**
* **Category**
* **Purpose**
* **Request DTO**
* **Response DTO**
* **Authority requirement**
* **Primary handler**
* **Aggregate/repository touchpoints**
* **Rule checks**
* **Events emitted**
* **Audit event**
* **Projection impact**
* **Notes**

---

# 5. Identity routes

## 5.1 Get current identity

**Route:** `GET /api/v1/identity/me`
**Category:** Query
**Purpose:** Return authenticated actor context.

**Request DTO:** none
**Response DTO:** `CurrentIdentityResponse`

**Authority requirement:** authenticated user

**Primary handler:** `GetCurrentIdentityQueryHandler`

**Touchpoints:**

* `UserAccountRepository`
* `PersonRepository`
* `MemberRepository`

**Rule checks:** none

**Events emitted:** none
**Audit event:** none normally

**Projection impact:** none

**Notes:**
Used frequently by the web app during session bootstrap.

---

## 5.2 Get effective authority context

**Route:** `GET /api/v1/identity/roles`
**Category:** Query
**Purpose:** Return effective role, office, delegation, and authority context.

**Response DTO:** `AuthorityContextResponse`

**Authority requirement:** authenticated user

**Primary handler:** `GetAuthorityContextQueryHandler`

**Touchpoints:**

* `RoleAssignmentRepository`
* `OfficeHolderRepository`
* `DelegationRepository`
* `AuthorityResolutionService`

**Rule checks:** active membership may affect effective authority

**Events emitted:** none
**Audit event:** none

**Projection impact:** none

---

# 6. Membership routes

## 6.1 Submit membership application

**Route:** `POST /api/v1/membership/applications`
**Category:** Command
**Purpose:** Create and submit a membership application.

**Request DTO:** `CreateMembershipApplicationRequest`
**Response DTO:** `MembershipApplicationResponse`

**Authority requirement:** authenticated public/applicant actor

**Primary handler:** `SubmitMembershipApplicationCommandHandler`

**Touchpoints:**

* `MembershipApplicationRepository`
* `PersonRepository`

**Rule checks:**

* required fields present
* applicant identity context valid

**Events emitted:**

* `MembershipApplicationSubmitted`

**Audit event:**

* `SUBMIT` on `MembershipApplication`

**Projection impact:**

* membership application review queue projection, if implemented

**Notes:**
This should create application directly in `SUBMITTED` unless draft mode is explicitly supported later.

---

## 6.2 List membership applications

**Route:** `GET /api/v1/membership/applications`
**Category:** Query

**Primary handler:** `ListMembershipApplicationsQueryHandler`

**Authority requirement:** membership officer or equivalent privileged reviewer

**Touchpoints:**

* application projection/read model
* `MembershipApplicationRepository` if no projection yet

**Events emitted:** none
**Audit event:** none

---

## 6.3 Get membership application

**Route:** `GET /api/v1/membership/applications/{applicationId}`
**Category:** Query

**Primary handler:** `GetMembershipApplicationQueryHandler`

**Authority requirement:** applicant viewing own application or reviewer authority

**Touchpoints:**

* `MembershipApplicationRepository`

**Rule checks:** access scoping

---

## 6.4 Start review

**Route:** `POST /api/v1/membership/applications/{applicationId}/actions/start-review`
**Category:** Command

**Request DTO:** `StartMembershipApplicationReviewRequest`
**Response DTO:** `MembershipApplicationResponse`

**Authority requirement:** `membership.application.review`

**Primary handler:** `StartMembershipApplicationReviewCommandHandler`

**Touchpoints:**

* `MembershipApplicationRepository`
* `MembershipApplicationReviewRepository`

**Rule checks:**

* allowed current states: `SUBMITTED`, `RESUBMITTED`

**Events emitted:**

* `MembershipApplicationReviewStarted`

**Audit event:**

* `REVIEW`

---

## 6.5 Request information

**Route:** `POST /api/v1/membership/applications/{applicationId}/actions/request-information``
**Category:** Command

**Primary handler:** `RequestMembershipApplicationInformationCommandHandler`

**Authority requirement:** `membership.application.review`

**Rule checks:**

* allowed current state: `UNDER_REVIEW`

**Events emitted:**

* `MembershipApplicationInformationRequested`

**Audit event:**

* `REQUEST_INFORMATION`

---

## 6.6 Approve application

**Route:** `POST /api/v1/membership/applications/{applicationId}/actions/approve`
**Category:** Command

**Primary handler:** `ApproveMembershipApplicationCommandHandler`

**Authority requirement:** `membership.application.approve`

**Touchpoints:**

* `MembershipApplicationRepository`
* `MemberRepository`
* `MembershipStatusHistoryRepository`

**Rule checks:**

* allowed current state: `UNDER_REVIEW`
* applicant not already active member

**Events emitted:**

* `MembershipApplicationApproved`
* `MemberCreated`
* `MembershipStatusChanged`

**Audit event:**

* `APPROVE`

**Projection impact:**

* member directory
* application status views

**Notes:**
This is a transactional multi-write command.

---

## 6.7 Reject application

**Route:** `POST /api/v1/membership/applications/{applicationId}/actions/reject`
**Category:** Command

**Primary handler:** `RejectMembershipApplicationCommandHandler`

**Authority requirement:** `membership.application.reject`

**Rule checks:** current state must permit rejection

**Events emitted:**

* `MembershipApplicationRejected`

**Audit event:**

* `REJECT`

---

## 6.8 Withdraw application

**Route:** `POST /api/v1/membership/applications/{applicationId}/actions/withdraw`
**Category:** Command

**Primary handler:** `WithdrawMembershipApplicationCommandHandler`

**Authority requirement:** applicant self or privileged operator

**Events emitted:**

* `MembershipApplicationWithdrawn`

**Audit event:**

* `WITHDRAW`

---

## 6.9 List members

**Route:** `GET /api/v1/members`
**Category:** Query

**Primary handler:** `ListMembersQueryHandler`

**Touchpoints:**

* membership directory projection

---

## 6.10 Get member

**Route:** `GET /api/v1/members/{memberId}`
**Category:** Query

**Primary handler:** `GetMemberQueryHandler`

---

## 6.11 Activate member

**Route:** `POST /api/v1/members/{memberId}/actions/activate`
**Category:** Command

**Primary handler:** `ActivateMemberCommandHandler`

**Authority requirement:** `member.status.activate`

**Rule checks:**

* valid current statuses only

**Events emitted:**

* `MembershipStatusChanged`

**Audit event:**

* `APPROVE` or `UPDATE` depending on your audit vocabulary; I recommend `UPDATE` + domain-specific code internally

---

## 6.12 Restrict member

**Route:** `POST /api/v1/members/{memberId}/actions/restrict`
**Category:** Command

**Primary handler:** `RestrictMemberCommandHandler`

**Authority requirement:** `member.status.restrict`

---

## 6.13 Suspend member

**Route:** `POST /api/v1/members/{memberId}/actions/suspend`
**Category:** Command

**Primary handler:** `SuspendMemberCommandHandler`

**Authority requirement:** `member.status.suspend`

---

## 6.14 Reinstate member

**Route:** `POST /api/v1/members/{memberId}/actions/reinstate`
**Category:** Command

**Primary handler:** `ReinstateMemberCommandHandler`

**Authority requirement:** `member.status.reinstate`

---

## 6.15 Revoke member

**Route:** `POST /api/v1/members/{memberId}/actions/revoke`
**Category:** Command

**Primary handler:** `RevokeMemberCommandHandler`

**Authority requirement:** `member.status.revoke`

---

# 7. Governance structure routes

## 7.1 List governance bodies

**Route:** `GET /api/v1/governance/bodies`
**Category:** Query

**Primary handler:** `ListGovernanceBodiesQueryHandler`

---

## 7.2 Create governance body

**Route:** `POST /api/v1/governance/bodies`
**Category:** Command

**Primary handler:** `CreateGovernanceBodyCommandHandler`

**Authority requirement:** `governance.body.create`

**Events emitted:**

* `GovernanceBodyCreated`

**Audit event:**

* `CREATE`

---

## 7.3 Get governance body

**Route:** `GET /api/v1/governance/bodies/{bodyId}`
**Category:** Query

---

## 7.4 List offices

**Route:** `GET /api/v1/governance/offices`
**Category:** Query

---

## 7.5 Create office

**Route:** `POST /api/v1/governance/offices`
**Category:** Command

**Primary handler:** `CreateOfficeCommandHandler`

**Authority requirement:** `governance.office.create`

**Events emitted:**

* `OfficeCreated`

---

## 7.6 Assign office holder

**Route:** `POST /api/v1/governance/offices/{officeId}/actions/assign-holder`
**Category:** Command

**Primary handler:** `AssignOfficeHolderCommandHandler`

**Authority requirement:** `governance.office.assign_holder`

**Touchpoints:**

* `OfficeRepository`
* `OfficeTermRepository`
* `OfficeHolderRepository`
* `PersonRepository`

**Rule checks:**

* office active
* office term valid
* overlapping term restrictions if applicable

**Events emitted:**

* `OfficeHolderAssigned`

**Audit event:**

* `ASSIGN`

---

# 8. Roles and authority routes

## 8.1 List roles

**Route:** `GET /api/v1/roles`
**Category:** Query

---

## 8.2 Assign role

**Route:** `POST /api/v1/roles/assignments`
**Category:** Command

**Primary handler:** `AssignRoleCommandHandler`

**Authority requirement:** `role.assign`

**Events emitted:**

* `RoleAssigned`

**Audit event:**

* `ASSIGN`

---

## 8.3 Create delegation

**Route:** `POST /api/v1/delegations`
**Category:** Command

**Primary handler:** `CreateDelegationCommandHandler`

**Authority requirement:** `authority.delegate`

**Rule checks:**

* delegator possesses delegated grants
* delegation scope valid
* expiration valid

**Events emitted:**

* `AuthorityDelegated`

**Audit event:**

* `DELEGATE`

---

# 9. Proposal routes

## 9.1 List proposals

**Route:** `GET /api/v1/proposals`
**Category:** Query

**Primary handler:** `ListProposalsQueryHandler`

**Touchpoints:**

* proposal list projection

---

## 9.2 Create proposal draft

**Route:** `POST /api/v1/proposals`
**Category:** Command

**Primary handler:** `CreateProposalDraftCommandHandler`

**Authority requirement:** `proposal.create_draft`

**Touchpoints:**

* `ProposalRepository`
* `ProposalVersionRepository`

**Rule checks:**

* proposer eligible

**Events emitted:**

* `ProposalDraftCreated`
* `ProposalVersionCreated`

**Audit event:**

* `CREATE`

**Notes:**
This must follow the tightened transaction pattern:

1. insert proposal with `currentVersionId = null`
2. insert version 1
3. update proposal currentVersionId

---

## 9.3 Get proposal

**Route:** `GET /api/v1/proposals/{proposalId}`
**Category:** Query

**Primary handler:** `GetProposalDetailQueryHandler`

**Touchpoints:**

* proposal detail projection or composed query model

---

## 9.4 List proposal versions

**Route:** `GET /api/v1/proposals/{proposalId}/versions`
**Category:** Query

**Primary handler:** `ListProposalVersionsQueryHandler`

---

## 9.5 Create proposal version

**Route:** `POST /api/v1/proposals/{proposalId}/versions`
**Category:** Command

**Primary handler:** `CreateProposalVersionCommandHandler`

**Authority requirement:** `proposal.version.create`

**Rule checks:**

* proposal editable in current stage
* actor authorized
* version numbering correct

**Events emitted:**

* `ProposalVersionCreated`

**Audit event:**

* `CREATE`

---

## 9.6 Set current version

**Route:** `POST /api/v1/proposals/{proposalId}/actions/set-current-version`
**Category:** Command

**Primary handler:** `SetCurrentProposalVersionCommandHandler`

**Authority requirement:** `proposal.version.set_current`

**Touchpoints:**

* `ProposalRepository`
* `ProposalVersionRepository`

**Critical rule checks:**

* proposal version exists
* version belongs to same proposal

**Events emitted:**

* `ProposalCurrentVersionChanged`

**Audit event:**

* `UPDATE`

**Notes:**
This handler must enforce the invariant:
`proposalVersion.proposalId == proposal.id`

---

## 9.7 Submit proposal

**Route:** `POST /api/v1/proposals/{proposalId}/actions/submit`
**Category:** Command

**Primary handler:** `SubmitProposalCommandHandler`

**Authority requirement:** `proposal.submit`

**Rule checks:**

* current stage = `DRAFT`
* required proposal completeness checks
* proposer eligibility

**Events emitted:**

* `ProposalSubmitted`
* `ProposalStageChanged`

**Audit event:**

* `SUBMIT`

---

## 9.8 Start eligibility review

**Route:** `POST /api/v1/proposals/{proposalId}/actions/start-eligibility-review`
**Category:** Command

**Primary handler:** `StartProposalEligibilityReviewCommandHandler`

**Authority requirement:** `proposal.review.eligibility`

---

## 9.9 Assign committee

**Route:** `POST /api/v1/proposals/{proposalId}/actions/assign-committee`
**Category:** Command

**Primary handler:** `AssignCommitteeCommandHandler`

**Authority requirement:** `proposal.assign_committee`

**Touchpoints:**

* `ProposalRepository`
* `CommitteeAssignmentRepository`
* `GovernanceBodyRepository`

**Events emitted:**

* `ProposalCommitteeAssigned`
* `ProposalStageChanged`

**Audit event:**

* `ASSIGN`

---

## 9.10 Mark ready for reading

**Route:** `POST /api/v1/proposals/{proposalId}/actions/mark-ready-for-reading`
**Category:** Command

**Primary handler:** `MarkProposalReadyForReadingCommandHandler`

**Authority requirement:** `proposal.mark_ready_for_reading`

---

## 9.11 Open first reading

**Route:** `POST /api/v1/proposals/{proposalId}/actions/open-first-reading`
**Category:** Command

**Primary handler:** `OpenProposalFirstReadingCommandHandler`

**Authority requirement:** `proposal.first_reading.open`

---

## 9.12 Open amendment window

**Route:** `POST /api/v1/proposals/{proposalId}/actions/open-amendment-window`
**Category:** Command

**Primary handler:** `OpenProposalAmendmentWindowCommandHandler`

**Authority requirement:** `proposal.amendment_window.open`

---

## 9.13 Close amendment window

**Route:** `POST /api/v1/proposals/{proposalId}/actions/close-amendment-window`
**Category:** Command

**Primary handler:** `CloseProposalAmendmentWindowCommandHandler`

**Authority requirement:** `proposal.amendment_window.close`

---

## 9.14 Open second reading

**Route:** `POST /api/v1/proposals/{proposalId}/actions/open-second-reading`
**Category:** Command

---

## 9.15 Schedule final vote

**Route:** `POST /api/v1/proposals/{proposalId}/actions/schedule-final-vote`
**Category:** Command

**Primary handler:** `ScheduleProposalFinalVoteCommandHandler`

**Authority requirement:** `proposal.final_vote.schedule`

---

## 9.16 Withdraw proposal

**Route:** `POST /api/v1/proposals/{proposalId}/actions/withdraw`
**Category:** Command

**Primary handler:** `WithdrawProposalCommandHandler`

**Authority requirement:** proposer or privileged authority depending on rules

**Events emitted:**

* `ProposalWithdrawn`
* `ProposalStageChanged`

**Audit event:**

* `WITHDRAW`

---

## 9.17 Reject proposal

**Route:** `POST /api/v1/proposals/{proposalId}/actions/reject`
**Category:** Command

**Primary handler:** `RejectProposalCommandHandler`

**Authority requirement:** `proposal.reject`

---

## 9.18 Publish proposal outcome

**Route:** `POST /api/v1/proposals/{proposalId}/actions/publish`
**Category:** Command

**Primary handler:** `PublishProposalCommandHandler`

**Authority requirement:** `proposal.publish`

**Rule checks:**

* proposal ratified/certified as required

**Events emitted:**

* `ProposalPublished`

---

## 9.19 Archive proposal

**Route:** `POST /api/v1/proposals/{proposalId}/actions/archive`
**Category:** Command

**Primary handler:** `ArchiveProposalCommandHandler`

**Authority requirement:** `proposal.archive`

---

## 9.20 List amendments

**Route:** `GET /api/v1/proposals/{proposalId}/amendments`
**Category:** Query

---

## 9.21 Create amendment

**Route:** `POST /api/v1/proposals/{proposalId}/amendments`
**Category:** Command

**Primary handler:** `CreateAmendmentCommandHandler`

**Authority requirement:** `proposal.amendment.create`

**Rule checks:**

* amendment window open
* proposer eligible

**Events emitted:**

* `AmendmentCreated`

**Audit event:**

* `CREATE`

---

# 10. Ballot routes

## 10.1 List ballots

**Route:** `GET /api/v1/ballots`
**Category:** Query

---

## 10.2 Create ballot

**Route:** `POST /api/v1/ballots`
**Category:** Command

**Primary handler:** `CreateBallotCommandHandler`

**Authority requirement:** `ballot.create`

**Touchpoints:**

* `BallotRepository`
* `ProposalRepository`
* `BallotEligibilitySnapshotService`

**Rule checks:**

* linked proposal in valid state if proposal-backed
* open/close windows valid

**Events emitted:**

* `BallotCreated`

**Audit event:**

* `CREATE`

---

## 10.3 Get ballot

**Route:** `GET /api/v1/ballots/{ballotId}`
**Category:** Query

---

## 10.4 Open ballot

**Route:** `POST /api/v1/ballots/{ballotId}/actions/open`
**Category:** Command

**Primary handler:** `OpenBallotCommandHandler`

**Authority requirement:** `ballot.open`

**Touchpoints:**

* `BallotRepository`
* `EligibilitySnapshotGenerator`

**Rule checks:**

* state must be `DRAFT` or `SCHEDULED`
* timing constraints if applicable

**Events emitted:**

* `BallotOpened`
* `BallotEligibilitySnapshotted`
* `BallotStateChanged`

**Audit event:**

* `OPEN`

**Projection impact:**

* ballot dashboard
* voter notification queue

---

## 10.5 Close ballot

**Route:** `POST /api/v1/ballots/{ballotId}/actions/close`
**Category:** Command

**Primary handler:** `CloseBallotCommandHandler`

**Authority requirement:** `ballot.close`

**Rule checks:**

* ballot currently open

**Events emitted:**

* `BallotClosed`
* `BallotStateChanged`
* queue `ComputeVoteTallyJob`

**Audit event:**

* `CLOSE`

---

## 10.6 Cancel ballot

**Route:** `POST /api/v1/ballots/{ballotId}/actions/cancel`
**Category:** Command

**Primary handler:** `CancelBallotCommandHandler`

**Authority requirement:** `ballot.cancel`

---

## 10.7 Get eligibility snapshot

**Route:** `GET /api/v1/ballots/{ballotId}/eligibility`
**Category:** Query

---

## 10.8 List votes

**Route:** `GET /api/v1/ballots/{ballotId}/votes`
**Category:** Query

**Authority requirement:** restricted; likely not public depending on secrecy model

**Notes:**
Exact visibility depends on voting secrecy design.

---

## 10.9 Cast vote

**Route:** `POST /api/v1/ballots/{ballotId}/votes`
**Category:** Command

**Primary handler:** `CastVoteCommandHandler`

**Authority requirement:** `vote.cast`

**Touchpoints:**

* `BallotRepository`
* `VoteRepository`
* `BallotEligibilitySnapshotRepository`

**Rule checks:**

* ballot open
* member eligible in snapshot
* no duplicate vote

**Events emitted:**

* `VoteCast`

**Audit event:**
Depends on secrecy model. Usually:

* audit event exists, but content may be privacy-restricted

**Projection impact:**

* participation counters
* tally eventually updated

**Problem-detail codes to expect:**

* `ballot_closed`
* `duplicate_vote`
* `eligibility_failed`

---

## 10.10 Get tally

**Route:** `GET /api/v1/ballots/{ballotId}/tally`
**Category:** Query

**Primary handler:** `GetBallotTallyQueryHandler`

**Touchpoints:**

* tally projection
* fallback tally record

---

# 11. Certification routes

## 11.1 Create certification record

**Route:** `POST /api/v1/certifications`
**Category:** Command

**Primary handler:** `CreateCertificationCommandHandler`

**Authority requirement:** `certification.create`

**Touchpoints:**

* `CertificationRepository`
* `BallotRepository`
* `RuleVersionResolver`

**Rule checks:**

* ballot closed or result computed
* applicable rule versions resolvable

**Events emitted:**

* `CertificationRecordCreated`

**Audit event:**

* `CREATE`

---

## 11.2 Get certification

**Route:** `GET /api/v1/certifications/{certificationId}`
**Category:** Query

---

## 11.3 Certify result

**Route:** `POST /api/v1/certifications/{certificationId}/actions/certify`
**Category:** Command

**Primary handler:** `CertifyResultCommandHandler`

**Authority requirement:** `result.certify`

**Touchpoints:**

* `CertificationRepository`
* `VoteTallyRepository`
* `RuleEvaluationService`

**Rule checks:**

* certification state valid
* quorum satisfied
* threshold satisfied
* any certification-specific rule satisfied

**Events emitted:**

* `ResultCertified`
* `CertificationStatusChanged`

**Audit event:**

* `CERTIFY`

**Projection impact:**

* proposal status
* certification views
* record generation queue

---

## 11.4 Reject certification

**Route:** `POST /api/v1/certifications/{certificationId}/actions/reject`
**Category:** Command

**Primary handler:** `RejectCertificationCommandHandler`

**Authority requirement:** `result.certify` or explicit reject authority

**Events emitted:**

* `CertificationRejected`

**Audit event:**

* `REJECT`

---

## 11.5 Ratify proposal

**Route:** `POST /api/v1/ratifications`
**Category:** Command

**Primary handler:** `CreateRatificationCommandHandler`

**Authority requirement:** `result.ratify`

**Rule checks:**

* certification exists if required
* proposal in ratifiable state

**Events emitted:**

* `ResultRatified`

**Audit event:**

* `RATIFY`

---

# 12. Records routes

## 12.1 List records

**Route:** `GET /api/v1/records`
**Category:** Query

---

## 12.2 Create official record

**Route:** `POST /api/v1/records`
**Category:** Command

**Primary handler:** `CreateOfficialRecordCommandHandler`

**Authority requirement:** `record.create`

**Events emitted:**

* `OfficialRecordCreated`

**Audit event:**

* `CREATE`

---

## 12.3 Get official record

**Route:** `GET /api/v1/records/{recordId}`
**Category:** Query

---

## 12.4 List record versions

**Route:** `GET /api/v1/records/{recordId}/versions`
**Category:** Query

---

# 13. Gazette and publication routes

## 13.1 List gazette issues

**Route:** `GET /api/v1/gazette/issues`
**Category:** Query

---

## 13.2 Create gazette issue

**Route:** `POST /api/v1/gazette/issues`
**Category:** Command

**Primary handler:** `CreateGazetteIssueCommandHandler`

**Authority requirement:** `gazette.issue.create`

**Events emitted:**

* `GazetteIssueCreated`

---

## 13.3 Get gazette issue

**Route:** `GET /api/v1/gazette/issues/{issueId}`
**Category:** Query

---

## 13.4 Publish gazette issue

**Route:** `POST /api/v1/gazette/issues/{issueId}/actions/publish`
**Category:** Command

**Primary handler:** `PublishGazetteIssueCommandHandler`

**Authority requirement:** `gazette.issue.publish`

**Rule checks:**

* issue state valid
* included records publication-eligible

**Events emitted:**

* `GazetteIssuePublished`

**Audit event:**

* `PUBLISH`

---

## 13.5 Create gazette entry

**Route:** `POST /api/v1/gazette/entries`
**Category:** Command

**Primary handler:** `CreateGazetteEntryCommandHandler`

**Authority requirement:** `gazette.entry.create`

**Events emitted:**

* `GazetteEntryCreated`

---

# 14. Public register routes

## 14.1 List public register entries

**Route:** `GET /api/v1/registers`
**Category:** Query

**Primary handler:** `ListPublicRegisterEntriesQueryHandler`

---

# 15. Rules routes

## 15.1 List governance rules

**Route:** `GET /api/v1/rules`
**Category:** Query

---

## 15.2 Create governance rule family

**Route:** `POST /api/v1/rules`
**Category:** Command

**Primary handler:** `CreateGovernanceRuleCommandHandler`

**Authority requirement:** `rule.create`

**Events emitted:**

* `GovernanceRuleCreated`

---

## 15.3 List rule versions

**Route:** `GET /api/v1/rules/{ruleId}/versions`
**Category:** Query

---

## 15.4 Create rule version

**Route:** `POST /api/v1/rules/{ruleId}/versions`
**Category:** Command

**Primary handler:** `CreateRuleVersionCommandHandler`

**Authority requirement:** `rule.version.create`

**Events emitted:**

* `RuleVersionCreated`

**Audit event:**

* `CREATE`

**Notes:**
This is a governance-sensitive operation and may later require a higher procedural approval boundary.

---

# 16. Notifications routes

## 16.1 List current actor notifications

**Route:** `GET /api/v1/notifications`
**Category:** Query

**Primary handler:** `ListNotificationsQueryHandler`

---

# 17. Jobs routes

## 17.1 List jobs

**Route:** `GET /api/v1/jobs`
**Category:** Query

**Primary handler:** `ListJobsQueryHandler`

**Authority requirement:** operational/admin authority

---

# 18. Audit routes

## 18.1 List audit events

**Route:** `GET /api/v1/audit/events`
**Category:** Query

**Primary handler:** `ListAuditEventsQueryHandler`

**Authority requirement:** audit or admin authority

**Touchpoints:**

* audit event store / audit read model

---

# 19. Canonical middleware stack per route category

## Query route middleware

1. request ID / trace middleware
2. auth middleware if protected
3. authority scoping middleware where needed
4. query parameter validation
5. handler
6. response presenter

## Command route middleware

1. request ID / trace middleware
2. auth middleware
3. request body validation
4. authority guard
5. command handler
6. audit emission wrapper if not done inside service
7. problem-details error mapper
8. response presenter

---

# 20. Canonical Hono file mapping recommendation

Recommended route file grouping:

```text
routes/
  identity/get-current-identity.ts
  identity/get-authority-context.ts

  membership/submit-membership-application.ts
  membership/list-membership-applications.ts
  membership/get-membership-application.ts
  membership/start-membership-application-review.ts
  membership/request-membership-application-information.ts
  membership/approve-membership-application.ts
  membership/reject-membership-application.ts
  membership/withdraw-membership-application.ts
  membership/list-members.ts
  membership/get-member.ts
  membership/activate-member.ts
  membership/restrict-member.ts
  membership/suspend-member.ts
  membership/reinstate-member.ts
  membership/revoke-member.ts

  governance/list-governance-bodies.ts
  governance/create-governance-body.ts
  governance/get-governance-body.ts
  governance/list-offices.ts
  governance/create-office.ts
  governance/assign-office-holder.ts

  roles/list-roles.ts
  roles/assign-role.ts
  roles/create-delegation.ts

  proposals/list-proposals.ts
  proposals/create-proposal-draft.ts
  proposals/get-proposal.ts
  proposals/list-proposal-versions.ts
  proposals/create-proposal-version.ts
  proposals/set-current-proposal-version.ts
  proposals/submit-proposal.ts
  proposals/start-proposal-eligibility-review.ts
  proposals/assign-committee.ts
  proposals/mark-ready-for-reading.ts
  proposals/open-first-reading.ts
  proposals/open-amendment-window.ts
  proposals/close-amendment-window.ts
  proposals/open-second-reading.ts
  proposals/schedule-final-vote.ts
  proposals/withdraw-proposal.ts
  proposals/reject-proposal.ts
  proposals/publish-proposal.ts
  proposals/archive-proposal.ts
  proposals/list-amendments.ts
  proposals/create-amendment.ts

  ballots/list-ballots.ts
  ballots/create-ballot.ts
  ballots/get-ballot.ts
  ballots/open-ballot.ts
  ballots/close-ballot.ts
  ballots/cancel-ballot.ts
  ballots/get-ballot-eligibility.ts
  ballots/list-votes.ts
  ballots/cast-vote.ts
  ballots/get-ballot-tally.ts

  certifications/create-certification.ts
  certifications/get-certification.ts
  certifications/certify-result.ts
  certifications/reject-certification.ts
  certifications/create-ratification.ts

  records/list-records.ts
  records/create-record.ts
  records/get-record.ts
  records/list-record-versions.ts

  gazette/list-gazette-issues.ts
  gazette/create-gazette-issue.ts
  gazette/get-gazette-issue.ts
  gazette/publish-gazette-issue.ts
  gazette/create-gazette-entry.ts

  registers/list-public-register-entries.ts

  rules/list-rules.ts
  rules/create-rule.ts
  rules/list-rule-versions.ts
  rules/create-rule-version.ts

  notifications/list-notifications.ts
  jobs/list-jobs.ts
  audit/list-audit-events.ts
```

---

# 21. Canonical test expectations per route

Every command route should have at least:

1. happy-path test
2. unauthenticated test
3. insufficient-authority test
4. invalid-state test
5. validation failure test
6. audit event assertion
7. emitted event assertion

Every query route should have at least:

1. happy-path test
2. auth/visibility test if protected
3. pagination/filter test if applicable
4. not-found test where applicable

---

# 22. Highest-priority implementation order for routes

A senior engineer would not implement every route in API-surface order.
The best initial vertical slice order is:

## Slice 1 — identity + proposal creation

* `GET /identity/me`
* `POST /proposals`
* `GET /proposals/{proposalId}`
* `GET /proposals`
* `GET /proposals/{proposalId}/versions`

## Slice 2 — proposal lifecycle

* `POST /proposals/{proposalId}/actions/set-current-version`
* `POST /proposals/{proposalId}/actions/submit`
* `POST /proposals/{proposalId}/actions/assign-committee`

## Slice 3 — ballot lifecycle

* `POST /ballots`
* `POST /ballots/{ballotId}/actions/open`
* `POST /ballots/{ballotId}/votes`
* `POST /ballots/{ballotId}/actions/close`
* `GET /ballots/{ballotId}/tally`

## Slice 4 — certification + records + publication

* `POST /certifications`
* `POST /certifications/{certificationId}/actions/certify`
* `POST /records`
* `POST /gazette/issues`
* `POST /gazette/entries`
* `POST /gazette/issues/{issueId}/actions/publish`

That gives you the first meaningful end-to-end governance workflow.

---

# 23. Summary

This manifest defines the canonical route-by-route implementation plan for `apps/gov-api`.

It establishes for each route:

* query vs command classification
* DTO boundaries
* authority expectations
* handler naming
* repository touchpoints
* rule evaluation requirements
* emitted events
* audit obligations
* projection implications

This should now be treated as the implementation-facing source of truth for the backend API layer.

## Recommended next step

The strongest next step is now the **typed `gov-client` plan**, because the route contract is sufficiently frozen to define:

* package shape
* generated vs handwritten client boundaries
* request/response typing strategy
* error typing strategy
* server-function integration pattern for `apps/web`
