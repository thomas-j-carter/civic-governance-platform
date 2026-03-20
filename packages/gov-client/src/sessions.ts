import {
  createGovernanceSessionSchema,
  governanceSessionListSchema,
  governanceSessionSchema,
  updateGovernanceSessionSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createSessionsClient(options: GovClientOptions) {
  return {
    list() {
      return requestJson({
        options,
        path: '/sessions',
        schema: governanceSessionListSchema,
      })
    },

    read(sessionId: string) {
      return requestJson({
        options,
        path: `/sessions/${sessionId}`,
        schema: governanceSessionSchema,
      })
    },

    create(input: unknown) {
      const body = createGovernanceSessionSchema.parse(input)

      return requestJson({
        options,
        path: '/sessions',
        method: 'POST',
        body,
        schema: governanceSessionSchema,
      })
    },

    update(sessionId: string, input: unknown) {
      const body = updateGovernanceSessionSchema.parse(input)

      return requestJson({
        options,
        path: `/sessions/${sessionId}`,
        method: 'PATCH',
        body,
        schema: governanceSessionSchema,
      })
    },
  }
}