# Document 18 — `docs/infrastructure/background-jobs-and-workers.md`

## Purpose of this document

This document defines the **background job and worker architecture** used by the Ardtire Society Digital Governance Platform.

Earlier documents defined:

* application services
* event architecture
* projections
* repositories
* database structure

However, many system tasks should **not run synchronously within API requests**.

Examples include:

* vote tally calculations
* notification delivery
* projection updates
* publication scheduling
* event processing
* data cleanup

These tasks should execute asynchronously using **background jobs and worker processes**.

Background processing improves:

* system responsiveness
* scalability
* reliability
* separation of responsibilities

This document defines how background processing works.

---

# 1. Why background jobs are necessary

Running all operations synchronously inside API requests can lead to:

* slow user responses
* blocked API threads
* poor scalability
* cascading failures

Background workers allow the system to process heavy tasks independently.

Example:

```text
BallotClosed
   ↓
Queue job: ComputeVoteTally
```

The API request completes quickly while the worker performs the heavy task.

---

# 2. Background processing architecture

The system uses a **queue-based worker architecture**.

Conceptual structure:

```text
Application Service
        ↓
     Job Queue
        ↓
   Worker Processes
        ↓
   Task Execution
```

Jobs are placed into queues and processed asynchronously.

---

# 3. Core components

The background job system consists of:

* job producers
* job queues
* worker processes
* job storage
* retry mechanisms

Each component plays a specific role.

---

# 4. Job producers

Job producers create jobs.

Typical producers include:

* application services
* event handlers
* scheduled tasks

Example:

```text
BallotClosed event
   ↓
enqueue ComputeVoteTallyJob
```

---

# 5. Job queues

Job queues store tasks awaiting execution.

Possible technologies:

* Redis queues
* RabbitMQ
* Kafka
* database-backed queues

For most Node/TypeScript systems, common options include:

* BullMQ
* Temporal
* NATS queues

---

# 6. Worker processes

Workers are separate processes responsible for executing jobs.

Example structure:

```text
workers/
  projection-worker
  notification-worker
  governance-worker
  cleanup-worker
```

Each worker listens to a queue and processes jobs.

---

# 7. Job lifecycle

Jobs move through several stages.

```text
Created
   ↓
Queued
   ↓
Processing
   ↓
Completed
```

If a job fails, it may move to:

```text
Retry
   ↓
Dead Letter Queue
```

---

# 8. Idempotency requirement

Background jobs must be **idempotent**.

Meaning:

Running the job twice should not produce incorrect results.

Example:

```text
ComputeVoteTally
```

Re-running should produce the same tally.

---

# 9. Retry strategies

Jobs may fail due to temporary issues.

Retry strategies include:

* exponential backoff
* fixed retry counts
* delayed retries

Example:

```text
Retry 3 times
Delay: 30s → 2m → 10m
```

---

# 10. Dead letter queue

If a job fails repeatedly, it is moved to a **dead letter queue**.

Example table or queue:

```text
dead_letter_jobs
```

These jobs require manual inspection.

---

# 11. Core background jobs

The governance platform requires several important background jobs.

Examples include:

* compute vote tallies
* update projections
* send notifications
* schedule publication
* rebuild projections
* cleanup expired sessions

---

# 12. Vote tally job

Job name:

```text
ComputeVoteTallyJob
```

Triggered by:

```text
BallotClosed event
```

Steps:

1. retrieve votes
2. compute totals
3. evaluate quorum
4. evaluate thresholds
5. update projection
6. emit VoteTallyComputed event

---

# 13. Projection update job

Job name:

```text
UpdateProjectionJob
```

Triggered by:

```text
domain events
```

Steps:

1. read event
2. update projection tables
3. mark event processed

---

# 14. Notification job

Job name:

```text
SendNotificationJob
```

Triggered by:

```text
ProposalSubmitted
BallotOpened
ResultCertified
GazettePublished
```

Actions may include:

* email
* in-app notification
* push notification

---

# 15. Publication scheduling job

Job name:

```text
PublishGazetteIssueJob
```

Triggered by:

* scheduled publication time

Steps:

1. collect publication entries
2. generate gazette issue
3. publish to public interface
4. emit GazettePublished event

---

# 16. Event processing job

Job name:

```text
ProcessEventHandlersJob
```

Triggered by:

* event bus publishing

Tasks include:

* update projections
* trigger notifications
* generate records

---

# 17. Projection rebuild job

Job name:

```text
RebuildProjectionsJob
```

Used when:

* projection schema changes
* projection bug discovered

Steps:

```text
clear projection tables
replay events
rebuild projections
```

---

# 18. Data cleanup job

Job name:

```text
CleanupExpiredDataJob
```

Tasks include:

* removing expired sessions
* archiving old system logs
* rotating temporary files

---

# 19. Worker isolation

Workers should run as **separate processes**.

Benefits:

* crash isolation
* independent scaling
* improved reliability

Example deployment:

```text
web-api
worker-projections
worker-notifications
worker-governance
```

---

# 20. Worker concurrency

Workers may process multiple jobs simultaneously.

Example configuration:

```text
concurrency: 10
```

This improves throughput.

However, concurrency must respect:

* database limits
* event ordering requirements

---

# 21. Job monitoring

The job system should expose metrics:

* queue length
* processing time
* failure counts
* retry counts

Monitoring tools may include:

* Prometheus
* Grafana
* queue dashboards

---

# 22. Job tracing

Each job should include trace identifiers.

Example metadata:

```text
job_id
correlation_id
causation_id
```

This allows tracing workflows across services.

---

# 23. Security considerations

Jobs must respect authority rules.

Workers should never bypass:

* rule validation
* authority checks

Sensitive operations must remain controlled.

---

# 24. Deployment considerations

Workers may run on separate infrastructure nodes.

Example architecture:

```text
API Servers
   │
Job Queue
   │
Worker Cluster
```

Workers can scale horizontally.

---

# 25. Example job handler pseudocode

Example:

```text
handle ComputeVoteTallyJob:

  ballot = ballotRepository.findById(job.ballot_id)

  votes = voteRepository.findByBallot(ballot.id)

  tally = computeTally(votes)

  projectionRepository.updateVoteTally(ballot.id, tally)

  emitEvent(VoteTallyComputed)
```

---

# 26. Benefits of background workers

Background processing provides:

* improved performance
* better scalability
* resilient workflows
* separation of responsibilities

It is essential for complex governance platforms.

---

# 27. Summary

The background job system executes asynchronous operations such as:

* vote tally computation
* projection updates
* notification delivery
* publication scheduling
* data maintenance

Jobs are processed by worker processes using queue-based execution.

This architecture ensures the platform remains responsive and scalable.

---

## Status

**Status:** Draft.
**Next document:**

`docs/infrastructure/observability-and-audit.md`

3… 2… 1… next: **Document 19 — Observability and Audit**, where we define **logging, monitoring, tracing, and institutional audit capabilities of the governance platform.**

This will also define how the system preserves **governance transparency and traceability**.
