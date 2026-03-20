# COMPILED CONTEXT

## docs/ai/context/PROJECT_CONTEXT.md

# Ardtire Digital Governance Platform — Project Context

The Ardtire Digital Governance Platform is a production-grade civic governance system intended to model constitutional governance as software. It provides deterministic, auditable, versioned institutional workflows for proposals, ballots, certifications, official records, and gazette publication.

This is an institutional operating system, not a generic CRUD app.

## Core principles
- explicit lifecycle transitions
- permissioned mutations
- auditability for all writes
- rule-version binding for decisions
- publication separated from certification
- deterministic outcomes


## docs/ai/context/ARCHITECTURE_SUMMARY.md

# Architecture Summary

## Repository
- polyglot monorepo
- pnpm-managed
- no Bazel

## Primary apps
- apps/web
- apps/gov-api
- apps/cms

## Core backend
`apps/gov-api` is the canonical mutation API.

## Main layers
- domain
- application
- routes/http
- infrastructure

## Persistence/auth
- PostgreSQL
- Prisma
- Keycloak/JWT/JWKS boundary


## docs/ai/context/DOMAIN_MODEL.md

# Domain Model

## Core domains
- Person
- Member
- Role / RoleAssignment
- Delegation
- GovernanceBody
- Office
- OfficeHolder
- Proposal
- ProposalVersion
- Ballot
- Vote
- CertificationRecord
- OfficialRecord
- RecordVersion
- GazetteIssue
- GazetteEntry

## Core chain
Proposal -> Ballot -> Certification -> OfficialRecord -> GazetteEntry -> GazetteIssue


## docs/ai/context/IMPLEMENTATION_STATE.md

# Implementation State

## Completed major areas
- identity and auth boundary foundations
- person/member administration
- authority resolution
- governance body / office / office-holder administration
- proposal / ballot / certification foundations
- official record foundations
- gazette publication foundations

## Current position
Backend institutional foundation completed through the record + gazette state-memory layer.

## Next batch
Batch 23C — orchestration layer
- certification -> record -> officialize
- record -> gazette scheduling
- publication readiness / guided promotion workflows


## docs/ai/context/NEXT_STEPS.md

# Next Steps

## Immediate
Batch 23C — orchestration layer

## After
- rule engine strengthening
- institutional completion
- operational hardening
- typed gov-client
- frontend/admin UX


## docs/ai/context/AI_RULES.md

# AI Rules

- produce production-grade code only
- no placeholders in implementation responses
- use explicit lifecycle actions
- maintain audit logging for all writes
- maintain idempotency for write operations
- keep application/domain/infrastructure separation strict
- do not restate previously completed work
- continue from canonical repo/context files


