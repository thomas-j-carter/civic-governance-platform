import { createServerFn } from '@tanstack/solid-start'
import {
  createAgendaItemSchema,
  createGovernanceBodySchema,
  createGovernanceSessionSchema,
  createOfficeSchema,
  updateAgendaItemSchema,
  updateGovernanceBodySchema,
  updateGovernanceSessionSchema,
  updateOfficeSchema,
} from '@ardtire/contracts'
import { z } from 'zod'
import { createGovClient } from '@ardtire/gov-client'
import { createAuthenticatedGovClient } from '../../lib/api/gov-client-server'

function getPublicGovClient() {
  const baseUrl =
    process.env.GOV_API_BASE_URL || process.env.VITE_GOV_API_BASE_URL || 'http://localhost:3002'

  return createGovClient({
    baseUrl,
  })
}

export const listGovernanceBodiesPublic = createServerFn({ method: 'GET' }).handler(async () => {
  return getPublicGovClient().governanceBodies.list()
})

export const listGovernanceBodiesAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  const client = await createAuthenticatedGovClient()
  return client.governanceBodies.list()
})

export const createGovernanceBody = createServerFn({ method: 'POST' })
  .inputValidator(createGovernanceBodySchema)
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.governanceBodies.create(data)
  })

export const updateGovernanceBody = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      bodyId: z.string().min(1),
      patch: updateGovernanceBodySchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.governanceBodies.update(data.bodyId, data.patch)
  })

export const listOfficesPublic = createServerFn({ method: 'GET' }).handler(async () => {
  return getPublicGovClient().offices.list()
})

export const listOfficesAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  const client = await createAuthenticatedGovClient()
  return client.offices.list()
})

export const createOffice = createServerFn({ method: 'POST' })
  .inputValidator(createOfficeSchema)
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.offices.create(data)
  })

export const updateOffice = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      officeId: z.string().min(1),
      patch: updateOfficeSchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.offices.update(data.officeId, data.patch)
  })

export const listSessionsPublic = createServerFn({ method: 'GET' }).handler(async () => {
  return getPublicGovClient().sessions.list()
})

export const listSessionsAdmin = createServerFn({ method: 'GET' }).handler(async () => {
  const client = await createAuthenticatedGovClient()
  return client.sessions.list()
})

export const createGovernanceSession = createServerFn({ method: 'POST' })
  .inputValidator(createGovernanceSessionSchema)
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.sessions.create(data)
  })

export const updateGovernanceSession = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      sessionId: z.string().min(1),
      patch: updateGovernanceSessionSchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.sessions.update(data.sessionId, data.patch)
  })

export const listAgendaItemsForSession = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      sessionId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.agendas.listForSession(data.sessionId)
  })

export const createAgendaItemForSession = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      sessionId: z.string().min(1),
      payload: createAgendaItemSchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.agendas.createForSession(data.sessionId, data.payload)
  })

export const updateAgendaItem = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      agendaItemId: z.string().min(1),
      patch: updateAgendaItemSchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.agendas.update(data.agendaItemId, data.patch)
  })