import { Hono } from 'hono'
import { createOfficeSchema, updateOfficeSchema } from '@ardtire/contracts'
import { officesService } from '../../offices/service'
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

export function createOfficesRoutes() {
  const app = new Hono<AppBindings>()

  app.get('/offices', async (c) => {
    try {
      const actor = c.get('actor')
      const items = await officesService.list(actor)
      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/offices/:officeId', async (c) => {
    try {
      const actor = c.get('actor')
      const officeId = c.req.param('officeId')
      const item = await officesService.read(actor, officeId)

      if (!item) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Office not found.',
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

  app.post('/offices', async (c) => {
    try {
      const actor = c.get('actor')
      const json = await c.req.json().catch(() => ({}))
      const data = createOfficeSchema.parse(json)
      const created = await officesService.create(actor, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.patch('/offices/:officeId', async (c) => {
    try {
      const actor = c.get('actor')
      const officeId = c.req.param('officeId')
      const json = await c.req.json().catch(() => ({}))
      const data = updateOfficeSchema.parse(json)

      const updated = await officesService.update(actor, officeId, data)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Office not found.',
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