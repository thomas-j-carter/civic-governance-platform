import { A, createFileRoute } from '@tanstack/solid-router'
import { Show, createSignal, onMount } from 'solid-js'
import type { ProposalDto } from '@ardtire/contracts'
import {
  listAuthenticatedProposals,
  submitProposal,
  withdrawProposal,
} from '../../features/proposals/server'

export const Route = createFileRoute('/admin/proposals')({
  component: AdminProposalsPage,
})

function AdminProposalsPage() {
  const [items, setItems] = createSignal<ProposalDto[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)
  const [message, setMessage] = createSignal<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)

    try {
      setItems(await listAuthenticatedProposals())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load proposals.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(proposalId: string) {
    try {
      await submitProposal({ data: { proposalId } })
      setMessage('Proposal submitted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit proposal.')
    }
  }

  async function handleWithdraw(proposalId: string) {
    try {
      await withdrawProposal({ data: { proposalId } })
      setMessage('Proposal withdrawn.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw proposal.')
    }
  }

  onMount(() => {
    void load()
  })

  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <section style={heroStyle}>
        <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '16px', 'align-items': 'center' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <h1 style={{ margin: 0, 'font-size': '34px' }}>Proposals</h1>
            <p style={copyStyle}>Administrative proposal management surface.</p>
          </div>
          <A to="/admin/proposals/new" style={buttonStyle}>
            New proposal
          </A>
        </div>
      </section>

      <Show when={message()}>
        <div style={successStyle}>{message()}</div>
      </Show>

      <Show when={error()}>
        <div style={errorStyle}>{error()}</div>
      </Show>

      <Show when={!loading()} fallback={<div style={cardStyle}>Loading proposals…</div>}>
        <Show when={items().length > 0} fallback={<div style={cardStyle}>No proposals found.</div>}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {items().map((item) => (
              <article style={cardStyle}>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                    <strong>{item.title}</strong>
                    <span style={badgeStyle}>{item.state}</span>
                  </div>
                  <p style={copyStyle}>{item.summary || 'No summary provided.'}</p>
                  <div style={{ display: 'flex', gap: '10px', 'flex-wrap': 'wrap' }}>
                    <A to="/admin/proposals/$proposalId" params={{ proposalId: item.id }} style={secondaryButtonStyle}>
                      Open detail
                    </A>

                    <Show when={item.state === 'draft'}>
                      <button onClick={() => void handleSubmit(item.id)} style={buttonStyle}>
                        Submit
                      </button>
                    </Show>

                    <Show when={item.state !== 'withdrawn' && item.state !== 'archived'}>
                      <button onClick={() => void handleWithdraw(item.id)} style={dangerButtonStyle}>
                        Withdraw
                      </button>
                    </Show>
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
} as const

const cardStyle = {
  padding: '20px',
  'border-radius': '20px',
  background: 'rgba(17, 24, 39, 0.72)',
  border: '1px solid #334155',
} as const

const buttonStyle = {
  display: 'inline-flex',
  width: 'fit-content',
  padding: '12px 16px',
  'border-radius': '12px',
  border: 'none',
  background: '#4f46e5',
  color: 'white',
  'font-weight': '600',
  cursor: 'pointer',
} as const

const secondaryButtonStyle = {
  display: 'inline-flex',
  width: 'fit-content',
  padding: '10px 14px',
  'border-radius': '12px',
  border: '1px solid #334155',
  background: 'rgba(15, 23, 42, 0.8)',
  color: '#e5e7eb',
  cursor: 'pointer',
} as const

const dangerButtonStyle = {
  padding: '10px 14px',
  'border-radius': '12px',
  border: 'none',
  background: '#b91c1c',
  color: 'white',
  'font-weight': '600',
  cursor: 'pointer',
} as const

const copyStyle = {
  margin: 0,
  color: '#94a3b8',
  'line-height': 1.6,
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