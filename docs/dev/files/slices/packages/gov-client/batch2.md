# Batch 2 — remaining core modules + mock client

## 1. `packages/gov-client/src/modules/membership.ts`

```ts
import { HttpTransport } from "../client/transport";
import { Paginated, unwrapPaginated } from "../utils/pagination";

export type MembershipApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "INFORMATION_REQUESTED"
  | "RESUBMITTED"
  | "APPROVED"
  | "REJECTED"
  | "WITHDRAWN";

export type MembershipStatus =
  | "PENDING"
  | "ACTIVE"
  | "RESTRICTED"
  | "SUSPENDED"
  | "REVOKED"
  | "FORMER";

export interface MembershipApplicationDto {
  id: string;
  applicantPersonId: string;
  status: MembershipApplicationStatus;
  supportingStatement?: string;
  submittedAt?: string;
  decidedAt?: string;
  decisionSummary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberDto {
  id: string;
  personId: string;
  memberNumber?: string;
  membershipClassId: string;
  status: MembershipStatus;
  admittedAt?: string;
  endedAt?: string;
}

export interface ListMembershipApplicationsQuery {
  page?: number;
  limit?: number;
  status?: MembershipApplicationStatus;
}

export interface ListMembersQuery {
  page?: number;
  limit?: number;
  status?: MembershipStatus;
  membershipClassId?: string;
}

export interface CreateMembershipApplicationRequest {
  supportingStatement: string;
}

export interface StartMembershipApplicationReviewRequest {
  notes?: string;
}

export interface RequestMembershipApplicationInformationRequest {
  notes: string;
}

export interface ApproveMembershipApplicationRequest {
  notes?: string;
}

export interface RejectMembershipApplicationRequest {
  notes?: string;
}

export interface WithdrawMembershipApplicationRequest {
  notes?: string;
}

export interface ActivateMemberRequest {
  reason?: string;
}

export interface RestrictMemberRequest {
  reason: string;
}

export interface SuspendMemberRequest {
  reason: string;
}

export interface ReinstateMemberRequest {
  reason?: string;
}

export interface RevokeMemberRequest {
  reason: string;
}

interface SingleEnvelope<T> {
  data: T;
}

interface ListEnvelope<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface MembershipClient {
  submitApplication(
    input: CreateMembershipApplicationRequest,
  ): Promise<MembershipApplicationDto>;

  listApplications(
    query?: ListMembershipApplicationsQuery,
  ): Promise<Paginated<MembershipApplicationDto>>;

  getApplication(applicationId: string): Promise<MembershipApplicationDto>;

  startReview(
    applicationId: string,
    input?: StartMembershipApplicationReviewRequest,
  ): Promise<MembershipApplicationDto>;

  requestInformation(
    applicationId: string,
    input: RequestMembershipApplicationInformationRequest,
  ): Promise<MembershipApplicationDto>;

  approve(
    applicationId: string,
    input?: ApproveMembershipApplicationRequest,
  ): Promise<MembershipApplicationDto>;

  reject(
    applicationId: string,
    input?: RejectMembershipApplicationRequest,
  ): Promise<MembershipApplicationDto>;

  withdraw(
    applicationId: string,
    input?: WithdrawMembershipApplicationRequest,
  ): Promise<MembershipApplicationDto>;

  listMembers(query?: ListMembersQuery): Promise<Paginated<MemberDto>>;
  getMember(memberId: string): Promise<MemberDto>;

  activate(memberId: string, input?: ActivateMemberRequest): Promise<MemberDto>;
  restrict(memberId: string, input: RestrictMemberRequest): Promise<MemberDto>;
  suspend(memberId: string, input: SuspendMemberRequest): Promise<MemberDto>;
  reinstate(memberId: string, input?: ReinstateMemberRequest): Promise<MemberDto>;
  revoke(memberId: string, input: RevokeMemberRequest): Promise<MemberDto>;
}

export function createMembershipClient(
  transport: HttpTransport,
): MembershipClient {
  return {
    async submitApplication(
      input: CreateMembershipApplicationRequest,
    ): Promise<MembershipApplicationDto> {
      const response = await transport.request<
        SingleEnvelope<MembershipApplicationDto>,
        CreateMembershipApplicationRequest
      >({
        method: "POST",
        path: "/membership/applications",
        body: input,
      });
      return response.data;
    },

    async listApplications(
      query?: ListMembershipApplicationsQuery,
    ): Promise<Paginated<MembershipApplicationDto>> {
      const response = await transport.request<ListEnvelope<MembershipApplicationDto>>({
        method: "GET",
        path: "/membership/applications",
        query,
      });
      return unwrapPaginated(response);
    },

    async getApplication(applicationId: string): Promise<MembershipApplicationDto> {
      const response = await transport.request<SingleEnvelope<MembershipApplicationDto>>({
        method: "GET",
        path: `/membership/applications/${applicationId}`,
      });
      return response.data;
    },

    async startReview(
      applicationId: string,
      input?: StartMembershipApplicationReviewRequest,
    ): Promise<MembershipApplicationDto> {
      const response = await transport.request<
        SingleEnvelope<MembershipApplicationDto>,
        StartMembershipApplicationReviewRequest | undefined
      >({
        method: "POST",
        path: `/membership/applications/${applicationId}/actions/start-review`,
        body: input,
      });
      return response.data;
    },

    async requestInformation(
      applicationId: string,
      input: RequestMembershipApplicationInformationRequest,
    ): Promise<MembershipApplicationDto> {
      const response = await transport.request<
        SingleEnvelope<MembershipApplicationDto>,
        RequestMembershipApplicationInformationRequest
      >({
        method: "POST",
        path: `/membership/applications/${applicationId}/actions/request-information`,
        body: input,
      });
      return response.data;
    },

    async approve(
      applicationId: string,
      input?: ApproveMembershipApplicationRequest,
    ): Promise<MembershipApplicationDto> {
      const response = await transport.request<
        SingleEnvelope<MembershipApplicationDto>,
        ApproveMembershipApplicationRequest | undefined
      >({
        method: "POST",
        path: `/membership/applications/${applicationId}/actions/approve`,
        body: input,
      });
      return response.data;
    },

    async reject(
      applicationId: string,
      input?: RejectMembershipApplicationRequest,
    ): Promise<MembershipApplicationDto> {
      const response = await transport.request<
        SingleEnvelope<MembershipApplicationDto>,
        RejectMembershipApplicationRequest | undefined
      >({
        method: "POST",
        path: `/membership/applications/${applicationId}/actions/reject`,
        body: input,
      });
      return response.data;
    },

    async withdraw(
      applicationId: string,
      input?: WithdrawMembershipApplicationRequest,
    ): Promise<MembershipApplicationDto> {
      const response = await transport.request<
        SingleEnvelope<MembershipApplicationDto>,
        WithdrawMembershipApplicationRequest | undefined
      >({
        method: "POST",
        path: `/membership/applications/${applicationId}/actions/withdraw`,
        body: input,
      });
      return response.data;
    },

    async listMembers(query?: ListMembersQuery): Promise<Paginated<MemberDto>> {
      const response = await transport.request<ListEnvelope<MemberDto>>({
        method: "GET",
        path: "/members",
        query,
      });
      return unwrapPaginated(response);
    },

    async getMember(memberId: string): Promise<MemberDto> {
      const response = await transport.request<SingleEnvelope<MemberDto>>({
        method: "GET",
        path: `/members/${memberId}`,
      });
      return response.data;
    },

    async activate(
      memberId: string,
      input?: ActivateMemberRequest,
    ): Promise<MemberDto> {
      const response = await transport.request<
        SingleEnvelope<MemberDto>,
        ActivateMemberRequest | undefined
      >({
        method: "POST",
        path: `/members/${memberId}/actions/activate`,
        body: input,
      });
      return response.data;
    },

    async restrict(
      memberId: string,
      input: RestrictMemberRequest,
    ): Promise<MemberDto> {
      const response = await transport.request<
        SingleEnvelope<MemberDto>,
        RestrictMemberRequest
      >({
        method: "POST",
        path: `/members/${memberId}/actions/restrict`,
        body: input,
      });
      return response.data;
    },

    async suspend(
      memberId: string,
      input: SuspendMemberRequest,
    ): Promise<MemberDto> {
      const response = await transport.request<
        SingleEnvelope<MemberDto>,
        SuspendMemberRequest
      >({
        method: "POST",
        path: `/members/${memberId}/actions/suspend`,
        body: input,
      });
      return response.data;
    },

    async reinstate(
      memberId: string,
      input?: ReinstateMemberRequest,
    ): Promise<MemberDto> {
      const response = await transport.request<
        SingleEnvelope<MemberDto>,
        ReinstateMemberRequest | undefined
      >({
        method: "POST",
        path: `/members/${memberId}/actions/reinstate`,
        body: input,
      });
      return response.data;
    },

    async revoke(
      memberId: string,
      input: RevokeMemberRequest,
    ): Promise<MemberDto> {
      const response = await transport.request<
        SingleEnvelope<MemberDto>,
        RevokeMemberRequest
      >({
        method: "POST",
        path: `/members/${memberId}/actions/revoke`,
        body: input,
      });
      return response.data;
    },
  };
}
```

---

## 2. `packages/gov-client/src/modules/governance.ts`

```ts
import { HttpTransport } from "../client/transport";

export interface GovernanceBodyDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  bodyType: string;
  isActive: boolean;
}

export interface OfficeDto {
  id: string;
  code: string;
  name: string;
  description?: string;
  governanceBodyId?: string;
  isActive: boolean;
}

export interface OfficeHolderDto {
  id: string;
  officeId: string;
  personId: string;
  startedAt: string;
  endedAt?: string;
}

export interface CreateGovernanceBodyRequest {
  code: string;
  name: string;
  description?: string;
  bodyType: string;
}

export interface CreateOfficeRequest {
  code: string;
  name: string;
  description?: string;
  governanceBodyId?: string;
}

export interface AssignOfficeHolderRequest {
  personId: string;
  appointedAt?: string;
  startedAt: string;
}

interface SingleEnvelope<T> {
  data: T;
}

interface PlainListEnvelope<T> {
  data: T[];
}

export interface GovernanceClient {
  listBodies(): Promise<GovernanceBodyDto[]>;
  createBody(input: CreateGovernanceBodyRequest): Promise<GovernanceBodyDto>;
  getBody(bodyId: string): Promise<GovernanceBodyDto>;

  listOffices(): Promise<OfficeDto[]>;
  createOffice(input: CreateOfficeRequest): Promise<OfficeDto>;
  assignOfficeHolder(
    officeId: string,
    input: AssignOfficeHolderRequest,
  ): Promise<OfficeHolderDto>;
}

export function createGovernanceClient(
  transport: HttpTransport,
): GovernanceClient {
  return {
    async listBodies(): Promise<GovernanceBodyDto[]> {
      const response = await transport.request<PlainListEnvelope<GovernanceBodyDto>>({
        method: "GET",
        path: "/governance/bodies",
      });
      return response.data;
    },

    async createBody(
      input: CreateGovernanceBodyRequest,
    ): Promise<GovernanceBodyDto> {
      const response = await transport.request<
        SingleEnvelope<GovernanceBodyDto>,
        CreateGovernanceBodyRequest
      >({
        method: "POST",
        path: "/governance/bodies",
        body: input,
      });
      return response.data;
    },

    async getBody(bodyId: string): Promise<GovernanceBodyDto> {
      const response = await transport.request<SingleEnvelope<GovernanceBodyDto>>({
        method: "GET",
        path: `/governance/bodies/${bodyId}`,
      });
      return response.data;
    },

    async listOffices(): Promise<OfficeDto[]> {
      const response = await transport.request<PlainListEnvelope<OfficeDto>>({
        method: "GET",
        path: "/governance/offices",
      });
      return response.data;
    },

    async createOffice(input: CreateOfficeRequest): Promise<OfficeDto> {
      const response = await transport.request<
        SingleEnvelope<OfficeDto>,
        CreateOfficeRequest
      >({
        method: "POST",
        path: "/governance/offices",
        body: input,
      });
      return response.data;
    },

    async assignOfficeHolder(
      officeId: string,
      input: AssignOfficeHolderRequest,
    ): Promise<OfficeHolderDto> {
      const response = await transport.request<
        SingleEnvelope<OfficeHolderDto>,
        AssignOfficeHolderRequest
      >({
        method: "POST",
        path: `/governance/offices/${officeId}/actions/assign-holder`,
        body: input,
      });
      return response.data;
    },
  };
}
```

---

## 3. `packages/gov-client/src/modules/roles.ts`

```ts
import { HttpTransport } from "../client/transport";

export interface RoleDto {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface RoleAssignmentDto {
  id: string;
  roleId: string;
  personId: string;
  scopeType: string;
  scopeId?: string;
  assignedAt: string;
}

export interface DelegationDto {
  id: string;
  delegatorPersonId: string;
  delegatePersonId: string;
  scopeType: string;
  scopeId?: string;
  effectiveAt: string;
  expiresAt?: string;
}

export interface AssignRoleRequest {
  roleId: string;
  personId: string;
  scopeType?: string;
  scopeId?: string;
  expiresAt?: string;
}

export interface CreateDelegationRequest {
  delegatePersonId: string;
  scopeType?: string;
  scopeId?: string;
  authorityGrantCodes: string[];
  reason?: string;
  effectiveAt: string;
  expiresAt?: string;
}

interface SingleEnvelope<T> {
  data: T;
}

interface PlainListEnvelope<T> {
  data: T[];
}

export interface RolesClient {
  listRoles(): Promise<RoleDto[]>;
  assignRole(input: AssignRoleRequest): Promise<RoleAssignmentDto>;
  createDelegation(input: CreateDelegationRequest): Promise<DelegationDto>;
}

export function createRolesClient(transport: HttpTransport): RolesClient {
  return {
    async listRoles(): Promise<RoleDto[]> {
      const response = await transport.request<PlainListEnvelope<RoleDto>>({
        method: "GET",
        path: "/roles",
      });
      return response.data;
    },

    async assignRole(input: AssignRoleRequest): Promise<RoleAssignmentDto> {
      const response = await transport.request<
        SingleEnvelope<RoleAssignmentDto>,
        AssignRoleRequest
      >({
        method: "POST",
        path: "/roles/assignments",
        body: input,
      });
      return response.data;
    },

    async createDelegation(
      input: CreateDelegationRequest,
    ): Promise<DelegationDto> {
      const response = await transport.request<
        SingleEnvelope<DelegationDto>,
        CreateDelegationRequest
      >({
        method: "POST",
        path: "/delegations",
        body: input,
      });
      return response.data;
    },
  };
}
```

---

## 4. `packages/gov-client/src/modules/records.ts`

```ts
import { HttpTransport } from "../client/transport";
import { Paginated, unwrapPaginated } from "../utils/pagination";

export type OfficialRecordStatus =
  | "DRAFT"
  | "OFFICIAL"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "ARCHIVED";

export interface OfficialRecordDto {
  id: string;
  recordType: string;
  title: string;
  summary?: string;
  sourceEntityType: string;
  sourceEntityId: string;
  status: OfficialRecordStatus;
  officializedAt?: string;
}

export interface RecordVersionDto {
  id: string;
  officialRecordId: string;
  versionNumber: number;
  bodyMarkdown: string;
  changeSummary?: string;
  createdByPersonId?: string;
  createdAt: string;
}

export interface ListRecordsQuery {
  page?: number;
  limit?: number;
  recordType?: string;
  status?: OfficialRecordStatus;
}

export interface CreateOfficialRecordRequest {
  recordType: string;
  title: string;
  summary?: string;
  sourceEntityType: string;
  sourceEntityId: string;
}

interface SingleEnvelope<T> {
  data: T;
}

interface ListEnvelope<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface PlainListEnvelope<T> {
  data: T[];
}

export interface RecordsClient {
  list(query?: ListRecordsQuery): Promise<Paginated<OfficialRecordDto>>;
  create(input: CreateOfficialRecordRequest): Promise<OfficialRecordDto>;
  get(recordId: string): Promise<OfficialRecordDto>;
  listVersions(recordId: string): Promise<RecordVersionDto[]>;
}

export function createRecordsClient(transport: HttpTransport): RecordsClient {
  return {
    async list(query?: ListRecordsQuery): Promise<Paginated<OfficialRecordDto>> {
      const response = await transport.request<ListEnvelope<OfficialRecordDto>>({
        method: "GET",
        path: "/records",
        query,
      });
      return unwrapPaginated(response);
    },

    async create(input: CreateOfficialRecordRequest): Promise<OfficialRecordDto> {
      const response = await transport.request<
        SingleEnvelope<OfficialRecordDto>,
        CreateOfficialRecordRequest
      >({
        method: "POST",
        path: "/records",
        body: input,
      });
      return response.data;
    },

    async get(recordId: string): Promise<OfficialRecordDto> {
      const response = await transport.request<SingleEnvelope<OfficialRecordDto>>({
        method: "GET",
        path: `/records/${recordId}`,
      });
      return response.data;
    },

    async listVersions(recordId: string): Promise<RecordVersionDto[]> {
      const response = await transport.request<PlainListEnvelope<RecordVersionDto>>({
        method: "GET",
        path: `/records/${recordId}/versions`,
      });
      return response.data;
    },
  };
}
```

---

## 5. `packages/gov-client/src/modules/gazette.ts`

```ts
import { HttpTransport } from "../client/transport";

export type PublicationState =
  | "DRAFT"
  | "READY_FOR_PUBLICATION"
  | "SCHEDULED"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "RETRACTED"
  | "ARCHIVED";

export interface GazetteIssueDto {
  id: string;
  issueNumber?: string;
  title: string;
  publicationState: PublicationState;
  scheduledFor?: string;
  publishedAt?: string;
}

export interface GazetteEntryDto {
  id: string;
  gazetteIssueId: string;
  officialRecordId: string;
  titleSnapshot: string;
  summarySnapshot?: string;
  publicationOrder: number;
  publishedAt?: string;
}

export interface CreateGazetteIssueRequest {
  issueNumber?: string;
  title: string;
  scheduledFor?: string;
}

export interface PublishGazetteIssueRequest {
  note?: string;
}

export interface CreateGazetteEntryRequest {
  gazetteIssueId: string;
  officialRecordId: string;
  titleSnapshot: string;
  summarySnapshot?: string;
  publicationOrder: number;
}

interface SingleEnvelope<T> {
  data: T;
}

interface PlainListEnvelope<T> {
  data: T[];
}

export interface GazetteClient {
  listIssues(): Promise<GazetteIssueDto[]>;
  createIssue(input: CreateGazetteIssueRequest): Promise<GazetteIssueDto>;
  getIssue(issueId: string): Promise<GazetteIssueDto>;
  publishIssue(
    issueId: string,
    input?: PublishGazetteIssueRequest,
  ): Promise<GazetteIssueDto>;
  createEntry(input: CreateGazetteEntryRequest): Promise<GazetteEntryDto>;
}

export function createGazetteClient(transport: HttpTransport): GazetteClient {
  return {
    async listIssues(): Promise<GazetteIssueDto[]> {
      const response = await transport.request<PlainListEnvelope<GazetteIssueDto>>({
        method: "GET",
        path: "/gazette/issues",
      });
      return response.data;
    },

    async createIssue(input: CreateGazetteIssueRequest): Promise<GazetteIssueDto> {
      const response = await transport.request<
        SingleEnvelope<GazetteIssueDto>,
        CreateGazetteIssueRequest
      >({
        method: "POST",
        path: "/gazette/issues",
        body: input,
      });
      return response.data;
    },

    async getIssue(issueId: string): Promise<GazetteIssueDto> {
      const response = await transport.request<SingleEnvelope<GazetteIssueDto>>({
        method: "GET",
        path: `/gazette/issues/${issueId}`,
      });
      return response.data;
    },

    async publishIssue(
      issueId: string,
      input?: PublishGazetteIssueRequest,
    ): Promise<GazetteIssueDto> {
      const response = await transport.request<
        SingleEnvelope<GazetteIssueDto>,
        PublishGazetteIssueRequest | undefined
      >({
        method: "POST",
        path: `/gazette/issues/${issueId}/actions/publish`,
        body: input,
      });
      return response.data;
    },

    async createEntry(input: CreateGazetteEntryRequest): Promise<GazetteEntryDto> {
      const response = await transport.request<
        SingleEnvelope<GazetteEntryDto>,
        CreateGazetteEntryRequest
      >({
        method: "POST",
        path: "/gazette/entries",
        body: input,
      });
      return response.data;
    },
  };
}
```

---

## 6. `packages/gov-client/src/testing/mock-gov-client.ts`

```ts
import type { GovClient } from "../client/create-gov-client";
import type {
  IdentityClient,
  CurrentIdentityData,
  AuthorityContextData,
} from "../modules/identity";
import type {
  MembershipClient,
  MembershipApplicationDto,
  MemberDto,
  ListMembershipApplicationsQuery,
  ListMembersQuery,
  CreateMembershipApplicationRequest,
  StartMembershipApplicationReviewRequest,
  RequestMembershipApplicationInformationRequest,
  ApproveMembershipApplicationRequest,
  RejectMembershipApplicationRequest,
  WithdrawMembershipApplicationRequest,
  ActivateMemberRequest,
  RestrictMemberRequest,
  SuspendMemberRequest,
  ReinstateMemberRequest,
  RevokeMemberRequest,
} from "../modules/membership";
import type {
  GovernanceClient,
  GovernanceBodyDto,
  OfficeDto,
  OfficeHolderDto,
  CreateGovernanceBodyRequest,
  CreateOfficeRequest,
  AssignOfficeHolderRequest,
} from "../modules/governance";
import type {
  RolesClient,
  RoleDto,
  RoleAssignmentDto,
  DelegationDto,
  AssignRoleRequest,
  CreateDelegationRequest,
} from "../modules/roles";
import type {
  ProposalsClient,
  ProposalListItemDto,
  ProposalDetailDto,
  ProposalVersionDto,
  AmendmentDto,
  ListProposalsQuery,
  CreateProposalDraftRequest,
  CreateProposalVersionRequest,
  SetCurrentProposalVersionRequest,
  SubmitProposalRequest,
  AssignCommitteeRequest,
  CreateAmendmentRequest,
} from "../modules/proposals";
import type {
  BallotsClient,
  BallotListItemDto,
  BallotDetailDto,
  BallotEligibilityEntryDto,
  VoteDto,
  BallotTallyDto,
  ListBallotsQuery,
  CreateBallotRequest,
  CastVoteRequest,
} from "../modules/ballots";
import type {
  CertificationsClient,
  CertificationDetailDto,
  RatificationDetailDto,
  CreateCertificationRequest,
  RejectCertificationRequest,
  CreateRatificationRequest,
} from "../modules/certifications";
import type {
  RecordsClient,
  OfficialRecordDto,
  RecordVersionDto,
  ListRecordsQuery,
  CreateOfficialRecordRequest,
} from "../modules/records";
import type {
  GazetteClient,
  GazetteIssueDto,
  GazetteEntryDto,
  CreateGazetteIssueRequest,
  PublishGazetteIssueRequest,
  CreateGazetteEntryRequest,
} from "../modules/gazette";
import type { Paginated } from "../utils/pagination";

type AsyncFn<TArgs extends unknown[], TResult> = (...args: TArgs) => Promise<TResult>;

function notImplemented(name: string): never {
  throw new Error(`Mock gov client method not implemented: ${name}`);
}

export interface MockGovClientOverrides {
  identity?: Partial<IdentityClient>;
  membership?: Partial<MembershipClient>;
  governance?: Partial<GovernanceClient>;
  roles?: Partial<RolesClient>;
  proposals?: Partial<ProposalsClient>;
  ballots?: Partial<BallotsClient>;
  certifications?: Partial<CertificationsClient>;
  records?: Partial<RecordsClient>;
  gazette?: Partial<GazetteClient>;
}

export function createMockGovClient(overrides: MockGovClientOverrides = {}): GovClient {
  const identity: IdentityClient = {
    getCurrentIdentity: overrides.identity?.getCurrentIdentity ?? (async () =>
      notImplemented("identity.getCurrentIdentity")),
    getAuthorityContext: overrides.identity?.getAuthorityContext ?? (async () =>
      notImplemented("identity.getAuthorityContext")),
  };

  const membership: MembershipClient = {
    submitApplication:
      overrides.membership?.submitApplication ??
      (async (_input: CreateMembershipApplicationRequest) =>
        notImplemented("membership.submitApplication")),
    listApplications:
      overrides.membership?.listApplications ??
      (async (_query?: ListMembershipApplicationsQuery) =>
        notImplemented("membership.listApplications")),
    getApplication:
      overrides.membership?.getApplication ??
      (async (_applicationId: string) =>
        notImplemented("membership.getApplication")),
    startReview:
      overrides.membership?.startReview ??
      (async (_applicationId: string, _input?: StartMembershipApplicationReviewRequest) =>
        notImplemented("membership.startReview")),
    requestInformation:
      overrides.membership?.requestInformation ??
      (async (
        _applicationId: string,
        _input: RequestMembershipApplicationInformationRequest,
      ) => notImplemented("membership.requestInformation")),
    approve:
      overrides.membership?.approve ??
      (async (_applicationId: string, _input?: ApproveMembershipApplicationRequest) =>
        notImplemented("membership.approve")),
    reject:
      overrides.membership?.reject ??
      (async (_applicationId: string, _input?: RejectMembershipApplicationRequest) =>
        notImplemented("membership.reject")),
    withdraw:
      overrides.membership?.withdraw ??
      (async (_applicationId: string, _input?: WithdrawMembershipApplicationRequest) =>
        notImplemented("membership.withdraw")),
    listMembers:
      overrides.membership?.listMembers ??
      (async (_query?: ListMembersQuery) => notImplemented("membership.listMembers")),
    getMember:
      overrides.membership?.getMember ??
      (async (_memberId: string) => notImplemented("membership.getMember")),
    activate:
      overrides.membership?.activate ??
      (async (_memberId: string, _input?: ActivateMemberRequest) =>
        notImplemented("membership.activate")),
    restrict:
      overrides.membership?.restrict ??
      (async (_memberId: string, _input: RestrictMemberRequest) =>
        notImplemented("membership.restrict")),
    suspend:
      overrides.membership?.suspend ??
      (async (_memberId: string, _input: SuspendMemberRequest) =>
        notImplemented("membership.suspend")),
    reinstate:
      overrides.membership?.reinstate ??
      (async (_memberId: string, _input?: ReinstateMemberRequest) =>
        notImplemented("membership.reinstate")),
    revoke:
      overrides.membership?.revoke ??
      (async (_memberId: string, _input: RevokeMemberRequest) =>
        notImplemented("membership.revoke")),
  };

  const governance: GovernanceClient = {
    listBodies:
      overrides.governance?.listBodies ??
      (async () => notImplemented("governance.listBodies")),
    createBody:
      overrides.governance?.createBody ??
      (async (_input: CreateGovernanceBodyRequest) =>
        notImplemented("governance.createBody")),
    getBody:
      overrides.governance?.getBody ??
      (async (_bodyId: string) => notImplemented("governance.getBody")),
    listOffices:
      overrides.governance?.listOffices ??
      (async () => notImplemented("governance.listOffices")),
    createOffice:
      overrides.governance?.createOffice ??
      (async (_input: CreateOfficeRequest) =>
        notImplemented("governance.createOffice")),
    assignOfficeHolder:
      overrides.governance?.assignOfficeHolder ??
      (async (_officeId: string, _input: AssignOfficeHolderRequest) =>
        notImplemented("governance.assignOfficeHolder")),
  };

  const roles: RolesClient = {
    listRoles:
      overrides.roles?.listRoles ??
      (async () => notImplemented("roles.listRoles")),
    assignRole:
      overrides.roles?.assignRole ??
      (async (_input: AssignRoleRequest) => notImplemented("roles.assignRole")),
    createDelegation:
      overrides.roles?.createDelegation ??
      (async (_input: CreateDelegationRequest) =>
        notImplemented("roles.createDelegation")),
  };

  const proposals: ProposalsClient = {
    list:
      overrides.proposals?.list ??
      (async (_query?: ListProposalsQuery) => notImplemented("proposals.list")),
    get:
      overrides.proposals?.get ??
      (async (_proposalId: string) => notImplemented("proposals.get")),
    createDraft:
      overrides.proposals?.createDraft ??
      (async (_input: CreateProposalDraftRequest) =>
        notImplemented("proposals.createDraft")),
    listVersions:
      overrides.proposals?.listVersions ??
      (async (_proposalId: string) => notImplemented("proposals.listVersions")),
    createVersion:
      overrides.proposals?.createVersion ??
      (async (_proposalId: string, _input: CreateProposalVersionRequest) =>
        notImplemented("proposals.createVersion")),
    setCurrentVersion:
      overrides.proposals?.setCurrentVersion ??
      (async (_proposalId: string, _input: SetCurrentProposalVersionRequest) =>
        notImplemented("proposals.setCurrentVersion")),
    submit:
      overrides.proposals?.submit ??
      (async (_proposalId: string, _input?: SubmitProposalRequest) =>
        notImplemented("proposals.submit")),
    assignCommittee:
      overrides.proposals?.assignCommittee ??
      (async (_proposalId: string, _input: AssignCommitteeRequest) =>
        notImplemented("proposals.assignCommittee")),
    listAmendments:
      overrides.proposals?.listAmendments ??
      (async (_proposalId: string) => notImplemented("proposals.listAmendments")),
    createAmendment:
      overrides.proposals?.createAmendment ??
      (async (_proposalId: string, _input: CreateAmendmentRequest) =>
        notImplemented("proposals.createAmendment")),
  };

  const ballots: BallotsClient = {
    list:
      overrides.ballots?.list ??
      (async (_query?: ListBallotsQuery) => notImplemented("ballots.list")),
    get:
      overrides.ballots?.get ??
      (async (_ballotId: string) => notImplemented("ballots.get")),
    create:
      overrides.ballots?.create ??
      (async (_input: CreateBallotRequest) => notImplemented("ballots.create")),
    open:
      overrides.ballots?.open ??
      (async (_ballotId: string) => notImplemented("ballots.open")),
    close:
      overrides.ballots?.close ??
      (async (_ballotId: string) => notImplemented("ballots.close")),
    cancel:
      overrides.ballots?.cancel ??
      (async (_ballotId: string) => notImplemented("ballots.cancel")),
    getEligibility:
      overrides.ballots?.getEligibility ??
      (async (_ballotId: string) => notImplemented("ballots.getEligibility")),
    listVotes:
      overrides.ballots?.listVotes ??
      (async (_ballotId: string) => notImplemented("ballots.listVotes")),
    castVote:
      overrides.ballots?.castVote ??
      (async (_ballotId: string, _input: CastVoteRequest) =>
        notImplemented("ballots.castVote")),
    getTally:
      overrides.ballots?.getTally ??
      (async (_ballotId: string) => notImplemented("ballots.getTally")),
  };

  const certifications: CertificationsClient = {
    create:
      overrides.certifications?.create ??
      (async (_input: CreateCertificationRequest) =>
        notImplemented("certifications.create")),
    get:
      overrides.certifications?.get ??
      (async (_certificationId: string) => notImplemented("certifications.get")),
    certify:
      overrides.certifications?.certify ??
      (async (_certificationId: string) => notImplemented("certifications.certify")),
    reject:
      overrides.certifications?.reject ??
      (async (_certificationId: string, _input?: RejectCertificationRequest) =>
        notImplemented("certifications.reject")),
    createRatification:
      overrides.certifications?.createRatification ??
      (async (_input: CreateRatificationRequest) =>
        notImplemented("certifications.createRatification")),
  };

  const records: RecordsClient = {
    list:
      overrides.records?.list ??
      (async (_query?: ListRecordsQuery) => notImplemented("records.list")),
    create:
      overrides.records?.create ??
      (async (_input: CreateOfficialRecordRequest) =>
        notImplemented("records.create")),
    get:
      overrides.records?.get ??
      (async (_recordId: string) => notImplemented("records.get")),
    listVersions:
      overrides.records?.listVersions ??
      (async (_recordId: string) => notImplemented("records.listVersions")),
  };

  const gazette: GazetteClient = {
    listIssues:
      overrides.gazette?.listIssues ??
      (async () => notImplemented("gazette.listIssues")),
    createIssue:
      overrides.gazette?.createIssue ??
      (async (_input: CreateGazetteIssueRequest) =>
        notImplemented("gazette.createIssue")),
    getIssue:
      overrides.gazette?.getIssue ??
      (async (_issueId: string) => notImplemented("gazette.getIssue")),
    publishIssue:
      overrides.gazette?.publishIssue ??
      (async (_issueId: string, _input?: PublishGazetteIssueRequest) =>
        notImplemented("gazette.publishIssue")),
    createEntry:
      overrides.gazette?.createEntry ??
      (async (_input: CreateGazetteEntryRequest) =>
        notImplemented("gazette.createEntry")),
  };

  return {
    identity,
    membership,
    governance,
    roles,
    proposals,
    ballots,
    certifications,
    records,
    gazette,
  } as GovClient;
}

/**
 * Small helpers for common paginated mocks.
 */
export function createPaginated<T>(
  items: T[],
  page = 1,
  limit = items.length || 1,
  total = items.length,
): Paginated<T> {
  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.max(1, Math.ceil(total / Math.max(1, limit))),
  };
}
```

---

## 7. `packages/gov-client/src/client/create-gov-client.ts` (updated)

```ts
import { GovClientConfig, resolveGovClientConfig } from "./config";
import { createHttpTransport } from "./transport";
import { createIdentityClient, IdentityClient } from "../modules/identity";
import { createMembershipClient, MembershipClient } from "../modules/membership";
import { createGovernanceClient, GovernanceClient } from "../modules/governance";
import { createRolesClient, RolesClient } from "../modules/roles";
import { createProposalsClient, ProposalsClient } from "../modules/proposals";
import { createBallotsClient, BallotsClient } from "../modules/ballots";
import {
  createCertificationsClient,
  CertificationsClient,
} from "../modules/certifications";
import { createRecordsClient, RecordsClient } from "../modules/records";
import { createGazetteClient, GazetteClient } from "../modules/gazette";

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
}

export function createGovClient(config: GovClientConfig): GovClient {
  const resolved = resolveGovClientConfig(config);
  const transport = createHttpTransport(resolved);

  return {
    identity: createIdentityClient(transport),
    membership: createMembershipClient(transport),
    governance: createGovernanceClient(transport),
    roles: createRolesClient(transport),
    proposals: createProposalsClient(transport),
    ballots: createBallotsClient(transport),
    certifications: createCertificationsClient(transport),
    records: createRecordsClient(transport),
    gazette: createGazetteClient(transport),
  };
}
```

---

## 8. `packages/gov-client/src/index.ts` (updated)

```ts
export { createGovClient } from "./client/create-gov-client";
export type { GovClient } from "./client/create-gov-client";

export type { GovClientConfig, AccessTokenProvider } from "./client/config";

export {
  GovApiError,
  isGovApiError,
  toGovApiError,
} from "./client/errors";

export type {
  ProblemDetails,
  ValidationProblemDetails,
} from "./client/errors";

export type { Paginated } from "./utils/pagination";

export type {
  IdentityClient,
  CurrentIdentityData,
  AuthorityContextData,
} from "./modules/identity";

export type {
  MembershipClient,
  MembershipApplicationStatus,
  MembershipStatus,
  MembershipApplicationDto,
  MemberDto,
  ListMembershipApplicationsQuery,
  ListMembersQuery,
  CreateMembershipApplicationRequest,
  StartMembershipApplicationReviewRequest,
  RequestMembershipApplicationInformationRequest,
  ApproveMembershipApplicationRequest,
  RejectMembershipApplicationRequest,
  WithdrawMembershipApplicationRequest,
  ActivateMemberRequest,
  RestrictMemberRequest,
  SuspendMemberRequest,
  ReinstateMemberRequest,
  RevokeMemberRequest,
} from "./modules/membership";

export type {
  GovernanceClient,
  GovernanceBodyDto,
  OfficeDto,
  OfficeHolderDto,
  CreateGovernanceBodyRequest,
  CreateOfficeRequest,
  AssignOfficeHolderRequest,
} from "./modules/governance";

export type {
  RolesClient,
  RoleDto,
  RoleAssignmentDto,
  DelegationDto,
  AssignRoleRequest,
  CreateDelegationRequest,
} from "./modules/roles";

export type {
  ProposalsClient,
  ProposalType,
  ProposalStage,
  ProposalListItemDto,
  ProposalDetailDto,
  ProposalVersionDto,
  AmendmentDto,
  ListProposalsQuery,
  CreateProposalDraftRequest,
  CreateProposalVersionRequest,
  SetCurrentProposalVersionRequest,
  SubmitProposalRequest,
  AssignCommitteeRequest,
  CreateAmendmentRequest,
} from "./modules/proposals";

export type {
  BallotsClient,
  BallotState,
  VoteChoice,
  BallotListItemDto,
  BallotDetailDto,
  BallotEligibilityEntryDto,
  VoteDto,
  BallotTallyDto,
  ListBallotsQuery,
  CreateBallotRequest,
  CastVoteRequest,
} from "./modules/ballots";

export type {
  CertificationsClient,
  CertificationStatus,
  RatificationStatus,
  CertificationDetailDto,
  RatificationDetailDto,
  CreateCertificationRequest,
  RejectCertificationRequest,
  CreateRatificationRequest,
} from "./modules/certifications";

export type {
  RecordsClient,
  OfficialRecordStatus,
  OfficialRecordDto,
  RecordVersionDto,
  ListRecordsQuery,
  CreateOfficialRecordRequest,
} from "./modules/records";

export type {
  GazetteClient,
  PublicationState,
  GazetteIssueDto,
  GazetteEntryDto,
  CreateGazetteIssueRequest,
  PublishGazetteIssueRequest,
  CreateGazetteEntryRequest,
} from "./modules/gazette";

export {
  createMockGovClient,
  createPaginated,
} from "./testing/mock-gov-client";
```

---

# What Batch 2 adds

This expands the usable client surface to include:

* membership
* governance bodies and offices
* roles and delegations
* official records
* gazette/publication
* a mock gov client for tests
* updated factory and exports

# Recommended next batch

The strongest next batch is:

* `src/modules/registers.ts`
* `src/modules/rules.ts`
* `src/modules/notifications.ts`
* `src/modules/jobs.ts`
* `src/modules/audit.ts`
* update `create-gov-client.ts`
* update `index.ts`
* add `package.json`
* add `tsconfig.json`
* add `README.md`

That will complete the first coherent package shell.
