import type { GazetteIssue } from "../../domain/gazette/gazette-issue";
import type { GazetteEntry } from "../../domain/gazette/gazette-entry";
import type { GazetteIssueDto } from "./create-gazette-issue";
import type { GazetteEntryDto } from "./add-record-to-gazette-issue";

export function toGazetteIssueDto(issue: GazetteIssue): GazetteIssueDto {
  return {
    id: issue.id,
    issueNumber: issue.issueNumber,
    title: issue.title,
    publicationState: issue.publicationState,
    scheduledFor: issue.scheduledFor,
    publishedAt: issue.publishedAt,
    createdByPersonId: issue.createdByPersonId,
    createdAt: issue.createdAt,
    updatedAt: issue.updatedAt,
  };
}

export function toGazetteEntryDto(entry: GazetteEntry): GazetteEntryDto {
  return {
    id: entry.id,
    gazetteIssueId: entry.gazetteIssueId,
    officialRecordId: entry.officialRecordId,
    titleSnapshot: entry.titleSnapshot,
    summarySnapshot: entry.summarySnapshot,
    publicationOrder: entry.publicationOrder,
    publishedAt: entry.publishedAt,
    createdAt: entry.createdAt,
  };
}
