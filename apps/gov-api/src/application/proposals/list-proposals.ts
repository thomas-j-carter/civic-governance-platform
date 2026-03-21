// apps/gov-api/src/application/proposals/list-proposals.ts

import type { PageInput, PageResult } from "../shared/pagination";

export interface ProposalListItemDto {
  id: string;
  proposalNumber?: string;
  title: string;
  summary?: string;
  proposalType: string;
  currentStage: string;
  proposerPersonId?: string;
  proposerMemberId?: string;
  currentVersionId?: string;
  submittedAt?: string;
  withdrawnAt?: string;
  rejectedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListProposalsQuery {
  page: PageInput;
  filters: {
    stage?: string;
    proposalType?: string;
  };
}

export interface ListProposalsQueryHandler {
  execute(query: ListProposalsQuery): Promise<PageResult<ProposalListItemDto>>;
}