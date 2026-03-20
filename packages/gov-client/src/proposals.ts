import {
  createProposalSchema,
  proposalListSchema,
  proposalSchema,
  updateProposalSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createProposalsClient(options: GovClientOptions) {
  return {
    list() {
      return requestJson({
        options,
        path: '/proposals',
        schema: proposalListSchema,
      })
    },

    read(proposalId: string) {
      return requestJson({
        options,
        path: `/proposals/${proposalId}`,
        schema: proposalSchema,
      })
    },

    create(input: unknown) {
      const body = createProposalSchema.parse(input)

      return requestJson({
        options,
        path: '/proposals',
        method: 'POST',
        body,
        schema: proposalSchema,
      })
    },

    update(proposalId: string, input: unknown) {
      const body = updateProposalSchema.parse(input)

      return requestJson({
        options,
        path: `/proposals/${proposalId}`,
        method: 'PATCH',
        body,
        schema: proposalSchema,
      })
    },

    submit(proposalId: string) {
      return requestJson({
        options,
        path: `/proposals/${proposalId}/submit`,
        method: 'POST',
        schema: proposalSchema,
      })
    },

    withdraw(proposalId: string) {
      return requestJson({
        options,
        path: `/proposals/${proposalId}/withdraw`,
        method: 'POST',
        schema: proposalSchema,
      })
    },
  }
}