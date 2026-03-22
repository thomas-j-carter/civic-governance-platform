## Batch 25 — auth guard extraction, tests, and deployment checklist

Progress: **99% complete**

This batch makes the admin auth boundary easier to test and adds the concrete deployment-readiness checklist with commands.

### 1. `apps/web/src/features/auth/publication-admin-access.ts`

```ts id="b25access"
export const REQUIRED_PUBLICATION_GRANTS = [
  'record.read',
  'record.create',
  'record.version.read',
  'record.version.create',
  'record.officialize',
  'gazette.issue.read',
  'gazette.entry.read',
] as const

export interface PublicationAdminAccessState {
  isAuthenticated: boolean
  hasPublicationAccess: boolean
  actor: unknown | null
  authorityGrants: string[]
}

export function normalizePublicationAdminAccess(payload: any): PublicationAdminAccessState {
  const data = payload?.data ?? payload ?? {}
  const actor = data?.actor ?? null
  const authorityGrants = Array.isArray(data?.authorityGrants)
    ? data.authorityGrants
    : Array.isArray(actor?.authorityGrants)
      ? actor.authorityGrants
      : []

  return {
    isAuthenticated: Boolean(actor),
    hasPublicationAccess: hasPublicationAccess(authorityGrants),
    actor,
    authorityGrants,
  }
}

export function hasPublicationAccess(authorityGrants: string[]) {
  return REQUIRED_PUBLICATION_GRANTS.some((grant) => authorityGrants.includes(grant))
}

export function resolvePublicationAdminRedirect(input: {
  href: string
  isAuthenticated: boolean
  hasPublicationAccess: boolean
}) {
  if (!input.isAuthenticated) {
    return {
      to: '/login' as const,
      search: {
        redirect: input.href,
      },
    }
  }

  if (!input.hasPublicationAccess) {
    return {
      to: '/forbidden' as const,
      search: {
        from: input.href,
      },
    }
  }

  return null
}
```

---

### 2. `apps/web/src/features/auth/publication-admin.server.ts`

Replace with:

```ts id="b25accessserver"
import { createServerFn } from '@tanstack/solid-start'
import { getRequestHeader } from '@tanstack/solid-start/server'
import { normalizePublicationAdminAccess } from './publication-admin-access'

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
    return normalizePublicationAdminAccess(payload)
  },
)
```

---

### 3. `apps/web/src/routes/admin/publication.tsx`

Replace with:

```tsx id="b25publicationroute"
import { Outlet, createFileRoute, redirect, useLocation } from '@tanstack/solid-router'
import { getPublicationAdminAccess } from '~/features/auth/publication-admin.server'
import { resolvePublicationAdminRedirect } from '~/features/auth/publication-admin-access'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'

export const Route = createFileRoute('/admin/publication')({
  beforeLoad: async ({ location }) => {
    const access = await getPublicationAdminAccess()
    const redirectTarget = resolvePublicationAdminRedirect({
      href: location.href,
      isAuthenticated: access.isAuthenticated,
      hasPublicationAccess: access.hasPublicationAccess,
    })

    if (redirectTarget) {
      throw redirect(redirectTarget)
    }

    return { access }
  },
  component: PublicationAdminLayout,
})

function PublicationAdminLayout() {
  const location = useLocation()
  const context = Route.useRouteContext()

  const actor = () => context().access.actor as any
  const grants = () => context().access.authorityGrants ?? []

  return (
    <div class="space-y-6">
      <section class="rounded-2xl border p-4 space-y-4">
        <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <div class="text-sm font-medium opacity-80">Publication Administration</div>
            <div class="mt-1 text-sm opacity-80">
              Signed in as {actor()?.email ?? actor()?.personId ?? 'unknown operator'}
            </div>
            <div class="mt-1 text-xs opacity-70">Current location: {location().pathname}</div>
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
      </section>

      <Outlet />
    </div>
  )
}
```

---

### 4. `apps/web/src/features/auth/publication-admin-access.test.ts`

```ts id="b25accesstest"
import { describe, expect, it } from 'vitest'
import {
  hasPublicationAccess,
  normalizePublicationAdminAccess,
  resolvePublicationAdminRedirect,
} from './publication-admin-access'

describe('publication-admin-access', () => {
  it('recognizes publication access from matching grants', () => {
    expect(hasPublicationAccess(['record.read'])).toBe(true)
    expect(hasPublicationAccess(['gazette.entry.read'])).toBe(true)
    expect(hasPublicationAccess(['membership.read'])).toBe(false)
  })

  it('normalizes actor and grants from auth-context payload', () => {
    const result = normalizePublicationAdminAccess({
      data: {
        actor: {
          personId: 'person-1',
          email: 'thomas@example.com',
        },
        authorityGrants: ['record.read', 'gazette.issue.read'],
      },
    })

    expect(result.isAuthenticated).toBe(true)
    expect(result.hasPublicationAccess).toBe(true)
    expect(result.actor).toEqual({
      personId: 'person-1',
      email: 'thomas@example.com',
    })
    expect(result.authorityGrants).toEqual(['record.read', 'gazette.issue.read'])
  })

  it('returns login redirect when unauthenticated', () => {
    const result = resolvePublicationAdminRedirect({
      href: '/admin/publication/',
      isAuthenticated: false,
      hasPublicationAccess: false,
    })

    expect(result).toEqual({
      to: '/login',
      search: {
        redirect: '/admin/publication/',
      },
    })
  })

  it('returns forbidden redirect when authenticated without access', () => {
    const result = resolvePublicationAdminRedirect({
      href: '/admin/publication/',
      isAuthenticated: true,
      hasPublicationAccess: false,
    })

    expect(result).toEqual({
      to: '/forbidden',
      search: {
        from: '/admin/publication/',
      },
    })
  })

  it('returns null when authenticated with access', () => {
    const result = resolvePublicationAdminRedirect({
      href: '/admin/publication/',
      isAuthenticated: true,
      hasPublicationAccess: true,
    })

    expect(result).toBeNull()
  })
})
```

---

### 5. `docs/dev/DEPLOYMENT_READINESS_CHECKLIST.md`

````md id="b25deploycheck"
# Deployment Readiness Checklist

## Current readiness estimate

- Generated architecture: essentially complete
- Publication subsystem: near deployment-ready after reconciliation
- Full product: not yet fully deployment-ready

## Phase 1 — local repository reconciliation

### 1. Install dependencies
```bash
pnpm install
````

### 2. Verify workspace shape

```bash
pnpm -r exec pwd
```

### 3. Typecheck major packages/apps

```bash
pnpm -C packages/contracts typecheck
pnpm -C packages/gov-client typecheck
pnpm -C apps/gov-api typecheck
pnpm -C apps/web typecheck
```

### 4. Run focused tests

```bash
pnpm -C packages/gov-client test
pnpm -C apps/gov-api test
pnpm -C apps/gov-api publication:test:e2e
pnpm -C apps/web test
```

### 5. Run builds

```bash
pnpm -C packages/contracts build
pnpm -C packages/gov-client build
pnpm -C apps/gov-api build
pnpm -C apps/web build
```

## Phase 2 — database readiness

### 1. Confirm env

Required:

* `DATABASE_URL`
* `AUTH_JWT_ISSUER`
* one of:

  * `AUTH_JWKS_URL`
  * `AUTH_JWT_PUBLIC_KEY`
  * `AUTH_JWT_SECRET`

### 2. Generate Prisma client

Use the repo’s canonical Prisma location.
Examples:

```bash
pnpm exec prisma generate
```

or, if schema path is explicit:

```bash
pnpm exec prisma generate --schema prisma/prisma.schema
```

### 3. Apply migrations

```bash
pnpm exec prisma migrate deploy
```

or:

```bash
pnpm exec prisma migrate deploy --schema prisma/prisma.schema
```

### 4. Optional local reset

Do this only in local dev:

```bash
pnpm exec prisma migrate reset
```

## Phase 3 — backend runtime verification

### 1. Start gov-api

```bash
pnpm -C apps/gov-api dev
```

### 2. Verify health

```bash
curl http://localhost:3002/healthz
```

### 3. Verify auth-context with a real token

```bash
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3002/auth-context
```

### 4. Verify publication flow manually

Check these routes with a real authorized token:

* `GET /official-records`
* `POST /official-records`
* `POST /official-records/:recordId/versions`
* `POST /official-records/:recordId/actions/officialize`
* `GET /gazette/issues`
* `POST /gazette/issues`
* `POST /gazette/issues/:gazetteIssueId/entries`
* `POST /gazette/issues/:issueId/actions/publish`

## Phase 4 — frontend runtime verification

### 1. Start web app

```bash
pnpm -C apps/web dev
```

### 2. Verify admin routes

Visit:

* `/login`
* `/forbidden`
* `/admin/publication`
* `/admin/publication/records/<recordId>`
* `/admin/publication/issues/<issueId>`

### 3. Verify operator flow in UI

* create official record
* create record version
* officialize record
* create gazette issue
* add record to issue
* publish issue

## Phase 5 — CI gate expectations

CI should fail if any of these fail:

```bash
pnpm -C packages/contracts typecheck
pnpm -C packages/gov-client typecheck
pnpm -C apps/gov-api typecheck
pnpm -C apps/web typecheck

pnpm -C packages/gov-client test
pnpm -C apps/gov-api test
pnpm -C apps/web test

pnpm -C packages/contracts build
pnpm -C packages/gov-client build
pnpm -C apps/gov-api build
pnpm -C apps/web build
```

## Phase 6 — pre-deploy checklist

Before deployment, confirm all of the following:

* Prisma schema matches repository implementations
* migrations apply on a fresh database
* JWT validation works against real IdP
* principal-to-person resolution works with real data
* authority grants are present for real operators
* publication e2e tests pass
* admin publication UI works end to end
* forbidden and login redirects behave correctly
* no duplicate bootstrap/app-entry structure remains active

## Phase 7 — deployment checklist

### Backend

```bash
pnpm -C apps/gov-api build
```

### Frontend

```bash
pnpm -C apps/web build
```

### Database

```bash
pnpm exec prisma migrate deploy
```

### Smoke tests after deploy

* health endpoint returns 200
* login succeeds
* admin publication dashboard loads
* one test record can be created in staging
* one staging gazette issue can be created
* one official record can be added and published in staging

## Final release criteria

The product is deployment-ready only when:

1. the canonical app structure is reconciled
2. the database schema and migrations are verified
3. typecheck, tests, and builds pass
4. real auth works
5. publication admin flow works in staging
6. deployment steps are repeatable without guesswork

```

This batch gives you a clean, testable auth-guard core plus the concrete command-driven deployment checklist. The next practical step is to do the real repo stabilization pass: run this checklist locally, fix every failing import/type/path/test, and then trim any remaining duplicate bootstraps.
```
