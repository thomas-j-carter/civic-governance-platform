## Batch 16 — certification/ratification → official record → gazette integration

Progress: **98% complete**

This batch closes the constitutional chain on the backend:

* certification creates the official record draft
* ratification officializes that record
* optional gazette issue targeting adds it to publication workflow
* publishing a gazette issue marks included records as `PUBLISHED`

### 1. `apps/gov-api/src/domain/records/official-record-repository.ts`

Replace with:

```ts id="b16orrepo"
import type { OfficialRecord } from "./official-record";
import type { RecordVersion } from "./record-version";

export interface OfficialRecordRepository {
  createOfficialRecord(record: OfficialRecord): Promise<void>;
  getOfficialRecordById(recordId: string): Promise<OfficialRecord | null>;
  findOfficialRecordBySource(
    sourceEntityType: string,
    sourceEntityId: string,
  ): Promise<OfficialRecord | null>;
  listOfficialRecords(): Promise<OfficialRecord[]>;
  updateOfficialRecord(record: OfficialRecord): Promise<void>;

  createRecordVersion(version: RecordVersion): Promise<void>;
  listRecordVersionsForRecord(recordId: string): Promise<RecordVersion[]>;
  getLatestVersionNumberForRecord(recordId: string): Promise<number>;
}
```

---

### 2. `apps/gov-api/src/infrastructure/persistence/in-memory/in-memory-official-record-repository.ts`

Replace with:

```ts id="b16inmemor"
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

  async findOfficialRecordBySource(
    sourceEntityType: string,
    sourceEntityId: string,
  ): Promise<OfficialRecord | null> {
    for (const record of this.records.values()) {
      if (
        record.sourceEntityType === sourceEntityType &&
        record.sourceEntityId === sourceEntityId
      ) {
        return record;
      }
    }

    return null;
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

---

### 3. `apps/gov-api/src/infrastructure/persistence/prisma/prisma-official-record-repository.ts`

Replace with:

```ts id="b16prismaor"
import type { OfficialRecordRepository } from "../../../domain/records/official-record-repository";
import type { OfficialRecord } from "../../../domain/records/official-record";
import type { RecordVersion } from "../../../domain/records/record-version";

type PrismaLike = {
  officialRecord: {
    create(args: unknown): Promise<unknown>;
    findUnique(args: unknown): Promise<any | null>;
    findFirst(args: unknown): Promise<any | null>;
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

  async findOfficialRecordBySource(
    sourceEntityType: string,
    sourceEntityId: string,
  ): Promise<OfficialRecord | null> {
    const row = await this.prisma.officialRecord.findFirst({
      where: {
        sourceEntityType,
        sourceEntityId,
      },
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

---

### 4. `apps/gov-api/src/application/publication/governance-outcome-publication-service.ts`

```ts id="b16gops"
import { ConflictError, NotFoundError } from "../../http/errors";
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type {
  GazetteEntryRepository,
  GazetteIssueRepository,
} from "../../domain/gazette/gazette-repository";

type AuditWriterLike = {
  write(input: {
    actionType: string;
    entityType: string;
    entityId: string;
    actorPersonId?: string;
    summary?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
};

type PrismaLike = {
  certificationRecord: {
    findUnique(args: unknown): Promise<any | null>;
  };
  ratificationRecord: {
    findUnique(args: unknown): Promise<any | null>;
  };
};

function buildCertifiedOutcomeMarkdown(input: {
  proposalTitle: string;
  ballotTitle: string;
  certificationId: string;
  certifiedAt?: string;
  notes?: string | null;
  tally?: {
    yesCount: number;
    noCount: number;
    abstainCount: number;
    totalCount: number;
    quorumMet: boolean;
    thresholdMet: boolean;
    computedAt?: string;
  } | null;
}): string {
  return [
    `# Certified Outcome — ${input.proposalTitle}`,
    "",
    `Ballot: ${input.ballotTitle}`,
    `Certification Record: ${input.certificationId}`,
    input.certifiedAt ? `Certified At: ${input.certifiedAt}` : undefined,
    "",
    "## Certification Summary",
    input.notes ?? "Certified outcome recorded.",
    "",
    input.tally
      ? [
          "## Tally",
          `- Yes: ${input.tally.yesCount}`,
          `- No: ${input.tally.noCount}`,
          `- Abstain: ${input.tally.abstainCount}`,
          `- Total: ${input.tally.totalCount}`,
          `- Quorum Met: ${input.tally.quorumMet ? "Yes" : "No"}`,
          `- Threshold Met: ${input.tally.thresholdMet ? "Yes" : "No"}`,
          input.tally.computedAt ? `- Computed At: ${input.tally.computedAt}` : undefined,
        ]
          .filter(Boolean)
          .join("\n")
      : undefined,
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

function buildRatifiedOutcomeMarkdown(input: {
  proposalTitle: string;
  ratificationId: string;
  ratifiedAt?: string;
  notes?: string | null;
}): string {
  return [
    `# Ratified Outcome — ${input.proposalTitle}`,
    "",
    `Ratification Record: ${input.ratificationId}`,
    input.ratifiedAt ? `Ratified At: ${input.ratifiedAt}` : undefined,
    "",
    "## Ratification Summary",
    input.notes ?? "Ratified outcome recorded.",
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

export class GovernanceOutcomePublicationService {
  constructor(
    private readonly prisma: PrismaLike,
    private readonly officialRecordRepository: OfficialRecordRepository,
    private readonly gazetteIssueRepository: GazetteIssueRepository,
    private readonly gazetteEntryRepository: GazetteEntryRepository,
    private readonly auditWriter?: AuditWriterLike,
  ) {}

  async createOfficialRecordDraftForCertification(input: {
    certificationId: string;
    actorPersonId?: string;
  }): Promise<{ recordId: string; created: boolean }> {
    const certification = await this.prisma.certificationRecord.findUnique({
      where: { id: input.certificationId },
      include: {
        ballot: {
          include: {
            proposal: true,
            tallies: {
              orderBy: {
                computedAt: "desc",
              },
              take: 1,
            },
          },
        },
      },
    });

    if (!certification) {
      throw new NotFoundError(`Certification ${input.certificationId} was not found.`);
    }

    if (certification.status !== "CERTIFIED") {
      throw new ConflictError(
        "Official record draft creation requires a certified certification record.",
        {
          code: "certification_not_certified",
        },
      );
    }

    const proposal = certification.ballot?.proposal;
    const ballot = certification.ballot;

    if (!ballot) {
      throw new ConflictError("Certification is not linked to a ballot.", {
        code: "certification_ballot_missing",
      });
    }

    const sourceEntityType = proposal ? "Proposal" : "Ballot";
    const sourceEntityId = proposal?.id ?? ballot.id;
    const proposalTitle = proposal?.title ?? ballot.title;

    const existing = await this.officialRecordRepository.findOfficialRecordBySource(
      sourceEntityType,
      sourceEntityId,
    );

    if (existing) {
      return {
        recordId: existing.id,
        created: false,
      };
    }

    const now = new Date().toISOString();
    const recordId = crypto.randomUUID();

    await this.officialRecordRepository.createOfficialRecord({
      id: recordId,
      recordType: "GOVERNANCE_OUTCOME",
      title: proposalTitle,
      summary: `Certified governance outcome for ${proposalTitle}.`,
      sourceEntityType,
      sourceEntityId,
      status: "DRAFT",
      createdAt: now,
      updatedAt: now,
    });

    const latestTally = ballot.tallies?.[0];
    await this.officialRecordRepository.createRecordVersion({
      id: crypto.randomUUID(),
      officialRecordId: recordId,
      versionNumber: 1,
      bodyMarkdown: buildCertifiedOutcomeMarkdown({
        proposalTitle,
        ballotTitle: ballot.title,
        certificationId: certification.id,
        certifiedAt: certification.certifiedAt?.toISOString(),
        notes: certification.notes,
        tally: latestTally
          ? {
              yesCount: latestTally.yesCount,
              noCount: latestTally.noCount,
              abstainCount: latestTally.abstainCount,
              totalCount: latestTally.totalCount,
              quorumMet: latestTally.quorumMet,
              thresholdMet: latestTally.thresholdMet,
              computedAt: latestTally.computedAt?.toISOString(),
            }
          : null,
      }),
      changeSummary: "Initial certified outcome record.",
      createdByPersonId: input.actorPersonId,
      createdAt: now,
    });

    await this.auditWriter?.write({
      actionType: "CREATE",
      entityType: "OfficialRecord",
      entityId: recordId,
      actorPersonId: input.actorPersonId,
      summary: "Official record draft created from certified outcome.",
      metadata: {
        certificationId: certification.id,
        sourceEntityType,
        sourceEntityId,
      },
    });

    return {
      recordId,
      created: true,
    };
  }

  async officializeRecordForRatification(input: {
    ratificationRecordId: string;
    actorPersonId?: string;
  }): Promise<{ recordId: string; officialized: boolean }> {
    const ratification = await this.prisma.ratificationRecord.findUnique({
      where: { id: input.ratificationRecordId },
      include: {
        proposal: true,
        certificationRecord: {
          include: {
            ballot: {
              include: {
                proposal: true,
                tallies: {
                  orderBy: {
                    computedAt: "desc",
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!ratification) {
      throw new NotFoundError(`Ratification ${input.ratificationRecordId} was not found.`);
    }

    if (ratification.status !== "RATIFIED") {
      throw new ConflictError("Only ratified outcomes may be officialized.", {
        code: "ratification_not_ratified",
      });
    }

    let record = await this.officialRecordRepository.findOfficialRecordBySource(
      "Proposal",
      ratification.proposalId,
    );

    if (!record && ratification.certificationRecordId) {
      await this.createOfficialRecordDraftForCertification({
        certificationId: ratification.certificationRecordId,
        actorPersonId: input.actorPersonId,
      });

      record = await this.officialRecordRepository.findOfficialRecordBySource(
        "Proposal",
        ratification.proposalId,
      );
    }

    if (!record) {
      throw new NotFoundError(
        `No official record draft exists for proposal ${ratification.proposalId}.`,
      );
    }

    if (record.status === "OFFICIAL" || record.status === "PUBLISHED") {
      return {
        recordId: record.id,
        officialized: false,
      };
    }

    const latestVersionNumber =
      await this.officialRecordRepository.getLatestVersionNumberForRecord(record.id);

    await this.officialRecordRepository.createRecordVersion({
      id: crypto.randomUUID(),
      officialRecordId: record.id,
      versionNumber: latestVersionNumber + 1,
      bodyMarkdown: buildRatifiedOutcomeMarkdown({
        proposalTitle: ratification.proposal.title,
        ratificationId: ratification.id,
        ratifiedAt: ratification.ratifiedAt?.toISOString(),
        notes: ratification.notes,
      }),
      changeSummary: "Ratification outcome attached before officialization.",
      createdByPersonId: input.actorPersonId,
      createdAt: new Date().toISOString(),
    });

    const updatedRecord = {
      ...record,
      status: "OFFICIAL" as const,
      officializedAt: ratification.ratifiedAt?.toISOString() ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await this.officialRecordRepository.updateOfficialRecord(updatedRecord);

    await this.auditWriter?.write({
      actionType: "APPROVE",
      entityType: "OfficialRecord",
      entityId: updatedRecord.id,
      actorPersonId: input.actorPersonId,
      summary: "Official record officialized from ratified outcome.",
      metadata: {
        ratificationRecordId: ratification.id,
        proposalId: ratification.proposalId,
      },
    });

    return {
      recordId: updatedRecord.id,
      officialized: true,
    };
  }

  async addOfficializedRecordToGazetteIssue(input: {
    proposalId: string;
    gazetteIssueId: string;
    actorPersonId?: string;
  }): Promise<{ entryId: string; created: boolean }> {
    const record = await this.officialRecordRepository.findOfficialRecordBySource(
      "Proposal",
      input.proposalId,
    );

    if (!record) {
      throw new NotFoundError(`No official record exists for proposal ${input.proposalId}.`);
    }

    if (record.status !== "OFFICIAL" && record.status !== "PUBLISHED") {
      throw new ConflictError("Only officialized records may be added to a gazette issue.", {
        code: "official_record_not_officialized",
      });
    }

    const issue = await this.gazetteIssueRepository.getIssueById(input.gazetteIssueId);

    if (!issue) {
      throw new NotFoundError(`Gazette issue ${input.gazetteIssueId} was not found.`);
    }

    if (issue.publicationState === "PUBLISHED") {
      throw new ConflictError("Cannot modify a published gazette issue.", {
        code: "gazette_issue_already_published",
      });
    }

    const existingEntries = await this.gazetteEntryRepository.listEntriesByIssueId(issue.id);
    const duplicate = existingEntries.find((entry) => entry.officialRecordId === record.id);

    if (duplicate) {
      return {
        entryId: duplicate.id,
        created: false,
      };
    }

    const publicationOrder =
      existingEntries.length === 0
        ? 1
        : Math.max(...existingEntries.map((item) => item.publicationOrder)) + 1;

    const entryId = crypto.randomUUID();

    await this.gazetteEntryRepository.createEntry({
      id: entryId,
      gazetteIssueId: issue.id,
      officialRecordId: record.id,
      titleSnapshot: record.title,
      summarySnapshot: record.summary,
      publicationOrder,
      createdAt: new Date().toISOString(),
    });

    await this.auditWriter?.write({
      actionType: "CREATE",
      entityType: "GazetteEntry",
      entityId: entryId,
      actorPersonId: input.actorPersonId,
      summary: "Official record added to gazette issue from ratified outcome.",
      metadata: {
        proposalId: input.proposalId,
        officialRecordId: record.id,
        gazetteIssueId: issue.id,
        publicationOrder,
      },
    });

    return {
      entryId,
      created: true,
    };
  }
}
```

---

### 5. `apps/gov-api/src/application/gazette/publish-gazette-issue-handler.ts`

Replace with:

```ts id="b16publish"
import { ConflictError, NotFoundError } from "../../http/errors";
import type {
  GazetteEntryRepository,
  GazetteIssueRepository,
} from "../../domain/gazette/gazette-repository";
import type { OfficialRecordRepository } from "../../domain/records/official-record-repository";
import type { AuditWriter } from "../audit/audit-writer";
import type {
  PublishGazetteIssueCommand,
  PublishGazetteIssueCommandHandler,
} from "./publish-gazette-issue";
import type { GazetteIssueDto } from "./create-gazette-issue";
import { toGazetteIssueDto } from "./gazette-mappers";

export class PublishGazetteIssueHandler implements PublishGazetteIssueCommandHandler {
  constructor(
    private readonly gazetteIssueRepository: GazetteIssueRepository,
    private readonly gazetteEntryRepository: GazetteEntryRepository,
    private readonly officialRecordRepository: OfficialRecordRepository,
    private readonly auditWriter: AuditWriter,
  ) {}

  async execute(command: PublishGazetteIssueCommand): Promise<GazetteIssueDto> {
    const issue = await this.gazetteIssueRepository.getIssueById(command.issueId);

    if (!issue) {
      throw new NotFoundError(`Gazette issue ${command.issueId} was not found.`);
    }

    if (issue.publicationState === "PUBLISHED") {
      throw new ConflictError("Gazette issue is already published.", {
        code: "gazette_issue_already_published",
      });
    }

    const entries = await this.gazetteEntryRepository.listEntriesByIssueId(issue.id);

    if (entries.length === 0) {
      throw new ConflictError("Cannot publish a gazette issue with no entries.", {
        code: "gazette_issue_has_no_entries",
      });
    }

    issue.publicationState = "PUBLISHED";
    issue.publishedAt = command.input.publishedAt ?? new Date().toISOString();
    issue.updatedAt = new Date().toISOString();

    await this.gazetteIssueRepository.updateIssue(issue);

    for (const entry of entries) {
      const record = await this.officialRecordRepository.getOfficialRecordById(
        entry.officialRecordId,
      );

      if (record && record.status === "OFFICIAL") {
        await this.officialRecordRepository.updateOfficialRecord({
          ...record,
          status: "PUBLISHED",
          updatedAt: new Date().toISOString(),
        });
      }
    }

    await this.auditWriter.write({
      actionType: "PUBLISH",
      entityType: "GazetteIssue",
      entityId: issue.id,
      actorPersonId: command.actor.personId,
      summary: "Gazette issue published.",
      metadata: {
        note: command.input.note,
        publishedAt: issue.publishedAt,
        entryCount: entries.length,
      },
    });

    return toGazetteIssueDto(issue);
  }
}
```

---

### 6. `apps/gov-api/src/context/create-publication-app-context.ts`

Update only these constructor calls:

```ts id="b16pubctxpatch"
      gazette: {
        createIssue: new CreateGazetteIssueHandler(gazetteRepository, auditWriter),
        getIssue: new GetGazetteIssueHandler(gazetteRepository),
        listIssues: new ListGazetteIssuesHandler(gazetteRepository),
        publishIssue: new PublishGazetteIssueHandler(
          gazetteRepository,
          gazetteRepository,
          officialRecordRepository,
          auditWriter,
        ),
      },
```

---

### 7. `packages/contracts/src/certifications.ts`

Replace with:

```ts id="b16contracts"
import { z } from 'zod'

export const certificationStatuses = [
  'pending',
  'under_review',
  'certified',
  'rejected',
] as const

export const ratificationStatuses = [
  'pending',
  'ratified',
  'rejected',
] as const

export const certificationStatusSchema = z.enum(certificationStatuses)
export const ratificationStatusSchema = z.enum(ratificationStatuses)

export const certificationSchema = z.object({
  id: z.string(),
  ballotId: z.string(),
  status: certificationStatusSchema,
  certifiedByPersonId: z.string().nullable().optional(),
  certifiedAt: z.string().nullable().optional(),
  rejectedAt: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  quorumRuleVersionId: z.string(),
  thresholdRuleVersionId: z.string(),
  certificationRuleVersionId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const certificationListSchema = z.array(certificationSchema)

export const createCertificationSchema = z.object({
  ballotId: z.string().trim().min(1),
  notes: z.string().trim().max(10000).optional(),
  quorumRuleVersionId: z.string().trim().min(1),
  thresholdRuleVersionId: z.string().trim().min(1),
  certificationRuleVersionId: z.string().trim().min(1).optional(),
})

export const rejectCertificationSchema = z.object({
  notes: z.string().trim().max(10000).optional(),
})

export const ratificationSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  certificationRecordId: z.string().nullable().optional(),
  status: ratificationStatusSchema,
  ratifiedByPersonId: z.string().nullable().optional(),
  ratifiedAt: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const ratificationListSchema = z.array(ratificationSchema)

export const createRatificationSchema = z.object({
  proposalId: z.string().trim().min(1),
  certificationRecordId: z.string().trim().min(1).optional(),
  gazetteIssueId: z.string().trim().min(1).optional(),
  notes: z.string().trim().max(10000).optional(),
})

export type CertificationStatus = z.infer<typeof certificationStatusSchema>
export type RatificationStatus = z.infer<typeof ratificationStatusSchema>

export type CertificationDto = z.infer<typeof certificationSchema>
export type CreateCertificationInput = z.infer<typeof createCertificationSchema>
export type RejectCertificationInput = z.infer<typeof rejectCertificationSchema>

export type RatificationDto = z.infer<typeof ratificationSchema>
export type CreateRatificationInput = z.infer<typeof createRatificationSchema>
```

---

### 8. `apps/gov-api/src/certifications/service.ts`

Replace with:

```ts id="b16certsvc"
import { hasPermission, hasRole, type ActorContext } from '@ardtire/authz'
import type {
  CertificationDto,
  CertificationStatus,
  CreateCertificationInput,
  CreateRatificationInput,
  RatificationDto,
  RatificationStatus,
  RejectCertificationInput,
} from '@ardtire/contracts'
import { prisma } from '../lib/prisma'
import { AppServiceError } from '../lib/errors'
import { PrismaOfficialRecordRepository } from '../infrastructure/persistence/prisma/prisma-official-record-repository'
import { PrismaGazetteRepository } from '../infrastructure/persistence/prisma/prisma-gazette-repository'
import { GovernanceOutcomePublicationService } from '../application/publication/governance-outcome-publication-service'

const certificationStatusFromPrisma: Record<string, CertificationStatus> = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  CERTIFIED: 'certified',
  REJECTED: 'rejected',
}

const ratificationStatusFromPrisma: Record<string, RatificationStatus> = {
  PENDING: 'pending',
  RATIFIED: 'ratified',
  REJECTED: 'rejected',
}

function toIsoString(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null
}

function toCertificationDto(input: {
  id: string
  ballotId: string
  status: string
  certifiedByPersonId: string | null
  certifiedAt: Date | null
  rejectedAt: Date | null
  notes: string | null
  quorumRuleVersionId: string
  thresholdRuleVersionId: string
  certificationRuleVersionId: string | null
  createdAt: Date
  updatedAt: Date
}): CertificationDto {
  return {
    id: input.id,
    ballotId: input.ballotId,
    status: certificationStatusFromPrisma[input.status] ?? 'pending',
    certifiedByPersonId: input.certifiedByPersonId,
    certifiedAt: toIsoString(input.certifiedAt),
    rejectedAt: toIsoString(input.rejectedAt),
    notes: input.notes,
    quorumRuleVersionId: input.quorumRuleVersionId,
    thresholdRuleVersionId: input.thresholdRuleVersionId,
    certificationRuleVersionId: input.certificationRuleVersionId,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function toRatificationDto(input: {
  id: string
  proposalId: string
  certificationRecordId: string | null
  status: string
  ratifiedByPersonId: string | null
  ratifiedAt: Date | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}): RatificationDto {
  return {
    id: input.id,
    proposalId: input.proposalId,
    certificationRecordId: input.certificationRecordId,
    status: ratificationStatusFromPrisma[input.status] ?? 'pending',
    ratifiedByPersonId: input.ratifiedByPersonId,
    ratifiedAt: toIsoString(input.ratifiedAt),
    notes: input.notes,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function canManageCertifications(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'create_certification') ||
    hasPermission(actor, 'certify_ballot_result')
  )
}

function canRatify(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'ratify_proposal')
  )
}

const governanceOutcomePublicationService = new GovernanceOutcomePublicationService(
  prisma as never,
  new PrismaOfficialRecordRepository(prisma as never),
  new PrismaGazetteRepository(prisma as never),
  new PrismaGazetteRepository(prisma as never),
)

export class CertificationsService {
  async create(actor: ActorContext, input: CreateCertificationInput): Promise<CertificationDto> {
    if (!canManageCertifications(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create certifications.',
      })
    }

    const ballot = await prisma.ballot.findUnique({
      where: { id: input.ballotId },
    })

    if (!ballot) {
      throw new AppServiceError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Ballot not found.',
      })
    }

    const existing = await prisma.certificationRecord.findFirst({
      where: { ballotId: input.ballotId },
      orderBy: { createdAt: 'desc' },
    })

    if (existing) {
      throw new AppServiceError({
        status: 409,
        code: 'CERTIFICATION_ALREADY_EXISTS',
        message: 'A certification already exists for this ballot.',
      })
    }

    const created = await prisma.certificationRecord.create({
      data: {
        ballotId: input.ballotId,
        status: 'PENDING',
        notes: input.notes,
        quorumRuleVersionId: input.quorumRuleVersionId,
        thresholdRuleVersionId: input.thresholdRuleVersionId,
        certificationRuleVersionId: input.certificationRuleVersionId,
      },
    })

    return toCertificationDto(created)
  }

  async read(actor: ActorContext, certificationId: string): Promise<CertificationDto | null> {
    if (!canManageCertifications(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to read certifications.',
      })
    }

    const row = await prisma.certificationRecord.findUnique({
      where: { id: certificationId },
    })

    return row ? toCertificationDto(row) : null
  }

  async certify(actor: ActorContext, certificationId: string): Promise<CertificationDto | null> {
    if (!canManageCertifications(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to certify ballot results.',
      })
    }

    const existing = await prisma.certificationRecord.findUnique({
      where: { id: certificationId },
    })

    if (!existing) {
      return null
    }

    if (!['PENDING', 'UNDER_REVIEW'].includes(existing.status)) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition certification from ${certificationStatusFromPrisma[existing.status] ?? 'unknown'} to certified.`,
      })
    }

    const tally = await prisma.voteTally.findFirst({
      where: { ballotId: existing.ballotId },
      orderBy: { computedAt: 'desc' },
    })

    if (!tally) {
      throw new AppServiceError({
        status: 400,
        code: 'TALLY_REQUIRED',
        message: 'Cannot certify a ballot result before a tally exists.',
      })
    }

    const updated = await prisma.certificationRecord.update({
      where: { id: certificationId },
      data: {
        status: 'CERTIFIED',
        certifiedByPersonId: actor.personId,
        certifiedAt: new Date(),
      },
    })

    await governanceOutcomePublicationService.createOfficialRecordDraftForCertification({
      certificationId: updated.id,
      actorPersonId: actor.personId,
    })

    return toCertificationDto(updated)
  }

  async reject(
    actor: ActorContext,
    certificationId: string,
    input: RejectCertificationInput,
  ): Promise<CertificationDto | null> {
    if (!canManageCertifications(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to reject certifications.',
      })
    }

    const existing = await prisma.certificationRecord.findUnique({
      where: { id: certificationId },
    })

    if (!existing) {
      return null
    }

    if (!['PENDING', 'UNDER_REVIEW'].includes(existing.status)) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition certification from ${certificationStatusFromPrisma[existing.status] ?? 'unknown'} to rejected.`,
      })
    }

    const updated = await prisma.certificationRecord.update({
      where: { id: certificationId },
      data: {
        status: 'REJECTED',
        rejectedAt: new Date(),
        notes: input.notes ?? existing.notes,
      },
    })

    return toCertificationDto(updated)
  }

  async createRatification(
    actor: ActorContext,
    input: CreateRatificationInput,
  ): Promise<RatificationDto> {
    if (!canRatify(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to ratify proposals.',
      })
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: input.proposalId },
    })

    if (!proposal) {
      throw new AppServiceError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Proposal not found.',
      })
    }

    if (input.certificationRecordId) {
      const certification = await prisma.certificationRecord.findUnique({
        where: { id: input.certificationRecordId },
      })

      if (!certification) {
        throw new AppServiceError({
          status: 404,
          code: 'NOT_FOUND',
          message: 'Certification not found.',
        })
      }

      if (certification.status !== 'CERTIFIED') {
        throw new AppServiceError({
          status: 400,
          code: 'CERTIFICATION_REQUIRED',
          message: 'Ratification requires a certified certification record.',
        })
      }
    }

    const created = await prisma.ratificationRecord.create({
      data: {
        proposalId: input.proposalId,
        certificationRecordId: input.certificationRecordId,
        status: 'RATIFIED',
        ratifiedByPersonId: actor.personId,
        ratifiedAt: new Date(),
        notes: input.notes,
      },
    })

    await governanceOutcomePublicationService.officializeRecordForRatification({
      ratificationRecordId: created.id,
      actorPersonId: actor.personId,
    })

    if (input.gazetteIssueId) {
      await governanceOutcomePublicationService.addOfficializedRecordToGazetteIssue({
        proposalId: input.proposalId,
        gazetteIssueId: input.gazetteIssueId,
        actorPersonId: actor.personId,
      })
    }

    return toRatificationDto(created)
  }
}

export const certificationsService = new CertificationsService()
```

---

### 9. `apps/gov-api/src/application/publication/governance-outcome-publication-service.test.ts`

```ts id="b16gopstest"
import { describe, expect, it } from "vitest";
import { InMemoryOfficialRecordRepository } from "../../infrastructure/persistence/in-memory/in-memory-official-record-repository";
import { InMemoryGazetteIssueRepository } from "../../infrastructure/persistence/in-memory/in-memory-gazette-repository";
import { PublishGazetteIssueHandler } from "../gazette/publish-gazette-issue-handler";
import { GovernanceOutcomePublicationService } from "./governance-outcome-publication-service";

describe("GovernanceOutcomePublicationService", () => {
  it("promotes certified and ratified outcomes through official record and gazette publication", async () => {
    const officialRecordRepository = new InMemoryOfficialRecordRepository();
    const gazetteRepository = new InMemoryGazetteIssueRepository();

    await gazetteRepository.createIssue({
      id: "issue-1",
      issueNumber: "0001",
      title: "Issue 1",
      publicationState: "DRAFT",
      createdByPersonId: "person-1",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    const prisma = {
      certificationRecord: {
        async findUnique(args: any) {
          if (args.where.id !== "cert-1") return null;
          return {
            id: "cert-1",
            ballotId: "ballot-1",
            status: "CERTIFIED",
            certifiedAt: new Date("2026-03-21T01:00:00.000Z"),
            notes: "Certified outcome.",
            ballot: {
              id: "ballot-1",
              title: "Ratification Ballot",
              proposal: {
                id: "proposal-1",
                title: "Act I",
              },
              tallies: [
                {
                  yesCount: 7,
                  noCount: 2,
                  abstainCount: 1,
                  totalCount: 10,
                  quorumMet: true,
                  thresholdMet: true,
                  computedAt: new Date("2026-03-21T00:55:00.000Z"),
                },
              ],
            },
          };
        },
      },
      ratificationRecord: {
        async findUnique(args: any) {
          if (args.where.id !== "rat-1") return null;
          return {
            id: "rat-1",
            proposalId: "proposal-1",
            status: "RATIFIED",
            ratifiedAt: new Date("2026-03-21T02:00:00.000Z"),
            notes: "Ratified.",
            proposal: {
              id: "proposal-1",
              title: "Act I",
            },
            certificationRecordId: "cert-1",
            certificationRecord: {
              id: "cert-1",
            },
          };
        },
      },
    };

    const service = new GovernanceOutcomePublicationService(
      prisma as never,
      officialRecordRepository,
      gazetteRepository,
      gazetteRepository,
      {
        async write() {},
      },
    );

    const draftResult = await service.createOfficialRecordDraftForCertification({
      certificationId: "cert-1",
      actorPersonId: "person-1",
    });

    expect(draftResult.created).toBe(true);

    const draftRecord = await officialRecordRepository.findOfficialRecordBySource(
      "Proposal",
      "proposal-1",
    );
    expect(draftRecord?.status).toBe("DRAFT");

    const officializeResult = await service.officializeRecordForRatification({
      ratificationRecordId: "rat-1",
      actorPersonId: "person-1",
    });

    expect(officializeResult.officialized).toBe(true);

    const officializedRecord = await officialRecordRepository.findOfficialRecordBySource(
      "Proposal",
      "proposal-1",
    );
    expect(officializedRecord?.status).toBe("OFFICIAL");

    const gazetteResult = await service.addOfficializedRecordToGazetteIssue({
      proposalId: "proposal-1",
      gazetteIssueId: "issue-1",
      actorPersonId: "person-1",
    });

    expect(gazetteResult.created).toBe(true);

    const publishHandler = new PublishGazetteIssueHandler(
      gazetteRepository,
      gazetteRepository,
      officialRecordRepository,
      {
        async write() {},
      } as never,
    );

    const publishedIssue = await publishHandler.execute({
      actor: { personId: "person-1" },
      issueId: "issue-1",
      input: {
        note: "Published.",
      },
    });

    expect(publishedIssue.publicationState).toBe("PUBLISHED");

    const publishedRecord = await officialRecordRepository.findOfficialRecordBySource(
      "Proposal",
      "proposal-1",
    );
    expect(publishedRecord?.status).toBe("PUBLISHED");

    const versions = await officialRecordRepository.listRecordVersionsForRecord(
      publishedRecord!.id,
    );
    expect(versions).toHaveLength(2);
    expect(versions[0].versionNumber).toBe(1);
    expect(versions[1].versionNumber).toBe(2);
  });
});
```

---

### 10. `apps/gov-api/src/app-publication.e2e.test.ts`

Append this focused assertion to the success-path test after issue publication:

```ts id="b16e2epatch"
    const publishedRecordRes = await app.request(
      `http://localhost/official-records/${recordId}`,
      {
        headers: authHeaders(),
      },
    );

    expect(publishedRecordRes.status).toBe(200);
    const publishedRecordBody = await publishedRecordRes.json();
    expect(publishedRecordBody.data.status).toBe("PUBLISHED");
```

## What this completes

This is the missing orchestration layer that turns governance outcomes into legal/public artifacts automatically:

* **certification** creates the draft official record
* **ratification** officializes that record
* optional `gazetteIssueId` on ratification can place the record directly into a gazette issue
* **publishing the gazette issue** now marks all included official records as `PUBLISHED`

That closes the backend constitutional chain you defined:
**outcome → official record → officialized record → gazette entry → published record**

## What remains

At this point, what remains is mostly finishing polish:

* wire the same outcome-promotion logic through the canonical route surface consistently
* broaden end-to-end coverage across the proposal/ballot/certification HTTP flow
* frontend integration for publication views and admin actions
* deployment and ops hardening

The next strongest batch is the **last-mile polish pass**:
document the final canonical backend flow, add any remaining route tests around `createRatification` with `gazetteIssueId`, and produce a concise implementation status manifest of what is complete vs deferred.
