// apps/gov-api/src/application/proposals/assign-committee.ts

import type { ProposalDetailDto } from "./create-proposal-draft";

export interface AssignCommitteeCommand {
  actor: {
    personId: string;
    memberId?: string;
  };
  proposalId: string;
  input: {
    governanceBodyId: string;
  };
}

export interface AssignCommitteeCommandHandler {
  execute(command: AssignCommitteeCommand): Promise<ProposalDetailDto>;
}