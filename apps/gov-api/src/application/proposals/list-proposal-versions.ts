// apps/gov-api/src/application/proposals/list-proposal-versions.ts

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

export interface ListProposalVersionsQuery {
  proposalId: string;
}

export interface ListProposalVersionsQueryHandler {
  execute(query: ListProposalVersionsQuery): Promise<ProposalVersionDto[]>;
}