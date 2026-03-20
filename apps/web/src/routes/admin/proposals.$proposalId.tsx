import { createFileRoute } from '@tanstack/solid-router'
import { Show, createSignal, onMount } from 'solid-js'
import type { AmendmentDto, ProposalDto } from '@ardtire/contracts'
import {
  createAmendmentForProposal,
  listAuthenticatedAmendmentsForProposal,
  readAuthenticatedProposal,
  submitAmendment,
  updateProposal,
  withdrawAmendment,
} from '../../features/proposals/server'

export const Route = createFileRoute('/admin/proposals/$proposalId')({
  component: AdminProposalDetailPage,
})

function AdminProposalDetailPage() {
  const params = Route.useParams()

  const [proposal, setProposal] = createSignal<ProposalDto | null>(null)
  const [amendments, setAmendments] = createSignal<AmendmentDto[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)
  const [message, setMessage] = createSignal<string | null>(null)

  const [title, setTitle] = createSignal('')
  const [summary, setSummary] = createSignal('')
  const [newAmendmentTitle, setNewAmendmentTitle] = createSignal('')
  const [newAmendmentSummary, setNewAmendmentSummary] = createSignal('')

  async function load() {
    setLoading(true)
    setError(null)

    try {
      const proposalResult = await readAuthenticatedProposal({
        data: { proposalId: params().proposalId },
      })
      const amendmentItems = await listAuthenticatedAmendmentsForProposal({
        data: { proposalId: params().proposalId },
      })

      setProposal(proposalResult)
      setAmendments(amendmentItems)

      if (proposalResult) {
        setTitle(proposalResult.title)
        setSummary(proposalResult.summary || '')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load proposal.')
    } finally {
      setLoading(false)
    }
  }

  async function handleUpdateProposal(event: SubmitEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    try {
      await updateProposal({
        data: {
          proposalId: params().proposalId,
          patch: {
            title: title(),
            summary: summary(),
          },
        },
      })

      setMessage('Proposal updated.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update proposal.')
    }
  }

  async function handleCreateAmendment(event: SubmitEvent) {
    event.preventDefault()
    setError(null)
    setMessage(null)

    try {
      await createAmendmentForProposal({
        data: {
          proposalId: params().proposalId,
          payload: {
            title: newAmendmentTitle(),
            summary: newAmendmentSummary() || undefined,
            state: 'draft',
          },
        },
      })

      setNewAmendmentTitle('')
      setNewAmendmentSummary('')
      setMessage('Amendment created.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create amendment.')
    }
  }

  async function handleSubmitAmendment(amendmentId: string) {
    try {
      await submitAmendment({
        data: { amendmentId },
      })
      setMessage('Amendment submitted.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit amendment.')
    }
  }

  async function handleWithdrawAmendment(amendmentId: string) {
    try {
      await withdrawAmendment({
        data: { amendmentId },
      })
      setMessage('Amendment withdrawn.')
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to withdraw amendment.')
    }
  }

  onMount(() => {
    void load()
  })

  return (
    <Show when={!loading()} fallback={<div style={cardStyle}>Loading proposal…</div>}>
      <Show when={proposal()} fallback={<div style={cardStyle}>Proposal not found.</div>}>
        {(item) => (
          <div style={{ display: 'grid', gap: '24px' }}>
            <section style={heroStyle}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                  <h1 style={{ margin: 0, 'font-size': '34px' }}>{item().title}</h1>
                  <span style={badgeStyle}>{item().state}</span>
                </div>
                <p style={copyStyle}>
                  Administrative proposal detail, including local draft updates and
                  amendment creation.
                </p>
              </div>
            </section>

            <Show when={message()}>
              <div style={successStyle}>{message()}</div>
            </Show>

            <Show when={error()}>
              <div style={errorStyle}>{error()}</div>
            </Show>

            <section style={cardStyle}>
              <form onSubmit={handleUpdateProposal} style={{ display: 'grid', gap: '14px' }}>
                <h2 style={{ margin: 0, 'font-size': '22px' }}>Update proposal</h2>

                <input value={title()} onInput={(e) => setTitle(e.currentTarget.value)} style={fieldStyle} />
                <textarea value={summary()} onInput={(e) => setSummary(e.currentTarget.value)} rows={6} style={fieldStyle} />

                <div>
                  <button type="submit" style={buttonStyle}>Save proposal</button>
                </div>
              </form>
            </section>

            <section style={cardStyle}>
              <form onSubmit={handleCreateAmendment} style={{ display: 'grid', gap: '14px' }}>
                <h2 style={{ margin: 0, 'font-size': '22px' }}>Create amendment</h2>

                <input value={newAmendmentTitle()} onInput={(e) => setNewAmendmentTitle(e.currentTarget.value)} placeholder="amendment title" style={fieldStyle} />
                <textarea value={newAmendmentSummary()} onInput={(e) => setNewAmendmentSummary(e.currentTarget.value)} rows={5} placeholder="amendment summary" style={fieldStyle} />

                <div>
                  <button type="submit" style={buttonStyle}>Create amendment</button>
                </div>
              </form>
            </section>

            <section style={{ display: 'grid', gap: '16px' }}>
              <h2 style={{ margin: 0, 'font-size': '24px' }}>Amendments</h2>

              <Show
                when={amendments().length > 0}
                fallback={<div style={cardStyle}>No amendments for this proposal yet.</div>}
              >
                <div style={{ display: 'grid', gap: '16px' }}>
                  {amendments().map((amendment) => (
                    <article style={cardStyle}>
                      <div style={{ display: 'grid', gap: '10px' }}>
                        <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                          <strong>{amendment.title}</strong>
                          <span style={badgeStyle}>{amendment.state}</span>
                        </div>

                        <p style={copyStyle}>{amendment.summary || 'No summary provided.'}</p>

                        <div style={{ display: 'flex', gap: '10px', 'flex-wrap': 'wrap' }}>
                          <Show when={amendment.state === 'draft'}>
                            <button onClick={() => void handleSubmitAmendment(amendment.id)} style={buttonStyle}>
                              Submit amendment
                            </button>
                          </Show>

                          <Show when={amendment.state !== 'withdrawn' && amendment.state !== 'archived'}>
                            <button onClick={() => void handleWithdrawAmendment(amendment.id)} style={dangerButtonStyle}>
                              Withdraw amendment
                            </button>
                          </Show>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </Show>
            </section>
          </div>
        )}
      </Show>
    </Show>
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