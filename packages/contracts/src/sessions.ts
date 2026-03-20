import { z } from 'zod'

export const governanceSessionStateSchema = z.enum([
  'draft',
  'scheduled',
  'in_session',
  'concluded',
  'archived',
])

export const governanceSessionSchema = z.object({
  id: z.string(),
  bodyId: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  scheduledStartAt: z.string().nullable().optional(),
  scheduledEndAt: z.string().nullable().optional(),
  state: governanceSessionStateSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const governanceSessionListSchema = z.array(governanceSessionSchema)

export const createGovernanceSessionSchema = z.object({
  bodyId: z.string().optional(),
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().max(4000).optional(),
  scheduledStartAt: z.string().datetime().optional(),
  scheduledEndAt: z.string().datetime().optional(),
  state: governanceSessionStateSchema.default('draft'),
})

export const updateGovernanceSessionSchema = z.object({
  bodyId: z.string().nullable().optional(),
  title: z.string().trim().min(1).max(240).optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  scheduledStartAt: z.string().datetime().nullable().optional(),
  scheduledEndAt: z.string().datetime().nullable().optional(),
  state: governanceSessionStateSchema.optional(),
})

export type GovernanceSessionDto = z.infer<typeof governanceSessionSchema>
export type CreateGovernanceSessionInput = z.infer<typeof createGovernanceSessionSchema>
export type UpdateGovernanceSessionInput = z.infer<typeof updateGovernanceSessionSchema>