# Document 15 — `docs/application/read-models-and-projections.md`

## Purpose of this document

This document defines the **read model and projection architecture** used by the Ardtire Society Digital Governance Platform.

Earlier documents introduced:

* domain entities and aggregates
* use cases
* application services
* event-driven architecture

However, the **domain model is not optimized for reading data**.

Domain models are optimized for:

* consistency
* rule enforcement
* state transitions

User interfaces, dashboards, and reporting systems require **fast, queryable views of data**.

For example:

* proposal listings
* active ballots
* vote results
* membership directories
* gazette archives

Instead of querying complex domain aggregates directly, the platform builds **read models** derived from **domain events**.

These read models are called **projections**.

---

# 1. Why projections are necessary

Directly querying domain aggregates leads to several problems:

* slow queries
* complicated joins
* complex reconstruction of historical states
* heavy transactional coupling

Projections solve this by maintaining **pre-computed views**.

Example:

Instead of calculating vote tallies on every request, a projection stores:

```text
proposal_vote_summary
```

This allows instant retrieval.

---

# 2. CQRS separation

The platform follows a **CQRS-style architecture**:

**Command side**

Handles:

* domain state
* rules
* state transitions

**Query side**

Handles:

* projections
* dashboards
* list views
* reporting

Example separation:

```text
Commands → Domain Aggregates → Events
Queries → Read Models / Projections
```

---

# 3. Projection creation flow

Projections are built from events.

Example flow:

```text
Domain Event
   ↓
Projection Handler
   ↓
Update Read Model
```

Example:

```text
VoteCast event
   ↓
Update vote tally projection
```

---

# 4. Projection characteristics

Projections should be:

* denormalized
* optimized for queries
* eventually consistent
* rebuildable from events

Projections are **not the source of truth**.

The source of truth remains the domain aggregates and event log.

---

# 5. Projection update strategies

There are two primary strategies.

### Real-time projections

Events immediately update read models.

Advantages:

* fresh data

Disadvantages:

* higher event load

---

### Asynchronous projections

Events are processed in background workers.

Advantages:

* better scalability

Disadvantages:

* small delay before updates appear

For governance systems, **asynchronous projections are usually acceptable**.

---

# 6. Core projections required

The Ardtire platform requires several core projections.

Key projections include:

1. proposal list view
2. proposal detail view
3. ballot status dashboard
4. vote tally summary
5. membership directory
6. governance body directory
7. officeholder registry
8. gazette archive
9. official record index

Each projection is optimized for specific queries.

---

# 7. Proposal list projection

Purpose:

Display all proposals quickly.

Example structure:

```text
proposal_list_projection
```

Fields:

* proposal_id
* title
* proposer_name
* current_stage
* submission_date
* vote_status

Updated by events:

```text
ProposalSubmitted
ProposalAmended
BallotOpened
ResultCertified
```

---

# 8. Proposal detail projection

Purpose:

Display full proposal information.

Structure:

```text
proposal_detail_projection
```

Fields:

* proposal_id
* title
* versions
* amendments
* committee assignments
* voting history

---

# 9. Ballot dashboard projection

Purpose:

Display active ballots.

Structure:

```text
ballot_dashboard_projection
```

Fields:

* ballot_id
* proposal_title
* open_time
* close_time
* participation_rate
* status

Updated by events:

```text
BallotOpened
VoteCast
BallotClosed
```

---

# 10. Vote tally projection

Purpose:

Provide vote summary.

Structure:

```text
vote_tally_projection
```

Fields:

* ballot_id
* yes_votes
* no_votes
* abstain_votes
* total_votes
* quorum_met
* threshold_met

Updated by:

```text
VoteCast
BallotClosed
```

---

# 11. Membership directory projection

Purpose:

List all members.

Structure:

```text
membership_directory_projection
```

Fields:

* member_id
* person_name
* membership_class
* membership_status
* admission_date

Updated by events:

```text
MembershipApproved
MembershipStatusChanged
```

---

# 12. Governance body projection

Purpose:

Display governance structure.

Structure:

```text
governance_body_projection
```

Fields:

* body_id
* body_name
* description
* active_members

Updated by:

```text
GovernanceBodyCreated
OfficeHolderAssigned
```

---

# 13. Officeholder registry projection

Purpose:

Track office holders.

Structure:

```text
officeholder_registry_projection
```

Fields:

* office_name
* person_name
* term_start
* term_end

Updated by:

```text
OfficeHolderAssigned
OfficeHolderTermEnded
```

---

# 14. Gazette archive projection

Purpose:

Provide public access to gazette publications.

Structure:

```text
gazette_archive_projection
```

Fields:

* issue_id
* publication_date
* entries

Updated by events:

```text
GazetteIssueCreated
GazetteEntryPublished
```

---

# 15. Official records projection

Purpose:

Provide searchable institutional record index.

Structure:

```text
official_record_projection
```

Fields:

* record_id
* record_type
* creation_date
* related_entity

Updated by:

```text
OfficialRecordCreated
RecordArchived
```

---

# 16. Projection storage

Projections may be stored in dedicated tables.

Example:

```text
projections_proposal_list
projections_ballot_dashboard
projections_vote_tally
```

These tables are optimized for reads.

---

# 17. Projection rebuilds

Because projections are derived from events, they can be rebuilt.

Rebuild workflow:

```text
clear projections
replay event log
rebuild projections
```

This allows fixing projection bugs.

---

# 18. Handling projection lag

Because projections may be eventually consistent, the system must handle small delays.

Example UI message:

```text
Vote recorded successfully.
Results updating…
```

This avoids user confusion.

---

# 19. Projection idempotency

Projection handlers must tolerate repeated events.

Example:

```text
if event already applied:
    ignore
```

This prevents double updates.

---

# 20. Projection performance

To ensure fast queries:

* index key fields
* avoid joins where possible
* denormalize data

Example:

Store proposer name directly in proposal list projection.

---

# 21. Projection versioning

Projection schemas may evolve.

Strategies:

* versioned projection tables
* rebuild on schema change

Example:

```text
proposal_list_projection_v2
```

---

# 22. Security considerations

Projections must respect access rules.

Example:

* vote details may be restricted
* membership directory may have privacy filters

Sensitive data should not be exposed in public projections.

---

# 23. Monitoring projections

Projection systems should expose metrics:

* projection lag
* failed projection handlers
* rebuild duration

This helps maintain reliability.

---

# 24. Relationship to UI

Most UI views rely entirely on projections.

Example UI mapping:

| UI Page          | Projection                  |
| ---------------- | --------------------------- |
| Proposal list    | proposal_list_projection    |
| Ballot dashboard | ballot_dashboard_projection |
| Gazette archive  | gazette_archive_projection  |

This ensures fast page loads.

---

# 25. Summary

Read models and projections allow the governance platform to provide **fast query access** while maintaining a strict domain model.

Key concepts include:

* event-driven projections
* CQRS separation
* denormalized read models
* projection rebuild capability
* eventual consistency

By separating read models from domain aggregates, the system achieves both:

* **strong governance integrity**
* **high-performance user interfaces**

---

## Status

**Status:** Draft.
**Next document:**

`docs/infrastructure/database-architecture.md`

3… 2… 1… next: **Document 16 — Database Architecture**, where we define the **PostgreSQL schema strategy, event store, projections storage, and persistence patterns for the entire platform.**
