import { hasRole, type ActorContext } from '@ardtire/authz'
import type {
  CreateGovernanceSessionInput,
  GovernanceSessionDto,
  UpdateGovernanceSessionInput,
} from '@ardtire/contracts'
import { prisma } from '../lib/prisma'
import { AppServiceError } from '../lib/errors'

function toGovernanceSessionDto(input: {
  id: string
  bodyId: string | null
  title: string
  description: string | null
  scheduledStartAt: Date | null
  scheduledEndAt: Date | null
  state: 'draft' | 'scheduled' | 'in_session' | 'concluded' | 'archived'
  createdAt: Date
  updatedAt: Date
}): GovernanceSessionDto {
  return {
    id: input.id,
    bodyId: input.bodyId,
    title: input.title,
    description: input.description,
    scheduledStartAt: input.scheduledStartAt?.toISOString() ?? null,
    scheduledEndAt: input.scheduledEndAt?.toISOString() ?? null,
    state: input.state,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function canManageGovernanceStructure(actor: ActorContext): boolean {
  return hasRole(actor, 'admin') || hasRole(actor, 'founder')
}

export class SessionsService {
  async list(actor: ActorContext): Promise<GovernanceSessionDto[]> {
    const rows = await prisma.governanceSession.findMany({
      where: canManageGovernanceStructure(actor)
        ? undefined
        : {
            state: {
              in: ['scheduled', 'in_session', 'concluded'],
            },
          },
      orderBy: [
        {
          scheduledStartAt: 'asc',
        },
        {
          title: 'asc',
        },
      ],
    })

    return rows.map(toGovernanceSessionDto)
  }

  async read(actor: ActorContext, sessionId: string): Promise<GovernanceSessionDto | null> {
    const row = await prisma.governanceSession.findUnique({
      where: { id: sessionId },
    })

    if (!row) {
      return null
    }

    if (
      !canManageGovernanceStructure(actor) &&
      !['scheduled', 'in_session', 'concluded'].includes(row.state)
    ) {
      return null
    }

    return toGovernanceSessionDto(row)
  }

  async create(
    actor: ActorContext,
    input: CreateGovernanceSessionInput,
  ): Promise<GovernanceSessionDto> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create sessions.',
      })
    }

    const created = await prisma.governanceSession.create({
      data: {
        bodyId: input.bodyId,
        title: input.title,
        description: input.description,
        scheduledStartAt: input.scheduledStartAt
          ? new Date(input.scheduledStartAt)
          : undefined,
        scheduledEndAt: input.scheduledEndAt
          ? new Date(input.scheduledEndAt)
          : undefined,
        state: input.state,
      },
    })

    return toGovernanceSessionDto(created)
  }

  async update(
    actor: ActorContext,
    sessionId: string,
    input: UpdateGovernanceSessionInput,
  ): Promise<GovernanceSessionDto | null> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to update sessions.',
      })
    }

    const existing = await prisma.governanceSession.findUnique({
      where: { id: sessionId },
    })

    if (!existing) {
      return null
    }

    const updated = await prisma.governanceSession.update({
      where: { id: sessionId },
      data: {
        bodyId: input.bodyId,
        title: input.title,
        description: input.description,
        scheduledStartAt:
          input.scheduledStartAt === undefined
            ? undefined
            : input.scheduledStartAt === null
              ? null
              : new Date(input.scheduledStartAt),
        scheduledEndAt:
          input.scheduledEndAt === undefined
            ? undefined
            : input.scheduledEndAt === null
              ? null
              : new Date(input.scheduledEndAt),
        state: input.state,
      },
    })

    return toGovernanceSessionDto(updated)
  }
}

export const sessionsService = new SessionsService()