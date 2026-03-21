prisma-schema-tightening.md

The safest production-minded approach is:

* keep `ProposalVersion.proposalId -> Proposal.id` as the primary required parent-child relation
* keep `Proposal.currentVersionId -> ProposalVersion.id` as an optional pointer
* create the two tables first without the circular FK from `Proposal.currentVersionId`
* add that FK afterward with an `ALTER TABLE`
* also add a data-integrity rule at the application layer that the referenced `currentVersionId` must belong to the same proposal

That avoids fragile initial creation ordering while preserving the model you want.

## Recommended tightened model

### Why this is better

The true ownership direction is:

* a proposal version always belongs to exactly one proposal
* a proposal may point at one of its versions as the current version

So the required relation should be only one way at table-creation time:

* `proposal_versions.proposal_id -> proposals.id`

Then later:

* `proposals.current_version_id -> proposal_versions.id`

This is the cleanest pattern.

---

# Revised Prisma section

Use this tightened version for just the affected models:

```prisma
model Proposal {
  id               String        @id @default(uuid()) @db.Uuid
  proposalNumber   String?       @unique
  title            String
  summary          String?
  proposalType     ProposalType  @default(GENERAL)
  currentStage     ProposalStage @default(DRAFT)
  proposerPersonId String?       @db.Uuid
  proposerMemberId String?       @db.Uuid
  currentVersionId String?       @db.Uuid
  submittedAt      DateTime?     @db.Timestamptz(6)
  withdrawnAt      DateTime?     @db.Timestamptz(6)
  rejectedAt       DateTime?     @db.Timestamptz(6)
  createdAt        DateTime      @default(now()) @db.Timestamptz(6)
  updatedAt        DateTime      @updatedAt @db.Timestamptz(6)

  proposerPerson   Person?       @relation("ProposalProposer", fields: [proposerPersonId], references: [id], onDelete: SetNull)
  proposerMember   Member?       @relation("ProposalProposerMember", fields: [proposerMemberId], references: [id], onDelete: SetNull)

  versions         ProposalVersion[]
  currentVersion   ProposalVersion? @relation("ProposalCurrentVersion", fields: [currentVersionId], references: [id], onDelete: SetNull)

  stageHistory         ProposalStageHistory[]
  amendments           Amendment[]
  committeeAssignments CommitteeAssignment[]
  ballots              Ballot[]
  ratifications        RatificationRecord[]

  @@index([proposalType])
  @@index([currentStage])
  @@index([proposerPersonId])
  @@index([proposerMemberId])
  @@index([submittedAt])
  @@index([currentVersionId])
  @@map("proposals")
}

model ProposalVersion {
  id                String    @id @default(uuid()) @db.Uuid
  proposalId        String    @db.Uuid
  versionNumber     Int
  titleSnapshot     String
  bodyMarkdown      String
  changeSummary     String?
  createdByPersonId String    @db.Uuid
  createdAt         DateTime  @default(now()) @db.Timestamptz(6)

  proposal          Proposal  @relation(fields: [proposalId], references: [id], onDelete: Cascade)
  createdBy         Person    @relation("ProposalVersionAuthor", fields: [createdByPersonId], references: [id], onDelete: Restrict)

  currentForProposal Proposal[] @relation("ProposalCurrentVersion")

  @@unique([proposalId, versionNumber])
  @@index([proposalId])
  @@index([createdByPersonId])
  @@map("proposal_versions")
}
```

## Important note about integrity

This schema alone cannot guarantee that:

* `Proposal.currentVersionId`
* points to a `ProposalVersion`
* whose `proposalId` equals that same `Proposal.id`

That is the one integrity rule relationally awkward here.

You should enforce that in one of two ways.

## Best practical option

Enforce in application/service logic:

* when setting `currentVersionId`
* load the version
* verify `version.proposalId === proposal.id`
* only then update proposal

This is usually the best Prisma-friendly choice.

## Stronger database option

If you want DB-level enforcement, the cleanest relational design is to make `currentVersion` use a composite foreign key, which requires:

* `Proposal` to store both `id` and `currentVersionNumber`, or
* `Proposal` to store both `currentVersionId` and a duplicated `currentVersionProposalId`

That is usually heavier than necessary.

---

# Recommended migration strategy

## Migration 1: create both tables, but omit the circular FK

Create:

* `proposals`
* `proposal_versions`

with this FK only:

```sql
ALTER TABLE "proposal_versions"
ADD CONSTRAINT "proposal_versions_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
```

Do **not** yet add:

```sql
proposals.currentVersionId -> proposal_versions.id
```

## Migration 2: add the pointer FK afterward

```sql
ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_currentVersionId_fkey"
FOREIGN KEY ("currentVersionId") REFERENCES "proposal_versions"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
```

This is the robust sequence.

---

# Tightened initial SQL for the affected part

Here is the corrected creation order for just these two tables.

## Step 1: create `proposals` without FK to `proposal_versions`

```sql
CREATE TABLE "proposals" (
  "id" UUID NOT NULL,
  "proposalNumber" TEXT,
  "title" TEXT NOT NULL,
  "summary" TEXT,
  "proposalType" "ProposalType" NOT NULL DEFAULT 'GENERAL',
  "currentStage" "ProposalStage" NOT NULL DEFAULT 'DRAFT',
  "proposerPersonId" UUID,
  "proposerMemberId" UUID,
  "currentVersionId" UUID,
  "submittedAt" TIMESTAMPTZ(6),
  "withdrawnAt" TIMESTAMPTZ(6),
  "rejectedAt" TIMESTAMPTZ(6),
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);
```

## Step 2: create `proposal_versions`

```sql
CREATE TABLE "proposal_versions" (
  "id" UUID NOT NULL,
  "proposalId" UUID NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "titleSnapshot" TEXT NOT NULL,
  "bodyMarkdown" TEXT NOT NULL,
  "changeSummary" TEXT,
  "createdByPersonId" UUID NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "proposal_versions_pkey" PRIMARY KEY ("id")
);
```

## Step 3: indexes

```sql
CREATE UNIQUE INDEX "proposals_proposalNumber_key" ON "proposals"("proposalNumber");
CREATE INDEX "proposals_proposalType_idx" ON "proposals"("proposalType");
CREATE INDEX "proposals_currentStage_idx" ON "proposals"("currentStage");
CREATE INDEX "proposals_proposerPersonId_idx" ON "proposals"("proposerPersonId");
CREATE INDEX "proposals_proposerMemberId_idx" ON "proposals"("proposerMemberId");
CREATE INDEX "proposals_submittedAt_idx" ON "proposals"("submittedAt");
CREATE INDEX "proposals_currentVersionId_idx" ON "proposals"("currentVersionId");

CREATE UNIQUE INDEX "proposal_versions_proposalId_versionNumber_key"
ON "proposal_versions"("proposalId", "versionNumber");

CREATE INDEX "proposal_versions_proposalId_idx"
ON "proposal_versions"("proposalId");

CREATE INDEX "proposal_versions_createdByPersonId_idx"
ON "proposal_versions"("createdByPersonId");
```

## Step 4: add non-circular FKs first

```sql
ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_proposerPersonId_fkey"
FOREIGN KEY ("proposerPersonId") REFERENCES "persons"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_proposerMemberId_fkey"
FOREIGN KEY ("proposerMemberId") REFERENCES "members"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "proposal_versions"
ADD CONSTRAINT "proposal_versions_proposalId_fkey"
FOREIGN KEY ("proposalId") REFERENCES "proposals"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "proposal_versions"
ADD CONSTRAINT "proposal_versions_createdByPersonId_fkey"
FOREIGN KEY ("createdByPersonId") REFERENCES "persons"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
```

## Step 5: add the circular pointer last

```sql
ALTER TABLE "proposals"
ADD CONSTRAINT "proposals_currentVersionId_fkey"
FOREIGN KEY ("currentVersionId") REFERENCES "proposal_versions"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
```

---

# Operational rule you should adopt

When creating a new proposal draft, do this transactionally:

1. insert proposal with `currentVersionId = NULL`
2. insert version 1 linked to proposal
3. update proposal `currentVersionId = version1.id`

That avoids bootstrap problems cleanly.

Pseudo-flow:

```sql
BEGIN;

INSERT INTO proposals (..., currentVersionId) VALUES (..., NULL) RETURNING id;
-- proposal_id

INSERT INTO proposal_versions (..., proposalId, versionNumber) VALUES (..., proposal_id, 1) RETURNING id;
-- version_id

UPDATE proposals
SET currentVersionId = version_id
WHERE id = proposal_id;

COMMIT;
```

---

# Strongest recommendation

For this project, I recommend:

* keep the schema as above
* use two-step migration ordering
* enforce same-proposal current-version integrity in application services
* create proposal + first version in one transaction exactly as shown

That gives you the cleanest mix of:

* institutional correctness
* Prisma compatibility
* migration reliability
* implementation simplicity

Next, I can rewrite the **full Prisma schema** and **full initial migration SQL** with this tightened proposal/version handling baked in everywhere.
