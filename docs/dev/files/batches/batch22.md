## Batch 22 — route protection and admin auth boundary

TanStack Router’s `beforeLoad` is the intended place to do auth checks and redirects, and a parent route’s `beforeLoad` runs before its children, which makes `/admin/publication` the right place to protect the whole publication admin area. TanStack Start server functions can also read incoming headers with `getRequestHeader`, so the access check can safely forward the current bearer token to `gov-api`. ([TanStack][1])

Progress: **99% complete**

### 1. `apps/web/src/features/auth/publication-admin.server.ts`

```ts
import { createServerFn } from '@tanstack/solid-start'
import { getRequestHeader } from '@tanstack/solid-start/server'

const REQUIRED_PUBLICATION_GRANTS = [
  'record.read',
  'record.create',
  'record.version.read',
  'record.version.create',
  'record.officialize',
  'gazette.issue.read',
  'gazette.entry.read',
] as const

function extractBearerToken(authorizationHeader?: string | null): string | undefined {
  if (!authorizationHeader) {
    return undefined
  }

  const [scheme, value] = authorizationHeader.split(' ', 2)

  if (!scheme || !value) {
    return undefined
  }

  if (scheme.toLowerCase() !== 'bearer') {
    return undefined
  }

  const token = value.trim()
  return token.length > 0 ? token : undefined
}

function normalizeAuthContext(payload: any) {
  const data = payload?.data ?? payload ?? {}
  const actor = data?.actor ?? null
  const authorityGrants = Array.isArray(data?.authorityGrants)
    ? data.authorityGrants
    : Array.isArray(actor?.authorityGrants)
      ? actor.authorityGrants
      : []

  return {
    actor,
    authorityGrants,
  }
}

function hasPublicationAccess(authorityGrants: string[]) {
  return REQUIRED_PUBLICATION_GRANTS.some((grant) => authorityGrants.includes(grant))
}

export const getPublicationAdminAccess = createServerFn({ method: 'GET' }).handler(
  async () => {
    const authorizationHeader =
      getRequestHeader('Authorization') ?? getRequestHeader('authorization')

    const token = extractBearerToken(authorizationHeader)

    if (!token) {
      return {
        isAuthenticated: false,
        hasPublicationAccess: false,
        actor: null,
        authorityGrants: [] as string[],
      }
    }

    const baseUrl =
      process.env.GOV_API_BASE_URL ??
      process.env.VITE_GOV_API_BASE_URL ??
      'http://localhost:3002'

    const response = await fetch(`${baseUrl}/auth-context`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (response.status === 401 || response.status === 403) {
      return {
        isAuthenticated: false,
        hasPublicationAccess: false,
        actor: null,
        authorityGrants: [] as string[],
      }
    }

    if (!response.ok) {
      throw new Error('Unable to resolve publication admin access.')
    }

    const payload = await response.json()
    const normalized = normalizeAuthContext(payload)

    return {
      isAuthenticated: Boolean(normalized.actor),
      hasPublicationAccess: hasPublicationAccess(normalized.authorityGrants),
      actor: normalized.actor,
      authorityGrants: normalized.authorityGrants,
    }
  },
)
```

### 2. `apps/web/src/routes/forbidden.tsx`

```tsx
import { createFileRoute, Link, useSearch } from '@tanstack/solid-router'

export const Route = createFileRoute('/forbidden')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      from: typeof search.from === 'string' ? search.from : undefined,
    }
  },
  component: ForbiddenPage,
})

function ForbiddenPage() {
  const search = useSearch({ from: Route.id })

  return (
    <main class="mx-auto max-w-2xl space-y-6 p-6">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold">Access denied</h1>
        <p class="text-sm opacity-80">
          Your account is authenticated, but it does not currently have the authority grants
          required to use the publication administration workflow.
        </p>
      </header>

      <section class="rounded-2xl border p-4">
        <div class="text-sm">
          Requested location: <span class="font-medium">{search().from ?? 'unknown'}</span>
        </div>
      </section>

      <div class="flex flex-wrap gap-3">
        <Link class="rounded-xl border px-4 py-2" to="/">
          Return home
        </Link>
        <Link class="rounded-xl border px-4 py-2" to="/admin/publication/">
          Try publication dashboard again
        </Link>
      </div>
    </main>
  )
}
```

### 3. `apps/web/src/routes/admin/publication.tsx`

```tsx
import { Outlet, Link, createFileRoute, redirect, useLocation } from '@tanstack/solid-router'
import { getPublicationAdminAccess } from '~/features/auth/publication-admin.server'

export const Route = createFileRoute('/admin/publication')({
  beforeLoad: async ({ location }) => {
    const access = await getPublicationAdminAccess()

    if (!access.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }

    if (!access.hasPublicationAccess) {
      throw redirect({
        to: '/forbidden',
        search: {
          from: location.href,
        },
      })
    }

    return { access }
  },
  component: PublicationAdminLayout,
})

function navClasses(active: boolean) {
  return active
    ? 'rounded-xl border px-3 py-2 font-medium'
    : 'rounded-xl border border-transparent px-3 py-2 opacity-80 hover:border-inherit hover:opacity-100'
}

function PublicationAdminLayout() {
  const location = useLocation()
  const pathname = () => location().pathname

  const recordsActive = () =>
    pathname() === '/admin/publication/' ||
    pathname().startsWith('/admin/publication/records/')

  const issuesActive = () => pathname().startsWith('/admin/publication/issues/')

  return (
    <div class="min-h-screen">
      <div class="mx-auto max-w-7xl p-6">
        <div class="mb-6 rounded-2xl border p-4">
          <div class="mb-3 text-sm font-medium opacity-80">Publication Admin</div>
          <nav class="flex flex-wrap gap-2">
            <Link class={navClasses(recordsActive())} to="/admin/publication/">
              Records Dashboard
            </Link>
            <Link
              class={navClasses(issuesActive())}
              to="/admin/publication/"
              hash="issues"
            >
              Gazette Issues
            </Link>
          </nav>
        </div>

        <Outlet />
      </div>
    </div>
  )
}
```

### 4. `apps/web/src/features/auth/publication-admin.server.test.ts`

```ts
import { describe, expect, it, vi } from 'vitest'

const getRequestHeaderMock = vi.fn()
const fetchMock = vi.fn()

vi.mock('@tanstack/solid-start/server', () => {
  return {
    getRequestHeader: getRequestHeaderMock,
  }
})

vi.stubGlobal('fetch', fetchMock)

import { getPublicationAdminAccess } from './publication-admin.server'

describe('getPublicationAdminAccess', () => {
  it('returns unauthenticated when there is no bearer token', async () => {
    getRequestHeaderMock.mockReturnValueOnce(undefined)

    const result = await getPublicationAdminAccess()

    expect(result.isAuthenticated).toBe(false)
    expect(result.hasPublicationAccess).toBe(false)
    expect(result.authorityGrants).toEqual([])
  })

  it('returns authenticated publication access when auth-context contains required grants', async () => {
    getRequestHeaderMock.mockImplementation((name: string) => {
      if (name.toLowerCase() === 'authorization') {
        return 'Bearer token-1'
      }

      return undefined
    })

    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      async json() {
        return {
          data: {
            actor: {
              personId: 'person-1',
              isAuthenticated: true,
            },
            authorityGrants: ['record.read', 'gazette.issue.read'],
          },
        }
      },
    })

    const result = await getPublicationAdminAccess()

    expect(result.isAuthenticated).toBe(true)
    expect(result.hasPublicationAccess).toBe(true)
    expect(result.actor.personId).toBe('person-1')
  })
})
```

This gives the publication admin area a real route-level auth boundary instead of relying on every child page to remember to protect itself. The next practical step is to wire this into your actual login/session model and then run the real typecheck/test pass so any route-tree or auth-surface drift shows up immediately.

[1]: https://tanstack.com/router/v1/docs/framework/solid/guide/authenticated-routes?utm_source=chatgpt.com "Authenticated Routes | TanStack Router Solid Docs"
