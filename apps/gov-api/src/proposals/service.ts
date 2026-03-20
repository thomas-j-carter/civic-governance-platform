import { hasPermission, hasRole, type ActorContext } from '@ardtire/authz'
import type {
  CreateProposalInput,
  ProposalDto,
  UpdateProposalInput,
} from '@ardtire/contracts'
import { canTransitionProposal } from '@ardtire/workflows'
import { AppServiceError } from '../lib/errors'
import { prisma } from '../lib/prisma'

const publicVisibleProposalStates: ProposalDto['state'][] = [
  'admitted',
  'amendment_window',
  'scheduled',
  'voting_open',
  'voting_closed',
  'certified',
  'ratified',
  'failed',
  'published',
  'archived',
]

function toProposalDto(input: {
  id: string
  title: string
  summary: string | null
  state: ProposalDto['state']
  bodyId: string | null
  sessionId: string | null
  ruleVersionId: string | null
  createdAt: Date
  updatedAt: Date
}): ProposalDto {
  return {
    id: input.id,
    title: input.title,
    summary: input.summary,
    state: input.state,
    bodyId: input.bodyId,
    sessionId: input.sessionId,
    ruleVersionId: input.ruleVersionId,
    createdAt: input.createdAt.toISOString(),
    updatedAt: input.updatedAt.toISOString(),
  }
}

function canManageProposals(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'create_proposal_draft')
  )
}

function canSubmitProposals(actor: ActorContext): boolean {
  return (
    hasRole(actor, 'admin') ||
    hasRole(actor, 'founder') ||
    hasRole(actor, 'officer') ||
    hasPermission(actor, 'submit_proposal')
  )
}

export class ProposalsService {
  async list(actor: ActorContext): Promise<ProposalDto[]> {
    const rows = await prisma.proposal.findMany({
      where: canManageProposals(actor)
        ? undefined
        : {
            state: {
              in: publicVisibleProposalStates,
            },
          },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return rows.map(toProposalDto)
  }

  async read(actor: ActorContext, proposalId: string): Promise<ProposalDto | null> {
    const row = await prisma.proposal.findUnique({
      where: { id: proposalId },
    })

    if (!row) {
      return null
    }

    if (!canManageProposals(actor) && !publicVisibleProposalStates.includes(row.state)) {
      return null
    }

    return toProposalDto(row)
  }

  async create(actor: ActorContext, input: CreateProposalInput): Promise<ProposalDto> {
    if (!canManageProposals(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create proposals.',
      })
    }

    const created = await prisma.proposal.create({
      data: {
        title: input.title,
        summary: input.summary,
        state: input.state,
        bodyId: input.bodyId,
        sessionId: input.sessionId,
        ruleVersionId: input.ruleVersionId,
      },
    })

    return toProposalDto(created)
  }

  async update(
    actor: ActorContext,
    proposalId: string,
    input: UpdateProposalInput,
  ): Promise<ProposalDto | null> {
    if (!canManageProposals(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to update proposals.',
      })
    }

    const existing = await prisma.proposal.findUnique({
      where: { id: proposalId },
    })

    if (!existing) {
      return null
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        title: input.title,
        summary: input.summary,
        state: input.state,
        bodyId: input.bodyId,
        sessionId: input.sessionId,
        ruleVersionId: input.ruleVersionId,
      },
    })

    return toProposalDto(updated)
  }

  async submit(actor: ActorContext, proposalId: string): Promise<ProposalDto | null> {
    if (!canSubmitProposals(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to submit proposals.',
      })
    }

    const existing = await prisma.proposal.findUnique({
      where: { id: proposalId },
    })

    if (!existing) {
      return null
    }

    if (!canTransitionProposal(existing.state, 'submitted')) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition proposal from ${existing.state} to submitted.`,
      })
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        state: 'submitted',
      },
    })

    return toProposalDto(updated)
  }

  async withdraw(actor: ActorContext, proposalId: string): Promise<ProposalDto | null> {
    if (!canManageProposals(actor)) {
      throw new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to withdraw proposals.',
      })
    }

    const existing = await prisma.proposal.findUnique({
      where: { id: proposalId },
    })

    if (!existing) {
      return null
    }

    if (!canTransitionProposal(existing.state, 'withdrawn')) {
      throw new AppServiceError({
        status: 400,
        code: 'STATE_TRANSITION_DENIED',
        message: `Cannot transition proposal from ${existing.state} to withdrawn.`,
      })
    }

    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        state: 'withdrawn',
      },
    })

    return toProposalDto(updated)
  }
}

export const proposalsService = new ProposalsService()