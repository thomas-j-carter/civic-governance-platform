import { z } from 'zod'

export const agendaItemSchema = z.object({
  id: z.string(),
  sessionId: z.string(),
  proposalId: z.string().nullable().optional(),
  title: z.string(),
  description: z.string().nullable().optional(),
  sortOrder: z.number().int(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const agendaItemListSchema = z.array(agendaItemSchema)

export const createAgendaItemSchema = z.object({
  proposalId: z.string().optional(),
  title: z.string().trim().min(1).max(240),
  description: z.string().trim().max(4000).optional(),
  sortOrder: z.number().int().min(0).default(0),
})

export const updateAgendaItemSchema = z.object({
  proposalId: z.string().nullable().optional(),
  title: z.string().trim().min(1).max(240).optional(),
  description: z.string().trim().max(4000).nullable().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export type AgendaItemDto = z.infer<typeof agendaItemSchema>
export type CreateAgendaItemInput = z.infer<typeof createAgendaItemSchema>
export type UpdateAgendaItemInput = z.infer<typeof updateAgendaItemSchema>