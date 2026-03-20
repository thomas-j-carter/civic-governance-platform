import { Show, createSignal, onMount } from 'solid-js'
import type { GovernanceBodyDto, GovernanceSessionDto } from '@ardtire/contracts'
import { createFileRoute } from '@tanstack/solid-router'
import {
  createGovernanceSession,
  listGovernanceBodiesAdmin,
  listSessionsAdmin,
  updateGovernanceSession,
} from '../../features/governance-bodies/server'

export const Route = createFileRoute('/admin/sessions')({
  component: AdminSessionsPage,
})

function AdminSessionsPage() {
  const [items, setItems] = createSignal<GovernanceSessionDto[]>([])
  const [bodies, setBodies] = createSignal<GovernanceBodyDto[]>([])
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [message, setMessage] = createSignal<string | null>(null)

  const [bodyId, setBodyId] = createSignal('')
  const [title, setTitle] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [scheduledStartAt, setScheduledStartAt] = createSignal('')
  const [scheduledEndAt, setScheduledEndAt] = createSignal('')
  const [state, setState] = createSignal<'draft' | 'scheduled' | 'in_session' | 'concluded' | 'archived'>('draft')

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const [sessionItems, bodyItems] = await Promise.all([
        listSessionsAdmin(),
        listGovernanceBodiesAdmin(),
      ])
      setItems(sessionItems)
      setBodies(bodyItems)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sessions.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(event: SubmitEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    try {
      await createGovernanceSession({
        data: {
          bodyId: bodyId() || undefined,
          title: title(),
          description: description() || undefined,
          scheduledStartAt: scheduledStartAt() || undefined,
          scheduledEndAt: scheduledEndAt() || undefined,
          state: state(),
        },
      })

      setBodyId('')
      setTitle('')
      setDescription('')
      setScheduledStartAt('')
      setScheduledEndAt('')
      setState('draft')
      setMessage('Governance session created.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create session.')
    }
  }

  async function cycleState(item: GovernanceSessionDto) {
    const next =
      item.state === 'draft'
        ? 'scheduled'
        : item.state === 'scheduled'
          ? 'in_session'
          : item.state === 'in_session'
            ? 'concluded'
            : item.state === 'concluded'
              ? 'archived'
              : 'draft'

    try {
      await updateGovernanceSession({
        data: {
          sessionId: item.id,
          patch: { state: next },
        },
      })
      setMessage(`Updated ${item.title} to ${next}.`)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update session.')
    }
  }

  onMount(() => {
    void load()
  })

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <section style={heroStyle}>
        <h1 style={{ margin: 0, 'font-size': '34px' }}>Sessions</h1>
        <p style={copyStyle}>Create and manage governance sessions.</p>
      </section>

      <Show when={message()}>
        <div style={successStyle}>{message()}</div>
      </Show>

      <Show when={error()}>
        <div style={errorStyle}>{error()}</div>
      </Show>

      <section style={cardStyle}>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '14px' }}>
          <h2 style={{ margin: 0, 'font-size': '22px' }}>Create governance session</h2>

          <select value={bodyId()} onInput={(e) => setBodyId(e.currentTarget.value)} style={fieldStyle}>
            <option value="">No body</option>
            {bodies().map((body) => (
              <option value={body.id}>{body.name}</option>
            ))}
          </select>

          <input value={title()} onInput={(e) => setTitle(e.currentTarget.value)} placeholder="title" style={fieldStyle} />
          <textarea value={description()} onInput={(e) => setDescription(e.currentTarget.value)} rows={4} placeholder="description" style={fieldStyle} />
          <input value={scheduledStartAt()} onInput={(e) => setScheduledStartAt(e.currentTarget.value)} placeholder="scheduled start ISO datetime" style={fieldStyle} />
          <input value={scheduledEndAt()} onInput={(e) => setScheduledEndAt(e.currentTarget.value)} placeholder="scheduled end ISO datetime" style={fieldStyle} />

          <select value={state()} onInput={(e) => setState(e.currentTarget.value as typeof state())} style={fieldStyle}>
            <option value="draft">draft</option>
            <option value="scheduled">scheduled</option>
            <option value="in_session">in_session</option>
            <option value="concluded">concluded</option>
            <option value="archived">archived</option>
          </select>

          <div>
            <button type="submit" style={buttonStyle}>Create session</button>
          </div>
        </form>
      </section>

      <Show when={!loading()} fallback={<div style={cardStyle}>Loading sessions…</div>}>
        <div style={{ display: 'grid', gap: '16px' }}>
          {items().map((item) => (
            <article style={cardStyle}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                  <strong>{item.title}</strong>
                  <span style={badgeStyle}>{item.state}</span>
                </div>
                <div style={{ color: '#64748b', 'font-size': '13px' }}>
                  Start: {item.scheduledStartAt ? new Date(item.scheduledStartAt).toLocaleString() : 'Not scheduled'}
                </div>
                <div style={{ color: '#64748b', 'font-size': '13px' }}>
                  End: {item.scheduledEndAt ? new Date(item.scheduledEndAt).toLocaleString() : 'Not scheduled'}
                </div>
                <p style={copyStyle}>{item.description || 'No description provided.'}</p>
                <div>
                  <button onClick={() => void cycleState(item)} style={secondaryButtonStyle}>
                    Cycle state
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