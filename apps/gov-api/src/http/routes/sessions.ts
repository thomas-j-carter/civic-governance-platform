import { Hono } from 'hono'
import {
  createGovernanceSessionSchema,
  updateGovernanceSessionSchema,
} from '@ardtire/contracts'
import { sessionsService } from '../../sessions/service'
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

export function createSessionsRoutes() {
  const app = new Hono<AppBindings>()

  app.get('/sessions', async (c) => {
    try {
      const actor = c.get('actor')
      const items = await sessionsService.list(actor)
      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/sessions/:sessionId', async (c) => {
    try {
      const actor = c.get('actor')
      const sessionId = c.req.param('sessionId')
      const item = await sessionsService.read(actor, sessionId)

      if (!item) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Governance session not found.',
          },
          404,
        )
      }

      return c.json(item)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.post('/sessions', async (c) => {
    try {
      const actor = c.get('actor')
      const json = await c.req.json().catch(() => ({}))
      const data = createGovernanceSessionSchema.parse(json)
      const created = await sessionsService.create(actor, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.patch('/sessions/:sessionId', async (c) => {
    try {
      const actor = c.get('actor')
      const sessionId = c.req.param('sessionId')
      const json = await c.req.json().catch(() => ({}))
      const data = updateGovernanceSessionSchema.parse(json)

      const updated = await sessionsService.update(actor, sessionId, data)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Governance session not found.',
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