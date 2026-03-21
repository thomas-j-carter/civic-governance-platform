# Document 34 — `docs/implementation/gov-client-plan.md`

## Purpose of this document

This document defines the **typed client plan** for `packages/gov-client`.

`packages/gov-client` is the canonical TypeScript client used by:

* `apps/web`
* server functions
* admin workflows
* selected internal tools
* test harnesses
* possibly worker-side internal callers where HTTP-to-API calls are still appropriate

Its purpose is to provide:

* strongly typed request/response contracts
* a stable interface over `apps/gov-api`
* consistent auth handling
* standardized problem-details error handling
* ergonomic domain-oriented client methods
* a clean separation between generated artifacts and handwritten convenience wrappers

This package should be treated as the **official typed consumer SDK** for the governance API.

---

# 1. Design goals

The client package must achieve several goals.

## Goal 1 — strong typing from the API contract

The client should derive as much type information as practical from the OpenAPI contract so that:

* request bodies are typed
* path params are typed
* query params are typed
* response bodies are typed
* problem-details errors are typed

---

## Goal 2 — ergonomic domain-oriented usage

Consumers should not have to manually build raw URLs or repetitive fetch calls.

Good:

```ts
govClient.proposals.createDraft(...)
govClient.ballots.open(...)
govClient.certifications.certify(...)
```

Bad:

```ts
fetch(`/api/v1/proposals/${id}/actions/submit`, ...)
```

everywhere across the codebase.

---

## Goal 3 — preserve read/write DTO separation

The client must preserve the API contract distinction between:

* read DTOs
* write DTOs
* action commands
* problem-details errors

This should remain visible in the package structure.

---

## Goal 4 — standardize error handling

All non-2xx responses should be normalized into typed error classes or typed result wrappers that expose:

* HTTP status
* problem-details payload
* trace ID
* error code

---

## Goal 5 — support both server-side and browser-capable usage

The client should support:

* authenticated server usage from `apps/web`
* controlled browser usage only where appropriate
* test harness usage
* mocked usage in unit tests

For sensitive flows, server-side usage should remain preferred.

---

# 2. Package placement

Recommended package location:

```text
packages/gov-client/
```

Recommended structure:

```text
packages/gov-client/
├─ src/
│  ├─ index.ts
│  ├─ client/
│  │  ├─ create-gov-client.ts
│  │  ├─ transport.ts
│  │  ├─ auth.ts
│  │  ├─ config.ts
│  │  ├─ errors.ts
│  │  ├─ result.ts
│  │  └─ request.ts
│  ├─ generated/
│  │  ├─ openapi-types.ts
│  │  └─ openapi-client.ts
│  ├─ modules/
│  │  ├─ identity.ts
│  │  ├─ membership.ts
│  │  ├─ governance.ts
│  │  ├─ roles.ts
│  │  ├─ proposals.ts
│  │  ├─ ballots.ts
│  │  ├─ certifications.ts
│  │  ├─ records.ts
│  │  ├─ gazette.ts
│  │  ├─ registers.ts
│  │  ├─ rules.ts
│  │  ├─ notifications.ts
│  │  ├─ jobs.ts
│  │  └─ audit.ts
│  ├─ dto/
│  │  ├─ read.ts
│  │  ├─ write.ts
│  │  ├─ actions.ts
│  │  └─ problems.ts
│  ├─ testing/
│  │  ├─ mock-gov-client.ts
│  │  └─ fixtures.ts
│  └─ utils/
│     ├─ pagination.ts
│     └─ query.ts
├─ package.json
├─ tsconfig.json
└─ README.md
```

---

# 3. Generated vs handwritten split

## Recommendation

Use a **hybrid model**.

### Generated artifacts

Generate:

* low-level OpenAPI types
* possibly a low-level raw client

### Handwritten layer

Write:

* domain-oriented module wrappers
* typed convenience methods
* normalized error handling
* auth injection logic
* result wrappers
* pagination helpers
* mock/test doubles

This is the strongest approach.

## Why

Purely generated clients are often:

* mechanically correct
* ergonomically poor
* leaky in naming
* weak at domain-level discoverability

Purely handwritten clients drift from the API contract faster.

So the best pattern is:

```text
OpenAPI spec
   ↓
generated raw types/client
   ↓
handwritten gov-client modules
```

---

# 4. Canonical exported surface

Top-level export should look like:

```ts
export interface GovClient {
  identity: IdentityClient;
  membership: MembershipClient;
  governance: GovernanceClient;
  roles: RolesClient;
  proposals: ProposalsClient;
  ballots: BallotsClient;
  certifications: CertificationsClient;
  records: RecordsClient;
  gazette: GazetteClient;
  registers: RegistersClient;
  rules: RulesClient;
  notifications: NotificationsClient;
  jobs: JobsClient;
  audit: AuditClient;
}
```

Created via:

```ts
const govClient = createGovClient({...});
```

---

# 5. Transport design

## Recommendation

Centralize all HTTP behavior in one transport layer.

Core file:

```text
src/client/transport.ts
```

Responsibilities:

* base URL resolution
* auth token injection
* request headers
* JSON serialization
* query string encoding
* error parsing into problem details
* trace ID extraction
* timeout handling

This should be the only place doing raw `fetch`.

---

# 6. Auth handling design

## Recommendation

Support pluggable auth providers.

Example:

```ts
type AccessTokenProvider = () => Promise<string | null>;
```

Client config:

```ts
type GovClientConfig = {
  baseUrl: string;
  getAccessToken?: AccessTokenProvider;
  fetchImpl?: typeof fetch;
  defaultHeaders?: Record<string, string>;
};
```

This makes the client work in:

* Next/TanStack server functions
* tests
* internal tools

## Important

Do not hardwire Keycloak details inside `gov-client`.
That belongs in `packages/auth` or app-specific integration code.

`gov-client` should only know how to attach a bearer token if given one.

---

# 7. Error model

## Recommendation

Adopt both:

* typed problem-details payloads
* a `GovApiError` class

### Problem details type

```ts
export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
  code?: string;
  traceId?: string;
  errors?: Record<string, string[]>;
}
```

### Error class

```ts
export class GovApiError extends Error {
  status: number;
  problem: ProblemDetails;
  traceId?: string;
}
```

This gives consumers both:

* try/catch ergonomics
* machine-readable structured detail

## Recommendation on return style

Use **throwing client methods by default**, not `Result<T, E>` everywhere.

Why:

* simpler consumer ergonomics in application code
* easier integration with server actions/loaders
* aligns with fetch expectations
* failures are exceptional in route consumption

But also provide a safe wrapper utility for selected contexts:

```ts
tryGovClient(...)
```

for cases where explicit result handling is preferred.

---

# 8. DTO organization

## Recommendation

Keep DTO exports clearly separated.

### Read DTO exports

From:

```text
src/dto/read.ts
```

Examples:

* `ProposalDetailDto`
* `ProposalListItemDto`
* `BallotDetailDto`
* `CertificationDetailDto`

### Write DTO exports

From:

```text
src/dto/write.ts
```

Examples:

* `CreateProposalDraftRequest`
* `CreateBallotRequest`
* `CreateCertificationRequest`

### Action DTO exports

From:

```text
src/dto/actions.ts
```

Examples:

* `SubmitProposalRequest`
* `AssignCommitteeRequest`
* `OpenBallotRequest`
* `CertifyResultRequest`

### Problem DTO exports

From:

```text
src/dto/problems.ts
```

Examples:

* `ProblemDetails`
* `ValidationProblemDetails`
* `TransitionProblemDetails`

This preserves the read/write contract discipline.

---

# 9. Module-by-module client interfaces

## 9.1 IdentityClient

```ts
interface IdentityClient {
  getCurrentIdentity(): Promise<CurrentIdentityResponse["data"]>;
  getAuthorityContext(): Promise<AuthorityContextResponse["data"]>;
}
```

---

## 9.2 MembershipClient

```ts
interface MembershipClient {
  submitApplication(
    input: CreateMembershipApplicationRequest
  ): Promise<MembershipApplicationDto>;

  listApplications(
    query?: ListMembershipApplicationsQuery
  ): Promise<Paginated<MembershipApplicationDto>>;

  getApplication(applicationId: UUID): Promise<MembershipApplicationDto>;

  startReview(applicationId: UUID, input: StartMembershipApplicationReviewRequest): Promise<MembershipApplicationDto>;
  requestInformation(applicationId: UUID, input: RequestInformationRequest): Promise<MembershipApplicationDto>;
  approve(applicationId: UUID, input?: ApproveMembershipApplicationRequest): Promise<MembershipApplicationDto>;
  reject(applicationId: UUID, input?: RejectMembershipApplicationRequest): Promise<MembershipApplicationDto>;
  withdraw(applicationId: UUID, input?: WithdrawMembershipApplicationRequest): Promise<MembershipApplicationDto>;

  listMembers(query?: ListMembersQuery): Promise<Paginated<MemberDto>>;
  getMember(memberId: UUID): Promise<MemberDto>;

  activate(memberId: UUID, input?: ActivateMemberRequest): Promise<MemberDto>;
  restrict(memberId: UUID, input: RestrictMemberRequest): Promise<MemberDto>;
  suspend(memberId: UUID, input: SuspendMemberRequest): Promise<MemberDto>;
  reinstate(memberId: UUID, input?: ReinstateMemberRequest): Promise<MemberDto>;
  revoke(memberId: UUID, input: RevokeMemberRequest): Promise<MemberDto>;
}
```

---

## 9.3 GovernanceClient

```ts
interface GovernanceClient {
  listBodies(): Promise<GovernanceBodyDto[]>;
  createBody(input: CreateGovernanceBodyRequest): Promise<GovernanceBodyDto>;
  getBody(bodyId: UUID): Promise<GovernanceBodyDto>;

  listOffices(): Promise<OfficeDto[]>;
  createOffice(input: CreateOfficeRequest): Promise<OfficeDto>;
  assignOfficeHolder(officeId: UUID, input: AssignOfficeHolderRequest): Promise<OfficeHolderDto>;
}
```

---

## 9.4 RolesClient

```ts
interface RolesClient {
  listRoles(): Promise<RoleDto[]>;
  assignRole(input: AssignRoleRequest): Promise<RoleAssignmentDto>;
  createDelegation(input: CreateDelegationRequest): Promise<DelegationDto>;
}
```

---

## 9.5 ProposalsClient

This is one of the most important modules.

```ts
interface ProposalsClient {
  list(query?: ListProposalsQuery): Promise<Paginated<ProposalListItemDto>>;
  get(proposalId: UUID): Promise<ProposalDetailDto>;

  createDraft(input: CreateProposalDraftRequest): Promise<ProposalDetailDto>;

  listVersions(proposalId: UUID): Promise<ProposalVersionDto[]>;
  createVersion(proposalId: UUID, input: CreateProposalVersionRequest): Promise<ProposalVersionDto>;
  setCurrentVersion(proposalId: UUID, input: SetCurrentProposalVersionRequest): Promise<ProposalDetailDto>;

  submit(proposalId: UUID, input?: SubmitProposalRequest): Promise<ProposalDetailDto>;
  startEligibilityReview(proposalId: UUID, input?: StartProposalEligibilityReviewRequest): Promise<ProposalDetailDto>;
  assignCommittee(proposalId: UUID, input: AssignCommitteeRequest): Promise<ProposalDetailDto>;
  markReadyForReading(proposalId: UUID, input?: MarkReadyForReadingRequest): Promise<ProposalDetailDto>;
  openFirstReading(proposalId: UUID, input?: OpenFirstReadingRequest): Promise<ProposalDetailDto>;
  openAmendmentWindow(proposalId: UUID, input?: OpenAmendmentWindowRequest): Promise<ProposalDetailDto>;
  closeAmendmentWindow(proposalId: UUID, input?: CloseAmendmentWindowRequest): Promise<ProposalDetailDto>;
  openSecondReading(proposalId: UUID, input?: OpenSecondReadingRequest): Promise<ProposalDetailDto>;
  scheduleFinalVote(proposalId: UUID, input?: ScheduleFinalVoteRequest): Promise<ProposalDetailDto>;
  withdraw(proposalId: UUID, input?: WithdrawProposalRequest): Promise<ProposalDetailDto>;
  reject(proposalId: UUID, input?: RejectProposalRequest): Promise<ProposalDetailDto>;
  publish(proposalId: UUID, input?: PublishProposalRequest): Promise<ProposalDetailDto>;
  archive(proposalId: UUID, input?: ArchiveProposalRequest): Promise<ProposalDetailDto>;

  listAmendments(proposalId: UUID): Promise<AmendmentDto[]>;
  createAmendment(proposalId: UUID, input: CreateAmendmentRequest): Promise<AmendmentDto>;
}
```

---

## 9.6 BallotsClient

```ts
interface BallotsClient {
  list(query?: ListBallotsQuery): Promise<Paginated<BallotListItemDto>>;
  get(ballotId: UUID): Promise<BallotDetailDto>;

  create(input: CreateBallotRequest): Promise<BallotDetailDto>;

  open(ballotId: UUID, input?: OpenBallotRequest): Promise<BallotDetailDto>;
  close(ballotId: UUID, input?: CloseBallotRequest): Promise<BallotDetailDto>;
  cancel(ballotId: UUID, input?: CancelBallotRequest): Promise<BallotDetailDto>;

  getEligibility(ballotId: UUID): Promise<BallotEligibilityEntryDto[]>;
  listVotes(ballotId: UUID): Promise<VoteDto[]>;
  castVote(ballotId: UUID, input: CastVoteRequest): Promise<VoteDto>;
  getTally(ballotId: UUID): Promise<BallotTallyDto>;
}
```

---

## 9.7 CertificationsClient

```ts
interface CertificationsClient {
  create(input: CreateCertificationRequest): Promise<CertificationDetailDto>;
  get(certificationId: UUID): Promise<CertificationDetailDto>;
  certify(certificationId: UUID, input?: CertifyResultRequest): Promise<CertificationDetailDto>;
  reject(certificationId: UUID, input?: RejectCertificationRequest): Promise<CertificationDetailDto>;

  createRatification(input: CreateRatificationRequest): Promise<RatificationDetailDto>;
}
```

---

## 9.8 RecordsClient

```ts
interface RecordsClient {
  list(query?: ListRecordsQuery): Promise<Paginated<OfficialRecordDto>>;
  create(input: CreateOfficialRecordRequest): Promise<OfficialRecordDto>;
  get(recordId: UUID): Promise<OfficialRecordDto>;
  listVersions(recordId: UUID): Promise<RecordVersionDto[]>;
}
```

---

## 9.9 GazetteClient

```ts
interface GazetteClient {
  listIssues(): Promise<GazetteIssueDto[]>;
  createIssue(input: CreateGazetteIssueRequest): Promise<GazetteIssueDto>;
  getIssue(issueId: UUID): Promise<GazetteIssueDto>;
  publishIssue(issueId: UUID, input?: PublishGazetteIssueRequest): Promise<GazetteIssueDto>;
  createEntry(input: CreateGazetteEntryRequest): Promise<GazetteEntryDto>;
}
```

---

## 9.10 RegistersClient

```ts
interface RegistersClient {
  listEntries(query?: ListPublicRegisterEntriesQuery): Promise<PublicRegisterEntryDto[]>;
}
```

---

## 9.11 RulesClient

```ts
interface RulesClient {
  listRules(): Promise<GovernanceRuleDto[]>;
  createRule(input: CreateGovernanceRuleRequest): Promise<GovernanceRuleDto>;
  listVersions(ruleId: UUID): Promise<RuleVersionDto[]>;
  createVersion(ruleId: UUID, input: CreateRuleVersionRequest): Promise<RuleVersionDto>;
}
```

---

## 9.12 NotificationsClient

```ts
interface NotificationsClient {
  list(): Promise<NotificationDto[]>;
}
```

---

## 9.13 JobsClient

```ts
interface JobsClient {
  list(query?: ListJobsQuery): Promise<JobRecordDto[]>;
}
```

---

## 9.14 AuditClient

```ts
interface AuditClient {
  listEvents(query?: ListAuditEventsQuery): Promise<Paginated<AuditEventDto>>;
}
```

---

# 10. Query object strategy

## Recommendation

Do not expose raw query-string-building to consumers.

Use typed query objects.

Example:

```ts
type ListProposalsQuery = {
  page?: number;
  limit?: number;
  stage?: ProposalStage;
  proposalType?: ProposalType;
};
```

Then the client serializes it.

This improves:

* autocomplete
* consistency
* testability

---

# 11. Response unwrapping strategy

The API responses currently wrap primary payloads like:

```json
{ "data": ... }
```

## Recommendation

The typed client should **unwrap `data` by default** for most methods.

So instead of returning:

```ts
Promise<ProposalResponse>
```

return:

```ts
Promise<ProposalDetailDto>
```

And for list endpoints:

```ts
Promise<Paginated<ProposalListItemDto>>
```

This is far more ergonomic.

## Exception

If some consumer really needs the raw envelope, you can expose internal/raw methods, but the primary public client should unwrap.

---

# 12. Pagination helper model

Create a common type:

```ts
type Paginated<T> = {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
```

All list endpoints with pagination should normalize into this shape even if the raw API uses:

```json
{
  "data": [...],
  "pagination": {...}
}
```

---

# 13. URL and action naming strategy in the client

## Recommendation

Hide HTTP path details from consumers.

For example:

### Consumer sees

```ts
govClient.proposals.submit(proposalId, input)
```

### Not

```ts
govClient.post("/proposals/{id}/actions/submit", ...)
```

The module methods should reflect domain language, not URL mechanics.

---

# 14. Testing strategy for gov-client

## Recommendation

Provide three testing layers.

### Layer 1 — module unit tests

Mock transport and assert:

* correct path
* correct method
* correct query serialization
* correct body serialization
* correct response unwrapping
* correct error mapping

### Layer 2 — contract tests against mock server

Use the OpenAPI contract or a stub server to ensure:

* path correctness
* DTO compatibility
* problem-details handling

### Layer 3 — integration tests against real staging/local gov-api

For critical flows like:

* proposal draft creation
* proposal submit
* ballot open
* cast vote
* certify result

---

# 15. Mock client strategy

Provide a handwritten mockable interface:

```ts
export interface GovClient { ... }
```

Then create:

```ts
createMockGovClient(...)
```

This is better than mocking fetch directly in most app tests.

Example usage in `apps/web` tests:

```ts
const govClient = createMockGovClient({
  proposals: {
    get: async () => fixtureProposal,
    list: async () => fixtureProposalPage,
  },
});
```

This makes UI tests much cleaner.

---

# 16. Code generation strategy

## Recommendation

Use generation only for the raw OpenAPI layer.

Possible generated outputs:

* path types
* operation request/response types
* low-level fetch client signatures

But do **not** expose those generated symbols as the primary public SDK surface.

## Canonical layering

```text
openapi.yaml
   ↓
generated/openapi-types.ts
generated/openapi-client.ts
   ↓
modules/*.ts
   ↓
index.ts public exports
```

---

# 17. Package dependencies

Recommended dependencies:

* minimal runtime deps
* ideally just what is needed for fetch wrapping and query serialization

Avoid heavy runtime client generators in the final package if possible.

Recommended package should depend on:

* `packages/types` if needed
* generated types
* standard fetch-compatible runtime

Avoid having `gov-client` depend directly on:

* UI packages
* Prisma
* domain packages
* Hono server code

This must remain a client contract package.

---

# 18. Recommended file-by-file manifest

```text
packages/gov-client/
├─ src/
│  ├─ index.ts
│  ├─ client/
│  │  ├─ create-gov-client.ts
│  │  ├─ transport.ts
│  │  ├─ config.ts
│  │  ├─ auth.ts
│  │  ├─ errors.ts
│  │  ├─ result.ts
│  │  └─ request.ts
│  ├─ generated/
│  │  ├─ openapi-types.ts
│  │  └─ openapi-client.ts
│  ├─ dto/
│  │  ├─ read.ts
│  │  ├─ write.ts
│  │  ├─ actions.ts
│  │  └─ problems.ts
│  ├─ modules/
│  │  ├─ identity.ts
│  │  ├─ membership.ts
│  │  ├─ governance.ts
│  │  ├─ roles.ts
│  │  ├─ proposals.ts
│  │  ├─ ballots.ts
│  │  ├─ certifications.ts
│  │  ├─ records.ts
│  │  ├─ gazette.ts
│  │  ├─ registers.ts
│  │  ├─ rules.ts
│  │  ├─ notifications.ts
│  │  ├─ jobs.ts
│  │  └─ audit.ts
│  ├─ testing/
│  │  ├─ mock-gov-client.ts
│  │  └─ fixtures.ts
│  └─ utils/
│     ├─ pagination.ts
│     └─ query.ts
```

---

# 19. Recommended implementation order

A senior engineer would implement this in the following order:

## Batch 1 — client foundation

* `config.ts`
* `auth.ts`
* `transport.ts`
* `errors.ts`
* `request.ts`
* `pagination.ts`

## Batch 2 — package interface

* `create-gov-client.ts`
* `index.ts`
* base module interfaces

## Batch 3 — highest-value modules

* `identity.ts`
* `proposals.ts`
* `ballots.ts`
* `certifications.ts`

## Batch 4 — secondary modules

* `membership.ts`
* `governance.ts`
* `records.ts`
* `gazette.ts`
* `rules.ts`

## Batch 5 — test utilities

* `mock-gov-client.ts`
* fixtures
* contract tests

This sequencing matches backend implementation priorities.

---

# 20. Strong recommendations to freeze now

These are the decisions I recommend treating as frozen source of truth:

## Decision 1

`gov-client` public methods return **unwrapped typed DTOs**, not raw HTTP envelopes.

## Decision 2

Errors are normalized into **typed Problem Details + GovApiError**.

## Decision 3

Use **hybrid generated + handwritten** client architecture.

## Decision 4

Keep **module-oriented domain namespaces** like `proposals.submit(...)`, not generic request builders.

## Decision 5

Preserve the **read/write/action DTO split** in client exports.

These are the best long-term decisions for maintainability.

---

# 21. Summary

This plan defines the canonical design of `packages/gov-client`.

It establishes:

* package structure
* generated vs handwritten boundaries
* transport model
* auth strategy
* error strategy
* DTO export strategy
* module interfaces
* pagination normalization
* testing and mocking approach
* implementation order

This is the correct source of truth for building the official typed client for the governance API.

## Recommended next step

The strongest next step is to generate the **actual file-by-file contents for `packages/gov-client`**, beginning with:

1. `src/client/config.ts`
2. `src/client/errors.ts`
3. `src/client/transport.ts`
4. `src/client/create-gov-client.ts`
5. `src/modules/proposals.ts`
6. `src/modules/ballots.ts`
7. `src/modules/certifications.ts`

That gives you the first real usable client slice.
