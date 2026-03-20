import type { GazetteIssueDto } from "./create-gazette-issue";

export interface PublishGazetteIssueCommand {
  actor: {
    personId: string;
  };
  issueId: string;
  input: {
    note?: string;
    publishedAt?: string;
  };
}

export interface PublishGazetteIssueCommandHandler {
  execute(command: PublishGazetteIssueCommand): Promise<GazetteIssueDto>;
}
