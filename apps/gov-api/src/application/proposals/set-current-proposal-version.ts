// apps/gov-api/src/application/proposals/set-current-proposal-version.ts

import type { ProposalDetailDto } from "./create-proposal-draft";

export interface SetCurrentProposalVersionCommand {
  actor: {
    personId: string;
    memberId?: string;
  };
  proposalId: string;
  input: {
    proposalVersionId: string;
  };
}

export interface SetCurrentProposalVersionCommandHandler {
  execute(command: SetCurrentProposalVersionCommand): Promise<ProposalDetailDto>;
}