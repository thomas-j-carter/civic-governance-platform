## Batch 12 — concrete auth adapters

This batch adds the **concrete auth adapters** so the richer publication app can authenticate and resolve authorities against real data instead of only injected test doubles.

### 1. `apps/gov-api/src/infrastructure/auth/jwt-token-validator.ts`

```ts id="b12jwt"
import { createRemoteJWKSet, importSPKI, jwtVerify } from "jose";
import type { TokenValidator, ValidatedTokenClaims } from "../../application/identity/token-validator";

export interface JwtTokenValidatorOptions {
  issuer: string;
  audience?: string | string[];
  jwksUrl?: string;
  publicKeyPem?: string;
  hmacSecret?: string;
  clockToleranceSeconds?: number;
}

export class JwtTokenValidator implements TokenValidator {
  constructor(private readonly options: JwtTokenValidatorOptions) {}

  async validateBearerToken(token: string): Promise<ValidatedTokenClaims> {
    const key = await this.resolveVerificationKey();

    const { payload } = await jwtVerify(token, key as never, {
      issuer: this.options.issuer,
      audience: this.options.audience,
      clockTolerance: this.options.clockToleranceSeconds ?? 5,
    });

    if (typeof payload.sub !== "string" || payload.sub.trim().length === 0) {
      throw new Error("Validated token is missing subject.");
    }

    return {
      principalId: payload.sub,
      subject: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      claims: payload as Record<string, unknown>,
    };
  }

  private async resolveVerificationKey() {
    if (this.options.jwksUrl) {
      return createRemoteJWKSet(new URL(this.options.jwksUrl));
    }

    if (this.options.publicKeyPem) {
      return importSPKI(this.options.publicKeyPem, "RS256");
    }

    if (this.options.hmacSecret) {
      return new TextEncoder().encode(this.options.hmacSecret);
    }

    throw new Error(
      "JWT verification is not configured. Provide jwksUrl, publicKeyPem, or hmacSecret.",
    );
  }
}
```

---

### 2. `apps/gov-api/src/infrastructure/identity/prisma-principal-to-person-service.ts`

```ts id="b12ppps"
import type {
  PrincipalToPersonResult,
  PrincipalToPersonService,
} from "../../application/identity/principal-to-person-service";

type PrismaLike = {
  externalIdentity: {
    findFirst(args: unknown): Promise<any | null>;
  };
  userAccount: {
    findFirst(args: unknown): Promise<any | null>;
  };
  person: {
    findFirst(args: unknown): Promise<any | null>;
  };
  member: {
    findUnique(args: unknown): Promise<any | null>;
  };
};

export class PrismaPrincipalToPersonService implements PrincipalToPersonService {
  constructor(private readonly prisma: PrismaLike) {}

  async resolvePrincipal(input: {
    principalId: string;
    subject: string;
    email?: string;
    claims: Record<string, unknown>;
  }): Promise<PrincipalToPersonResult | null> {
    const issuer =
      typeof input.claims.iss === "string" && input.claims.iss.trim().length > 0
        ? input.claims.iss
        : undefined;

    const preferredUsername =
      typeof input.claims.preferred_username === "string" &&
      input.claims.preferred_username.trim().length > 0
        ? input.claims.preferred_username
        : undefined;

    if (issuer) {
      const externalIdentity = await this.prisma.externalIdentity.findFirst({
        where: {
          provider: issuer,
          providerSubject: input.subject,
        },
        include: {
          userAccount: true,
          person: true,
        },
      });

      if (externalIdentity) {
        return this.toPrincipalResult({
          person:
            externalIdentity.person ??
            (externalIdentity.userAccount
              ? {
                  id: externalIdentity.userAccount.personId,
                  primaryEmail: input.email,
                }
              : null),
          userAccount: externalIdentity.userAccount ?? null,
          fallbackEmail: input.email,
        });
      }
    }

    const subjectMatch = await this.prisma.externalIdentity.findFirst({
      where: {
        providerSubject: input.subject,
      },
      include: {
        userAccount: true,
        person: true,
      },
    });

    if (subjectMatch) {
      return this.toPrincipalResult({
        person:
          subjectMatch.person ??
          (subjectMatch.userAccount
            ? {
                id: subjectMatch.userAccount.personId,
                primaryEmail: input.email,
              }
            : null),
        userAccount: subjectMatch.userAccount ?? null,
        fallbackEmail: input.email,
      });
    }

    if (preferredUsername) {
      const userAccount = await this.prisma.userAccount.findFirst({
        where: {
          username: preferredUsername,
        },
        include: {
          person: true,
        },
      });

      if (userAccount?.person) {
        return this.toPrincipalResult({
          person: userAccount.person,
          userAccount,
          fallbackEmail: input.email,
        });
      }
    }

    if (input.email) {
      const person = await this.prisma.person.findFirst({
        where: {
          primaryEmail: input.email,
        },
      });

      if (person) {
        return this.toPrincipalResult({
          person,
          userAccount: null,
          fallbackEmail: input.email,
        });
      }
    }

    return null;
  }

  private async toPrincipalResult(args: {
    person: { id: string; primaryEmail?: string | null } | null;
    userAccount: { id: string; personId: string } | null;
    fallbackEmail?: string;
  }): Promise<PrincipalToPersonResult | null> {
    if (!args.person) {
      return null;
    }

    const member = await this.prisma.member.findUnique({
      where: {
        personId: args.person.id,
      },
    });

    return {
      personId: args.person.id,
      userAccountId: args.userAccount?.id,
      memberId: member?.id,
      email: args.person.primaryEmail ?? args.fallbackEmail,
    };
  }
}
```

---

### 3. `apps/gov-api/src/infrastructure/identity/prisma-authority-resolution-service.ts`

```ts id="b12pars"
import type {
  AuthorityResolution,
  AuthorityResolutionService,
} from "../../application/identity/authority-resolution-service";

type PrismaLike = {
  roleAssignment: {
    findMany(args: unknown): Promise<any[]>;
  };
  officeHolder: {
    findMany(args: unknown): Promise<any[]>;
  };
  delegation: {
    findMany(args: unknown): Promise<any[]>;
  };
};

export class PrismaAuthorityResolutionService implements AuthorityResolutionService {
  constructor(private readonly prisma: PrismaLike) {}

  async resolveAuthorities(input: {
    personId: string;
    userAccountId?: string;
    memberId?: string;
  }): Promise<AuthorityResolution> {
    const now = new Date();

    const roleAssignments = await this.prisma.roleAssignment.findMany({
      where: {
        personId: input.personId,
        revokedAt: null,
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      include: {
        role: {
          include: {
            authorityGrants: {
              include: {
                authorityGrant: true,
              },
            },
          },
        },
      },
    });

    const officeHolders = await this.prisma.officeHolder.findMany({
      where: {
        personId: input.personId,
        status: "ACTIVE",
        OR: [{ endedAt: null }, { endedAt: { gt: now } }],
      },
      include: {
        office: {
          include: {
            authorityGrants: {
              include: {
                authorityGrant: true,
              },
            },
          },
        },
      },
    });

    const delegations = await this.prisma.delegation.findMany({
      where: {
        delegatePersonId: input.personId,
        revokedAt: null,
        effectiveAt: { lte: now },
        OR: [{ expiresAt: null }, { expiresAt: { gt: now } }],
      },
      include: {
        authorityGrants: {
          include: {
            authorityGrant: true,
          },
        },
      },
    });

    const roles = new Set<string>();
    const authorityGrants = new Set<string>();

    for (const assignment of roleAssignments) {
      if (assignment.role?.code) {
        roles.add(assignment.role.code);
      }

      for (const mapping of assignment.role?.authorityGrants ?? []) {
        if (mapping.authorityGrant?.code) {
          authorityGrants.add(mapping.authorityGrant.code);
        }
      }
    }

    for (const officeHolder of officeHolders) {
      for (const mapping of officeHolder.office?.authorityGrants ?? []) {
        if (mapping.authorityGrant?.code) {
          authorityGrants.add(mapping.authorityGrant.code);
        }
      }
    }

    for (const delegation of delegations) {
      for (const mapping of delegation.authorityGrants ?? []) {
        if (mapping.authorityGrant?.code) {
          authorityGrants.add(mapping.authorityGrant.code);
        }
      }
    }

    return {
      roles: Array.from(roles).sort(),
      authorityGrants: Array.from(authorityGrants).sort(),
    };
  }
}
```

---

### 4. `apps/gov-api/src/middleware/authenticate-request.ts`

Replace with:

```ts id="b12authmw"
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

  const token = value.trim();
  return token.length > 0 ? token : null;
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

  try {
    const actor = await authenticatedActorService.resolveFromBearerToken(token);

    if (!actor) {
      throw new UnauthorizedError("Unable to resolve authenticated actor.");
    }

    requestContext.actor = actor;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }

    throw new UnauthorizedError("Invalid bearer token.");
  }

  await next();
};
```

---

### 5. `apps/gov-api/src/context/create-publication-app-context.ts`

Replace with:

```ts id="b12pubctx"
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
import { JwtTokenValidator } from "../infrastructure/auth/jwt-token-validator";
import { PrismaPrincipalToPersonService } from "../infrastructure/identity/prisma-principal-to-person-service";
import { PrismaAuthorityResolutionService } from "../infrastructure/identity/prisma-authority-resolution-service";

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

function createDefaultTokenValidator(): TokenValidator | undefined {
  const issuer = process.env.AUTH_JWT_ISSUER;
  const audience = process.env.AUTH_JWT_AUDIENCE;
  const jwksUrl = process.env.AUTH_JWKS_URL;
  const publicKeyPem = process.env.AUTH_JWT_PUBLIC_KEY;
  const hmacSecret = process.env.AUTH_JWT_SECRET;

  if (!issuer) {
    return undefined;
  }

  if (!jwksUrl && !publicKeyPem && !hmacSecret) {
    return undefined;
  }

  return new JwtTokenValidator({
    issuer,
    audience,
    jwksUrl,
    publicKeyPem,
    hmacSecret,
    clockToleranceSeconds: 5,
  });
}

export function createPublicationAppContext(
  options: CreatePublicationAppContextOptions = {},
): AppContext {
  const officialRecordRepository = new PrismaOfficialRecordRepository(prisma as never);
  const gazetteRepository = new PrismaGazetteRepository(prisma as never);

  const auditWriter = new AuditWriter(new InMemoryAuditRepository());
  const idempotencyService = new IdempotencyService(new InMemoryIdempotencyRepository());

  const tokenValidator =
    options.tokenValidator ?? createDefaultTokenValidator();

  const principalToPersonService =
    options.principalToPersonService ??
    new PrismaPrincipalToPersonService(prisma as never);

  const authorityResolutionService =
    options.authorityResolutionService ??
    new PrismaAuthorityResolutionService(prisma as never);

  const authenticatedActorService = tokenValidator
    ? new AuthenticatedActorService(
        tokenValidator,
        principalToPersonService,
        authorityResolutionService,
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
      tokenValidator,
      principalToPersonService,
      authorityResolutionService,
      ruleResolutionService: undefined,
    },
  };
}
```

---

### 6. `apps/gov-api/src/infrastructure/identity/prisma-principal-to-person-service.test.ts`

```ts id="b12pppst"
import { describe, expect, it } from "vitest";
import { PrismaPrincipalToPersonService } from "./prisma-principal-to-person-service";

describe("PrismaPrincipalToPersonService", () => {
  it("resolves a person through external identity match", async () => {
    const service = new PrismaPrincipalToPersonService({
      externalIdentity: {
        async findFirst() {
          return {
            person: {
              id: "person-1",
              primaryEmail: "thomas@example.com",
            },
            userAccount: {
              id: "user-1",
              personId: "person-1",
            },
          };
        },
      },
      userAccount: {
        async findFirst() {
          return null;
        },
      },
      person: {
        async findFirst() {
          return null;
        },
      },
      member: {
        async findUnique() {
          return { id: "member-1" };
        },
      },
    } as never);

    const result = await service.resolvePrincipal({
      principalId: "sub-1",
      subject: "sub-1",
      email: "thomas@example.com",
      claims: {
        iss: "https://id.example.test/realms/ardtire",
      },
    });

    expect(result).toEqual({
      personId: "person-1",
      userAccountId: "user-1",
      memberId: "member-1",
      email: "thomas@example.com",
    });
  });

  it("falls back to email match when external identity is absent", async () => {
    const service = new PrismaPrincipalToPersonService({
      externalIdentity: {
        async findFirst() {
          return null;
        },
      },
      userAccount: {
        async findFirst() {
          return null;
        },
      },
      person: {
        async findFirst() {
          return {
            id: "person-2",
            primaryEmail: "fallback@example.com",
          };
        },
      },
      member: {
        async findUnique() {
          return null;
        },
      },
    } as never);

    const result = await service.resolvePrincipal({
      principalId: "sub-2",
      subject: "sub-2",
      email: "fallback@example.com",
      claims: {},
    });

    expect(result).toEqual({
      personId: "person-2",
      userAccountId: undefined,
      memberId: undefined,
      email: "fallback@example.com",
    });
  });
});
```

---

### 7. `apps/gov-api/src/infrastructure/identity/prisma-authority-resolution-service.test.ts`

```ts id="b12parst"
import { describe, expect, it } from "vitest";
import { PrismaAuthorityResolutionService } from "./prisma-authority-resolution-service";

describe("PrismaAuthorityResolutionService", () => {
  it("collects roles and authority grants from roles, offices, and delegations", async () => {
    const service = new PrismaAuthorityResolutionService({
      roleAssignment: {
        async findMany() {
          return [
            {
              role: {
                code: "registrar",
                authorityGrants: [
                  {
                    authorityGrant: {
                      code: "record.create",
                    },
                  },
                  {
                    authorityGrant: {
                      code: "record.read",
                    },
                  },
                ],
              },
            },
          ];
        },
      },
      officeHolder: {
        async findMany() {
          return [
            {
              office: {
                authorityGrants: [
                  {
                    authorityGrant: {
                      code: "gazette.issue.publish",
                    },
                  },
                ],
              },
            },
          ];
        },
      },
      delegation: {
        async findMany() {
          return [
            {
              authorityGrants: [
                {
                  authorityGrant: {
                    code: "record.officialize",
                  },
                },
              ],
            },
          ];
        },
      },
    } as never);

    const result = await service.resolveAuthorities({
      personId: "person-1",
      userAccountId: "user-1",
      memberId: "member-1",
    });

    expect(result.roles).toEqual(["registrar"]);
    expect(result.authorityGrants).toEqual([
      "gazette.issue.publish",
      "record.create",
      "record.officialize",
      "record.read",
    ]);
  });
});
```

---

### 8. `apps/gov-api/src/application/identity/authenticated-actor-service.test.ts`

```ts id="b12aast"
import { describe, expect, it } from "vitest";
import { AuthenticatedActorService } from "./authenticated-actor-service";

describe("AuthenticatedActorService", () => {
  it("builds an authenticated actor from token, principal, and authority services", async () => {
    const service = new AuthenticatedActorService(
      {
        async validateBearerToken() {
          return {
            principalId: "sub-1",
            subject: "sub-1",
            email: "thomas@example.com",
            claims: {
              sub: "sub-1",
            },
          };
        },
      },
      {
        async resolvePrincipal() {
          return {
            personId: "person-1",
            userAccountId: "user-1",
            memberId: "member-1",
            email: "thomas@example.com",
          };
        },
      },
      {
        async resolveAuthorities() {
          return {
            roles: ["registrar"],
            authorityGrants: ["record.create", "record.read"],
          };
        },
      },
    );

    const result = await service.resolveFromBearerToken("token-1");

    expect(result).toEqual({
      personId: "person-1",
      userAccountId: "user-1",
      memberId: "member-1",
      email: "thomas@example.com",
      roles: ["registrar"],
      authorityGrants: ["record.create", "record.read"],
      isAuthenticated: true,
    });
  });
});
```

---

### 9. `apps/gov-api/package.json`

Add `jose` to dependencies:

```json id="b12pkg"
{
  "dependencies": {
    "jose": "latest"
  }
}
```

## What this batch does

This replaces the remaining abstract auth gap with concrete pieces:

* JWT bearer token validation
* principal → person/user/member resolution from Prisma-backed identity data
* role/office/delegation-based authority aggregation from Prisma-backed governance data
* automatic construction of `AuthenticatedActorService` in `createPublicationAppContext()`
* safer auth middleware behavior for invalid tokens

That means the richer publication app can now do:

**Authorization header → validated token → resolved person/member → resolved roles/authority grants → `requireAuth` / `requireAuthority`**

## Strongest next step

The best next batch is the **runtime completion batch**:
environment/config documentation, `lib/prisma.ts` confirmation/wiring, a real server entrypoint for `app-publication`, and a focused end-to-end publication-flow test that exercises:

proposal outcome → official record → record version → officialize → gazette issue → add record to issue → publish issue
