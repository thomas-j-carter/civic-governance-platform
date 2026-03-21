# Document 17 — `docs/infrastructure/repository-pattern.md`

## Purpose of this document

This document defines the **repository pattern** used by the Ardtire Society Digital Governance Platform.

Earlier documents established:

* domain entities and aggregates
* application services
* database architecture
* event storage
* projections

However, application services must **not interact directly with database queries**.

Instead, they should access domain data through **repositories**.

Repositories provide an abstraction layer that:

* isolates the domain model from database details
* enforces aggregate boundaries
* simplifies testing
* improves maintainability

This document defines how repositories are structured and used.

---

# 1. What is a repository

A repository is a **domain-facing interface for retrieving and persisting aggregates**.

Example responsibilities:

* load a proposal
* save a ballot
* retrieve a member
* persist a certification record

Repositories encapsulate the **data access logic**.

---

# 2. Why repositories are necessary

Direct database access from application services causes several problems:

* tight coupling to database schema
* scattered query logic
* difficult testing
* inconsistent transaction handling

Repositories solve this by providing a **single abstraction layer**.

---

# 3. Repository design principles

Repositories must follow several principles.

### Principle 1 — One repository per aggregate

Each aggregate should have a dedicated repository.

Example:

```text
ProposalRepository
BallotRepository
MemberRepository
CertificationRepository
```

---

### Principle 2 — Domain-oriented interface

Repository methods should reflect domain operations.

Example:

```text
findProposalById
saveProposal
listActiveBallots
```

Avoid generic CRUD naming when possible.

---

### Principle 3 — Hide persistence details

Repositories should not expose SQL or database mechanics to the domain layer.

---

### Principle 4 — Return domain objects

Repositories should return domain entities or aggregates, not raw database rows.

---

# 4. Repository responsibilities

Repositories perform several core functions.

### Aggregate retrieval

Example:

```text
proposalRepository.findById(proposalId)
```

---

### Aggregate persistence

Example:

```text
proposalRepository.save(proposal)
```

---

### Domain-specific queries

Example:

```text
ballotRepository.findOpenBallots()
```

---

### Transaction coordination

Repositories operate within application service transactions.

---

# 5. Repository structure

Recommended directory structure:

```text
packages/
  domain/
  application/
  infrastructure/
    repositories/
```

Repository implementations live in the **infrastructure layer**.

---

# 6. Repository interfaces

Repository interfaces belong in the **domain or application layer**.

Example:

```text
ProposalRepository
BallotRepository
MemberRepository
```

These interfaces define the contract.

---

# 7. Repository implementation

The actual database logic is implemented in the infrastructure layer.

Example:

```text
PostgresProposalRepository
PostgresBallotRepository
PostgresMemberRepository
```

These implementations use:

* Prisma ORM
* SQL queries
* database transactions

---

# 8. Example repository interface

Example interface:

```text
interface ProposalRepository {
  findById(proposalId)
  save(proposal)
  listProposalsByStage(stage)
}
```

This hides the database structure from the domain.

---

# 9. Example repository implementation

Example pseudocode:

```text
class PostgresProposalRepository {

  findById(id) {
    return prisma.proposals.findUnique(...)
  }

  save(proposal) {
    prisma.proposals.update(...)
  }

}
```

The application service does not see these details.

---

# 10. Aggregate boundaries

Repositories should return **complete aggregates**.

Example:

A proposal aggregate includes:

* proposal
* versions
* amendments

The repository loads all required data.

---

# 11. Lazy vs eager loading

Repositories must decide whether to load related data eagerly.

Example:

```text
proposal + versions + amendments
```

Eager loading simplifies domain logic but may increase query cost.

Tradeoffs should be evaluated case by case.

---

# 12. Query repositories

Some queries are projection-based.

Example:

```text
ProposalListRepository
BallotDashboardRepository
```

These repositories query **projection tables**, not domain aggregates.

---

# 13. Projection repositories

Example projection repository:

```text
ProposalListRepository
```

Methods:

```text
listProposals()
listProposalsByStatus()
```

These use the **projection schema**.

---

# 14. Repository transaction handling

Repositories must operate within transaction contexts.

Example:

```text
BEGIN TRANSACTION
  save proposal
  save event
COMMIT
```

Application services manage the transaction boundaries.

---

# 15. Unit of work pattern

Repositories often participate in a **unit of work**.

The unit of work ensures that:

* multiple aggregate updates commit atomically
* domain events are persisted together

Example:

```text
proposalRepository.save(proposal)
eventRepository.save(event)
```

---

# 16. Repository caching

Some repositories may benefit from caching.

Example:

* rule repositories
* governance structure repositories

Cache layers must maintain consistency.

---

# 17. Testing repositories

Repositories must support testing.

Strategies:

* mock repositories for unit tests
* in-memory implementations
* integration tests against real database

Example mock:

```text
MockProposalRepository
```

---

# 18. Repository error handling

Repositories must handle persistence failures.

Examples:

* database connection failure
* unique constraint violation
* transaction rollback

These errors should propagate as domain-friendly exceptions.

---

# 19. Performance considerations

Repositories should:

* use indexed queries
* avoid unnecessary joins
* leverage projection tables for reads

Heavy queries should not operate on domain tables.

---

# 20. Security considerations

Repository implementations must enforce:

* data access restrictions
* tenant boundaries (if applicable)
* authorization constraints

Sensitive queries should be protected.

---

# 21. Repository responsibilities vs domain responsibilities

Repositories manage **data persistence**.

Domain entities manage **business rules**.

Example separation:

```text
Domain Entity → proposal.canBeSubmitted()

Repository → proposalRepository.save()
```

---

# 22. Repository anti-patterns

Avoid these mistakes:

### Fat repositories

Repositories should not contain business logic.

---

### Generic repositories

Generic CRUD repositories often leak persistence concerns.

Prefer domain-specific repositories.

---

### Direct SQL in services

Application services must never bypass repositories.

---

# 23. Example repository usage

Example application service:

```text
submitProposal(command):

  proposal = proposalRepository.findById(command.id)

  proposal.submit()

  proposalRepository.save(proposal)

  eventBus.publish(ProposalSubmitted)
```

The service does not know about database queries.

---

# 24. Repository benefits

Repositories provide:

* separation of concerns
* domain isolation
* easier testing
* flexibility to change persistence technology

They are a core component of domain-driven architectures.

---

# 25. Summary

The repository pattern isolates the domain model from database concerns.

Repositories:

* retrieve aggregates
* persist aggregates
* encapsulate query logic
* enforce aggregate boundaries

Each aggregate should have its own repository.

This design ensures the governance platform remains **maintainable, testable, and evolvable**.

---

## Status

**Status:** Draft.
**Next document:**

`docs/infrastructure/background-jobs-and-workers.md`

3… 2… 1… next: **Document 18 — Background Jobs and Workers**, where we define how asynchronous tasks such as **vote tallying, notifications, projections, and publication scheduling** are executed.
