// apps/gov-api/src/application/proposals/create-proposal-version.ts

import type { ProposalVersionDto } from "./list-proposal-versions";

export interface CreateProposalVersionCommand {
  actor: {
    personId: string;
    memberId?: string;
  };
  proposalId: string;
  input: {
    titleSnapshot: string;
    bodyMarkdown: string;
    changeSummary?: string;
  };
}

export interface CreateProposalVersionCommandHandler {
  execute(command: CreateProposalVersionCommand): Promise<ProposalVersionDto>;
}