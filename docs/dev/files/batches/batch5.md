## Batch 5 — proposals slice hardening against the current repo

### 1. `apps/gov-api/src/http/routes/proposals.test.ts`

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
    permissions: [
      'create_proposal_draft',
      'submit_proposal',
    ],
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

### 2. `packages/gov-client/src/proposals.test.ts`

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

---

## What changed after the repo re-review

The repo is further along than it looked at the start of this chat, and the current executable shape is different from the earlier imagined one. The proposal path now clearly exists in committed source on both the server and client side, while the ballot/certification slices are not yet present at the current `apps/gov-api/src/http/routes/...` paths I checked. So this Batch 5 hardens what is actually live instead of scaffolding against stale assumptions.

## Strongest next step after this Batch 5

The next correct move is to build the **current-architecture ballot vertical** in these real paths:

* `apps/gov-api/src/http/routes/ballots.ts`
* `apps/gov-api/src/ballots/service.ts`
* `packages/gov-client/src/ballots.ts`
* matching route + client tests

Then follow immediately with certifications/ratifications in the same actual structure.

[1]: https://github.com/thomas-j-carter/civic-governance-platform "GitHub - thomas-j-carter/civic-governance-platform: Civic Digital Governance Platform is a full-stack civic governance system that enables authenticated users to apply for membership, collaborate on constitutional proposals, manage structured review and voting workflows, and administer a growing digital governance community through a production-style web platform. · GitHub"
