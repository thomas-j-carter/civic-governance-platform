import { z } from 'zod'

export const officeStatusSchema = z.enum([
  'draft',
  'active',
  'inactive',
  'archived',
])

export const officeSchema = z.object({
  id: z.string(),
  bodyId: z.string().nullable().optional(),
  slug: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: officeStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const officeListSchema = z.array(officeSchema)

export const createOfficeSchema = z.object({
  bodyId: z.string().optional(),
  slug: z.string().trim().min(1).max(120),
  name: z.string().trim().min(1).max(240),
  description: z.string().trim().max(4000).optional(),
  status: officeStatusSchema.default('draft'),
})

export const updateOfficeSchema = z.object({
  bodyId: z.string().nullable().optional(),
  slug: z.string().trim().min(1).max(120).optional(),
  name: z.string().trim().min(1).max(240).optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  status: officeStatusSchema.optional(),
})

export type OfficeDto = z.infer<typeof officeSchema>
export type CreateOfficeInput = z.infer<typeof createOfficeSchema>
export type UpdateOfficeInput = z.infer<typeof updateOfficeSchema>