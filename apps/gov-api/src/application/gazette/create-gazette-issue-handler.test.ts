import { describe, expect, it } from "vitest";
import { InMemoryGazetteIssueRepository } from "../../infrastructure/persistence/in-memory/in-memory-gazette-repository";
import { InMemoryAuditRepository } from "../../infrastructure/persistence/in-memory/in-memory-audit-repository";
import { AuditWriter } from "../audit/audit-writer";
import { CreateGazetteIssueHandler } from "./create-gazette-issue-handler";

describe("CreateGazetteIssueHandler", () => {
  it("creates a gazette issue", async () => {
    const repository = new InMemoryGazetteIssueRepository();
    const auditWriter = new AuditWriter(new InMemoryAuditRepository());

    const handler = new CreateGazetteIssueHandler(repository, auditWriter);

    const result = await handler.execute({
      actor: { personId: "admin-1" },
      input: {
        issueNumber: "0001",
        title: "Gazette Issue 1",
      },
    });

    expect(result.issueNumber).toBe("0001");
    expect(result.title).toBe("Gazette Issue 1");
    expect(result.publicationState).toBe("DRAFT");
  });
});
