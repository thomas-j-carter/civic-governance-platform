-- CreateEnum
CREATE TYPE "MembershipApplicationStatus" AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'INFORMATION_REQUESTED',
  'RESUBMITTED',
  'APPROVED',
  'REJECTED',
  'WITHDRAWN'
);

CREATE TYPE "MembershipStatus" AS ENUM (
  'PENDING',
  'ACTIVE',
  'RESTRICTED',
  'SUSPENDED',
  'REVOKED',
  'FORMER'
);

CREATE TYPE "GovernanceBodyType" AS ENUM (
  'ASSEMBLY',
  'COUNCIL',
  'COMMITTEE',
  'CHAMBER',
  'BOARD',
  'OFFICE',
  'OTHER'
);

CREATE TYPE "OfficeTermStatus" AS ENUM (
  'PLANNED',
  'ACTIVE',
  'ENDED',
  'VACANT'
);

CREATE TYPE "OfficeHolderStatus" AS ENUM (
  'ACTIVE',
  'ENDED',
  'REMOVED'
);

CREATE TYPE "ScopeType" AS ENUM (
  'GLOBAL',
  'GOVERNANCE_BODY',
  'OFFICE',
  'OFFICE_TERM',
  'PROPOSAL',
  'BALLOT',
  'MEMBER',
  'PERSON',
  'RULE',
  'RECORD',
  'GAZETTE_ISSUE',
  'PROPOSAL_TYPE',
  'OTHER'
);

CREATE TYPE "ProposalType" AS ENUM (
  'GENERAL',
  'RESOLUTION',
  'ACT',
  'AMENDMENT',
  'APPOINTMENT',
  'RULE_CHANGE',
  'BUDGET',
  'OTHER'
);

CREATE TYPE "ProposalStage" AS ENUM (
  'DRAFT',
  'SUBMITTED',
  'ELIGIBILITY_REVIEW',
  'COMMITTEE_ASSIGNED',
  'IN_COMMITTEE',
  'READY_FOR_READING',
  'FIRST_READING',
  'AMENDMENT_WINDOW',
  'SECOND_READING',
  'FINAL_VOTE_SCHEDULED',
  'VOTING_OPEN',
  'VOTING_CLOSED',
  'RESULT_PENDING_CERTIFICATION',
  'CERTIFIED',
  'RATIFIED',
  'PUBLISHED',
  'ARCHIVED',
  'WITHDRAWN',
  'REJECTED'
);

CREATE TYPE "AmendmentStatus" AS ENUM (
  'PROPOSED',
  'UNDER_REVIEW',
  'ACCEPTED',
  'REJECTED',
  'WITHDRAWN'
);

CREATE TYPE "CommitteeAssignmentStatus" AS ENUM (
  'ASSIGNED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED'
);

CREATE TYPE "BallotState" AS ENUM (
  'DRAFT',
  'SCHEDULED',
  'OPEN',
  'CLOSED',
  'TALLYING',
  'RESULT_COMPUTED',
  'EXPIRED',
  'CANCELLED'
);

CREATE TYPE "EligibilityStatus" AS ENUM (
  'ELIGIBLE',
  'INELIGIBLE'
);

CREATE TYPE "VoteChoice" AS ENUM (
  'YES',
  'NO',
  'ABSTAIN'
);

CREATE TYPE "CertificationStatus" AS ENUM (
  'PENDING',
  'UNDER_REVIEW',
  'CERTIFIED',
  'REJECTED'
);

CREATE TYPE "RatificationStatus" AS ENUM (
  'PENDING',
  'RATIFIED',
  'REJECTED'
);

CREATE TYPE "OfficialRecordStatus" AS ENUM (
  'DRAFT',
  'OFFICIAL',
  'PUBLISHED',
  'SUPERSEDED',
  'ARCHIVED'
);

CREATE TYPE "PublicationState" AS ENUM (
  'DRAFT',
  'READY_FOR_PUBLICATION',
  'SCHEDULED',
  'PUBLISHED',
  'SUPERSEDED',
  'RETRACTED',
  'ARCHIVED'
);

CREATE TYPE "RuleType" AS ENUM (
  'PROCEDURAL',
  'ELIGIBILITY',
  'QUORUM',
  'THRESHOLD',
  'CERTIFICATION',
  'PUBLICATION',
  'AUTHORITY',
  'OTHER'
);

CREATE TYPE "RuleVersionStatus" AS ENUM (
  'DRAFT',
  'ACTIVE',
  'SUPERSEDED',
  'RETIRED'
);

CREATE TYPE "ActionType" AS ENUM (
  'CREATE',
  'UPDATE',
  'DELETE',
  'SUBMIT',
  'REVIEW',
  'APPROVE',
  'REJECT',
  'REQUEST_INFORMATION',
  'RESUBMIT',
  'ASSIGN',
  'OPEN',
  'CLOSE',
  'CAST',
  'COMPUTE',
  'CERTIFY',
  'RATIFY',
  'PUBLISH',
  'ARCHIVE',
  'REVOKE',
  'DELEGATE',
  'LOGIN',
  'LOGOUT',
  'OTHER'
);

CREATE TYPE "RecordArtifactType" AS ENUM (
  'PDF',
  'MARKDOWN',
  'HTML',
  'DOCX',
  'IMAGE',
  'ATTACHMENT',
  'SIGNED_COPY',
  'EXPORT',
  'OTHER'
);

CREATE TYPE "NotificationType" AS ENUM (
  'INFO',
  'ACTION_REQUIRED',
  'STATUS_CHANGE',
  'GOVERNANCE',
  'SECURITY',
  'PUBLICATION',
  'OTHER'
);

CREATE TYPE "NotificationDeliveryStatus" AS ENUM (
  'PENDING',
  'SENT',
  'DELIVERED',
  'FAILED',
  'READ',
  'CANCELLED'
);

CREATE TYPE "NotificationChannel" AS ENUM (
  'EMAIL',
  'IN_APP',
  'WEBHOOK',
  'SMS',
  'OTHER'
);

CREATE TYPE "JobStatus" AS ENUM (
  'PENDING',
  'QUEUED',
  'RUNNING',
  'SUCCEEDED',
  'FAILED',
  'CANCELLED',
  'DEAD_LETTER'
);

CREATE TYPE "EventCategory" AS ENUM (
  'DOMAIN',
  'SYSTEM',
  'INTEGRATION',
  'SECURITY',
  'AUDIT'
);

-- CreateTable
CREATE TABLE "persons" (
  "id" UUID NOT NULL,
  "displayName" TEXT NOT NULL,
  "legalName" TEXT,
  "primaryEmail" TEXT,
  "primaryPhone" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "user_accounts" (
  "id" UUID NOT NULL,
  "personId" UUID NOT NULL,
  "username" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "lastLoginAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "user_accounts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "external_identities" (
  "id" UUID NOT NULL,
  "userAccountId" UUID NOT NULL,
  "provider" TEXT NOT NULL,
  "providerSubject" TEXT NOT NULL,
  "providerEmail" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lastSeenAt" TIMESTAMPTZ(6),
  "personId" UUID,
  CONSTRAINT "external_identities_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "session_records" (
  "id" UUID NOT NULL,
  "userAccountId" UUID NOT NULL,
  "personId" UUID,
  "issuedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMPTZ(6) NOT NULL,
  "revokedAt" TIMESTAMPTZ(6),
  "ipAddress" TEXT,
  "userAgent" TEXT,
  CONSTRAINT "session_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_applications" (
  "id" UUID NOT NULL,
  "applicantPersonId" UUID NOT NULL,
  "status" "MembershipApplicationStatus" NOT NULL DEFAULT 'DRAFT',
  "supportingStatement" TEXT,
  "submittedAt" TIMESTAMPTZ(6),
  "withdrawnAt" TIMESTAMPTZ(6),
  "decidedAt" TIMESTAMPTZ(6),
  "decisionSummary" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "membership_applications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_application_reviews" (
  "id" UUID NOT NULL,
  "applicationId" UUID NOT NULL,
  "reviewerPersonId" UUID NOT NULL,
  "actionType" "ActionType" NOT NULL,
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "membership_application_reviews_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_classes" (
  "id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "isVotingEligibleByDefault" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "membership_classes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "members" (
  "id" UUID NOT NULL,
  "personId" UUID NOT NULL,
  "memberNumber" TEXT,
  "membershipClassId" UUID NOT NULL,
  "status" "MembershipStatus" NOT NULL DEFAULT 'PENDING',
  "admittedAt" TIMESTAMPTZ(6),
  "endedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "membership_status_history" (
  "id" UUID NOT NULL,
  "memberId" UUID NOT NULL,
  "fromStatus" "MembershipStatus",
  "toStatus" "MembershipStatus" NOT NULL,
  "reason" TEXT,
  "effectiveAt" TIMESTAMPTZ(6) NOT NULL,
  "recordedByPersonId" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "membership_status_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "governance_bodies" (
  "id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "bodyType" "GovernanceBodyType" NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "governance_bodies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "governance_body_memberships" (
  "id" UUID NOT NULL,
  "governanceBodyId" UUID NOT NULL,
  "personId" UUID NOT NULL,
  "roleTitle" TEXT,
  "startedAt" TIMESTAMPTZ(6) NOT NULL,
  "endedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "governance_body_memberships_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "offices" (
  "id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "governanceBodyId" UUID,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "offices_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "office_terms" (
  "id" UUID NOT NULL,
  "officeId" UUID NOT NULL,
  "termStart" TIMESTAMPTZ(6) NOT NULL,
  "termEnd" TIMESTAMPTZ(6),
  "status" "OfficeTermStatus" NOT NULL DEFAULT 'PLANNED',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "office_terms_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "office_holders" (
  "id" UUID NOT NULL,
  "officeId" UUID NOT NULL,
  "officeTermId" UUID,
  "personId" UUID NOT NULL,
  "appointedAt" TIMESTAMPTZ(6),
  "startedAt" TIMESTAMPTZ(6) NOT NULL,
  "endedAt" TIMESTAMPTZ(6),
  "status" "OfficeHolderStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "office_holders_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "roles" (
  "id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "role_assignments" (
  "id" UUID NOT NULL,
  "roleId" UUID NOT NULL,
  "personId" UUID NOT NULL,
  "scopeType" "ScopeType" NOT NULL DEFAULT 'GLOBAL',
  "scopeId" TEXT,
  "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "expiresAt" TIMESTAMPTZ(6),
  "revokedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "role_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "authority_grants" (
  "id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "authority_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "role_authority_grants" (
  "id" UUID NOT NULL,
  "roleId" UUID NOT NULL,
  "authorityGrantId" UUID NOT NULL,
  CONSTRAINT "role_authority_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "office_authority_grants" (
  "id" UUID NOT NULL,
  "officeId" UUID NOT NULL,
  "authorityGrantId" UUID NOT NULL,
  CONSTRAINT "office_authority_grants_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "delegations" (
  "id" UUID NOT NULL,
  "delegatorPersonId" UUID NOT NULL,
  "delegatePersonId" UUID NOT NULL,
  "scopeType" "ScopeType" NOT NULL DEFAULT 'GLOBAL',
  "scopeId" TEXT,
  "reason" TEXT,
  "effectiveAt" TIMESTAMPTZ(6) NOT NULL,
  "expiresAt" TIMESTAMPTZ(6),
  "revokedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "delegations_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "delegation_authority_grants" (
  "id" UUID NOT NULL,
  "delegationId" UUID NOT NULL,
  "authorityGrantId" UUID NOT NULL,
  CONSTRAINT "delegation_authority_grants_pkey" PRIMARY KEY ("id")
);

-- Tightened proposal/version handling starts here:
CREATE TABLE "proposals" (
  "id" UUID NOT NULL,
  "proposalNumber" TEXT,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "proposalType" "ProposalType" NOT NULL DEFAULT 'GENERAL',
  "currentStage" "ProposalStage" NOT NULL DEFAULT 'DRAFT',
  "proposerPersonId" UUID,
  "proposerMemberId" UUID,
  "currentVersionId" UUID,
  "submittedAt" TIMESTAMPTZ(6),
  "withdrawnAt" TIMESTAMPTZ(6),
  "rejectedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "proposal_versions" (
  "id" UUID NOT NULL,
  "proposalId" UUID NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "titleSnapshot" TEXT NOT NULL,
  "bodyMarkdown" TEXT NOT NULL,
  "changeSummary" TEXT,
  "createdByPersonId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "proposal_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "proposal_stage_history" (
  "id" UUID NOT NULL,
  "proposalId" UUID NOT NULL,
  "fromStage" "ProposalStage",
  "toStage" "ProposalStage" NOT NULL,
  "triggeredByPersonId" UUID,
  "reason" TEXT,
  "effectiveAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "proposal_stage_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "amendments" (
  "id" UUID NOT NULL,
  "proposalId" UUID NOT NULL,
  "proposedByPersonId" UUID,
  "proposedByMemberId" UUID,
  "title" TEXT,
  "bodyText" TEXT NOT NULL,
  "status" "AmendmentStatus" NOT NULL DEFAULT 'PROPOSED',
  "submittedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "resolvedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "amendments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "committee_assignments" (
  "id" UUID NOT NULL,
  "proposalId" UUID NOT NULL,
  "governanceBodyId" UUID NOT NULL,
  "assignedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "assignedByPersonId" UUID NOT NULL,
  "completedAt" TIMESTAMPTZ(6),
  "status" "CommitteeAssignmentStatus" NOT NULL DEFAULT 'ASSIGNED',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "committee_assignments_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ballots" (
  "id" UUID NOT NULL,
  "proposalId" UUID,
  "title" TEXT NOT NULL,
  "description" TEXT,
  "state" "BallotState" NOT NULL DEFAULT 'DRAFT',
  "scheduledOpenAt" TIMESTAMPTZ(6),
  "openedAt" TIMESTAMPTZ(6),
  "scheduledCloseAt" TIMESTAMPTZ(6),
  "closedAt" TIMESTAMPTZ(6),
  "cancelledAt" TIMESTAMPTZ(6),
  "createdByPersonId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "ballots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ballot_eligibility_snapshots" (
  "id" UUID NOT NULL,
  "ballotId" UUID NOT NULL,
  "memberId" UUID NOT NULL,
  "eligibilityStatus" "EligibilityStatus" NOT NULL,
  "reason" TEXT,
  "snapshotAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ballot_eligibility_snapshots_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "votes" (
  "id" UUID NOT NULL,
  "ballotId" UUID NOT NULL,
  "memberId" UUID NOT NULL,
  "personId" UUID,
  "choice" "VoteChoice" NOT NULL,
  "castAt" TIMESTAMPTZ(6) NOT NULL,
  "recordedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "votes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "vote_tallies" (
  "id" UUID NOT NULL,
  "ballotId" UUID NOT NULL,
  "yesCount" INTEGER NOT NULL DEFAULT 0,
  "noCount" INTEGER NOT NULL DEFAULT 0,
  "abstainCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "quorumMet" BOOLEAN NOT NULL DEFAULT false,
  "thresholdMet" BOOLEAN NOT NULL DEFAULT false,
  "computedAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "vote_tallies_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ballot_state_history" (
  "id" UUID NOT NULL,
  "ballotId" UUID NOT NULL,
  "fromState" "BallotState",
  "toState" "BallotState" NOT NULL,
  "triggeredByPersonId" UUID,
  "effectiveAt" TIMESTAMPTZ(6) NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ballot_state_history_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "governance_rules" (
  "id" UUID NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "ruleType" "RuleType" NOT NULL,
  "description" TEXT,
  "sourceReference" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "governance_rules_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rule_versions" (
  "id" UUID NOT NULL,
  "governanceRuleId" UUID NOT NULL,
  "versionLabel" TEXT NOT NULL,
  "effectiveFrom" TIMESTAMPTZ(6) NOT NULL,
  "effectiveTo" TIMESTAMPTZ(6),
  "status" "RuleVersionStatus" NOT NULL DEFAULT 'DRAFT',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rule_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rule_parameters" (
  "id" UUID NOT NULL,
  "ruleVersionId" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "valueString" TEXT,
  "valueNumber" DOUBLE PRECISION,
  "valueBoolean" BOOLEAN,
  "valueJson" JSONB,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rule_parameters_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rule_scopes" (
  "id" UUID NOT NULL,
  "ruleVersionId" UUID NOT NULL,
  "scopeType" "ScopeType" NOT NULL,
  "scopeId" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "rule_scopes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "certification_records" (
  "id" UUID NOT NULL,
  "ballotId" UUID NOT NULL,
  "status" "CertificationStatus" NOT NULL DEFAULT 'PENDING',
  "certifiedByPersonId" UUID,
  "certifiedAt" TIMESTAMPTZ(6),
  "rejectedAt" TIMESTAMPTZ(6),
  "notes" TEXT,
  "quorumRuleVersionId" UUID NOT NULL,
  "thresholdRuleVersionId" UUID NOT NULL,
  "certificationRuleVersionId" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "certification_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "certification_review_notes" (
  "id" UUID NOT NULL,
  "certificationRecordId" UUID NOT NULL,
  "reviewedByPersonId" UUID NOT NULL,
  "noteType" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "certification_review_notes_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ratification_records" (
  "id" UUID NOT NULL,
  "proposalId" UUID NOT NULL,
  "certificationRecordId" UUID,
  "status" "RatificationStatus" NOT NULL DEFAULT 'PENDING',
  "ratifiedByPersonId" UUID,
  "ratifiedAt" TIMESTAMPTZ(6),
  "notes" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "ratification_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "official_records" (
  "id" UUID NOT NULL,
  "recordType" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "sourceEntityType" TEXT NOT NULL,
  "sourceEntityId" TEXT NOT NULL,
  "status" "OfficialRecordStatus" NOT NULL DEFAULT 'DRAFT',
  "officializedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "official_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "record_versions" (
  "id" UUID NOT NULL,
  "officialRecordId" UUID NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "bodyMarkdown" TEXT NOT NULL,
  "changeSummary" TEXT,
  "createdByPersonId" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "record_versions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "record_artifacts" (
  "id" UUID NOT NULL,
  "officialRecordId" UUID NOT NULL,
  "artifactType" "RecordArtifactType" NOT NULL,
  "filename" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "storageKey" TEXT NOT NULL,
  "checksum" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "record_artifacts_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "record_supersessions" (
  "id" UUID NOT NULL,
  "priorRecordId" UUID NOT NULL,
  "supersedingRecordId" UUID NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "record_supersessions_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "gazette_issues" (
  "id" UUID NOT NULL,
  "issueNumber" TEXT,
  "title" TEXT NOT NULL,
  "publicationState" "PublicationState" NOT NULL DEFAULT 'DRAFT',
  "scheduledFor" TIMESTAMPTZ(6),
  "publishedAt" TIMESTAMPTZ(6),
  "createdByPersonId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "gazette_issues_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "gazette_entries" (
  "id" UUID NOT NULL,
  "gazetteIssueId" UUID NOT NULL,
  "officialRecordId" UUID NOT NULL,
  "titleSnapshot" TEXT NOT NULL,
  "summarySnapshot" TEXT,
  "publicationOrder" INTEGER NOT NULL,
  "publishedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "gazette_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public_register_entries" (
  "id" UUID NOT NULL,
  "registerType" TEXT NOT NULL,
  "sourceEntityType" TEXT NOT NULL,
  "sourceEntityId" TEXT NOT NULL,
  "displayTitle" TEXT NOT NULL,
  "displaySummary" TEXT,
  "publicUrlSlug" TEXT,
  "publicationState" "PublicationState" NOT NULL DEFAULT 'DRAFT',
  "publishedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "public_register_entries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "event_log" (
  "id" UUID NOT NULL,
  "eventType" TEXT NOT NULL,
  "eventCategory" "EventCategory" NOT NULL DEFAULT 'DOMAIN',
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "actorPersonId" UUID,
  "correlationId" UUID,
  "causationId" UUID,
  "payloadJson" JSONB NOT NULL,
  "metadataJson" JSONB,
  "occurredAt" TIMESTAMPTZ(6) NOT NULL,
  "recordedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "event_log_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "audit_events" (
  "id" UUID NOT NULL,
  "actionType" "ActionType" NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "actorPersonId" UUID,
  "authoritySourceType" TEXT,
  "authoritySourceId" TEXT,
  "ruleVersionIdsJson" JSONB,
  "summary" TEXT,
  "occurredAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "audit_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "security_events" (
  "id" UUID NOT NULL,
  "eventType" TEXT NOT NULL,
  "personId" UUID,
  "userAccountId" UUID,
  "ipAddress" TEXT,
  "userAgent" TEXT,
  "detailsJson" JSONB,
  "occurredAt" TIMESTAMPTZ(6) NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "projection_proposal_list" (
  "proposalId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "proposerName" TEXT,
  "currentStage" "ProposalStage" NOT NULL,
  "submittedAt" TIMESTAMPTZ(6),
  "voteStatus" TEXT,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projection_proposal_list_pkey" PRIMARY KEY ("proposalId")
);

CREATE TABLE "projection_proposal_detail" (
  "proposalId" UUID NOT NULL,
  "title" TEXT NOT NULL,
  "currentStage" "ProposalStage" NOT NULL,
  "currentVersionNumber" INTEGER,
  "latestBodySnapshot" TEXT,
  "committeeName" TEXT,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projection_proposal_detail_pkey" PRIMARY KEY ("proposalId")
);

CREATE TABLE "projection_ballot_dashboard" (
  "ballotId" UUID NOT NULL,
  "proposalId" UUID,
  "title" TEXT NOT NULL,
  "state" "BallotState" NOT NULL,
  "openedAt" TIMESTAMPTZ(6),
  "closedAt" TIMESTAMPTZ(6),
  "participationRate" DOUBLE PRECISION,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projection_ballot_dashboard_pkey" PRIMARY KEY ("ballotId")
);

CREATE TABLE "projection_vote_tally" (
  "ballotId" UUID NOT NULL,
  "yesCount" INTEGER NOT NULL DEFAULT 0,
  "noCount" INTEGER NOT NULL DEFAULT 0,
  "abstainCount" INTEGER NOT NULL DEFAULT 0,
  "totalCount" INTEGER NOT NULL DEFAULT 0,
  "quorumMet" BOOLEAN NOT NULL DEFAULT false,
  "thresholdMet" BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projection_vote_tally_pkey" PRIMARY KEY ("ballotId")
);

CREATE TABLE "projection_membership_directory" (
  "memberId" UUID NOT NULL,
  "personName" TEXT NOT NULL,
  "membershipClassName" TEXT NOT NULL,
  "membershipStatus" "MembershipStatus" NOT NULL,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projection_membership_directory_pkey" PRIMARY KEY ("memberId")
);

CREATE TABLE "projection_officeholder_registry" (
  "officeHolderId" UUID NOT NULL,
  "officeName" TEXT NOT NULL,
  "personName" TEXT NOT NULL,
  "termStart" TIMESTAMPTZ(6),
  "termEnd" TIMESTAMPTZ(6),
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projection_officeholder_registry_pkey" PRIMARY KEY ("officeHolderId")
);

CREATE TABLE "projection_gazette_archive" (
  "gazetteIssueId" UUID NOT NULL,
  "issueTitle" TEXT NOT NULL,
  "publishedAt" TIMESTAMPTZ(6),
  "entryCount" INTEGER NOT NULL DEFAULT 0,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "projection_gazette_archive_pkey" PRIMARY KEY ("gazetteIssueId")
);

CREATE TABLE "notifications" (
  "id" UUID NOT NULL,
  "personId" UUID NOT NULL,
  "notificationType" "NotificationType" NOT NULL,
  "title" TEXT NOT NULL,
  "body" TEXT NOT NULL,
  "deliveryStatus" "NotificationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "readAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "notification_deliveries" (
  "id" UUID NOT NULL,
  "notificationId" UUID NOT NULL,
  "channel" "NotificationChannel" NOT NULL,
  "status" "NotificationDeliveryStatus" NOT NULL DEFAULT 'PENDING',
  "attemptedAt" TIMESTAMPTZ(6),
  "deliveredAt" TIMESTAMPTZ(6),
  "errorMessage" TEXT,
  "actorPersonId" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "job_records" (
  "id" UUID NOT NULL,
  "jobType" TEXT NOT NULL,
  "queueName" TEXT NOT NULL,
  "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
  "payloadJson" JSONB NOT NULL,
  "attemptCount" INTEGER NOT NULL DEFAULT 0,
  "scheduledFor" TIMESTAMPTZ(6),
  "startedAt" TIMESTAMPTZ(6),
  "finishedAt" TIMESTAMPTZ(6),
  "errorMessage" TEXT,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "job_records_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "system_settings" (
  "id" UUID NOT NULL,
  "key" TEXT NOT NULL,
  "valueJson" JSONB NOT NULL,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_primaryEmail_key" ON "persons"("primaryEmail");
CREATE UNIQUE INDEX "user_accounts_personId_key" ON "user_accounts"("personId");
CREATE UNIQUE INDEX "user_accounts_username_key" ON "user_accounts"("username");
CREATE UNIQUE INDEX "external_identities_provider_providerSubject_key" ON "external_identities"("provider", "providerSubject");
CREATE INDEX "external_identities_userAccountId_idx" ON "external_identities"("userAccountId");
CREATE INDEX "external_identities_personId_idx" ON "external_identities"("personId");

CREATE INDEX "session_records_userAccountId_idx" ON "session_records"("userAccountId");
CREATE INDEX "session_records_personId_idx" ON "session_records"("personId");
CREATE INDEX "session_records_expiresAt_idx" ON "session_records"("expiresAt");

CREATE INDEX "membership_applications_applicantPersonId_idx" ON "membership_applications"("applicantPersonId");
CREATE INDEX "membership_applications_status_idx" ON "membership_applications"("status");
CREATE INDEX "membership_applications_submittedAt_idx" ON "membership_applications"("submittedAt");

CREATE INDEX "membership_application_reviews_applicationId_idx" ON "membership_application_reviews"("applicationId");
CREATE INDEX "membership_application_reviews_reviewerPersonId_idx" ON "membership_application_reviews"("reviewerPersonId");
CREATE INDEX "membership_application_reviews_createdAt_idx" ON "membership_application_reviews"("createdAt");

CREATE UNIQUE INDEX "membership_classes_code_key" ON "membership_classes"("code");

CREATE UNIQUE INDEX "members_personId_key" ON "members"("personId");
CREATE UNIQUE INDEX "members_memberNumber_key" ON "members"("memberNumber");
CREATE INDEX "members_membershipClassId_idx" ON "members"("membershipClassId");
CREATE INDEX "members_status_idx" ON "members"("status");

CREATE INDEX "membership_status_history_memberId_idx" ON "membership_status_history"("memberId");
CREATE INDEX "membership_status_history_effectiveAt_idx" ON "membership_status_history"("effectiveAt");
CREATE INDEX "membership_status_history_recordedByPersonId_idx" ON "membership_status_history"("recordedByPersonId");

CREATE UNIQUE INDEX "governance_bodies_code_key" ON "governance_bodies"("code");
CREATE INDEX "governance_bodies_bodyType_idx" ON "governance_bodies"("bodyType");
CREATE INDEX "governance_bodies_isActive_idx" ON "governance_bodies"("isActive");

CREATE INDEX "governance_body_memberships_governanceBodyId_idx" ON "governance_body_memberships"("governanceBodyId");
CREATE INDEX "governance_body_memberships_personId_idx" ON "governance_body_memberships"("personId");
CREATE INDEX "governance_body_memberships_startedAt_endedAt_idx" ON "governance_body_memberships"("startedAt", "endedAt");

CREATE UNIQUE INDEX "offices_code_key" ON "offices"("code");
CREATE INDEX "offices_governanceBodyId_idx" ON "offices"("governanceBodyId");
CREATE INDEX "offices_isActive_idx" ON "offices"("isActive");

CREATE INDEX "office_terms_officeId_idx" ON "office_terms"("officeId");
CREATE INDEX "office_terms_termStart_termEnd_idx" ON "office_terms"("termStart", "termEnd");
CREATE INDEX "office_terms_status_idx" ON "office_terms"("status");

CREATE INDEX "office_holders_officeId_idx" ON "office_holders"("officeId");
CREATE INDEX "office_holders_officeTermId_idx" ON "office_holders"("officeTermId");
CREATE INDEX "office_holders_personId_idx" ON "office_holders"("personId");
CREATE INDEX "office_holders_startedAt_endedAt_idx" ON "office_holders"("startedAt", "endedAt");

CREATE UNIQUE INDEX "roles_code_key" ON "roles"("code");

CREATE INDEX "role_assignments_roleId_idx" ON "role_assignments"("roleId");
CREATE INDEX "role_assignments_personId_idx" ON "role_assignments"("personId");
CREATE INDEX "role_assignments_scopeType_scopeId_idx" ON "role_assignments"("scopeType", "scopeId");
CREATE INDEX "role_assignments_expiresAt_revokedAt_idx" ON "role_assignments"("expiresAt", "revokedAt");

CREATE UNIQUE INDEX "authority_grants_code_key" ON "authority_grants"("code");

CREATE UNIQUE INDEX "role_authority_grants_roleId_authorityGrantId_key" ON "role_authority_grants"("roleId", "authorityGrantId");
CREATE INDEX "role_authority_grants_authorityGrantId_idx" ON "role_authority_grants"("authorityGrantId");

CREATE UNIQUE INDEX "office_authority_grants_officeId_authorityGrantId_key" ON "office_authority_grants"("officeId", "authorityGrantId");
CREATE INDEX "office_authority_grants_authorityGrantId_idx" ON "office_authority_grants"("authorityGrantId");

CREATE INDEX "delegations_delegatorPersonId_idx" ON "delegations"("delegatorPersonId");
CREATE INDEX "delegations_delegatePersonId_idx" ON "delegations"("delegatePersonId");
CREATE INDEX "delegations_scopeType_scopeId_idx" ON "delegations"("scopeType", "scopeId");
CREATE INDEX "delegations_effectiveAt_expiresAt_revokedAt_idx" ON "delegations"("effectiveAt", "expiresAt", "revokedAt");

CREATE UNIQUE INDEX "delegation_authority_grants_delegationId_authorityGrantId_key" ON "delegation_authority_grants"("delegationId", "authorityGrantId");
CREATE INDEX "delegation_authority_grants_authorityGrantId_idx" ON "delegation_authority_grants"("authorityGrantId");

CREATE UNIQUE INDEX "proposals_proposalNumber_key" ON "proposals"("proposalNumber");
CREATE INDEX "proposals_proposalType_idx" ON "proposals"("proposalType");
CREATE INDEX "proposals_currentStage_idx" ON "proposals"("currentStage");
CREATE INDEX "proposals_proposerPersonId_idx" ON "proposals"("proposerPersonId");
CREATE INDEX "proposals_proposerMemberId_idx" ON "proposals"("proposerMemberId");
CREATE INDEX "proposals_submittedAt_idx" ON "proposals"("submittedAt");
CREATE INDEX "proposals_currentVersionId_idx" ON "proposals"("currentVersionId");

CREATE UNIQUE INDEX "proposal_versions_proposalId_versionNumber_key" ON "proposal_versions"("proposalId", "versionNumber");
CREATE INDEX "proposal_versions_proposalId_idx" ON "proposal_versions"("proposalId");
CREATE INDEX "proposal_versions_createdByPersonId_idx" ON "proposal_versions"("createdByPersonId");

CREATE INDEX "proposal_stage_history_proposalId_idx" ON "proposal_stage_history"("proposalId");
CREATE INDEX "proposal_stage_history_effectiveAt_idx" ON "proposal_stage_history"("effectiveAt");
CREATE INDEX "proposal_stage_history_triggeredByPersonId_idx" ON "proposal_stage_history"("triggeredByPersonId");

CREATE INDEX "amendments_proposalId_idx" ON "amendments"("proposalId");
CREATE INDEX "amendments_status_idx" ON "amendments"("status");
CREATE INDEX "amendments_submittedAt_idx" ON "amendments"("submittedAt");

CREATE INDEX "committee_assignments_proposalId_idx" ON "committee_assignments"("proposalId");
CREATE INDEX "committee_assignments_governanceBodyId_idx" ON "committee_assignments"("governanceBodyId");
CREATE INDEX "committee_assignments_status_idx" ON "committee_assignments"("status");

CREATE INDEX "ballots_proposalId_idx" ON "ballots"("proposalId");
CREATE INDEX "ballots_state_idx" ON "ballots"("state");
CREATE INDEX "ballots_openedAt_closedAt_idx" ON "ballots"("openedAt", "closedAt");
CREATE INDEX "ballots_scheduledOpenAt_scheduledCloseAt_idx" ON "ballots"("scheduledOpenAt", "scheduledCloseAt");

CREATE UNIQUE INDEX "ballot_eligibility_snapshots_ballotId_memberId_key" ON "ballot_eligibility_snapshots"("ballotId", "memberId");
CREATE INDEX "ballot_eligibility_snapshots_memberId_idx" ON "ballot_eligibility_snapshots"("memberId");
CREATE INDEX "ballot_eligibility_snapshots_eligibilityStatus_idx" ON "ballot_eligibility_snapshots"("eligibilityStatus");

CREATE UNIQUE INDEX "votes_ballotId_memberId_key" ON "votes"("ballotId", "memberId");
CREATE INDEX "votes_memberId_idx" ON "votes"("memberId");
CREATE INDEX "votes_castAt_idx" ON "votes"("castAt");

CREATE INDEX "vote_tallies_ballotId_idx" ON "vote_tallies"("ballotId");
CREATE INDEX "vote_tallies_computedAt_idx" ON "vote_tallies"("computedAt");

CREATE INDEX "ballot_state_history_ballotId_idx" ON "ballot_state_history"("ballotId");
CREATE INDEX "ballot_state_history_effectiveAt_idx" ON "ballot_state_history"("effectiveAt");

CREATE UNIQUE INDEX "governance_rules_code_key" ON "governance_rules"("code");
CREATE INDEX "governance_rules_ruleType_idx" ON "governance_rules"("ruleType");

CREATE UNIQUE INDEX "rule_versions_governanceRuleId_versionLabel_key" ON "rule_versions"("governanceRuleId", "versionLabel");
CREATE INDEX "rule_versions_effectiveFrom_effectiveTo_idx" ON "rule_versions"("effectiveFrom", "effectiveTo");
CREATE INDEX "rule_versions_status_idx" ON "rule_versions"("status");

CREATE UNIQUE INDEX "rule_parameters_ruleVersionId_key_key" ON "rule_parameters"("ruleVersionId", "key");
CREATE INDEX "rule_parameters_key_idx" ON "rule_parameters"("key");

CREATE INDEX "rule_scopes_ruleVersionId_idx" ON "rule_scopes"("ruleVersionId");
CREATE INDEX "rule_scopes_scopeType_scopeId_idx" ON "rule_scopes"("scopeType", "scopeId");

CREATE INDEX "certification_records_ballotId_idx" ON "certification_records"("ballotId");
CREATE INDEX "certification_records_status_idx" ON "certification_records"("status");
CREATE INDEX "certification_records_certifiedByPersonId_idx" ON "certification_records"("certifiedByPersonId");
CREATE INDEX "certification_records_certifiedAt_idx" ON "certification_records"("certifiedAt");

CREATE INDEX "certification_review_notes_certificationRecordId_idx" ON "certification_review_notes"("certificationRecordId");
CREATE INDEX "certification_review_notes_reviewedByPersonId_idx" ON "certification_review_notes"("reviewedByPersonId");

CREATE INDEX "ratification_records_proposalId_idx" ON "ratification_records"("proposalId");
CREATE INDEX "ratification_records_certificationRecordId_idx" ON "ratification_records"("certificationRecordId");
CREATE INDEX "ratification_records_status_idx" ON "ratification_records"("status");

CREATE INDEX "official_records_recordType_status_idx" ON "official_records"("recordType", "status");
CREATE INDEX "official_records_sourceEntityType_sourceEntityId_idx" ON "official_records"("sourceEntityType", "sourceEntityId");
CREATE INDEX "official_records_officializedAt_idx" ON "official_records"("officializedAt");

CREATE UNIQUE INDEX "record_versions_officialRecordId_versionNumber_key" ON "record_versions"("officialRecordId", "versionNumber");
CREATE INDEX "record_versions_createdByPersonId_idx" ON "record_versions"("createdByPersonId");

CREATE INDEX "record_artifacts_officialRecordId_idx" ON "record_artifacts"("officialRecordId");
CREATE INDEX "record_artifacts_artifactType_idx" ON "record_artifacts"("artifactType");

CREATE UNIQUE INDEX "record_supersessions_priorRecordId_supersedingRecordId_key" ON "record_supersessions"("priorRecordId", "supersedingRecordId");
CREATE INDEX "record_supersessions_priorRecordId_idx" ON "record_supersessions"("priorRecordId");
CREATE INDEX "record_supersessions_supersedingRecordId_idx" ON "record_supersessions"("supersedingRecordId");

CREATE UNIQUE INDEX "gazette_issues_issueNumber_key" ON "gazette_issues"("issueNumber");
CREATE INDEX "gazette_issues_publicationState_idx" ON "gazette_issues"("publicationState");
CREATE INDEX "gazette_issues_scheduledFor_idx" ON "gazette_issues"("scheduledFor");
CREATE INDEX "gazette_issues_publishedAt_idx" ON "gazette_issues"("publishedAt");

CREATE UNIQUE INDEX "gazette_entries_gazetteIssueId_publicationOrder_key" ON "gazette_entries"("gazetteIssueId", "publicationOrder");
CREATE INDEX "gazette_entries_officialRecordId_idx" ON "gazette_entries"("officialRecordId");
CREATE INDEX "gazette_entries_publishedAt_idx" ON "gazette_entries"("publishedAt");

CREATE UNIQUE INDEX "public_register_entries_publicUrlSlug_key" ON "public_register_entries"("publicUrlSlug");
CREATE INDEX "public_register_entries_registerType_idx" ON "public_register_entries"("registerType");
CREATE INDEX "public_register_entries_sourceEntityType_sourceEntityId_idx" ON "public_register_entries"("sourceEntityType", "sourceEntityId");
CREATE INDEX "public_register_entries_publicationState_publishedAt_idx" ON "public_register_entries"("publicationState", "publishedAt");

CREATE INDEX "event_log_eventType_occurredAt_idx" ON "event_log"("eventType", "occurredAt");
CREATE INDEX "event_log_eventCategory_idx" ON "event_log"("eventCategory");
CREATE INDEX "event_log_entityType_entityId_idx" ON "event_log"("entityType", "entityId");
CREATE INDEX "event_log_actorPersonId_idx" ON "event_log"("actorPersonId");
CREATE INDEX "event_log_correlationId_idx" ON "event_log"("correlationId");

CREATE INDEX "audit_events_actionType_occurredAt_idx" ON "audit_events"("actionType", "occurredAt");
CREATE INDEX "audit_events_entityType_entityId_idx" ON "audit_events"("entityType", "entityId");
CREATE INDEX "audit_events_actorPersonId_idx" ON "audit_events"("actorPersonId");

CREATE INDEX "security_events_eventType_occurredAt_idx" ON "security_events"("eventType", "occurredAt");
CREATE INDEX "security_events_personId_idx" ON "security_events"("personId");
CREATE INDEX "security_events_userAccountId_idx" ON "security_events"("userAccountId");

CREATE INDEX "projection_proposal_list_currentStage_idx" ON "projection_proposal_list"("currentStage");
CREATE INDEX "projection_proposal_list_submittedAt_idx" ON "projection_proposal_list"("submittedAt");

CREATE INDEX "projection_proposal_detail_currentStage_idx" ON "projection_proposal_detail"("currentStage");

CREATE INDEX "projection_ballot_dashboard_state_idx" ON "projection_ballot_dashboard"("state");
CREATE INDEX "projection_ballot_dashboard_openedAt_closedAt_idx" ON "projection_ballot_dashboard"("openedAt", "closedAt");

CREATE INDEX "projection_membership_directory_membershipStatus_idx" ON "projection_membership_directory"("membershipStatus");

CREATE INDEX "projection_officeholder_registry_termStart_termEnd_idx" ON "projection_officeholder_registry"("termStart", "termEnd");

CREATE INDEX "projection_gazette_archive_publishedAt_idx" ON "projection_gazette_archive"("publishedAt");

CREATE INDEX "notifications_personId_idx" ON "notifications"("personId");
CREATE INDEX "notifications_deliveryStatus_idx" ON "notifications"("deliveryStatus");
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

CREATE INDEX "notification_deliveries_notificationId_idx" ON "notification_deliveries"("notificationId");
CREATE INDEX "notification_deliveries_status_idx" ON "notification_deliveries"("status");
CREATE INDEX "notification_deliveries_actorPersonId_idx" ON "notification_deliveries"("actorPersonId");

CREATE INDEX "job_records_queueName_status_idx" ON "job_records"("queueName", "status");
CREATE INDEX "job_records_scheduledFor_idx" ON "job_records"("scheduledFor");
CREATE INDEX "job_records_startedAt_finishedAt_idx" ON "job_records"("startedAt", "finishedAt");

CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "user_accounts"
ADD CONSTRAINT "user_accounts_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "external_identities"
ADD CONSTRAINT "external_identities_userAccountId_fkey"
FOREIGN KEY ("userAccountId") REFERENCES "user_accounts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "external_identities"
ADD CONSTRAINT "external_identities_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "session_records"
ADD CONSTRAINT "session_records_userAccountId_fkey"
FOREIGN KEY ("userAccountId") REFERENCES "user_accounts"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "session_records"
ADD CONSTRAINT "session_records_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "membership_applications"
ADD CONSTRAINT "membership_applications_applicantPersonId_fkey"
FOREIGN KEY ("applicantPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "membership_application_reviews"
ADD CONSTRAINT "membership_application_reviews_applicationId_fkey"
FOREIGN KEY ("applicationId") REFERENCES "membership_applications"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "membership_application_reviews"
ADD CONSTRAINT "membership_application_reviews_reviewerPersonId_fkey"
FOREIGN KEY ("reviewerPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "members"
ADD CONSTRAINT "members_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "members"
ADD CONSTRAINT "members_membershipClassId_fkey"
FOREIGN KEY ("membershipClassId") REFERENCES "membership_classes"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "membership_status_history"
ADD CONSTRAINT "membership_status_history_memberId_fkey"
FOREIGN KEY ("memberId") REFERENCES "members"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "membership_status_history"
ADD CONSTRAINT "membership_status_history_recordedByPersonId_fkey"
FOREIGN KEY ("recordedByPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "governance_body_memberships"
ADD CONSTRAINT "governance_body_memberships_governanceBodyId_fkey"
FOREIGN KEY ("governanceBodyId") REFERENCES "governance_bodies"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "governance_body_memberships"
ADD CONSTRAINT "governance_body_memberships_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "offices"
ADD CONSTRAINT "offices_governanceBodyId_fkey"
FOREIGN KEY ("governanceBodyId") REFERENCES "governance_bodies"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "office_terms"
ADD CONSTRAINT "office_terms_officeId_fkey"
FOREIGN KEY ("officeId") REFERENCES "offices"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "office_holders"
ADD CONSTRAINT "office_holders_officeId_fkey"
FOREIGN KEY ("officeId") REFERENCES "offices"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "office_holders"
ADD CONSTRAINT "office_holders_officeTermId_fkey"
FOREIGN KEY ("officeTermId") REFERENCES "office_terms"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "office_holders"
ADD CONSTRAINT "office_holders_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "role_assignments"
ADD CONSTRAINT "role_assignments_roleId_fkey"
FOREIGN KEY ("roleId") REFERENCES "roles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_assignments"
ADD CONSTRAINT "role_assignments_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_authority_grants"
ADD CONSTRAINT "role_authority_grants_roleId_fkey"
FOREIGN KEY ("roleId") REFERENCES "roles"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "role_authority_grants"
ADD CONSTRAINT "role_authority_grants_authorityGrantId_fkey"
FOREIGN KEY ("authorityGrantId") REFERENCES "authority_grants"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "office_authority_grants"
ADD CONSTRAINT "office_authority_grants_officeId_fkey"
FOREIGN KEY ("officeId") REFERENCES "offices"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "office_authority_grants"
ADD CONSTRAINT "office_authority_grants_authorityGrantId_fkey"
FOREIGN KEY ("authorityGrantId") REFERENCES "authority_grants"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "delegations"
ADD CONSTRAINT "delegations_delegatorPersonId_fkey"
FOREIGN KEY ("delegatorPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "delegations"
ADD CONSTRAINT "delegations_delegatePersonId_fkey"
FOREIGN KEY ("delegatePersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "delegation_authority_grants"
ADD CONSTRAINT "delegation_authority_grants_delegationId_fkey"
FOREIGN KEY ("delegationId") REFERENCES "delegations"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "delegation_authority_grants"
ADD CONSTRAINT "delegation_authority_grants_authorityGrantId_fkey"
FOREIGN KEY ("authorityGrantId") REFERENCES "authority_grants"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_proposerPersonId_fkey"
FOREIGN KEY ("proposerPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_proposerMemberId_fkey"
FOREIGN KEY ("proposerMemberId") REFERENCES "members"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "proposal_versions"
ADD CONSTRAINT "proposal_versions_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "proposal_versions"
ADD CONSTRAINT "proposal_versions_createdByPersonId_fkey"
FOREIGN KEY ("createdByPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "proposal_stage_history"
ADD CONSTRAINT "proposal_stage_history_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "proposal_stage_history"
ADD CONSTRAINT "proposal_stage_history_triggeredByPersonId_fkey"
FOREIGN KEY ("triggeredByPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "amendments"
ADD CONSTRAINT "amendments_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "amendments"
ADD CONSTRAINT "amendments_proposedByPersonId_fkey"
FOREIGN KEY ("proposedByPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "amendments"
ADD CONSTRAINT "amendments_proposedByMemberId_fkey"
FOREIGN KEY ("proposedByMemberId") REFERENCES "members"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "committee_assignments"
ADD CONSTRAINT "committee_assignments_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "committee_assignments"
ADD CONSTRAINT "committee_assignments_governanceBodyId_fkey"
FOREIGN KEY ("governanceBodyId") REFERENCES "governance_bodies"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "committee_assignments"
ADD CONSTRAINT "committee_assignments_assignedByPersonId_fkey"
FOREIGN KEY ("assignedByPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ballots"
ADD CONSTRAINT "ballots_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ballots"
ADD CONSTRAINT "ballots_createdByPersonId_fkey"
FOREIGN KEY ("createdByPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ballot_eligibility_snapshots"
ADD CONSTRAINT "ballot_eligibility_snapshots_ballotId_fkey"
FOREIGN KEY ("ballotId") REFERENCES "ballots"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ballot_eligibility_snapshots"
ADD CONSTRAINT "ballot_eligibility_snapshots_memberId_fkey"
FOREIGN KEY ("memberId") REFERENCES "members"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "votes"
ADD CONSTRAINT "votes_ballotId_fkey"
FOREIGN KEY ("ballotId") REFERENCES "ballots"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "votes"
ADD CONSTRAINT "votes_memberId_fkey"
FOREIGN KEY ("memberId") REFERENCES "members"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "votes"
ADD CONSTRAINT "votes_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "vote_tallies"
ADD CONSTRAINT "vote_tallies_ballotId_fkey"
FOREIGN KEY ("ballotId") REFERENCES "ballots"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ballot_state_history"
ADD CONSTRAINT "ballot_state_history_ballotId_fkey"
FOREIGN KEY ("ballotId") REFERENCES "ballots"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ballot_state_history"
ADD CONSTRAINT "ballot_state_history_triggeredByPersonId_fkey"
FOREIGN KEY ("triggeredByPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "rule_versions"
ADD CONSTRAINT "rule_versions_governanceRuleId_fkey"
FOREIGN KEY ("governanceRuleId") REFERENCES "governance_rules"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rule_parameters"
ADD CONSTRAINT "rule_parameters_ruleVersionId_fkey"
FOREIGN KEY ("ruleVersionId") REFERENCES "rule_versions"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "rule_scopes"
ADD CONSTRAINT "rule_scopes_ruleVersionId_fkey"
FOREIGN KEY ("ruleVersionId") REFERENCES "rule_versions"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "certification_records"
ADD CONSTRAINT "certification_records_ballotId_fkey"
FOREIGN KEY ("ballotId") REFERENCES "ballots"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "certification_records"
ADD CONSTRAINT "certification_records_certifiedByPersonId_fkey"
FOREIGN KEY ("certifiedByPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "certification_records"
ADD CONSTRAINT "certification_records_quorumRuleVersionId_fkey"
FOREIGN KEY ("quorumRuleVersionId") REFERENCES "rule_versions"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "certification_records"
ADD CONSTRAINT "certification_records_thresholdRuleVersionId_fkey"
FOREIGN KEY ("thresholdRuleVersionId") REFERENCES "rule_versions"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "certification_records"
ADD CONSTRAINT "certification_records_certificationRuleVersionId_fkey"
FOREIGN KEY ("certificationRuleVersionId") REFERENCES "rule_versions"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "certification_review_notes"
ADD CONSTRAINT "certification_review_notes_certificationRecordId_fkey"
FOREIGN KEY ("certificationRecordId") REFERENCES "certification_records"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "certification_review_notes"
ADD CONSTRAINT "certification_review_notes_reviewedByPersonId_fkey"
FOREIGN KEY ("reviewedByPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ratification_records"
ADD CONSTRAINT "ratification_records_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "ratification_records"
ADD CONSTRAINT "ratification_records_certificationRecordId_fkey"
FOREIGN KEY ("certificationRecordId") REFERENCES "certification_records"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ratification_records"
ADD CONSTRAINT "ratification_records_ratifiedByPersonId_fkey"
FOREIGN KEY ("ratifiedByPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "record_versions"
ADD CONSTRAINT "record_versions_officialRecordId_fkey"
FOREIGN KEY ("officialRecordId") REFERENCES "official_records"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "record_versions"
ADD CONSTRAINT "record_versions_createdByPersonId_fkey"
FOREIGN KEY ("createdByPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "record_artifacts"
ADD CONSTRAINT "record_artifacts_officialRecordId_fkey"
FOREIGN KEY ("officialRecordId") REFERENCES "official_records"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "record_supersessions"
ADD CONSTRAINT "record_supersessions_priorRecordId_fkey"
FOREIGN KEY ("priorRecordId") REFERENCES "official_records"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "record_supersessions"
ADD CONSTRAINT "record_supersessions_supersedingRecordId_fkey"
FOREIGN KEY ("supersedingRecordId") REFERENCES "official_records"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "gazette_issues"
ADD CONSTRAINT "gazette_issues_createdByPersonId_fkey"
FOREIGN KEY ("createdByPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "gazette_entries"
ADD CONSTRAINT "gazette_entries_gazetteIssueId_fkey"
FOREIGN KEY ("gazetteIssueId") REFERENCES "gazette_issues"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "gazette_entries"
ADD CONSTRAINT "gazette_entries_officialRecordId_fkey"
FOREIGN KEY ("officialRecordId") REFERENCES "official_records"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "event_log"
ADD CONSTRAINT "event_log_actorPersonId_fkey"
FOREIGN KEY ("actorPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "audit_events"
ADD CONSTRAINT "audit_events_actorPersonId_fkey"
FOREIGN KEY ("actorPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "security_events"
ADD CONSTRAINT "security_events_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "security_events"
ADD CONSTRAINT "security_events_userAccountId_fkey"
FOREIGN KEY ("userAccountId") REFERENCES "user_accounts"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "notifications"
ADD CONSTRAINT "notifications_personId_fkey"
FOREIGN KEY ("personId") REFERENCES "persons"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification_deliveries"
ADD CONSTRAINT "notification_deliveries_notificationId_fkey"
FOREIGN KEY ("notificationId") REFERENCES "notifications"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "notification_deliveries"
ADD CONSTRAINT "notification_deliveries_actorPersonId_fkey"
FOREIGN KEY ("actorPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Add the circular proposal.currentVersionId FK LAST
ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_currentVersionId_fkey"
FOREIGN KEY ("currentVersionId") REFERENCES "proposal_versions"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
