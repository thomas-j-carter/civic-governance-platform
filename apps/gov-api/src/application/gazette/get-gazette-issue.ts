import type { GazetteIssueDto } from "./create-gazette-issue";

export interface GetGazetteIssueQuery {
  issueId: string;
}

export interface GetGazetteIssueQueryHandler {
  execute(query: GetGazetteIssueQuery): Promise<GazetteIssueDto | null>;
}
