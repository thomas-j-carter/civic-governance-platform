## Batch 23 — login redirect flow and authenticated admin shell

Progress: **99% complete**

TanStack Router’s parent-route `beforeLoad` is the right place to protect all child admin routes, and the same docs show using the current `location.href` for post-login redirect behavior. TanStack Start server functions can read request headers on the server, which is useful for deriving authenticated access state for the admin shell. ([TanStack][1])

This batch makes the route protection from Batch 22 feel like a real operator boundary instead of a bare redirect.

### 1. `apps/web/src/features/auth/session.server.ts`

```ts id="b23session"
import { createServerFn } from '@tanstack/solid-start'
import { getRequestHeader } from '@tanstack/solid-start/server'

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

export const getCurrentSession = createServerFn({ method: 'GET' }).handler(async () => {
  const authorizationHeader =
    getRequestHeader('Authorization') ?? getRequestHeader('authorization')

  const token = extractBearerToken(authorizationHeader)

  if (!token) {
    return {
      isAuthenticated: false,
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
      actor: null,
      authorityGrants: [] as string[],
    }
  }

  if (!response.ok) {
    throw new Error('Unable to resolve current session.')
  }

  const payload = await response.json()
  const normalized = normalizeAuthContext(payload)

  return {
    isAuthenticated: Boolean(normalized.actor),
    actor: normalized.actor,
    authorityGrants: normalized.authorityGrants,
  }
})
```

---

### 2. `apps/web/src/routes/login.tsx`

```tsx id="b23login"
import { Show } from 'solid-js'
import { createFileRoute, useSearch } from '@tanstack/solid-router'

export const Route = createFileRoute('/login')({
  validateSearch: (search: Record<string, unknown>) => {
    return {
      redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
    }
  },
  component: LoginPage,
})

function LoginPage() {
  const search = useSearch({ from: Route.id })

  const loginUrl = () => {
    const upstreamLoginUrl =
      import.meta.env.VITE_LOGIN_URL ??
      '/api/auth/login'

    const redirect = search().redirect
      ? encodeURIComponent(search().redirect)
      : encodeURIComponent('/admin/publication/')

    return `${upstreamLoginUrl}?redirect=${redirect}`
  }

  return (
    <main class="mx-auto max-w-2xl space-y-6 p-6">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold">Sign in</h1>
        <p class="text-sm opacity-80">
          You need to sign in to access the publication administration workflow.
        </p>
      </header>

      <section class="rounded-2xl border p-4 space-y-3">
        <div class="text-sm">
          After sign-in, you will be returned to:
        </div>
        <div class="rounded-xl border px-3 py-2 text-sm">
          {search().redirect ?? '/admin/publication/'}
        </div>

        <a class="inline-flex rounded-xl border px-4 py-2" href={loginUrl()}>
          Continue to sign in
        </a>
      </section>

      <Show when={import.meta.env.DEV}>
        <section class="rounded-2xl border p-4 text-sm opacity-80">
          In local development, point <code>VITE_LOGIN_URL</code> at your real auth initiation
          endpoint when available.
        </section>
      </Show>
    </main>
  )
}
```

---

### 3. `apps/web/src/routes/admin/publication.tsx`

Replace with:

```tsx id="b23publicationlayout"
import { Outlet, Link, createFileRoute, redirect, useLocation } from '@tanstack/solid-router'
import { getPublicationAdminAccess } from '~/features/auth/publication-admin.server'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'

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
  const context = Route.useRouteContext()

  const recordsActive = () =>
    pathname() === '/admin/publication/' ||
    pathname().startsWith('/admin/publication/records/')

  const issuesActive = () => pathname().startsWith('/admin/publication/issues/')

  const actor = () => context().access.actor
  const grants = () => context().access.authorityGrants ?? []

  return (
    <div class="min-h-screen">
      <div class="mx-auto max-w-7xl p-6">
        <div class="mb-6 rounded-2xl border p-4 space-y-4">
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <div class="text-sm font-medium opacity-80">Publication Admin</div>
              <div class="mt-1 text-sm opacity-80">
                Signed in as {actor()?.email ?? actor()?.personId ?? 'unknown operator'}
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2">
              <PublicationStatusBadge status="AUTHORIZED" />
              <a class="rounded-xl border px-3 py-2 text-sm" href="/api/auth/logout">
                Sign out
              </a>
            </div>
          </div>

          <div class="rounded-xl border p-3">
            <div class="mb-2 text-xs font-medium uppercase opacity-70">Authority grants</div>
            <div class="flex flex-wrap gap-2">
              {grants().map((grant) => (
                <span class="rounded-full border px-2.5 py-1 text-xs">{grant}</span>
              ))}
            </div>
          </div>

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

---

### 4. `apps/web/src/features/publication/components/PublicationStatusBadge.tsx`

Replace with:

```tsx id="b23badge"
import { splitProps } from 'solid-js'

function statusClasses(status: string) {
  switch (status) {
    case 'DRAFT':
    case 'pending':
    case 'draft':
      return 'border border-slate-300 bg-slate-100 text-slate-800'
    case 'OFFICIAL':
    case 'certified':
    case 'ratified':
    case 'open':
      return 'border border-blue-300 bg-blue-100 text-blue-800'
    case 'PUBLISHED':
      return 'border border-green-300 bg-green-100 text-green-800'
    case 'AUTHORIZED':
      return 'border border-emerald-300 bg-emerald-100 text-emerald-800'
    case 'REJECTED':
    case 'cancelled':
    case 'CANCELLED':
      return 'border border-red-300 bg-red-100 text-red-800'
    default:
      return 'border border-zinc-300 bg-zinc-100 text-zinc-800'
  }
}

export function PublicationStatusBadge(
  props: {
    status: string
    class?: string
  },
) {
  const [local, rest] = splitProps(props, ['status', 'class'])

  return (
    <span
      class={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(
        local.status,
      )} ${local.class ?? ''}`}
      {...rest}
    >
      {local.status}
    </span>
  )
}
```

---

### 5. `apps/web/src/features/auth/publication-admin.server.test.ts`

Replace with:

```ts id="b23accesstest"
import { beforeEach, describe, expect, it, vi } from 'vitest'

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
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unauthenticated when there is no bearer token', async () => {
    getRequestHeaderMock.mockReturnValue(undefined)

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
              email: 'thomas@example.com',
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

  it('returns authenticated but forbidden when actor lacks publication grants', async () => {
    getRequestHeaderMock.mockImplementation((name: string) => {
      if (name.toLowerCase() === 'authorization') {
        return 'Bearer token-2'
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
              personId: 'person-2',
              email: 'viewer@example.com',
              isAuthenticated: true,
            },
            authorityGrants: ['membership.read'],
          },
        }
      },
    })

    const result = await getPublicationAdminAccess()

    expect(result.isAuthenticated).toBe(true)
    expect(result.hasPublicationAccess).toBe(false)
    expect(result.authorityGrants).toEqual(['membership.read'])
  })
})
```

---

### 6. `apps/web/src/features/auth/session.server.test.ts`

```ts id="b23sessiontest"
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getRequestHeaderMock = vi.fn()
const fetchMock = vi.fn()

vi.mock('@tanstack/solid-start/server', () => {
  return {
    getRequestHeader: getRequestHeaderMock,
  }
})

vi.stubGlobal('fetch', fetchMock)

import { getCurrentSession } from './session.server'

describe('getCurrentSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns unauthenticated without a bearer token', async () => {
    getRequestHeaderMock.mockReturnValue(undefined)

    const result = await getCurrentSession()

    expect(result.isAuthenticated).toBe(false)
    expect(result.actor).toBeNull()
    expect(result.authorityGrants).toEqual([])
  })

  it('returns session data from auth-context', async () => {
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
              email: 'thomas@example.com',
              isAuthenticated: true,
            },
            authorityGrants: ['record.read'],
          },
        }
      },
    })

    const result = await getCurrentSession()

    expect(result.isAuthenticated).toBe(true)
    expect(result.actor.personId).toBe('person-1')
    expect(result.authorityGrants).toEqual(['record.read'])
  })
})
```

This gives you a real login redirect target, a protected admin shell that surfaces the current operator and their grants, and reusable session resolution for the rest of the web app. The next practical batch is to wire the publication shell into your actual global admin navigation and add a publish confirmation step so accidental publication is harder.

[1]: https://tanstack.com/router/v1/docs/framework/solid/guide/authenticated-routes?utm_source=chatgpt.com "Authenticated Routes | TanStack Router Solid Docs"
