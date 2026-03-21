# Document 32 — `docs/implementation/prisma-schema-plan.md`

## Purpose of this document

This document defines the **Prisma schema plan** for the Ardtire Society Digital Governance Platform.

The earlier artifacts established:

* the institutional model
* the bounded contexts
* the domain model
* the state machines
* the rules model
* the authority model
* the event architecture
* the database architecture
* the monorepo blueprint

This document now translates those decisions into the **canonical relational persistence plan** that Prisma will represent.

It is not yet the final `schema.prisma` file. It is the **table-by-table design specification** that the final Prisma schema will implement.

This document answers:

* What tables should exist?
* Which bounded context owns each table?
* What are the key relationships?
* Which fields are required?
* Which records are mutable vs immutable?
* Which indexes and constraints are essential?
* What should be built first?

---

# 1. Schema design principles

The Prisma schema must follow these principles.

## Principle 1 — Prisma is canonical for application persistence

Prisma is the authoritative schema for the application data model unless explicitly superseded later by a formal decision.

The Prisma schema must reflect institutional meaning, not just storage convenience.

---

## Principle 2 — Tables follow bounded contexts

The schema must preserve domain boundaries.

Even if all tables live in one database, the design should still clearly reflect:

* identity
* membership
* governance
* legislative
* voting
* certification
* records
* publication
* rules
* authority
* audit
* projections
* system operations

---

## Principle 3 — Immutable history is first-class

The schema must support historical reconstruction.

This means the system should preserve:

* previous proposal versions
* prior officeholders
* previous rule versions
* event histories
* certification history
* publication chronology

---

## Principle 4 — Current state and historical state must both be queryable

The schema must support both:

* current operational queries
* historical institutional queries

A governance platform that only knows the present state is insufficient.

---

## Principle 5 — Avoid premature over-normalization where it harms clarity

Normalization matters, but governance clarity matters more.

Some read-oriented or history-oriented structures may intentionally duplicate selected data for traceability.

---

# 2. Prisma schema modules

The schema should conceptually break into the following modules:

1. Identity
2. Membership
3. Governance Structure
4. Authority
5. Legislative / Proposals
6. Voting
7. Certification / Ratification
8. Records
9. Publication
10. Rules
11. Events / Audit
12. Projections
13. Notifications / Jobs / System

---

# 3. Global conventions

## Primary keys

Use UUIDs for primary identifiers across core institutional tables.

Examples:

* `personId`
* `memberId`
* `proposalId`
* `ballotId`

---

## Timestamps

Most mutable operational tables should include:

* `createdAt`
* `updatedAt`

Historical/immutable records may instead include:

* `createdAt`
* `recordedAt`
* `publishedAt`
* `certifiedAt`

depending on context.

---

## Soft deletion

Avoid soft deletion for official governance records where possible.

For most institutional records, prefer:

* explicit archival
* supersession
* status transitions

rather than hidden soft-deletion semantics.

---

## Enums

Prisma enums should be used for stable finite lifecycle values where they improve correctness.

Examples:

* membership status
* proposal stage
* ballot state
* certification state
* publication state

---

# 4. Identity module

## 4.1 `Person`

### Purpose

Canonical human identity record for a real individual.

### Key fields

* `id`
* `displayName`
* `legalName` optional
* `primaryEmail` optional
* `primaryPhone` optional
* `createdAt`
* `updatedAt`

### Notes

A person may exist before membership is granted.

---

## 4.2 `UserAccount`

### Purpose

Authenticated platform account attached to a person.

### Key fields

* `id`
* `personId`
* `username` optional
* `isActive`
* `createdAt`
* `updatedAt`
* `lastLoginAt` optional

### Constraints

* one `UserAccount` belongs to one `Person`
* a `Person` may have zero or one primary local application account, depending on implementation choice

---

## 4.3 `ExternalIdentity`

### Purpose

External identity provider linkage.

### Key fields

* `id`
* `userAccountId`
* `provider`
* `providerSubject`
* `providerEmail` optional
* `createdAt`
* `lastSeenAt` optional

### Constraints

* unique `(provider, providerSubject)`

---

## 4.4 `SessionRecord` (optional if app-managed sessions are needed)

### Purpose

Track application sessions or session metadata if not delegated entirely to IdP.

### Key fields

* `id`
* `userAccountId`
* `issuedAt`
* `expiresAt`
* `revokedAt` optional
* `ipAddress` optional
* `userAgent` optional

---

# 5. Membership module

## 5.1 `MembershipApplication`

### Purpose

Membership application workflow root.

### Key fields

* `id`
* `applicantPersonId`
* `status`
* `submittedAt` optional
* `withdrawnAt` optional
* `decidedAt` optional
* `decisionSummary` optional
* `createdAt`
* `updatedAt`

### Expected status enum

* `DRAFT`
* `SUBMITTED`
* `UNDER_REVIEW`
* `INFORMATION_REQUESTED`
* `RESUBMITTED`
* `APPROVED`
* `REJECTED`
* `WITHDRAWN`

---

## 5.2 `MembershipApplicationReview`

### Purpose

Discrete review actions, notes, or requests during application processing.

### Key fields

* `id`
* `applicationId`
* `reviewerPersonId`
* `actionType`
* `notes` optional
* `createdAt`

### Notes

This supports review traceability without overloading the root application row.

---

## 5.3 `Member`

### Purpose

Canonical institutional membership record.

### Key fields

* `id`
* `personId`
* `memberNumber` optional but recommended
* `membershipClassId`
* `status`
* `admittedAt`
* `endedAt` optional
* `createdAt`
* `updatedAt`

### Status enum candidate

* `PENDING`
* `ACTIVE`
* `RESTRICTED`
* `SUSPENDED`
* `REVOKED`
* `FORMER`

---

## 5.4 `MembershipClass`

### Purpose

Institutionally meaningful classes of membership.

### Key fields

* `id`
* `code`
* `name`
* `description` optional
* `isVotingEligibleByDefault`
* `createdAt`
* `updatedAt`

---

## 5.5 `MembershipStatusHistory`

### Purpose

Historical changes in member standing.

### Key fields

* `id`
* `memberId`
* `fromStatus` optional
* `toStatus`
* `reason` optional
* `effectiveAt`
* `recordedByPersonId` optional
* `createdAt`

### Notes

This table is essential. Do not try to reconstruct all membership history solely from current-state rows.

---

# 6. Governance structure module

## 6.1 `GovernanceBody`

### Purpose

Institutional body such as council, committee, chamber, board, or assembly.

### Key fields

* `id`
* `code`
* `name`
* `description` optional
* `bodyType`
* `isActive`
* `createdAt`
* `updatedAt`

---

## 6.2 `Office`

### Purpose

Institutional office with authority implications.

### Key fields

* `id`
* `code`
* `name`
* `description` optional
* `governanceBodyId` optional
* `isActive`
* `createdAt`
* `updatedAt`

---

## 6.3 `OfficeTerm`

### Purpose

Defines a term slot for an office, whether filled or not.

### Key fields

* `id`
* `officeId`
* `termStart`
* `termEnd` optional
* `status`
* `createdAt`
* `updatedAt`

### Status enum candidate

* `PLANNED`
* `ACTIVE`
* `ENDED`
* `VACANT`

---

## 6.4 `OfficeHolder`

### Purpose

Assignment of a person to an office term.

### Key fields

* `id`
* `officeId`
* `officeTermId` optional or required depending on design
* `personId`
* `appointedAt`
* `startedAt`
* `endedAt` optional
* `status`
* `createdAt`
* `updatedAt`

### Notes

Historical officeholding must be preserved explicitly.

---

## 6.5 `GovernanceBodyMembership`

### Purpose

Membership of a person in a governance body.

### Key fields

* `id`
* `governanceBodyId`
* `personId`
* `roleTitle` optional
* `startedAt`
* `endedAt` optional
* `createdAt`

---

# 7. Authority module

## 7.1 `Role`

### Purpose

Software/application permission grouping.

### Key fields

* `id`
* `code`
* `name`
* `description` optional
* `createdAt`
* `updatedAt`

---

## 7.2 `RoleAssignment`

### Purpose

Assigns a role to a person or member.

### Key fields

* `id`
* `roleId`
* `personId`
* `scopeType`
* `scopeId` optional
* `assignedAt`
* `expiresAt` optional
* `revokedAt` optional
* `createdAt`

---

## 7.3 `AuthorityGrant`

### Purpose

Atomic authority capability vocabulary.

### Key fields

* `id`
* `code`
* `name`
* `description` optional
* `createdAt`

### Examples

* `proposal.submit`
* `ballot.open`
* `vote.cast`
* `result.certify`
* `gazette.publish`

---

## 7.4 `RoleAuthorityGrant`

### Purpose

Maps roles to granted authorities.

### Key fields

* `id`
* `roleId`
* `authorityGrantId`

### Constraints

* unique `(roleId, authorityGrantId)`

---

## 7.5 `OfficeAuthorityGrant`

### Purpose

Maps offices to granted authorities.

### Key fields

* `id`
* `officeId`
* `authorityGrantId`

---

## 7.6 `Delegation`

### Purpose

Delegated authority from one actor to another.

### Key fields

* `id`
* `delegatorPersonId`
* `delegatePersonId`
* `scopeType`
* `scopeId` optional
* `reason` optional
* `effectiveAt`
* `expiresAt` optional
* `revokedAt` optional
* `createdAt`

---

## 7.7 `DelegationAuthorityGrant`

### Purpose

Authorities conveyed by a delegation.

### Key fields

* `id`
* `delegationId`
* `authorityGrantId`

---

# 8. Legislative / proposals module

## 8.1 `Proposal`

### Purpose

Root legislative/governance item.

### Key fields

* `id`
* `proposalNumber` optional but recommended
* `title`
* `summary` optional
* `proposalType`
* `currentStage`
* `proposerMemberId`
* `currentVersionId` optional
* `submittedAt` optional
* `withdrawnAt` optional
* `rejectedAt` optional
* `createdAt`
* `updatedAt`

### Stage enum candidate

* `DRAFT`
* `SUBMITTED`
* `ELIGIBILITY_REVIEW`
* `COMMITTEE_ASSIGNED`
* `IN_COMMITTEE`
* `READY_FOR_READING`
* `FIRST_READING`
* `AMENDMENT_WINDOW`
* `SECOND_READING`
* `FINAL_VOTE_SCHEDULED`
* `VOTING_OPEN`
* `VOTING_CLOSED`
* `RESULT_PENDING_CERTIFICATION`
* `CERTIFIED`
* `RATIFIED`
* `PUBLISHED`
* `ARCHIVED`
* `WITHDRAWN`
* `REJECTED`

---

## 8.2 `ProposalVersion`

### Purpose

Immutable textual version lineage of a proposal.

### Key fields

* `id`
* `proposalId`
* `versionNumber`
* `titleSnapshot`
* `bodyMarkdown` or `bodyText`
* `changeSummary` optional
* `createdByPersonId`
* `createdAt`

### Constraints

* unique `(proposalId, versionNumber)`

### Important

Do not overwrite proposal text in place for official versions.

---

## 8.3 `ProposalStageHistory`

### Purpose

Historical record of stage transitions.

### Key fields

* `id`
* `proposalId`
* `fromStage` optional
* `toStage`
* `triggeredByPersonId` optional
* `reason` optional
* `effectiveAt`
* `createdAt`

---

## 8.4 `Amendment`

### Purpose

Formal amendment linked to a proposal.

### Key fields

* `id`
* `proposalId`
* `proposedByMemberId`
* `title` optional
* `bodyText`
* `status`
* `submittedAt`
* `resolvedAt` optional
* `createdAt`
* `updatedAt`

### Status enum candidate

* `PROPOSED`
* `UNDER_REVIEW`
* `ACCEPTED`
* `REJECTED`
* `WITHDRAWN`

---

## 8.5 `CommitteeAssignment`

### Purpose

Assignment of a proposal to a governance body.

### Key fields

* `id`
* `proposalId`
* `governanceBodyId`
* `assignedAt`
* `assignedByPersonId`
* `completedAt` optional
* `status`
* `createdAt`

---

## 8.6 `ProposalAttachment` (optional but likely useful)

### Purpose

Linked artifacts or supporting exhibits for a proposal.

### Key fields

* `id`
* `proposalId`
* `recordArtifactId` optional
* `title`
* `storageKey`
* `createdAt`

---

# 9. Voting module

## 9.1 `Ballot`

### Purpose

Voting instance tied to a proposal or other governed matter.

### Key fields

* `id`
* `proposalId` optional if generic ballots are supported
* `title`
* `description` optional
* `state`
* `scheduledOpenAt` optional
* `openedAt` optional
* `scheduledCloseAt` optional
* `closedAt` optional
* `cancelledAt` optional
* `createdByPersonId`
* `createdAt`
* `updatedAt`

### State enum candidate

* `DRAFT`
* `SCHEDULED`
* `OPEN`
* `CLOSED`
* `TALLYING`
* `RESULT_COMPUTED`
* `EXPIRED`
* `CANCELLED`

---

## 9.2 `BallotEligibilitySnapshot`

### Purpose

Captures who was eligible when the ballot opened.

### Key fields

* `id`
* `ballotId`
* `memberId`
* `eligibilityStatus`
* `reason` optional
* `snapshotAt`
* `createdAt`

### Constraints

* unique `(ballotId, memberId)`

### Important

This table is essential for historical defensibility.

---

## 9.3 `Vote`

### Purpose

Individual vote record.

### Key fields

* `id`
* `ballotId`
* `memberId`
* `choice`
* `castAt`
* `recordedAt`
* `createdAt`

### Constraints

* unique `(ballotId, memberId)` if one vote per eligible member

### Choice enum candidate

* `YES`
* `NO`
* `ABSTAIN`

---

## 9.4 `VoteTally`

### Purpose

Computed tally record for a ballot.

### Key fields

* `id`
* `ballotId`
* `yesCount`
* `noCount`
* `abstainCount`
* `totalCount`
* `quorumMet`
* `thresholdMet`
* `computedAt`
* `createdAt`

### Notes

This can be recomputed, but keeping a tally record improves auditability and certification packaging.

---

## 9.5 `BallotStateHistory`

### Purpose

State transition history for ballots.

### Key fields

* `id`
* `ballotId`
* `fromState` optional
* `toState`
* `triggeredByPersonId` optional
* `effectiveAt`
* `reason` optional
* `createdAt`

---

# 10. Certification / ratification module

## 10.1 `CertificationRecord`

### Purpose

Formal certification of an outcome.

### Key fields

* `id`
* `ballotId`
* `status`
* `certifiedByPersonId` optional
* `certifiedAt` optional
* `rejectedAt` optional
* `notes` optional
* `quorumRuleVersionId`
* `thresholdRuleVersionId`
* `certificationRuleVersionId` optional
* `createdAt`
* `updatedAt`

### Status enum candidate

* `PENDING`
* `UNDER_REVIEW`
* `CERTIFIED`
* `REJECTED`

### Important

This table must explicitly reference the rule versions used.

---

## 10.2 `RatificationRecord`

### Purpose

Formal ratification after certification where the institutional model requires it.

### Key fields

* `id`
* `proposalId`
* `certificationRecordId` optional
* `status`
* `ratifiedByPersonId` optional
* `ratifiedAt` optional
* `notes` optional
* `createdAt`
* `updatedAt`

---

## 10.3 `CertificationReviewNote` (optional but useful)

### Purpose

Reviewer notes, exceptions, or findings during certification.

### Key fields

* `id`
* `certificationRecordId`
* `reviewedByPersonId`
* `noteType`
* `body`
* `createdAt`

---

# 11. Records module

## 11.1 `OfficialRecord`

### Purpose

Canonical official record entry.

### Key fields

* `id`
* `recordType`
* `title`
* `summary` optional
* `sourceEntityType`
* `sourceEntityId`
* `status`
* `officializedAt` optional
* `createdAt`
* `updatedAt`

### Status enum candidate

* `DRAFT`
* `OFFICIAL`
* `PUBLISHED`
* `SUPERSEDED`
* `ARCHIVED`

---

## 11.2 `RecordVersion`

### Purpose

Version chain for records whose text or metadata must be preserved across revisions.

### Key fields

* `id`
* `officialRecordId`
* `versionNumber`
* `bodyText` or `bodyMarkdown`
* `changeSummary` optional
* `createdByPersonId` optional
* `createdAt`

---

## 11.3 `RecordArtifact`

### Purpose

Linked file artifact attached to an official record.

### Key fields

* `id`
* `officialRecordId`
* `artifactType`
* `filename`
* `mimeType`
* `storageKey`
* `checksum` optional
* `createdAt`

### Notes

Use for PDFs, exhibits, renderings, signed artifacts, exports, etc.

---

## 11.4 `RecordSupersession`

### Purpose

Tracks when one record supersedes another.

### Key fields

* `id`
* `priorRecordId`
* `supersedingRecordId`
* `reason` optional
* `createdAt`

---

# 12. Publication module

## 12.1 `GazetteIssue`

### Purpose

Collection of public official publication entries.

### Key fields

* `id`
* `issueNumber` optional but recommended
* `title`
* `publicationState`
* `scheduledFor` optional
* `publishedAt` optional
* `createdByPersonId`
* `createdAt`
* `updatedAt`

### State enum candidate

* `DRAFT`
* `READY_FOR_PUBLICATION`
* `SCHEDULED`
* `PUBLISHED`
* `SUPERSEDED`
* `RETRACTED`
* `ARCHIVED`

---

## 12.2 `GazetteEntry`

### Purpose

Individual published item in a gazette issue.

### Key fields

* `id`
* `gazetteIssueId`
* `officialRecordId`
* `titleSnapshot`
* `summarySnapshot` optional
* `publicationOrder`
* `publishedAt` optional
* `createdAt`

---

## 12.3 `PublicRegisterEntry`

### Purpose

Projection-like but official public-facing registry item.

### Key fields

* `id`
* `registerType`
* `sourceEntityType`
* `sourceEntityId`
* `displayTitle`
* `displaySummary` optional
* `publicUrlSlug` optional
* `publicationState`
* `publishedAt` optional
* `createdAt`
* `updatedAt`

### Notes

Could be modeled as part official/publication, part projection. If this becomes purely derived, it may move out of canonical tables later.

---

# 13. Rules module

## 13.1 `GovernanceRule`

### Purpose

Logical rule family.

### Key fields

* `id`
* `code`
* `name`
* `ruleType`
* `description` optional
* `sourceReference` optional
* `createdAt`
* `updatedAt`

---

## 13.2 `RuleVersion`

### Purpose

Versioned rule definition.

### Key fields

* `id`
* `governanceRuleId`
* `versionLabel`
* `effectiveFrom`
* `effectiveTo` optional
* `status`
* `createdAt`

### Status enum candidate

* `DRAFT`
* `ACTIVE`
* `SUPERSEDED`
* `RETIRED`

---

## 13.3 `RuleParameter`

### Purpose

Normalized parameters for a rule version.

### Key fields

* `id`
* `ruleVersionId`
* `key`
* `valueString` optional
* `valueNumber` optional
* `valueBoolean` optional
* `valueJson` optional
* `createdAt`

### Constraints

* unique `(ruleVersionId, key)`

---

## 13.4 `RuleScope`

### Purpose

Scope binding for a rule version.

### Key fields

* `id`
* `ruleVersionId`
* `scopeType`
* `scopeId` optional
* `createdAt`

### Examples

* global
* body-specific
* proposal-type-specific

---

# 14. Events / audit module

## 14.1 `EventLog`

### Purpose

Canonical domain/system event log.

### Key fields

* `id`
* `eventType`
* `entityType`
* `entityId`
* `actorPersonId` optional
* `correlationId` optional
* `causationId` optional
* `payloadJson`
* `metadataJson` optional
* `occurredAt`
* `recordedAt`

### Notes

Append-only.

---

## 14.2 `AuditEvent`

### Purpose

Institutionally meaningful auditable action record.

### Key fields

* `id`
* `actionType`
* `entityType`
* `entityId`
* `actorPersonId` optional
* `authoritySourceType` optional
* `authoritySourceId` optional
* `ruleVersionIdsJson` optional
* `summary` optional
* `occurredAt`
* `createdAt`

### Notes

This may partially overlap with `EventLog`, but keeping a dedicated audit table can simplify audit/reporting obligations.

---

## 14.3 `SecurityEvent`

### Purpose

Security-sensitive events.

### Key fields

* `id`
* `eventType`
* `personId` optional
* `userAccountId` optional
* `ipAddress` optional
* `userAgent` optional
* `detailsJson` optional
* `occurredAt`
* `createdAt`

---

# 15. Projections module

These are read-optimized tables and can be marked non-canonical but managed inside Prisma for convenience.

## 15.1 `ProposalListProjection`

### Fields

* `proposalId`
* `title`
* `proposerName`
* `currentStage`
* `submittedAt` optional
* `voteStatus` optional
* `updatedAt`

---

## 15.2 `ProposalDetailProjection`

### Fields

* `proposalId`
* `title`
* `currentStage`
* `currentVersionNumber`
* `latestBodySnapshot`
* `committeeName` optional
* `updatedAt`

---

## 15.3 `BallotDashboardProjection`

### Fields

* `ballotId`
* `proposalId` optional
* `title`
* `state`
* `openedAt` optional
* `closedAt` optional
* `participationRate` optional
* `updatedAt`

---

## 15.4 `VoteTallyProjection`

### Fields

* `ballotId`
* `yesCount`
* `noCount`
* `abstainCount`
* `totalCount`
* `quorumMet`
* `thresholdMet`
* `updatedAt`

---

## 15.5 `MembershipDirectoryProjection`

### Fields

* `memberId`
* `personName`
* `membershipClassName`
* `membershipStatus`
* `updatedAt`

---

## 15.6 `OfficeholderRegistryProjection`

### Fields

* `officeHolderId`
* `officeName`
* `personName`
* `termStart`
* `termEnd` optional
* `updatedAt`

---

## 15.7 `GazetteArchiveProjection`

### Fields

* `gazetteIssueId`
* `issueTitle`
* `publishedAt`
* `entryCount`
* `updatedAt`

---

# 16. Notifications / jobs / system module

## 16.1 `Notification`

### Purpose

User-facing notification record.

### Key fields

* `id`
* `personId`
* `notificationType`
* `title`
* `body`
* `deliveryStatus`
* `readAt` optional
* `createdAt`

---

## 16.2 `NotificationDelivery`

### Purpose

Per-channel delivery attempt tracking.

### Key fields

* `id`
* `notificationId`
* `channel`
* `status`
* `attemptedAt` optional
* `deliveredAt` optional
* `errorMessage` optional
* `createdAt`

---

## 16.3 `JobRecord`

### Purpose

Background job tracking.

### Key fields

* `id`
* `jobType`
* `queueName`
* `status`
* `payloadJson`
* `attemptCount`
* `scheduledFor` optional
* `startedAt` optional
* `finishedAt` optional
* `errorMessage` optional
* `createdAt`
* `updatedAt`

---

## 16.4 `SystemSetting`

### Purpose

Non-sensitive application settings that are not governance-rule controlled.

### Key fields

* `id`
* `key`
* `valueJson`
* `updatedAt`

### Caution

Do not store governance rules here.

---

# 17. Essential enums list

The initial Prisma schema will likely require enums such as:

* `MembershipApplicationStatus`
* `MembershipStatus`
* `ProposalStage`
* `AmendmentStatus`
* `BallotState`
* `VoteChoice`
* `CertificationStatus`
* `RatificationStatus`
* `OfficialRecordStatus`
* `PublicationState`
* `RuleVersionStatus`
* `JobStatus`
* `NotificationDeliveryStatus`

These should be introduced carefully and only where the state set is sufficiently stable.

---

# 18. Critical constraints and indexes

## Unique constraints

Examples:

* `ExternalIdentity(provider, providerSubject)`
* `ProposalVersion(proposalId, versionNumber)`
* `BallotEligibilitySnapshot(ballotId, memberId)`
* `Vote(ballotId, memberId)`
* `RoleAuthorityGrant(roleId, authorityGrantId)`
* `RuleParameter(ruleVersionId, key)`

## Important indexes

Examples:

* `Proposal(currentStage)`
* `Proposal(submittedAt)`
* `Ballot(state)`
* `Ballot(openedAt, closedAt)`
* `Member(status)`
* `OfficeHolder(officeId, startedAt, endedAt)`
* `EventLog(entityType, entityId)`
* `EventLog(eventType, occurredAt)`
* `AuditEvent(actionType, occurredAt)`
* `GazetteIssue(publishedAt)`
* `OfficialRecord(recordType, status)`

---

# 19. Mutable vs immutable table strategy

## Primarily mutable tables

* `Person`
* `UserAccount`
* `Member`
* `GovernanceBody`
* `Office`
* `Ballot`
* `Notification`
* `SystemSetting`

## Primarily append/history tables

* `MembershipStatusHistory`
* `ProposalVersion`
* `ProposalStageHistory`
* `BallotEligibilitySnapshot`
* `Vote`
* `VoteTally`
* `BallotStateHistory`
* `CertificationRecord`
* `RatificationRecord`
* `RecordVersion`
* `RuleVersion`
* `RuleParameter`
* `EventLog`
* `AuditEvent`
* `SecurityEvent`

This distinction is central to the institutional memory model.

---

# 20. Minimum viable schema slice

For the first meaningful vertical slice, the absolute minimum recommended tables are:

```text
Person
UserAccount
Member
MembershipClass
Proposal
ProposalVersion
ProposalStageHistory
Ballot
BallotEligibilitySnapshot
Vote
VoteTally
CertificationRecord
OfficialRecord
GazetteIssue
GazetteEntry
GovernanceRule
RuleVersion
EventLog
AuditEvent
Role
RoleAssignment
Office
OfficeHolder
AuthorityGrant
RoleAuthorityGrant
```

That set is enough to build a first end-to-end governance workflow.

---

# 21. Recommended schema implementation order

## Batch 1 — foundations

* `Person`
* `UserAccount`
* `ExternalIdentity`
* `MembershipClass`
* `Member`
* `Role`
* `AuthorityGrant`
* `RoleAssignment`

## Batch 2 — governance structure

* `GovernanceBody`
* `Office`
* `OfficeTerm`
* `OfficeHolder`
* `GovernanceBodyMembership`
* `Delegation`
* `OfficeAuthorityGrant`
* `DelegationAuthorityGrant`

## Batch 3 — proposals

* `Proposal`
* `ProposalVersion`
* `ProposalStageHistory`
* `Amendment`
* `CommitteeAssignment`

## Batch 4 — voting

* `Ballot`
* `BallotEligibilitySnapshot`
* `Vote`
* `VoteTally`
* `BallotStateHistory`

## Batch 5 — certification, records, publication

* `CertificationRecord`
* `RatificationRecord`
* `OfficialRecord`
* `RecordVersion`
* `RecordArtifact`
* `GazetteIssue`
* `GazetteEntry`
* `PublicRegisterEntry`

## Batch 6 — rules, events, projections, jobs

* `GovernanceRule`
* `RuleVersion`
* `RuleParameter`
* `RuleScope`
* `EventLog`
* `AuditEvent`
* `SecurityEvent`
* projection tables
* notification tables
* job tables

---

# 22. Risks this plan avoids

## Risk 1 — proposal text overwritten in place

Prevented by explicit `ProposalVersion`.

## Risk 2 — no historical membership trail

Prevented by `MembershipStatusHistory`.

## Risk 3 — inability to justify certification later

Prevented by rule-version references on `CertificationRecord`.

## Risk 4 — inability to reconstruct voter eligibility

Prevented by `BallotEligibilitySnapshot`.

## Risk 5 — CMS accidentally becoming institutional archive

Prevented by canonical records/publication tables in the governance database.

---

# 23. What the final `schema.prisma` should include beyond this plan

The eventual Prisma file should also include:

* relation names where needed
* database indexes
* defaults
* enum declarations
* `@@unique`, `@@index`, and `@@map` directives as needed
* optional schema names if Prisma multi-schema strategy is adopted
* migration-safe field naming choices

---

# 24. Summary

This Prisma schema plan defines the canonical persistence model for the Ardtire Society Digital Governance Platform.

It establishes the full table architecture across:

* identity
* membership
* governance
* authority
* proposals
* voting
* certification
* records
* publication
* rules
* events
* audit
* projections
* jobs and notifications

This is the direct bridge from architecture into the actual `schema.prisma` implementation.

---

## Status

**Status:** Draft — canonical persistence plan established.
**Next recommended artifact:** `docs/implementation/prisma-schema.md` or `docs/api/openapi-plan.md`

4… 3… 2… next best step: I can now generate either the **actual full Prisma schema** or the **OpenAPI specification plan**. The stronger sequencing choice is to generate the **actual Prisma schema first**.
