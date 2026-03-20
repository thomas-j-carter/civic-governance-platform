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
