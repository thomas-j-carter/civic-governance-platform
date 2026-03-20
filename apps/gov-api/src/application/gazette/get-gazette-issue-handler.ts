import type { GazetteIssueRepository } from "../../domain/gazette/gazette-repository";
import type { GazetteIssueDto } from "./create-gazette-issue";
import type { GetGazetteIssueQuery, GetGazetteIssueQueryHandler } from "./get-gazette-issue";
import { toGazetteIssueDto } from "./gazette-mappers";

export class GetGazetteIssueHandler implements GetGazetteIssueQueryHandler {
  constructor(private readonly gazetteIssueRepository: GazetteIssueRepository) {}

  async execute(query: GetGazetteIssueQuery): Promise<GazetteIssueDto | null> {
    const issue = await this.gazetteIssueRepository.getIssueById(query.issueId);
    return issue ? toGazetteIssueDto(issue) : null;
  }
}
