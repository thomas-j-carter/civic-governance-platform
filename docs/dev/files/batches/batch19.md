## Batch 19 — admin publication UI bridge

Progress: **99% complete**

This batch bridges the publication backend into a TanStack Start + Solid admin workflow. TanStack Start Solid uses file routes under `src/routes`, routes are defined with `createFileRoute`, and server functions are defined with `createServerFn`. Server functions can read request headers with `getRequestHeader`, and for mutations the docs recommend invalidating route data afterward. Server-side code can read normal environment variables, while client code only gets `VITE_`-prefixed variables. ([TanStack][1])


### 1. `apps/web/src/lib/gov-client.server.ts`

```ts
import { createGovClient } from '@ardtire/gov-client'
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

export function getServerGovClient() {
  const authorizationHeader =
    getRequestHeader('Authorization') ?? getRequestHeader('authorization')

  const token = extractBearerToken(authorizationHeader)

  const baseUrl =
    process.env.GOV_API_BASE_URL ??
    process.env.VITE_GOV_API_BASE_URL ??
    'http://localhost:3002'

  return createGovClient({
    baseUrl,
    getToken: async () => token,
  } as never)
}
```

---

### 2. `apps/web/src/features/publication/publication.server.ts`

```ts
import { z } from 'zod'
import { createServerFn } from '@tanstack/solid-start'
import { getServerGovClient } from '~/lib/gov-client.server'

const RecordIdInput = z.object({
  recordId: z.string().min(1),
})

const IssueIdInput = z.object({
  issueId: z.string().min(1),
})

const CreateOfficialRecordInput = z.object({
  recordType: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().optional(),
  sourceEntityType: z.string().min(1),
  sourceEntityId: z.string().min(1),
})

const CreateRecordVersionInput = z.object({
  recordId: z.string().min(1),
  bodyMarkdown: z.string().min(1),
  changeSummary: z.string().optional(),
})

const OfficializeRecordInput = z.object({
  recordId: z.string().min(1),
  note: z.string().optional(),
})

const CreateGazetteIssueInput = z.object({
  issueNumber: z.string().optional(),
  title: z.string().min(1),
  scheduledFor: z.string().optional(),
})

const AddGazetteEntryInput = z.object({
  issueId: z.string().min(1),
  officialRecordId: z.string().min(1),
  publicationOrder: z.number().int().positive().optional(),
})

const PublishGazetteIssueInput = z.object({
  issueId: z.string().min(1),
  note: z.string().optional(),
})

export const getPublicationDashboard = createServerFn({ method: 'GET' }).handler(async () => {
  const gov = getServerGovClient()

  const [records, issues] = await Promise.all([
    gov.officialRecords.list(),
    gov.gazette.listIssues(),
  ])

  return {
    records,
    issues,
  }
})

export const getOfficialRecordDetail = createServerFn({ method: 'GET' })
  .inputValidator((data) => RecordIdInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()

    const [record, versions, issues] = await Promise.all([
      gov.officialRecords.read(data.recordId),
      gov.officialRecords.listVersions(data.recordId),
      gov.gazette.listIssues(),
    ])

    return {
      record,
      versions,
      issues,
    }
  })

export const createOfficialRecordAction = createServerFn({ method: 'POST' })
  .inputValidator((data) => CreateOfficialRecordInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()
    return gov.officialRecords.create(data)
  })

export const createRecordVersionAction = createServerFn({ method: 'POST' })
  .inputValidator((data) => CreateRecordVersionInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()
    return gov.officialRecords.createVersion(data.recordId, {
      bodyMarkdown: data.bodyMarkdown,
      changeSummary: data.changeSummary,
    })
  })

export const officializeRecordAction = createServerFn({ method: 'POST' })
  .inputValidator((data) => OfficializeRecordInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()
    return gov.officialRecords.officialize(data.recordId, {
      note: data.note,
    })
  })

export const getGazetteIssueDetail = createServerFn({ method: 'GET' })
  .inputValidator((data) => IssueIdInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()

    const [issue, entries, records] = await Promise.all([
      gov.gazette.readIssue(data.issueId),
      gov.gazette.listEntries(data.issueId),
      gov.officialRecords.list(),
    ])

    return {
      issue,
      entries,
      officialRecords: records,
    }
  })

export const createGazetteIssueAction = createServerFn({ method: 'POST' })
  .inputValidator((data) => CreateGazetteIssueInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()
    return gov.gazette.createIssue(data)
  })

export const addGazetteEntryAction = createServerFn({ method: 'POST' })
  .inputValidator((data) => AddGazetteEntryInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()
    return gov.gazette.addEntry(data.issueId, {
      officialRecordId: data.officialRecordId,
      publicationOrder: data.publicationOrder,
    })
  })

export const publishGazetteIssueAction = createServerFn({ method: 'POST' })
  .inputValidator((data) => PublishGazetteIssueInput.parse(data))
  .handler(async ({ data }) => {
    const gov = getServerGovClient()
    return gov.gazette.publishIssue(data.issueId, {
      note: data.note,
    })
  })
```

---

### 3. `apps/web/src/routes/admin/publication/index.tsx`

```tsx
import { createSignal, For } from 'solid-js'
import { Link, createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  createGazetteIssueAction,
  createOfficialRecordAction,
  getPublicationDashboard,
} from '~/features/publication/publication.server'

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
    <main class="mx-auto max-w-6xl space-y-8 p-6">
      <header class="space-y-2">
        <h1 class="text-3xl font-semibold">Publication Administration</h1>
        <p class="text-sm opacity-80">
          Manage official records and gazette issues from the same admin surface.
        </p>
      </header>

      <section class="grid gap-6 md:grid-cols-2">
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
            <textarea
              class="w-full rounded-xl border px-3 py-2"
              name="summary"
              placeholder="Summary"
              rows={4}
            />
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
      </section>

      <section class="grid gap-6 md:grid-cols-2">
        <div class="rounded-2xl border p-4">
          <h2 class="mb-4 text-xl font-medium">Official Records</h2>
          <ul class="space-y-2">
            <For each={data().records}>
              {(record) => (
                <li class="rounded-xl border p-3">
                  <Link
                    class="font-medium underline"
                    to="/admin/publication/records/$recordId"
                    params={{ recordId: record.id }}
                  >
                    {record.title}
                  </Link>
                  <div class="text-sm opacity-80">{record.recordType}</div>
                  <div class="text-sm">{record.status}</div>
                </li>
              )}
            </For>
          </ul>
        </div>

        <div class="rounded-2xl border p-4">
          <h2 class="mb-4 text-xl font-medium">Gazette Issues</h2>
          <ul class="space-y-2">
            <For each={data().issues}>
              {(issue) => (
                <li class="rounded-xl border p-3">
                  <Link
                    class="font-medium underline"
                    to="/admin/publication/issues/$issueId"
                    params={{ issueId: issue.id }}
                  >
                    {issue.issueNumber ? `${issue.issueNumber} — ${issue.title}` : issue.title}
                  </Link>
                  <div class="text-sm">{issue.publicationState}</div>
                </li>
              )}
            </For>
          </ul>
        </div>
      </section>
    </main>
  )
}
```

---

### 4. `apps/web/src/routes/admin/publication/records/$recordId.tsx`

```tsx
import { createSignal, For } from 'solid-js'
import { Link, createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  addGazetteEntryAction,
  createRecordVersionAction,
  getOfficialRecordDetail,
  officializeRecordAction,
} from '~/features/publication/publication.server'

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
    <main class="mx-auto max-w-5xl space-y-8 p-6">
      <div class="space-y-2">
        <Link class="underline" to="/admin/publication/">
          Back to publication dashboard
        </Link>
        <h1 class="text-3xl font-semibold">{data().record.title}</h1>
        <div class="text-sm opacity-80">
          {data().record.recordType} · {data().record.status}
        </div>
      </div>

      <section class="rounded-2xl border p-4">
        <h2 class="mb-4 text-xl font-medium">Record Detail</h2>
        <dl class="grid gap-2 text-sm">
          <div>
            <dt class="font-medium">Source</dt>
            <dd>
              {data().record.sourceEntityType} / {data().record.sourceEntityId}
            </dd>
          </div>
          <div>
            <dt class="font-medium">Summary</dt>
            <dd>{data().record.summary ?? '—'}</dd>
          </div>
          <div>
            <dt class="font-medium">Officialized At</dt>
            <dd>{data().record.officializedAt ?? '—'}</dd>
          </div>
        </dl>
      </section>

      <section class="grid gap-6 md:grid-cols-2">
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

        <div class="rounded-2xl border p-4 space-y-6">
          <div>
            <h2 class="mb-4 text-xl font-medium">Officialize</h2>
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

          <div>
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

      <section class="rounded-2xl border p-4">
        <h2 class="mb-4 text-xl font-medium">Versions</h2>
        <ul class="space-y-3">
          <For each={data().versions}>
            {(version) => (
              <li class="rounded-xl border p-3">
                <div class="font-medium">Version {version.versionNumber}</div>
                <div class="text-sm opacity-80">{version.changeSummary ?? 'No change summary'}</div>
                <pre class="mt-2 overflow-auto whitespace-pre-wrap text-sm">
                  {version.bodyMarkdown}
                </pre>
              </li>
            )}
          </For>
        </ul>
      </section>
    </main>
  )
}
```

---

### 5. `apps/web/src/routes/admin/publication/issues/$issueId.tsx`

```tsx
import { createSignal, For } from 'solid-js'
import { Link, createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  addGazetteEntryAction,
  getGazetteIssueDetail,
  publishGazetteIssueAction,
} from '~/features/publication/publication.server'

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
    <main class="mx-auto max-w-5xl space-y-8 p-6">
      <div class="space-y-2">
        <Link class="underline" to="/admin/publication/">
          Back to publication dashboard
        </Link>
        <h1 class="text-3xl font-semibold">{data().issue.title}</h1>
        <div class="text-sm opacity-80">
          {data().issue.issueNumber ? `${data().issue.issueNumber} · ` : ''}
          {data().issue.publicationState}
        </div>
      </div>

      <section class="grid gap-6 md:grid-cols-2">
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
      </section>

      <section class="rounded-2xl border p-4">
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
      </section>
    </main>
  )
}
```

This is the point where the next work stops being “generate more backend” and becomes “wire and stabilize the operator UI against the generated APIs.” The TanStack Start pieces above follow the official routing, server-function, request-header, invalidation, and environment-variable patterns. ([TanStack][1])

[1]: https://tanstack.com/start/latest/docs/framework/solid/guide/routing?utm_source=chatgpt.com "Routing | TanStack Start Solid Docs"
