export interface GazetteIssueDto {
  id: string;
  issueNumber?: string;
  title: string;
  publicationState: string;
  scheduledFor?: string;
  publishedAt?: string;
  createdByPersonId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGazetteIssueCommand {
  actor: {
    personId: string;
  };
  input: {
    issueNumber?: string;
    title: string;
    scheduledFor?: string;
  };
}

export interface CreateGazetteIssueCommandHandler {
  execute(command: CreateGazetteIssueCommand): Promise<GazetteIssueDto>;
}
