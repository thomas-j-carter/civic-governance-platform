// apps/gov-api/src/application/proposals/create-proposal-draft.ts

export interface CreateProposalDraftCommand {
  actor: {
    personId: string;
    memberId?: string;
  };
  input: {
    title: string;
    summary?: string;
    proposalType?: string;
    bodyMarkdown: string;
  };
}

export interface ProposalDetailDto {
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

export interface CreateProposalDraftCommandHandler {
  execute(command: CreateProposalDraftCommand): Promise<ProposalDetailDto>;
}