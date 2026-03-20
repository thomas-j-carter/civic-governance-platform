import { Show, createSignal, onMount } from 'solid-js'
import type { GovernanceBodyDto, OfficeDto } from '@ardtire/contracts'
import { createFileRoute } from '@tanstack/solid-router'
import {
  createOffice,
  listGovernanceBodiesAdmin,
  listOfficesAdmin,
  updateOffice,
} from '../../features/governance-bodies/server'

export const Route = createFileRoute('/admin/offices')({
  component: AdminOfficesPage,
})

function AdminOfficesPage() {
  const [items, setItems] = createSignal<OfficeDto[]>([])
  const [bodies, setBodies] = createSignal<GovernanceBodyDto[]>([])
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [message, setMessage] = createSignal<string | null>(null)

  const [bodyId, setBodyId] = createSignal('')
  const [slug, setSlug] = createSignal('')
  const [name, setName] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [status, setStatus] = createSignal<'draft' | 'active' | 'inactive' | 'archived'>('draft')

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const [officeItems, bodyItems] = await Promise.all([
        listOfficesAdmin(),
        listGovernanceBodiesAdmin(),
      ])
      setItems(officeItems)
      setBodies(bodyItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load offices.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(event: SubmitEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    try {
      await createOffice({
        data: {
          bodyId: bodyId() || undefined,
          slug: slug(),
          name: name(),
          description: description() || undefined,
          status: status(),
        },
      })

      setBodyId('')
      setSlug('')
      setName('')
      setDescription('')
      setStatus('draft')
      setMessage('Office created.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create office.')
    }
  }

  async function cycleStatus(item: OfficeDto) {
    const next =
      item.status === 'draft'
        ? 'active'
        : item.status === 'active'
          ? 'inactive'
          : item.status === 'inactive'
            ? 'archived'
            : 'draft'

    try {
      await updateOffice({
        data: {
          officeId: item.id,
          patch: { status: next },
        },
      })
      setMessage(`Updated ${item.name} to ${next}.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update office.')
    }
  }

  onMount(() => {
    void load()
  })

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <section style={heroStyle}>
        <h1 style={{ margin: 0, 'font-size': '34px' }}>Offices</h1>
        <p style={copyStyle}>Create and maintain offices within the governance structure.</p>
      </section>

      <Show when={message()}>
        <div style={successStyle}>{message()}</div>
      </Show>

      <Show when={error()}>
        <div style={errorStyle}>{error()}</div>
      </Show>

      <section style={cardStyle}>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '14px' }}>
          <h2 style={{ margin: 0, 'font-size': '22px' }}>Create office</h2>

          <select value={bodyId()} onInput={(e) => setBodyId(e.currentTarget.value)} style={fieldStyle}>
            <option value="">No body</option>
            {bodies().map((body) => (
              <option value={body.id}>{body.name}</option>
            ))}
          </select>

          <input value={slug()} onInput={(e) => setSlug(e.currentTarget.value)} placeholder="slug" style={fieldStyle} />
          <input value={name()} onInput={(e) => setName(e.currentTarget.value)} placeholder="name" style={fieldStyle} />
          <textarea value={description()} onInput={(e) => setDescription(e.currentTarget.value)} rows={4} placeholder="description" style={fieldStyle} />

          <select value={status()} onInput={(e) => setStatus(e.currentTarget.value as typeof status())} style={fieldStyle}>
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="inactive">inactive</option>
            <option value="archived">archived</option>
          </select>

          <div>
            <button type="submit" style={buttonStyle}>Create office</button>
          </div>
        </form>
      </section>

      <Show when={!loading()} fallback={<div style={cardStyle}>Loading offices…</div>}>
        <div style={{ display: 'grid', gap: '16px' }}>
          {items().map((item) => (
            <article style={cardStyle}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                  <strong>{item.name}</strong>
                  <span style={badgeStyle}>{item.status}</span>
                </div>
                <div style={{ color: '#64748b', 'font-size': '13px' }}>Slug: {item.slug}</div>
                <div style={{ color: '#64748b', 'font-size': '13px' }}>
                  Body id: {item.bodyId || 'Unassigned'}
                </div>
                <p style={copyStyle}>{item.description || 'No description provided.'}</p>
                <div>
                  <button onClick={() => void cycleStatus(item)} style={secondaryButtonStyle}>
                    Cycle status
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Show>
    </div>
  )
}

const heroStyle = {
  padding: '24px',
  'border-radius': '20px',
  background: 'rgba(17, 24, 39, 0.88)',
  border: '1px solid #334155',
  display: 'grid',
  gap: '10px',
} as const

const cardStyle = {
  padding: '20px',
  'border-radius': '20px',
  background: 'rgba(17, 24, 39, 0.72)',
  border: '1px solid #334155',
} as const

const fieldStyle = {
  width: '100%',
  padding: '12px 14px',
  'border-radius': '12px',
  border: '1px solid #334155',
  background: '#0f172a',
  color: '#e5e7eb',
  'font-size': '14px',
} as const

const copyStyle = {
  margin: 0,
  color: '#94a3b8',
  'line-height': 1.6,
} as const

const buttonStyle = {
  padding: '12px 16px',
  'border-radius': '12px',
  border: 'none',
  background: '#4f46e5',
  color: 'white',
  'font-weight': '600',
  cursor: 'pointer',
} as const

const secondaryButtonStyle = {
  padding: '10px 14px',
  'border-radius': '12px',
  border: '1px solid #334155',
  background: 'rgba(15, 23, 42, 0.8)',
  color: '#e5e7eb',
  cursor: 'pointer',
} as const

const badgeStyle = {
  display: 'inline-flex',
  padding: '6px 10px',
  'border-radius': '999px',
  background: 'rgba(148, 163, 184, 0.14)',
  color: '#cbd5e1',
  'font-size': '12px',
  'text-transform': 'uppercase',
  'letter-spacing': '0.04em',
} as const

const successStyle = {
  padding: '12px 14px',
  'border-radius': '12px',
  background: 'rgba(34, 197, 94, 0.12)',
  color: '#86efac',
  border: '1px solid rgba(34, 197, 94, 0.25)',
} as const

const errorStyle = {
  padding: '12px 14px',
  'border-radius': '12px',
  background: 'rgba(239, 68, 68, 0.12)',
  color: '#fca5a5',
  border: '1px solid rgba(239, 68, 68, 0.25)',
} as const