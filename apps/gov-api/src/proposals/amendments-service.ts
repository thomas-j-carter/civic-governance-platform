import { hasRole, type ActorContext } from '@ardtire/authz'
import type {
  AmendmentDto,
  CreateAmendmentInput,
  UpdateAmendmentInput,
} from '@ardtire/contracts'
import { canTransitionAmendment } from '@ardtire/workflows'
import { AppServiceError } from '../lib/errors'
import { prisma } from '../lib/prisma'

const publicVisibleAmendmentStates: AmendmentDto['state'][] = ['accepted', 'incorporated']
const authenticatedVisibleAmendmentStates: AmendmentDto['state'][] = [
  'submitted',
  'under_review',
  'accepted',
  'incorporated',
]

function toAmendmentDto(input: {
  id: string
  proposalId: string
  title: string
  summary: string | null
  state: AmendmentDto['state']
  createdAt: Date
  updatedAt: Date
}): AmendmentDto {
  return {
    id: input.id,
    proposalId: input.proposalId,
    title: input.title,
    summary: input.summary,
    state: input.state,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function canManageAmendments(actor: ActorContext): boolean {
  return hasRole(actor, 'admin') || hasRole(actor, 'founder') || hasRole(actor, 'officer')
}

function visibleStatesForActor(actor: ActorContext): AmendmentDto['state'][] {
  if (canManageAmendments(actor)) {
    return ['draft', 'submitted', 'under_review', 'accepted', 'rejected', 'incorporated', 'withdrawn', 'archived']
  }

  if (actor.isAuthenticated) {
    return authenticatedVisibleAmendmentStates
  }

  return publicVisibleAmendmentStates
}

export class AmendmentsService {
  async listForProposal(actor: ActorContext, proposalId: string): Promise<AmendmentDto[]> {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { id: true },
    })

    if (!proposal) {
      throw new AppServiceError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Proposal not found.',
      })
    }

    const rows = await prisma.amendment.findMany({
      where: {
        proposalId,
        state: {
          in: visibleStatesForActor(actor),
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    return rows.map(toAmendmentDto)
  }

  async read(actor: ActorContext, amendmentId: string): Promise<AmendmentDto | null> {
    const row = await prisma.amendment.findUnique({
      where: { id: amendmentId },
    })

    if (!row) {
      return null
    }

    if (!visibleStatesForActor(actor).includes(row.state)) {
      return null
    }

    return toAmendmentDto(row)
  }

  async createForProposal(
    actor: ActorContext,
    proposalId: string,
    input: CreateAmendmentInput,
  ): Promise<AmendmentDto> {
    if (!canManageAmendments(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create amendments.',
      })
    }

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { id: true },
    })

    if (!proposal) {
      throw new AppServiceError({
        status: 404,
        code: 'NOT_FOUND',
        message: 'Proposal not found.',
      })
    }

    const created = await prisma.amendment.create({
      data: {
        proposalId,
        title: input.title,
        summary: input.summary,
        state: input.state,
      },
    })

    return toAmendmentDto(created)
  }

  async update(
    actor: ActorContext,
    amendmentId: string,
    input: UpdateAmendmentInput,
  ): Promise<AmendmentDto | null> {
    if (!canManageAmendments(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to update amendments.',
      })
    }

    const existing = await prisma.amendment.findUnique({
      where: { id: amendmentId },
    })

    if (!existing) {
      return null
    }

    const updated = await prisma.amendment.update({
      where: { id: amendmentId },
      data: {
        title: input.title,
        summary: input.summary,
        state: input.state,
      },
    })

    return toAmendmentDto(updated)
  }

  async submit(actor: ActorContext, amendmentId: string): Promise<AmendmentDto | null> {
    if (!canManageAmendments(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to submit amendments.',
      })
    }

    const existing = await prisma.amendment.findUnique({
      where: { id: amendmentId },
    })

    if (!existing) {
      return null
    }

    if (!canTransitionAmendment(existing.state, 'submitted')) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition amendment from ${existing.state} to submitted.`,
      })
    }

    const updated = await prisma.amendment.update({
      where: { id: amendmentId },
      data: {
        state: 'submitted',
      },
    })

    return toAmendmentDto(updated)
  }

  async withdraw(actor: ActorContext, amendmentId: string): Promise<AmendmentDto | null> {
    if (!canManageAmendments(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to withdraw amendments.',
      })
    }

    const existing = await prisma.amendment.findUnique({
      where: { id: amendmentId },
    })

    if (!existing) {
      return null
    }

    if (!canTransitionAmendment(existing.state, 'withdrawn')) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition amendment from ${existing.state} to withdrawn.`,
      })
    }

    const updated = await prisma.amendment.update({
      where: { id: amendmentId },
      data: {
        state: 'withdrawn',
      },
    })

    return toAmendmentDto(updated)
  }
}

export const amendmentsService = new AmendmentsService()