## Batch 24 — global admin navigation and publish confirmation

Progress: **99% complete**

This batch does the next two practical operator-safety tasks:

* gives admin pages a shared top-level navigation shell
* adds a deliberate confirmation step before gazette publication

### 1. `apps/web/src/features/admin/components/AdminSectionNav.tsx`

```tsx
import { For } from 'solid-js'
import { Link, useLocation } from '@tanstack/solid-router'

export interface AdminSectionNavItem {
  label: string
  to: string
  description?: string
}

function itemClasses(active: boolean) {
  return active
    ? 'rounded-2xl border px-4 py-3'
    : 'rounded-2xl border border-transparent px-4 py-3 opacity-80 hover:border-inherit hover:opacity-100'
}

export function AdminSectionNav(props: {
  title?: string
  items: AdminSectionNavItem[]
}) {
  const location = useLocation()

  const isActive = (to: string) => {
    const pathname = location().pathname
    return pathname === to || pathname.startsWith(`${to}/`)
  }

  return (
    <section class="rounded-2xl border p-4">
      <div class="mb-3 text-sm font-medium opacity-80">
        {props.title ?? 'Administration'}
      </div>

      <nav class="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
        <For each={props.items}>
          {(item) => (
            <Link class={itemClasses(isActive(item.to))} to={item.to}>
              <div class="font-medium">{item.label}</div>
              <div class="mt-1 text-sm opacity-75">{item.description ?? ''}</div>
            </Link>
          )}
        </For>
      </nav>
    </section>
  )
}
```

---

### 2. `apps/web/src/routes/admin.tsx`

```tsx
import { Outlet, createFileRoute } from '@tanstack/solid-router'
import { AdminSectionNav } from '~/features/admin/components/AdminSectionNav'

export const Route = createFileRoute('/admin')({
  component: AdminLayout,
})

function AdminLayout() {
  return (
    <div class="min-h-screen">
      <div class="mx-auto max-w-7xl p-6 space-y-6">
        <AdminSectionNav
          items={[
            {
              label: 'Publication',
              to: '/admin/publication',
              description: 'Official records, gazette issues, and publication workflow',
            },
            {
              label: 'Governance',
              to: '/admin/governance',
              description: 'Bodies, offices, and governance operations',
            },
            {
              label: 'Membership',
              to: '/admin/membership',
              description: 'Members, applications, and reviews',
            },
            {
              label: 'System',
              to: '/admin/system',
              description: 'Diagnostics, jobs, and internal administration',
            },
          ]}
        />

        <Outlet />
      </div>
    </div>
  )
}
```

---

### 3. `apps/web/src/features/publication/components/PublishIssueConfirm.tsx`

```tsx
import { Show, createMemo, createSignal } from 'solid-js'
import { PublicationActionNotice } from './PublicationActionNotice'

export function PublishIssueConfirm(props: {
  issueTitle: string
  issueNumber?: string
  disabled?: boolean
  onConfirm: (note?: string) => Promise<void>
}) {
  const [confirmText, setConfirmText] = createSignal('')
  const [note, setNote] = createSignal('')
  const [submitting, setSubmitting] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)

  const requiredText = createMemo(() => props.issueNumber || 'PUBLISH')

  const canPublish = createMemo(() => {
    return !props.disabled && confirmText().trim() === requiredText()
  })

  return (
    <div class="space-y-4">
      <div class="rounded-xl border p-3 text-sm">
        <div class="font-medium">Confirmation required</div>
        <p class="mt-2 opacity-80">
          To publish this issue, type <span class="font-semibold">{requiredText()}</span> below.
          This action is intended to be deliberate.
        </p>
      </div>

      <PublicationActionNotice tone="error" message={error()} />

      <div class="space-y-3">
        <input
          class="w-full rounded-xl border px-3 py-2"
          value={confirmText()}
          onInput={(event) => setConfirmText(event.currentTarget.value)}
          placeholder={`Type ${requiredText()} to confirm`}
        />

        <input
          class="w-full rounded-xl border px-3 py-2"
          value={note()}
          onInput={(event) => setNote(event.currentTarget.value)}
          placeholder="Publication note"
        />

        <button
          class="rounded-xl border px-4 py-2"
          disabled={!canPublish() || submitting()}
          type="button"
          onClick={async () => {
            setSubmitting(true)
            setError(null)

            try {
              await props.onConfirm(note().trim() || undefined)
              setConfirmText('')
              setNote('')
            } catch (err) {
              setError(err instanceof Error ? err.message : 'Failed to publish issue.')
            } finally {
              setSubmitting(false)
            }
          }}
        >
          <Show when={!submitting()} fallback="Publishing...">
            Publish Issue
          </Show>
        </button>
      </div>
    </div>
  )
}
```

---

### 4. `apps/web/src/routes/admin/publication.tsx`

Replace with:

```tsx
import { Outlet, createFileRoute, redirect, useLocation } from '@tanstack/solid-router'
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

function PublicationAdminLayout() {
  const location = useLocation()
  const context = Route.useRouteContext()

  const actor = () => context().access.actor
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

### 5. `apps/web/src/routes/admin/publication/issues/$issueId.tsx`

Replace with:

```tsx
import { createMemo, createSignal, For } from 'solid-js'
import { createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  addGazetteEntryAction,
  getGazetteIssueDetail,
  publishGazetteIssueAction,
} from '~/features/publication/publication.server'
import { PublicationShell } from '~/features/publication/components/PublicationShell'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'
import { PublicationActionNotice } from '~/features/publication/components/PublicationActionNotice'
import { PublishIssueConfirm } from '~/features/publication/components/PublishIssueConfirm'

export const Route = createFileRoute('/admin/publication/issues/$issueId')({
  loader: ({ params }) =>
    getGazetteIssueDetail({
      data: { issueId: params.issueId },
    }),
  component: GazetteIssueDetailPage,
})

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while performing that action.'
}

function GazetteIssueDetailPage() {
  const data = Route.useLoaderData()
  const params = Route.useParams()
  const router = useRouter()

  const [addingEntry, setAddingEntry] = createSignal(false)
  const [entryNotice, setEntryNotice] = createSignal<string | null>(null)
  const [entryError, setEntryError] = createSignal<string | null>(null)
  const [publishNotice, setPublishNotice] = createSignal<string | null>(null)

  const eligibleRecords = createMemo(() =>
    data().officialRecords.filter(
      (record) => record.status === 'OFFICIAL' || record.status === 'PUBLISHED',
    ),
  )

  const isPublished = createMemo(() => data().issue.publicationState === 'PUBLISHED')

  return (
    <PublicationShell
      title={data().issue.title}
      subtitle={data().issue.issueNumber ? `Issue ${data().issue.issueNumber}` : 'Gazette issue'}
      backTo="/admin/publication/"
      backLabel="Back to publication dashboard"
      aside={<PublicationStatusBadge status={data().issue.publicationState} />}
    >
      <section class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div class="space-y-6">
          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Issue Detail</h2>
            <dl class="grid gap-2 text-sm">
              <div>
                <dt class="font-medium">Issue Number</dt>
                <dd>{data().issue.issueNumber ?? '—'}</dd>
              </div>
              <div>
                <dt class="font-medium">Scheduled For</dt>
                <dd>{data().issue.scheduledFor ?? '—'}</dd>
              </div>
              <div>
                <dt class="font-medium">Published At</dt>
                <dd>{data().issue.publishedAt ?? '—'}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Add Official Record</h2>

            <div class="mb-4 space-y-2">
              <PublicationActionNotice tone="success" message={entryNotice()} />
              <PublicationActionNotice tone="error" message={entryError()} />
            </div>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setAddingEntry(true)
                setEntryNotice(null)
                setEntryError(null)

                const form = new FormData(event.currentTarget)
                try {
                  await addGazetteEntryAction({
                    data: {
                      issueId: params().issueId,
                      officialRecordId: String(form.get('officialRecordId') ?? ''),
                    },
                  })

                  setEntryNotice('Official record added to gazette issue.')
                  await router.invalidate()
                } catch (error) {
                  setEntryError(getErrorMessage(error))
                } finally {
                  setAddingEntry(false)
                }
              }}
            >
              <select
                class="w-full rounded-xl border px-3 py-2"
                name="officialRecordId"
                disabled={isPublished()}
              >
                <For each={eligibleRecords()}>
                  {(record) => (
                    <option value={record.id}>
                      {record.title} ({record.status})
                    </option>
                  )}
                </For>
              </select>

              <button
                class="rounded-xl border px-4 py-2"
                disabled={addingEntry() || isPublished()}
                type="submit"
              >
                {addingEntry() ? 'Adding...' : 'Add Record'}
              </button>
            </form>

            <p class="mt-3 text-xs opacity-70">
              Only official or already-published records are shown as eligible for gazette entry.
            </p>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Publish Issue</h2>

            <PublicationActionNotice tone="success" message={publishNotice()} />

            <PublishIssueConfirm
              issueTitle={data().issue.title}
              issueNumber={data().issue.issueNumber}
              disabled={isPublished()}
              onConfirm={async (note) => {
                const result = await publishGazetteIssueAction({
                  data: {
                    issueId: params().issueId,
                    note,
                  },
                })

                setPublishNotice(`Gazette issue "${result.title}" published.`)
                await router.invalidate()
              }}
            />
          </div>
        </div>

        <div class="rounded-2xl border p-4">
          <h2 class="mb-4 text-xl font-medium">Entries</h2>
          <ul class="space-y-3">
            <For each={data().entries}>
              {(entry) => (
                <li class="rounded-xl border p-3">
                  <div class="font-medium">{entry.titleSnapshot}</div>
                  <div class="text-sm opacity-80">
                    Record: {entry.officialRecordId} · Order: {entry.publicationOrder}
                  </div>
                  <div class="text-sm">{entry.summarySnapshot ?? '—'}</div>
                </li>
              )}
            </For>
          </ul>
        </div>
      </section>
    </PublicationShell>
  )
}
```

This batch gets the admin publication area much closer to something you would actually hand to operators: a global admin shell, a real sign-in redirect target, surfaced grants, and a safer publish action. The next practical batch is a repo stabilization batch: add route/component tests for the admin publication shell and then produce one final deployment-readiness checklist tied to actual commands.
