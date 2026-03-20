import { hasRole, type ActorContext } from '@ardtire/authz'
import type {
  CreateGovernanceBodyInput,
  GovernanceBodyDto,
  UpdateGovernanceBodyInput,
} from '@ardtire/contracts'
import { prisma } from '../lib/prisma'
import { AppServiceError } from '../lib/errors'

function toGovernanceBodyDto(input: {
  id: string
  slug: string
  name: string
  description: string | null
  status: 'draft' | 'active' | 'inactive' | 'archived'
  createdAt: Date
  updatedAt: Date
}): GovernanceBodyDto {
  return {
    id: input.id,
    slug: input.slug,
    name: input.name,
    description: input.description,
    status: input.status,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function canManageGovernanceStructure(actor: ActorContext): boolean {
  return hasRole(actor, 'admin') || hasRole(actor, 'founder')
}

export class GovernanceBodiesService {
  async list(actor: ActorContext): Promise<GovernanceBodyDto[]> {
    const rows = await prisma.governanceBody.findMany({
      where: canManageGovernanceStructure(actor)
        ? undefined
        : {
            status: 'active',
          },
      orderBy: {
        name: 'asc',
      },
    })

    return rows.map(toGovernanceBodyDto)
  }

  async read(actor: ActorContext, bodyId: string): Promise<GovernanceBodyDto | null> {
    const row = await prisma.governanceBody.findUnique({
      where: { id: bodyId },
    })

    if (!row) {
      return null
    }

    if (!canManageGovernanceStructure(actor) && row.status !== 'active') {
      return null
    }

    return toGovernanceBodyDto(row)
  }

  async create(actor: ActorContext, input: CreateGovernanceBodyInput): Promise<GovernanceBodyDto> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create governance bodies.',
      })
    }

    const created = await prisma.governanceBody.create({
      data: {
        slug: input.slug,
        name: input.name,
        description: input.description,
        status: input.status,
      },
    })

    return toGovernanceBodyDto(created)
  }

  async update(
    actor: ActorContext,
    bodyId: string,
    input: UpdateGovernanceBodyInput,
  ): Promise<GovernanceBodyDto | null> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to update governance bodies.',
      })
    }

    const existing = await prisma.governanceBody.findUnique({
      where: { id: bodyId },
    })

    if (!existing) {
      return null
    }

    const updated = await prisma.governanceBody.update({
      where: { id: bodyId },
      data: {
        slug: input.slug,
        name: input.name,
        description: input.description,
        status: input.status,
      },
    })

    return toGovernanceBodyDto(updated)
  }
}

export const governanceBodiesService = new GovernanceBodiesService()