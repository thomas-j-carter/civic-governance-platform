## Batch 6 — proposals slice test hardening for the current repo

### 1. `apps/gov-api/vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    clearMocks: true,
  },
})
```

---

### 2. `apps/gov-api/package.json`

```json
{
  "name": "@ardtire/gov-api",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "echo 'wire actual dev command here'",
    "build": "echo 'wire actual build command here'",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@ardtire/authz": "workspace:*",
    "@ardtire/contracts": "workspace:*",
    "@ardtire/workflows": "workspace:*",
    "@prisma/client": "latest",
    "hono": "latest"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

---

### 3. `apps/gov-api/src/http/routes/proposals.test.ts`

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Hono } from 'hono'
import { AppServiceError } from '../../lib/errors'

const proposalsServiceMock = {
  list: vi.fn(),
  read: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  submit: vi.fn(),
  withdraw: vi.fn(),
}

const createProposalParse = vi.fn((input) => input)
const updateProposalParse = vi.fn((input) => input)

vi.mock('../../proposals/service', () => {
  return {
    proposalsService: proposalsServiceMock,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    createProposalSchema: {
      parse: createProposalParse,
    },
    updateProposalSchema: {
      parse: updateProposalParse,
    },
  }
})

import { createProposalsRoutes } from './proposals'

function createActor() {
  return {
    principalId: 'user-1',
    personId: 'person-1',
    memberId: 'member-1',
    roles: ['member'],
    permissions: ['create_proposal_draft', 'submit_proposal'],
  }
}

function createTestApp() {
  const app = new Hono()

  app.use('*', async (c, next) => {
    c.set('actor', createActor() as never)
    await next()
  })

  app.route('/', createProposalsRoutes())

  return app
}

describe('createProposalsRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists proposals', async () => {
    proposalsServiceMock.list.mockResolvedValue([
      {
        id: 'proposal-1',
        title: 'Founding Resolution',
        summary: 'Adopt the founding framework.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
        createdAt: '2026-03-21T00:00:00.000Z',
        updatedAt: '2026-03-21T00:00:00.000Z',
      },
    ])

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals')

    expect(response.status).toBe(200)
    expect(proposalsServiceMock.list).toHaveBeenCalledTimes(1)

    const body = await response.json()
    expect(body).toEqual([
      {
        id: 'proposal-1',
        title: 'Founding Resolution',
        summary: 'Adopt the founding framework.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
        createdAt: '2026-03-21T00:00:00.000Z',
        updatedAt: '2026-03-21T00:00:00.000Z',
      },
    ])
  })

  it('reads a proposal by id', async () => {
    proposalsServiceMock.read.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'submitted',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T01:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals/proposal-1')

    expect(response.status).toBe(200)
    expect(proposalsServiceMock.read).toHaveBeenCalledWith(
      expect.objectContaining({
        personId: 'person-1',
      }),
      'proposal-1',
    )

    const body = await response.json()
    expect(body.id).toBe('proposal-1')
    expect(body.state).toBe('submitted')
  })

  it('returns 404 when a proposal cannot be found', async () => {
    proposalsServiceMock.read.mockResolvedValue(null)

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals/missing-proposal')

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      code: 'NOT_FOUND',
      message: 'Proposal not found.',
    })
  })

  it('creates a proposal', async () => {
    proposalsServiceMock.create.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T00:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Founding Resolution',
        summary: 'Adopt the founding framework.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
      }),
    })

    expect(response.status).toBe(201)
    expect(createProposalParse).toHaveBeenCalledWith({
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
    })
    expect(proposalsServiceMock.create).toHaveBeenCalledWith(
      expect.objectContaining({
        personId: 'person-1',
      }),
      {
        title: 'Founding Resolution',
        summary: 'Adopt the founding framework.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
      },
    )

    const body = await response.json()
    expect(body.id).toBe('proposal-1')
  })

  it('maps schema parse failures to 400 validation responses', async () => {
    createProposalParse.mockImplementationOnce(() => {
      const error = new Error('Invalid request payload.')
      error.name = 'ZodError'
      throw error
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: '',
      }),
    })

    expect(response.status).toBe(400)
    expect(await response.json()).toEqual({
      code: 'VALIDATION_ERROR',
      message: 'Invalid request payload.',
    })
    expect(proposalsServiceMock.create).not.toHaveBeenCalled()
  })

  it('maps AppServiceError responses from the service layer', async () => {
    proposalsServiceMock.create.mockRejectedValue(
      new AppServiceError({
        status: 403,
        code: 'FORBIDDEN',
        message: 'Not authorized to create proposals.',
      }),
    )

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Founding Resolution',
        summary: 'Adopt the founding framework.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
      }),
    })

    expect(response.status).toBe(403)
    expect(await response.json()).toEqual({
      code: 'FORBIDDEN',
      message: 'Not authorized to create proposals.',
    })
  })

  it('updates a proposal', async () => {
    proposalsServiceMock.update.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution Revised',
      summary: 'Updated summary.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T02:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals/proposal-1', {
      method: 'PATCH',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        title: 'Founding Resolution Revised',
        summary: 'Updated summary.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
      }),
    })

    expect(response.status).toBe(200)
    expect(updateProposalParse).toHaveBeenCalled()
    expect(proposalsServiceMock.update).toHaveBeenCalledWith(
      expect.objectContaining({
        personId: 'person-1',
      }),
      'proposal-1',
      {
        title: 'Founding Resolution Revised',
        summary: 'Updated summary.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
      },
    )

    const body = await response.json()
    expect(body.title).toBe('Founding Resolution Revised')
  })

  it('submits a proposal', async () => {
    proposalsServiceMock.submit.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'submitted',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T03:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals/proposal-1/submit', {
      method: 'POST',
    })

    expect(response.status).toBe(200)
    expect(proposalsServiceMock.submit).toHaveBeenCalledWith(
      expect.objectContaining({
        personId: 'person-1',
      }),
      'proposal-1',
    )

    const body = await response.json()
    expect(body.state).toBe('submitted')
  })

  it('returns 404 when submitting a missing proposal', async () => {
    proposalsServiceMock.submit.mockResolvedValue(null)

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals/missing/submit', {
      method: 'POST',
    })

    expect(response.status).toBe(404)
    expect(await response.json()).toEqual({
      code: 'NOT_FOUND',
      message: 'Proposal not found.',
    })
  })

  it('withdraws a proposal', async () => {
    proposalsServiceMock.withdraw.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'withdrawn',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: '2026-03-21T00:00:00.000Z',
      updatedAt: '2026-03-21T04:00:00.000Z',
    })

    const app = createTestApp()
    const response = await app.request('http://localhost/proposals/proposal-1/withdraw', {
      method: 'POST',
    })

    expect(response.status).toBe(200)

    const body = await response.json()
    expect(body.state).toBe('withdrawn')
  })
})
```

---

### 4. `apps/gov-api/src/proposals/service.test.ts`

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AppServiceError } from '../lib/errors'

const hasRoleMock = vi.fn()
const hasPermissionMock = vi.fn()
const canTransitionProposalMock = vi.fn()

const prismaMock = {
  proposal: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
}

vi.mock('@ardtire/authz', () => {
  return {
    hasRole: hasRoleMock,
    hasPermission: hasPermissionMock,
  }
})

vi.mock('@ardtire/workflows', () => {
  return {
    canTransitionProposal: canTransitionProposalMock,
  }
})

vi.mock('../lib/prisma', () => {
  return {
    prisma: prismaMock,
  }
})

import { ProposalsService } from './service'

function createActor(overrides?: Record<string, unknown>) {
  return {
    principalId: 'user-1',
    personId: 'person-1',
    memberId: 'member-1',
    roles: ['member'],
    permissions: [],
    ...overrides,
  } as never
}

describe('ProposalsService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    hasRoleMock.mockReturnValue(false)
    hasPermissionMock.mockReturnValue(false)
    canTransitionProposalMock.mockReturnValue(false)
  })

  it('lists only public-visible proposals for non-managers', async () => {
    prismaMock.proposal.findMany.mockResolvedValue([
      {
        id: 'proposal-1',
        title: 'Published Resolution',
        summary: 'Visible proposal.',
        state: 'published',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
        createdAt: new Date('2026-03-21T00:00:00.000Z'),
        updatedAt: new Date('2026-03-21T01:00:00.000Z'),
      },
    ])

    const service = new ProposalsService()
    const result = await service.list(createActor())

    expect(prismaMock.proposal.findMany).toHaveBeenCalledWith({
      where: {
        state: {
          in: [
            'admitted',
            'amendment_window',
            'scheduled',
            'voting_open',
            'voting_closed',
            'certified',
            'ratified',
            'failed',
            'published',
            'archived',
          ],
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    expect(result).toEqual([
      {
        id: 'proposal-1',
        title: 'Published Resolution',
        summary: 'Visible proposal.',
        state: 'published',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
        createdAt: '2026-03-21T00:00:00.000Z',
        updatedAt: '2026-03-21T01:00:00.000Z',
      },
    ])
  })

  it('lists all proposals for managers', async () => {
    hasRoleMock.mockImplementation((_, role: string) => role === 'admin')

    prismaMock.proposal.findMany.mockResolvedValue([])

    const service = new ProposalsService()
    await service.list(createActor({ roles: ['admin'] }))

    expect(prismaMock.proposal.findMany).toHaveBeenCalledWith({
      where: undefined,
      orderBy: {
        createdAt: 'desc',
      },
    })
  })

  it('rejects create when the actor lacks authority', async () => {
    const service = new ProposalsService()

    try {
      await service.create(createActor(), {
        title: 'Founding Resolution',
        summary: 'Adopt the founding framework.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
      })
      throw new Error('Expected create to throw.')
    } catch (error) {
      expect(error).toBeInstanceOf(AppServiceError)
      const serviceError = error as AppServiceError
      expect(serviceError.status).toBe(403)
      expect(serviceError.code).toBe('FORBIDDEN')
      expect(serviceError.message).toBe('Not authorized to create proposals.')
    }

    expect(prismaMock.proposal.create).not.toHaveBeenCalled()
  })

  it('creates a proposal when the actor is authorized', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'create_proposal_draft'
    })

    prismaMock.proposal.create.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
    })

    const service = new ProposalsService()
    const result = await service.create(createActor(), {
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
    })

    expect(prismaMock.proposal.create).toHaveBeenCalledWith({
      data: {
        title: 'Founding Resolution',
        summary: 'Adopt the founding framework.',
        state: 'draft',
        bodyId: null,
        sessionId: null,
        ruleVersionId: null,
      },
    })

    expect(result.id).toBe('proposal-1')
    expect(result.state).toBe('draft')
  })

  it('returns null when submit targets a missing proposal', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'submit_proposal'
    })

    prismaMock.proposal.findUnique.mockResolvedValue(null)

    const service = new ProposalsService()
    const result = await service.submit(createActor(), 'missing-proposal')

    expect(result).toBeNull()
    expect(prismaMock.proposal.update).not.toHaveBeenCalled()
  })

  it('rejects invalid submit transitions', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'submit_proposal'
    })

    prismaMock.proposal.findUnique.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
    })

    canTransitionProposalMock.mockReturnValue(false)

    const service = new ProposalsService()

    try {
      await service.submit(createActor(), 'proposal-1')
      throw new Error('Expected submit to throw.')
    } catch (error) {
      expect(error).toBeInstanceOf(AppServiceError)
      const serviceError = error as AppServiceError
      expect(serviceError.status).toBe(400)
      expect(serviceError.code).toBe('STATE_TRANSITION_DENIED')
      expect(serviceError.message).toBe(
        'Cannot transition proposal from draft to submitted.',
      )
    }
  })

  it('submits a proposal when transition is allowed', async () => {
    hasPermissionMock.mockImplementation((_, permission: string) => {
      return permission === 'submit_proposal'
    })

    prismaMock.proposal.findUnique.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T00:00:00.000Z'),
    })

    canTransitionProposalMock.mockReturnValue(true)

    prismaMock.proposal.update.mockResolvedValue({
      id: 'proposal-1',
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'submitted',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
      createdAt: new Date('2026-03-21T00:00:00.000Z'),
      updatedAt: new Date('2026-03-21T02:00:00.000Z'),
    })

    const service = new ProposalsService()
    const result = await service.submit(createActor(), 'proposal-1')

    expect(prismaMock.proposal.update).toHaveBeenCalledWith({
      where: { id: 'proposal-1' },
      data: {
        state: 'submitted',
      },
    })

    expect(result?.state).toBe('submitted')
  })
})
```

---

### 5. `packages/gov-client/vitest.config.ts`

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    clearMocks: true,
  },
})
```

---

### 6. `packages/gov-client/package.json`

```json
{
  "name": "@ardtire/gov-client",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@ardtire/contracts": "workspace:*"
  },
  "devDependencies": {
    "@types/node": "latest",
    "typescript": "latest",
    "vitest": "latest"
  }
}
```

---

### 7. `packages/gov-client/src/proposals.test.ts`

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

const requestJson = vi.fn()

const createProposalParse = vi.fn((input) => input)
const updateProposalParse = vi.fn((input) => input)

const proposalSchema = { name: 'proposalSchema' }
const proposalListSchema = { name: 'proposalListSchema' }

vi.mock('./http', () => {
  return {
    requestJson,
  }
})

vi.mock('@ardtire/contracts', () => {
  return {
    createProposalSchema: {
      parse: createProposalParse,
    },
    updateProposalSchema: {
      parse: updateProposalParse,
    },
    proposalSchema,
    proposalListSchema,
  }
})

import { createProposalsClient } from './proposals'

describe('createProposalsClient', () => {
  const options = {
    baseUrl: 'http://localhost:3002',
    getToken: async () => 'token-1',
  } as never

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('lists proposals', async () => {
    requestJson.mockResolvedValueOnce([
      {
        id: 'proposal-1',
        title: 'Founding Resolution',
        state: 'draft',
      },
    ])

    const client = createProposalsClient(options)
    const result = await client.list()

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/proposals',
      schema: proposalListSchema,
    })
    expect(result).toEqual([
      {
        id: 'proposal-1',
        title: 'Founding Resolution',
        state: 'draft',
      },
    ])
  })

  it('reads a proposal', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'submitted',
    })

    const client = createProposalsClient(options)
    const result = await client.read('proposal-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/proposals/proposal-1',
      schema: proposalSchema,
    })
    expect(result).toEqual({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'submitted',
    })
  })

  it('creates a proposal after schema validation', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'draft',
    })

    const client = createProposalsClient(options)
    const input = {
      title: 'Founding Resolution',
      summary: 'Adopt the founding framework.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
    }

    const result = await client.create(input)

    expect(createProposalParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/proposals',
      method: 'POST',
      body: input,
      schema: proposalSchema,
    })
    expect(result).toEqual({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'draft',
    })
  })

  it('updates a proposal after schema validation', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'proposal-1',
      title: 'Founding Resolution Revised',
      state: 'draft',
    })

    const client = createProposalsClient(options)
    const input = {
      title: 'Founding Resolution Revised',
      summary: 'Updated summary.',
      state: 'draft',
      bodyId: null,
      sessionId: null,
      ruleVersionId: null,
    }

    const result = await client.update('proposal-1', input)

    expect(updateProposalParse).toHaveBeenCalledWith(input)
    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/proposals/proposal-1',
      method: 'PATCH',
      body: input,
      schema: proposalSchema,
    })
    expect(result).toEqual({
      id: 'proposal-1',
      title: 'Founding Resolution Revised',
      state: 'draft',
    })
  })

  it('submits a proposal', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'submitted',
    })

    const client = createProposalsClient(options)
    const result = await client.submit('proposal-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/proposals/proposal-1/submit',
      method: 'POST',
      schema: proposalSchema,
    })
    expect(result).toEqual({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'submitted',
    })
  })

  it('withdraws a proposal', async () => {
    requestJson.mockResolvedValueOnce({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'withdrawn',
    })

    const client = createProposalsClient(options)
    const result = await client.withdraw('proposal-1')

    expect(requestJson).toHaveBeenCalledWith({
      options,
      path: '/proposals/proposal-1/withdraw',
      method: 'POST',
      schema: proposalSchema,
    })
    expect(result).toEqual({
      id: 'proposal-1',
      title: 'Founding Resolution',
      state: 'withdrawn',
    })
  })
})
```

## What this batch does

This batch hardens the **current, real** repo state rather than the earlier assumed architecture:

* adds runnable Vitest setup for `apps/gov-api`
* adds runnable Vitest setup for `packages/gov-client`
* adds route tests for the committed proposals HTTP slice
* adds service tests for proposal permissions and lifecycle transitions
* adds client tests for the committed thin `gov-client` proposal wrapper

## Strongest next step

After this, the best next batch is the **current-architecture ballot vertical** in the real repo layout:

* `packages/contracts` ballot schemas and DTOs
* `apps/gov-api/src/ballots/service.ts`
* `apps/gov-api/src/http/routes/ballots.ts`
* `packages/gov-client/src/ballots.ts`
* matching route, service, and client tests
