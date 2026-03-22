// FILE: packages/gov-client/src/modules/proposals.ts

import { HttpTransport } from "../client/transport";
import { Paginated, unwrapPaginated } from "../utils/pagination";

export type ProposalType =
  | "GENERAL"
  | "RESOLUTION"
  | "ACT"
  | "AMENDMENT"
  | "APPOINTMENT"
  | "RULE_CHANGE"
  | "BUDGET"
  | "OTHER";

export type ProposalStage =
  | "DRAFT"
  | "SUBMITTED"
  | "ELIGIBILITY_REVIEW"
  | "COMMITTEE_ASSIGNED"
  | "IN_COMMITTEE"
  | "READY_FOR_READING"
  | "FIRST_READING"
  | "AMENDMENT_WINDOW"
  | "SECOND_READING"
  | "FINAL_VOTE_SCHEDULED"
  | "VOTING_OPEN"
  | "VOTING_CLOSED"
  | "RESULT_PENDING_CERTIFICATION"
  | "CERTIFIED"
  | "RATIFIED"
  | "PUBLISHED"
  | "ARCHIVED"
  | "WITHDRAWN"
  | "REJECTED";

export interface ProposalListItemDto {
  id: string;
  proposalNumber?: string;
  title: string;
  summary?: string;
  proposalType: ProposalType;
  currentStage: ProposalStage;
  proposerPersonId?: string;
  proposerMemberId?: string;
  currentVersionId?: string;
  submittedAt?: string;
  withdrawnAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProposalDetailDto extends ProposalListItemDto {}

export interface ProposalVersionDto {
  id: string;
  proposalId: string;
  versionNumber: number;
  titleSnapshot: string;
  bodyMarkdown: string;
  changeSummary?: string;
  createdByPersonId: string;
  createdAt: string;
}

export interface AmendmentDto {
  id: string;
  proposalId: string;
  title?: string;
  bodyText: string;
  status: string;
  submittedAt: string;
}

export interface ListProposalsQuery {
  page?: number;
  limit?: number;
  stage?: ProposalStage;
  proposalType?: ProposalType;
}

export interface CreateProposalDraftRequest {
  title: string;
  summary?: string;
  proposalType?: ProposalType;
  bodyMarkdown: string;
}

export interface CreateProposalVersionRequest {
  titleSnapshot: string;
  bodyMarkdown: string;
  changeSummary?: string;
}

export interface SetCurrentProposalVersionRequest {
  proposalVersionId: string;
}

export interface SubmitProposalRequest {
  note?: string;
}

export interface AssignCommitteeRequest {
  governanceBodyId: string;
}

export interface CreateAmendmentRequest {
  title?: string;
  bodyText: string;
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

export interface ProposalsClient {
  list(query?: ListProposalsQuery): Promise<Paginated<ProposalListItemDto>>;
  get(proposalId: string): Promise<ProposalDetailDto>;
  createDraft(input: CreateProposalDraftRequest): Promise<ProposalDetailDto>;
  listVersions(proposalId: string): Promise<ProposalVersionDto[]>;
  createVersion(
    proposalId: string,
    input: CreateProposalVersionRequest,
  ): Promise<ProposalVersionDto>;
  setCurrentVersion(
    proposalId: string,
    input: SetCurrentProposalVersionRequest,
  ): Promise<ProposalDetailDto>;
  submit(proposalId: string, input?: SubmitProposalRequest): Promise<ProposalDetailDto>;
  assignCommittee(
    proposalId: string,
    input: AssignCommitteeRequest,
  ): Promise<ProposalDetailDto>;
  listAmendments(proposalId: string): Promise<AmendmentDto[]>;
  createAmendment(
    proposalId: string,
    input: CreateAmendmentRequest,
  ): Promise<AmendmentDto>;
}

export function createProposalsClient(transport: HttpTransport): ProposalsClient {
  return {
    async list(query?: ListProposalsQuery): Promise<Paginated<ProposalListItemDto>> {
      const response = await transport.request<ListEnvelope<ProposalListItemDto>>({
        method: "GET",
        path: "/proposals",
        query,
      });
      return unwrapPaginated(response);
    },

    async get(proposalId: string): Promise<ProposalDetailDto> {
      const response = await transport.request<SingleEnvelope<ProposalDetailDto>>({
        method: "GET",
        path: `/proposals/${proposalId}`,
      });
      return response.data;
    },

    async createDraft(input: CreateProposalDraftRequest): Promise<ProposalDetailDto> {
      const response = await transport.request<SingleEnvelope<ProposalDetailDto>, CreateProposalDraftRequest>({
        method: "POST",
        path: "/proposals",
        body: input,
      });
      return response.data;
    },

    async listVersions(proposalId: string): Promise<ProposalVersionDto[]> {
      const response = await transport.request<PlainListEnvelope<ProposalVersionDto>>({
        method: "GET",
        path: `/proposals/${proposalId}/versions`,
      });
      return response.data;
    },

    async createVersion(
      proposalId: string,
      input: CreateProposalVersionRequest,
    ): Promise<ProposalVersionDto> {
      const response = await transport.request<
        SingleEnvelope<ProposalVersionDto>,
        CreateProposalVersionRequest
      >({
        method: "POST",
        path: `/proposals/${proposalId}/versions`,
        body: input,
      });
      return response.data;
    },

    async setCurrentVersion(
      proposalId: string,
      input: SetCurrentProposalVersionRequest,
    ): Promise<ProposalDetailDto> {
      const response = await transport.request<
        SingleEnvelope<ProposalDetailDto>,
        SetCurrentProposalVersionRequest
      >({
        method: "POST",
        path: `/proposals/${proposalId}/actions/set-current-version`,
        body: input,
      });
      return response.data;
    },

    async submit(
      proposalId: string,
      input?: SubmitProposalRequest,
    ): Promise<ProposalDetailDto> {
      const response = await transport.request<
        SingleEnvelope<ProposalDetailDto>,
        SubmitProposalRequest | undefined
      >({
        method: "POST",
        path: `/proposals/${proposalId}/actions/submit`,
        body: input,
      });
      return response.data;
    },

    async assignCommittee(
      proposalId: string,
      input: AssignCommitteeRequest,
    ): Promise<ProposalDetailDto> {
      const response = await transport.request<
        SingleEnvelope<ProposalDetailDto>,
        AssignCommitteeRequest
      >({
        method: "POST",
        path: `/proposals/${proposalId}/actions/assign-committee`,
        body: input,
      });
      return response.data;
    },

    async listAmendments(proposalId: string): Promise<AmendmentDto[]> {
      const response = await transport.request<PlainListEnvelope<AmendmentDto>>({
        method: "GET",
        path: `/proposals/${proposalId}/amendments`,
      });
      return response.data;
    },

    async createAmendment(
      proposalId: string,
      input: CreateAmendmentRequest,
    ): Promise<AmendmentDto> {
      const response = await transport.request<
        SingleEnvelope<AmendmentDto>,
        CreateAmendmentRequest
      >({
        method: "POST",
        path: `/proposals/${proposalId}/amendments`,
        body: input,
      });
      return response.data;
    },
  };
}
