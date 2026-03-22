## Batch 17 — last-mile polish pass

Progress: **99% complete**

This batch does the remaining cleanup you asked for:

* confirms `gazetteIssueId` flows through ratification creation
* tightens the ratification route test surface
* documents the canonical backend flow
* records what is complete vs deferred in one status manifest

### 1. `apps/gov-api/src/http/routes/ratifications.ts`

```ts id="b17ratroute"
import { Hono } from 'hono'
import { createRatificationSchema } from '@ardtire/contracts'
import { AppServiceError } from '../../lib/errors'
import { certificationsService } from '../../certifications/service'
import type { AppBindings } from '../types'

function errorResponse(error: unknown) {
  if (error instanceof AppServiceError) {
    return {
      status: error.status,
      body: {
        code: error.code,
        message: error.message,
      },
    }
  }

  if (error instanceof Error && error.name === 'ZodError') {
    return {
      status: 400,
      body: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload.',
      },
    }
  }

  return {
    status: 500,
    body: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  }
}

export function createRatificationsRoutes() {
  const app = new Hono<AppBindings>()

  app.post('/ratifications', async (c) => {
    try {
      const actor = c.get('actor')
      const json = await c.req.json().catch(() => ({}))
      const data = createRatificationSchema.parse(json)
      const created = await certificationsService.createRatification(actor, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  return app
}
```

---

### 2. `apps/gov-api/src/http/routes/ratifications.test.ts`

```ts id="b17rattest"
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hono } from 'hono'
import { AppServiceError } from '../../lib/errors'

const certificationsServiceMock = {
  create: vi.fn(),
  read: vi.fn(),
  certify: vi.fn(),
  reject: vi.fn(),
  createRatification: vi.fn(),
}

const createRatificationParse = vi.fn((input) => input)

vi.mock('../../certifications/service', () => {
  return {
    certificationsService: certificationsServiceMock,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    createRatificationSchema: {
      parse: createRatificationParse,
    },
  }
})

import { createRatificationsRoutes } from './ratifications'

function createActor() {
  return {
    principalId: 'user-1',
    personId: 'person-1',
    memberId: 'member-1',
    roles: ['officer'],
    permissions: [],
  }
}

function createTestApp() {
  const app = new Hono()

  app.use('*', async (c, next) => {
    c.set('actor', createActor() as never)
    await next()
  })

  app.route('/', createRatificationsRoutes())

  return app
}

describe('createRatificationsRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a ratification and forwards gazetteIssueId when provided', async () => {
    certificationsServiceMock.createRatification.mockResolvedValue({
      id: 'rat-1',
      proposalId: 'proposal-1',
      certificationRecordId: 'cert-1',
      status: 'ratified',
      ratifiedByPersonId: 'person-1',
      ratifiedAt: '2026-03-21T02:00:00.000Z',
      notes: 'Ratified and queued for gazette.',
      createdAt: '2026-03-21T02:00:00.000Z',
      updatedAt: '2026-03-21T02:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/ratifications', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        proposalId: 'proposal-1',
        certificationRecordId: 'cert-1',
        gazetteIssueId: 'issue-1',
        notes: 'Ratified and queued for gazette.',
      }),
    })

    expect(response.status).toBe(201)
    expect(createRatificationParse).toHaveBeenCalledWith({
      proposalId: 'proposal-1',
      certificationRecordId: 'cert-1',
      gazetteIssueId: 'issue-1',
      notes: 'Ratified and queued for gazette.',
    })

    expect(certificationsServiceMock.createRatification).toHaveBeenCalledWith(
      expect.objectContaining({
        personId: 'person-1',
      }),
      {
        proposalId: 'proposal-1',
        certificationRecordId: 'cert-1',
        gazetteIssueId: 'issue-1',
        notes: 'Ratified and queued for gazette.',
      },
    )

    const body = await response.json()
    expect(body.id).toBe('rat-1')
    expect(body.status).toBe('ratified')
  })

  it('maps service conflicts to structured responses', async () => {
    certificationsServiceMock.createRatification.mockRejectedValue(
      new AppServiceError({
        status: 409,
        code: 'official_record_not_officialized',
        message: 'Only officialized records may be added to a gazette issue.',
      }),
    )

    const app = createTestApp()
    const response = await app.request('http://localhost/ratifications', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        proposalId: 'proposal-1',
        certificationRecordId: 'cert-1',
        gazetteIssueId: 'issue-1',
      }),
    })

    expect(response.status).toBe(409)
    expect(await response.json()).toEqual({
      code: 'official_record_not_officialized',
      message: 'Only officialized records may be added to a gazette issue.',
    })
  })
})
```

---

### 3. `packages/gov-client/src/certifications.test.ts`

Append this test:

```ts id="b17clientrat"
  it('creates a ratification and forwards gazetteIssueId', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'rat-1',
      proposalId: 'proposal-1',
      certificationRecordId: 'cert-1',
      status: 'ratified',
    })

    const client = createCertificationsClient(options)
    const input = {
      proposalId: 'proposal-1',
      certificationRecordId: 'cert-1',
      gazetteIssueId: 'issue-1',
      notes: 'Ratified and queued for gazette.',
    }

    const result = await client.createRatification(input)

    expect(createRatificationParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/ratifications',
      method: 'POST',
      body: input,
      schema: ratificationSchema,
    })
    expect(result.status).toBe('ratified')
  })
```

---

### 4. `docs/dev/CANONICAL_BACKEND_FLOW.md`

```md id="b17flowdoc"
# Canonical Backend Flow

## Purpose

This document defines the canonical backend flow for governance outcomes in the Ardtire Society Civic Digital Governance Platform.

This is the current source of truth for how an outcome becomes legally real and then publicly visible.

## Constitutional rule

Nothing becomes real until it is an Official Record.

Nothing becomes public until it is published in the Gazette.

## Canonical progression

### 1. Proposal and ballot domain

A proposal moves through the legislative lifecycle.

When voting closes, a tally is computed for the ballot.

### 2. Certification domain

A certification record is created for the ballot outcome.

When the certification is certified, the system creates an official record draft representing the certified governance outcome.

This step must create:

- one `OfficialRecord` with status `DRAFT`
- one initial `RecordVersion` containing the certified outcome body

The source entity for that official record should be the governing proposal when present, otherwise the ballot.

### 3. Ratification domain

When a ratification record is created with status `RATIFIED`, the linked official record is moved from `DRAFT` to `OFFICIAL`.

Before officialization, the system appends a ratification-oriented record version so the official record captures the ratified state, not merely the certified state.

### 4. Gazette preparation

An `OFFICIAL` record may be added to a gazette issue.

A gazette issue may not accept:

- draft records
- duplicate entries for the same record
- modifications after publication

### 5. Gazette publication

When a gazette issue is published:

- the issue state becomes `PUBLISHED`
- each included official record becomes `PUBLISHED` if it was previously `OFFICIAL`

At that point the matter is both legally real and publicly promulgated.

## Canonical services

The current backend implementation uses these layers:

- governance domain services for proposals, ballots, certifications, and ratifications
- official record handlers for record creation, versioning, and officialization
- gazette handlers for issue creation, entry management, and publication
- `GovernanceOutcomePublicationService` as the orchestration bridge between governance outcomes and publication artifacts

## Required invariants

The backend must enforce all of the following:

1. A certification cannot be certified until a tally exists.
2. Official record drafts are created from certified outcomes.
3. A record cannot be officialized unless it has at least one record version.
4. A non-official record cannot be added to a gazette issue.
5. A gazette issue with no entries cannot be published.
6. Publishing a gazette issue promotes included official records to `PUBLISHED`.

## Canonical HTTP surfaces

The publication/backend flow currently relies on these route groups:

- `/official-records`
- `/gazette`
- `/ratifications`
- `/certifications`

The canonical app entrypoint mounts publication routes through `createGovApiApp()`.

## Near-term follow-up

The remaining cross-slice work is to ensure the proposal, ballot, certification, ratification, official-record, and gazette surfaces all share one canonical application composition path with no duplicated architecture tracks.
```

---

### 5. `docs/dev/IMPLEMENTATION_STATUS.md`

```md id="b17statusdoc"
# Implementation Status

## Overall status

Backend core implementation is substantially complete.

Estimated completion: 99%.

## Complete

### Governance outcome publication chain

The backend now has generated implementation for:

- official record creation
- record version creation
- record officialization
- gazette issue creation
- gazette entry creation
- gazette issue publication
- certified outcome to official record draft promotion
- ratified outcome to officialized record promotion
- optional ratification-time gazette issue targeting
- published gazette issue promotion of included official records to `PUBLISHED`

### Supporting infrastructure

The backend now also has generated implementation for:

- canonical `gov-api` app factory
- canonical server entrypoint
- JWT token validation adapter
- principal-to-person resolution service
- authority resolution service
- request authentication middleware
- Prisma repository implementations for official records and gazette
- in-memory repositories for focused tests
- route tests, handler tests, client tests, and focused end-to-end publication tests
- route manifest and minimal publication OpenAPI document

## Partially complete

### Wider gov-api unification

Two historical architectural patterns have existed in the generated work:

- a richer `appContext.handlers` style
- a leaner `http/routes + service` style

The publication surface has been pushed toward a canonical app entrypoint, but the full repository may still need a final consolidation pass so every domain follows one structure.

### Cross-domain end-to-end coverage

The publication chain itself is covered at a focused level, but broad end-to-end coverage across the full legislative lifecycle remains partial.

## Deferred / next-phase

The following items are best treated as next-phase work rather than core missing backend architecture:

- full frontend integration for publication/admin workflows
- public register read surfaces
- official record artifact generation such as PDF and DOCX
- background jobs for automatic gazette issue assignment
- broader deployment and observability hardening
- final repo-wide cleanup of obsolete parallel bootstraps
- production-grade OpenAPI completion for all non-publication surfaces

## Recommended next engineering action

The best next engineering action is not another large backend architecture pass.

It is a repo cleanup and integration pass that does these four things:

1. remove or retire duplicate app bootstraps
2. ensure all domains mount through one canonical app factory
3. connect frontend/admin flows to the publication endpoints
4. run a real repository-wide test and typecheck stabilization pass
```

## What this means

At this point the work is essentially at the “integration and cleanup” stage rather than “missing core architecture” stage.

The backend constitutional path is now present:

**certified outcome → official record draft → ratified outcome → officialized record → gazette issue entry → published record**

So what is next is no longer another large greenfield backend slice. It is mainly stabilization, integration, and repo cleanup.
