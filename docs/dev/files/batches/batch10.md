## Batch 10 — publication wiring layer

### 1. `apps/gov-api/src/domain/gazette/gazette-issue.ts`

```ts id="7u3r5a"
export interface GazetteIssue {
  id: string;
  issueNumber?: string;
  title: string;
  publicationState: string;
  scheduledFor?: string;
  publishedAt?: string;
  createdByPersonId: string;
  createdAt: string;
  updatedAt: string;
}
```

### 2. `apps/gov-api/src/domain/gazette/gazette-entry.ts`

```ts id="a1m2kf"
export interface GazetteEntry {
  id: string;
  gazetteIssueId: string;
  officialRecordId: string;
  titleSnapshot: string;
  summarySnapshot?: string;
  publicationOrder: number;
  publishedAt?: string;
  createdAt: string;
}
```

### 3. `apps/gov-api/src/domain/gazette/gazette-repository.ts`

```ts id="4jlwmk"
import type { GazetteIssue } from "./gazette-issue";
import type { GazetteEntry } from "./gazette-entry";

export interface GazetteIssueRepository {
  createIssue(issue: GazetteIssue): Promise<void>;
  getIssueById(issueId: string): Promise<GazetteIssue | null>;
  listIssues(): Promise<GazetteIssue[]>;
  updateIssue(issue: GazetteIssue): Promise<void>;
}

export interface GazetteEntryRepository {
  createEntry(entry: GazetteEntry): Promise<void>;
  listEntriesByIssueId(gazetteIssueId: string): Promise<GazetteEntry[]>;
}
```

### 4. `apps/gov-api/src/infrastructure/persistence/in-memory/in-memory-gazette-repository.ts`

```ts id="ovt7s8"
import type {
  GazetteEntryRepository,
  GazetteIssueRepository,
} from "../../../domain/gazette/gazette-repository";
import type { GazetteIssue } from "../../../domain/gazette/gazette-issue";
import type { GazetteEntry } from "../../../domain/gazette/gazette-entry";

export class InMemoryGazetteIssueRepository
  implements GazetteIssueRepository, GazetteEntryRepository
{
  private readonly issues = new Map<string, GazetteIssue>();
  private readonly entries = new Map<string, GazetteEntry[]>();

  async createIssue(issue: GazetteIssue): Promise<void> {
    this.issues.set(issue.id, issue);
  }

  async getIssueById(issueId: string): Promise<GazetteIssue | null> {
    return this.issues.get(issueId) ?? null;
  }

  async listIssues(): Promise<GazetteIssue[]> {
    return Array.from(this.issues.values()).sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }

  async updateIssue(issue: GazetteIssue): Promise<void> {
    this.issues.set(issue.id, issue);
  }

  async createEntry(entry: GazetteEntry): Promise<void> {
    const current = this.entries.get(entry.gazetteIssueId) ?? [];
    current.push(entry);
    current.sort((a, b) => a.publicationOrder - b.publicationOrder);
    this.entries.set(entry.gazetteIssueId, current);
  }

  async listEntriesByIssueId(gazetteIssueId: string): Promise<GazetteEntry[]> {
    return [...(this.entries.get(gazetteIssueId) ?? [])];
  }
}
```

### 5. `apps/gov-api/src/infrastructure/persistence/prisma/prisma-official-record-repository.ts`

```ts id="9jlwm1"
import type { OfficialRecordRepository } from "../../../domain/records/official-record-repository";
import type { OfficialRecord } from "../../../domain/records/official-record";
import type { RecordVersion } from "../../../domain/records/record-version";

type PrismaLike = {
  officialRecord: {
    create(args: unknown): Promise<unknown>;
    findUnique(args: unknown): Promise<any | null>;
    findMany(args: unknown): Promise<any[]>;
    update(args: unknown): Promise<unknown>;
  };
  recordVersion: {
    create(args: unknown): Promise<unknown>;
    findMany(args: unknown): Promise<any[]>;
    findFirst(args: unknown): Promise<any | null>;
  };
};

function toOfficialRecord(row: any): OfficialRecord {
  return {
    id: row.id,
    recordType: row.recordType,
    title: row.title,
    summary: row.summary ?? undefined,
    sourceEntityType: row.sourceEntityType,
    sourceEntityId: row.sourceEntityId,
    status: row.status,
    officializedAt: row.officializedAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toRecordVersion(row: any): RecordVersion {
  return {
    id: row.id,
    officialRecordId: row.officialRecordId,
    versionNumber: row.versionNumber,
    bodyMarkdown: row.bodyMarkdown,
    changeSummary: row.changeSummary ?? undefined,
    createdByPersonId: row.createdByPersonId ?? undefined,
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaOfficialRecordRepository implements OfficialRecordRepository {
  constructor(private readonly prisma: PrismaLike) {}

  async createOfficialRecord(record: OfficialRecord): Promise<void> {
    await this.prisma.officialRecord.create({
      data: {
        id: record.id,
        recordType: record.recordType,
        title: record.title,
        summary: record.summary,
        sourceEntityType: record.sourceEntityType,
        sourceEntityId: record.sourceEntityId,
        status: record.status,
        officializedAt: record.officializedAt ? new Date(record.officializedAt) : null,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
      },
    });
  }

  async getOfficialRecordById(recordId: string): Promise<OfficialRecord | null> {
    const row = await this.prisma.officialRecord.findUnique({
      where: { id: recordId },
    });

    return row ? toOfficialRecord(row) : null;
  }

  async listOfficialRecords(): Promise<OfficialRecord[]> {
    const rows = await this.prisma.officialRecord.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(toOfficialRecord);
  }

  async updateOfficialRecord(record: OfficialRecord): Promise<void> {
    await this.prisma.officialRecord.update({
      where: { id: record.id },
      data: {
        recordType: record.recordType,
        title: record.title,
        summary: record.summary,
        sourceEntityType: record.sourceEntityType,
        sourceEntityId: record.sourceEntityId,
        status: record.status,
        officializedAt: record.officializedAt ? new Date(record.officializedAt) : null,
        updatedAt: new Date(record.updatedAt),
      },
    });
  }

  async createRecordVersion(version: RecordVersion): Promise<void> {
    await this.prisma.recordVersion.create({
      data: {
        id: version.id,
        officialRecordId: version.officialRecordId,
        versionNumber: version.versionNumber,
        bodyMarkdown: version.bodyMarkdown,
        changeSummary: version.changeSummary,
        createdByPersonId: version.createdByPersonId,
        createdAt: new Date(version.createdAt),
      },
    });
  }

  async listRecordVersionsForRecord(recordId: string): Promise<RecordVersion[]> {
    const rows = await this.prisma.recordVersion.findMany({
      where: {
        officialRecordId: recordId,
      },
      orderBy: {
        versionNumber: "asc",
      },
    });

    return rows.map(toRecordVersion);
  }

  async getLatestVersionNumberForRecord(recordId: string): Promise<number> {
    const row = await this.prisma.recordVersion.findFirst({
      where: {
        officialRecordId: recordId,
      },
      orderBy: {
        versionNumber: "desc",
      },
    });

    return row?.versionNumber ?? 0;
  }
}
```

### 6. `apps/gov-api/src/infrastructure/persistence/prisma/prisma-gazette-repository.ts`

```ts id="k2j5dr"
import type {
  GazetteEntryRepository,
  GazetteIssueRepository,
} from "../../../domain/gazette/gazette-repository";
import type { GazetteIssue } from "../../../domain/gazette/gazette-issue";
import type { GazetteEntry } from "../../../domain/gazette/gazette-entry";

type PrismaLike = {
  gazetteIssue: {
    create(args: unknown): Promise<unknown>;
    findUnique(args: unknown): Promise<any | null>;
    findMany(args: unknown): Promise<any[]>;
    update(args: unknown): Promise<unknown>;
  };
  gazetteEntry: {
    create(args: unknown): Promise<unknown>;
    findMany(args: unknown): Promise<any[]>;
  };
};

function toGazetteIssue(row: any): GazetteIssue {
  return {
    id: row.id,
    issueNumber: row.issueNumber ?? undefined,
    title: row.title,
    publicationState: row.publicationState,
    scheduledFor: row.scheduledFor?.toISOString(),
    publishedAt: row.publishedAt?.toISOString(),
    createdByPersonId: row.createdByPersonId,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function toGazetteEntry(row: any): GazetteEntry {
  return {
    id: row.id,
    gazetteIssueId: row.gazetteIssueId,
    officialRecordId: row.officialRecordId,
    titleSnapshot: row.titleSnapshot,
    summarySnapshot: row.summarySnapshot ?? undefined,
    publicationOrder: row.publicationOrder,
    publishedAt: row.publishedAt?.toISOString(),
    createdAt: row.createdAt.toISOString(),
  };
}

export class PrismaGazetteRepository
  implements GazetteIssueRepository, GazetteEntryRepository
{
  constructor(private readonly prisma: PrismaLike) {}

  async createIssue(issue: GazetteIssue): Promise<void> {
    await this.prisma.gazetteIssue.create({
      data: {
        id: issue.id,
        issueNumber: issue.issueNumber,
        title: issue.title,
        publicationState: issue.publicationState,
        scheduledFor: issue.scheduledFor ? new Date(issue.scheduledFor) : null,
        publishedAt: issue.publishedAt ? new Date(issue.publishedAt) : null,
        createdByPersonId: issue.createdByPersonId,
        createdAt: new Date(issue.createdAt),
        updatedAt: new Date(issue.updatedAt),
      },
    });
  }

  async getIssueById(issueId: string): Promise<GazetteIssue | null> {
    const row = await this.prisma.gazetteIssue.findUnique({
      where: { id: issueId },
    });

    return row ? toGazetteIssue(row) : null;
  }

  async listIssues(): Promise<GazetteIssue[]> {
    const rows = await this.prisma.gazetteIssue.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return rows.map(toGazetteIssue);
  }

  async updateIssue(issue: GazetteIssue): Promise<void> {
    await this.prisma.gazetteIssue.update({
      where: { id: issue.id },
      data: {
        issueNumber: issue.issueNumber,
        title: issue.title,
        publicationState: issue.publicationState,
        scheduledFor: issue.scheduledFor ? new Date(issue.scheduledFor) : null,
        publishedAt: issue.publishedAt ? new Date(issue.publishedAt) : null,
        updatedAt: new Date(issue.updatedAt),
      },
    });
  }

  async createEntry(entry: GazetteEntry): Promise<void> {
    await this.prisma.gazetteEntry.create({
      data: {
        id: entry.id,
        gazetteIssueId: entry.gazetteIssueId,
        officialRecordId: entry.officialRecordId,
        titleSnapshot: entry.titleSnapshot,
        summarySnapshot: entry.summarySnapshot,
        publicationOrder: entry.publicationOrder,
        publishedAt: entry.publishedAt ? new Date(entry.publishedAt) : null,
        createdAt: new Date(entry.createdAt),
      },
    });
  }

  async listEntriesByIssueId(gazetteIssueId: string): Promise<GazetteEntry[]> {
    const rows = await this.prisma.gazetteEntry.findMany({
      where: { gazetteIssueId },
      orderBy: {
        publicationOrder: "asc",
      },
    });

    return rows.map(toGazetteEntry);
  }
}
```

### 7. `apps/gov-api/src/application/gazette/get-gazette-issue.ts`

```ts id="fu420z"
import type { GazetteIssueDto } from "./create-gazette-issue";

export interface GetGazetteIssueQuery {
  issueId: string;
}

export interface GetGazetteIssueQueryHandler {
  execute(query: GetGazetteIssueQuery): Promise<GazetteIssueDto | null>;
}
```

### 8. `apps/gov-api/src/application/gazette/get-gazette-issue-handler.ts`

```ts id="2r1n1f"
import type { GazetteIssueRepository } from "../../domain/gazette/gazette-repository";
import type {
  GetGazetteIssueQuery,
  GetGazetteIssueQueryHandler,
} from "./get-gazette-issue";
import type { GazetteIssueDto } from "./create-gazette-issue";
import { toGazetteIssueDto } from "./gazette-mappers";

export class GetGazetteIssueHandler implements GetGazetteIssueQueryHandler {
  constructor(private readonly gazetteIssueRepository: GazetteIssueRepository) {}

  async execute(query: GetGazetteIssueQuery): Promise<GazetteIssueDto | null> {
    const issue = await this.gazetteIssueRepository.getIssueById(query.issueId);
    return issue ? toGazetteIssueDto(issue) : null;
  }
}
```

### 9. `apps/gov-api/src/application/gazette/list-gazette-issues.ts`

```ts id="qsqqkc"
import type { GazetteIssueDto } from "./create-gazette-issue";

export interface ListGazetteIssuesQueryHandler {
  execute(): Promise<GazetteIssueDto[]>;
}
```

### 10. `apps/gov-api/src/application/gazette/list-gazette-issues-handler.ts`

```ts id="do4j8r"
import type { GazetteIssueRepository } from "../../domain/gazette/gazette-repository";
import type { ListGazetteIssuesQueryHandler } from "./list-gazette-issues";
import type { GazetteIssueDto } from "./create-gazette-issue";
import { toGazetteIssueDto } from "./gazette-mappers";

export class ListGazetteIssuesHandler implements ListGazetteIssuesQueryHandler {
  constructor(private readonly gazetteIssueRepository: GazetteIssueRepository) {}

  async execute(): Promise<GazetteIssueDto[]> {
    const issues = await this.gazetteIssueRepository.listIssues();
    return issues.map(toGazetteIssueDto);
  }
}
```

### 11. `apps/gov-api/src/application/gazette/add-record-to-gazette-issue.ts`

```ts id="uoqk9d"
export interface GazetteEntryDto {
  id: string;
  gazetteIssueId: string;
  officialRecordId: string;
  titleSnapshot: string;
  summarySnapshot?: string;
  publicationOrder: number;
  publishedAt?: string;
  createdAt: string;
}

export interface AddRecordToGazetteIssueCommand {
  actor: {
    personId: string;
  };
  input: {
    gazetteIssueId: string;
    officialRecordId: string;
    publicationOrder?: number;
  };
}

export interface AddRecordToGazetteIssueCommandHandler {
  execute(command: AddRecordToGazetteIssueCommand): Promise<GazetteEntryDto>;
}
```

### 12. `apps/gov-api/src/application/gazette/add-record-to-gazette-issue-handler.ts`

```ts id="8h21ff"
import { ConflictError, NotFoundError } from "../../http/errors";
import type { GazetteEntryRepository, GazetteIssueRepository } from "../../domain/gazette/gazette-repository";
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type { AuditWriter } from "../audit/audit-writer";
import type {
  AddRecordToGazetteIssueCommand,
  AddRecordToGazetteIssueCommandHandler,
  GazetteEntryDto,
} from "./add-record-to-gazette-issue";
import { toGazetteEntryDto } from "./gazette-mappers";

export class AddRecordToGazetteIssueHandler implements AddRecordToGazetteIssueCommandHandler {
  constructor(
    private readonly gazetteIssueRepository: GazetteIssueRepository,
    private readonly gazetteEntryRepository: GazetteEntryRepository,
    private readonly officialRecordRepository: OfficialRecordRepository,
    private readonly auditWriter: AuditWriter,
  ) {}

  async execute(command: AddRecordToGazetteIssueCommand): Promise<GazetteEntryDto> {
    const issue = await this.gazetteIssueRepository.getIssueById(command.input.gazetteIssueId);

    if (!issue) {
      throw new NotFoundError(`Gazette issue ${command.input.gazetteIssueId} was not found.`);
    }

    if (issue.publicationState === "PUBLISHED") {
      throw new ConflictError("Cannot modify a published gazette issue.", {
        code: "gazette_issue_already_published",
      });
    }

    const record = await this.officialRecordRepository.getOfficialRecordById(
      command.input.officialRecordId,
    );

    if (!record) {
      throw new NotFoundError(`Official record ${command.input.officialRecordId} was not found.`);
    }

    if (record.status !== "OFFICIAL" && record.status !== "PUBLISHED") {
      throw new ConflictError("Only official or published records may be added to gazette issues.", {
        code: "official_record_not_officialized",
      });
    }

    const existingEntries = await this.gazetteEntryRepository.listEntriesByIssueId(issue.id);

    if (existingEntries.some((entry) => entry.officialRecordId === record.id)) {
      throw new ConflictError("Official record is already present in this gazette issue.", {
        code: "gazette_entry_already_exists",
      });
    }

    const entry = {
      id: crypto.randomUUID(),
      gazetteIssueId: issue.id,
      officialRecordId: record.id,
      titleSnapshot: record.title,
      summarySnapshot: record.summary,
      publicationOrder:
        command.input.publicationOrder ??
        (existingEntries.length === 0
          ? 1
          : Math.max(...existingEntries.map((item) => item.publicationOrder)) + 1),
      createdAt: new Date().toISOString(),
    };

    await this.gazetteEntryRepository.createEntry(entry);

    await this.auditWriter.write({
      actionType: "CREATE",
      entityType: "GazetteEntry",
      entityId: entry.id,
      actorPersonId: command.actor.personId,
      summary: "Official record added to gazette issue.",
      metadata: {
        gazetteIssueId: entry.gazetteIssueId,
        officialRecordId: entry.officialRecordId,
        publicationOrder: entry.publicationOrder,
      },
    });

    return toGazetteEntryDto(entry);
  }
}
```

### 13. `apps/gov-api/src/application/gazette/list-gazette-entries.ts`

```ts id="4nzhp0"
import type { GazetteEntryDto } from "./add-record-to-gazette-issue";

export interface ListGazetteEntriesQuery {
  gazetteIssueId: string;
}

export interface ListGazetteEntriesQueryHandler {
  execute(query: ListGazetteEntriesQuery): Promise<GazetteEntryDto[]>;
}
```

### 14. `apps/gov-api/src/application/gazette/list-gazette-entries-handler.ts`

```ts id="ns6nyi"
import type { GazetteEntryRepository } from "../../domain/gazette/gazette-repository";
import type {
  ListGazetteEntriesQuery,
  ListGazetteEntriesQueryHandler,
} from "./list-gazette-entries";
import type { GazetteEntryDto } from "./add-record-to-gazette-issue";
import { toGazetteEntryDto } from "./gazette-mappers";

export class ListGazetteEntriesHandler implements ListGazetteEntriesQueryHandler {
  constructor(private readonly gazetteEntryRepository: GazetteEntryRepository) {}

  async execute(query: ListGazetteEntriesQuery): Promise<GazetteEntryDto[]> {
    const entries = await this.gazetteEntryRepository.listEntriesByIssueId(query.gazetteIssueId);
    return entries.map(toGazetteEntryDto);
  }
}
```

### 15. `apps/gov-api/src/context/app-context.ts`

```ts id="u1ehgt"
import type { AuditWriter } from "../application/audit/audit-writer";
import type { IdempotencyService } from "../application/shared/idempotency-service";

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
  ruleResolutionService?: unknown;
  authorityResolutionService?: unknown;
  tokenValidator?: unknown;
  principalToPersonService?: unknown;
  authenticatedActorService?: unknown;
}

export interface AppContext {
  handlers: AppHandlers;
  services: AppServices;
}
```

### 16. `apps/gov-api/src/context/create-publication-app-context.ts`

```ts id="mj2o3d"
import type { AppContext } from "./app-context";
import { prisma } from "../lib/prisma";

import { AuditWriter } from "../application/audit/audit-writer";
import { IdempotencyService } from "../application/shared/idempotency-service";

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

function createUnsupportedHandler(name: string) {
  return {
    async execute(): Promise<never> {
      throw new Error(`${name} is not wired in createPublicationAppContext().`);
    },
  } as never;
}

export function createPublicationAppContext(): AppContext {
  const officialRecordRepository = new PrismaOfficialRecordRepository(prisma as never);
  const gazetteRepository = new PrismaGazetteRepository(prisma as never);

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
      ruleResolutionService: undefined,
      authorityResolutionService: undefined,
      tokenValidator: undefined,
      principalToPersonService: undefined,
      authenticatedActorService: undefined,
    },
  };
}
```

### 17. `apps/gov-api/src/app-publication.ts`

```ts id="on6zfs"
import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { HonoEnv } from "./types/hono";
import type { AppContext } from "./context/app-context";

import { requestContextMiddleware } from "./middleware/request-context";
import { errorHandler } from "./middleware/error-handler";

import { createOfficialRecordRoutes } from "./routes/official-records";
import { createGazetteRoutes } from "./routes/gazette";
import { createPublicationAppContext } from "./context/create-publication-app-context";

export interface CreatePublicationAppOptions {
  appContext?: AppContext;
  actorMiddleware?: MiddlewareHandler<HonoEnv>;
}

export function createPublicationApp(
  options: CreatePublicationAppOptions = {},
): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();
  const appContext = options.appContext ?? createPublicationAppContext();

  app.use("*", requestContextMiddleware);

  if (options.actorMiddleware) {
    app.use("*", options.actorMiddleware);
  }

  app.use("*", async (c, next) => {
    c.set("appContext", appContext);
    await next();
  });

  app.use("*", errorHandler);

  app.route("/official-records", createOfficialRecordRoutes());
  app.route("/gazette", createGazetteRoutes());

  return app;
}
```

This batch closes the gap between the richer gazette stack and the official-records slice by adding:

* missing gazette domain/repository contracts
* in-memory and Prisma repository implementations
* missing gazette query/command handlers that the routes expect
* a publication-focused `AppContext` factory
* a runnable Hono app that mounts both `/official-records` and `/gazette`

The next strongest batch is the **real auth/context integration** for this richer publication app: an actor-resolution middleware that fills `requestContext.actor` from the authenticated principal and authority grants so `requireAuth` and `requireAuthority` work without test-only stubs.
