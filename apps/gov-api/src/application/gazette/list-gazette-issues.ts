import type { GazetteIssueDto } from "./create-gazette-issue";

export interface ListGazetteIssuesQueryHandler {
  execute(): Promise<GazetteIssueDto[]>;
}
