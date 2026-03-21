first-pass-canonical-open-api-specification.md

Below is a **first-pass canonical OpenAPI specification** for `apps/gov-api`.

It is designed to align with the architecture, domain model, authority model, state machines, and Prisma schema we just established.

It assumes:

* `apps/gov-api` is the authoritative governance backend
* REST + JSON
* bearer auth via OIDC/Keycloak-issued JWTs
* command-style mutation endpoints
* resource-oriented reads
* explicit lifecycle actions for governance transitions

This is intentionally written as a strong **v1 baseline** that your engineers can refine into the actual production contract.

```yaml
openapi: 3.1.0
info:
  title: Ardtire Society Governance API
  version: 1.0.0
  summary: Authoritative API for governance, membership, voting, certification, records, and publication.
  description: |
    The Governance API is the canonical backend for Ardtire Society's digital governance platform.

    It is responsible for:
    - authoritative domain mutations
    - authority-aware lifecycle transitions
    - governance workflow execution
    - certification and publication actions
    - durable institutional record creation
    - projection-friendly read endpoints

servers:
  - url: https://gov-api.ardtiresociety.org/api/v1
    description: Production
  - url: https://staging-gov-api.ardtiresociety.org/api/v1
    description: Staging
  - url: http://localhost:3002/api/v1
    description: Local development

tags:
  - name: Identity
  - name: Membership
  - name: Governance
  - name: Roles and Authority
  - name: Proposals
  - name: Ballots
  - name: Votes
  - name: Certifications
  - name: Records
  - name: Gazette
  - name: Public Registers
  - name: Rules
  - name: Notifications
  - name: Jobs
  - name: Audit

security:
  - bearerAuth: []

paths:
  /identity/me:
    get:
      tags: [Identity]
      summary: Get current authenticated actor context
      operationId: getCurrentIdentity
      responses:
        "200":
          description: Current actor context
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CurrentIdentityResponse"
        "401":
          $ref: "#/components/responses/Unauthorized"

  /identity/roles:
    get:
      tags: [Identity]
      summary: Get effective roles, offices, and authority grants for current actor
      operationId: getCurrentAuthorities
      responses:
        "200":
          description: Effective authority context
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuthorityContextResponse"
        "401":
          $ref: "#/components/responses/Unauthorized"

  /membership/applications:
    post:
      tags: [Membership]
      summary: Submit a membership application
      operationId: submitMembershipApplication
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateMembershipApplicationRequest"
      responses:
        "201":
          description: Application submitted
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MembershipApplicationResponse"
        "400":
          $ref: "#/components/responses/BadRequest"
        "401":
          $ref: "#/components/responses/Unauthorized"
    get:
      tags: [Membership]
      summary: List membership applications
      operationId: listMembershipApplications
      parameters:
        - $ref: "#/components/parameters/Page"
        - $ref: "#/components/parameters/Limit"
        - name: status
          in: query
          schema:
            $ref: "#/components/schemas/MembershipApplicationStatus"
      responses:
        "200":
          description: Membership applications
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MembershipApplicationListResponse"

  /membership/applications/{applicationId}:
    get:
      tags: [Membership]
      summary: Get a membership application
      operationId: getMembershipApplication
      parameters:
        - $ref: "#/components/parameters/ApplicationId"
      responses:
        "200":
          description: Membership application
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MembershipApplicationResponse"
        "404":
          $ref: "#/components/responses/NotFound"

  /membership/applications/{applicationId}/review:
    post:
      tags: [Membership]
      summary: Review or decide a membership application
      operationId: reviewMembershipApplication
      parameters:
        - $ref: "#/components/parameters/ApplicationId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ReviewMembershipApplicationRequest"
      responses:
        "200":
          description: Review action recorded
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MembershipApplicationResponse"
        "403":
          $ref: "#/components/responses/Forbidden"
        "409":
          $ref: "#/components/responses/Conflict"

  /members:
    get:
      tags: [Membership]
      summary: List members
      operationId: listMembers
      parameters:
        - $ref: "#/components/parameters/Page"
        - $ref: "#/components/parameters/Limit"
        - name: status
          in: query
          schema:
            $ref: "#/components/schemas/MembershipStatus"
        - name: membershipClassId
          in: query
          schema:
            type: string
            format: uuid
      responses:
        "200":
          description: Member list
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MemberListResponse"

  /members/{memberId}:
    get:
      tags: [Membership]
      summary: Get a member
      operationId: getMember
      parameters:
        - $ref: "#/components/parameters/MemberId"
      responses:
        "200":
          description: Member
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MemberResponse"
        "404":
          $ref: "#/components/responses/NotFound"

  /members/{memberId}/status:
    post:
      tags: [Membership]
      summary: Change member standing
      operationId: changeMemberStatus
      parameters:
        - $ref: "#/components/parameters/MemberId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/ChangeMemberStatusRequest"
      responses:
        "200":
          description: Member status changed
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/MemberResponse"
        "403":
          $ref: "#/components/responses/Forbidden"
        "409":
          $ref: "#/components/responses/Conflict"

  /governance/bodies:
    get:
      tags: [Governance]
      summary: List governance bodies
      operationId: listGovernanceBodies
      responses:
        "200":
          description: Governance bodies
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GovernanceBodyListResponse"
    post:
      tags: [Governance]
      summary: Create a governance body
      operationId: createGovernanceBody
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateGovernanceBodyRequest"
      responses:
        "201":
          description: Governance body created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GovernanceBodyResponse"

  /governance/bodies/{bodyId}:
    get:
      tags: [Governance]
      summary: Get a governance body
      operationId: getGovernanceBody
      parameters:
        - $ref: "#/components/parameters/BodyId"
      responses:
        "200":
          description: Governance body
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GovernanceBodyResponse"
        "404":
          $ref: "#/components/responses/NotFound"

  /governance/offices:
    get:
      tags: [Governance]
      summary: List offices
      operationId: listOffices
      responses:
        "200":
          description: Offices
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OfficeListResponse"
    post:
      tags: [Governance]
      summary: Create an office
      operationId: createOffice
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateOfficeRequest"
      responses:
        "201":
          description: Office created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OfficeResponse"

  /governance/offices/{officeId}/assign:
    post:
      tags: [Governance]
      summary: Assign a person to an office
      operationId: assignOfficeHolder
      parameters:
        - $ref: "#/components/parameters/OfficeId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AssignOfficeHolderRequest"
      responses:
        "200":
          description: Office holder assigned
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OfficeHolderResponse"

  /roles:
    get:
      tags: [Roles and Authority]
      summary: List roles
      operationId: listRoles
      responses:
        "200":
          description: Roles
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RoleListResponse"

  /roles/assignments:
    post:
      tags: [Roles and Authority]
      summary: Assign a role
      operationId: assignRole
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AssignRoleRequest"
      responses:
        "201":
          description: Role assigned
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RoleAssignmentResponse"

  /delegations:
    post:
      tags: [Roles and Authority]
      summary: Delegate authority
      operationId: createDelegation
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateDelegationRequest"
      responses:
        "201":
          description: Delegation created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/DelegationResponse"

  /proposals:
    get:
      tags: [Proposals]
      summary: List proposals
      operationId: listProposals
      parameters:
        - $ref: "#/components/parameters/Page"
        - $ref: "#/components/parameters/Limit"
        - name: stage
          in: query
          schema:
            $ref: "#/components/schemas/ProposalStage"
        - name: proposalType
          in: query
          schema:
            $ref: "#/components/schemas/ProposalType"
      responses:
        "200":
          description: Proposal list
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalListResponse"
    post:
      tags: [Proposals]
      summary: Create a proposal draft
      operationId: createProposalDraft
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateProposalDraftRequest"
      responses:
        "201":
          description: Proposal draft created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalResponse"

  /proposals/{proposalId}:
    get:
      tags: [Proposals]
      summary: Get a proposal
      operationId: getProposal
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      responses:
        "200":
          description: Proposal
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalResponse"
        "404":
          $ref: "#/components/responses/NotFound"

  /proposals/{proposalId}/submit:
    post:
      tags: [Proposals]
      summary: Submit a draft proposal
      operationId: submitProposal
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      requestBody:
        required: false
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/SubmitProposalRequest"
      responses:
        "200":
          description: Proposal submitted
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalResponse"
        "409":
          $ref: "#/components/responses/Conflict"

  /proposals/{proposalId}/versions:
    get:
      tags: [Proposals]
      summary: List proposal versions
      operationId: listProposalVersions
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      responses:
        "200":
          description: Proposal versions
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalVersionListResponse"
    post:
      tags: [Proposals]
      summary: Create a new proposal version
      operationId: createProposalVersion
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateProposalVersionRequest"
      responses:
        "201":
          description: Proposal version created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalVersionResponse"

  /proposals/{proposalId}/current-version:
    post:
      tags: [Proposals]
      summary: Set the current proposal version
      operationId: setCurrentProposalVersion
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/SetCurrentProposalVersionRequest"
      responses:
        "200":
          description: Current version updated
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalResponse"
        "409":
          description: Version does not belong to proposal
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ErrorResponse"

  /proposals/{proposalId}/amendments:
    get:
      tags: [Proposals]
      summary: List amendments for a proposal
      operationId: listAmendments
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      responses:
        "200":
          description: Amendments
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AmendmentListResponse"
    post:
      tags: [Proposals]
      summary: Propose an amendment
      operationId: createAmendment
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateAmendmentRequest"
      responses:
        "201":
          description: Amendment created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AmendmentResponse"

  /proposals/{proposalId}/committee-assignment:
    post:
      tags: [Proposals]
      summary: Assign a proposal to a governance body
      operationId: assignProposalCommittee
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/AssignCommitteeRequest"
      responses:
        "200":
          description: Committee assigned
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CommitteeAssignmentResponse"

  /proposals/{proposalId}/transitions:
    post:
      tags: [Proposals]
      summary: Execute a proposal lifecycle transition
      operationId: transitionProposal
      parameters:
        - $ref: "#/components/parameters/ProposalId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/TransitionProposalRequest"
      responses:
        "200":
          description: Proposal transitioned
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/ProposalResponse"
        "409":
          $ref: "#/components/responses/Conflict"

  /ballots:
    get:
      tags: [Ballots]
      summary: List ballots
      operationId: listBallots
      parameters:
        - $ref: "#/components/parameters/Page"
        - $ref: "#/components/parameters/Limit"
        - name: state
          in: query
          schema:
            $ref: "#/components/schemas/BallotState"
      responses:
        "200":
          description: Ballots
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BallotListResponse"
    post:
      tags: [Ballots]
      summary: Create a ballot
      operationId: createBallot
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateBallotRequest"
      responses:
        "201":
          description: Ballot created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BallotResponse"

  /ballots/{ballotId}:
    get:
      tags: [Ballots]
      summary: Get a ballot
      operationId: getBallot
      parameters:
        - $ref: "#/components/parameters/BallotId"
      responses:
        "200":
          description: Ballot
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BallotResponse"

  /ballots/{ballotId}/open:
    post:
      tags: [Ballots]
      summary: Open a ballot
      operationId: openBallot
      parameters:
        - $ref: "#/components/parameters/BallotId"
      responses:
        "200":
          description: Ballot opened
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BallotResponse"

  /ballots/{ballotId}/close:
    post:
      tags: [Ballots]
      summary: Close a ballot
      operationId: closeBallot
      parameters:
        - $ref: "#/components/parameters/BallotId"
      responses:
        "200":
          description: Ballot closed
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BallotResponse"

  /ballots/{ballotId}/votes:
    get:
      tags: [Votes]
      summary: List votes for a ballot
      operationId: listVotes
      parameters:
        - $ref: "#/components/parameters/BallotId"
      responses:
        "200":
          description: Votes
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/VoteListResponse"
    post:
      tags: [Votes]
      summary: Cast a vote
      operationId: castVote
      parameters:
        - $ref: "#/components/parameters/BallotId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CastVoteRequest"
      responses:
        "201":
          description: Vote cast
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/VoteResponse"
        "409":
          $ref: "#/components/responses/Conflict"

  /ballots/{ballotId}/eligibility:
    get:
      tags: [Ballots]
      summary: Get ballot eligibility snapshot
      operationId: getBallotEligibilitySnapshot
      parameters:
        - $ref: "#/components/parameters/BallotId"
      responses:
        "200":
          description: Eligibility snapshot
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/BallotEligibilitySnapshotListResponse"

  /ballots/{ballotId}/tally:
    get:
      tags: [Ballots]
      summary: Get computed tally for a ballot
      operationId: getBallotTally
      parameters:
        - $ref: "#/components/parameters/BallotId"
      responses:
        "200":
          description: Vote tally
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/VoteTallyResponse"

  /certifications:
    post:
      tags: [Certifications]
      summary: Create or execute certification for a ballot
      operationId: certifyResult
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateCertificationRequest"
      responses:
        "201":
          description: Certification created or completed
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CertificationResponse"
        "409":
          $ref: "#/components/responses/Conflict"

  /certifications/{certificationId}:
    get:
      tags: [Certifications]
      summary: Get a certification record
      operationId: getCertification
      parameters:
        - $ref: "#/components/parameters/CertificationId"
      responses:
        "200":
          description: Certification
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CertificationResponse"

  /certifications/{certificationId}/reject:
    post:
      tags: [Certifications]
      summary: Reject certification
      operationId: rejectCertification
      parameters:
        - $ref: "#/components/parameters/CertificationId"
      requestBody:
        required: false
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/RejectCertificationRequest"
      responses:
        "200":
          description: Certification rejected
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/CertificationResponse"

  /ratifications:
    post:
      tags: [Certifications]
      summary: Ratify a proposal outcome
      operationId: ratifyProposal
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateRatificationRequest"
      responses:
        "201":
          description: Ratification created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RatificationResponse"

  /records:
    get:
      tags: [Records]
      summary: List official records
      operationId: listRecords
      parameters:
        - $ref: "#/components/parameters/Page"
        - $ref: "#/components/parameters/Limit"
        - name: recordType
          in: query
          schema:
            type: string
        - name: status
          in: query
          schema:
            $ref: "#/components/schemas/OfficialRecordStatus"
      responses:
        "200":
          description: Records
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OfficialRecordListResponse"
    post:
      tags: [Records]
      summary: Create an official record
      operationId: createOfficialRecord
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateOfficialRecordRequest"
      responses:
        "201":
          description: Record created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OfficialRecordResponse"

  /records/{recordId}:
    get:
      tags: [Records]
      summary: Get an official record
      operationId: getOfficialRecord
      parameters:
        - $ref: "#/components/parameters/RecordId"
      responses:
        "200":
          description: Record
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/OfficialRecordResponse"

  /records/{recordId}/versions:
    get:
      tags: [Records]
      summary: List record versions
      operationId: listRecordVersions
      parameters:
        - $ref: "#/components/parameters/RecordId"
      responses:
        "200":
          description: Record versions
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RecordVersionListResponse"

  /gazette/issues:
    get:
      tags: [Gazette]
      summary: List gazette issues
      operationId: listGazetteIssues
      responses:
        "200":
          description: Gazette issues
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GazetteIssueListResponse"
    post:
      tags: [Gazette]
      summary: Create a gazette issue
      operationId: createGazetteIssue
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateGazetteIssueRequest"
      responses:
        "201":
          description: Gazette issue created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GazetteIssueResponse"

  /gazette/issues/{issueId}:
    get:
      tags: [Gazette]
      summary: Get a gazette issue
      operationId: getGazetteIssue
      parameters:
        - $ref: "#/components/parameters/IssueId"
      responses:
        "200":
          description: Gazette issue
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GazetteIssueResponse"

  /gazette/issues/{issueId}/publish:
    post:
      tags: [Gazette]
      summary: Publish a gazette issue
      operationId: publishGazetteIssue
      parameters:
        - $ref: "#/components/parameters/IssueId"
      responses:
        "200":
          description: Gazette issue published
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GazetteIssueResponse"

  /gazette/entries:
    post:
      tags: [Gazette]
      summary: Add an entry to a gazette issue
      operationId: createGazetteEntry
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateGazetteEntryRequest"
      responses:
        "201":
          description: Gazette entry created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GazetteEntryResponse"

  /registers:
    get:
      tags: [Public Registers]
      summary: List public register entries
      operationId: listPublicRegisterEntries
      parameters:
        - name: registerType
          in: query
          schema:
            type: string
      responses:
        "200":
          description: Public register entries
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/PublicRegisterEntryListResponse"

  /rules:
    get:
      tags: [Rules]
      summary: List governance rules
      operationId: listGovernanceRules
      responses:
        "200":
          description: Governance rules
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GovernanceRuleListResponse"
    post:
      tags: [Rules]
      summary: Create a governance rule family
      operationId: createGovernanceRule
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateGovernanceRuleRequest"
      responses:
        "201":
          description: Governance rule created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/GovernanceRuleResponse"

  /rules/{ruleId}/versions:
    get:
      tags: [Rules]
      summary: List rule versions
      operationId: listRuleVersions
      parameters:
        - $ref: "#/components/parameters/RuleId"
      responses:
        "200":
          description: Rule versions
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RuleVersionListResponse"
    post:
      tags: [Rules]
      summary: Create a rule version
      operationId: createRuleVersion
      parameters:
        - $ref: "#/components/parameters/RuleId"
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: "#/components/schemas/CreateRuleVersionRequest"
      responses:
        "201":
          description: Rule version created
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/RuleVersionResponse"

  /notifications:
    get:
      tags: [Notifications]
      summary: List notifications for current actor
      operationId: listNotifications
      responses:
        "200":
          description: Notifications
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/NotificationListResponse"

  /jobs:
    get:
      tags: [Jobs]
      summary: List background jobs
      operationId: listJobs
      parameters:
        - name: status
          in: query
          schema:
            $ref: "#/components/schemas/JobStatus"
      responses:
        "200":
          description: Jobs
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/JobRecordListResponse"

  /audit/events:
    get:
      tags: [Audit]
      summary: List audit events
      operationId: listAuditEvents
      parameters:
        - $ref: "#/components/parameters/Page"
        - $ref: "#/components/parameters/Limit"
        - name: actionType
          in: query
          schema:
            $ref: "#/components/schemas/ActionType"
        - name: entityType
          in: query
          schema:
            type: string
        - name: entityId
          in: query
          schema:
            type: string
      responses:
        "200":
          description: Audit events
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/AuditEventListResponse"

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  parameters:
    Page:
      name: page
      in: query
      schema:
        type: integer
        minimum: 1
        default: 1

    Limit:
      name: limit
      in: query
      schema:
        type: integer
        minimum: 1
        maximum: 100
        default: 20

    ApplicationId:
      name: applicationId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    MemberId:
      name: memberId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    BodyId:
      name: bodyId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    OfficeId:
      name: officeId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    ProposalId:
      name: proposalId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    BallotId:
      name: ballotId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    CertificationId:
      name: certificationId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    RecordId:
      name: recordId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    IssueId:
      name: issueId
      in: path
      required: true
      schema:
        type: string
        format: uuid

    RuleId:
      name: ruleId
      in: path
      required: true
      schema:
        type: string
        format: uuid

  responses:
    BadRequest:
      description: Bad request
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"

    Unauthorized:
      description: Authentication required
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"

    Forbidden:
      description: Insufficient authority
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"

    NotFound:
      description: Resource not found
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"

    Conflict:
      description: Invalid state transition or conflicting action
      content:
        application/json:
          schema:
            $ref: "#/components/schemas/ErrorResponse"

  schemas:
    Pagination:
      type: object
      properties:
        page:
          type: integer
        limit:
          type: integer
        total:
          type: integer
        totalPages:
          type: integer
      required: [page, limit, total, totalPages]

    Error:
      type: object
      properties:
        code:
          type: string
        message:
          type: string
        details:
          type: object
          additionalProperties: true
      required: [code, message]

    ErrorResponse:
      type: object
      properties:
        error:
          $ref: "#/components/schemas/Error"
      required: [error]

    CurrentIdentityResponse:
      type: object
      properties:
        data:
          type: object
          properties:
            personId:
              type: string
              format: uuid
            userAccountId:
              type: string
              format: uuid
            displayName:
              type: string
            primaryEmail:
              type: string
              format: email
            member:
              $ref: "#/components/schemas/MemberSummary"
          required: [personId, displayName]
      required: [data]

    AuthorityContextResponse:
      type: object
      properties:
        data:
          type: object
          properties:
            roles:
              type: array
              items:
                $ref: "#/components/schemas/Role"
            offices:
              type: array
              items:
                $ref: "#/components/schemas/OfficeHolder"
            authorityGrants:
              type: array
              items:
                type: string
          required: [roles, offices, authorityGrants]
      required: [data]

    MembershipApplicationStatus:
      type: string
      enum:
        - DRAFT
        - SUBMITTED
        - UNDER_REVIEW
        - INFORMATION_REQUESTED
        - RESUBMITTED
        - APPROVED
        - REJECTED
        - WITHDRAWN

    MembershipStatus:
      type: string
      enum:
        - PENDING
        - ACTIVE
        - RESTRICTED
        - SUSPENDED
        - REVOKED
        - FORMER

    ProposalType:
      type: string
      enum:
        - GENERAL
        - RESOLUTION
        - ACT
        - AMENDMENT
        - APPOINTMENT
        - RULE_CHANGE
        - BUDGET
        - OTHER

    ProposalStage:
      type: string
      enum:
        - DRAFT
        - SUBMITTED
        - ELIGIBILITY_REVIEW
        - COMMITTEE_ASSIGNED
        - IN_COMMITTEE
        - READY_FOR_READING
        - FIRST_READING
        - AMENDMENT_WINDOW
        - SECOND_READING
        - FINAL_VOTE_SCHEDULED
        - VOTING_OPEN
        - VOTING_CLOSED
        - RESULT_PENDING_CERTIFICATION
        - CERTIFIED
        - RATIFIED
        - PUBLISHED
        - ARCHIVED
        - WITHDRAWN
        - REJECTED

    AmendmentStatus:
      type: string
      enum:
        - PROPOSED
        - UNDER_REVIEW
        - ACCEPTED
        - REJECTED
        - WITHDRAWN

    BallotState:
      type: string
      enum:
        - DRAFT
        - SCHEDULED
        - OPEN
        - CLOSED
        - TALLYING
        - RESULT_COMPUTED
        - EXPIRED
        - CANCELLED

    VoteChoice:
      type: string
      enum:
        - YES
        - NO
        - ABSTAIN

    CertificationStatus:
      type: string
      enum:
        - PENDING
        - UNDER_REVIEW
        - CERTIFIED
        - REJECTED

    RatificationStatus:
      type: string
      enum:
        - PENDING
        - RATIFIED
        - REJECTED

    OfficialRecordStatus:
      type: string
      enum:
        - DRAFT
        - OFFICIAL
        - PUBLISHED
        - SUPERSEDED
        - ARCHIVED

    PublicationState:
      type: string
      enum:
        - DRAFT
        - READY_FOR_PUBLICATION
        - SCHEDULED
        - PUBLISHED
        - SUPERSEDED
        - RETRACTED
        - ARCHIVED

    JobStatus:
      type: string
      enum:
        - PENDING
        - QUEUED
        - RUNNING
        - SUCCEEDED
        - FAILED
        - CANCELLED
        - DEAD_LETTER

    ActionType:
      type: string
      enum:
        - CREATE
        - UPDATE
        - DELETE
        - SUBMIT
        - REVIEW
        - APPROVE
        - REJECT
        - REQUEST_INFORMATION
        - RESUBMIT
        - ASSIGN
        - OPEN
        - CLOSE
        - CAST
        - COMPUTE
        - CERTIFY
        - RATIFY
        - PUBLISH
        - ARCHIVE
        - REVOKE
        - DELEGATE
        - LOGIN
        - LOGOUT
        - OTHER

    MemberSummary:
      type: object
      properties:
        memberId:
          type: string
          format: uuid
        memberNumber:
          type: string
        membershipStatus:
          $ref: "#/components/schemas/MembershipStatus"
      required: [memberId, membershipStatus]

    MembershipApplication:
      type: object
      properties:
        id:
          type: string
          format: uuid
        applicantPersonId:
          type: string
          format: uuid
        status:
          $ref: "#/components/schemas/MembershipApplicationStatus"
        supportingStatement:
          type: string
        submittedAt:
          type: string
          format: date-time
        decidedAt:
          type: string
          format: date-time
        decisionSummary:
          type: string
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
      required:
        [id, applicantPersonId, status, createdAt, updatedAt]

    MembershipApplicationResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/MembershipApplication"
      required: [data]

    MembershipApplicationListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/MembershipApplication"
        pagination:
          $ref: "#/components/schemas/Pagination"
      required: [data, pagination]

    CreateMembershipApplicationRequest:
      type: object
      properties:
        supportingStatement:
          type: string
      required: [supportingStatement]

    ReviewMembershipApplicationRequest:
      type: object
      properties:
        action:
          type: string
          enum: [START_REVIEW, REQUEST_INFORMATION, APPROVE, REJECT]
        notes:
          type: string
      required: [action]

    Member:
      type: object
      properties:
        id:
          type: string
          format: uuid
        personId:
          type: string
          format: uuid
        memberNumber:
          type: string
        membershipClassId:
          type: string
          format: uuid
        status:
          $ref: "#/components/schemas/MembershipStatus"
        admittedAt:
          type: string
          format: date-time
        endedAt:
          type: string
          format: date-time
      required: [id, personId, membershipClassId, status]

    MemberResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Member"
      required: [data]

    MemberListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Member"
        pagination:
          $ref: "#/components/schemas/Pagination"
      required: [data, pagination]

    ChangeMemberStatusRequest:
      type: object
      properties:
        toStatus:
          $ref: "#/components/schemas/MembershipStatus"
        reason:
          type: string
      required: [toStatus]

    GovernanceBody:
      type: object
      properties:
        id:
          type: string
          format: uuid
        code:
          type: string
        name:
          type: string
        description:
          type: string
        bodyType:
          type: string
        isActive:
          type: boolean
      required: [id, code, name, bodyType, isActive]

    GovernanceBodyResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/GovernanceBody"
      required: [data]

    GovernanceBodyListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/GovernanceBody"
      required: [data]

    CreateGovernanceBodyRequest:
      type: object
      properties:
        code:
          type: string
        name:
          type: string
        description:
          type: string
        bodyType:
          type: string
      required: [code, name, bodyType]

    Office:
      type: object
      properties:
        id:
          type: string
          format: uuid
        code:
          type: string
        name:
          type: string
        description:
          type: string
        governanceBodyId:
          type: string
          format: uuid
        isActive:
          type: boolean
      required: [id, code, name, isActive]

    OfficeResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Office"
      required: [data]

    OfficeListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Office"
      required: [data]

    CreateOfficeRequest:
      type: object
      properties:
        code:
          type: string
        name:
          type: string
        description:
          type: string
        governanceBodyId:
          type: string
          format: uuid
      required: [code, name]

    OfficeHolder:
      type: object
      properties:
        id:
          type: string
          format: uuid
        officeId:
          type: string
          format: uuid
        personId:
          type: string
          format: uuid
        startedAt:
          type: string
          format: date-time
        endedAt:
          type: string
          format: date-time
      required: [id, officeId, personId, startedAt]

    OfficeHolderResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/OfficeHolder"
      required: [data]

    AssignOfficeHolderRequest:
      type: object
      properties:
        personId:
          type: string
          format: uuid
        appointedAt:
          type: string
          format: date-time
        startedAt:
          type: string
          format: date-time
      required: [personId, startedAt]

    Role:
      type: object
      properties:
        id:
          type: string
          format: uuid
        code:
          type: string
        name:
          type: string
        description:
          type: string
      required: [id, code, name]

    RoleListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Role"
      required: [data]

    RoleAssignmentResponse:
      type: object
      properties:
        data:
          type: object
          properties:
            id:
              type: string
              format: uuid
            roleId:
              type: string
              format: uuid
            personId:
              type: string
              format: uuid
            scopeType:
              type: string
            scopeId:
              type: string
            assignedAt:
              type: string
              format: date-time
          required: [id, roleId, personId, scopeType, assignedAt]
      required: [data]

    AssignRoleRequest:
      type: object
      properties:
        roleId:
          type: string
          format: uuid
        personId:
          type: string
          format: uuid
        scopeType:
          type: string
        scopeId:
          type: string
        expiresAt:
          type: string
          format: date-time
      required: [roleId, personId]

    DelegationResponse:
      type: object
      properties:
        data:
          type: object
          properties:
            id:
              type: string
              format: uuid
            delegatorPersonId:
              type: string
              format: uuid
            delegatePersonId:
              type: string
              format: uuid
            scopeType:
              type: string
            scopeId:
              type: string
            effectiveAt:
              type: string
              format: date-time
            expiresAt:
              type: string
              format: date-time
          required:
            [id, delegatorPersonId, delegatePersonId, scopeType, effectiveAt]
      required: [data]

    CreateDelegationRequest:
      type: object
      properties:
        delegatePersonId:
          type: string
          format: uuid
        scopeType:
          type: string
        scopeId:
          type: string
        authorityGrantCodes:
          type: array
          items:
            type: string
        reason:
          type: string
        effectiveAt:
          type: string
          format: date-time
        expiresAt:
          type: string
          format: date-time
      required: [delegatePersonId, authorityGrantCodes, effectiveAt]

    Proposal:
      type: object
      properties:
        id:
          type: string
          format: uuid
        proposalNumber:
          type: string
        title:
          type: string
        summary:
          type: string
        proposalType:
          $ref: "#/components/schemas/ProposalType"
        currentStage:
          $ref: "#/components/schemas/ProposalStage"
        proposerPersonId:
          type: string
          format: uuid
        proposerMemberId:
          type: string
          format: uuid
        currentVersionId:
          type: string
          format: uuid
        submittedAt:
          type: string
          format: date-time
        withdrawnAt:
          type: string
          format: date-time
        rejectedAt:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time
      required:
        [id, title, proposalType, currentStage, createdAt, updatedAt]

    ProposalResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Proposal"
      required: [data]

    ProposalListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Proposal"
        pagination:
          $ref: "#/components/schemas/Pagination"
      required: [data, pagination]

    CreateProposalDraftRequest:
      type: object
      properties:
        title:
          type: string
        summary:
          type: string
        proposalType:
          $ref: "#/components/schemas/ProposalType"
        bodyMarkdown:
          type: string
      required: [title, bodyMarkdown]

    SubmitProposalRequest:
      type: object
      properties:
        note:
          type: string

    ProposalVersion:
      type: object
      properties:
        id:
          type: string
          format: uuid
        proposalId:
          type: string
          format: uuid
        versionNumber:
          type: integer
        titleSnapshot:
          type: string
        bodyMarkdown:
          type: string
        changeSummary:
          type: string
        createdByPersonId:
          type: string
          format: uuid
        createdAt:
          type: string
          format: date-time
      required:
        [id, proposalId, versionNumber, titleSnapshot, bodyMarkdown, createdByPersonId, createdAt]

    ProposalVersionResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/ProposalVersion"
      required: [data]

    ProposalVersionListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/ProposalVersion"
      required: [data]

    CreateProposalVersionRequest:
      type: object
      properties:
        titleSnapshot:
          type: string
        bodyMarkdown:
          type: string
        changeSummary:
          type: string
      required: [titleSnapshot, bodyMarkdown]

    SetCurrentProposalVersionRequest:
      type: object
      properties:
        proposalVersionId:
          type: string
          format: uuid
      required: [proposalVersionId]

    Amendment:
      type: object
      properties:
        id:
          type: string
          format: uuid
        proposalId:
          type: string
          format: uuid
        title:
          type: string
        bodyText:
          type: string
        status:
          $ref: "#/components/schemas/AmendmentStatus"
        submittedAt:
          type: string
          format: date-time
      required: [id, proposalId, bodyText, status, submittedAt]

    AmendmentResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Amendment"
      required: [data]

    AmendmentListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Amendment"
      required: [data]

    CreateAmendmentRequest:
      type: object
      properties:
        title:
          type: string
        bodyText:
          type: string
      required: [bodyText]

    CommitteeAssignmentResponse:
      type: object
      properties:
        data:
          type: object
          properties:
            id:
              type: string
              format: uuid
            proposalId:
              type: string
              format: uuid
            governanceBodyId:
              type: string
              format: uuid
            status:
              type: string
            assignedAt:
              type: string
              format: date-time
          required: [id, proposalId, governanceBodyId, status, assignedAt]
      required: [data]

    AssignCommitteeRequest:
      type: object
      properties:
        governanceBodyId:
          type: string
          format: uuid
      required: [governanceBodyId]

    TransitionProposalRequest:
      type: object
      properties:
        targetStage:
          $ref: "#/components/schemas/ProposalStage"
        reason:
          type: string
      required: [targetStage]

    Ballot:
      type: object
      properties:
        id:
          type: string
          format: uuid
        proposalId:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        state:
          $ref: "#/components/schemas/BallotState"
        scheduledOpenAt:
          type: string
          format: date-time
        openedAt:
          type: string
          format: date-time
        scheduledCloseAt:
          type: string
          format: date-time
        closedAt:
          type: string
          format: date-time
        cancelledAt:
          type: string
          format: date-time
      required: [id, title, state]

    BallotResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Ballot"
      required: [data]

    BallotListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Ballot"
        pagination:
          $ref: "#/components/schemas/Pagination"
      required: [data, pagination]

    CreateBallotRequest:
      type: object
      properties:
        proposalId:
          type: string
          format: uuid
        title:
          type: string
        description:
          type: string
        scheduledOpenAt:
          type: string
          format: date-time
        scheduledCloseAt:
          type: string
          format: date-time
      required: [title]

    BallotEligibilitySnapshot:
      type: object
      properties:
        ballotId:
          type: string
          format: uuid
        memberId:
          type: string
          format: uuid
        eligibilityStatus:
          type: string
          enum: [ELIGIBLE, INELIGIBLE]
        reason:
          type: string
        snapshotAt:
          type: string
          format: date-time
      required: [ballotId, memberId, eligibilityStatus, snapshotAt]

    BallotEligibilitySnapshotListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/BallotEligibilitySnapshot"
      required: [data]

    Vote:
      type: object
      properties:
        id:
          type: string
          format: uuid
        ballotId:
          type: string
          format: uuid
        memberId:
          type: string
          format: uuid
        choice:
          $ref: "#/components/schemas/VoteChoice"
        castAt:
          type: string
          format: date-time
      required: [id, ballotId, memberId, choice, castAt]

    VoteResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Vote"
      required: [data]

    VoteListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Vote"
      required: [data]

    CastVoteRequest:
      type: object
      properties:
        choice:
          $ref: "#/components/schemas/VoteChoice"
      required: [choice]

    VoteTally:
      type: object
      properties:
        ballotId:
          type: string
          format: uuid
        yesCount:
          type: integer
        noCount:
          type: integer
        abstainCount:
          type: integer
        totalCount:
          type: integer
        quorumMet:
          type: boolean
        thresholdMet:
          type: boolean
        computedAt:
          type: string
          format: date-time
      required:
        [ballotId, yesCount, noCount, abstainCount, totalCount, quorumMet, thresholdMet, computedAt]

    VoteTallyResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/VoteTally"
      required: [data]

    Certification:
      type: object
      properties:
        id:
          type: string
          format: uuid
        ballotId:
          type: string
          format: uuid
        status:
          $ref: "#/components/schemas/CertificationStatus"
        certifiedByPersonId:
          type: string
          format: uuid
        certifiedAt:
          type: string
          format: date-time
        rejectedAt:
          type: string
          format: date-time
        notes:
          type: string
        quorumRuleVersionId:
          type: string
          format: uuid
        thresholdRuleVersionId:
          type: string
          format: uuid
        certificationRuleVersionId:
          type: string
          format: uuid
      required:
        [id, ballotId, status, quorumRuleVersionId, thresholdRuleVersionId]

    CertificationResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Certification"
      required: [data]

    CreateCertificationRequest:
      type: object
      properties:
        ballotId:
          type: string
          format: uuid
        notes:
          type: string
      required: [ballotId]

    RejectCertificationRequest:
      type: object
      properties:
        notes:
          type: string

    Ratification:
      type: object
      properties:
        id:
          type: string
          format: uuid
        proposalId:
          type: string
          format: uuid
        certificationRecordId:
          type: string
          format: uuid
        status:
          $ref: "#/components/schemas/RatificationStatus"
        ratifiedByPersonId:
          type: string
          format: uuid
        ratifiedAt:
          type: string
          format: date-time
        notes:
          type: string
      required: [id, proposalId, status]

    RatificationResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/Ratification"
      required: [data]

    CreateRatificationRequest:
      type: object
      properties:
        proposalId:
          type: string
          format: uuid
        certificationRecordId:
          type: string
          format: uuid
        notes:
          type: string
      required: [proposalId]

    OfficialRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
        recordType:
          type: string
        title:
          type: string
        summary:
          type: string
        sourceEntityType:
          type: string
        sourceEntityId:
          type: string
        status:
          $ref: "#/components/schemas/OfficialRecordStatus"
        officializedAt:
          type: string
          format: date-time
      required: [id, recordType, title, sourceEntityType, sourceEntityId, status]

    OfficialRecordResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/OfficialRecord"
      required: [data]

    OfficialRecordListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/OfficialRecord"
        pagination:
          $ref: "#/components/schemas/Pagination"
      required: [data, pagination]

    CreateOfficialRecordRequest:
      type: object
      properties:
        recordType:
          type: string
        title:
          type: string
        summary:
          type: string
        sourceEntityType:
          type: string
        sourceEntityId:
          type: string
      required: [recordType, title, sourceEntityType, sourceEntityId]

    RecordVersion:
      type: object
      properties:
        id:
          type: string
          format: uuid
        officialRecordId:
          type: string
          format: uuid
        versionNumber:
          type: integer
        bodyMarkdown:
          type: string
        changeSummary:
          type: string
        createdByPersonId:
          type: string
          format: uuid
        createdAt:
          type: string
          format: date-time
      required: [id, officialRecordId, versionNumber, bodyMarkdown, createdAt]

    RecordVersionListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/RecordVersion"
      required: [data]

    GazetteIssue:
      type: object
      properties:
        id:
          type: string
          format: uuid
        issueNumber:
          type: string
        title:
          type: string
        publicationState:
          $ref: "#/components/schemas/PublicationState"
        scheduledFor:
          type: string
          format: date-time
        publishedAt:
          type: string
          format: date-time
      required: [id, title, publicationState]

    GazetteIssueResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/GazetteIssue"
      required: [data]

    GazetteIssueListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/GazetteIssue"
      required: [data]

    CreateGazetteIssueRequest:
      type: object
      properties:
        issueNumber:
          type: string
        title:
          type: string
        scheduledFor:
          type: string
          format: date-time
      required: [title]

    GazetteEntry:
      type: object
      properties:
        id:
          type: string
          format: uuid
        gazetteIssueId:
          type: string
          format: uuid
        officialRecordId:
          type: string
          format: uuid
        titleSnapshot:
          type: string
        summarySnapshot:
          type: string
        publicationOrder:
          type: integer
        publishedAt:
          type: string
          format: date-time
      required: [id, gazetteIssueId, officialRecordId, titleSnapshot, publicationOrder]

    GazetteEntryResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/GazetteEntry"
      required: [data]

    CreateGazetteEntryRequest:
      type: object
      properties:
        gazetteIssueId:
          type: string
          format: uuid
        officialRecordId:
          type: string
          format: uuid
        titleSnapshot:
          type: string
        summarySnapshot:
          type: string
        publicationOrder:
          type: integer
      required: [gazetteIssueId, officialRecordId, titleSnapshot, publicationOrder]

    PublicRegisterEntry:
      type: object
      properties:
        id:
          type: string
          format: uuid
        registerType:
          type: string
        sourceEntityType:
          type: string
        sourceEntityId:
          type: string
        displayTitle:
          type: string
        displaySummary:
          type: string
        publicUrlSlug:
          type: string
        publicationState:
          $ref: "#/components/schemas/PublicationState"
        publishedAt:
          type: string
          format: date-time
      required:
        [id, registerType, sourceEntityType, sourceEntityId, displayTitle, publicationState]

    PublicRegisterEntryListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/PublicRegisterEntry"
      required: [data]

    GovernanceRule:
      type: object
      properties:
        id:
          type: string
          format: uuid
        code:
          type: string
        name:
          type: string
        ruleType:
          type: string
        description:
          type: string
        sourceReference:
          type: string
      required: [id, code, name, ruleType]

    GovernanceRuleResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/GovernanceRule"
      required: [data]

    GovernanceRuleListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/GovernanceRule"
      required: [data]

    CreateGovernanceRuleRequest:
      type: object
      properties:
        code:
          type: string
        name:
          type: string
        ruleType:
          type: string
        description:
          type: string
        sourceReference:
          type: string
      required: [code, name, ruleType]

    RuleVersion:
      type: object
      properties:
        id:
          type: string
          format: uuid
        governanceRuleId:
          type: string
          format: uuid
        versionLabel:
          type: string
        effectiveFrom:
          type: string
          format: date-time
        effectiveTo:
          type: string
          format: date-time
        status:
          type: string
        parameters:
          type: object
          additionalProperties: true
      required: [id, governanceRuleId, versionLabel, effectiveFrom, status]

    RuleVersionResponse:
      type: object
      properties:
        data:
          $ref: "#/components/schemas/RuleVersion"
      required: [data]

    RuleVersionListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/RuleVersion"
      required: [data]

    CreateRuleVersionRequest:
      type: object
      properties:
        versionLabel:
          type: string
        effectiveFrom:
          type: string
          format: date-time
        effectiveTo:
          type: string
          format: date-time
        status:
          type: string
          enum: [DRAFT, ACTIVE, SUPERSEDED, RETIRED]
        parameters:
          type: object
          additionalProperties: true
        scopes:
          type: array
          items:
            type: object
            properties:
              scopeType:
                type: string
              scopeId:
                type: string
            required: [scopeType]
      required: [versionLabel, effectiveFrom, status]

    Notification:
      type: object
      properties:
        id:
          type: string
          format: uuid
        personId:
          type: string
          format: uuid
        notificationType:
          type: string
        title:
          type: string
        body:
          type: string
        deliveryStatus:
          type: string
        readAt:
          type: string
          format: date-time
        createdAt:
          type: string
          format: date-time
      required: [id, personId, notificationType, title, body, deliveryStatus, createdAt]

    NotificationListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/Notification"
      required: [data]

    JobRecord:
      type: object
      properties:
        id:
          type: string
          format: uuid
        jobType:
          type: string
        queueName:
          type: string
        status:
          $ref: "#/components/schemas/JobStatus"
        attemptCount:
          type: integer
        scheduledFor:
          type: string
          format: date-time
        startedAt:
          type: string
          format: date-time
        finishedAt:
          type: string
          format: date-time
        errorMessage:
          type: string
      required: [id, jobType, queueName, status, attemptCount]

    JobRecordListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/JobRecord"
      required: [data]

    AuditEvent:
      type: object
      properties:
        id:
          type: string
          format: uuid
        actionType:
          $ref: "#/components/schemas/ActionType"
        entityType:
          type: string
        entityId:
          type: string
        actorPersonId:
          type: string
          format: uuid
        authoritySourceType:
          type: string
        authoritySourceId:
          type: string
        ruleVersionIds:
          type: array
          items:
            type: string
            format: uuid
        summary:
          type: string
        occurredAt:
          type: string
          format: date-time
      required: [id, actionType, entityType, entityId, occurredAt]

    AuditEventListResponse:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: "#/components/schemas/AuditEvent"
        pagination:
          $ref: "#/components/schemas/Pagination"
      required: [data, pagination]
```

## What this gives you

This spec gives you a strong starting point for:

* `openapi.yaml`
* generated API docs
* typed client generation for `packages/gov-client`
* request/response contract tests
* server route scaffolding in `apps/gov-api`

## Important implementation notes

There are four things I would treat as canonical next-step refinements before calling this production-final:

First, split **read DTOs** from **write DTOs** even more aggressively for some resources, especially proposals, ballots, and certifications.

Second, formalize **transition action vocabularies** instead of only sending a `targetStage` string for lifecycle moves. In production I usually prefer explicit action enums like:

* `SUBMIT`
* `ASSIGN_COMMITTEE`
* `OPEN_BALLOT`
* `CLOSE_BALLOT`
* `CERTIFY`

Third, add **problem-details style errors** if you want more standardized HTTP error bodies.

Fourth, decide whether some endpoints should be:

* `POST /proposals/{id}/submit`
* versus a unified command endpoint like `POST /commands/submit-proposal`

For your system, the resource-plus-action style above is the stronger fit.

The next strongest step is to generate either the **typed gov-client plan** or the **route-by-route implementation manifest for apps/gov-api**.
