## Batch 11 — auth/context integration for the richer publication app

This batch moves the richer publication app from test-only actor injection toward real per-request authentication and authority resolution.

### 1. `apps/gov-api/src/application/identity/token-validator.ts`

```ts id="b11tv1"
export interface ValidatedTokenClaims {
  principalId: string;
  subject: string;
  email?: string;
  claims: Record<string, unknown>;
}

export interface TokenValidator {
  validateBearerToken(token: string): Promise<ValidatedTokenClaims>;
}
```

### 2. `apps/gov-api/src/application/identity/principal-to-person-service.ts`

```ts id="b11pps"
export interface PrincipalToPersonResult {
  personId: string;
  userAccountId?: string;
  memberId?: string;
  email?: string;
}

export interface PrincipalToPersonService {
  resolvePrincipal(input: {
    principalId: string;
    subject: string;
    email?: string;
    claims: Record<string, unknown>;
  }): Promise<PrincipalToPersonResult | null>;
}
```

### 3. `apps/gov-api/src/application/identity/authority-resolution-service.ts`

```ts id="b11ars"
export interface AuthorityResolution {
  roles: string[];
  authorityGrants: string[];
}

export interface AuthorityResolutionService {
  resolveAuthorities(input: {
    personId: string;
    userAccountId?: string;
    memberId?: string;
  }): Promise<AuthorityResolution>;
}
```

### 4. `apps/gov-api/src/application/identity/authenticated-actor-service.ts`

```ts id="b11aas"
import type { AuthenticatedActor } from "../../context/request-context";
import type { TokenValidator } from "./token-validator";
import type { PrincipalToPersonService } from "./principal-to-person-service";
import type { AuthorityResolutionService } from "./authority-resolution-service";

export class AuthenticatedActorService {
  constructor(
    private readonly tokenValidator: TokenValidator,
    private readonly principalToPersonService: PrincipalToPersonService,
    private readonly authorityResolutionService: AuthorityResolutionService,
  ) {}

  async resolveFromBearerToken(token: string): Promise<AuthenticatedActor | null> {
    const claims = await this.tokenValidator.validateBearerToken(token);

    const principal = await this.principalToPersonService.resolvePrincipal({
      principalId: claims.principalId,
      subject: claims.subject,
      email: claims.email,
      claims: claims.claims,
    });

    if (!principal) {
      return null;
    }

    const authorityContext = await this.authorityResolutionService.resolveAuthorities({
      personId: principal.personId,
      userAccountId: principal.userAccountId,
      memberId: principal.memberId,
    });

    return {
      personId: principal.personId,
      userAccountId: principal.userAccountId,
      memberId: principal.memberId,
      email: principal.email ?? claims.email,
      roles: authorityContext.roles,
      authorityGrants: authorityContext.authorityGrants,
      isAuthenticated: true,
    };
  }
}
```

### 5. `apps/gov-api/src/middleware/authenticate-request.ts`

```ts id="b11arm"
import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "../types/hono";
import { UnauthorizedError } from "../http/errors";

function extractBearerToken(authorizationHeader: string | undefined): string | null {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, value] = authorizationHeader.split(" ", 2);

  if (!scheme || !value) {
    throw new UnauthorizedError("Malformed authorization header.");
  }

  if (scheme.toLowerCase() !== "bearer") {
    throw new UnauthorizedError("Bearer token authentication is required.");
  }

  return value.trim() || null;
}

export const authenticateRequestMiddleware: MiddlewareHandler<HonoEnv> = async (c, next) => {
  const requestContext = c.get("requestContext");
  const appContext = c.get("appContext");

  const token = extractBearerToken(c.req.header("authorization"));

  if (!token) {
    requestContext.actor = null;
    await next();
    return;
  }

  const authenticatedActorService = appContext.services.authenticatedActorService;

  if (!authenticatedActorService) {
    requestContext.actor = null;
    await next();
    return;
  }

  const actor = await authenticatedActorService.resolveFromBearerToken(token);

  if (!actor) {
    throw new UnauthorizedError("Unable to resolve authenticated actor.");
  }

  requestContext.actor = actor;

  await next();
};
```

### 6. `apps/gov-api/src/context/app-context.ts`

Replace with:

```ts id="b11ctx"
import type { AuditWriter } from "../application/audit/audit-writer";
import type { IdempotencyService } from "../application/shared/idempotency-service";
import type { AuthenticatedActorService } from "../application/identity/authenticated-actor-service";

import type { IdentityQueryHandler } from "../application/identity/get-current-identity";
import type { AuthorityContextQueryHandler } from "../application/identity/get-authority-context";

import type { CreateProposalDraftCommandHandler } from "../application/proposals/create-proposal-draft";
import type { GetProposalDetailQueryHandler } from "../application/proposals/get-proposal-detail";
import type { ListProposalsQueryHandler } from "../application/proposals/list-proposals";
import type { ListProposalVersionsQueryHandler } from "../application/proposals/list-proposal-versions";
import type { CreateProposalVersionCommandHandler } from "../application/proposals/create-proposal-version";
import type { SetCurrentProposalVersionCommandHandler } from "../application/proposals/set-current-proposal-version";
import type { SubmitProposalCommandHandler } from "../application/proposals/submit-proposal";
import type { AssignCommitteeCommandHandler } from "../application/proposals/assign-committee";

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

export interface TransactionRunner {
  runInTransaction<T>(work: () => Promise<T>): Promise<T>;
}

export interface AppHandlers {
  identity: {
    getCurrentIdentity: IdentityQueryHandler;
    getAuthorityContext: AuthorityContextQueryHandler;
  };
  proposals: {
    createDraft: CreateProposalDraftCommandHandler;
    getDetail: GetProposalDetailQueryHandler;
    list: ListProposalsQueryHandler;
    listVersions: ListProposalVersionsQueryHandler;
    createVersion: CreateProposalVersionCommandHandler;
    setCurrentVersion: SetCurrentProposalVersionCommandHandler;
    submit: SubmitProposalCommandHandler;
    assignCommittee: AssignCommitteeCommandHandler;
  };
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
}

export interface AppServices {
  transactionRunner: TransactionRunner;
  idempotencyService: IdempotencyService;
  auditWriter: AuditWriter;
  authenticatedActorService?: AuthenticatedActorService;
  ruleResolutionService?: unknown;
  authorityResolutionService?: unknown;
  tokenValidator?: unknown;
  principalToPersonService?: unknown;
}

export interface AppContext {
  handlers: AppHandlers;
  services: AppServices;
}
```

### 7. `apps/gov-api/src/context/create-publication-app-context.ts`

Replace with:

```ts id="b11pubctx"
import type { AppContext } from "./app-context";
import { prisma } from "../lib/prisma";

import { AuditWriter } from "../application/audit/audit-writer";
import { IdempotencyService } from "../application/shared/idempotency-service";
import { AuthenticatedActorService } from "../application/identity/authenticated-actor-service";
import type { TokenValidator } from "../application/identity/token-validator";
import type { PrincipalToPersonService } from "../application/identity/principal-to-person-service";
import type { AuthorityResolutionService } from "../application/identity/authority-resolution-service";

import { InMemoryAuditRepository } from "../infrastructure/persistence/in-memory/in-memory-audit-repository";
import { InMemoryIdempotencyRepository } from "../infrastructure/persistence/in-memory/in-memory-idempotency-repository";

import { PrismaOfficialRecordRepository } from "../infrastructure/persistence/prisma/prisma-official-record-repository";
import { PrismaGazetteRepository } from "../infrastructure/persistence/prisma/prisma-gazette-repository";

import { CreateOfficialRecordHandler } from "../application/records/create-official-record-handler";
import { GetOfficialRecordHandler } from "../application/records/get-official-record-handler";
import { ListOfficialRecordsHandler } from "../application/records/list-official-records-handler";
import { CreateRecordVersionHandler } from "../application/records/create-record-version-handler";
import { ListRecordVersionsHandler } from "../application/records/list-record-versions-handler";
import { OfficializeOfficialRecordHandler } from "../application/records/officialize-official-record-handler";

import { CreateGazetteIssueHandler } from "../application/gazette/create-gazette-issue-handler";
import { GetGazetteIssueHandler } from "../application/gazette/get-gazette-issue-handler";
import { ListGazetteIssuesHandler } from "../application/gazette/list-gazette-issues-handler";
import { PublishGazetteIssueHandler } from "../application/gazette/publish-gazette-issue-handler";
import { AddRecordToGazetteIssueHandler } from "../application/gazette/add-record-to-gazette-issue-handler";
import { ListGazetteEntriesHandler } from "../application/gazette/list-gazette-entries-handler";

export interface CreatePublicationAppContextOptions {
  tokenValidator?: TokenValidator;
  principalToPersonService?: PrincipalToPersonService;
  authorityResolutionService?: AuthorityResolutionService;
}

function createUnsupportedHandler(name: string) {
  return {
    async execute(): Promise<never> {
      throw new Error(`${name} is not wired in createPublicationAppContext().`);
    },
  } as never;
}

export function createPublicationAppContext(
  options: CreatePublicationAppContextOptions = {},
): AppContext {
  const officialRecordRepository = new PrismaOfficialRecordRepository(prisma as never);
  const gazetteRepository = new PrismaGazetteRepository(prisma as never);

  const auditWriter = new AuditWriter(new InMemoryAuditRepository());
  const idempotencyService = new IdempotencyService(new InMemoryIdempotencyRepository());

  const authenticatedActorService =
    options.tokenValidator &&
    options.principalToPersonService &&
    options.authorityResolutionService
      ? new AuthenticatedActorService(
          options.tokenValidator,
          options.principalToPersonService,
          options.authorityResolutionService,
        )
      : undefined;

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
      authenticatedActorService,
      tokenValidator: options.tokenValidator,
      principalToPersonService: options.principalToPersonService,
      authorityResolutionService: options.authorityResolutionService,
      ruleResolutionService: undefined,
    },
  };
}
```

### 18. `apps/gov-api/src/app-publication.ts`

Replace with:

```ts id="b11pubapp"
import { Hono } from "hono";
import type { HonoEnv } from "./types/hono";
import type { AppContext } from "./context/app-context";

import { requestContextMiddleware } from "./middleware/request-context";
import { authenticateRequestMiddleware } from "./middleware/authenticate-request";
import { errorHandler } from "./middleware/error-handler";

import { createOfficialRecordRoutes } from "./routes/official-records";
import { createGazetteRoutes } from "./routes/gazette";

import {
  createPublicationAppContext,
  type CreatePublicationAppContextOptions,
} from "./context/create-publication-app-context";

export interface CreatePublicationAppOptions {
  appContext?: AppContext;
  appContextOptions?: CreatePublicationAppContextOptions;
}

export function createPublicationApp(
  options: CreatePublicationAppOptions = {},
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

  app.route("/official-records", createOfficialRecordRoutes());
  app.route("/gazette", createGazetteRoutes());

  return app;
}
```

### 19. `apps/gov-api/src/middleware/authenticate-request.test.ts`

```ts id="b11mtest"
import { describe, expect, it, vi } from "vitest";
import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { requestContextMiddleware } from "./request-context";
import { authenticateRequestMiddleware } from "./authenticate-request";
import { errorHandler } from "./error-handler";

describe("authenticateRequestMiddleware", () => {
  it("resolves an authenticated actor from a bearer token", async () => {
    const app = new Hono<HonoEnv>();

    app.use("*", requestContextMiddleware);
    app.use("*", async (c, next) => {
      c.set("appContext", {
        handlers: {} as never,
        services: {
          transactionRunner: {
            runInTransaction: async <T>(work: () => Promise<T>) => work(),
          },
          idempotencyService: {} as never,
          auditWriter: {} as never,
          authenticatedActorService: {
            resolveFromBearerToken: vi.fn(async () => ({
              personId: "person-1",
              userAccountId: "user-1",
              memberId: "member-1",
              email: "thomas@example.com",
              roles: ["registrar"],
              authorityGrants: ["record.read"],
              isAuthenticated: true,
            })),
          } as never,
        },
      });
      await next();
    });
    app.use("*", authenticateRequestMiddleware);
    app.use("*", errorHandler);

    app.get("/whoami", (c) => {
      return c.json(c.get("requestContext").actor, 200);
    });

    const res = await app.request("http://localhost/whoami", {
      headers: {
        authorization: "Bearer test-token",
      },
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.personId).toBe("person-1");
    expect(body.isAuthenticated).toBe(true);
  });

  it("leaves actor null when there is no authorization header", async () => {
    const app = new Hono<HonoEnv>();

    app.use("*", requestContextMiddleware);
    app.use("*", async (c, next) => {
      c.set("appContext", {
        handlers: {} as never,
        services: {
          transactionRunner: {
            runInTransaction: async <T>(work: () => Promise<T>) => work(),
          },
          idempotencyService: {} as never,
          auditWriter: {} as never,
        },
      });
      await next();
    });
    app.use("*", authenticateRequestMiddleware);
    app.use("*", errorHandler);

    app.get("/whoami", (c) => {
      return c.json({ actor: c.get("requestContext").actor }, 200);
    });

    const res = await app.request("http://localhost/whoami");

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.actor).toBeNull();
  });
});
```

### 20. `apps/gov-api/src/app-publication.test.ts`

```ts id="b11apptest"
import { describe, expect, it } from "vitest";
import { createPublicationApp } from "./app-publication";

describe("createPublicationApp", () => {
  it("mounts official records and gazette routes", async () => {
    const app = createPublicationApp({
      appContext: {
        handlers: {
          identity: {} as never,
          proposals: {} as never,
          records: {
            create: {
              async execute() {
                return {
                  id: "record-1",
                  recordType: "ACT",
                  title: "Act I",
                  sourceEntityType: "Proposal",
                  sourceEntityId: "proposal-1",
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
            createIssue: { async execute() { throw new Error("unused"); } },
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
                roles: ["registrar"],
                authorityGrants: ["record.create", "record.read"],
                isAuthenticated: true,
              };
            },
          } as never,
        },
      },
    });

    const res = await app.request("http://localhost/official-records", {
      method: "POST",
      headers: {
        authorization: "Bearer token",
        "content-type": "application/json",
        "idempotency-key": "idem-1",
      },
      body: JSON.stringify({
        recordType: "ACT",
        title: "Act I",
        sourceEntityType: "Proposal",
        sourceEntityId: "proposal-1",
      }),
    });

    expect([200, 201]).toContain(res.status);
  });
});
```

This batch does three important things:

It turns the richer publication app into something that can resolve an authenticated actor from a bearer token rather than relying on per-test actor injection.

It gives `AppContext.services` concrete auth types instead of opaque `unknown` placeholders, which makes the wiring surface much cleaner.

It preserves your existing richer route stack for `/official-records` and `/gazette` and wires them through one mountable app, instead of introducing yet another parallel architecture.

Progress: **74% complete**

The next strongest batch is the **concrete auth adapters**:
a real `TokenValidator` implementation, a Prisma-backed `PrincipalToPersonService`, and a Prisma-backed `AuthorityResolutionService` so the publication app can authenticate against actual user/member/role data rather than only injected services.
