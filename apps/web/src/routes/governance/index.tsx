import { A, createFileRoute } from '@tanstack/solid-router'

export const Route = createFileRoute('/governance/')({
  component: GovernanceIndexPage,
})

function GovernanceIndexPage() {
  return (
    <div style={{ display: 'grid', gap: '24px' }}>
      <section
        style={{
          padding: '28px',
          'border-radius': '24px',
          background: 'rgba(17, 24, 39, 0.88)',
          border: '1px solid #334155',
        }}
      >
        <div style={{ display: 'grid', gap: '12px' }}>
          <span style={pillStyle}>Governance</span>
          <h1 style={{ margin: 0, 'font-size': '38px' }}>Governance structure</h1>
          <p style={copyStyle}>
            Public access to governance bodies, offices, and sessions. These pages
            are backed by the canonical governance API and only expose public-safe
            active material.
          </p>
        </div>
      </section>

      <section
        style={{
          display: 'grid',
          'grid-template-columns': 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
        }}
      >
        <GovernanceLinkCard
          title="Bodies"
          body="View the active governance bodies recognized by the platform."
          to="/governance/bodies"
        />
        <GovernanceLinkCard
          title="Offices"
          body="View active offices that operate within the governance structure."
          to="/governance/offices"
        />
        <GovernanceLinkCard
          title="Sessions"
          body="View scheduled, in-session, and concluded governance sessions."
          to="/governance/sessions"
        />
      </section>
    </div>
  )
}

function GovernanceLinkCard(props: { title: string; body: string; to: string }) {
  return (
    <article style={cardStyle}>
      <h2 style={{ margin: 0, 'font-size': '22px' }}>{props.title}</h2>
      <p style={copyStyle}>{props.body}</p>
      <A to={props.to} style={buttonStyle}>
        Open
      </A>
    </article>
  )
}

const pillStyle = {
  display: 'inline-flex',
  width: 'fit-content',
  padding: '6px 10px',
  'border-radius': '999px',
  background: 'rgba(79, 70, 229, 0.18)',
  color: '#c7d2fe',
  'font-size': '12px',
  'font-weight': '700',
  'letter-spacing': '0.04em',
  'text-transform': 'uppercase',
} as const

const copyStyle = {
  margin: 0,
  color: '#94a3b8',
  'line-height': 1.7,
} as const

const cardStyle = {
  padding: '20px',
  'border-radius': '20px',
  background: 'rgba(17, 24, 39, 0.72)',
  border: '1px solid #334155',
  display: 'grid',
  gap: '12px',
} as const

const buttonStyle = {
  display: 'inline-flex',
  width: 'fit-content',
  padding: '12px 16px',
  'border-radius': '12px',
  background: '#4f46e5',
  color: 'white',
  'font-weight': '600',
} as const