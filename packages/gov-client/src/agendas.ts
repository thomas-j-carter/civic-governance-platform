import {
  agendaItemListSchema,
  agendaItemSchema,
  createAgendaItemSchema,
  updateAgendaItemSchema,
} from '@ardtire/contracts'
import type { GovClientOptions } from './http'
import { requestJson } from './http'

export function createAgendasClient(options: GovClientOptions) {
  return {
    listForSession(sessionId: string) {
      return requestJson({
        options,
        path: `/sessions/${sessionId}/agendas`,
        schema: agendaItemListSchema,
      })
    },

    createForSession(sessionId: string, input: unknown) {
      const body = createAgendaItemSchema.parse(input)

      return requestJson({
        options,
        path: `/sessions/${sessionId}/agendas`,
        method: 'POST',
        body,
        schema: agendaItemSchema,
      })
    },

    update(agendaItemId: string, input: unknown) {
      const body = updateAgendaItemSchema.parse(input)

      return requestJson({
        options,
        path: `/agendas/${agendaItemId}`,
        method: 'PATCH',
        body,
        schema: agendaItemSchema,
      })
    },
  }
}