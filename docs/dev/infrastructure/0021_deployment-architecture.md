# Document 21 — `docs/infrastructure/deployment-architecture.md`

## Purpose of this document

This document defines the **deployment architecture** of the Ardtire Society Digital Governance Platform.

Earlier documents defined:

* domain architecture
* application services
* API interfaces
* event architecture
* database architecture
* background workers
* observability
* security model

This document now defines **how the system runs in production infrastructure**.

The deployment architecture must support:

* reliability
* scalability
* security
* observability
* maintainability

Governance systems must remain **highly available and operationally resilient**.

---

# 1. Deployment architecture goals

The infrastructure must support several critical goals.

### High availability

Governance systems must remain operational even during infrastructure failures.

---

### Horizontal scalability

Traffic and event workloads must scale as the system grows.

---

### Isolation of responsibilities

Different services must run independently.

---

### Operational observability

Operators must be able to monitor system health.

---

### Secure infrastructure

Infrastructure must enforce strong security boundaries.

---

# 2. System components

The platform consists of several runtime components.

```text
Web Application
Governance API
Background Workers
Database
Event Queue
Identity Provider
Observability Stack
```

Each component runs as an independent service.

---

# 3. High-level system diagram

Conceptual deployment structure:

```text
Users
  ↓
Web Application
  ↓
Governance API
  ↓
Application Services
  ↓
Database
```

Supporting infrastructure:

```text
Event Queue
Worker Cluster
Identity Provider
Monitoring Systems
```

---

# 4. Web application

The web application provides the user interface.

Responsibilities include:

* member dashboards
* proposal drafting interfaces
* voting interfaces
* governance dashboards
* administrative tools

Technology stack (from earlier architecture):

* TanStack Start
* SolidJS
* TypeScript

Deployment options include:

* containerized web server
* edge deployment
* static assets via CDN

---

# 5. Governance API

The Governance API is the **central application backend**.

Responsibilities include:

* handling commands
* enforcing authority
* executing domain logic
* interacting with repositories
* emitting events

The API should run as a horizontally scalable service.

Example runtime:

```text
Node.js / Hono
```

Multiple instances may run behind a load balancer.

---

# 6. Background worker cluster

Workers process asynchronous jobs.

Workers handle tasks such as:

* vote tallying
* projection updates
* notifications
* publication scheduling

Workers run as independent processes.

Example worker groups:

```text
projection-workers
notification-workers
governance-workers
cleanup-workers
```

Workers can scale independently.

---

# 7. Event queue

The event queue enables asynchronous processing.

Responsibilities:

* distributing events
* buffering workloads
* enabling worker scaling

Possible technologies:

* Redis streams
* NATS
* Kafka
* RabbitMQ

The queue decouples services.

---

# 8. Database deployment

The database stores:

* domain data
* event logs
* projections
* audit records

Recommended deployment:

```text
Primary PostgreSQL instance
   ↓
Read replicas
```

Read replicas can serve:

* projections
* analytics
* reporting

---

# 9. Identity provider

Authentication is managed by an external identity provider.

Example:

```text
Keycloak
```

The identity provider handles:

* login flows
* token issuance
* identity federation

It runs as a separate service.

---

# 10. Load balancing

API traffic must pass through a load balancer.

Responsibilities include:

* distributing requests
* health checking
* TLS termination

Example components:

* reverse proxy
* cloud load balancer

---

# 11. Containerization

All services should be containerized.

Example runtime:

```text
Docker containers
```

Containers provide:

* consistent environments
* reproducible deployments
* isolation

---

# 12. Container orchestration

Containers should be orchestrated using a platform such as:

```text
Kubernetes
```

Orchestration provides:

* automated deployment
* scaling
* service discovery
* health management

---

# 13. Service separation

Each service should run independently.

Example service layout:

```text
web-app
governance-api
worker-projections
worker-notifications
worker-governance
keycloak
postgres
redis
```

Service isolation improves resilience.

---

# 14. Environment separation

Different environments must exist.

Typical environments include:

```text
development
staging
production
```

Each environment uses separate infrastructure.

---

# 15. Configuration management

Configuration must not be hard-coded.

Configuration sources include:

* environment variables
* configuration services
* secrets managers

Example configuration items:

* database connection strings
* queue endpoints
* identity provider URLs

---

# 16. Continuous integration

Continuous integration pipelines must run:

* tests
* linting
* type checking
* build validation

Example pipeline stages:

```text
install dependencies
run tests
build containers
push artifacts
```

---

# 17. Continuous deployment

Deployment pipelines should support automated deployment.

Typical flow:

```text
commit → CI pipeline → container image → deployment
```

Deployments must support:

* rollback capability
* health checks

---

# 18. Horizontal scaling

Services should scale horizontally.

Example:

```text
governance-api replicas: 3
worker replicas: 5
```

Scaling ensures performance during heavy workloads.

---

# 19. Health checks

Each service must expose health endpoints.

Example:

```text
GET /health
```

Health checks allow orchestration systems to detect failures.

---

# 20. Infrastructure monitoring

Monitoring must track:

* service health
* CPU usage
* memory usage
* request latency
* job queue backlog

Metrics should feed into dashboards.

---

# 21. Disaster recovery

The system must support disaster recovery.

Strategies include:

* database backups
* infrastructure replication
* deployment automation

Recovery procedures must be documented.

---

# 22. Deployment security

Infrastructure must enforce security controls.

Examples:

* network segmentation
* firewall rules
* TLS encryption
* restricted administrative access

---

# 23. Scaling workers independently

Worker scaling should respond to queue load.

Example:

```text
queue length > threshold
   ↓
scale worker replicas
```

This prevents backlog accumulation.

---

# 24. Deployment architecture diagram

Conceptual infrastructure:

```text
Users
   ↓
CDN
   ↓
Web Application
   ↓
Load Balancer
   ↓
Governance API
   ↓
Event Queue
   ↓
Worker Cluster
   ↓
PostgreSQL Database
```

Supporting services:

```text
Keycloak
Prometheus
Grafana
Log Aggregator
```

---

# 25. Benefits of this architecture

This deployment model provides:

* high availability
* horizontal scalability
* service isolation
* operational transparency
* infrastructure security

These characteristics are essential for reliable governance systems.

---

# 26. Summary

The deployment architecture consists of several independent components:

* web application
* governance API
* worker cluster
* event queue
* PostgreSQL database
* identity provider
* observability stack

Containerization and orchestration ensure the platform can scale and remain resilient.

---

## Status

**Status:** Draft.
**Next document:**

`docs/infrastructure/environment-and-config.md`

3… 2… 1… next: **Document 22 — Environment and Configuration Management**, where we define how environment variables, secrets, and configuration settings are managed across development, staging, and production environments.
