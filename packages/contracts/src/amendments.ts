import { amendmentStates } from '@ardtire/domain'
import { z } from 'zod'

export const amendmentStateSchema = z.enum(amendmentStates)

export const amendmentSchema = z.object({
  id: z.string(),
  proposalId: z.string(),
  title: z.string(),
  summary: z.string().nullable().optional(),
  state: amendmentStateSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const amendmentListSchema = z.array(amendmentSchema)

export const createAmendmentSchema = z.object({
  title: z.string().trim().min(1).max(240),
  summary: z.string().trim().max(10000).optional(),
  state: amendmentStateSchema.default('draft'),
})

export const updateAmendmentSchema = z.object({
  title: z.string().trim().min(1).max(240).optional(),
  summary: z.string().trim().max(10000).nullable().optional(),
  state: amendmentStateSchema.optional(),
})

export type AmendmentDto = z.infer<typeof amendmentSchema>
export type CreateAmendmentInput = z.infer<typeof createAmendmentSchema>
export type UpdateAmendmentInput = z.infer<typeof updateAmendmentSchema>