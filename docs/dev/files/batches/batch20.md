## Batch 20 — publication admin shell and shared UI

Progress: **99% complete**

This batch adds a real admin publication shell so the operator UI stops being three disconnected pages and becomes one navigable workflow. TanStack Start uses file-based routing under `src/routes`, and layout/root routes render children with `Outlet`, so the right move here is to add a parent `/admin/publication` route that owns the shared navigation and wraps the child pages. After mutations, invalidating route data is the expected refresh pattern. ([TanStack][1])


### 1. `apps/web/src/features/publication/components/PublicationStatusBadge.tsx`

```tsx id="b20badge"
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

### 2. `apps/web/src/features/publication/components/PublicationShell.tsx`

```tsx id="b20shell"
import type { JSX } from 'solid-js'
import { Show } from 'solid-js'
import { Link } from '@tanstack/solid-router'

export function PublicationShell(props: {
  title: string
  subtitle?: string
  backTo?: string
  backLabel?: string
  aside?: JSX.Element
  children: JSX.Element
}) {
  return (
    <main class="mx-auto max-w-6xl space-y-8 p-6">
      <header class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div class="space-y-2">
          <Show when={props.backTo}>
            <Link class="text-sm underline" to={props.backTo!}>
              {props.backLabel ?? 'Back'}
            </Link>
          </Show>
          <h1 class="text-3xl font-semibold">{props.title}</h1>
          <Show when={props.subtitle}>
            <p class="max-w-3xl text-sm opacity-80">{props.subtitle}</p>
          </Show>
        </div>

        <Show when={props.aside}>
          <div class="shrink-0">{props.aside}</div>
        </Show>
      </header>

      {props.children}
    </main>
  )
}
```

---

### 3. `apps/web/src/routes/admin/publication.tsx`

```tsx id="b20layout"
import { Outlet, Link, createFileRoute, useLocation } from '@tanstack/solid-router'

export const Route = createFileRoute('/admin/publication')({
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

---

### 4. `apps/web/src/routes/admin/publication/index.tsx`

Replace with:

```tsx id="b20index"
import { createSignal, For } from 'solid-js'
import { Link, createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  createGazetteIssueAction,
  createOfficialRecordAction,
  getPublicationDashboard,
} from '~/features/publication/publication.server'
import { PublicationShell } from '~/features/publication/components/PublicationShell'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'

export const Route = createFileRoute('/admin/publication/')({
  loader: () => getPublicationDashboard(),
  component: PublicationDashboardPage,
})

function PublicationDashboardPage() {
  const data = Route.useLoaderData()
  const router = useRouter()

  const [creatingRecord, setCreatingRecord] = createSignal(false)
  const [creatingIssue, setCreatingIssue] = createSignal(false)

  return (
    <PublicationShell
      title="Publication Administration"
      subtitle="Manage official records and gazette issues from one operator workflow."
    >
      <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-6">
          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Create Official Record</h2>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setCreatingRecord(true)

                const form = new FormData(event.currentTarget)
                try {
                  await createOfficialRecordAction({
                    data: {
                      recordType: String(form.get('recordType') ?? ''),
                      title: String(form.get('title') ?? ''),
                      summary: String(form.get('summary') ?? '') || undefined,
                      sourceEntityType: String(form.get('sourceEntityType') ?? ''),
                      sourceEntityId: String(form.get('sourceEntityId') ?? ''),
                    },
                  })

                  event.currentTarget.reset()
                  await router.invalidate()
                } finally {
                  setCreatingRecord(false)
                }
              }}
            >
              <div class="grid gap-3 md:grid-cols-2">
                <input
                  class="w-full rounded-xl border px-3 py-2"
                  name="recordType"
                  placeholder="Record type"
                />
                <input
                  class="w-full rounded-xl border px-3 py-2"
                  name="title"
                  placeholder="Title"
                />
              </div>
              <textarea
                class="w-full rounded-xl border px-3 py-2"
                name="summary"
                placeholder="Summary"
                rows={4}
              />
              <div class="grid gap-3 md:grid-cols-2">
                <input
                  class="w-full rounded-xl border px-3 py-2"
                  name="sourceEntityType"
                  placeholder="Source entity type"
                />
                <input
                  class="w-full rounded-xl border px-3 py-2"
                  name="sourceEntityId"
                  placeholder="Source entity id"
                />
              </div>
              <button
                class="rounded-xl border px-4 py-2"
                disabled={creatingRecord()}
                type="submit"
              >
                {creatingRecord() ? 'Creating...' : 'Create Record'}
              </button>
            </form>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Official Records</h2>
            <ul class="space-y-3">
              <For each={data().records}>
                {(record) => (
                  <li class="rounded-xl border p-3">
                    <div class="flex items-start justify-between gap-4">
                      <div class="space-y-1">
                        <Link
                          class="font-medium underline"
                          to="/admin/publication/records/$recordId"
                          params={{ recordId: record.id }}
                        >
                          {record.title}
                        </Link>
                        <div class="text-sm opacity-80">{record.recordType}</div>
                        <div class="text-sm">{record.summary ?? '—'}</div>
                      </div>
                      <PublicationStatusBadge status={record.status} />
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>

        <div class="space-y-6" id="issues">
          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Create Gazette Issue</h2>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setCreatingIssue(true)

                const form = new FormData(event.currentTarget)
                try {
                  await createGazetteIssueAction({
                    data: {
                      issueNumber: String(form.get('issueNumber') ?? '') || undefined,
                      title: String(form.get('title') ?? ''),
                      scheduledFor: String(form.get('scheduledFor') ?? '') || undefined,
                    },
                  })

                  event.currentTarget.reset()
                  await router.invalidate()
                } finally {
                  setCreatingIssue(false)
                }
              }}
            >
              <input
                class="w-full rounded-xl border px-3 py-2"
                name="issueNumber"
                placeholder="Issue number"
              />
              <input
                class="w-full rounded-xl border px-3 py-2"
                name="title"
                placeholder="Title"
              />
              <input
                class="w-full rounded-xl border px-3 py-2"
                name="scheduledFor"
                placeholder="Scheduled for ISO timestamp"
              />
              <button
                class="rounded-xl border px-4 py-2"
                disabled={creatingIssue()}
                type="submit"
              >
                {creatingIssue() ? 'Creating...' : 'Create Issue'}
              </button>
            </form>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Gazette Issues</h2>
            <ul class="space-y-3">
              <For each={data().issues}>
                {(issue) => (
                  <li class="rounded-xl border p-3">
                    <div class="flex items-start justify-between gap-4">
                      <div class="space-y-1">
                        <Link
                          class="font-medium underline"
                          to="/admin/publication/issues/$issueId"
                          params={{ issueId: issue.id }}
                        >
                          {issue.issueNumber ? `${issue.issueNumber} — ${issue.title}` : issue.title}
                        </Link>
                        <div class="text-sm opacity-80">
                          {issue.publishedAt ? `Published at ${issue.publishedAt}` : 'Not published'}
                        </div>
                      </div>
                      <PublicationStatusBadge status={issue.publicationState} />
                    </div>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>
      </section>
    </PublicationShell>
  )
}
```

---

### 5. `apps/web/src/routes/admin/publication/records/$recordId.tsx`

Replace with:

```tsx id="b20recordpage"
import { createSignal, For } from 'solid-js'
import { createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  addGazetteEntryAction,
  createRecordVersionAction,
  getOfficialRecordDetail,
  officializeRecordAction,
} from '~/features/publication/publication.server'
import { PublicationShell } from '~/features/publication/components/PublicationShell'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'

export const Route = createFileRoute('/admin/publication/records/$recordId')({
  loader: ({ params }) =>
    getOfficialRecordDetail({
      data: { recordId: params.recordId },
    }),
  component: OfficialRecordDetailPage,
})

function OfficialRecordDetailPage() {
  const data = Route.useLoaderData()
  const params = Route.useParams()
  const router = useRouter()

  const [savingVersion, setSavingVersion] = createSignal(false)
  const [officializing, setOfficializing] = createSignal(false)
  const [addingToIssue, setAddingToIssue] = createSignal(false)

  return (
    <PublicationShell
      title={data().record.title}
      subtitle={`${data().record.recordType} sourced from ${data().record.sourceEntityType} / ${data().record.sourceEntityId}`}
      backTo="/admin/publication/"
      backLabel="Back to publication dashboard"
      aside={<PublicationStatusBadge status={data().record.status} />}
    >
      <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-6">
          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Record Detail</h2>
            <dl class="grid gap-2 text-sm">
              <div>
                <dt class="font-medium">Summary</dt>
                <dd>{data().record.summary ?? '—'}</dd>
              </div>
              <div>
                <dt class="font-medium">Officialized At</dt>
                <dd>{data().record.officializedAt ?? '—'}</dd>
              </div>
              <div>
                <dt class="font-medium">Created At</dt>
                <dd>{data().record.createdAt}</dd>
              </div>
              <div>
                <dt class="font-medium">Updated At</dt>
                <dd>{data().record.updatedAt}</dd>
              </div>
            </dl>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Versions</h2>
            <ul class="space-y-3">
              <For each={data().versions}>
                {(version) => (
                  <li class="rounded-xl border p-3">
                    <div class="font-medium">Version {version.versionNumber}</div>
                    <div class="text-sm opacity-80">
                      {version.changeSummary ?? 'No change summary'}
                    </div>
                    <pre class="mt-2 overflow-auto whitespace-pre-wrap text-sm">
                      {version.bodyMarkdown}
                    </pre>
                  </li>
                )}
              </For>
            </ul>
          </div>
        </div>

        <div class="space-y-6">
          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Create Version</h2>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setSavingVersion(true)

                const form = new FormData(event.currentTarget)
                try {
                  await createRecordVersionAction({
                    data: {
                      recordId: params().recordId,
                      bodyMarkdown: String(form.get('bodyMarkdown') ?? ''),
                      changeSummary: String(form.get('changeSummary') ?? '') || undefined,
                    },
                  })

                  event.currentTarget.reset()
                  await router.invalidate()
                } finally {
                  setSavingVersion(false)
                }
              }}
            >
              <textarea
                class="w-full rounded-xl border px-3 py-2"
                name="bodyMarkdown"
                rows={12}
                placeholder="# Record text"
              />
              <input
                class="w-full rounded-xl border px-3 py-2"
                name="changeSummary"
                placeholder="Change summary"
              />
              <button class="rounded-xl border px-4 py-2" disabled={savingVersion()} type="submit">
                {savingVersion() ? 'Saving...' : 'Create Version'}
              </button>
            </form>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Officialize Record</h2>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setOfficializing(true)

                const form = new FormData(event.currentTarget)
                try {
                  await officializeRecordAction({
                    data: {
                      recordId: params().recordId,
                      note: String(form.get('note') ?? '') || undefined,
                    },
                  })

                  await router.invalidate()
                } finally {
                  setOfficializing(false)
                }
              }}
            >
              <input
                class="w-full rounded-xl border px-3 py-2"
                name="note"
                placeholder="Officialization note"
              />
              <button class="rounded-xl border px-4 py-2" disabled={officializing()} type="submit">
                {officializing() ? 'Officializing...' : 'Officialize Record'}
              </button>
            </form>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Add to Gazette Issue</h2>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setAddingToIssue(true)

                const form = new FormData(event.currentTarget)
                try {
                  await addGazetteEntryAction({
                    data: {
                      issueId: String(form.get('issueId') ?? ''),
                      officialRecordId: params().recordId,
                    },
                  })

                  await router.invalidate()
                } finally {
                  setAddingToIssue(false)
                }
              }}
            >
              <select class="w-full rounded-xl border px-3 py-2" name="issueId">
                <For each={data().issues}>
                  {(issue) => (
                    <option value={issue.id}>
                      {issue.issueNumber ? `${issue.issueNumber} — ${issue.title}` : issue.title}
                    </option>
                  )}
                </For>
              </select>

              <button class="rounded-xl border px-4 py-2" disabled={addingToIssue()} type="submit">
                {addingToIssue() ? 'Adding...' : 'Add to Gazette Issue'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </PublicationShell>
  )
}
```

---

### 6. `apps/web/src/routes/admin/publication/issues/$issueId.tsx`

Replace with:

```tsx id="b20issuepage"
import { createSignal, For } from 'solid-js'
import { createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  addGazetteEntryAction,
  getGazetteIssueDetail,
  publishGazetteIssueAction,
} from '~/features/publication/publication.server'
import { PublicationShell } from '~/features/publication/components/PublicationShell'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'

export const Route = createFileRoute('/admin/publication/issues/$issueId')({
  loader: ({ params }) =>
    getGazetteIssueDetail({
      data: { issueId: params.issueId },
    }),
  component: GazetteIssueDetailPage,
})

function GazetteIssueDetailPage() {
  const data = Route.useLoaderData()
  const params = Route.useParams()
  const router = useRouter()

  const [addingEntry, setAddingEntry] = createSignal(false)
  const [publishing, setPublishing] = createSignal(false)

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
            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setAddingEntry(true)

                const form = new FormData(event.currentTarget)
                try {
                  await addGazetteEntryAction({
                    data: {
                      issueId: params().issueId,
                      officialRecordId: String(form.get('officialRecordId') ?? ''),
                    },
                  })

                  await router.invalidate()
                } finally {
                  setAddingEntry(false)
                }
              }}
            >
              <select class="w-full rounded-xl border px-3 py-2" name="officialRecordId">
                <For each={data().officialRecords}>
                  {(record) => (
                    <option value={record.id}>
                      {record.title} ({record.status})
                    </option>
                  )}
                </For>
              </select>

              <button class="rounded-xl border px-4 py-2" disabled={addingEntry()} type="submit">
                {addingEntry() ? 'Adding...' : 'Add Record'}
              </button>
            </form>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Publish Issue</h2>
            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setPublishing(true)

                const form = new FormData(event.currentTarget)
                try {
                  await publishGazetteIssueAction({
                    data: {
                      issueId: params().issueId,
                      note: String(form.get('note') ?? '') || undefined,
                    },
                  })

                  await router.invalidate()
                } finally {
                  setPublishing(false)
                }
              }}
            >
              <input
                class="w-full rounded-xl border px-3 py-2"
                name="note"
                placeholder="Publication note"
              />
              <button class="rounded-xl border px-4 py-2" disabled={publishing()} type="submit">
                {publishing() ? 'Publishing...' : 'Publish Issue'}
              </button>
            </form>
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

At this point, the next work is not “more core implementation.” It is the real-world stabilization pass: local typecheck, route generation, wiring into your actual admin nav, and replacing placeholder styling/components with your design system.

[1]: https://tanstack.com/start/latest/docs/framework/solid/guide/routing "Routing | TanStack Start Solid Docs"
