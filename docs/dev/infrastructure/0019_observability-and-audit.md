# Document 19 — `docs/infrastructure/observability-and-audit.md`

## Purpose of this document

This document defines the **observability and audit architecture** of the Ardtire Society Digital Governance Platform.

Governance systems must provide **strong transparency, traceability, and accountability**.

Unlike many typical software systems, governance platforms must be able to answer questions such as:

* Who performed this action?
* When did it occur?
* Under what authority was it performed?
* Which rules governed the decision?
* What events led to this outcome?

To answer these questions, the system must maintain:

* structured logging
* traceable workflows
* event histories
* audit trails
* operational monitoring

This document describes how the system achieves those capabilities.

---

# 1. Observability vs audit

Although related, **observability** and **audit** serve different purposes.

| Capability    | Purpose                               |
| ------------- | ------------------------------------- |
| Observability | Understand system behavior            |
| Audit         | Preserve institutional accountability |

Observability helps engineers operate the system.

Audit ensures **institutional legitimacy**.

Both are required.

---

# 2. Observability components

Observability consists of three core components:

```text
Logging
Metrics
Tracing
```

These together allow engineers to understand system behavior.

---

# 3. Logging

Logs record **system events and internal operations**.

Examples include:

* API requests
* errors
* worker execution
* background job processing
* database errors

Logs should be structured.

Example log entry:

```json
{
  "timestamp": "2028-05-01T10:22:03Z",
  "level": "info",
  "service": "gov-api",
  "event": "proposal_submitted",
  "actor_id": "person_42",
  "proposal_id": "proposal_123"
}
```

Structured logs enable automated analysis.

---

# 4. Logging levels

Logs should use standard levels:

| Level | Purpose                          |
| ----- | -------------------------------- |
| DEBUG | detailed development diagnostics |
| INFO  | normal operational events        |
| WARN  | unusual conditions               |
| ERROR | operational failures             |
| FATAL | critical system failure          |

Production systems typically record INFO and above.

---

# 5. Log storage

Logs should be centralized.

Recommended architecture:

```text
Application Services
        ↓
Structured Logs
        ↓
Log Aggregator
        ↓
Log Storage
```

Common tools include:

* Loki
* Elasticsearch
* OpenSearch

---

# 6. Metrics

Metrics provide **quantitative insight into system behavior**.

Examples:

* API request rate
* job queue length
* vote tally processing time
* database query latency
* event processing throughput

Metrics help detect:

* system overload
* performance degradation
* infrastructure problems

---

# 7. Metrics collection

Metrics are collected by instrumentation within services.

Example metric names:

```text
api_requests_total
ballots_opened_total
votes_cast_total
event_processing_latency
```

Metrics should include labels such as:

* service
* endpoint
* result status

---

# 8. Metrics storage

Metrics are typically stored in a time-series database.

Common tools include:

* Prometheus
* VictoriaMetrics
* TimescaleDB

These systems support long-term monitoring.

---

# 9. Metrics visualization

Metrics dashboards allow operators to observe system behavior.

Common visualization tools:

* Grafana
* Kibana

Example dashboards:

* API performance
* event processing throughput
* background worker health

---

# 10. Distributed tracing

Distributed tracing tracks requests across services.

Example request flow:

```text
User Request
   ↓
API
   ↓
Application Service
   ↓
Repository
   ↓
Database
```

Tracing allows engineers to understand:

* latency sources
* request flows
* service interactions

---

# 11. Trace identifiers

Each request should include a **trace ID**.

Example metadata:

```text
trace_id
span_id
correlation_id
```

These identifiers allow linking logs across services.

---

# 12. Observability stack example

A typical stack might include:

```text
Prometheus → metrics
Grafana → visualization
Loki → logs
OpenTelemetry → tracing
```

This stack provides comprehensive observability.

---

# 13. Audit architecture

Audit capabilities go beyond operational logs.

Audit records capture **institutionally meaningful actions**.

Examples include:

* proposal submission
* vote casting
* result certification
* membership approval
* rule changes

Audit records must be preserved.

---

# 14. Audit event structure

Audit events should include:

| Field            | Description             |
| ---------------- | ----------------------- |
| audit_id         | unique identifier       |
| actor_id         | actor performing action |
| action_type      | action performed        |
| entity_type      | affected entity         |
| entity_id        | entity identifier       |
| timestamp        | event time              |
| authority_source | role or office used     |
| rule_version     | rules applied           |

Example audit record:

```json
{
  "audit_id": "audit_123",
  "actor_id": "person_42",
  "action": "CertifyResult",
  "entity_id": "ballot_987",
  "authority_source": "CertificationAuthority",
  "timestamp": "2029-01-10T14:33:02Z"
}
```

---

# 15. Audit storage

Audit records are stored in dedicated tables.

Example:

```text
audit.audit_events
```

These tables must be append-only.

Audit records should never be silently modified.

---

# 16. Immutable audit logs

Audit logs should be treated as immutable.

Recommended protections:

* restricted write permissions
* append-only design
* optional cryptographic verification

This protects institutional integrity.

---

# 17. Governance audit coverage

All governance actions must generate audit records.

Examples:

```text
MembershipApproved
ProposalSubmitted
BallotOpened
VoteCast
ResultCertified
GazettePublished
```

Each action records:

* actor
* authority
* rule references

---

# 18. Public transparency

Some audit information may be exposed publicly.

Examples:

* gazette publications
* official records
* vote results

However, sensitive information must remain private.

---

# 19. Security event logging

Security-related actions must also be logged.

Examples:

* login attempts
* permission changes
* authority assignments
* failed authorization attempts

These logs help detect misuse.

---

# 20. Incident investigation

Audit logs support incident investigation.

Example scenario:

Question:

> “Why was this proposal rejected?”

Audit trail reveals:

* committee review
* voting outcome
* certification decision

---

# 21. Retention policies

Audit records should be retained indefinitely where possible.

Institutional history is valuable.

At minimum:

* governance decisions must never be deleted.

---

# 22. Monitoring alerts

Monitoring systems should trigger alerts when issues occur.

Examples:

* API error rate spikes
* worker job failures
* event processing backlog
* database replication lag

Alerts should notify operators.

---

# 23. Compliance considerations

Observability and audit systems help ensure compliance with governance standards.

They allow the institution to demonstrate:

* procedural correctness
* transparency
* accountability

---

# 24. Operational dashboards

Operators should have access to dashboards showing:

* system health
* governance activity
* worker performance
* error rates

These dashboards support reliable operation.

---

# 25. Summary

Observability and audit capabilities ensure the governance platform remains:

* transparent
* accountable
* reliable
* maintainable

Key components include:

* structured logging
* metrics collection
* distributed tracing
* event history
* immutable audit logs

Together they provide both **operational insight** and **institutional accountability**.

---

## Status

**Status:** Draft.
**Next document:**

`docs/infrastructure/security-architecture.md`

3… 2… 1… next: **Document 20 — Security Architecture**, where we define the full **security model of the platform**, including authentication, authorization, encryption, and infrastructure security.
