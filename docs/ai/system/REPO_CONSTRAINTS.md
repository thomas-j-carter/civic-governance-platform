# REPOSITORY CONSTRAINTS

## LAYERING RULES

### Domain Layer
- No external dependencies
- Pure business logic only

### Application Layer
- Orchestrates domain
- No direct DB access

### Infrastructure Layer
- Implements repositories
- No business logic

### HTTP Layer
- Handles transport only
- Calls application handlers

---

## FORBIDDEN PATTERNS

- ❌ Direct DB access from routes
- ❌ Business logic in controllers
- ❌ Implicit state transitions
- ❌ Skipping lifecycle steps
- ❌ Hidden side effects

---

## REQUIRED PATTERNS

- ✅ Command handlers for mutations
- ✅ Query handlers for reads
- ✅ DTO separation (read vs write)
- ✅ Explicit action endpoints
- ✅ Audit logging for all writes

---

## FILE ORGANIZATION

- domain/
- application/
- infrastructure/
- routes/

Must remain consistent.

---

## NAMING RULES

- Handlers: `XyzHandler`
- Commands: `XyzCommand`
- Queries: `XyzQuery`
- DTOs: `XyzDto`

---

## API RULES

- Use REST semantics
- Use action endpoints for transitions
- No ambiguous endpoints

---

## ENFORCEMENT

AI must:

- refuse invalid patterns
- refactor violations
- maintain consistency
