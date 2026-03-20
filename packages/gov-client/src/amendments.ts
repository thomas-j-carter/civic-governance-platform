import {
  amendmentListSchema,
  amendmentSchema,
  createAmendmentSchema,
  updateAmendmentSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createAmendmentsClient(options: GovClientOptions) {
  return {
    listForProposal(proposalId: string) {
      return requestJson({
        options,
        path: `/proposals/${proposalId}/amendments`,
        schema: amendmentListSchema,
      })
    },

    read(amendmentId: string) {
      return requestJson({
        options,
        path: `/amendments/${amendmentId}`,
        schema: amendmentSchema,
      })
    },

    createForProposal(proposalId: string, input: unknown) {
      const body = createAmendmentSchema.parse(input)

      return requestJson({
        options,
        path: `/proposals/${proposalId}/amendments`,
        method: 'POST',
        body,
        schema: amendmentSchema,
      })
    },

    update(amendmentId: string, input: unknown) {
      const body = updateAmendmentSchema.parse(input)

      return requestJson({
        options,
        path: `/amendments/${amendmentId}`,
        method: 'PATCH',
        body,
        schema: amendmentSchema,
      })
    },

    submit(amendmentId: string) {
      return requestJson({
        options,
        path: `/amendments/${amendmentId}/submit`,
        method: 'POST',
        schema: amendmentSchema,
      })
    },

    withdraw(amendmentId: string) {
      return requestJson({
        options,
        path: `/amendments/${amendmentId}/withdraw`,
        method: 'POST',
        schema: amendmentSchema,
      })
    },
  }
}