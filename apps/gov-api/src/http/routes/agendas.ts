import { Hono } from 'hono'
import { createAgendaItemSchema, updateAgendaItemSchema } from '@ardtire/contracts'
import { agendasService } from '../../sessions/agendas-service'
import { AppServiceError } from '../../lib/errors'
import type { AppBindings } from '../types'

function errorResponse(error: unknown) {
  if (error instanceof AppServiceError) {
    return {
      status: error.status,
      body: {
        code: error.code,
        message: error.message,
      },
    }
  }

  if (error instanceof Error && error.name === 'ZodError') {
    return {
      status: 400,
      body: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request payload.',
      },
    }
  }

  return {
    status: 500,
    body: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred.',
    },
  }
}

export function createAgendasRoutes() {
  const app = new Hono<AppBindings>()

  app.get('/sessions/:sessionId/agendas', async (c) => {
    try {
      const actor = c.get('actor')
      const sessionId = c.req.param('sessionId')
      const items = await agendasService.listForSession(actor, sessionId)
      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.post('/sessions/:sessionId/agendas', async (c) => {
    try {
      const actor = c.get('actor')
      const sessionId = c.req.param('sessionId')
      const json = await c.req.json().catch(() => ({}))
      const data = createAgendaItemSchema.parse(json)
      const created = await agendasService.createForSession(actor, sessionId, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.patch('/agendas/:agendaItemId', async (c) => {
    try {
      const actor = c.get('actor')
      const agendaItemId = c.req.param('agendaItemId')
      const json = await c.req.json().catch(() => ({}))
      const data = updateAgendaItemSchema.parse(json)

      const updated = await agendasService.update(actor, agendaItemId, data)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Agenda item not found.',
          },
          404,
        )
      }

      return c.json(updated)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  return app
}