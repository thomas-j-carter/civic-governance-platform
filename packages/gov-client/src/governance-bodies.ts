import {
  createGovernanceBodySchema,
  governanceBodyListSchema,
  governanceBodySchema,
  updateGovernanceBodySchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createGovernanceBodiesClient(options: GovClientOptions) {
  return {
    list() {
      return requestJson({
        options,
        path: '/governance/bodies',
        schema: governanceBodyListSchema,
      })
    },

    read(bodyId: string) {
      return requestJson({
        options,
        path: `/governance/bodies/${bodyId}`,
        schema: governanceBodySchema,
      })
    },

    create(input: unknown) {
      const body = createGovernanceBodySchema.parse(input)

      return requestJson({
        options,
        path: '/governance/bodies',
        method: 'POST',
        body,
        schema: governanceBodySchema,
      })
    },

    update(bodyId: string, input: unknown) {
      const body = updateGovernanceBodySchema.parse(input)

      return requestJson({
        options,
        path: `/governance/bodies/${bodyId}`,
        method: 'PATCH',
        body,
        schema: governanceBodySchema,
      })
    },
  }
}