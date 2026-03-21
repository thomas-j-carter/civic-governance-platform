# Repository Glossary

This glossary defines cross-cutting terms used throughout the Ardtire Civic Governance Platform repository.

This is the repository-wide glossary, not the full domain-specific glossary. For deeper governance and lifecycle terminology, also see `docs/02-domain/glossary.md`.

## Purpose

The purpose of this glossary is to reduce ambiguity and enforce consistent terminology across product, domain, architecture, API, operational, and AI-context documentation.

A term defined here should be used consistently unless a narrower domain-specific document intentionally defines a more specialized meaning.

## Ardtire Civic Governance Platform
The software system being built in this repository. It is the digital governance platform for the Ardtire Society and related institutional workflows.

## Ardtire Society
The civic and organizational context within which the platform operates. In repository documentation, this term refers to the institution or body the platform serves, not the software itself.

## Actor
A person, system, service, or institutional role that performs actions in or against the platform.

An actor is not necessarily the same thing as a user account, role, or authority grant.

## User
A human individual interacting with the platform through an account or identity-bound session.

## Service
A deployable or logically distinct backend unit responsible for a bounded set of responsibilities.

## Application
A deployable product surface such as a web application, CMS, internal API, or operations tool.

## Package
A reusable library or module intended to be shared by one or more applications or services in the repository.

## Domain
A coherent area of meaning, rules, and behavior within the platform.

Examples may include membership, governance, records, publication, identity, and operations.

## Bounded context
A boundary within which a particular model and vocabulary are valid and coherent.

## Authority
A recognized grant of institutional ability to perform an action or class of actions.

Authority is broader than a raw technical permission and may be constrained by workflow, office, membership state, or policy.

## Permission
A technical allowance enforced by the platform to permit or deny an operation.

Permissions often implement authority, but the two are not identical.

## Role
A named classification assigned to an actor or account for authorization and governance purposes.

A role may influence permissions, but roles alone do not always fully determine authority.

## Capability
A concrete action or class of actions the platform enables.

## Workflow
A defined sequence of actions, transitions, and validations used to accomplish a business or governance process.

## Lifecycle
The full set of states and transitions through which an entity may move.

## State
A recognized status or condition of an entity within a lifecycle.

## Transition
A valid movement from one state to another under defined rules.

## Invariant
A rule that must always hold true within the system.

## Record
A persistent institutional artifact managed by the platform and subject to lifecycle, audit, access, and retention rules.

## Publication
The act or result of making content or records visible under defined rules and workflows.

## Specification
An implementation-facing document that defines expected behavior, constraints, validations, and acceptance criteria for a feature or capability.

## Contract
A formal boundary agreement between parts of the system, such as an API contract, data contract, or service interaction contract.

## Architecture
The deliberate structural design of the platform, including components, boundaries, data flow, trust model, and operational shape.

## Source of truth
The authoritative repository location in which a given class of truth is officially defined.

## Canonical
Authoritative and governing for a given category of meaning.

## Derived
Produced from canonical truth and/or repository state, useful for acceleration and summarization but not the highest authority.

## Narrative
Explanatory or historical material intended to teach, contextualize, or record the project journey rather than define repository truth.

## ADR
Architectural Decision Record. A document capturing a consequential decision, its context, alternatives, and consequences.

## Spec
Short for specification. See Specification.

## API
Application Programming Interface. The contract by which software components communicate programmatically.

## Runbook
A task-oriented procedural document describing how to carry out an operational activity safely and repeatably.

## Operations
The steady-state practice of running, observing, securing, and maintaining the platform over time.

## AI context
A set of AI-oriented artifacts designed to help AI systems operate within repository truth, structure, and current implementation state.

## Drift
A divergence between repository artifacts that should remain aligned, such as code and specs, architecture docs and implementation, or canonical docs and derived summaries.

## Repository truth
The combined body of intentionally governed information inside the repository that defines what the system is, how it behaves, and how it is operated.

## Deferred
Intentionally postponed, not forgotten and not implicitly included.

## Deprecated
Still present but no longer recommended as the preferred active reference or path.

## Superseded
Replaced by a newer source that now governs.

## Auditability
The degree to which actions, transitions, and outcomes can be traced, explained, and verified after the fact.

## Traceability
The ability to connect requirements, decisions, code, operational behavior, and history coherently across the repository.

## Final note

This glossary is repository-wide. More specific terms should be defined in the most appropriate local glossary as needed, especially in the domain and product documentation layers.
