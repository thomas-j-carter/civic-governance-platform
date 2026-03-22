// FILE: packages/gov-client/src/modules/ballots.ts

import { HttpTransport } from "../client/transport";
import { Paginated, unwrapPaginated } from "../utils/pagination";

export type BallotState =
  | "DRAFT"
  | "SCHEDULED"
  | "OPEN"
  | "CLOSED"
  | "TALLYING"
  | "RESULT_COMPUTED"
  | "EXPIRED"
  | "CANCELLED";

export type VoteChoice = "YES" | "NO" | "ABSTAIN";

export interface BallotListItemDto {
  id: string;
  proposalId?: string;
  title: string;
  description?: string;
  state: BallotState;
  scheduledOpenAt?: string;
  openedAt?: string;
  scheduledCloseAt?: string;
  closedAt?: string;
  cancelledAt?: string;
}

export interface BallotDetailDto extends BallotListItemDto {}

export interface BallotEligibilityEntryDto {
  ballotId: string;
  memberId: string;
  eligibilityStatus: "ELIGIBLE" | "INELIGIBLE";
  reason?: string;
  snapshotAt: string;
}

export interface VoteDto {
  id: string;
  ballotId: string;
  memberId: string;
  choice: VoteChoice;
  castAt: string;
}

export interface BallotTallyDto {
  ballotId: string;
  yesCount: number;
  noCount: number;
  abstainCount: number;
  totalCount: number;
  quorumMet: boolean;
  thresholdMet: boolean;
  computedAt: string;
}

export interface ListBallotsQuery {
  page?: number;
  limit?: number;
  state?: BallotState;
}

export interface CreateBallotRequest {
  proposalId?: string;
  title: string;
  description?: string;
  scheduledOpenAt?: string;
  scheduledCloseAt?: string;
}

export interface CastVoteRequest {
  choice: VoteChoice;
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

export interface BallotsClient {
  list(query?: ListBallotsQuery): Promise<Paginated<BallotListItemDto>>;
  get(ballotId: string): Promise<BallotDetailDto>;
  create(input: CreateBallotRequest): Promise<BallotDetailDto>;
  open(ballotId: string): Promise<BallotDetailDto>;
  close(ballotId: string): Promise<BallotDetailDto>;
  cancel(ballotId: string): Promise<BallotDetailDto>;
  getEligibility(ballotId: string): Promise<BallotEligibilityEntryDto[]>;
  listVotes(ballotId: string): Promise<VoteDto[]>;
  castVote(ballotId: string, input: CastVoteRequest): Promise<VoteDto>;
  getTally(ballotId: string): Promise<BallotTallyDto>;
}

export function createBallotsClient(transport: HttpTransport): BallotsClient {
  return {
    async list(query?: ListBallotsQuery): Promise<Paginated<BallotListItemDto>> {
      const response = await transport.request<ListEnvelope<BallotListItemDto>>({
        method: "GET",
        path: "/ballots",
        query,
      });
      return unwrapPaginated(response);
    },

    async get(ballotId: string): Promise<BallotDetailDto> {
      const response = await transport.request<SingleEnvelope<BallotDetailDto>>({
        method: "GET",
        path: `/ballots/${ballotId}`,
      });
      return response.data;
    },

    async create(input: CreateBallotRequest): Promise<BallotDetailDto> {
      const response = await transport.request<SingleEnvelope<BallotDetailDto>, CreateBallotRequest>({
        method: "POST",
        path: "/ballots",
        body: input,
      });
      return response.data;
    },

    async open(ballotId: string): Promise<BallotDetailDto> {
      const response = await transport.request<SingleEnvelope<BallotDetailDto>>({
        method: "POST",
        path: `/ballots/${ballotId}/actions/open`,
      });
      return response.data;
    },

    async close(ballotId: string): Promise<BallotDetailDto> {
      const response = await transport.request<SingleEnvelope<BallotDetailDto>>({
        method: "POST",
        path: `/ballots/${ballotId}/actions/close`,
      });
      return response.data;
    },

    async cancel(ballotId: string): Promise<BallotDetailDto> {
      const response = await transport.request<SingleEnvelope<BallotDetailDto>>({
        method: "POST",
        path: `/ballots/${ballotId}/actions/cancel`,
      });
      return response.data;
    },

    async getEligibility(ballotId: string): Promise<BallotEligibilityEntryDto[]> {
      const response = await transport.request<PlainListEnvelope<BallotEligibilityEntryDto>>({
        method: "GET",
        path: `/ballots/${ballotId}/eligibility`,
      });
      return response.data;
    },

    async listVotes(ballotId: string): Promise<VoteDto[]> {
      const response = await transport.request<PlainListEnvelope<VoteDto>>({
        method: "GET",
        path: `/ballots/${ballotId}/votes`,
      });
      return response.data;
    },

    async castVote(ballotId: string, input: CastVoteRequest): Promise<VoteDto> {
      const response = await transport.request<SingleEnvelope<VoteDto>, CastVoteRequest>({
        method: "POST",
        path: `/ballots/${ballotId}/votes`,
        body: input,
      });
      return response.data;
    },

    async getTally(ballotId: string): Promise<BallotTallyDto> {
      const response = await transport.request<SingleEnvelope<BallotTallyDto>>({
        method: "GET",
        path: `/ballots/${ballotId}/tally`,
      });
      return response.data;
    },
  };
}