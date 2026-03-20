import { Hono } from 'hono'
import { authContextMiddleware } from './http/middleware/auth-context'
import { devActorProvisioningMiddleware } from './http/middleware/dev-actor-provisioning'
import { requestIdMiddleware } from './http/middleware/request-id'
import { createAgendasRoutes } from './http/routes/agendas'
import { createAmendmentsRoutes } from './http/routes/amendments'
import { createAuthContextRoutes } from './http/routes/auth-context'
import { createGovernanceBodiesRoutes } from './http/routes/governance-bodies'
import { createHealthRoutes } from './http/routes/health'
import { createMembershipApplicationRoutes } from './http/routes/membership-applications'
import { createOfficesRoutes } from './http/routes/offices'
import { createProposalsRoutes } from './http/routes/proposals'
import { createSessionsRoutes } from './http/routes/sessions'
import type { AppBindings } from './http/types'

export function createApp() {
  const app = new Hono<AppBindings>()

  app.use('*', requestIdMiddleware)
  app.use('*', authContextMiddleware)
  app.use('*', devActorProvisioningMiddleware)

  app.onError((error, c) => {
    console.error('Unhandled request error', {
      requestId: c.get('requestId'),
      message: error.message,
      stack: error.stack,
    })

    return c.json(
      {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred.',
      },
      500,
    )
  })

  app.route('/', createHealthRoutes())
  app.route('/', createAuthContextRoutes())
  app.route('/', createMembershipApplicationRoutes())
  app.route('/', createGovernanceBodiesRoutes())
  app.route('/', createOfficesRoutes())
  app.route('/', createSessionsRoutes())
  app.route('/', createAgendasRoutes())
  app.route('/', createProposalsRoutes())
  app.route('/', createAmendmentsRoutes())

  return app
}