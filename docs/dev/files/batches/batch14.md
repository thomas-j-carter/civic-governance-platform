## Batch 14 — canonical app consolidation

Progress: **93% complete**

This batch makes `gov-api` stop feeling like multiple parallel bootstraps by introducing one canonical app factory and one canonical server entrypoint, while keeping `createPublicationApp` as a compatibility alias.

### 1. `apps/gov-api/src/routes/publication.ts`

```ts id="b14pubroutes"
import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { createOfficialRecordRoutes } from "./official-records";
import { createGazetteRoutes } from "./gazette";

export function createPublicationRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.route("/official-records", createOfficialRecordRoutes());
  app.route("/gazette", createGazetteRoutes());

  return app;
}
```

---

### 2. `apps/gov-api/src/app.ts`

```ts id="b14app"
import { Hono } from "hono";
import type { HonoEnv } from "./types/hono";
import type { AppContext } from "./context/app-context";

import { requestContextMiddleware } from "./middleware/request-context";
import { authenticateRequestMiddleware } from "./middleware/authenticate-request";
import { errorHandler } from "./middleware/error-handler";

import {
  createPublicationAppContext,
  type CreatePublicationAppContextOptions,
} from "./context/create-publication-app-context";
import { createPublicationRoutes } from "./routes/publication";

export interface CreateGovApiAppOptions {
  appContext?: AppContext;
  appContextOptions?: CreatePublicationAppContextOptions;
}

export function createGovApiApp(
  options: CreateGovApiAppOptions = {},
): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();
  const appContext =
    options.appContext ?? createPublicationAppContext(options.appContextOptions);

  app.use("*", requestContextMiddleware);

  app.use("*", async (c, next) => {
    c.set("appContext", appContext);
    await next();
  });

  app.use("*", authenticateRequestMiddleware);
  app.use("*", errorHandler);

  app.get("/healthz", (c) => {
    return c.json(
      {
        ok: true,
        service: "gov-api",
      },
      200,
    );
  });

  app.route("/", createPublicationRoutes());

  return app;
}

export const createApp = createGovApiApp;
```

---

### 3. `apps/gov-api/src/app-publication.ts`

```ts id="b14apppub"
export {
  createGovApiApp as createPublicationApp,
  createApp,
} from "./app";

export type {
  CreateGovApiAppOptions as CreatePublicationAppOptions,
} from "./app";
```

---

### 4. `apps/gov-api/src/server.ts`

```ts id="b14server"
import { serve } from "@hono/node-server";
import { createGovApiApp } from "./app";

const port = Number(process.env.PORT ?? 3002);

const app = createGovApiApp();

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`gov-api listening on http://localhost:${info.port}`);
  },
);
```

---

### 5. `apps/gov-api/src/server-publication.ts`

```ts id="b14serverpub"
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

### 6. `apps/gov-api/src/index.ts`

```ts id="b14index"
export {
  createGovApiApp,
  createApp,
} from "./app";

export {
  createPublicationApp,
} from "./app-publication";

export {
  createPublicationAppContext,
} from "./context/create-publication-app-context";

export type {
  CreateGovApiAppOptions,
} from "./app";

export type {
  CreatePublicationAppContextOptions,
} from "./context/create-publication-app-context";
```

---

### 7. `apps/gov-api/src/app.test.ts`

```ts id="b14apptest"
import { describe, expect, it } from "vitest";
import type { AppContext } from "./context/app-context";
import { createGovApiApp } from "./app";

function createUnsupportedHandler(name: string) {
  return {
    async execute(): Promise<never> {
      throw new Error(`${name} is not used in this test.`);
    },
  } as never;
}

function authHeaders(extra?: Record<string, string>) {
  return {
    authorization: "Bearer test-token",
    ...extra,
  };
}

function createTestAppContext(): AppContext {
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
        createVersion: { async execute() { throw new Error("unused"); } },
        listVersions: { async execute() { return []; } },
        officialize: { async execute() { return null; } },
      },
      gazette: {
        createIssue: {
          async execute(command) {
            return {
              id: "issue-1",
              issueNumber: command.input.issueNumber,
              title: command.input.title,
              publicationState: "DRAFT",
              createdByPersonId: command.actor.personId,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
          },
        },
        getIssue: { async execute() { return null; } },
        listIssues: { async execute() { return []; } },
        publishIssue: { async execute() { throw new Error("unused"); } },
      },
      gazettePromotion: {
        addRecordToIssue: { async execute() { throw new Error("unused"); } },
        listEntries: { async execute() { return []; } },
      },
    },
    services: {
      transactionRunner: {
        runInTransaction: async <T>(work: () => Promise<T>) => work(),
      },
      idempotencyService: {} as never,
      auditWriter: {} as never,
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
              "gazette.issue.create",
              "gazette.issue.read",
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

describe("createGovApiApp", () => {
  it("serves a health endpoint", async () => {
    const app = createGovApiApp({
      appContext: createTestAppContext(),
    });

    const res = await app.request("http://localhost/healthz");
    expect(res.status).toBe(200);

    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.service).toBe("gov-api");
  });

  it("mounts official record routes", async () => {
    const app = createGovApiApp({
      appContext: createTestAppContext(),
    });

    const res = await app.request("http://localhost/official-records", {
      method: "POST",
      headers: authHeaders({
        "content-type": "application/json",
      }),
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
    expect(body.data.id).toBe("record-1");
    expect(body.data.recordType).toBe("ACT");
  });

  it("mounts gazette routes", async () => {
    const app = createGovApiApp({
      appContext: createTestAppContext(),
    });

    const res = await app.request("http://localhost/gazette/issues", {
      method: "POST",
      headers: authHeaders({
        "content-type": "application/json",
      }),
      body: JSON.stringify({
        issueNumber: "0001",
        title: "Issue 1",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.id).toBe("issue-1");
    expect(body.data.issueNumber).toBe("0001");
  });
});
```

---

### 8. `apps/gov-api/package.json`

Merge these script updates into your existing manifest:

```json id="b14pkg"
{
  "scripts": {
    "dev": "tsx src/server.ts",
    "start": "node dist/server.js",
    "publication:dev": "tsx src/server-publication.ts",
    "test:app": "vitest run src/app.test.ts"
  }
}
```

## What this batch accomplishes

This gives you one **canonical** `gov-api` app constructor:

* `createGovApiApp()` is now the primary app factory
* `createPublicationApp()` remains as a compatibility alias
* `server.ts` becomes the canonical runtime entrypoint
* `server-publication.ts` remains a compatibility entrypoint
* publication routes are mounted as one grouped route module instead of a separate app bootstrap

That means the repo now has a cleaner story:

* **canonical app**: `src/app.ts`
* **canonical server**: `src/server.ts`
* **publication routes**: `src/routes/publication.ts`
* **legacy-compatible alias**: `src/app-publication.ts`

## Strongest next step

The next batch should be the **final hardening pass**:
tighten error semantics in the new handlers to consistently use `HttpProblemError` types, add a minimal OpenAPI/route manifest for the publication endpoints, and add one or two conflict-case end-to-end tests such as:

* cannot add a non-official record to a gazette issue
* cannot publish a gazette issue with no entries
