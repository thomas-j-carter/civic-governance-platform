import { proposalStates } from '@ardtire/domain'
import { z } from 'zod'

export const proposalStateSchema = z.enum(proposalStates)

export const proposalSchema = z.object({
  id: z.string(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  state: proposalStateSchema,
  bodyId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  ruleVersionId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const proposalListSchema = z.array(proposalSchema)

export const createProposalSchema = z.object({
  title: z.string().trim().min(1).max(240),
  summary: z.string().trim().max(10000).optional(),
  bodyId: z.string().optional(),
  sessionId: z.string().optional(),
  ruleVersionId: z.string().optional(),
  state: proposalStateSchema.default('draft'),
})

export const updateProposalSchema = z.object({
  title: z.string().trim().min(1).max(240).optional(),
  summary: z.string().trim().max(10000).nullable().optional(),
  bodyId: z.string().nullable().optional(),
  sessionId: z.string().nullable().optional(),
  ruleVersionId: z.string().nullable().optional(),
  state: proposalStateSchema.optional(),
})

export type ProposalDto = z.infer<typeof proposalSchema>
export type CreateProposalInput = z.infer<typeof createProposalSchema>
export type UpdateProposalInput = z.infer<typeof updateProposalSchema>