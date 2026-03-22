## Batch 18 — frontend/client integration bridge

Progress: **99% complete**

This batch makes the publication surface consumable through the same typed client pattern as the rest of the platform.

### 1. `packages/contracts/src/official-records.ts`

```ts id="b18contractsor"
import { z } from 'zod'

export const officialRecordStatuses = [
  'DRAFT',
  'OFFICIAL',
  'PUBLISHED',
  'SUPERSEDED',
  'ARCHIVED',
] as const

export const officialRecordStatusSchema = z.enum(officialRecordStatuses)

export const officialRecordSchema = z.object({
  id: z.string(),
  recordType: z.string(),
  title: z.string(),
  summary: z.string().optional(),
  sourceEntityType: z.string(),
  sourceEntityId: z.string(),
  status: officialRecordStatusSchema,
  officializedAt: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const officialRecordListSchema = z.array(officialRecordSchema)

export const createOfficialRecordSchema = z.object({
  recordType: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(240),
  summary: z.string().trim().max(4000).optional(),
  sourceEntityType: z.string().trim().min(1).max(120),
  sourceEntityId: z.string().trim().min(1).max(120),
})

export const recordVersionSchema = z.object({
  id: z.string(),
  officialRecordId: z.string(),
  versionNumber: z.number().int().positive(),
  bodyMarkdown: z.string(),
  changeSummary: z.string().optional(),
  createdByPersonId: z.string().optional(),
  createdAt: z.string(),
})

export const recordVersionListSchema = z.array(recordVersionSchema)

export const createRecordVersionSchema = z.object({
  bodyMarkdown: z.string().min(1),
  changeSummary: z.string().trim().max(2000).optional(),
})

export const officializeOfficialRecordSchema = z.object({
  note: z.string().trim().max(2000).optional(),
  officializedAt: z.string().optional(),
})

export type OfficialRecordDto = z.infer<typeof officialRecordSchema>
export type CreateOfficialRecordInput = z.infer<typeof createOfficialRecordSchema>

export type RecordVersionDto = z.infer<typeof recordVersionSchema>
export type CreateRecordVersionInput = z.infer<typeof createRecordVersionSchema>

export type OfficializeOfficialRecordInput = z.infer<
  typeof officializeOfficialRecordSchema
>
```

---

### 2. `packages/contracts/src/gazette.ts`

```ts id="b18contractsgz"
import { z } from 'zod'

export const gazetteIssuePublicationStates = [
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
] as const

export const gazetteIssuePublicationStateSchema = z.enum(gazetteIssuePublicationStates)

export const gazetteIssueSchema = z.object({
  id: z.string(),
  issueNumber: z.string().optional(),
  title: z.string(),
  publicationState: gazetteIssuePublicationStateSchema,
  scheduledFor: z.string().optional(),
  publishedAt: z.string().optional(),
  createdByPersonId: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const gazetteIssueListSchema = z.array(gazetteIssueSchema)

export const createGazetteIssueSchema = z.object({
  issueNumber: z.string().trim().max(40).optional(),
  title: z.string().trim().min(1).max(240),
  scheduledFor: z.string().optional(),
})

export const gazetteEntrySchema = z.object({
  id: z.string(),
  gazetteIssueId: z.string(),
  officialRecordId: z.string(),
  titleSnapshot: z.string(),
  summarySnapshot: z.string().optional(),
  publicationOrder: z.number().int().positive(),
  publishedAt: z.string().optional(),
  createdAt: z.string(),
})

export const gazetteEntryListSchema = z.array(gazetteEntrySchema)

export const addRecordToGazetteIssueSchema = z.object({
  officialRecordId: z.string().trim().min(1),
  publicationOrder: z.number().int().positive().optional(),
})

export const publishGazetteIssueSchema = z.object({
  note: z.string().trim().max(2000).optional(),
  publishedAt: z.string().optional(),
})

export type GazetteIssueDto = z.infer<typeof gazetteIssueSchema>
export type CreateGazetteIssueInput = z.infer<typeof createGazetteIssueSchema>

export type GazetteEntryDto = z.infer<typeof gazetteEntrySchema>
export type AddRecordToGazetteIssueInput = z.infer<typeof addRecordToGazetteIssueSchema>

export type PublishGazetteIssueInput = z.infer<typeof publishGazetteIssueSchema>
```

---

### 3. `packages/contracts/src/index.ts`

```ts id="b18contractsindex"
export * from './agendas'
export * from './amendments'
export * from './auth-context'
export * from './ballots'
export * from './certifications'
export * from './gazette'
export * from './governance-bodies'
export * from './health'
export * from './membership-applications'
export * from './membership-reviews'
export * from './memberships'
export * from './official-records'
export * from './offices'
export * from './proposals'
export * from './sessions'
```

---

### 4. `packages/gov-client/src/official-records.ts`

```ts id="b18govclientor"
import {
  createOfficialRecordSchema,
  createRecordVersionSchema,
  officializeOfficialRecordSchema,
  officialRecordListSchema,
  officialRecordSchema,
  recordVersionListSchema,
  recordVersionSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createOfficialRecordsClient(options: GovClientOptions) {
  return {
    list() {
      return requestJson({
        options,
        path: '/official-records',
        schema: officialRecordListSchema,
      })
    },

    read(recordId: string) {
      return requestJson({
        options,
        path: `/official-records/${recordId}`,
        schema: officialRecordSchema,
      })
    },

    create(input: unknown) {
      const body = createOfficialRecordSchema.parse(input)

      return requestJson({
        options,
        path: '/official-records',
        method: 'POST',
        body,
        schema: officialRecordSchema,
      })
    },

    listVersions(recordId: string) {
      return requestJson({
        options,
        path: `/official-records/${recordId}/versions`,
        schema: recordVersionListSchema,
      })
    },

    createVersion(recordId: string, input: unknown) {
      const body = createRecordVersionSchema.parse(input)

      return requestJson({
        options,
        path: `/official-records/${recordId}/versions`,
        method: 'POST',
        body,
        schema: recordVersionSchema,
      })
    },

    officialize(recordId: string, input: unknown = {}) {
      const body = officializeOfficialRecordSchema.parse(input)

      return requestJson({
        options,
        path: `/official-records/${recordId}/actions/officialize`,
        method: 'POST',
        body,
        schema: officialRecordSchema,
      })
    },
  }
}
```

---

### 5. `packages/gov-client/src/gazette.ts`

```ts id="b18govclientgz"
import {
  addRecordToGazetteIssueSchema,
  createGazetteIssueSchema,
  gazetteEntryListSchema,
  gazetteEntrySchema,
  gazetteIssueListSchema,
  gazetteIssueSchema,
  publishGazetteIssueSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createGazetteClient(options: GovClientOptions) {
  return {
    listIssues() {
      return requestJson({
        options,
        path: '/gazette/issues',
        schema: gazetteIssueListSchema,
      })
    },

    readIssue(issueId: string) {
      return requestJson({
        options,
        path: `/gazette/issues/${issueId}`,
        schema: gazetteIssueSchema,
      })
    },

    createIssue(input: unknown) {
      const body = createGazetteIssueSchema.parse(input)

      return requestJson({
        options,
        path: '/gazette/issues',
        method: 'POST',
        body,
        schema: gazetteIssueSchema,
      })
    },

    listEntries(gazetteIssueId: string) {
      return requestJson({
        options,
        path: `/gazette/issues/${gazetteIssueId}/entries`,
        schema: gazetteEntryListSchema,
      })
    },

    addEntry(gazetteIssueId: string, input: unknown) {
      const body = addRecordToGazetteIssueSchema.parse(input)

      return requestJson({
        options,
        path: `/gazette/issues/${gazetteIssueId}/entries`,
        method: 'POST',
        body,
        schema: gazetteEntrySchema,
      })
    },

    publishIssue(issueId: string, input: unknown = {}) {
      const body = publishGazetteIssueSchema.parse(input)

      return requestJson({
        options,
        path: `/gazette/issues/${issueId}/actions/publish`,
        method: 'POST',
        body,
        schema: gazetteIssueSchema,
      })
    },
  }
}
```

---

### 6. `packages/gov-client/src/index.ts`

```ts id="b18govindex"
import type { GovClientOptions } from './http'
import { createAgendasClient } from './agendas'
import { createAmendmentsClient } from './amendments'
import { createBallotsClient } from './ballots'
import { createCertificationsClient } from './certifications'
import { createGazetteClient } from './gazette'
import { createGovernanceBodiesClient } from './governance-bodies'
import { createMembershipApplicationsClient } from './membership-applications'
import { createOfficialRecordsClient } from './official-records'
import { createOfficesClient } from './offices'
import { createProposalsClient } from './proposals'
import { createSessionsClient } from './sessions'

export function createGovClient(options: GovClientOptions) {
  return {
    agendas: createAgendasClient(options),
    amendments: createAmendmentsClient(options),
    ballots: createBallotsClient(options),
    certifications: createCertificationsClient(options),
    gazette: createGazetteClient(options),
    governanceBodies: createGovernanceBodiesClient(options),
    membershipApplications: createMembershipApplicationsClient(options),
    officialRecords: createOfficialRecordsClient(options),
    offices: createOfficesClient(options),
    proposals: createProposalsClient(options),
    sessions: createSessionsClient(options),
  }
}

export * from './agendas'
export * from './amendments'
export * from './ballots'
export * from './certifications'
export * from './gazette'
export * from './governance-bodies'
export * from './http'
export * from './membership-applications'
export * from './official-records'
export * from './offices'
export * from './proposals'
export * from './sessions'
```

---

### 7. `packages/gov-client/src/official-records.test.ts`

```ts id="b18govortest"
import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestJson = vi.fn()

const createOfficialRecordParse = vi.fn((input) => input)
const createRecordVersionParse = vi.fn((input) => input)
const officializeOfficialRecordParse = vi.fn((input) => input)

const officialRecordSchema = { name: 'officialRecordSchema' }
const officialRecordListSchema = { name: 'officialRecordListSchema' }
const recordVersionSchema = { name: 'recordVersionSchema' }
const recordVersionListSchema = { name: 'recordVersionListSchema' }

vi.mock('./http', () => {
  return {
    requestJson,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    officialRecordSchema,
    officialRecordListSchema,
    recordVersionSchema,
    recordVersionListSchema,
    createOfficialRecordSchema: {
      parse: createOfficialRecordParse,
    },
    createRecordVersionSchema: {
      parse: createRecordVersionParse,
    },
    officializeOfficialRecordSchema: {
      parse: officializeOfficialRecordParse,
    },
  }
})

import { createOfficialRecordsClient } from './official-records'

describe('createOfficialRecordsClient', () => {
  const options = {
    baseUrl: 'http://localhost:3002',
    getToken: async () => 'token-1',
  } as never

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists official records', async () => {
    requestJson.mockResolvedValueOnce([
      {
        id: 'record-1',
        title: 'Act I',
        status: 'DRAFT',
      },
    ])

    const client = createOfficialRecordsClient(options)
    const result = await client.list()

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/official-records',
      schema: officialRecordListSchema,
    })
    expect(result[0].id).toBe('record-1')
  })

  it('reads an official record', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'record-1',
      title: 'Act I',
      status: 'OFFICIAL',
    })

    const client = createOfficialRecordsClient(options)
    const result = await client.read('record-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/official-records/record-1',
      schema: officialRecordSchema,
    })
    expect(result.status).toBe('OFFICIAL')
  })

  it('creates an official record', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'record-1',
      title: 'Act I',
      status: 'DRAFT',
    })

    const client = createOfficialRecordsClient(options)
    const input = {
      recordType: 'ACT',
      title: 'Act I',
      summary: 'Founding act',
      sourceEntityType: 'Proposal',
      sourceEntityId: 'proposal-1',
    }

    const result = await client.create(input)

    expect(createOfficialRecordParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/official-records',
      method: 'POST',
      body: input,
      schema: officialRecordSchema,
    })
    expect(result.status).toBe('DRAFT')
  })

  it('lists and creates record versions', async () => {
    const client = createOfficialRecordsClient(options)

    requestJson.mockResolvedValueOnce([
      {
        id: 'version-1',
        officialRecordId: 'record-1',
        versionNumber: 1,
      },
    ])

    const versions = await client.listVersions('record-1')
    expect(requestJson).toHaveBeenNthCalledWith(1, {
      options,
      path: '/official-records/record-1/versions',
      schema: recordVersionListSchema,
    })
    expect(versions[0].versionNumber).toBe(1)

    requestJson.mockResolvedValueOnce({
      id: 'version-2',
      officialRecordId: 'record-1',
      versionNumber: 2,
    })

    const input = {
      bodyMarkdown: '# Act I\n\nUpdated text',
      changeSummary: 'Clarified section 1',
    }

    const created = await client.createVersion('record-1', input)

    expect(createRecordVersionParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenNthCalledWith(2, {
      options,
      path: '/official-records/record-1/versions',
      method: 'POST',
      body: input,
      schema: recordVersionSchema,
    })
    expect(created.versionNumber).toBe(2)
  })

  it('officializes a record', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'record-1',
      title: 'Act I',
      status: 'OFFICIAL',
    })

    const client = createOfficialRecordsClient(options)
    const input = {
      note: 'Approved by registrar.',
    }

    const result = await client.officialize('record-1', input)

    expect(officializeOfficialRecordParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/official-records/record-1/actions/officialize',
      method: 'POST',
      body: input,
      schema: officialRecordSchema,
    })
    expect(result.status).toBe('OFFICIAL')
  })
})
```

---

### 8. `packages/gov-client/src/gazette.test.ts`

```ts id="b18govgztest"
import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestJson = vi.fn()

const createGazetteIssueParse = vi.fn((input) => input)
const addRecordToGazetteIssueParse = vi.fn((input) => input)
const publishGazetteIssueParse = vi.fn((input) => input)

const gazetteIssueSchema = { name: 'gazetteIssueSchema' }
const gazetteIssueListSchema = { name: 'gazetteIssueListSchema' }
const gazetteEntrySchema = { name: 'gazetteEntrySchema' }
const gazetteEntryListSchema = { name: 'gazetteEntryListSchema' }

vi.mock('./http', () => {
  return {
    requestJson,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    gazetteIssueSchema,
    gazetteIssueListSchema,
    gazetteEntrySchema,
    gazetteEntryListSchema,
    createGazetteIssueSchema: {
      parse: createGazetteIssueParse,
    },
    addRecordToGazetteIssueSchema: {
      parse: addRecordToGazetteIssueParse,
    },
    publishGazetteIssueSchema: {
      parse: publishGazetteIssueParse,
    },
  }
})

import { createGazetteClient } from './gazette'

describe('createGazetteClient', () => {
  const options = {
    baseUrl: 'http://localhost:3002',
    getToken: async () => 'token-1',
  } as never

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists and reads gazette issues', async () => {
    const client = createGazetteClient(options)

    requestJson.mockResolvedValueOnce([
      {
        id: 'issue-1',
        issueNumber: '0001',
        publicationState: 'DRAFT',
      },
    ])

    const issues = await client.listIssues()
    expect(requestJson).toHaveBeenNthCalledWith(1, {
      options,
      path: '/gazette/issues',
      schema: gazetteIssueListSchema,
    })
    expect(issues[0].id).toBe('issue-1')

    requestJson.mockResolvedValueOnce({
      id: 'issue-1',
      issueNumber: '0001',
      publicationState: 'PUBLISHED',
    })

    const issue = await client.readIssue('issue-1')
    expect(requestJson).toHaveBeenNthCalledWith(2, {
      options,
      path: '/gazette/issues/issue-1',
      schema: gazetteIssueSchema,
    })
    expect(issue.publicationState).toBe('PUBLISHED')
  })

  it('creates an issue', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'issue-1',
      issueNumber: '0001',
      publicationState: 'DRAFT',
    })

    const client = createGazetteClient(options)
    const input = {
      issueNumber: '0001',
      title: 'Issue 1',
    }

    const result = await client.createIssue(input)

    expect(createGazetteIssueParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/gazette/issues',
      method: 'POST',
      body: input,
      schema: gazetteIssueSchema,
    })
    expect(result.id).toBe('issue-1')
  })

  it('lists and adds gazette entries', async () => {
    const client = createGazetteClient(options)

    requestJson.mockResolvedValueOnce([
      {
        id: 'entry-1',
        gazetteIssueId: 'issue-1',
        officialRecordId: 'record-1',
        publicationOrder: 1,
      },
    ])

    const entries = await client.listEntries('issue-1')
    expect(requestJson).toHaveBeenNthCalledWith(1, {
      options,
      path: '/gazette/issues/issue-1/entries',
      schema: gazetteEntryListSchema,
    })
    expect(entries[0].id).toBe('entry-1')

    requestJson.mockResolvedValueOnce({
      id: 'entry-2',
      gazetteIssueId: 'issue-1',
      officialRecordId: 'record-2',
      publicationOrder: 2,
    })

    const input = {
      officialRecordId: 'record-2',
      publicationOrder: 2,
    }

    const created = await client.addEntry('issue-1', input)

    expect(addRecordToGazetteIssueParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenNthCalledWith(2, {
      options,
      path: '/gazette/issues/issue-1/entries',
      method: 'POST',
      body: input,
      schema: gazetteEntrySchema,
    })
    expect(created.id).toBe('entry-2')
  })

  it('publishes an issue', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'issue-1',
      issueNumber: '0001',
      publicationState: 'PUBLISHED',
    })

    const client = createGazetteClient(options)
    const input = {
      note: 'Published in regular issue.',
    }

    const result = await client.publishIssue('issue-1', input)

    expect(publishGazetteIssueParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/gazette/issues/issue-1/actions/publish',
      method: 'POST',
      body: input,
      schema: gazetteIssueSchema,
    })
    expect(result.publicationState).toBe('PUBLISHED')
  })
})
```

---

### 9. `docs/dev/NEXT_ACTIONS_FINAL.md`

```md id="b18nextfinal"
# Next Actions — Final

## Current state

The core backend constitutional flow is now effectively implemented:

- certified outcome
- official record draft
- record versioning
- ratified outcome
- officialization
- gazette issue entry
- gazette publication
- published official record

The typed client now also exposes publication surfaces:

- `govClient.officialRecords`
- `govClient.gazette`

## Highest-value remaining work

The remaining work is not another major backend architecture pass.

It is integration and stabilization work.

### 1. Frontend integration

Connect admin/operator UI flows to:

- official record creation and review
- record version editing
- officialization action
- gazette issue creation
- add-to-gazette action
- gazette publication action

### 2. Repository-wide test stabilization

Run:

- typecheck
- unit tests
- route tests
- end-to-end publication tests

Then fix any drift between generated code and actual local repository structure.

### 3. Canonical app cleanup

Where duplicate or legacy bootstraps still exist, retire them in favor of the canonical app factory and canonical server entrypoint.

### 4. Operational hardening

Add:

- structured logging
- metrics
- DB migration checks
- production auth config validation
- CI gates for typecheck and tests

## Recommended immediate next engineering move

The best immediate move is to implement the frontend/admin publication workflow against the new `gov-client` publication surfaces.
```

## What this does

This is the last meaningful integration bridge before frontend/admin wiring:

* `contracts` now expose publication DTOs and inputs
* `gov-client` now exposes:

  * `officialRecords`
  * `gazette`
* the publication backend and the frontend client are now aligned on the same route surface

At this point, the next work is mostly not backend architecture anymore. It is UI integration, repository stabilization, and cleanup.
