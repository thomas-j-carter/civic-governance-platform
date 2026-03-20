import { createFileRoute, useNavigate } from '@tanstack/solid-router'
import { createSignal } from 'solid-js'
import { createProposal } from '../../features/proposals/server'

export const Route = createFileRoute('/admin/proposals/new')({
  component: AdminNewProposalPage,
})

function AdminNewProposalPage() {
  const navigate = useNavigate()

  const [title, setTitle] = createSignal('')
  const [summary, setSummary] = createSignal('')
  const [bodyId, setBodyId] = createSignal('')
  const [sessionId, setSessionId] = createSignal('')
  const [error, setError] = createSignal<string | null>(null)

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault()
    setError(null)

    try {
      const created = await createProposal({
        data: {
          title: title(),
          summary: summary() || undefined,
          bodyId: bodyId() || undefined,
          sessionId: sessionId() || undefined,
          state: 'draft',
        },
      })

      await navigate({
        to: '/admin/proposals/$proposalId',
        params: { proposalId: created.id },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create proposal.')
    }
  }

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <section style={heroStyle}>
        <h1 style={{ margin: 0, 'font-size': '34px' }}>New proposal</h1>
        <p style={copyStyle}>Create a draft proposal in the canonical governance API.</p>
      </section>

      {error() && <div style={errorStyle}>{error()}</div>}

      <section style={cardStyle}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px' }}>
          <input value={title()} onInput={(e) => setTitle(e.currentTarget.value)} placeholder="title" style={fieldStyle} />
          <textarea value={summary()} onInput={(e) => setSummary(e.currentTarget.value)} rows={6} placeholder="summary" style={fieldStyle} />
          <input value={bodyId()} onInput={(e) => setBodyId(e.currentTarget.value)} placeholder="body id (optional)" style={fieldStyle} />
          <input value={sessionId()} onInput={(e) => setSessionId(e.currentTarget.value)} placeholder="session id (optional)" style={fieldStyle} />

          <div>
            <button type="submit" style={buttonStyle}>Create proposal</button>
          </div>
        </form>
      </section>
    </div>
  )
}

const heroStyle = {
  padding: '24px',
  'border-radius': '20px',
  background: 'rgba(17, 24, 39, 0.88)',
  border: '1px solid #334155',
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

const buttonStyle = {
  padding: '12px 16px',
  'border-radius': '12px',
  border: 'none',
  background: '#4f46e5',
  color: 'white',
  'font-weight': '600',
  cursor: 'pointer',
} as const

const copyStyle = {
  margin: 0,
  color: '#94a3b8',
  'line-height': 1.6,
} as const

const errorStyle = {
  padding: '12px 14px',
  'border-radius': '12px',
  background: 'rgba(239, 68, 68, 0.12)',
  color: '#fca5a5',
  border: '1px solid rgba(239, 68, 68, 0.25)',
} as const