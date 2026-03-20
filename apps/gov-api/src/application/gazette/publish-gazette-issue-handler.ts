import { ConflictError, NotFoundError } from "../../http/errors";
import type {
  GazetteEntryRepository,
  GazetteIssueRepository,
} from "../../domain/gazette/gazette-repository";
import type { AuditWriter } from "../audit/audit-writer";
import type {
  PublishGazetteIssueCommand,
  PublishGazetteIssueCommandHandler,
} from "./publish-gazette-issue";
import type { GazetteIssueDto } from "./create-gazette-issue";
import { toGazetteIssueDto } from "./gazette-mappers";

export class PublishGazetteIssueHandler implements PublishGazetteIssueCommandHandler {
  constructor(
    private readonly gazetteIssueRepository: GazetteIssueRepository,
    private readonly gazetteEntryRepository: GazetteEntryRepository,
    private readonly auditWriter: AuditWriter,
  ) {}

  async execute(command: PublishGazetteIssueCommand): Promise<GazetteIssueDto> {
    const issue = await this.gazetteIssueRepository.getIssueById(command.issueId);

    if (!issue) {
      throw new NotFoundError(`Gazette issue ${command.issueId} was not found.`);
    }

    if (issue.publicationState === "PUBLISHED") {
      throw new ConflictError("Gazette issue is already published.", {
        code: "gazette_issue_already_published",
      });
    }

    const entries = await this.gazetteEntryRepository.listEntriesByIssueId(issue.id);

    if (entries.length === 0) {
      throw new ConflictError("Cannot publish a gazette issue with no entries.", {
        code: "gazette_issue_has_no_entries",
      });
    }

    issue.publicationState = "PUBLISHED";
    issue.publishedAt = command.input.publishedAt ?? new Date().toISOString();
    issue.updatedAt = new Date().toISOString();

    await this.gazetteIssueRepository.updateIssue(issue);

    await this.auditWriter.write({
      actionType: "PUBLISH",
      entityType: "GazetteIssue",
      entityId: issue.id,
      actorPersonId: command.actor.personId,
      summary: "Gazette issue published.",
      metadata: {
        note: command.input.note,
        publishedAt: issue.publishedAt,
        entryCount: entries.length,
      },
    });

    return toGazetteIssueDto(issue);
  }
}
