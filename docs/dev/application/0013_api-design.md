# Document 13 — `docs/application/api-design.md`

## Purpose of this document

This document defines the **API architecture and interface design** for the Ardtire Society Digital Governance Platform.

Earlier documents defined:

* the domain model
* governance rules
* authority system
* state machines
* application services

This document translates those structures into **external interfaces**.

The API layer enables:

* the web application
* administrative tools
* governance interfaces
* integrations
* automation services

to interact with the governance system.

The API must therefore be:

* stable
* explicit
* secure
* versioned
* authority-aware

---

# 1. API architectural principles

The API must follow several architectural principles.

## Principle 1 — Resource-oriented design

The API should model domain resources.

Examples:

```text
/proposals
/ballots
/votes
/members
/records
/gazette
```

---

## Principle 2 — Use cases drive endpoints

Endpoints should correspond to **use cases** rather than arbitrary CRUD.

Example:

```text
POST /proposals
POST /ballots/{id}/votes
POST /certifications
```

---

## Principle 3 — Authority enforcement

Every endpoint must enforce authority validation.

Unauthorized actions must return an error.

---

## Principle 4 — Rule compliance

API operations must invoke rule evaluation where applicable.

---

## Principle 5 — Explicit state transitions

Endpoints must respect lifecycle state machines.

Invalid transitions must fail.

---

# 2. API style

The governance API should follow:

* **RESTful resource patterns**
* **OpenAPI specification**
* **JSON payloads**
* **stateless requests**

---

# 3. API versioning

The API must be versioned.

Recommended pattern:

```text
/api/v1/
```

Example:

```text
/api/v1/proposals
/api/v1/ballots
/api/v1/members
```

Future changes introduce new versions.

---

# 4. Authentication

Authentication is handled through **SSO integration**.

Recommended approach:

* Keycloak OIDC
* bearer tokens

Example header:

```text
Authorization: Bearer <access_token>
```

---

# 5. Authorization

Authorization is evaluated through the **authority model**.

The API layer must validate:

* membership standing
* roles
* office authority
* delegations

before executing commands.

---

# 6. API resource groups

Endpoints are grouped by domain.

Primary groups:

1. identity
2. membership
3. governance
4. proposals
5. ballots
6. votes
7. certification
8. records
9. gazette
10. administration

---

# 7. Identity endpoints

### GetCurrentUser

```text
GET /api/v1/identity/me
```

Returns:

```json
{
  "user_id": "123",
  "person_id": "42",
  "membership_status": "active"
}
```

---

### GetUserRoles

```text
GET /api/v1/identity/roles
```

Returns roles and authorities.

---

# 8. Membership endpoints

### SubmitMembershipApplication

```text
POST /api/v1/membership/applications
```

Request:

```json
{
  "applicant_name": "John Doe",
  "supporting_statement": "..."
}
```

Response:

```json
{
  "application_id": "app_123",
  "status": "submitted"
}
```

---

### ReviewMembershipApplication

```text
POST /api/v1/membership/applications/{id}/review
```

Request:

```json
{
  "decision": "approve"
}
```

---

### GetMemberProfile

```text
GET /api/v1/members/{member_id}
```

Returns member details.

---

# 9. Governance endpoints

### ListGovernanceBodies

```text
GET /api/v1/governance/bodies
```

---

### CreateGovernanceBody

```text
POST /api/v1/governance/bodies
```

---

### AssignOfficeHolder

```text
POST /api/v1/governance/offices/{id}/assign
```

---

# 10. Proposal endpoints

### CreateProposalDraft

```text
POST /api/v1/proposals
```

Request:

```json
{
  "title": "Proposal Title",
  "text": "Proposal text"
}
```

---

### SubmitProposal

```text
POST /api/v1/proposals/{id}/submit
```

Transitions proposal to `Submitted`.

---

### AmendProposal

```text
POST /api/v1/proposals/{id}/amendments
```

Adds amendment.

---

### GetProposal

```text
GET /api/v1/proposals/{id}
```

Returns proposal with versions.

---

### ListProposals

```text
GET /api/v1/proposals
```

---

# 11. Ballot endpoints

### CreateBallot

```text
POST /api/v1/ballots
```

Request:

```json
{
  "proposal_id": "123",
  "open_time": "2027-05-01T10:00:00Z",
  "close_time": "2027-05-03T10:00:00Z"
}
```

---

### OpenBallot

```text
POST /api/v1/ballots/{id}/open
```

---

### CloseBallot

```text
POST /api/v1/ballots/{id}/close
```

---

### GetBallot

```text
GET /api/v1/ballots/{id}
```

---

# 12. Voting endpoints

### CastVote

```text
POST /api/v1/ballots/{id}/votes
```

Request:

```json
{
  "choice": "yes"
}
```

Response:

```json
{
  "vote_id": "vote_456"
}
```

---

### GetBallotVotes

```text
GET /api/v1/ballots/{id}/votes
```

Authority restricted.

---

# 13. Certification endpoints

### CertifyResult

```text
POST /api/v1/certifications
```

Request:

```json
{
  "ballot_id": "123"
}
```

Response:

```json
{
  "certification_id": "cert_789"
}
```

---

### RejectCertification

```text
POST /api/v1/certifications/{id}/reject
```

---

# 14. Record endpoints

### CreateOfficialRecord

```text
POST /api/v1/records
```

---

### GetRecord

```text
GET /api/v1/records/{id}
```

---

### ListRecords

```text
GET /api/v1/records
```

---

# 15. Gazette endpoints

### CreateGazetteIssue

```text
POST /api/v1/gazette/issues
```

---

### PublishGazetteEntry

```text
POST /api/v1/gazette/entries
```

---

### ListGazetteIssues

```text
GET /api/v1/gazette/issues
```

---

# 16. Administrative endpoints

### AssignRole

```text
POST /api/v1/admin/roles
```

---

### RevokeRole

```text
DELETE /api/v1/admin/roles/{id}
```

---

### DelegateAuthority

```text
POST /api/v1/admin/delegations
```

---

# 17. Response format

Responses should follow a consistent structure.

Example:

```json
{
  "data": {...},
  "metadata": {...},
  "errors": null
}
```

---

# 18. Error handling

Errors must be structured.

Example:

```json
{
  "error": {
    "code": "insufficient_authority",
    "message": "User does not have authority to certify results."
  }
}
```

Common error codes:

* unauthorized
* insufficient_authority
* rule_violation
* invalid_state_transition
* resource_not_found

---

# 19. Pagination

List endpoints must support pagination.

Example:

```text
GET /api/v1/proposals?page=1&limit=20
```

Response includes:

* page
* limit
* total_count

---

# 20. Filtering

Endpoints may support filtering.

Example:

```text
GET /api/v1/proposals?status=submitted
```

---

# 21. Sorting

Sorting should be supported.

Example:

```text
GET /api/v1/proposals?sort=created_at
```

---

# 22. API documentation

The entire API must be described using **OpenAPI**.

Example file:

```text
openapi.yaml
```

This allows:

* client generation
* documentation
* contract validation

---

# 23. Rate limiting

To prevent abuse, rate limiting may be applied.

Example:

```text
100 requests per minute
```

---

# 24. API security

Security measures include:

* authentication tokens
* TLS encryption
* request validation
* audit logging

---

# 25. Summary

The API layer exposes the governance platform through:

* REST endpoints
* versioned APIs
* authority enforcement
* rule validation
* explicit state transitions

Key resource groups include:

* identity
* membership
* governance
* proposals
* ballots
* votes
* certification
* records
* gazette
* administration

The API forms the **external interface to the governance engine**.

---

## Status

**Status:** Draft.
**Next document:**

`docs/application/event-architecture.md`

3… 2… 1… next: **Document 14 — Event Architecture**, where we define the **event-driven backbone of the platform (domain events, projections, audit logs, notifications, and background workflows).**
