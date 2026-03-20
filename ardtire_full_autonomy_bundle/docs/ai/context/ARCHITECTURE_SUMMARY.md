# Architecture Summary

## Repository Style

- Polyglot monorepo (no Bazel)
- Package manager: pnpm

## Applications

### apps/web
- Public site
- Member portal
- Admin interfaces

### apps/gov-api
- Hono-based TypeScript service
- Canonical governance API
- Handles all domain mutations

### apps/cms
- Payload CMS
- Content management

### apps/gov (Decidim)
- Civic participation interface
- External integration boundary

## Packages

- packages/gov-client (typed API client)
- shared domain types and utilities

## Core Services

- PostgreSQL database
- Prisma as canonical ORM
- Keycloak for authentication
- Audit logging system
- Idempotency system

## Architectural Layers

- Domain (entities, repositories)
- Application (handlers, commands, queries)
- HTTP (routes, middleware)
- Infrastructure (repositories, persistence)

## Key Boundaries

- gov-api is the single source of truth for mutations
- frontend never directly mutates DB
- Decidim is integrated but not authoritative
