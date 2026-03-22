## Batch 21 — operator UX hardening

Progress: **99% complete**

This batch stays within the same TanStack file-route/layout model you already have, where nested routes render through `Outlet`, and it keeps the server-function + route invalidation mutation pattern for admin actions. ([TanStack][1])


### 1. `apps/web/src/features/publication/components/PublicationActionNotice.tsx`

```tsx id="b21notice"
import { Show } from 'solid-js'

function toneClasses(tone: 'success' | 'error' | 'info') {
  switch (tone) {
    case 'success':
      return 'border-green-300 bg-green-50 text-green-900'
    case 'error':
      return 'border-red-300 bg-red-50 text-red-900'
    default:
      return 'border-slate-300 bg-slate-50 text-slate-900'
  }
}

export function PublicationActionNotice(props: {
  tone: 'success' | 'error' | 'info'
  message?: string | null
}) {
  return (
    <Show when={props.message}>
      <div class={`rounded-xl border px-3 py-2 text-sm ${toneClasses(props.tone)}`}>
        {props.message}
      </div>
    </Show>
  )
}
```

---

### 2. `apps/web/src/features/publication/components/PublicationSummaryCards.tsx`

```tsx id="b21summary"
import { createMemo } from 'solid-js'

export function PublicationSummaryCards(props: {
  records: Array<{ status: string }>
  issues: Array<{ publicationState: string }>
}) {
  const summary = createMemo(() => {
    const records = props.records
    const issues = props.issues

    const draftRecords = records.filter((item) => item.status === 'DRAFT').length
    const officialRecords = records.filter((item) => item.status === 'OFFICIAL').length
    const publishedRecords = records.filter((item) => item.status === 'PUBLISHED').length

    const draftIssues = issues.filter((item) => item.publicationState === 'DRAFT').length
    const scheduledIssues = issues.filter((item) => item.publicationState === 'SCHEDULED').length
    const publishedIssues = issues.filter((item) => item.publicationState === 'PUBLISHED').length

    return {
      draftRecords,
      officialRecords,
      publishedRecords,
      draftIssues,
      scheduledIssues,
      publishedIssues,
    }
  })

  function Card(props: { label: string; value: number }) {
    return (
      <div class="rounded-2xl border p-4">
        <div class="text-sm opacity-80">{props.label}</div>
        <div class="mt-2 text-2xl font-semibold">{props.value}</div>
      </div>
    )
  }

  return (
    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
      <Card label="Draft Records" value={summary().draftRecords} />
      <Card label="Official Records" value={summary().officialRecords} />
      <Card label="Published Records" value={summary().publishedRecords} />
      <Card label="Draft Issues" value={summary().draftIssues} />
      <Card label="Scheduled Issues" value={summary().scheduledIssues} />
      <Card label="Published Issues" value={summary().publishedIssues} />
    </section>
  )
}
```

---

### 3. `apps/web/src/routes/admin/publication/index.tsx`

Replace with:

```tsx id="b21index"
import { createSignal, For } from 'solid-js'
import { Link, createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  createGazetteIssueAction,
  createOfficialRecordAction,
  getPublicationDashboard,
} from '~/features/publication/publication.server'
import { PublicationShell } from '~/features/publication/components/PublicationShell'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'
import { PublicationActionNotice } from '~/features/publication/components/PublicationActionNotice'
import { PublicationSummaryCards } from '~/features/publication/components/PublicationSummaryCards'

export const Route = createFileRoute('/admin/publication/')({
  loader: () => getPublicationDashboard(),
  component: PublicationDashboardPage,
})

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while performing that action.'
}

function PublicationDashboardPage() {
  const data = Route.useLoaderData()
  const router = useRouter()

  const [creatingRecord, setCreatingRecord] = createSignal(false)
  const [creatingIssue, setCreatingIssue] = createSignal(false)

  const [recordNotice, setRecordNotice] = createSignal<string | null>(null)
  const [recordError, setRecordError] = createSignal<string | null>(null)

  const [issueNotice, setIssueNotice] = createSignal<string | null>(null)
  const [issueError, setIssueError] = createSignal<string | null>(null)

  return (
    <PublicationShell
      title="Publication Administration"
      subtitle="Manage official records and gazette issues from one operator workflow."
    >
      <PublicationSummaryCards records={data().records} issues={data().issues} />

      <section class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="space-y-6">
          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Create Official Record</h2>

            <div class="mb-4 space-y-2">
              <PublicationActionNotice tone="success" message={recordNotice()} />
              <PublicationActionNotice tone="error" message={recordError()} />
            </div>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setCreatingRecord(true)
                setRecordNotice(null)
                setRecordError(null)

                const form = new FormData(event.currentTarget)

                try {
                  const created = await createOfficialRecordAction({
                    data: {
                      recordType: String(form.get('recordType') ?? ''),
                      title: String(form.get('title') ?? ''),
                      summary: String(form.get('summary') ?? '') || undefined,
                      sourceEntityType: String(form.get('sourceEntityType') ?? ''),
                      sourceEntityId: String(form.get('sourceEntityId') ?? ''),
                    },
                  })

                  setRecordNotice(`Created official record "${created.title}".`)
                  event.currentTarget.reset()
                  await router.invalidate()
                } catch (error) {
                  setRecordError(getErrorMessage(error))
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

            <div class="mb-4 space-y-2">
              <PublicationActionNotice tone="success" message={issueNotice()} />
              <PublicationActionNotice tone="error" message={issueError()} />
            </div>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setCreatingIssue(true)
                setIssueNotice(null)
                setIssueError(null)

                const form = new FormData(event.currentTarget)
                try {
                  const created = await createGazetteIssueAction({
                    data: {
                      issueNumber: String(form.get('issueNumber') ?? '') || undefined,
                      title: String(form.get('title') ?? ''),
                      scheduledFor: String(form.get('scheduledFor') ?? '') || undefined,
                    },
                  })

                  setIssueNotice(`Created gazette issue "${created.title}".`)
                  event.currentTarget.reset()
                  await router.invalidate()
                } catch (error) {
                  setIssueError(getErrorMessage(error))
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

### 4. `apps/web/src/routes/admin/publication/records/$recordId.tsx`

Replace with:

```tsx id="b21record"
import { createMemo, createSignal, For } from 'solid-js'
import { createFileRoute, useRouter } from '@tanstack/solid-router'
import {
  addGazetteEntryAction,
  createRecordVersionAction,
  getOfficialRecordDetail,
  officializeRecordAction,
} from '~/features/publication/publication.server'
import { PublicationShell } from '~/features/publication/components/PublicationShell'
import { PublicationStatusBadge } from '~/features/publication/components/PublicationStatusBadge'
import { PublicationActionNotice } from '~/features/publication/components/PublicationActionNotice'

export const Route = createFileRoute('/admin/publication/records/$recordId')({
  loader: ({ params }) =>
    getOfficialRecordDetail({
      data: { recordId: params.recordId },
    }),
  component: OfficialRecordDetailPage,
})

function getErrorMessage(error: unknown) {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Something went wrong while performing that action.'
}

function OfficialRecordDetailPage() {
  const data = Route.useLoaderData()
  const params = Route.useParams()
  const router = useRouter()

  const [savingVersion, setSavingVersion] = createSignal(false)
  const [officializing, setOfficializing] = createSignal(false)
  const [addingToIssue, setAddingToIssue] = createSignal(false)

  const [versionNotice, setVersionNotice] = createSignal<string | null>(null)
  const [versionError, setVersionError] = createSignal<string | null>(null)

  const [officializeNotice, setOfficializeNotice] = createSignal<string | null>(null)
  const [officializeError, setOfficializeError] = createSignal<string | null>(null)

  const [issueNotice, setIssueNotice] = createSignal<string | null>(null)
  const [issueError, setIssueError] = createSignal<string | null>(null)

  const canOfficialize = createMemo(() => {
    const status = data().record.status
    return data().versions.length > 0 && status !== 'OFFICIAL' && status !== 'PUBLISHED'
  })

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

            <div class="mb-4 space-y-2">
              <PublicationActionNotice tone="success" message={versionNotice()} />
              <PublicationActionNotice tone="error" message={versionError()} />
            </div>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setSavingVersion(true)
                setVersionNotice(null)
                setVersionError(null)

                const form = new FormData(event.currentTarget)
                try {
                  const created = await createRecordVersionAction({
                    data: {
                      recordId: params().recordId,
                      bodyMarkdown: String(form.get('bodyMarkdown') ?? ''),
                      changeSummary: String(form.get('changeSummary') ?? '') || undefined,
                    },
                  })

                  setVersionNotice(`Created version ${created.versionNumber}.`)
                  event.currentTarget.reset()
                  await router.invalidate()
                } catch (error) {
                  setVersionError(getErrorMessage(error))
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

            <div class="mb-4 space-y-2">
              <PublicationActionNotice tone="success" message={officializeNotice()} />
              <PublicationActionNotice tone="error" message={officializeError()} />
            </div>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setOfficializing(true)
                setOfficializeNotice(null)
                setOfficializeError(null)

                const form = new FormData(event.currentTarget)
                try {
                  const result = await officializeRecordAction({
                    data: {
                      recordId: params().recordId,
                      note: String(form.get('note') ?? '') || undefined,
                    },
                  })

                  setOfficializeNotice(`Record "${result.title}" is now ${result.status}.`)
                  await router.invalidate()
                } catch (error) {
                  setOfficializeError(getErrorMessage(error))
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
              <button
                class="rounded-xl border px-4 py-2"
                disabled={officializing() || !canOfficialize()}
                type="submit"
              >
                {officializing() ? 'Officializing...' : 'Officialize Record'}
              </button>
            </form>

            <p class="mt-3 text-xs opacity-70">
              Officialization requires at least one version and is unavailable once the record is
              already official or published.
            </p>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Add to Gazette Issue</h2>

            <div class="mb-4 space-y-2">
              <PublicationActionNotice tone="success" message={issueNotice()} />
              <PublicationActionNotice tone="error" message={issueError()} />
            </div>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setAddingToIssue(true)
                setIssueNotice(null)
                setIssueError(null)

                const form = new FormData(event.currentTarget)
                try {
                  await addGazetteEntryAction({
                    data: {
                      issueId: String(form.get('issueId') ?? ''),
                      officialRecordId: params().recordId,
                    },
                  })

                  setIssueNotice('Record added to gazette issue.')
                  await router.invalidate()
                } catch (error) {
                  setIssueError(getErrorMessage(error))
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

### 5. `apps/web/src/routes/admin/publication/issues/$issueId.tsx`

Replace with:

```tsx id="b21issue"
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
  const [publishing, setPublishing] = createSignal(false)

  const [entryNotice, setEntryNotice] = createSignal<string | null>(null)
  const [entryError, setEntryError] = createSignal<string | null>(null)

  const [publishNotice, setPublishNotice] = createSignal<string | null>(null)
  const [publishError, setPublishError] = createSignal<string | null>(null)

  const eligibleRecords = createMemo(() =>
    data().officialRecords.filter(
      (record) => record.status === 'OFFICIAL' || record.status === 'PUBLISHED',
    ),
  )

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
              <select class="w-full rounded-xl border px-3 py-2" name="officialRecordId">
                <For each={eligibleRecords()}>
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

            <p class="mt-3 text-xs opacity-70">
              Only official or already-published records are shown as eligible for gazette entry.
            </p>
          </div>

          <div class="rounded-2xl border p-4">
            <h2 class="mb-4 text-xl font-medium">Publish Issue</h2>

            <div class="mb-4 space-y-2">
              <PublicationActionNotice tone="success" message={publishNotice()} />
              <PublicationActionNotice tone="error" message={publishError()} />
            </div>

            <form
              class="space-y-3"
              onSubmit={async (event) => {
                event.preventDefault()
                setPublishing(true)
                setPublishNotice(null)
                setPublishError(null)

                const form = new FormData(event.currentTarget)
                try {
                  const result = await publishGazetteIssueAction({
                    data: {
                      issueId: params().issueId,
                      note: String(form.get('note') ?? '') || undefined,
                    },
                  })

                  setPublishNotice(`Gazette issue "${result.title}" published.`)
                  await router.invalidate()
                } catch (error) {
                  setPublishError(getErrorMessage(error))
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

This gets the operator-facing publication UI to a much more usable state: shared shell, clear status badges, immediate mutation feedback, and simple eligibility filtering that aligns the UI with the backend rules. The next practical step is no longer generating more screens. It is running typecheck, resolving any route-tree drift, and wiring these publication routes into your real admin navigation and auth boundary.

[1]: https://tanstack.com/router/v1/docs/framework/solid/guide/outlets?utm_source=chatgpt.com "Outlets | TanStack Router Solid Docs"
