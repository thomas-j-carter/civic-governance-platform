## Batch 15 — final hardening pass

Progress: **96% complete**

This batch does three things:

* makes record handlers throw consistent typed HTTP problems instead of generic `Error`
* adds a publication route manifest / minimal OpenAPI source of truth
* adds the two key conflict-case end-to-end tests

### 1. `apps/gov-api/src/application/records/create-record-version-handler.ts`

Replace with:

```ts id="b15crvh"
import { ConflictError, NotFoundError } from "../../http/errors";
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type { AuditWriter } from "../audit/audit-writer";
import type {
  CreateRecordVersionCommand,
  CreateRecordVersionCommandHandler,
  RecordVersionDto,
} from "./create-record-version";
import { toRecordVersionDto } from "./record-mappers";

export class CreateRecordVersionHandler implements CreateRecordVersionCommandHandler {
  constructor(
    private readonly officialRecordRepository: OfficialRecordRepository,
    private readonly auditWriter: AuditWriter,
  ) {}

  async execute(command: CreateRecordVersionCommand): Promise<RecordVersionDto> {
    const record = await this.officialRecordRepository.getOfficialRecordById(
      command.input.officialRecordId,
    );

    if (!record) {
      throw new NotFoundError(
        `Official record ${command.input.officialRecordId} was not found.`,
      );
    }

    if (record.status === "PUBLISHED" || record.status === "ARCHIVED") {
      throw new ConflictError(
        "Cannot create a new version for a published or archived official record.",
        {
          code: "official_record_versioning_closed",
        },
      );
    }

    const latestVersionNumber =
      await this.officialRecordRepository.getLatestVersionNumberForRecord(
        command.input.officialRecordId,
      );

    const version = {
      id: crypto.randomUUID(),
      officialRecordId: command.input.officialRecordId,
      versionNumber: latestVersionNumber + 1,
      bodyMarkdown: command.input.bodyMarkdown,
      changeSummary: command.input.changeSummary,
      createdByPersonId: command.actor.personId,
      createdAt: new Date().toISOString(),
    };

    await this.officialRecordRepository.createRecordVersion(version);

    await this.auditWriter.write({
      actionType: "CREATE",
      entityType: "RecordVersion",
      entityId: version.id,
      actorPersonId: command.actor.personId,
      summary: "Official record version created.",
      metadata: {
        officialRecordId: version.officialRecordId,
        versionNumber: version.versionNumber,
      },
    });

    return toRecordVersionDto(version);
  }
}
```

---

### 2. `apps/gov-api/src/application/records/officialize-official-record-handler.ts`

Replace with:

```ts id="b15oorh"
import { ConflictError, NotFoundError } from "../../http/errors";
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type { AuditWriter } from "../audit/audit-writer";
import type {
  OfficializeOfficialRecordCommand,
  OfficializeOfficialRecordCommandHandler,
} from "./officialize-official-record";
import type { OfficialRecordDto } from "./create-official-record";
import { toOfficialRecordDto } from "./record-mappers";

export class OfficializeOfficialRecordHandler implements OfficializeOfficialRecordCommandHandler {
  constructor(
    private readonly officialRecordRepository: OfficialRecordRepository,
    private readonly auditWriter: AuditWriter,
  ) {}

  async execute(
    command: OfficializeOfficialRecordCommand,
  ): Promise<OfficialRecordDto | null> {
    const record = await this.officialRecordRepository.getOfficialRecordById(command.recordId);

    if (!record) {
      throw new NotFoundError(`Official record ${command.recordId} was not found.`);
    }

    if (record.status !== "DRAFT") {
      throw new ConflictError(
        `Official record ${command.recordId} cannot be officialized from ${record.status}.`,
        {
          code: "official_record_invalid_state_transition",
        },
      );
    }

    const versions = await this.officialRecordRepository.listRecordVersionsForRecord(
      command.recordId,
    );

    if (versions.length === 0) {
      throw new ConflictError(
        "Cannot officialize an official record that has no record versions.",
        {
          code: "official_record_has_no_versions",
        },
      );
    }

    const officializedRecord = {
      ...record,
      status: "OFFICIAL" as const,
      officializedAt: command.input.officializedAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.officialRecordRepository.updateOfficialRecord(officializedRecord);

    await this.auditWriter.write({
      actionType: "APPROVE",
      entityType: "OfficialRecord",
      entityId: officializedRecord.id,
      actorPersonId: command.actor.personId,
      summary: "Official record officialized.",
      metadata: {
        officializedAt: officializedRecord.officializedAt,
        note: command.input.note,
        versionCount: versions.length,
      },
    });

    return toOfficialRecordDto(officializedRecord);
  }
}
```

---

### 3. `apps/gov-api/src/routes/official-records.ts`

Update the `officialize` endpoint block to remove the now-unneeded null check:

```ts id="b15orrt"
  app.post(
    "/:recordId/actions/officialize",
    requireAuth,
    requireAuthority("record.officialize"),
    async (c) => {
      const appContext = c.get("appContext");
      const actor = c.get("requestContext").actor!;
      const recordId = c.req.param("recordId");
      const body = await c.req.json<{ note?: string; officializedAt?: string }>().catch(() => ({}));

      const result = await appContext.handlers.records.officialize.execute({
        actor: { personId: actor.personId },
        recordId,
        input: {
          note: body.note,
          officializedAt: body.officializedAt,
        },
      });

      return c.json(jsonData(result), 200);
    },
  );
```

---

### 4. `apps/gov-api/src/openapi/publication-openapi.ts`

```ts id="b15openapi"
export const publicationOpenApiDocument = {
  openapi: "3.1.0",
  info: {
    title: "Ardtire Governance API — Publication Surface",
    version: "0.1.0",
    description:
      "Publication and official-record endpoints for the Ardtire Society Civic Digital Governance Platform.",
  },
  tags: [
    { name: "Official Records" },
    { name: "Gazette" },
  ],
  paths: {
    "/healthz": {
      get: {
        summary: "Health check",
        responses: {
          "200": {
            description: "Service health payload",
          },
        },
      },
    },
    "/official-records": {
      get: {
        tags: ["Official Records"],
        summary: "List official records",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Official record collection" },
        },
      },
      post: {
        tags: ["Official Records"],
        summary: "Create official record draft",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Official record created" },
          "422": { description: "Validation problem" },
        },
      },
    },
    "/official-records/{recordId}": {
      get: {
        tags: ["Official Records"],
        summary: "Get official record detail",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Official record detail" },
          "404": { description: "Record not found" },
        },
      },
    },
    "/official-records/{recordId}/versions": {
      get: {
        tags: ["Official Records"],
        summary: "List record versions",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Record version collection" },
        },
      },
      post: {
        tags: ["Official Records"],
        summary: "Create record version",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Record version created" },
          "404": { description: "Record not found" },
          "409": { description: "Versioning closed" },
        },
      },
    },
    "/official-records/{recordId}/actions/officialize": {
      post: {
        tags: ["Official Records"],
        summary: "Officialize record",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Record officialized" },
          "404": { description: "Record not found" },
          "409": { description: "Record cannot be officialized" },
        },
      },
    },
    "/gazette/issues": {
      get: {
        tags: ["Gazette"],
        summary: "List gazette issues",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Gazette issue collection" },
        },
      },
      post: {
        tags: ["Gazette"],
        summary: "Create gazette issue",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Gazette issue created" },
        },
      },
    },
    "/gazette/issues/{issueId}": {
      get: {
        tags: ["Gazette"],
        summary: "Get gazette issue detail",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Gazette issue detail" },
          "404": { description: "Issue not found" },
        },
      },
    },
    "/gazette/issues/{gazetteIssueId}/entries": {
      get: {
        tags: ["Gazette"],
        summary: "List gazette entries",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Gazette entry collection" },
        },
      },
      post: {
        tags: ["Gazette"],
        summary: "Add official record to gazette issue",
        security: [{ bearerAuth: [] }],
        responses: {
          "201": { description: "Gazette entry created" },
          "404": { description: "Issue or record not found" },
          "409": { description: "Record not eligible or duplicate entry" },
        },
      },
    },
    "/gazette/issues/{issueId}/actions/publish": {
      post: {
        tags: ["Gazette"],
        summary: "Publish gazette issue",
        security: [{ bearerAuth: [] }],
        responses: {
          "200": { description: "Gazette issue published" },
          "404": { description: "Issue not found" },
          "409": { description: "Issue has no entries or already published" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
} as const;
```

---

### 5. `apps/gov-api/src/openapi/publication-route-manifest.ts`

```ts id="b15manifest"
export const publicationRouteManifest = [
  {
    method: "GET",
    path: "/healthz",
    authority: null,
    description: "Service health check",
  },
  {
    method: "GET",
    path: "/official-records",
    authority: "record.read",
    description: "List official records",
  },
  {
    method: "POST",
    path: "/official-records",
    authority: "record.create",
    description: "Create official record draft",
  },
  {
    method: "GET",
    path: "/official-records/:recordId",
    authority: "record.read",
    description: "Get official record detail",
  },
  {
    method: "GET",
    path: "/official-records/:recordId/versions",
    authority: "record.version.read",
    description: "List record versions",
  },
  {
    method: "POST",
    path: "/official-records/:recordId/versions",
    authority: "record.version.create",
    description: "Create record version",
  },
  {
    method: "POST",
    path: "/official-records/:recordId/actions/officialize",
    authority: "record.officialize",
    description: "Officialize record",
  },
  {
    method: "GET",
    path: "/gazette/issues",
    authority: "gazette.issue.read",
    description: "List gazette issues",
  },
  {
    method: "POST",
    path: "/gazette/issues",
    authority: "gazette.issue.create",
    description: "Create gazette issue",
  },
  {
    method: "GET",
    path: "/gazette/issues/:issueId",
    authority: "gazette.issue.read",
    description: "Get gazette issue detail",
  },
  {
    method: "GET",
    path: "/gazette/issues/:gazetteIssueId/entries",
    authority: "gazette.entry.read",
    description: "List gazette issue entries",
  },
  {
    method: "POST",
    path: "/gazette/issues/:gazetteIssueId/entries",
    authority: "gazette.entry.create",
    description: "Add official record to gazette issue",
  },
  {
    method: "POST",
    path: "/gazette/issues/:issueId/actions/publish",
    authority: "gazette.issue.publish",
    description: "Publish gazette issue",
  },
] as const;
```

---

### 6. `apps/gov-api/src/application/records/officialize-official-record-handler.test.ts`

Replace with:

```ts id="b15oorht"
import { describe, expect, it } from "vitest";
import { ConflictError } from "../../http/errors";
import { InMemoryOfficialRecordRepository } from "../../infrastructure/persistence/in-memory/in-memory-official-record-repository";
import { InMemoryAuditRepository } from "../../infrastructure/persistence/in-memory/in-memory-audit-repository";
import { AuditWriter } from "../audit/audit-writer";
import { CreateOfficialRecordHandler } from "./create-official-record-handler";
import { CreateRecordVersionHandler } from "./create-record-version-handler";
import { OfficializeOfficialRecordHandler } from "./officialize-official-record-handler";

describe("OfficializeOfficialRecordHandler", () => {
  it("officializes a draft record that has at least one version", async () => {
    const repository = new InMemoryOfficialRecordRepository();
    const auditWriter = new AuditWriter(new InMemoryAuditRepository());

    const createRecordHandler = new CreateOfficialRecordHandler(repository, auditWriter);
    const createVersionHandler = new CreateRecordVersionHandler(repository, auditWriter);
    const officializeHandler = new OfficializeOfficialRecordHandler(repository, auditWriter);

    const record = await createRecordHandler.execute({
      actor: { personId: "admin-1" },
      input: {
        recordType: "ACT",
        title: "Act I",
        summary: "Founding act",
        sourceEntityType: "Proposal",
        sourceEntityId: "proposal-1",
      },
    });

    await createVersionHandler.execute({
      actor: { personId: "admin-1" },
      input: {
        officialRecordId: record.id,
        bodyMarkdown: "# Act I\n\nFounding text",
        changeSummary: "Initial text",
      },
    });

    const result = await officializeHandler.execute({
      actor: { personId: "admin-1" },
      recordId: record.id,
      input: {
        note: "Approved by registrar.",
      },
    });

    expect(result?.status).toBe("OFFICIAL");
    expect(result?.officializedAt).toBeTruthy();
  });

  it("rejects officialization when the record has no versions", async () => {
    const repository = new InMemoryOfficialRecordRepository();
    const auditWriter = new AuditWriter(new InMemoryAuditRepository());

    const createRecordHandler = new CreateOfficialRecordHandler(repository, auditWriter);
    const officializeHandler = new OfficializeOfficialRecordHandler(repository, auditWriter);

    const record = await createRecordHandler.execute({
      actor: { personId: "admin-1" },
      input: {
        recordType: "ACT",
        title: "Act I",
        summary: "Founding act",
        sourceEntityType: "Proposal",
        sourceEntityId: "proposal-1",
      },
    });

    await expect(
      officializeHandler.execute({
        actor: { personId: "admin-1" },
        recordId: record.id,
        input: {
          note: "Approved by registrar.",
        },
      }),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
```

---

### 7. `apps/gov-api/src/app-publication.e2e.test.ts`

Append these two tests:

```ts id="b15e2e"
  it("rejects adding a non-official record to a gazette issue", async () => {
    const app = createPublicationApp({
      appContext: createTestAppContext(),
    });

    const createRecordRes = await app.request("http://localhost/official-records", {
      method: "POST",
      headers: authHeaders({
        "content-type": "application/json",
        "idempotency-key": "idem-record-create-draft-only",
      }),
      body: JSON.stringify({
        recordType: "ACT",
        title: "Draft-only Act",
        summary: "Still draft",
        sourceEntityType: "Proposal",
        sourceEntityId: "proposal-draft-only",
      }),
    });

    expect(createRecordRes.status).toBe(201);
    const createRecordBody = await createRecordRes.json();
    const recordId = createRecordBody.data.id as string;

    const createIssueRes = await app.request("http://localhost/gazette/issues", {
      method: "POST",
      headers: authHeaders({
        "content-type": "application/json",
        "idempotency-key": "idem-issue-create-draft-only",
      }),
      body: JSON.stringify({
        issueNumber: "0002",
        title: "Issue 2",
      }),
    });

    expect(createIssueRes.status).toBe(201);
    const createIssueBody = await createIssueRes.json();
    const issueId = createIssueBody.data.id as string;

    const addEntryRes = await app.request(
      `http://localhost/gazette/issues/${issueId}/entries`,
      {
        method: "POST",
        headers: authHeaders({
          "content-type": "application/json",
          "idempotency-key": "idem-entry-create-draft-only",
        }),
        body: JSON.stringify({
          officialRecordId: recordId,
        }),
      },
    );

    expect(addEntryRes.status).toBe(409);
    const body = await addEntryRes.json();
    expect(body.code).toBe("official_record_not_officialized");
  });

  it("rejects publishing a gazette issue with no entries", async () => {
    const app = createPublicationApp({
      appContext: createTestAppContext(),
    });

    const createIssueRes = await app.request("http://localhost/gazette/issues", {
      method: "POST",
      headers: authHeaders({
        "content-type": "application/json",
        "idempotency-key": "idem-issue-create-empty",
      }),
      body: JSON.stringify({
        issueNumber: "0003",
        title: "Issue 3",
      }),
    });

    expect(createIssueRes.status).toBe(201);
    const createIssueBody = await createIssueRes.json();
    const issueId = createIssueBody.data.id as string;

    const publishIssueRes = await app.request(
      `http://localhost/gazette/issues/${issueId}/actions/publish`,
      {
        method: "POST",
        headers: authHeaders({
          "content-type": "application/json",
        }),
        body: JSON.stringify({
          note: "Attempted empty publication.",
        }),
      },
    );

    expect(publishIssueRes.status).toBe(409);
    const body = await publishIssueRes.json();
    expect(body.code).toBe("gazette_issue_has_no_entries");
  });
```

## What this finishes

This hardens the publication surface so the most important legal/process invariants now have explicit enforcement:

* you cannot officialize a record with no text/version content
* you cannot add a merely draft record to a gazette issue
* you cannot publish an empty gazette issue
* handler failures now use typed HTTP problems instead of generic errors
* the publication endpoints now have a small explicit OpenAPI + route manifest source of truth

## What remains

At this point, what remains is mostly polish/integration rather than core architecture.

The major remaining work is:

* unify the older and newer `gov-api` slices beyond the publication surface
* broaden end-to-end coverage across proposals → ballots → certifications → records → gazette
* frontend integration and typed consumption of the publication endpoints
* deployment/ops hardening

If you want, the next batch should be the **cross-slice integration pass** so proposal certification can automatically create the corresponding official record and enqueue/promote it toward gazette publication.
