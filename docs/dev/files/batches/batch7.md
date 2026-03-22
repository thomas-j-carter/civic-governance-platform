## Batch 7 — ballot vertical in the current repo layout

### 1. `packages/contracts/src/ballots.ts`

```ts
import { z } from 'zod'

export const ballotStates = [
  'draft',
  'scheduled',
  'open',
  'closed',
  'tallying',
  'result_computed',
  'expired',
  'cancelled',
] as const

export const voteChoices = ['yes', 'no', 'abstain'] as const

export const ballotStateSchema = z.enum(ballotStates)
export const voteChoiceSchema = z.enum(voteChoices)

export const ballotSchema = z.object({
  id: z.string(),
  proposalId: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  state: ballotStateSchema,
  scheduledOpenAt: z.string().nullable().optional(),
  openedAt: z.string().nullable().optional(),
  scheduledCloseAt: z.string().nullable().optional(),
  closedAt: z.string().nullable().optional(),
  cancelledAt: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const ballotListSchema = z.array(ballotSchema)

export const createBallotSchema = z.object({
  proposalId: z.string().optional(),
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().max(4000).optional(),
  state: ballotStateSchema.default('draft'),
  scheduledOpenAt: z.string().optional(),
  scheduledCloseAt: z.string().optional(),
})

export const voteSchema = z.object({
  id: z.string(),
  ballotId: z.string(),
  memberId: z.string(),
  personId: z.string().nullable().optional(),
  choice: voteChoiceSchema,
  castAt: z.string(),
  recordedAt: z.string(),
  createdAt: z.string(),
})

export const voteListSchema = z.array(voteSchema)

export const castVoteSchema = z.object({
  choice: voteChoiceSchema,
})

export const ballotTallySchema = z.object({
  ballotId: z.string(),
  yesCount: z.number().int(),
  noCount: z.number().int(),
  abstainCount: z.number().int(),
  totalCount: z.number().int(),
  quorumMet: z.boolean(),
  thresholdMet: z.boolean(),
  computedAt: z.string(),
})

export type BallotState = z.infer<typeof ballotStateSchema>
export type VoteChoice = z.infer<typeof voteChoiceSchema>

export type BallotDto = z.infer<typeof ballotSchema>
export type CreateBallotInput = z.infer<typeof createBallotSchema>

export type VoteDto = z.infer<typeof voteSchema>
export type CastVoteInput = z.infer<typeof castVoteSchema>

export type BallotTallyDto = z.infer<typeof ballotTallySchema>
```

### 2. `packages/contracts/src/index.ts`

```ts
export * from './agendas'
export * from './amendments'
export * from './auth-context'
export * from './ballots'
export * from './governance-bodies'
export * from './health'
export * from './membership-applications'
export * from './membership-reviews'
export * from './memberships'
export * from './offices'
export * from './proposals'
export * from './sessions'
```

### 3. `apps/gov-api/src/ballots/service.ts`

```ts
import { hasPermission, hasRole, type ActorContext } from '@ardtire/authz'
import type {
  BallotDto,
  BallotState,
  BallotTallyDto,
  CastVoteInput,
  CreateBallotInput,
  VoteChoice,
  VoteDto,
} from '@ardtire/contracts'
import { prisma } from '../lib/prisma'
import { AppServiceError } from '../lib/errors'

const publicVisibleBallotStates: BallotState[] = [
  'open',
  'closed',
  'result_computed',
  'expired',
  'cancelled',
]

const ballotStateToPrisma: Record<BallotState, string> = {
  draft: 'DRAFT',
  scheduled: 'SCHEDULED',
  open: 'OPEN',
  closed: 'CLOSED',
  tallying: 'TALLYING',
  result_computed: 'RESULT_COMPUTED',
  expired: 'EXPIRED',
  cancelled: 'CANCELLED',
}

const ballotStateFromPrisma: Record<string, BallotState> = {
  DRAFT: 'draft',
  SCHEDULED: 'scheduled',
  OPEN: 'open',
  CLOSED: 'closed',
  TALLYING: 'tallying',
  RESULT_COMPUTED: 'result_computed',
  EXPIRED: 'expired',
  CANCELLED: 'cancelled',
}

const voteChoiceToPrisma: Record<VoteChoice, string> = {
  yes: 'YES',
  no: 'NO',
  abstain: 'ABSTAIN',
}

const voteChoiceFromPrisma: Record<string, VoteChoice> = {
  YES: 'yes',
  NO: 'no',
  ABSTAIN: 'abstain',
}

function toIsoString(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null
}

function canManageBallots(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'create_ballot')
  )
}

function canOpenBallots(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'open_ballot')
  )
}

function canCloseBallots(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'close_ballot')
  )
}

function canCancelBallots(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'cancel_ballot')
  )
}

function canReadVotes(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'read_ballot_votes')
  )
}

function toBallotDto(input: {
  id: string
  proposalId: string | null
  title: string
  description: string | null
  state: string
  scheduledOpenAt: Date | null
  openedAt: Date | null
  scheduledCloseAt: Date | null
  closedAt: Date | null
  cancelledAt: Date | null
  createdAt: Date
  updatedAt: Date
}): BallotDto {
  return {
    id: input.id,
    proposalId: input.proposalId,
    title: input.title,
    description: input.description,
    state: ballotStateFromPrisma[input.state] ?? 'draft',
    scheduledOpenAt: toIsoString(input.scheduledOpenAt),
    openedAt: toIsoString(input.openedAt),
    scheduledCloseAt: toIsoString(input.scheduledCloseAt),
    closedAt: toIsoString(input.closedAt),
    cancelledAt: toIsoString(input.cancelledAt),
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function toVoteDto(input: {
  id: string
  ballotId: string
  memberId: string
  personId: string | null
  choice: string
  castAt: Date
  recordedAt: Date
  createdAt: Date
}): VoteDto {
  return {
    id: input.id,
    ballotId: input.ballotId,
    memberId: input.memberId,
    personId: input.personId,
    choice: voteChoiceFromPrisma[input.choice] ?? 'abstain',
    castAt: input.castAt.toISOString(),
    recordedAt: input.recordedAt.toISOString(),
    createdAt: input.createdAt.toISOString(),
  }
}

function toBallotTallyDto(input: {
  ballotId: string
  yesCount: number
  noCount: number
  abstainCount: number
  totalCount: number
  quorumMet: boolean
  thresholdMet: boolean
  computedAt: Date
}): BallotTallyDto {
  return {
    ballotId: input.ballotId,
    yesCount: input.yesCount,
    noCount: input.noCount,
    abstainCount: input.abstainCount,
    totalCount: input.totalCount,
    quorumMet: input.quorumMet,
    thresholdMet: input.thresholdMet,
    computedAt: input.computedAt.toISOString(),
  }
}

export class BallotsService {
  async list(actor: ActorContext): Promise<BallotDto[]> {
    const rows = await prisma.ballot.findMany({
      where: canManageBallots(actor)
        ? undefined
        : {
            state: {
              in: publicVisibleBallotStates.map((state) => ballotStateToPrisma[state]),
            },
          },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return rows.map(toBallotDto)
  }

  async read(actor: ActorContext, ballotId: string): Promise<BallotDto | null> {
    const row = await prisma.ballot.findUnique({
      where: { id: ballotId },
    })

    if (!row) {
      return null
    }

    const mappedState = ballotStateFromPrisma[row.state] ?? 'draft'
    if (!canManageBallots(actor) && !publicVisibleBallotStates.includes(mappedState)) {
      return null
    }

    return toBallotDto(row)
  }

  async create(actor: ActorContext, input: CreateBallotInput): Promise<BallotDto> {
    if (!canManageBallots(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create ballots.',
      })
    }

    const created = await prisma.ballot.create({
      data: {
        proposalId: input.proposalId,
        title: input.title,
        description: input.description,
        state: ballotStateToPrisma[input.state],
        scheduledOpenAt: input.scheduledOpenAt ? new Date(input.scheduledOpenAt) : null,
        scheduledCloseAt: input.scheduledCloseAt ? new Date(input.scheduledCloseAt) : null,
        createdByPersonId: actor.personId,
      },
    })

    return toBallotDto(created)
  }

  async open(actor: ActorContext, ballotId: string): Promise<BallotDto | null> {
    if (!canOpenBallots(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to open ballots.',
      })
    }

    const existing = await prisma.ballot.findUnique({
      where: { id: ballotId },
    })

    if (!existing) {
      return null
    }

    if (!['DRAFT', 'SCHEDULED'].includes(existing.state)) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition ballot from ${ballotStateFromPrisma[existing.state] ?? 'unknown'} to open.`,
      })
    }

    const updated = await prisma.ballot.update({
      where: { id: ballotId },
      data: {
        state: 'OPEN',
        openedAt: new Date(),
      },
    })

    return toBallotDto(updated)
  }

  async close(actor: ActorContext, ballotId: string): Promise<BallotDto | null> {
    if (!canCloseBallots(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to close ballots.',
      })
    }

    const existing = await prisma.ballot.findUnique({
      where: { id: ballotId },
    })

    if (!existing) {
      return null
    }

    if (existing.state !== 'OPEN') {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition ballot from ${ballotStateFromPrisma[existing.state] ?? 'unknown'} to closed.`,
      })
    }

    const votes = await prisma.vote.findMany({
      where: { ballotId },
    })

    const yesCount = votes.filter((vote) => vote.choice === 'YES').length
    const noCount = votes.filter((vote) => vote.choice === 'NO').length
    const abstainCount = votes.filter((vote) => vote.choice === 'ABSTAIN').length
    const totalCount = votes.length

    const updated = await prisma.ballot.update({
      where: { id: ballotId },
      data: {
        state: 'CLOSED',
        closedAt: new Date(),
      },
    })

    await prisma.voteTally.create({
      data: {
        ballotId,
        yesCount,
        noCount,
        abstainCount,
        totalCount,
        quorumMet: totalCount > 0,
        thresholdMet: yesCount > noCount,
        computedAt: new Date(),
      },
    })

    return toBallotDto(updated)
  }

  async cancel(actor: ActorContext, ballotId: string): Promise<BallotDto | null> {
    if (!canCancelBallots(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to cancel ballots.',
      })
    }

    const existing = await prisma.ballot.findUnique({
      where: { id: ballotId },
    })

    if (!existing) {
      return null
    }

    if (['CLOSED', 'RESULT_COMPUTED', 'CANCELLED'].includes(existing.state)) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition ballot from ${ballotStateFromPrisma[existing.state] ?? 'unknown'} to cancelled.`,
      })
    }

    const updated = await prisma.ballot.update({
      where: { id: ballotId },
      data: {
        state: 'CANCELLED',
        cancelledAt: new Date(),
      },
    })

    return toBallotDto(updated)
  }

  async listVotes(actor: ActorContext, ballotId: string): Promise<VoteDto[] | null> {
    if (!canReadVotes(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to read ballot votes.',
      })
    }

    const ballot = await prisma.ballot.findUnique({
      where: { id: ballotId },
    })

    if (!ballot) {
      return null
    }

    const votes = await prisma.vote.findMany({
      where: { ballotId },
      orderBy: {
        castAt: 'asc',
      },
    })

    return votes.map(toVoteDto)
  }

  async castVote(
    actor: ActorContext,
    ballotId: string,
    input: CastVoteInput,
  ): Promise<VoteDto | null> {
    if (!actor.memberId) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Only members may cast votes.',
      })
    }

    const ballot = await prisma.ballot.findUnique({
      where: { id: ballotId },
    })

    if (!ballot) {
      return null
    }

    if (ballot.state !== 'OPEN') {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot cast a vote while ballot is ${ballotStateFromPrisma[ballot.state] ?? 'unknown'}.`,
      })
    }

    const member = await prisma.member.findUnique({
      where: { id: actor.memberId },
    })

    if (!member || member.status !== 'ACTIVE') {
      throw new AppServiceError({
        status: 403,
        code: 'VOTE_NOT_ELIGIBLE',
        message: 'Member is not eligible to vote on this ballot.',
      })
    }

    const snapshot = await prisma.ballotEligibilitySnapshot.findUnique({
      where: {
        ballotId_memberId: {
          ballotId,
          memberId: actor.memberId,
        },
      },
    })

    if (snapshot && snapshot.eligibilityStatus !== 'ELIGIBLE') {
      throw new AppServiceError({
        status: 403,
        code: 'VOTE_NOT_ELIGIBLE',
        message: 'Member is not eligible to vote on this ballot.',
      })
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        ballotId_memberId: {
          ballotId,
          memberId: actor.memberId,
        },
      },
    })

    if (existingVote) {
      throw new AppServiceError({
        status: 409,
        code: 'DUPLICATE_VOTE',
        message: 'Member has already cast a vote on this ballot.',
      })
    }

    const now = new Date()
    const created = await prisma.vote.create({
      data: {
        ballotId,
        memberId: actor.memberId,
        personId: actor.personId,
        choice: voteChoiceToPrisma[input.choice],
        castAt: now,
      },
    })

    return toVoteDto(created)
  }

  async readTally(actor: ActorContext, ballotId: string): Promise<BallotTallyDto | null> {
    const ballot = await this.read(actor, ballotId)

    if (!ballot) {
      return null
    }

    const tally = await prisma.voteTally.findFirst({
      where: { ballotId },
      orderBy: {
        computedAt: 'desc',
      },
    })

    if (!tally) {
      return null
    }

    return toBallotTallyDto(tally)
  }
}

export const ballotsService = new BallotsService()
```

### 4. `apps/gov-api/src/http/routes/ballots.ts`

```ts
import { Hono } from 'hono'
import { castVoteSchema, createBallotSchema } from '@ardtire/contracts'
import { AppServiceError } from '../../lib/errors'
import { ballotsService } from '../../ballots/service'
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

export function createBallotsRoutes() {
  const app = new Hono<AppBindings>()

  app.get('/ballots', async (c) => {
    try {
      const actor = c.get('actor')
      const items = await ballotsService.list(actor)
      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/ballots/:ballotId', async (c) => {
    try {
      const actor = c.get('actor')
      const ballotId = c.req.param('ballotId')
      const item = await ballotsService.read(actor, ballotId)

      if (!item) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Ballot not found.',
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

  app.post('/ballots', async (c) => {
    try {
      const actor = c.get('actor')
      const json = await c.req.json().catch(() => ({}))
      const data = createBallotSchema.parse(json)
      const created = await ballotsService.create(actor, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.post('/ballots/:ballotId/open', async (c) => {
    try {
      const actor = c.get('actor')
      const ballotId = c.req.param('ballotId')
      const updated = await ballotsService.open(actor, ballotId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Ballot not found.',
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

  app.post('/ballots/:ballotId/close', async (c) => {
    try {
      const actor = c.get('actor')
      const ballotId = c.req.param('ballotId')
      const updated = await ballotsService.close(actor, ballotId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Ballot not found.',
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

  app.post('/ballots/:ballotId/cancel', async (c) => {
    try {
      const actor = c.get('actor')
      const ballotId = c.req.param('ballotId')
      const updated = await ballotsService.cancel(actor, ballotId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Ballot not found.',
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

  app.get('/ballots/:ballotId/votes', async (c) => {
    try {
      const actor = c.get('actor')
      const ballotId = c.req.param('ballotId')
      const items = await ballotsService.listVotes(actor, ballotId)

      if (!items) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Ballot not found.',
          },
          404,
        )
      }

      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.post('/ballots/:ballotId/votes', async (c) => {
    try {
      const actor = c.get('actor')
      const ballotId = c.req.param('ballotId')
      const json = await c.req.json().catch(() => ({}))
      const data = castVoteSchema.parse(json)
      const created = await ballotsService.castVote(actor, ballotId, data)

      if (!created) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Ballot not found.',
          },
          404,
        )
      }

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/ballots/:ballotId/tally', async (c) => {
    try {
      const actor = c.get('actor')
      const ballotId = c.req.param('ballotId')
      const tally = await ballotsService.readTally(actor, ballotId)

      if (!tally) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Ballot tally not found.',
          },
          404,
        )
      }

      return c.json(tally)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  return app
}
```

### 5. `apps/gov-api/src/app.ts`

```ts
import { Hono } from 'hono'
import { authContextMiddleware } from './http/middleware/auth-context'
import { devActorProvisioningMiddleware } from './http/middleware/dev-actor-provisioning'
import { requestIdMiddleware } from './http/middleware/request-id'
import { createAgendasRoutes } from './http/routes/agendas'
import { createAmendmentsRoutes } from './http/routes/amendments'
import { createAuthContextRoutes } from './http/routes/auth-context'
import { createBallotsRoutes } from './http/routes/ballots'
import { createGovernanceBodiesRoutes } from './http/routes/governance-bodies'
import { createHealthRoutes } from './http/routes/health'
import { createMembershipApplicationRoutes } from './http/routes/membership-applications'
import { createOfficesRoutes } from './http/routes/offices'
import { createProposalsRoutes } from './http/routes/proposals'
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
  app.route('/', createAmendmentsRoutes())

  return app
}
```

### 6. `packages/gov-client/src/ballots.ts`

```ts
import {
  ballotListSchema,
  ballotSchema,
  ballotTallySchema,
  castVoteSchema,
  createBallotSchema,
  voteListSchema,
  voteSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createBallotsClient(options: GovClientOptions) {
  return {
    list() {
      return requestJson({
        options,
        path: '/ballots',
        schema: ballotListSchema,
      })
    },

    read(ballotId: string) {
      return requestJson({
        options,
        path: `/ballots/${ballotId}`,
        schema: ballotSchema,
      })
    },

    create(input: unknown) {
      const body = createBallotSchema.parse(input)

      return requestJson({
        options,
        path: '/ballots',
        method: 'POST',
        body,
        schema: ballotSchema,
      })
    },

    open(ballotId: string) {
      return requestJson({
        options,
        path: `/ballots/${ballotId}/open`,
        method: 'POST',
        schema: ballotSchema,
      })
    },

    close(ballotId: string) {
      return requestJson({
        options,
        path: `/ballots/${ballotId}/close`,
        method: 'POST',
        schema: ballotSchema,
      })
    },

    cancel(ballotId: string) {
      return requestJson({
        options,
        path: `/ballots/${ballotId}/cancel`,
        method: 'POST',
        schema: ballotSchema,
      })
    },

    listVotes(ballotId: string) {
      return requestJson({
        options,
        path: `/ballots/${ballotId}/votes`,
        schema: voteListSchema,
      })
    },

    castVote(ballotId: string, input: unknown) {
      const body = castVoteSchema.parse(input)

      return requestJson({
        options,
        path: `/ballots/${ballotId}/votes`,
        method: 'POST',
        body,
        schema: voteSchema,
      })
    },

    readTally(ballotId: string) {
      return requestJson({
        options,
        path: `/ballots/${ballotId}/tally`,
        schema: ballotTallySchema,
      })
    },
  }
}
```

### 7. `packages/gov-client/src/index.ts`

```ts
import type { GovClientOptions } from './http'
import { createAgendasClient } from './agendas'
import { createAmendmentsClient } from './amendments'
import { createBallotsClient } from './ballots'
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
export * from './governance-bodies'
export * from './http'
export * from './membership-applications'
export * from './offices'
export * from './proposals'
export * from './sessions'
```

### 8. `apps/gov-api/src/http/routes/ballots.test.ts`

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hono } from 'hono'
import { AppServiceError } from '../../lib/errors'

const ballotsServiceMock = {
  list: vi.fn(),
  read: vi.fn(),
  create: vi.fn(),
  open: vi.fn(),
  close: vi.fn(),
  cancel: vi.fn(),
  listVotes: vi.fn(),
  castVote: vi.fn(),
  readTally: vi.fn(),
}

const createBallotParse = vi.fn((input) => input)
const castVoteParse = vi.fn((input) => input)

vi.mock('../../ballots/service', () => {
  return {
    ballotsService: ballotsServiceMock,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    createBallotSchema: {
      parse: createBallotParse,
    },
    castVoteSchema: {
      parse: castVoteParse,
    },
  }
})

import { createBallotsRoutes } from './ballots'

function createActor() {
  return {
    principalId: 'user-1',
    personId: 'person-1',
    memberId: 'member-1',
    roles: ['member'],
    permissions: [],
  }
}

function createTestApp() {
  const app = new Hono()

  app.use('*', async (c, next) => {
    c.set('actor', createActor() as never)
    await next()
  })

  app.route('/', createBallotsRoutes())

  return app
}

describe('createBallotsRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists ballots', async () => {
    ballotsServiceMock.list.mockResolvedValue([
      {
        id: 'ballot-1',
        proposalId: 'proposal-1',
        title: 'Ratification Ballot',
        description: 'Final vote',
        state: 'open',
        scheduledOpenAt: null,
        openedAt: '2026-03-21T00:00:00.000Z',
        scheduledCloseAt: null,
        closedAt: null,
        cancelledAt: null,
        createdAt: '2026-03-21T00:00:00.000Z',
        updatedAt: '2026-03-21T00:00:00.000Z',
      },
    ])

    const app = createTestApp()
    const response = await app.request('http://localhost/ballots')

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body[0].id).toBe('ballot-1')
    expect(body[0].state).toBe('open')
  })

  it('reads a ballot by id', async () => {
    ballotsServiceMock.read.mockResolvedValue({
      id: 'ballot-1',
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'open',
      scheduledOpenAt: null,
      openedAt: '2026-03-21T00:00:00.000Z',
      scheduledCloseAt: null,
      closedAt: null,
      cancelledAt: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/ballots/ballot-1')

    expect(response.status).toBe(200)
    expect(ballotsServiceMock.read).toHaveBeenCalledWith(
      expect.objectContaining({
        personId: 'person-1',
      }),
      'ballot-1',
    )
  })

  it('creates a ballot', async () => {
    ballotsServiceMock.create.mockResolvedValue({
      id: 'ballot-1',
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'draft',
      scheduledOpenAt: null,
      openedAt: null,
      scheduledCloseAt: null,
      closedAt: null,
      cancelledAt: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/ballots', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        proposalId: 'proposal-1',
        title: 'Ratification Ballot',
        description: 'Final vote',
        state: 'draft',
      }),
    })

    expect(response.status).toBe(201)
    expect(createBallotParse).toHaveBeenCalled()
    expect(ballotsServiceMock.create).toHaveBeenCalled()
  })

  it('opens a ballot', async () => {
    ballotsServiceMock.open.mockResolvedValue({
      id: 'ballot-1',
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'open',
      scheduledOpenAt: null,
      openedAt: '2026-03-21T00:00:00.000Z',
      scheduledCloseAt: null,
      closedAt: null,
      cancelledAt: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/ballots/ballot-1/open', {
      method: 'POST',
    })

    expect(response.status).toBe(200)
    const body = await response.json()
    expect(body.state).toBe('open')
  })

  it('casts a vote', async () => {
    ballotsServiceMock.castVote.mockResolvedValue({
      id: 'vote-1',
      ballotId: 'ballot-1',
      memberId: 'member-1',
      personId: 'person-1',
      choice: 'yes',
      castAt: '2026-03-21T00:10:00.000Z',
      recordedAt: '2026-03-21T00:10:00.000Z',
      createdAt: '2026-03-21T00:10:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/ballots/ballot-1/votes', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        choice: 'yes',
      }),
    })

    expect(response.status).toBe(201)
    expect(castVoteParse).toHaveBeenCalledWith({
      choice: 'yes',
    })
    const body = await response.json()
    expect(body.choice).toBe('yes')
  })

  it('maps service errors to structured responses', async () => {
    ballotsServiceMock.close.mockRejectedValue(
      new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: 'Cannot transition ballot from closed to closed.',
      }),
    )

    const app = createTestApp()
    const response = await app.request('http://localhost/ballots/ballot-1/close', {
      method: 'POST',
    })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      code: 'STATE_TRANSITION_DENIED',
      message: 'Cannot transition ballot from closed to closed.',
    })
  })
})
```

### 9. `apps/gov-api/src/ballots/service.test.ts`

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppServiceError } from '../lib/errors'

const hasRoleMock = vi.fn()
const hasPermissionMock = vi.fn()

const prismaMock = {
  ballot: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  vote: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
  },
  voteTally: {
    create: vi.fn(),
    findFirst: vi.fn(),
  },
  member: {
    findUnique: vi.fn(),
  },
  ballotEligibilitySnapshot: {
    findUnique: vi.fn(),
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

import { BallotsService } from './service'

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

describe('BallotsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasRoleMock.mockReturnValue(false)
    hasPermissionMock.mockReturnValue(false)
  })

  it('lists only public-visible ballots for non-managers', async () => {
    prismaMock.ballot.findMany.mockResolvedValue([
      {
        id: 'ballot-1',
        proposalId: 'proposal-1',
        title: 'Ratification Ballot',
        description: 'Final vote',
        state: 'OPEN',
        scheduledOpenAt: null,
        openedAt: new Date('2026-03-21T00:00:00.000Z'),
        scheduledCloseAt: null,
        closedAt: null,
        cancelledAt: null,
        createdAt: new Date('2026-03-21T00:00:00.000Z'),
        updatedAt: new Date('2026-03-21T00:00:00.000Z'),
      },
    ])

    const service = new BallotsService()
    const result = await service.list(createActor())

    expect(prismaMock.ballot.findMany).toHaveBeenCalledWith({
      where: {
        state: {
          in: ['OPEN', 'CLOSED', 'RESULT_COMPUTED', 'EXPIRED', 'CANCELLED'],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    expect(result[0].state).toBe('open')
  })

  it('rejects create when actor lacks authority', async () => {
    const service = new BallotsService()

    await expect(
      service.create(createActor(), {
        proposalId: 'proposal-1',
        title: 'Ratification Ballot',
        description: 'Final vote',
        state: 'draft',
      }),
    ).rejects.toMatchObject<AppServiceError>({
      status: 403,
      code: 'FORBIDDEN',
      message: 'Not authorized to create ballots.',
    })

    expect(prismaMock.ballot.create).not.toHaveBeenCalled()
  })

  it('rejects invalid open transitions', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => permission === 'open_ballot')

    prismaMock.ballot.findUnique.mockResolvedValue({
      id: 'ballot-1',
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'CLOSED',
      scheduledOpenAt: null,
      openedAt: new Date('2026-03-21T00:00:00.000Z'),
      scheduledCloseAt: null,
      closedAt: new Date('2026-03-21T01:00:00.000Z'),
      cancelledAt: null,
      createdByPersonId: 'person-1',
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T01:00:00.000Z'),
    })

    const service = new BallotsService()

    await expect(service.open(createActor(), 'ballot-1')).rejects.toMatchObject<AppServiceError>({
      status: 400,
      code: 'STATE_TRANSITION_DENIED',
    })
  })

  it('rejects duplicate votes', async () => {
    prismaMock.ballot.findUnique.mockResolvedValue({
      id: 'ballot-1',
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'OPEN',
      scheduledOpenAt: null,
      openedAt: new Date('2026-03-21T00:00:00.000Z'),
      scheduledCloseAt: null,
      closedAt: null,
      cancelledAt: null,
      createdByPersonId: 'person-1',
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
    })

    prismaMock.member.findUnique.mockResolvedValue({
      id: 'member-1',
      status: 'ACTIVE',
    })

    prismaMock.ballotEligibilitySnapshot.findUnique.mockResolvedValue(null)

    prismaMock.vote.findUnique.mockResolvedValue({
      id: 'vote-1',
      ballotId: 'ballot-1',
      memberId: 'member-1',
      personId: 'person-1',
      choice: 'YES',
      castAt: new Date('2026-03-21T00:05:00.000Z'),
      recordedAt: new Date('2026-03-21T00:05:00.000Z'),
      createdAt: new Date('2026-03-21T00:05:00.000Z'),
    })

    const service = new BallotsService()

    await expect(
      service.castVote(createActor(), 'ballot-1', {
        choice: 'yes',
      }),
    ).rejects.toMatchObject<AppServiceError>({
      status: 409,
      code: 'DUPLICATE_VOTE',
      message: 'Member has already cast a vote on this ballot.',
    })
  })

  it('closes a ballot and computes a tally', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => permission === 'close_ballot')

    prismaMock.ballot.findUnique.mockResolvedValue({
      id: 'ballot-1',
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'OPEN',
      scheduledOpenAt: null,
      openedAt: new Date('2026-03-21T00:00:00.000Z'),
      scheduledCloseAt: null,
      closedAt: null,
      cancelledAt: null,
      createdByPersonId: 'person-1',
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
    })

    prismaMock.vote.findMany.mockResolvedValue([
      {
        choice: 'YES',
      },
      {
        choice: 'NO',
      },
      {
        choice: 'YES',
      },
    ])

    prismaMock.ballot.update.mockResolvedValue({
      id: 'ballot-1',
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'CLOSED',
      scheduledOpenAt: null,
      openedAt: new Date('2026-03-21T00:00:00.000Z'),
      scheduledCloseAt: null,
      closedAt: new Date('2026-03-21T01:00:00.000Z'),
      cancelledAt: null,
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T01:00:00.000Z'),
    })

    const service = new BallotsService()
    const result = await service.close(createActor(), 'ballot-1')

    expect(prismaMock.voteTally.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        ballotId: 'ballot-1',
        yesCount: 2,
        noCount: 1,
        abstainCount: 0,
        totalCount: 3,
        quorumMet: true,
        thresholdMet: true,
      }),
    })

    expect(result?.state).toBe('closed')
  })
})
```

### 10. `packages/gov-client/src/ballots.test.ts`

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestJson = vi.fn()

const createBallotParse = vi.fn((input) => input)
const castVoteParse = vi.fn((input) => input)

const ballotSchema = { name: 'ballotSchema' }
const ballotListSchema = { name: 'ballotListSchema' }
const voteSchema = { name: 'voteSchema' }
const voteListSchema = { name: 'voteListSchema' }
const ballotTallySchema = { name: 'ballotTallySchema' }

vi.mock('./http', () => {
  return {
    requestJson,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    ballotSchema,
    ballotListSchema,
    voteSchema,
    voteListSchema,
    ballotTallySchema,
    createBallotSchema: {
      parse: createBallotParse,
    },
    castVoteSchema: {
      parse: castVoteParse,
    },
  }
})

import { createBallotsClient } from './ballots'

describe('createBallotsClient', () => {
  const options = {
    baseUrl: 'http://localhost:3002',
    getToken: async () => 'token-1',
  } as never

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists ballots', async () => {
    requestJson.mockResolvedValueOnce([
      {
        id: 'ballot-1',
        title: 'Ratification Ballot',
        state: 'open',
      },
    ])

    const client = createBallotsClient(options)
    const result = await client.list()

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/ballots',
      schema: ballotListSchema,
    })
    expect(result[0].id).toBe('ballot-1')
  })

  it('reads a ballot', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'ballot-1',
      title: 'Ratification Ballot',
      state: 'open',
    })

    const client = createBallotsClient(options)
    const result = await client.read('ballot-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/ballots/ballot-1',
      schema: ballotSchema,
    })
    expect(result.state).toBe('open')
  })

  it('creates a ballot after schema validation', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'ballot-1',
      title: 'Ratification Ballot',
      state: 'draft',
    })

    const client = createBallotsClient(options)
    const input = {
      proposalId: 'proposal-1',
      title: 'Ratification Ballot',
      description: 'Final vote',
      state: 'draft',
    }

    const result = await client.create(input)

    expect(createBallotParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/ballots',
      method: 'POST',
      body: input,
      schema: ballotSchema,
    })
    expect(result.state).toBe('draft')
  })

  it('opens, closes, and cancels ballots', async () => {
    const client = createBallotsClient(options)

    requestJson.mockResolvedValueOnce({
      id: 'ballot-1',
      state: 'open',
    })
    await client.open('ballot-1')
    expect(requestJson).toHaveBeenNthCalledWith(1, {
      options,
      path: '/ballots/ballot-1/open',
      method: 'POST',
      schema: ballotSchema,
    })

    requestJson.mockResolvedValueOnce({
      id: 'ballot-1',
      state: 'closed',
    })
    await client.close('ballot-1')
    expect(requestJson).toHaveBeenNthCalledWith(2, {
      options,
      path: '/ballots/ballot-1/close',
      method: 'POST',
      schema: ballotSchema,
    })

    requestJson.mockResolvedValueOnce({
      id: 'ballot-1',
      state: 'cancelled',
    })
    await client.cancel('ballot-1')
    expect(requestJson).toHaveBeenNthCalledWith(3, {
      options,
      path: '/ballots/ballot-1/cancel',
      method: 'POST',
      schema: ballotSchema,
    })
  })

  it('lists votes and casts a vote', async () => {
    const client = createBallotsClient(options)

    requestJson.mockResolvedValueOnce([
      {
        id: 'vote-1',
        ballotId: 'ballot-1',
        memberId: 'member-1',
        choice: 'yes',
      },
    ])

    const votes = await client.listVotes('ballot-1')
    expect(requestJson).toHaveBeenNthCalledWith(1, {
      options,
      path: '/ballots/ballot-1/votes',
      schema: voteListSchema,
    })
    expect(votes[0].choice).toBe('yes')

    requestJson.mockResolvedValueOnce({
      id: 'vote-2',
      ballotId: 'ballot-1',
      memberId: 'member-1',
      choice: 'no',
    })

    const created = await client.castVote('ballot-1', {
      choice: 'no',
    })

    expect(castVoteParse).toHaveBeenCalledWith({
      choice: 'no',
    })
    expect(requestJson).toHaveBeenNthCalledWith(2, {
      options,
      path: '/ballots/ballot-1/votes',
      method: 'POST',
      body: {
        choice: 'no',
      },
      schema: voteSchema,
    })
    expect(created.choice).toBe('no')
  })

  it('reads a tally', async () => {
    requestJson.mockResolvedValueOnce({
      ballotId: 'ballot-1',
      yesCount: 7,
      noCount: 2,
      abstainCount: 1,
      totalCount: 10,
      quorumMet: true,
      thresholdMet: true,
      computedAt: '2026-03-21T01:00:00.000Z',
    })

    const client = createBallotsClient(options)
    const tally = await client.readTally('ballot-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/ballots/ballot-1/tally',
      schema: ballotTallySchema,
    })
    expect(tally.totalCount).toBe(10)
  })
})
```

## What this batch gives you

It adds the ballot vertical in the **actual committed repo style**:

* contracts-first DTOs and schemas
* route-local request validation and error mapping
* service-layer authorization and lifecycle checks
* Prisma-backed ballot creation, opening, closing, cancellation, voting, and tally reading
* thin `gov-client` wrapper
* route, service, and client tests

## Strongest next step

The next batch should be the matching **certifications + ratifications vertical** in this same layout:

* `packages/contracts/src/certifications.ts`
* `apps/gov-api/src/certifications/service.ts`
* `apps/gov-api/src/http/routes/certifications.ts`
* `apps/gov-api/src/http/routes/ratifications.ts`
* `packages/gov-client/src/certifications.ts`
* matching tests
