import { Show, createSignal, onMount } from 'solid-js'
import type { GovernanceBodyDto } from '@ardtire/contracts'
import { createFileRoute } from '@tanstack/solid-router'
import { listGovernanceBodiesPublic } from '../../features/governance-bodies/server'

export const Route = createFileRoute('/governance/bodies')({
  component: GovernanceBodiesPage,
})

function GovernanceBodiesPage() {
  const [items, setItems] = createSignal<GovernanceBodyDto[]>([])
  const [loading, setLoading] = createSignal(true)
  const [error, setError] = createSignal<string | null>(null)

  async function load() {
    setLoading(true)
    setError(null)

    try {
      setItems(await listGovernanceBodiesPublic())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load governance bodies.')
    } finally {
      setLoading(false)
    }
  }

  onMount(() => {
    void load()
  })

  return (
    <div style={{ display: 'grid', gap: '20px' }}>
      <section style={heroStyle}>
        <h1 style={{ margin: 0, 'font-size': '34px' }}>Governance bodies</h1>
        <p style={copyStyle}>
          Public listing of active governance bodies.
        </p>
      </section>

      <Show when={error()}>
        <div style={errorStyle}>{error()}</div>
      </Show>

      <Show when={!loading()} fallback={<div style={cardStyle}>Loading governance bodies…</div>}>
        <Show when={items().length > 0} fallback={<div style={cardStyle}>No active bodies found.</div>}>
          <div style={{ display: 'grid', gap: '16px' }}>
            {items().map((item) => (
              <article style={cardStyle}>
                <div style={{ display: 'grid', gap: '10px' }}>
                  <div style={{ display: 'flex', 'justify-content': 'space-between', gap: '12px' }}>
                    <strong>{item.name}</strong>
                    <span style={badgeStyle}>{item.status}</span>
                  </div>
                  <div style={{ color: '#64748b', 'font-size': '13px' }}>Slug: {item.slug}</div>
                  <p style={copyStyle}>{item.description || 'No description provided.'}</p>
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