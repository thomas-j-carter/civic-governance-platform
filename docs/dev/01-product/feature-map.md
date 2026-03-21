# Feature Map

This document defines the full product capability surface of the Ardtire Civic Governance Platform.

It answers:
→ what exists in the system

Not:
→ how it is implemented

## Feature categories

The platform is composed of the following primary feature domains:

## 1. Identity & Access

- authentication (via IdP)
- session handling
- role resolution
- membership-aware permissions
- multi-role context handling

## 2. Membership

- application submission
- application review
- approval / rejection
- membership status lifecycle
- member profile management

## 3. Governance

- proposal creation
- proposal versioning
- proposal editing (draft stage)
- proposal stage transitions
- committee/review assignment
- ballots (open/close)
- vote capture
- certification of results
- office holder management

## 4. Records

- record creation
- record versioning
- record publication
- archival
- retention rules

## 5. Publication

- article creation
- gazette publishing
- official releases
- scheduled publication
- public vs internal visibility

## 6. Platform Services

- notifications
- search
- audit logs
- file uploads
- activity tracking

## 7. Admin / Governance Operations

- role assignment
- permission overrides (if allowed)
- workflow oversight
- audit review
- system configuration (limited)

## 8. Public Surface

- public pages
- published records
- gazette
- official outputs
- institutional information

## Feature boundaries

Important:
- Features are grouped by responsibility
- Not by UI location
- Not by implementation

## Feature rule

A feature must:
- map to a real domain capability
- be traceable to domain or governance need
- have clear ownership
- be spec-able

## Anti-patterns

Avoid:
- “misc features”
- UI-only features with no domain meaning
- features defined only by implementation

## Summary

This feature map is the canonical list of:
→ what the platform does

It must remain aligned with:
- domain model
- route map
- specs
