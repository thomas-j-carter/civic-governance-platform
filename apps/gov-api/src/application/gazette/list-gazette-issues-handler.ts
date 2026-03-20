import type { GazetteIssueRepository } from "../../domain/gazette/gazette-repository";
import type { GazetteIssueDto } from "./create-gazette-issue";
import type { ListGazetteIssuesQueryHandler } from "./list-gazette-issues";
import { toGazetteIssueDto } from "./gazette-mappers";

export class ListGazetteIssuesHandler implements ListGazetteIssuesQueryHandler {
  constructor(private readonly gazetteIssueRepository: GazetteIssueRepository) {}

  async execute(): Promise<GazetteIssueDto[]> {
    const issues = await this.gazetteIssueRepository.listIssues();
    return issues.map(toGazetteIssueDto);
  }
}
