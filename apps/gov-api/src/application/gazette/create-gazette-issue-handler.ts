import type { GazetteIssueRepository } from "../../domain/gazette/gazette-repository";
import type { AuditWriter } from "../audit/audit-writer";
import type {
  CreateGazetteIssueCommand,
  CreateGazetteIssueCommandHandler,
  GazetteIssueDto,
} from "./create-gazette-issue";
import { toGazetteIssueDto } from "./gazette-mappers";

export class CreateGazetteIssueHandler implements CreateGazetteIssueCommandHandler {
  constructor(
    private readonly gazetteIssueRepository: GazetteIssueRepository,
    private readonly auditWriter: AuditWriter,
  ) {}

  async execute(command: CreateGazetteIssueCommand): Promise<GazetteIssueDto> {
    const now = new Date().toISOString();

    const issue = {
      id: crypto.randomUUID(),
      issueNumber: command.input.issueNumber,
      title: command.input.title,
      publicationState: (command.input.scheduledFor ? "SCHEDULED" : "DRAFT") as
        | "SCHEDULED"
        | "DRAFT",
      scheduledFor: command.input.scheduledFor,
      createdByPersonId: command.actor.personId,
      createdAt: now,
      updatedAt: now,
    };

    await this.gazetteIssueRepository.createIssue(issue);

    await this.auditWriter.write({
      actionType: "CREATE",
      entityType: "GazetteIssue",
      entityId: issue.id,
      actorPersonId: command.actor.personId,
      summary: "Gazette issue created.",
      metadata: {
        issueNumber: issue.issueNumber,
        scheduledFor: issue.scheduledFor,
      },
    });

    return toGazetteIssueDto(issue);
  }
}
