import { Hono } from 'hono'
import { createProposalSchema, updateProposalSchema } from '@ardtire/contracts'
import { AppServiceError } from '../../lib/errors'
import { proposalsService } from '../../proposals/service'
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

export function createProposalsRoutes() {
  const app = new Hono<AppBindings>()

  app.get('/proposals', async (c) => {
    try {
      const actor = c.get('actor')
      const items = await proposalsService.list(actor)
      return c.json(items)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.get('/proposals/:proposalId', async (c) => {
    try {
      const actor = c.get('actor')
      const proposalId = c.req.param('proposalId')
      const item = await proposalsService.read(actor, proposalId)

      if (!item) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Proposal not found.',
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

  app.post('/proposals', async (c) => {
    try {
      const actor = c.get('actor')
      const json = await c.req.json().catch(() => ({}))
      const data = createProposalSchema.parse(json)
      const created = await proposalsService.create(actor, data)

      return c.json(created, 201)
    } catch (error) {
      const handled = errorResponse(error)
      return c.json(handled.body, handled.status)
    }
  })

  app.patch('/proposals/:proposalId', async (c) => {
    try {
      const actor = c.get('actor')
      const proposalId = c.req.param('proposalId')
      const json = await c.req.json().catch(() => ({}))
      const data = updateProposalSchema.parse(json)
      const updated = await proposalsService.update(actor, proposalId, data)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Proposal not found.',
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

  app.post('/proposals/:proposalId/submit', async (c) => {
    try {
      const actor = c.get('actor')
      const proposalId = c.req.param('proposalId')
      const updated = await proposalsService.submit(actor, proposalId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Proposal not found.',
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

  app.post('/proposals/:proposalId/withdraw', async (c) => {
    try {
      const actor = c.get('actor')
      const proposalId = c.req.param('proposalId')
      const updated = await proposalsService.withdraw(actor, proposalId)

      if (!updated) {
        return c.json(
          {
            code: 'NOT_FOUND',
            message: 'Proposal not found.',
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