# Document 16 — `docs/infrastructure/database-architecture.md`

## Purpose of this document

This document defines the **database architecture** of the Ardtire Society Digital Governance Platform.

Earlier documents defined:

* the domain model
* governance rules
* authority system
* state machines
* application services
* event architecture
* projections and read models

This document translates those concepts into **persistent storage architecture**.

The database layer must support:

* domain aggregates
* rule storage
* authority assignments
* event logs
* read model projections
* audit trails

The system uses **PostgreSQL as the primary data store**.

---

# 1. Database architecture goals

The database architecture must provide:

* strong transactional integrity
* event storage
* projection storage
* rule versioning
* high query performance
* auditability
* scalability

Governance systems require **high reliability and traceability**.

---

# 2. Database model layers

The database is organized into several logical layers.

```text
Domain Tables
Event Store
Projection Tables
Authority Tables
Governance Rule Tables
Operational Tables
```

Each layer serves a specific function.

---

# 3. PostgreSQL as primary database

PostgreSQL is selected because it provides:

* strong ACID guarantees
* mature indexing capabilities
* JSON support
* excellent concurrency handling
* rich query capabilities

It is well suited for governance systems that require **durable institutional records**.

---

# 4. Schema organization

Recommended schema structure:

```text
core
events
projections
rules
authority
audit
system
```

Each schema isolates a logical subsystem.

---

# 5. Core domain tables

Core domain tables represent aggregates.

Examples:

```text
core.persons
core.members
core.proposals
core.proposal_versions
core.amendments
core.ballots
core.votes
core.certifications
core.records
core.gazette_issues
core.gazette_entries
```

These tables represent **canonical domain state**.

---

# 6. Event store tables

Events are stored in a dedicated schema.

```text
events.event_log
```

Example columns:

| Column      | Description          |
| ----------- | -------------------- |
| event_id    | unique identifier    |
| event_type  | event classification |
| entity_type | domain entity        |
| entity_id   | entity reference     |
| actor_id    | actor responsible    |
| timestamp   | event time           |
| payload     | JSON payload         |
| metadata    | additional context   |

This table represents the **institutional activity history**.

---

# 7. Projection tables

Projection tables store read models.

Examples:

```text
projections.proposal_list
projections.proposal_detail
projections.ballot_dashboard
projections.vote_tally
projections.membership_directory
projections.officeholder_registry
projections.gazette_archive
```

These tables are optimized for UI queries.

---

# 8. Governance rule tables

Rules are stored separately to allow versioning.

Example tables:

```text
rules.governance_rules
rules.rule_versions
rules.rule_parameters
```

This allows procedural rules to evolve over time.

---

# 9. Authority tables

Authority assignments are stored here.

Example tables:

```text
authority.roles
authority.role_assignments
authority.offices
authority.office_holders
authority.delegations
authority.authority_grants
```

These tables support the **authority evaluation model**.

---

# 10. Audit tables

Audit tables track system activity.

Examples:

```text
audit.audit_events
audit.login_events
audit.security_events
```

These tables complement the event log.

---

# 11. System tables

System-level operational tables include:

```text
system.jobs
system.notifications
system.settings
system.migrations
```

These tables support infrastructure operations.

---

# 12. Domain table design example

Example table: `core.proposals`

| Column             | Type      |
| ------------------ | --------- |
| proposal_id        | UUID      |
| title              | TEXT      |
| proposer_member_id | UUID      |
| lifecycle_stage    | TEXT      |
| created_at         | TIMESTAMP |
| updated_at         | TIMESTAMP |

Indexes should be added on frequently queried fields.

---

# 13. Event log table example

Example structure:

```text
events.event_log
```

Columns:

| Column      | Type      |
| ----------- | --------- |
| event_id    | UUID      |
| event_type  | TEXT      |
| entity_type | TEXT      |
| entity_id   | UUID      |
| actor_id    | UUID      |
| timestamp   | TIMESTAMP |
| payload     | JSONB     |
| metadata    | JSONB     |

Indexes:

* timestamp index
* entity_id index
* event_type index

---

# 14. Projection table example

Example:

```text
projections.proposal_list
```

Columns:

| Column          | Type      |
| --------------- | --------- |
| proposal_id     | UUID      |
| title           | TEXT      |
| proposer_name   | TEXT      |
| lifecycle_stage | TEXT      |
| submission_date | TIMESTAMP |
| vote_status     | TEXT      |

This projection is optimized for list queries.

---

# 15. Indexing strategy

Indexes are essential for performance.

Recommended indexes:

* entity identifiers
* timestamps
* foreign keys
* frequently filtered fields

Example:

```text
CREATE INDEX idx_proposal_stage
ON core.proposals (lifecycle_stage)
```

---

# 16. Foreign key strategy

Foreign keys enforce referential integrity.

Example:

```text
proposal_versions.proposal_id
→ proposals.proposal_id
```

However, some event store relationships may rely on soft references.

---

# 17. JSON storage usage

PostgreSQL JSONB fields are useful for:

* event payloads
* rule parameters
* metadata

Example:

```text
payload JSONB
```

This allows flexible schema evolution.

---

# 18. Migration strategy

Database schema changes must be versioned.

Recommended tool:

* Prisma migrations

Migration workflow:

```text
update schema
generate migration
review migration
apply migration
```

All schema changes must be tracked.

---

# 19. Backup strategy

Governance systems require strong backup practices.

Recommended approach:

* automated daily backups
* point-in-time recovery
* offsite backup storage

---

# 20. Replication strategy

To support scalability and resilience:

* primary database
* read replicas for projections and reporting

This reduces load on the primary instance.

---

# 21. Transaction handling

Domain operations must run inside transactions.

Example operations:

* proposal submission
* vote casting
* certification

Transactions ensure consistency.

---

# 22. Data retention policies

Certain data must be retained indefinitely.

Examples:

* event logs
* official records
* gazette publications

Retention policies must respect institutional requirements.

---

# 23. Performance considerations

Performance strategies include:

* query optimization
* indexing
* projection tables
* caching layers

Large queries should avoid scanning domain tables directly.

---

# 24. Security considerations

Database security must include:

* encrypted connections
* role-based access
* restricted administrative access

Sensitive data should be protected.

---

# 25. Monitoring

Database monitoring should track:

* query performance
* replication health
* disk usage
* connection counts

Tools may include:

* Prometheus
* Grafana

---

# 26. Database architecture diagram

Conceptual layout:

```text
Application Services
        │
        ▼
PostgreSQL
 ├─ core
 ├─ events
 ├─ projections
 ├─ rules
 ├─ authority
 ├─ audit
 └─ system
```

---

# 27. Summary

The database architecture supports the governance platform through several layers:

* domain tables
* event log
* projection tables
* rule storage
* authority assignments
* audit records

Using PostgreSQL provides the durability, integrity, and flexibility required for governance systems.

The database acts as the **institutional memory of the platform**.

---

## Status

**Status:** Draft.
**Next document:**

`docs/infrastructure/repository-pattern.md`

3… 2… 1… next: **Document 17 — Repository Pattern**, where we define **how the application interacts with the database through domain repositories instead of direct queries.**
