import { createServerFn } from '@tanstack/solid-start'
import {
  createAmendmentSchema,
  createProposalSchema,
  updateAmendmentSchema,
  updateProposalSchema,
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

export const listPublicProposals = createServerFn({ method: 'GET' }).handler(async () => {
  return getPublicGovClient().proposals.list()
})

export const readPublicProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    return getPublicGovClient().proposals.read(data.proposalId)
  })

export const listPublicAmendmentsForProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    return getPublicGovClient().amendments.listForProposal(data.proposalId)
  })

export const listAuthenticatedProposals = createServerFn({ method: 'GET' }).handler(
  async () => {
    const client = await createAuthenticatedGovClient()
    return client.proposals.list()
  },
)

export const readAuthenticatedProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.proposals.read(data.proposalId)
  })

export const listAuthenticatedAmendmentsForProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.amendments.listForProposal(data.proposalId)
  })

export const createProposal = createServerFn({ method: 'POST' })
  .inputValidator(createProposalSchema)
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.proposals.create(data)
  })

export const updateProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
      patch: updateProposalSchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.proposals.update(data.proposalId, data.patch)
  })

export const submitProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.proposals.submit(data.proposalId)
  })

export const withdrawProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.proposals.withdraw(data.proposalId)
  })

export const createAmendmentForProposal = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      proposalId: z.string().min(1),
      payload: createAmendmentSchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.amendments.createForProposal(data.proposalId, data.payload)
  })

export const updateAmendment = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      amendmentId: z.string().min(1),
      patch: updateAmendmentSchema,
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.amendments.update(data.amendmentId, data.patch)
  })

export const submitAmendment = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      amendmentId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.amendments.submit(data.amendmentId)
  })

export const withdrawAmendment = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      amendmentId: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const client = await createAuthenticatedGovClient()
    return client.amendments.withdraw(data.amendmentId)
  })