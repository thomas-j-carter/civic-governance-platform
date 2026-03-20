import { Show, createSignal, onMount } from 'solid-js'
import type { AgendaItemDto, GovernanceSessionDto } from '@ardtire/contracts'
import { createFileRoute } from '@tanstack/solid-router'
import {
  createAgendaItemForSession,
  listAgendaItemsForSession,
  listSessionsAdmin,
  updateAgendaItem,
} from '../../features/governance-bodies/server'

export const Route = createFileRoute('/admin/agendas')({
  component: AdminAgendasPage,
})

function AdminAgendasPage() {
  const [sessions, setSessions] = createSignal<GovernanceSessionDto[]>([])
  const [selectedSessionId, setSelectedSessionId] = createSignal('')
  const [agendaItems, setAgendaItems] = createSignal<AgendaItemDto[]>([])
  const [loading, setLoading] = createSignal(false)
  const [error, setError] = createSignal<string | null>(null)
  const [message, setMessage] = createSignal<string | null>(null)

  const [title, setTitle] = createSignal('')
  const [description, setDescription] = createSignal('')
  const [sortOrder, setSortOrder] = createSignal('0')

  async function loadSessions() {
    const items = await listSessionsAdmin()
    setSessions(items)

    if (!selectedSessionId() && items[0]) {
      setSelectedSessionId(items[0].id)
    }
  }

  async function loadAgendaItems(sessionId: string) {
    if (!sessionId) {
      setAgendaItems([])
      return
    }

    const items = await listAgendaItemsForSession({
      data: { sessionId },
    })
    setAgendaItems(items)
  }

  async function load() {
    setLoading(true)
    setError(null)

    try {
      await loadSessions()
      if (selectedSessionId()) {
        await loadAgendaItems(selectedSessionId())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load agendas.')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(event: SubmitEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    try {
      await createAgendaItemForSession({
        data: {
          sessionId: selectedSessionId(),
          payload: {
            title: title(),
            description: description() || undefined,
            sortOrder: Number.parseInt(sortOrder(), 10) || 0,
          },
        },
      })

      setTitle('')
      setDescription('')
      setSortOrder('0')
      setMessage('Agenda item created.')
      await loadAgendaItems(selectedSessionId())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create agenda item.')
    }
  }

  async function bumpSortOrder(item: AgendaItemDto) {
    try {
      await updateAgendaItem({
        data: {
          agendaItemId: item.id,
          patch: {
            sortOrder: item.sortOrder + 1,
          },
        },
      })
      setMessage(`Updated sort order for ${item.title}.`)
      await loadAgendaItems(selectedSessionId())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update agenda item.')
    }
  }

  onMount(() => {
    void load()
  })

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <section style={heroStyle}>
        <h1 style={{ margin: 0, 'font-size': '34px' }}>Agendas</h1>
        <p style={copyStyle}>Create and maintain session agenda items.</p>
      </section>

      <Show when={message()}>
        <div style={successStyle}>{message()}</div>
      </Show>

      <Show when={error()}>
        <div style={errorStyle}>{error()}</div>
      </Show>

      <section style={cardStyle}>
        <div style={{ display: 'grid', gap: '12px' }}>
          <h2 style={{ margin: 0, 'font-size': '22px' }}>Select session</h2>

          <select
            value={selectedSessionId()}
            onInput={async (e) => {
              const next = e.currentTarget.value
              setSelectedSessionId(next)
              await loadAgendaItems(next)
            }}
            style={fieldStyle}
          >
            <option value="">Select session</option>
            {sessions().map((session) => (
              <option value={session.id}>{session.title}</option>
            ))}
          </select>
        </div>
      </section>

      <section style={cardStyle}>
        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '14px' }}>
          <h2 style={{ margin: 0, 'font-size': '22px' }}>Create agenda item</h2>

          <input value={title()} onInput={(e) => setTitle(e.currentTarget.value)} placeholder="title" style={fieldStyle} />
          <textarea value={description()} onInput={(e) => setDescription(e.currentTarget.value)} rows={4} placeholder="description" style={fieldStyle} />
          <input value={sortOrder()} onInput={(e) => setSortOrder(e.currentTarget.value)} placeholder="sort order" style={fieldStyle} />

          <div>
            <button type="submit" style={buttonStyle} disabled={!selectedSessionId()}>
              Create agenda item
            </button>
          </div>
        </form>
      </section>

      <Show when={!loading()} fallback={<div style={cardStyle}>Loading agenda items…</div>}>
        <Show when={agendaItems().length > 0} fallback={<div style={cardStyle}>No agenda items for the selected session.</div>}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {agendaItems().map((item) => (
              <article style={cardStyle}>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                    <strong>{item.title}</strong>
                    <span style={badgeStyle}>sort {item.sortOrder}</span>
                  </div>
                  <p style={copyStyle}>{item.description || 'No description provided.'}</p>
                  <div>
                    <button onClick={() => void bumpSortOrder(item)} style={secondaryButtonStyle}>
                      Increment sort order
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Show>
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