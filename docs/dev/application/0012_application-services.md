# Document 12 — `docs/application/application-services.md`

## Purpose of this document

This document defines the **Application Service Layer** for the Ardtire Society Digital Governance Platform.

Earlier documents established:

* domain model
* state machines
* governance rules
* authority model
* use cases

However, domain models and use cases alone do not describe **how the software actually executes these operations**.

That responsibility belongs to **application services**.

Application services coordinate:

* command handling
* authority validation
* rule evaluation
* domain state transitions
* event emission
* persistence operations

They act as the **orchestration layer between APIs and domain logic**.

---

# 1. Architectural position of application services

The system architecture can be understood as layered:

```text
Client Interfaces
  │
API Layer
  │
Application Services
  │
Domain Model
  │
Persistence Layer
```

Application services sit **between APIs and domain logic**.

They translate incoming requests into domain actions.

---

# 2. Responsibilities of application services

Application services must perform several responsibilities.

### 1. Accept commands

Commands represent actions requested by actors.

Example:

```text
SubmitProposal
CastVote
CertifyResult
PublishGazetteEntry
```

---

### 2. Validate authority

Before performing actions, services must verify that the actor has authority.

---

### 3. Evaluate governance rules

Services must apply rule evaluation when required.

Example:

* quorum verification
* vote threshold evaluation

---

### 4. Invoke domain operations

Services orchestrate operations on domain aggregates.

Example:

* proposal transitions
* ballot lifecycle changes

---

### 5. Persist changes

Changes to domain entities must be saved through repositories.

---

### 6. Emit domain events

Events signal that meaningful changes occurred.

---

### 7. Return results

The service returns structured responses to the API layer.

---

# 3. What application services should NOT do

Application services must **avoid certain responsibilities**.

They must NOT:

* contain business rules already defined in the domain model
* contain presentation logic
* contain database query logic directly
* bypass domain invariants

Those responsibilities belong to other layers.

---

# 4. Command-based architecture

The application layer should use a **command-based architecture**.

Each command corresponds to a use case.

Examples:

```text
SubmitProposalCommand
CastVoteCommand
ApproveMembershipCommand
CertifyResultCommand
PublishGazetteEntryCommand
```

Each command is handled by a **command handler**.

---

# 5. Command handler pattern

Command handlers implement use cases.

Example handler:

```text
SubmitProposalHandler
```

Responsibilities:

1. validate authority
2. load proposal aggregate
3. perform transition
4. persist result
5. emit events

---

# 6. Example command flow

Example: **SubmitProposal**

```text
Client → API → SubmitProposalCommand
             ↓
       SubmitProposalHandler
             ↓
      Domain Proposal Aggregate
             ↓
       ProposalSubmitted Event
             ↓
          Persistence
```

---

# 7. Application service structure

Recommended structure:

```text
application/
  commands/
  command_handlers/
  queries/
  query_handlers/
  services/
```

---

# 8. Command objects

Commands represent requests to change system state.

Example command:

```text
SubmitProposalCommand
  proposer_id
  proposal_title
  proposal_text
```

Commands are immutable.

---

# 9. Command handler responsibilities

Command handlers perform orchestration.

Typical sequence:

```text
handle(command):
  authenticate actor
  validate authority
  load aggregates
  evaluate rules
  apply domain transitions
  persist aggregates
  emit events
  return result
```

---

# 10. Query services

Not all requests change system state.

Queries retrieve information.

Examples:

```text
GetProposal
ListBallots
GetMemberProfile
ViewGazetteIssue
```

Queries should not modify domain state.

---

# 11. Query handler pattern

Query handlers implement read operations.

Example:

```text
GetProposalQueryHandler
```

Responsibilities:

* retrieve data
* map domain objects to DTOs
* return structured responses

---

# 12. Command vs query separation

The system should follow **CQRS-style separation**.

Commands:

* change system state

Queries:

* read system state

Example separation:

```text
POST /proposals
GET  /proposals/{id}
```

---

# 13. Transaction boundaries

Application services define **transaction boundaries**.

Within a transaction:

* aggregates updated
* invariants enforced
* events emitted

If any step fails, the transaction is rolled back.

---

# 14. Domain events emission

Application services must emit domain events after successful operations.

Example:

```text
ProposalSubmitted
BallotOpened
VoteCast
ResultCertified
GazetteEntryPublished
```

Events enable:

* notifications
* projections
* auditing
* integrations

---

# 15. Event publishing model

Recommended pattern:

```text
domain event
   ↓
event dispatcher
   ↓
event handlers
```

Event handlers may trigger:

* notifications
* analytics
* read-model updates

---

# 16. Idempotency

Application services must support idempotent operations where necessary.

Example:

Casting a vote should not allow duplicates.

Mechanisms:

* unique constraints
* request IDs
* deduplication tokens

---

# 17. Error handling

Command handlers must handle errors gracefully.

Types of errors:

### Validation errors

Example:

```text
proposal_missing_required_fields
```

---

### Authority errors

Example:

```text
insufficient_authority
```

---

### Rule violations

Example:

```text
quorum_not_satisfied
```

---

### State machine violations

Example:

```text
invalid_state_transition
```

---

# 18. Service composition

Some operations involve multiple aggregates.

Example:

Certification process:

```text
Ballot
VoteTally
CertificationRecord
```

Application services orchestrate these safely.

---

# 19. Background processing

Some services require asynchronous execution.

Examples:

* vote tallying
* notifications
* record generation
* publication scheduling

These tasks should run in background workers.

---

# 20. Dependency injection

Application services should receive dependencies through injection.

Examples:

* repositories
* rule evaluators
* authority services
* event dispatchers

This improves testability.

---

# 21. Testing application services

Application services should have dedicated tests.

Test categories:

* command success cases
* authority validation
* rule evaluation
* state transitions
* event emission

---

# 22. Example command handler (pseudocode)

Example: **CastVoteHandler**

```text
handle(command):

  actor = authenticate(command.actor)

  validateAuthority(actor, "cast_vote")

  ballot = ballotRepository.load(command.ballot_id)

  ensure ballot.state == OPEN

  ensure voter eligible

  vote = createVote(actor, ballot, command.choice)

  ballot.recordVote(vote)

  ballotRepository.save(ballot)

  emitEvent(VoteCast)

  return success
```

---

# 23. Benefits of application services

Application services provide:

* structured orchestration
* consistent transaction handling
* separation of concerns
* easier testing
* predictable workflows

They are essential for large domain-driven systems.

---

# 24. Summary

Application services form the **operational layer** of the governance platform.

They:

* receive commands
* validate authority
* evaluate rules
* orchestrate domain logic
* persist state
* emit events

They translate use cases into executable system operations.

---

## Status

**Status:** Draft.
**Next document:**

`docs/application/api-design.md`

3… 2… 1… next: **Document 13 — API Design**, where we define the **REST/OpenAPI interface for the governance platform**, including endpoints for proposals, ballots, votes, certification, records, and publication.
