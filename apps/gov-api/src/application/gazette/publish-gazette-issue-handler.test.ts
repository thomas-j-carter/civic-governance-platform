import { describe, expect, it } from "vitest";
import {
  InMemoryGazetteIssueRepository,
  InMemoryGazetteEntryRepository,
} from "../../infrastructure/persistence/in-memory/in-memory-gazette-repository";
import { InMemoryAuditRepository } from "../../infrastructure/persistence/in-memory/in-memory-audit-repository";
import { AuditWriter } from "../audit/audit-writer";
import { PublishGazetteIssueHandler } from "./publish-gazette-issue-handler";

describe("PublishGazetteIssueHandler", () => {
  it("publishes a gazette issue with entries", async () => {
    const issueRepository = new InMemoryGazetteIssueRepository();
    const entryRepository = new InMemoryGazetteEntryRepository();
    const auditWriter = new AuditWriter(new InMemoryAuditRepository());

    await issueRepository.createIssue({
      id: "issue-1",
      issueNumber: "0001",
      title: "Issue 1",
      publicationState: "DRAFT",
      createdByPersonId: "person-1",
      createdAt: "2026-01-01T00:00:00.000Z",
      updatedAt: "2026-01-01T00:00:00.000Z",
    });

    await entryRepository.createEntry({
      id: "entry-1",
      gazetteIssueId: "issue-1",
      officialRecordId: "record-1",
      titleSnapshot: "Act I",
      publicationOrder: 1,
      createdAt: "2026-01-02T00:00:00.000Z",
    });

    const handler = new PublishGazetteIssueHandler(
      issueRepository,
      entryRepository,
      auditWriter,
    );

    const result = await handler.execute({
      actor: { personId: "admin-1" },
      issueId: "issue-1",
      input: {},
    });

    expect(result.publicationState).toBe("PUBLISHED");
    expect(result.publishedAt).toBeTruthy();
  });
});
