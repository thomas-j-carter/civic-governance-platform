// apps/gov-api/src/application/proposals/submit-proposal.ts

import type { ProposalDetailDto } from "./create-proposal-draft";

export interface SubmitProposalCommand {
  actor: {
    personId: string;
    memberId?: string;
  };
  proposalId: string;
  input: {
    note?: string;
  };
}

export interface SubmitProposalCommandHandler {
  execute(command: SubmitProposalCommand): Promise<ProposalDetailDto>;
}