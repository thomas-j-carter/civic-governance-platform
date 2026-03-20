import { createFileRoute } from '@tanstack/solid-router'
import { Show, createSignal, onMount } from 'solid-js'
import type { AmendmentDto, ProposalDto } from '@ardtire/contracts'
import {
  listAuthenticatedAmendmentsForProposal,
  readAuthenticatedProposal,
} from '../../features/proposals/server'

export const Route = createFileRoute('/member/proposals/$proposalId')({
  component: MemberProposalDetailPage,
})

function MemberProposalDetailPage() {
  const params = Route.useParams()

  const [proposal, setProposal] = createSignal<ProposalDto | null>(null)
  const [amendments, setAmendments] = createSignal<AmendmentDto[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load proposal.')
    } finally {
      setLoading(false)
    }
  }

  onMount(() => {
    void load()
  })

  return (
    <Show when={!loading()} fallback={<div style={cardStyle}>Loading proposal…</div>}>
      <Show when={proposal()} fallback={<div style={cardStyle}>Proposal not found.</div>}>
        {(item) => (
          <div style={{ display: 'grid', gap: '20px' }}>
            <section style={heroStyle}>
              <div style={{ display: 'grid', gap: '10px' }}>
                <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                  <h1 style={{ margin: 0, 'font-size': '34px' }}>{item().title}</h1>
                  <span style={badgeStyle}>{item().state}</span>
                </div>
                <p style={copyStyle}>{item().summary || 'No summary provided.'}</p>
              </div>
            </section>

            <Show when={error()}>
              <div style={errorStyle}>{error()}</div>
            </Show>

            <section style={{ display: 'grid', gap: '16px' }}>
              <h2 style={{ margin: 0, 'font-size': '24px' }}>Visible amendments</h2>

              <Show
                when={amendments().length > 0}
                fallback={<div style={cardStyle}>No visible amendments for this proposal.</div>}
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

const errorStyle = {
  padding: '12px 14px',
  'border-radius': '12px',
  background: 'rgba(239, 68, 68, 0.12)',
  color: '#fca5a5',
  border: '1px solid rgba(239, 68, 68, 0.25)',
} as const