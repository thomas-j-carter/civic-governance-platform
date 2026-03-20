import { z } from 'zod'

export const governanceBodyStatusSchema = z.enum([
  'draft',
  'active',
  'inactive',
  'archived',
])

export const governanceBodySchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: governanceBodyStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const governanceBodyListSchema = z.array(governanceBodySchema)

export const createGovernanceBodySchema = z.object({
  slug: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(240),
  description: z.string().trim().max(4000).optional(),
  status: governanceBodyStatusSchema.default('draft'),
})

export const updateGovernanceBodySchema = z.object({
  slug: z.string().trim().min(1).max(120).optional(),
  name: z.string().trim().min(1).max(240).optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  status: governanceBodyStatusSchema.optional(),
})

export type GovernanceBodyDto = z.infer<typeof governanceBodySchema>
export type CreateGovernanceBodyInput = z.infer<typeof createGovernanceBodySchema>
export type UpdateGovernanceBodyInput = z.infer<typeof updateGovernanceBodySchema>