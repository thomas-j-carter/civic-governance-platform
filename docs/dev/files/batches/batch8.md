## Batch 8 — certifications + ratifications vertical in the current repo layout

### 1. `packages/contracts/src/certifications.ts`

```ts id="1xrn9w"
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

### 2. `packages/contracts/src/index.ts`

```ts id="xavg7z"
export * from './agendas'
export * from './amendments'
export * from './auth-context'
export * from './ballots'
export * from './certifications'
export * from './governance-bodies'
export * from './health'
export * from './membership-applications'
export * from './membership-reviews'
export * from './memberships'
export * from './offices'
export * from './proposals'
export * from './sessions'
```

### 3. `apps/gov-api/src/certifications/service.ts`

```ts id="4n4krw"
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

    return toRatificationDto(created)
  }
}

export const certificationsService = new CertificationsService()
```

### 4. `apps/gov-api/src/http/routes/certifications.ts`

```ts id="yxazfq"
import { Hono } from 'hono'
import {
  createCertificationSchema,
  rejectCertificationSchema,
} from '@ardtire/contracts'
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

export function createCertificationsRoutes() {
  const app = new Hono<AppBindings>()

  app.post('/certifications', async (c) => {
    try {
      const actor = c.get('actor')
      const json = await c.req.json().catch(() => ({}))
      const data = createCertificationSchema.parse(json)
      const created = await certificationsService.create(actor, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/certifications/:certificationId', async (c) => {
    try {
      const actor = c.get('actor')
      const certificationId = c.req.param('certificationId')
      const item = await certificationsService.read(actor, certificationId)

      if (!item) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Certification not found.',
          },
          404,
        )
      }

      return c.json(item)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.post('/certifications/:certificationId/certify', async (c) => {
    try {
      const actor = c.get('actor')
      const certificationId = c.req.param('certificationId')
      const updated = await certificationsService.certify(actor, certificationId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Certification not found.',
          },
          404,
        )
      }

      return c.json(updated)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.post('/certifications/:certificationId/reject', async (c) => {
    try {
      const actor = c.get('actor')
      const certificationId = c.req.param('certificationId')
      const json = await c.req.json().catch(() => ({}))
      const data = rejectCertificationSchema.parse(json)
      const updated = await certificationsService.reject(actor, certificationId, data)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Certification not found.',
          },
          404,
        )
      }

      return c.json(updated)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  return app
}
```

### 5. `apps/gov-api/src/http/routes/ratifications.ts`

```ts id="u4vvw7"
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

### 6. `apps/gov-api/src/app.ts`

```ts id="n2lt23"
import { Hono } from 'hono'
import { authContextMiddleware } from './http/middleware/auth-context'
import { devActorProvisioningMiddleware } from './http/middleware/dev-actor-provisioning'
import { requestIdMiddleware } from './http/middleware/request-id'
import { createAgendasRoutes } from './http/routes/agendas'
import { createAmendmentsRoutes } from './http/routes/amendments'
import { createAuthContextRoutes } from './http/routes/auth-context'
import { createBallotsRoutes } from './http/routes/ballots'
import { createCertificationsRoutes } from './http/routes/certifications'
import { createGovernanceBodiesRoutes } from './http/routes/governance-bodies'
import { createHealthRoutes } from './http/routes/health'
import { createMembershipApplicationRoutes } from './http/routes/membership-applications'
import { createOfficesRoutes } from './http/routes/offices'
import { createProposalsRoutes } from './http/routes/proposals'
import { createRatificationsRoutes } from './http/routes/ratifications'
import { createSessionsRoutes } from './http/routes/sessions'
import type { AppBindings } from './http/types'

export function createApp() {
  const app = new Hono<AppBindings>()

  app.use('*', requestIdMiddleware)
  app.use('*', authContextMiddleware)
  app.use('*', devActorProvisioningMiddleware)

  app.onError((error, c) => {
    console.error('Unhandled request error', {
      requestId: c.get('requestId'),
      message: error.message,
      stack: error.stack,
    })

    return c.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
      500,
    )
  })

  app.route('/', createHealthRoutes())
  app.route('/', createAuthContextRoutes())
  app.route('/', createMembershipApplicationRoutes())
  app.route('/', createGovernanceBodiesRoutes())
  app.route('/', createOfficesRoutes())
  app.route('/', createSessionsRoutes())
  app.route('/', createAgendasRoutes())
  app.route('/', createProposalsRoutes())
  app.route('/', createBallotsRoutes())
  app.route('/', createCertificationsRoutes())
  app.route('/', createRatificationsRoutes())
  app.route('/', createAmendmentsRoutes())

  return app
}
```

### 7. `packages/gov-client/src/certifications.ts`

```ts id="4r5hde"
import {
  certificationSchema,
  createCertificationSchema,
  createRatificationSchema,
  ratificationSchema,
  rejectCertificationSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createCertificationsClient(options: GovClientOptions) {
  return {
    create(input: unknown) {
      const body = createCertificationSchema.parse(input)

      return requestJson({
        options,
        path: '/certifications',
        method: 'POST',
        body,
        schema: certificationSchema,
      })
    },

    read(certificationId: string) {
      return requestJson({
        options,
        path: `/certifications/${certificationId}`,
        schema: certificationSchema,
      })
    },

    certify(certificationId: string) {
      return requestJson({
        options,
        path: `/certifications/${certificationId}/certify`,
        method: 'POST',
        schema: certificationSchema,
      })
    },

    reject(certificationId: string, input: unknown) {
      const body = rejectCertificationSchema.parse(input)

      return requestJson({
        options,
        path: `/certifications/${certificationId}/reject`,
        method: 'POST',
        body,
        schema: certificationSchema,
      })
    },

    createRatification(input: unknown) {
      const body = createRatificationSchema.parse(input)

      return requestJson({
        options,
        path: '/ratifications',
        method: 'POST',
        body,
        schema: ratificationSchema,
      })
    },
  }
}
```

### 8. `packages/gov-client/src/index.ts`

```ts id="e1a93t"
import type { GovClientOptions } from './http'
import { createAgendasClient } from './agendas'
import { createAmendmentsClient } from './amendments'
import { createBallotsClient } from './ballots'
import { createCertificationsClient } from './certifications'
import { createGovernanceBodiesClient } from './governance-bodies'
import { createMembershipApplicationsClient } from './membership-applications'
import { createOfficesClient } from './offices'
import { createProposalsClient } from './proposals'
import { createSessionsClient } from './sessions'

export function createGovClient(options: GovClientOptions) {
  return {
    agendas: createAgendasClient(options),
    amendments: createAmendmentsClient(options),
    ballots: createBallotsClient(options),
    certifications: createCertificationsClient(options),
    governanceBodies: createGovernanceBodiesClient(options),
    membershipApplications: createMembershipApplicationsClient(options),
    offices: createOfficesClient(options),
    proposals: createProposalsClient(options),
    sessions: createSessionsClient(options),
  }
}

export * from './agendas'
export * from './amendments'
export * from './ballots'
export * from './certifications'
export * from './governance-bodies'
export * from './http'
export * from './membership-applications'
export * from './offices'
export * from './proposals'
export * from './sessions'
```

### 9. `apps/gov-api/src/http/routes/certifications.test.ts`

```ts id="ikkrco"
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

const createCertificationParse = vi.fn((input) => input)
const rejectCertificationParse = vi.fn((input) => input)

vi.mock('../../certifications/service', () => {
  return {
    certificationsService: certificationsServiceMock,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    createCertificationSchema: {
      parse: createCertificationParse,
    },
    rejectCertificationSchema: {
      parse: rejectCertificationParse,
    },
  }
})

import { createCertificationsRoutes } from './certifications'

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

  app.route('/', createCertificationsRoutes())

  return app
}

describe('createCertificationsRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a certification', async () => {
    certificationsServiceMock.create.mockResolvedValue({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'pending',
      certifiedByPersonId: null,
      certifiedAt: null,
      rejectedAt: null,
      notes: 'Awaiting review.',
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/certifications', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        ballotId: 'ballot-1',
        notes: 'Awaiting review.',
        quorumRuleVersionId: 'rule-q-1',
        thresholdRuleVersionId: 'rule-t-1',
        certificationRuleVersionId: 'rule-c-1',
      }),
    })

    expect(response.status).toBe(201)
    expect(createCertificationParse).toHaveBeenCalled()
    const body = await response.json()
    expect(body.id).toBe('cert-1')
    expect(body.status).toBe('pending')
  })

  it('reads a certification', async () => {
    certificationsServiceMock.read.mockResolvedValue({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'certified',
      certifiedByPersonId: 'person-1',
      certifiedAt: '2026-03-21T01:00:00.000Z',
      rejectedAt: null,
      notes: 'Certified.',
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T01:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/certifications/cert-1')

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.status).toBe('certified')
  })

  it('certifies a certification record', async () => {
    certificationsServiceMock.certify.mockResolvedValue({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'certified',
      certifiedByPersonId: 'person-1',
      certifiedAt: '2026-03-21T01:00:00.000Z',
      rejectedAt: null,
      notes: 'Certified.',
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T01:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/certifications/cert-1/certify', {
      method: 'POST',
    })

    expect(response.status).toBe(200)
    expect((await response.json()).status).toBe('certified')
  })

  it('rejects a certification record', async () => {
    certificationsServiceMock.reject.mockResolvedValue({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'rejected',
      certifiedByPersonId: null,
      certifiedAt: null,
      rejectedAt: '2026-03-21T01:00:00.000Z',
      notes: 'Threshold not met.',
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T01:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/certifications/cert-1/reject', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        notes: 'Threshold not met.',
      }),
    })

    expect(response.status).toBe(200)
    expect(rejectCertificationParse).toHaveBeenCalledWith({
      notes: 'Threshold not met.',
    })
    expect((await response.json()).status).toBe('rejected')
  })

  it('maps service errors to structured responses', async () => {
    certificationsServiceMock.certify.mockRejectedValue(
      new AppServiceError({
        status: 400,
        code: 'TALLY_REQUIRED',
        message: 'Cannot certify a ballot result before a tally exists.',
      }),
    )

    const app = createTestApp()
    const response = await app.request('http://localhost/certifications/cert-1/certify', {
      method: 'POST',
    })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      code: 'TALLY_REQUIRED',
      message: 'Cannot certify a ballot result before a tally exists.',
    })
  })
})
```

### 10. `apps/gov-api/src/http/routes/ratifications.test.ts`

```ts id="s28v1o"
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hono } from 'hono'

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

  it('creates a ratification', async () => {
    certificationsServiceMock.createRatification.mockResolvedValue({
      id: 'rat-1',
      proposalId: 'proposal-1',
      certificationRecordId: 'cert-1',
      status: 'ratified',
      ratifiedByPersonId: 'person-1',
      ratifiedAt: '2026-03-21T02:00:00.000Z',
      notes: 'Ratified.',
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
        notes: 'Ratified.',
      }),
    })

    expect(response.status).toBe(201)
    expect(createRatificationParse).toHaveBeenCalled()
    const body = await response.json()
    expect(body.id).toBe('rat-1')
    expect(body.status).toBe('ratified')
  })
})
```

### 11. `apps/gov-api/src/certifications/service.test.ts`

```ts id="ekhzyq"
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppServiceError } from '../lib/errors'

const hasRoleMock = vi.fn()
const hasPermissionMock = vi.fn()

const prismaMock = {
  ballot: {
    findUnique: vi.fn(),
  },
  voteTally: {
    findFirst: vi.fn(),
  },
  certificationRecord: {
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  proposal: {
    findUnique: vi.fn(),
  },
  ratificationRecord: {
    create: vi.fn(),
  },
}

vi.mock('@ardtire/authz', () => {
  return {
    hasRole: hasRoleMock,
    hasPermission: hasPermissionMock,
  }
})

vi.mock('../lib/prisma', () => {
  return {
    prisma: prismaMock,
  }
})

import { CertificationsService } from './service'

function createActor(overrides?: Record<string, unknown>) {
  return {
    principalId: 'user-1',
    personId: 'person-1',
    memberId: 'member-1',
    roles: ['member'],
    permissions: [],
    ...overrides,
  } as never
}

describe('CertificationsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasRoleMock.mockReturnValue(false)
    hasPermissionMock.mockReturnValue(false)
  })

  it('rejects certification creation when actor lacks authority', async () => {
    const service = new CertificationsService()

    await expect(
      service.create(createActor(), {
        ballotId: 'ballot-1',
        notes: 'Awaiting review.',
        quorumRuleVersionId: 'rule-q-1',
        thresholdRuleVersionId: 'rule-t-1',
        certificationRuleVersionId: 'rule-c-1',
      }),
    ).rejects.toMatchObject<AppServiceError>({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Not authorized to create certifications.',
    })
  })

  it('rejects duplicate certifications for a ballot', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'create_certification'
    })

    prismaMock.ballot.findUnique.mockResolvedValue({
      id: 'ballot-1',
    })

    prismaMock.certificationRecord.findFirst.mockResolvedValue({
      id: 'cert-1',
    })

    const service = new CertificationsService()

    await expect(
      service.create(createActor(), {
        ballotId: 'ballot-1',
        notes: 'Awaiting review.',
        quorumRuleVersionId: 'rule-q-1',
        thresholdRuleVersionId: 'rule-t-1',
        certificationRuleVersionId: 'rule-c-1',
      }),
    ).rejects.toMatchObject<AppServiceError>({
      status: 409,
      code: 'CERTIFICATION_ALREADY_EXISTS',
    })
  })

  it('certifies a record when a tally exists', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'certify_ballot_result'
    })

    prismaMock.certificationRecord.findUnique.mockResolvedValue({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'PENDING',
      certifiedByPersonId: null,
      certifiedAt: null,
      rejectedAt: null,
      notes: null,
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
    })

    prismaMock.voteTally.findFirst.mockResolvedValue({
      id: 'tally-1',
      ballotId: 'ballot-1',
    })

    prismaMock.certificationRecord.update.mockResolvedValue({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'CERTIFIED',
      certifiedByPersonId: 'person-1',
      certifiedAt: new Date('2026-03-21T01:00:00.000Z'),
      rejectedAt: null,
      notes: null,
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T01:00:00.000Z'),
    })

    const service = new CertificationsService()
    const result = await service.certify(createActor(), 'cert-1')

    expect(result?.status).toBe('certified')
    expect(prismaMock.certificationRecord.update).toHaveBeenCalled()
  })

  it('rejects certification when no tally exists', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'certify_ballot_result'
    })

    prismaMock.certificationRecord.findUnique.mockResolvedValue({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'PENDING',
      certifiedByPersonId: null,
      certifiedAt: null,
      rejectedAt: null,
      notes: null,
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
    })

    prismaMock.voteTally.findFirst.mockResolvedValue(null)

    const service = new CertificationsService()

    await expect(service.certify(createActor(), 'cert-1')).rejects.toMatchObject<AppServiceError>({
      status: 400,
      code: 'TALLY_REQUIRED',
      message: 'Cannot certify a ballot result before a tally exists.',
    })
  })

  it('creates a ratification when proposal exists and certification is certified', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'ratify_proposal'
    })

    prismaMock.proposal.findUnique.mockResolvedValue({
      id: 'proposal-1',
    })

    prismaMock.certificationRecord.findUnique.mockResolvedValue({
      id: 'cert-1',
      status: 'CERTIFIED',
    })

    prismaMock.ratificationRecord.create.mockResolvedValue({
      id: 'rat-1',
      proposalId: 'proposal-1',
      certificationRecordId: 'cert-1',
      status: 'RATIFIED',
      ratifiedByPersonId: 'person-1',
      ratifiedAt: new Date('2026-03-21T02:00:00.000Z'),
      notes: 'Ratified.',
      createdAt: new Date('2026-03-21T02:00:00.000Z'),
      updatedAt: new Date('2026-03-21T02:00:00.000Z'),
    })

    const service = new CertificationsService()
    const result = await service.createRatification(createActor(), {
      proposalId: 'proposal-1',
      certificationRecordId: 'cert-1',
      notes: 'Ratified.',
    })

    expect(result.status).toBe('ratified')
  })
})
```

### 12. `packages/gov-client/src/certifications.test.ts`

```ts id="btnvyo"
import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestJson = vi.fn()

const createCertificationParse = vi.fn((input) => input)
const rejectCertificationParse = vi.fn((input) => input)
const createRatificationParse = vi.fn((input) => input)

const certificationSchema = { name: 'certificationSchema' }
const ratificationSchema = { name: 'ratificationSchema' }

vi.mock('./http', () => {
  return {
    requestJson,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    certificationSchema,
    ratificationSchema,
    createCertificationSchema: {
      parse: createCertificationParse,
    },
    rejectCertificationSchema: {
      parse: rejectCertificationParse,
    },
    createRatificationSchema: {
      parse: createRatificationParse,
    },
  }
})

import { createCertificationsClient } from './certifications'

describe('createCertificationsClient', () => {
  const options = {
    baseUrl: 'http://localhost:3002',
    getToken: async () => 'token-1',
  } as never

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a certification', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'pending',
    })

    const client = createCertificationsClient(options)
    const input = {
      ballotId: 'ballot-1',
      notes: 'Awaiting review.',
      quorumRuleVersionId: 'rule-q-1',
      thresholdRuleVersionId: 'rule-t-1',
      certificationRuleVersionId: 'rule-c-1',
    }

    const result = await client.create(input)

    expect(createCertificationParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/certifications',
      method: 'POST',
      body: input,
      schema: certificationSchema,
    })
    expect(result.id).toBe('cert-1')
  })

  it('reads a certification', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'certified',
    })

    const client = createCertificationsClient(options)
    const result = await client.read('cert-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/certifications/cert-1',
      schema: certificationSchema,
    })
    expect(result.status).toBe('certified')
  })

  it('certifies a certification record', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'certified',
    })

    const client = createCertificationsClient(options)
    const result = await client.certify('cert-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/certifications/cert-1/certify',
      method: 'POST',
      schema: certificationSchema,
    })
    expect(result.status).toBe('certified')
  })

  it('rejects a certification record', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'cert-1',
      ballotId: 'ballot-1',
      status: 'rejected',
    })

    const client = createCertificationsClient(options)
    const input = {
      notes: 'Threshold not met.',
    }

    const result = await client.reject('cert-1', input)

    expect(rejectCertificationParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/certifications/cert-1/reject',
      method: 'POST',
      body: input,
      schema: certificationSchema,
    })
    expect(result.status).toBe('rejected')
  })

  it('creates a ratification', async () => {
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
      notes: 'Ratified.',
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
})
```

## What this batch gives you

This completes the next real vertical in the committed repo style:

* contract DTOs and schemas for certifications and ratifications
* Prisma-backed certification and ratification service
* Hono routes under the current `apps/gov-api/src/http/routes` structure
* thin `gov-client` wrapper under the current `packages/gov-client/src` structure
* matching route, service, and client tests

## Strongest next step

The best next batch is the **official records + gazette publication vertical** in this same current architecture so the platform can move from ballot outcome to certified/ratified outcome to official/public publication.
