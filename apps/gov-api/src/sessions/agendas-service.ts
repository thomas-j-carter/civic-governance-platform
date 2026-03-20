import { hasRole, type ActorContext } from '@ardtire/authz'
import type {
  AgendaItemDto,
  CreateAgendaItemInput,
  UpdateAgendaItemInput,
} from '@ardtire/contracts'
import { prisma } from '../lib/prisma'
import { AppServiceError } from '../lib/errors'

function toAgendaItemDto(input: {
  id: string
  sessionId: string
  proposalId: string | null
  title: string
  description: string | null
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}): AgendaItemDto {
  return {
    id: input.id,
    sessionId: input.sessionId,
    proposalId: input.proposalId,
    title: input.title,
    description: input.description,
    sortOrder: input.sortOrder,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function canManageGovernanceStructure(actor: ActorContext): boolean {
  return hasRole(actor, 'admin') || hasRole(actor, 'founder')
}

export class AgendasService {
  async listForSession(actor: ActorContext, sessionId: string): Promise<AgendaItemDto[]> {
    const session = await prisma.governanceSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      throw new AppServiceError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Governance session not found.',
      })
    }

    if (
      !canManageGovernanceStructure(actor) &&
      !['scheduled', 'in_session', 'concluded'].includes(session.state)
    ) {
      throw new AppServiceError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Governance session not found.',
      })
    }

    const rows = await prisma.agendaItem.findMany({
      where: {
        sessionId,
      },
      orderBy: [
        {
          sortOrder: 'asc',
        },
        {
          createdAt: 'asc',
        },
      ],
    })

    return rows.map(toAgendaItemDto)
  }

  async createForSession(
    actor: ActorContext,
    sessionId: string,
    input: CreateAgendaItemInput,
  ): Promise<AgendaItemDto> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create agenda items.',
      })
    }

    const session = await prisma.governanceSession.findUnique({
      where: { id: sessionId },
    })

    if (!session) {
      throw new AppServiceError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Governance session not found.',
      })
    }

    const created = await prisma.agendaItem.create({
      data: {
        sessionId,
        proposalId: input.proposalId,
        title: input.title,
        description: input.description,
        sortOrder: input.sortOrder,
      },
    })

    return toAgendaItemDto(created)
  }

  async update(
    actor: ActorContext,
    agendaItemId: string,
    input: UpdateAgendaItemInput,
  ): Promise<AgendaItemDto | null> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to update agenda items.',
      })
    }

    const existing = await prisma.agendaItem.findUnique({
      where: { id: agendaItemId },
    })

    if (!existing) {
      return null
    }

    const updated = await prisma.agendaItem.update({
      where: { id: agendaItemId },
      data: {
        proposalId: input.proposalId,
        title: input.title,
        description: input.description,
        sortOrder: input.sortOrder,
      },
    })

    return toAgendaItemDto(updated)
  }
}

export const agendasService = new AgendasService()