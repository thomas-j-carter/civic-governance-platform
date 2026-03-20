import { Hono } from 'hono'
import { createAmendmentSchema, updateAmendmentSchema } from '@ardtire/contracts'
import { AppServiceError } from '../../lib/errors'
import { amendmentsService } from '../../proposals/amendments-service'
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

export function createAmendmentsRoutes() {
  const app = new Hono<AppBindings>()

  app.get('/proposals/:proposalId/amendments', async (c) => {
    try {
      const actor = c.get('actor')
      const proposalId = c.req.param('proposalId')
      const items = await amendmentsService.listForProposal(actor, proposalId)

      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.post('/proposals/:proposalId/amendments', async (c) => {
    try {
      const actor = c.get('actor')
      const proposalId = c.req.param('proposalId')
      const json = await c.req.json().catch(() => ({}))
      const data = createAmendmentSchema.parse(json)
      const created = await amendmentsService.createForProposal(actor, proposalId, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/amendments/:amendmentId', async (c) => {
    try {
      const actor = c.get('actor')
      const amendmentId = c.req.param('amendmentId')
      const item = await amendmentsService.read(actor, amendmentId)

      if (!item) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Amendment not found.',
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

  app.patch('/amendments/:amendmentId', async (c) => {
    try {
      const actor = c.get('actor')
      const amendmentId = c.req.param('amendmentId')
      const json = await c.req.json().catch(() => ({}))
      const data = updateAmendmentSchema.parse(json)
      const updated = await amendmentsService.update(actor, amendmentId, data)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Amendment not found.',
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

  app.post('/amendments/:amendmentId/submit', async (c) => {
    try {
      const actor = c.get('actor')
      const amendmentId = c.req.param('amendmentId')
      const updated = await amendmentsService.submit(actor, amendmentId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Amendment not found.',
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

  app.post('/amendments/:amendmentId/withdraw', async (c) => {
    try {
      const actor = c.get('actor')
      const amendmentId = c.req.param('amendmentId')
      const updated = await amendmentsService.withdraw(actor, amendmentId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Amendment not found.',
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