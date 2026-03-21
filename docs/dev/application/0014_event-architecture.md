# Document 14 — `docs/application/event-architecture.md`

## Purpose of this document

This document defines the **event architecture** of the Ardtire Society Digital Governance Platform.

Governance platforms generate a large number of meaningful institutional actions:

* proposals submitted
* votes cast
* ballots closed
* results certified
* records published

These actions represent **events that occur within the institution**.

Instead of tightly coupling every subsystem to direct API calls or database queries, the platform uses **event-driven architecture**.

Events allow the system to:

* maintain a complete institutional audit trail
* decouple services
* trigger workflows automatically
* update read models
* send notifications
* integrate external systems

This document defines how events are structured, stored, and processed.

---

# 1. What is an event

An event represents **a meaningful occurrence in the system**.

Example events:

```text
ProposalSubmitted
BallotOpened
VoteCast
BallotClosed
ResultCertified
GazetteEntryPublished
```

Events represent **facts that have already happened**.

They are immutable.

---

# 2. Event architecture goals

The event architecture must provide:

1. **auditability**
2. **decoupled system components**
3. **reliable background processing**
4. **projection updates**
5. **notification triggers**
6. **integration hooks**

---

# 3. Types of events

The platform uses several categories of events.

## Domain events

Events that represent meaningful domain changes.

Examples:

```text
ProposalSubmitted
VoteCast
ResultCertified
```

---

## System events

Events triggered by internal system behavior.

Examples:

```text
BallotExpired
NotificationSent
ProjectionRebuilt
```

---

## Integration events

Events intended for external systems.

Examples:

```text
GazettePublished
GovernanceRecordUpdated
```

---

# 4. Event lifecycle

Events move through several stages.

```text
Event Created
   ↓
Event Stored
   ↓
Event Published
   ↓
Event Handled
```

This ensures events are reliably processed.

---

# 5. Event structure

Every event should follow a consistent schema.

Example structure:

```json
{
  "event_id": "evt_123",
  "event_type": "ProposalSubmitted",
  "timestamp": "2028-05-01T12:00:00Z",
  "actor_id": "person_42",
  "entity_type": "Proposal",
  "entity_id": "proposal_789",
  "payload": {
    "title": "Proposal Title"
  }
}
```

---

# 6. Event metadata

Each event must include metadata.

Required metadata fields:

| Field          | Purpose               |
| -------------- | --------------------- |
| event_id       | unique identifier     |
| event_type     | event classification  |
| timestamp      | event occurrence time |
| actor_id       | initiating actor      |
| entity_type    | affected entity       |
| entity_id      | entity identifier     |
| correlation_id | request trace         |
| causation_id   | originating event     |

---

# 7. Event naming conventions

Event names must follow the pattern:

```text
EntityActionPastTense
```

Examples:

```text
ProposalSubmitted
BallotOpened
VoteCast
ResultCertified
GazettePublished
```

Avoid generic names such as:

```text
ItemUpdated
ObjectChanged
```

---

# 8. Event storage

Events should be stored in an **event log**.

Example table:

```text
events
```

Columns:

* event_id
* event_type
* entity_id
* entity_type
* actor_id
* timestamp
* payload
* metadata

This log forms the **institutional activity history**.

---

# 9. Event publishing

After being stored, events must be published to the event bus.

Flow:

```text
Application Service
   ↓
Event Store
   ↓
Event Bus
   ↓
Event Handlers
```

---

# 10. Event bus

The event bus distributes events to interested handlers.

Possible implementations:

* internal event dispatcher
* message queue
* streaming platform

Examples:

* Redis streams
* Kafka
* NATS
* RabbitMQ

For early phases, a simple internal dispatcher may suffice.

---

# 11. Event handlers

Event handlers react to events.

Example handlers:

```text
SendNotificationHandler
UpdateProjectionHandler
CreateOfficialRecordHandler
TriggerPublicationHandler
```

Handlers must be **idempotent**.

---

# 12. Projection updates

Events update **read models (projections)** used by the UI.

Example projections:

```text
proposal_list
ballot_status
vote_tallies
member_profiles
gazette_entries
```

Projections allow fast queries.

---

# 13. Notification triggers

Certain events trigger notifications.

Example mapping:

| Event             | Notification           |
| ----------------- | ---------------------- |
| ProposalSubmitted | notify reviewers       |
| BallotOpened      | notify voters          |
| ResultCertified   | notify governance body |
| GazettePublished  | notify subscribers     |

---

# 14. Audit log

The event store doubles as an **institutional audit log**.

This allows reconstruction of system activity.

Example query:

```text
SELECT * FROM events
WHERE entity_id = 'proposal_123'
```

This reveals the entire proposal history.

---

# 15. Event ordering

Events must maintain chronological order.

Important rules:

* timestamps recorded in UTC
* ordering by event sequence ID

This ensures reliable event replay.

---

# 16. Idempotent processing

Event handlers must tolerate duplicate events.

Example strategy:

```text
if event_id already processed:
    ignore
```

This prevents repeated actions.

---

# 17. Event replay

The system must support **event replay**.

Replay allows rebuilding projections from the event log.

Example workflow:

```text
replay events
→ rebuild proposal projection
→ rebuild ballot projection
→ rebuild vote tallies
```

---

# 18. Event schema evolution

Event schemas may evolve.

Strategies:

* versioned event types
* backward compatibility
* migration handlers

Example:

```text
ProposalSubmitted_v2
```

---

# 19. Dead letter handling

If an event handler fails repeatedly, the event should move to a **dead letter queue**.

Example:

```text
dead_letter_events
```

This prevents processing loops.

---

# 20. Event retention

Event logs should be retained indefinitely for governance systems.

Historical traceability is critical.

Archival strategies may include:

* cold storage
* partitioned event logs

---

# 21. Security considerations

Event logs must be protected.

Sensitive data should not be exposed unnecessarily.

Possible strategies:

* encrypted payloads
* restricted event access

---

# 22. Observability

The event system should expose metrics:

* events processed
* handler failures
* queue backlog

This supports operational monitoring.

---

# 23. Event-driven workflows

Complex workflows may be event-driven.

Example:

```text
BallotClosed
   ↓
VoteTallyComputed
   ↓
ResultPendingCertification
   ↓
CertificationRequested
```

This reduces synchronous dependencies.

---

# 24. Event architecture diagram

Conceptual structure:

```text
Application Service
      ↓
   Event Store
      ↓
    Event Bus
      ↓
Event Handlers
  ├─ Notifications
  ├─ Projections
  ├─ Records
  └─ Integrations
```

---

# 25. Benefits of event architecture

Event-driven design provides:

* strong audit trails
* decoupled components
* reliable workflows
* scalable architecture
* historical traceability

These properties are essential for governance systems.

---

# 26. Summary

The Ardtire governance platform uses an **event-driven architecture** to coordinate system behavior.

Key elements include:

* domain events
* event store
* event bus
* event handlers
* projections
* notification triggers

This architecture ensures that institutional actions are:

* recorded
* traceable
* reproducible
* observable

---

## Status

**Status:** Draft.
**Next document:**

`docs/application/read-models-and-projections.md`

3… 2… 1… next: **Document 15 — Read Models and Projections**, where we define how the system builds **fast queryable views (proposal lists, ballot dashboards, member directories, gazette listings)** from domain events.
