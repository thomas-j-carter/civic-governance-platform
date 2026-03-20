import { Hono } from 'hono'
import {
  createGovernanceBodySchema,
  updateGovernanceBodySchema,
} from '@ardtire/contracts'
import { governanceBodiesService } from '../../governance-bodies/service'
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

export function createGovernanceBodiesRoutes() {
  const app = new Hono<AppBindings>()

  app.get('/governance/bodies', async (c) => {
    try {
      const actor = c.get('actor')
      const items = await governanceBodiesService.list(actor)
      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/governance/bodies/:bodyId', async (c) => {
    try {
      const actor = c.get('actor')
      const bodyId = c.req.param('bodyId')
      const item = await governanceBodiesService.read(actor, bodyId)

      if (!item) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Governance body not found.',
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

  app.post('/governance/bodies', async (c) => {
    try {
      const actor = c.get('actor')
      const json = await c.req.json().catch(() => ({}))
      const data = createGovernanceBodySchema.parse(json)
      const created = await governanceBodiesService.create(actor, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.patch('/governance/bodies/:bodyId', async (c) => {
    try {
      const actor = c.get('actor')
      const bodyId = c.req.param('bodyId')
      const json = await c.req.json().catch(() => ({}))
      const data = updateGovernanceBodySchema.parse(json)

      const updated = await governanceBodiesService.update(actor, bodyId, data)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Governance body not found.',
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