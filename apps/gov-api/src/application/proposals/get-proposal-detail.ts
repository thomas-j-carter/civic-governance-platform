// apps/gov-api/src/application/proposals/get-proposal-detail.ts

import type { ProposalDetailDto } from "./create-proposal-draft";

export interface GetProposalDetailQuery {
  proposalId: string;
}

export interface GetProposalDetailQueryHandler {
  execute(query: GetProposalDetailQuery): Promise<ProposalDetailDto | null>;
}