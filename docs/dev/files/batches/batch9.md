## Batch 9 — official records + gazette-connected publication layer

### 1. `apps/gov-api/src/domain/records/official-record.ts`

```ts id="8y8o3q"
export type OfficialRecordStatus =
  | "DRAFT"
  | "OFFICIAL"
  | "PUBLISHED"
  | "SUPERSEDED"
  | "ARCHIVED";

export interface OfficialRecord {
  id: string;
  recordType: string;
  title: string;
  summary?: string;
  sourceEntityType: string;
  sourceEntityId: string;
  status: OfficialRecordStatus;
  officializedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. `apps/gov-api/src/domain/records/record-version.ts`

```ts id="db4s3x"
export interface RecordVersion {
  id: string;
  officialRecordId: string;
  versionNumber: number;
  bodyMarkdown: string;
  changeSummary?: string;
  createdByPersonId?: string;
  createdAt: string;
}
```

### 3. `apps/gov-api/src/domain/records/official-record-repository.ts`

```ts id="u9xtl3"
import type { OfficialRecord } from "./official-record";
import type { RecordVersion } from "./record-version";

export interface OfficialRecordRepository {
  createOfficialRecord(record: OfficialRecord): Promise<void>;
  getOfficialRecordById(recordId: string): Promise<OfficialRecord | null>;
  listOfficialRecords(): Promise<OfficialRecord[]>;
  updateOfficialRecord(record: OfficialRecord): Promise<void>;

  createRecordVersion(version: RecordVersion): Promise<void>;
  listRecordVersionsForRecord(recordId: string): Promise<RecordVersion[]>;
  getLatestVersionNumberForRecord(recordId: string): Promise<number>;
}
```

### 4. `apps/gov-api/src/application/records/create-official-record.ts`

```ts id="jlwmqs"
export interface OfficialRecordDto {
  id: string;
  recordType: string;
  title: string;
  summary?: string;
  sourceEntityType: string;
  sourceEntityId: string;
  status: string;
  officializedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOfficialRecordCommand {
  actor: {
    personId: string;
  };
  input: {
    recordType: string;
    title: string;
    summary?: string;
    sourceEntityType: string;
    sourceEntityId: string;
  };
}

export interface CreateOfficialRecordCommandHandler {
  execute(command: CreateOfficialRecordCommand): Promise<OfficialRecordDto>;
}
```

### 5. `apps/gov-api/src/application/records/get-official-record.ts`

```ts id="1cmf97"
import type { OfficialRecordDto } from "./create-official-record";

export interface GetOfficialRecordQuery {
  recordId: string;
}

export interface GetOfficialRecordQueryHandler {
  execute(query: GetOfficialRecordQuery): Promise<OfficialRecordDto | null>;
}
```

### 6. `apps/gov-api/src/application/records/list-official-records.ts`

```ts id="w1egx3"
import type { OfficialRecordDto } from "./create-official-record";

export interface ListOfficialRecordsQueryHandler {
  execute(): Promise<OfficialRecordDto[]>;
}
```

### 7. `apps/gov-api/src/application/records/create-record-version.ts`

```ts id="lw4q4m"
export interface RecordVersionDto {
  id: string;
  officialRecordId: string;
  versionNumber: number;
  bodyMarkdown: string;
  changeSummary?: string;
  createdByPersonId?: string;
  createdAt: string;
}

export interface CreateRecordVersionCommand {
  actor: {
    personId: string;
  };
  input: {
    officialRecordId: string;
    bodyMarkdown: string;
    changeSummary?: string;
  };
}

export interface CreateRecordVersionCommandHandler {
  execute(command: CreateRecordVersionCommand): Promise<RecordVersionDto>;
}
```

### 8. `apps/gov-api/src/application/records/list-record-versions.ts`

```ts id="g4wzmu"
import type { RecordVersionDto } from "./create-record-version";

export interface ListRecordVersionsQuery {
  officialRecordId: string;
}

export interface ListRecordVersionsQueryHandler {
  execute(query: ListRecordVersionsQuery): Promise<RecordVersionDto[]>;
}
```

### 9. `apps/gov-api/src/application/records/officialize-official-record.ts`

```ts id="xy9nvg"
import type { OfficialRecordDto } from "./create-official-record";

export interface OfficializeOfficialRecordCommand {
  actor: {
    personId: string;
  };
  recordId: string;
  input: {
    note?: string;
    officializedAt?: string;
  };
}

export interface OfficializeOfficialRecordCommandHandler {
  execute(command: OfficializeOfficialRecordCommand): Promise<OfficialRecordDto | null>;
}
```

### 10. `apps/gov-api/src/application/records/record-mappers.ts`

```ts id="92r7wk"
import type { OfficialRecord } from "../../domain/records/official-record";
import type { RecordVersion } from "../../domain/records/record-version";
import type { OfficialRecordDto } from "./create-official-record";
import type { RecordVersionDto } from "./create-record-version";

export function toOfficialRecordDto(record: OfficialRecord): OfficialRecordDto {
  return {
    id: record.id,
    recordType: record.recordType,
    title: record.title,
    summary: record.summary,
    sourceEntityType: record.sourceEntityType,
    sourceEntityId: record.sourceEntityId,
    status: record.status,
    officializedAt: record.officializedAt,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

export function toRecordVersionDto(version: RecordVersion): RecordVersionDto {
  return {
    id: version.id,
    officialRecordId: version.officialRecordId,
    versionNumber: version.versionNumber,
    bodyMarkdown: version.bodyMarkdown,
    changeSummary: version.changeSummary,
    createdByPersonId: version.createdByPersonId,
    createdAt: version.createdAt,
  };
}
```

### 11. `apps/gov-api/src/application/records/create-official-record-handler.ts`

```ts id="3zby19"
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type { AuditWriter } from "../audit/audit-writer";
import type {
  CreateOfficialRecordCommand,
  CreateOfficialRecordCommandHandler,
  OfficialRecordDto,
} from "./create-official-record";
import { toOfficialRecordDto } from "./record-mappers";

export class CreateOfficialRecordHandler implements CreateOfficialRecordCommandHandler {
  constructor(
    private readonly officialRecordRepository: OfficialRecordRepository,
    private readonly auditWriter: AuditWriter,
  ) {}

  async execute(command: CreateOfficialRecordCommand): Promise<OfficialRecordDto> {
    const now = new Date().toISOString();

    const record = {
      id: crypto.randomUUID(),
      recordType: command.input.recordType,
      title: command.input.title,
      summary: command.input.summary,
      sourceEntityType: command.input.sourceEntityType,
      sourceEntityId: command.input.sourceEntityId,
      status: "DRAFT" as const,
      createdAt: now,
      updatedAt: now,
    };

    await this.officialRecordRepository.createOfficialRecord(record);

    await this.auditWriter.write({
      actionType: "CREATE",
      entityType: "OfficialRecord",
      entityId: record.id,
      actorPersonId: command.actor.personId,
      summary: "Official record created.",
      metadata: {
        recordType: record.recordType,
        sourceEntityType: record.sourceEntityType,
        sourceEntityId: record.sourceEntityId,
      },
    });

    return toOfficialRecordDto(record);
  }
}
```

### 12. `apps/gov-api/src/application/records/get-official-record-handler.ts`

```ts id="7qejpr"
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type {
  GetOfficialRecordQuery,
  GetOfficialRecordQueryHandler,
} from "./get-official-record";
import type { OfficialRecordDto } from "./create-official-record";
import { toOfficialRecordDto } from "./record-mappers";

export class GetOfficialRecordHandler implements GetOfficialRecordQueryHandler {
  constructor(private readonly officialRecordRepository: OfficialRecordRepository) {}

  async execute(query: GetOfficialRecordQuery): Promise<OfficialRecordDto | null> {
    const record = await this.officialRecordRepository.getOfficialRecordById(query.recordId);
    return record ? toOfficialRecordDto(record) : null;
  }
}
```

### 13. `apps/gov-api/src/application/records/list-official-records-handler.ts`

```ts id="m5tbjlwm"
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type { OfficialRecordDto } from "./create-official-record";
import type { ListOfficialRecordsQueryHandler } from "./list-official-records";
import { toOfficialRecordDto } from "./record-mappers";

export class ListOfficialRecordsHandler implements ListOfficialRecordsQueryHandler {
  constructor(private readonly officialRecordRepository: OfficialRecordRepository) {}

  async execute(): Promise<OfficialRecordDto[]> {
    const records = await this.officialRecordRepository.listOfficialRecords();
    return records.map(toOfficialRecordDto);
  }
}
```

### 14. `apps/gov-api/src/application/records/create-record-version-handler.ts`

```ts id="nb1m3b"
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
      throw new Error(`Official record ${command.input.officialRecordId} was not found.`);
    }

    const latestVersionNumber = await this.officialRecordRepository.getLatestVersionNumberForRecord(
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

### 15. `apps/gov-api/src/application/records/list-record-versions-handler.ts`

```ts id="lbi4hn"
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type {
  ListRecordVersionsQuery,
  ListRecordVersionsQueryHandler,
} from "./list-record-versions";
import type { RecordVersionDto } from "./create-record-version";
import { toRecordVersionDto } from "./record-mappers";

export class ListRecordVersionsHandler implements ListRecordVersionsQueryHandler {
  constructor(private readonly officialRecordRepository: OfficialRecordRepository) {}

  async execute(query: ListRecordVersionsQuery): Promise<RecordVersionDto[]> {
    const versions = await this.officialRecordRepository.listRecordVersionsForRecord(
      query.officialRecordId,
    );

    return versions.map(toRecordVersionDto);
  }
}
```

### 16. `apps/gov-api/src/application/records/officialize-official-record-handler.ts`

```ts id="g1owhq"
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
      return null;
    }

    if (record.status !== "DRAFT") {
      throw new Error(`Official record ${command.recordId} cannot be officialized from ${record.status}.`);
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
      },
    });

    return toOfficialRecordDto(officializedRecord);
  }
}
```

### 17. `apps/gov-api/src/infrastructure/persistence/in-memory/in-memory-official-record-repository.ts`

```ts id="a2hi1o"
import type { OfficialRecordRepository } from "../../../domain/records/official-record-repository";
import type { OfficialRecord } from "../../../domain/records/official-record";
import type { RecordVersion } from "../../../domain/records/record-version";

export class InMemoryOfficialRecordRepository implements OfficialRecordRepository {
  private readonly records = new Map<string, OfficialRecord>();
  private readonly versions = new Map<string, RecordVersion[]>();

  async createOfficialRecord(record: OfficialRecord): Promise<void> {
    this.records.set(record.id, record);
  }

  async getOfficialRecordById(recordId: string): Promise<OfficialRecord | null> {
    return this.records.get(recordId) ?? null;
  }

  async listOfficialRecords(): Promise<OfficialRecord[]> {
    return Array.from(this.records.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async updateOfficialRecord(record: OfficialRecord): Promise<void> {
    this.records.set(record.id, record);
  }

  async createRecordVersion(version: RecordVersion): Promise<void> {
    const existing = this.versions.get(version.officialRecordId) ?? [];
    existing.push(version);
    existing.sort((a, b) => a.versionNumber - b.versionNumber);
    this.versions.set(version.officialRecordId, existing);
  }

  async listRecordVersionsForRecord(recordId: string): Promise<RecordVersion[]> {
    return [...(this.versions.get(recordId) ?? [])];
  }

  async getLatestVersionNumberForRecord(recordId: string): Promise<number> {
    const versions = this.versions.get(recordId) ?? [];
    return versions.length === 0 ? 0 : Math.max(...versions.map((item) => item.versionNumber));
  }
}
```

### 18. `apps/gov-api/src/routes/official-records.ts`

```ts id="zkiy9e"
import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { jsonData } from "../http/json";
import { requireAuth } from "../middleware/require-auth";
import { requireAuthority } from "../middleware/require-authority";
import { NotFoundError, ValidationError } from "../http/errors";
import { runIdempotentCommand } from "../http/idempotency";

export function createOfficialRecordRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.get(
    "/",
    requireAuth,
    requireAuthority("record.read"),
    async (c) => {
      const appContext = c.get("appContext");
      const result = await appContext.handlers.records.list.execute();
      return c.json(jsonData(result), 200);
    },
  );

  app.get(
    "/:recordId",
    requireAuth,
    requireAuthority("record.read"),
    async (c) => {
      const appContext = c.get("appContext");
      const recordId = c.req.param("recordId");

      const result = await appContext.handlers.records.get.execute({
        recordId,
      });

      if (!result) {
        throw new NotFoundError(`Official record ${recordId} was not found.`);
      }

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/",
    requireAuth,
    requireAuthority("record.create"),
    async (c) => {
      const appContext = c.get("appContext");
      const actor = c.get("requestContext").actor!;
      const body = await c.req.json<{
        recordType?: string;
        title?: string;
        summary?: string;
        sourceEntityType?: string;
        sourceEntityId?: string;
      }>();

      const errors: Record<string, string[]> = {};

      if (!body.recordType?.trim()) {
        errors.recordType = ["recordType is required."];
      }

      if (!body.title?.trim()) {
        errors.title = ["title is required."];
      }

      if (!body.sourceEntityType?.trim()) {
        errors.sourceEntityType = ["sourceEntityType is required."];
      }

      if (!body.sourceEntityId?.trim()) {
        errors.sourceEntityId = ["sourceEntityId is required."];
      }

      if (Object.keys(errors).length > 0) {
        throw new ValidationError("Create official record request was invalid.", errors);
      }

      const requestPayload = {
        recordType: body.recordType!,
        title: body.title!,
        summary: body.summary,
        sourceEntityType: body.sourceEntityType!,
        sourceEntityId: body.sourceEntityId!,
      };

      const result = await runIdempotentCommand({
        c,
        operationName: "record.create",
        requestBody: requestPayload,
        execute: async () =>
          appContext.handlers.records.create.execute({
            actor: { personId: actor.personId },
            input: requestPayload,
          }),
      });

      return c.json(jsonData(result), 201);
    },
  );

  app.get(
    "/:recordId/versions",
    requireAuth,
    requireAuthority("record.version.read"),
    async (c) => {
      const appContext = c.get("appContext");
      const recordId = c.req.param("recordId");

      const result = await appContext.handlers.records.listVersions.execute({
        officialRecordId: recordId,
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/:recordId/versions",
    requireAuth,
    requireAuthority("record.version.create"),
    async (c) => {
      const appContext = c.get("appContext");
      const actor = c.get("requestContext").actor!;
      const recordId = c.req.param("recordId");
      const body = await c.req.json<{
        bodyMarkdown?: string;
        changeSummary?: string;
      }>();

      const errors: Record<string, string[]> = {};
      if (!body.bodyMarkdown?.trim()) {
        errors.bodyMarkdown = ["bodyMarkdown is required."];
      }

      if (Object.keys(errors).length > 0) {
        throw new ValidationError("Create record version request was invalid.", errors);
      }

      const requestPayload = {
        officialRecordId: recordId,
        bodyMarkdown: body.bodyMarkdown!,
        changeSummary: body.changeSummary,
      };

      const result = await runIdempotentCommand({
        c,
        operationName: "record.version.create",
        requestBody: requestPayload,
        execute: async () =>
          appContext.handlers.records.createVersion.execute({
            actor: { personId: actor.personId },
            input: requestPayload,
          }),
      });

      return c.json(jsonData(result), 201);
    },
  );

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

      if (!result) {
        throw new NotFoundError(`Official record ${recordId} was not found.`);
      }

      return c.json(jsonData(result), 200);
    },
  );

  return app;
}
```

### 19. `apps/gov-api/src/routes/official-records.test.ts`

```ts id="g6pnkj"
import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { requestContextMiddleware } from "../middleware/request-context";
import { errorHandler } from "../middleware/error-handler";
import { createOfficialRecordRoutes } from "./official-records";
import { IdempotencyService } from "../application/shared/idempotency-service";
import { InMemoryIdempotencyRepository } from "../infrastructure/persistence/in-memory/in-memory-idempotency-repository";

describe("official record routes", () => {
  it("creates an official record", async () => {
    const app = new Hono<HonoEnv>();

    app.use("*", requestContextMiddleware);
    app.use("*", async (c, next) => {
      c.set("requestContext", {
        requestId: "req-1",
        actor: {
          personId: "admin-1",
          isAuthenticated: true,
          roles: ["registrar"],
          authorityGrants: [
            "record.create",
            "record.read",
            "record.version.create",
            "record.version.read",
            "record.officialize",
          ],
        },
      });

      c.set("appContext", {
        handlers: {
          records: {
            create: {
              async execute(command) {
                return {
                  id: "record-1",
                  recordType: command.input.recordType,
                  title: command.input.title,
                  summary: command.input.summary,
                  sourceEntityType: command.input.sourceEntityType,
                  sourceEntityId: command.input.sourceEntityId,
                  status: "DRAFT",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              },
            },
            get: { async execute() { return null; } },
            list: { async execute() { return []; } },
            createVersion: {
              async execute(command) {
                return {
                  id: "version-1",
                  officialRecordId: command.input.officialRecordId,
                  versionNumber: 1,
                  bodyMarkdown: command.input.bodyMarkdown,
                  changeSummary: command.input.changeSummary,
                  createdByPersonId: command.actor.personId,
                  createdAt: new Date().toISOString(),
                };
              },
            },
            listVersions: { async execute() { return []; } },
            officialize: {
              async execute(command) {
                return {
                  id: command.recordId,
                  recordType: "ACT",
                  title: "Act I",
                  summary: "Founding act",
                  sourceEntityType: "Proposal",
                  sourceEntityId: "proposal-1",
                  status: "OFFICIAL",
                  officializedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              },
            },
          },
        } as never,
        services: {
          transactionRunner: {
            runInTransaction: async <T>(work: () => Promise<T>) => work(),
          },
          idempotencyService: new IdempotencyService(
            new InMemoryIdempotencyRepository(),
          ),
          auditWriter: {} as never,
          ruleResolutionService: {} as never,
          authorityResolutionService: {} as never,
          tokenValidator: {} as never,
          principalToPersonService: {} as never,
          authenticatedActorService: {} as never,
        },
      });

      await next();
    });
    app.use("*", errorHandler);

    app.route("/official-records", createOfficialRecordRoutes());

    const res = await app.request("http://localhost/official-records", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": "idem-record-1",
      },
      body: JSON.stringify({
        recordType: "ACT",
        title: "Act I",
        summary: "Founding act",
        sourceEntityType: "Proposal",
        sourceEntityId: "proposal-1",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.recordType).toBe("ACT");
    expect(body.data.title).toBe("Act I");
  });

  it("officializes an official record", async () => {
    const app = new Hono<HonoEnv>();

    app.use("*", requestContextMiddleware);
    app.use("*", async (c, next) => {
      c.set("requestContext", {
        requestId: "req-2",
        actor: {
          personId: "admin-1",
          isAuthenticated: true,
          roles: ["registrar"],
          authorityGrants: [
            "record.read",
            "record.officialize",
          ],
        },
      });

      c.set("appContext", {
        handlers: {
          records: {
            create: { async execute() { throw new Error("unused"); } },
            get: { async execute() { return null; } },
            list: { async execute() { return []; } },
            createVersion: { async execute() { throw new Error("unused"); } },
            listVersions: { async execute() { return []; } },
            officialize: {
              async execute(command) {
                return {
                  id: command.recordId,
                  recordType: "ACT",
                  title: "Act I",
                  summary: "Founding act",
                  sourceEntityType: "Proposal",
                  sourceEntityId: "proposal-1",
                  status: "OFFICIAL",
                  officializedAt: new Date().toISOString(),
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              },
            },
          },
        } as never,
        services: {
          transactionRunner: {
            runInTransaction: async <T>(work: () => Promise<T>) => work(),
          },
          idempotencyService: new IdempotencyService(
            new InMemoryIdempotencyRepository(),
          ),
          auditWriter: {} as never,
          ruleResolutionService: {} as never,
          authorityResolutionService: {} as never,
          tokenValidator: {} as never,
          principalToPersonService: {} as never,
          authenticatedActorService: {} as never,
        },
      });

      await next();
    });
    app.use("*", errorHandler);

    app.route("/official-records", createOfficialRecordRoutes());

    const res = await app.request(
      "http://localhost/official-records/record-1/actions/officialize",
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          note: "Approved by registrar.",
        }),
      },
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.data.status).toBe("OFFICIAL");
  });
});
```

### 20. `apps/gov-api/src/application/records/create-official-record-handler.test.ts`

```ts id="5thvy4"
import { describe, expect, it } from "vitest";
import { InMemoryOfficialRecordRepository } from "../../infrastructure/persistence/in-memory/in-memory-official-record-repository";
import { InMemoryAuditRepository } from "../../infrastructure/persistence/in-memory/in-memory-audit-repository";
import { AuditWriter } from "../audit/audit-writer";
import { CreateOfficialRecordHandler } from "./create-official-record-handler";

describe("CreateOfficialRecordHandler", () => {
  it("creates an official record in draft status", async () => {
    const repository = new InMemoryOfficialRecordRepository();
    const auditWriter = new AuditWriter(new InMemoryAuditRepository());

    const handler = new CreateOfficialRecordHandler(repository, auditWriter);

    const result = await handler.execute({
      actor: { personId: "admin-1" },
      input: {
        recordType: "ACT",
        title: "Act I",
        summary: "Founding act",
        sourceEntityType: "Proposal",
        sourceEntityId: "proposal-1",
      },
    });

    expect(result.recordType).toBe("ACT");
    expect(result.title).toBe("Act I");
    expect(result.status).toBe("DRAFT");
  });
});
```

### 21. `apps/gov-api/src/application/records/create-record-version-handler.test.ts`

```ts id="dyljlwm"
import { describe, expect, it } from "vitest";
import { InMemoryOfficialRecordRepository } from "../../infrastructure/persistence/in-memory/in-memory-official-record-repository";
import { InMemoryAuditRepository } from "../../infrastructure/persistence/in-memory/in-memory-audit-repository";
import { AuditWriter } from "../audit/audit-writer";
import { CreateOfficialRecordHandler } from "./create-official-record-handler";
import { CreateRecordVersionHandler } from "./create-record-version-handler";

describe("CreateRecordVersionHandler", () => {
  it("creates incrementing record versions", async () => {
    const repository = new InMemoryOfficialRecordRepository();
    const auditWriter = new AuditWriter(new InMemoryAuditRepository());

    const createRecordHandler = new CreateOfficialRecordHandler(repository, auditWriter);
    const createVersionHandler = new CreateRecordVersionHandler(repository, auditWriter);

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

    const version1 = await createVersionHandler.execute({
      actor: { personId: "admin-1" },
      input: {
        officialRecordId: record.id,
        bodyMarkdown: "# Act I\n\nInitial text",
        changeSummary: "Initial text",
      },
    });

    const version2 = await createVersionHandler.execute({
      actor: { personId: "admin-1" },
      input: {
        officialRecordId: record.id,
        bodyMarkdown: "# Act I\n\nUpdated text",
        changeSummary: "Clarified section 1",
      },
    });

    expect(version1.versionNumber).toBe(1);
    expect(version2.versionNumber).toBe(2);
  });
});
```

### 22. `apps/gov-api/src/application/records/officialize-official-record-handler.test.ts`

```ts id="caa92v"
import { describe, expect, it } from "vitest";
import { InMemoryOfficialRecordRepository } from "../../infrastructure/persistence/in-memory/in-memory-official-record-repository";
import { InMemoryAuditRepository } from "../../infrastructure/persistence/in-memory/in-memory-audit-repository";
import { AuditWriter } from "../audit/audit-writer";
import { CreateOfficialRecordHandler } from "./create-official-record-handler";
import { OfficializeOfficialRecordHandler } from "./officialize-official-record-handler";

describe("OfficializeOfficialRecordHandler", () => {
  it("officializes a draft record", async () => {
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
});
```

### 23. `apps/gov-api/src/context/app-context.ts`

Add these imports:

```ts id="va8nwa"
import type { CreateOfficialRecordCommandHandler } from "../application/records/create-official-record";
import type { GetOfficialRecordQueryHandler } from "../application/records/get-official-record";
import type { ListOfficialRecordsQueryHandler } from "../application/records/list-official-records";
import type { CreateRecordVersionCommandHandler } from "../application/records/create-record-version";
import type { ListRecordVersionsQueryHandler } from "../application/records/list-record-versions";
import type { OfficializeOfficialRecordCommandHandler } from "../application/records/officialize-official-record";

import type { CreateGazetteIssueCommandHandler } from "../application/gazette/create-gazette-issue";
import type { GetGazetteIssueQueryHandler } from "../application/gazette/get-gazette-issue";
import type { ListGazetteIssuesQueryHandler } from "../application/gazette/list-gazette-issues";
import type { PublishGazetteIssueCommandHandler } from "../application/gazette/publish-gazette-issue";
import type { AddRecordToGazetteIssueCommandHandler } from "../application/gazette/add-record-to-gazette-issue";
import type { ListGazetteEntriesQueryHandler } from "../application/gazette/list-gazette-entries";
```

Add these sections inside `AppHandlers`:

```ts id="ofrkqj"
  records: {
    create: CreateOfficialRecordCommandHandler;
    get: GetOfficialRecordQueryHandler;
    list: ListOfficialRecordsQueryHandler;
    createVersion: CreateRecordVersionCommandHandler;
    listVersions: ListRecordVersionsQueryHandler;
    officialize: OfficializeOfficialRecordCommandHandler;
  };

  gazette: {
    createIssue: CreateGazetteIssueCommandHandler;
    getIssue: GetGazetteIssueQueryHandler;
    listIssues: ListGazetteIssuesQueryHandler;
    publishIssue: PublishGazetteIssueCommandHandler;
  };

  gazettePromotion: {
    addRecordToIssue: AddRecordToGazetteIssueCommandHandler;
    listEntries: ListGazetteEntriesQueryHandler;
  };
```

## What this batch does

This gives you a real **official-records vertical** in the same richer stack where gazette publication already exists:

* create/list/get official records
* create/list record versions
* explicit action to officialize a record
* in-memory persistence for handler tests
* route tests and handler tests
* `appContext` additions so official records can sit next to gazette and gazette-promotion handlers

Most importantly, it fits the constitutional flow you defined:

draft proposal outcome → official record → officialized record → existing gazette issue entry → published gazette issue

The next strongest batch is the **actual wiring layer**:
repository implementations for official records and gazette against Prisma, plus the composition/bootstrap code that instantiates these handlers and mounts both `createOfficialRecordRoutes()` and `createGazetteRoutes()` into one runnable app.
