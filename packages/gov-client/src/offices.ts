import {
  createOfficeSchema,
  officeListSchema,
  officeSchema,
  updateOfficeSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createOfficesClient(options: GovClientOptions) {
  return {
    list() {
      return requestJson({
        options,
        path: '/offices',
        schema: officeListSchema,
      })
    },

    read(officeId: string) {
      return requestJson({
        options,
        path: `/offices/${officeId}`,
        schema: officeSchema,
      })
    },

    create(input: unknown) {
      const body = createOfficeSchema.parse(input)

      return requestJson({
        options,
        path: '/offices',
        method: 'POST',
        body,
        schema: officeSchema,
      })
    },

    update(officeId: string, input: unknown) {
      const body = updateOfficeSchema.parse(input)

      return requestJson({
        options,
        path: `/offices/${officeId}`,
        method: 'PATCH',
        body,
        schema: officeSchema,
      })
    },
  }
}