import { hasRole, type ActorContext } from '@ardtire/authz'
import type {
  CreateOfficeInput,
  OfficeDto,
  UpdateOfficeInput,
} from '@ardtire/contracts'
import { prisma } from '../lib/prisma'
import { AppServiceError } from '../lib/errors'

function toOfficeDto(input: {
  id: string
  bodyId: string | null
  slug: string
  name: string
  description: string | null
  status: 'draft' | 'active' | 'inactive' | 'archived'
  createdAt: Date
  updatedAt: Date
}): OfficeDto {
  return {
    id: input.id,
    bodyId: input.bodyId,
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

export class OfficesService {
  async list(actor: ActorContext): Promise<OfficeDto[]> {
    const rows = await prisma.office.findMany({
      where: canManageGovernanceStructure(actor)
        ? undefined
        : {
            status: 'active',
          },
      orderBy: {
        name: 'asc',
      },
    })

    return rows.map(toOfficeDto)
  }

  async read(actor: ActorContext, officeId: string): Promise<OfficeDto | null> {
    const row = await prisma.office.findUnique({
      where: { id: officeId },
    })

    if (!row) {
      return null
    }

    if (!canManageGovernanceStructure(actor) && row.status !== 'active') {
      return null
    }

    return toOfficeDto(row)
  }

  async create(actor: ActorContext, input: CreateOfficeInput): Promise<OfficeDto> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create offices.',
      })
    }

    const created = await prisma.office.create({
      data: {
        bodyId: input.bodyId,
        slug: input.slug,
        name: input.name,
        description: input.description,
        status: input.status,
      },
    })

    return toOfficeDto(created)
  }

  async update(
    actor: ActorContext,
    officeId: string,
    input: UpdateOfficeInput,
  ): Promise<OfficeDto | null> {
    if (!canManageGovernanceStructure(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to update offices.',
      })
    }

    const existing = await prisma.office.findUnique({
      where: { id: officeId },
    })

    if (!existing) {
      return null
    }

    const updated = await prisma.office.update({
      where: { id: officeId },
      data: {
        bodyId: input.bodyId,
        slug: input.slug,
        name: input.name,
        description: input.description,
        status: input.status,
      },
    })

    return toOfficeDto(updated)
  }
}

export const officesService = new OfficesService()