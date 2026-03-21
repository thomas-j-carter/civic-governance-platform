# Route Map

This document defines the navigable surface of the platform.

It answers:
→ where users go
→ how product areas are structured

## Route categories

## Public routes

- /
- /about
- /governance
- /records
- /publications
- /gazette
- /proposals/:id (public view where applicable)

## Authenticated routes

- /dashboard
- /profile
- /membership
- /membership/application
- /membership/status

## Governance routes

- /governance/proposals
- /governance/proposals/:id
- /governance/proposals/:id/edit
- /governance/ballots
- /governance/ballots/:id
- /governance/certifications

## Records routes

- /records
- /records/:id
- /records/:id/history

## Publication routes

- /publications
- /publications/:id
- /gazette/:issue

## Admin routes

- /admin
- /admin/members
- /admin/proposals
- /admin/records
- /admin/audit

## Route rules

- routes must reflect domain structure
- routes must be stable identifiers
- routes must not encode implementation detail
- routes must support public vs private separation

## Route principle

If a user cannot predict where something lives:
→ the route map is wrong
