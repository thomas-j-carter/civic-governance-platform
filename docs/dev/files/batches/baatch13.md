## Batch 13 — runtime completion batch

### 1. `apps/gov-api/src/lib/prisma.ts`

```ts id="b13prisma"
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

---

### 2. `apps/gov-api/src/http/request-id.ts`

```ts id="b13reqid"
import { randomUUID } from "node:crypto";

export function createRequestId(): string {
  return randomUUID();
}
```

---

### 3. `apps/gov-api/src/http/json.ts`

```ts id="b13json"
export function jsonData<T>(data: T) {
  return { data };
}

export function jsonList<T>(
  items: T[],
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  },
) {
  return pagination ? { data: items, pagination } : { data: items };
}
```

---

### 4. `apps/gov-api/src/http/idempotency.ts`

```ts id="b13idem"
import { createHash } from "node:crypto";
import type { Context } from "hono";
import type { HonoEnv } from "../types/hono";

export interface RunIdempotentCommandOptions<T> {
  c: Context<HonoEnv>;
  operationName: string;
  requestBody: unknown;
  execute: () => Promise<T>;
}

function stableHash(value: unknown): string {
  const serialized = JSON.stringify(value ?? null);
  return createHash("sha256").update(serialized).digest("hex");
}

export async function runIdempotentCommand<T>(
  options: RunIdempotentCommandOptions<T>,
): Promise<T> {
  const idempotencyKey = options.c.req.header("idempotency-key");
  const appContext = options.c.get("appContext");
  const requestContext = options.c.get("requestContext");

  if (!idempotencyKey) {
    return options.execute();
  }

  const service = appContext.services.idempotencyService as any;

  if (!service) {
    return options.execute();
  }

  const payload = {
    idempotencyKey,
    operationName: options.operationName,
    requestHash: stableHash(options.requestBody),
    requestId: requestContext.requestId,
    actorPersonId: requestContext.actor?.personId,
    execute: options.execute,
  };

  if (typeof service.execute === "function") {
    return service.execute(payload);
  }

  if (typeof service.run === "function") {
    return service.run(payload);
  }

  if (typeof service.runIdempotent === "function") {
    return service.runIdempotent(payload);
  }

  return options.execute();
}
```

---

### 5. `apps/gov-api/src/server-publication.ts`

```ts id="b13server"
import { serve } from "@hono/node-server";
import { createPublicationApp } from "./app-publication";

const port = Number(process.env.PORT ?? 3002);

const app = createPublicationApp();

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`publication app listening on http://localhost:${info.port}`);
  },
);
```

---

### 6. `apps/gov-api/.env.example`

```dotenv id="b13env"
# Core
NODE_ENV=development
PORT=3002
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ardtire_gov

# JWT validation
AUTH_JWT_ISSUER=https://id.example.test/realms/ardtire
AUTH_JWT_AUDIENCE=gov-api
AUTH_JWKS_URL=https://id.example.test/realms/ardtire/protocol/openid-connect/certs

# Alternative local/dev verification options
# AUTH_JWT_PUBLIC_KEY="-----BEGIN PUBLIC KEY-----\n...\n-----END PUBLIC KEY-----"
# AUTH_JWT_SECRET=replace-me-only-for-local-hs256

# Notes:
# Provide AUTH_JWT_ISSUER plus one of:
# - AUTH_JWKS_URL
# - AUTH_JWT_PUBLIC_KEY
# - AUTH_JWT_SECRET
```

---

### 7. `apps/gov-api/src/app-publication.e2e.test.ts`

```ts id="b13e2e"
import { describe, expect, it } from "vitest";
import type { AppContext } from "./context/app-context";
import { createPublicationApp } from "./app-publication";

import { AuditWriter } from "./application/audit/audit-writer";
import { IdempotencyService } from "./application/shared/idempotency-service";

import { InMemoryAuditRepository } from "./infrastructure/persistence/in-memory/in-memory-audit-repository";
import { InMemoryIdempotencyRepository } from "./infrastructure/persistence/in-memory/in-memory-idempotency-repository";
import { InMemoryOfficialRecordRepository } from "./infrastructure/persistence/in-memory/in-memory-official-record-repository";
import { InMemoryGazetteIssueRepository } from "./infrastructure/persistence/in-memory/in-memory-gazette-repository";

import { CreateOfficialRecordHandler } from "./application/records/create-official-record-handler";
import { GetOfficialRecordHandler } from "./application/records/get-official-record-handler";
import { ListOfficialRecordsHandler } from "./application/records/list-official-records-handler";
import { CreateRecordVersionHandler } from "./application/records/create-record-version-handler";
import { ListRecordVersionsHandler } from "./application/records/list-record-versions-handler";
import { OfficializeOfficialRecordHandler } from "./application/records/officialize-official-record-handler";

import { CreateGazetteIssueHandler } from "./application/gazette/create-gazette-issue-handler";
import { GetGazetteIssueHandler } from "./application/gazette/get-gazette-issue-handler";
import { ListGazetteIssuesHandler } from "./application/gazette/list-gazette-issues-handler";
import { PublishGazetteIssueHandler } from "./application/gazette/publish-gazette-issue-handler";
import { AddRecordToGazetteIssueHandler } from "./application/gazette/add-record-to-gazette-issue-handler";
import { ListGazetteEntriesHandler } from "./application/gazette/list-gazette-entries-handler";

function createUnsupportedHandler(name: string) {
  return {
    async execute(): Promise<never> {
      throw new Error(`${name} is not used in this test.`);
    },
  } as never;
}

function createTestAppContext(): AppContext {
  const officialRecordRepository = new InMemoryOfficialRecordRepository();
  const gazetteRepository = new InMemoryGazetteIssueRepository();

  const auditWriter = new AuditWriter(new InMemoryAuditRepository());
  const idempotencyService = new IdempotencyService(new InMemoryIdempotencyRepository());

  return {
    handlers: {
      identity: {
        getCurrentIdentity: createUnsupportedHandler("identity.getCurrentIdentity"),
        getAuthorityContext: createUnsupportedHandler("identity.getAuthorityContext"),
      },
      proposals: {
        createDraft: createUnsupportedHandler("proposals.createDraft"),
        getDetail: createUnsupportedHandler("proposals.getDetail"),
        list: createUnsupportedHandler("proposals.list"),
        listVersions: createUnsupportedHandler("proposals.listVersions"),
        createVersion: createUnsupportedHandler("proposals.createVersion"),
        setCurrentVersion: createUnsupportedHandler("proposals.setCurrentVersion"),
        submit: createUnsupportedHandler("proposals.submit"),
        assignCommittee: createUnsupportedHandler("proposals.assignCommittee"),
      },
      records: {
        create: new CreateOfficialRecordHandler(officialRecordRepository, auditWriter),
        get: new GetOfficialRecordHandler(officialRecordRepository),
        list: new ListOfficialRecordsHandler(officialRecordRepository),
        createVersion: new CreateRecordVersionHandler(officialRecordRepository, auditWriter),
        listVersions: new ListRecordVersionsHandler(officialRecordRepository),
        officialize: new OfficializeOfficialRecordHandler(officialRecordRepository, auditWriter),
      },
      gazette: {
        createIssue: new CreateGazetteIssueHandler(gazetteRepository, auditWriter),
        getIssue: new GetGazetteIssueHandler(gazetteRepository),
        listIssues: new ListGazetteIssuesHandler(gazetteRepository),
        publishIssue: new PublishGazetteIssueHandler(
          gazetteRepository,
          gazetteRepository,
          auditWriter,
        ),
      },
      gazettePromotion: {
        addRecordToIssue: new AddRecordToGazetteIssueHandler(
          gazetteRepository,
          gazetteRepository,
          officialRecordRepository,
          auditWriter,
        ),
        listEntries: new ListGazetteEntriesHandler(gazetteRepository),
      },
    },
    services: {
      transactionRunner: {
        runInTransaction: async <T>(work: () => Promise<T>) => work(),
      },
      idempotencyService,
      auditWriter,
      authenticatedActorService: {
        async resolveFromBearerToken() {
          return {
            personId: "person-1",
            userAccountId: "user-1",
            memberId: "member-1",
            email: "thomas@example.com",
            roles: ["registrar", "publisher"],
            authorityGrants: [
              "record.create",
              "record.read",
              "record.version.create",
              "record.version.read",
              "record.officialize",
              "gazette.issue.create",
              "gazette.issue.read",
              "gazette.entry.create",
              "gazette.entry.read",
              "gazette.issue.publish",
            ],
            isAuthenticated: true,
          };
        },
      } as never,
      tokenValidator: undefined,
      principalToPersonService: undefined,
      authorityResolutionService: undefined,
      ruleResolutionService: undefined,
    },
  };
}

function authHeaders(extra?: Record<string, string>) {
  return {
    authorization: "Bearer test-token",
    ...extra,
  };
}

describe("publication flow", () => {
  it("creates, officializes, gazettes, and publishes an official record", async () => {
    const app = createPublicationApp({
      appContext: createTestAppContext(),
    });

    const createRecordRes = await app.request("http://localhost/official-records", {
      method: "POST",
      headers: authHeaders({
        "content-type": "application/json",
        "idempotency-key": "idem-record-create-1",
      }),
      body: JSON.stringify({
        recordType: "ACT",
        title: "Act I",
        summary: "Founding act of the realm.",
        sourceEntityType: "Proposal",
        sourceEntityId: "proposal-1",
      }),
    });

    expect(createRecordRes.status).toBe(201);
    const createdRecordBody = await createRecordRes.json();
    const recordId = createdRecordBody.data.id as string;
    expect(createdRecordBody.data.status).toBe("DRAFT");

    const createVersionRes = await app.request(
      `http://localhost/official-records/${recordId}/versions`,
      {
        method: "POST",
        headers: authHeaders({
          "content-type": "application/json",
          "idempotency-key": "idem-record-version-1",
        }),
        body: JSON.stringify({
          bodyMarkdown: "# Act I\n\nFounding text",
          changeSummary: "Initial promulgation text.",
        }),
      },
    );

    expect(createVersionRes.status).toBe(201);
    const createdVersionBody = await createVersionRes.json();
    expect(createdVersionBody.data.versionNumber).toBe(1);

    const officializeRes = await app.request(
      `http://localhost/official-records/${recordId}/actions/officialize`,
      {
        method: "POST",
        headers: authHeaders({
          "content-type": "application/json",
        }),
        body: JSON.stringify({
          note: "Officialized by registrar.",
        }),
      },
    );

    expect(officializeRes.status).toBe(200);
    const officializedBody = await officializeRes.json();
    expect(officializedBody.data.status).toBe("OFFICIAL");

    const createIssueRes = await app.request("http://localhost/gazette/issues", {
      method: "POST",
      headers: authHeaders({
        "content-type": "application/json",
        "idempotency-key": "idem-issue-create-1",
      }),
      body: JSON.stringify({
        issueNumber: "0001",
        title: "Issue 1",
      }),
    });

    expect(createIssueRes.status).toBe(201);
    const createdIssueBody = await createIssueRes.json();
    const issueId = createdIssueBody.data.id as string;
    expect(createdIssueBody.data.publicationState).toBe("DRAFT");

    const addEntryRes = await app.request(
      `http://localhost/gazette/issues/${issueId}/entries`,
      {
        method: "POST",
        headers: authHeaders({
          "content-type": "application/json",
          "idempotency-key": "idem-entry-create-1",
        }),
        body: JSON.stringify({
          officialRecordId: recordId,
        }),
      },
    );

    expect(addEntryRes.status).toBe(201);
    const createdEntryBody = await addEntryRes.json();
    expect(createdEntryBody.data.officialRecordId).toBe(recordId);

    const publishIssueRes = await app.request(
      `http://localhost/gazette/issues/${issueId}/actions/publish`,
      {
        method: "POST",
        headers: authHeaders({
          "content-type": "application/json",
        }),
        body: JSON.stringify({
          note: "Published in regular issue.",
        }),
      },
    );

    expect(publishIssueRes.status).toBe(200);
    const publishedIssueBody = await publishIssueRes.json();
    expect(publishedIssueBody.data.publicationState).toBe("PUBLISHED");
    expect(publishedIssueBody.data.publishedAt).toBeTruthy();
  });
});
```

---

### 8. `apps/gov-api/package.json`

Merge these additions into your current package manifest:

```json id="b13pkg"
{
  "scripts": {
    "publication:dev": "tsx src/server-publication.ts",
    "publication:test:e2e": "vitest run src/app-publication.e2e.test.ts"
  },
  "dependencies": {
    "@hono/node-server": "latest"
  },
  "devDependencies": {
    "tsx": "latest"
  }
}
```

## What this batch completes

This closes the biggest remaining runtime gap:

* concrete Prisma bootstrap
* concrete request-id and JSON helpers for the richer route stack
* concrete idempotency bridge used by `official-records` and `gazette`
* runnable publication server entrypoint
* environment surface for auth + database
* one focused end-to-end test covering the legal/publication chain:
  **official record → version → officialize → gazette issue → gazette entry → publish**

## Strongest next step

The next batch should be the **consistency and cleanup pass**:
unify the two `gov-api` architectural tracks, remove placeholder/unsupported handlers, and make one canonical app entrypoint so the repo stops carrying parallel implementations.
