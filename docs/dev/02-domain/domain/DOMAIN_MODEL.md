# DOMAIN_MODEL

## Document Status
- Status: Canonical working baseline
- Purpose: define the primary bounded domains and conceptual model of the Ardtire digital governance platform
- Audience: product, engineering, architecture, future AI implementation agents

---

## 1. Modeling Philosophy

The domain model exists to describe the institution in software terms.

It must:
- identify core bounded contexts
- define the major entities and relationships
- distinguish authoritative records from presentation artifacts
- make workflow ownership and boundaries explicit
- keep future domains separate from initial core domains

This document is conceptual and architectural, not a substitute for the canonical database schema. The schema must implement this model faithfully.

---

## 2. Core Bounded Contexts

The recommended initial bounded contexts are:

1. Identity and Access
2. Membership
3. Governance Structure
4. Governance Procedure
5. Records and Registry
6. Publication
7. Content and Editorial
8. Administrative Operations
9. Audit and Policy
10. Integration Boundaries

Each context is described below.

---

## 3. Identity and Access Context

### Purpose
Represent authenticated persons/accounts and application-layer access control context.

### Core Concepts
- User Account
- Person Profile or Identity Reference
- Authentication Session
- Application Role
- Permission
- Group/Realm Mapping
- Actor Context

### Responsibilities
- establish authenticated identity
- map identity into application actor context
- support role-aware surface access
- support policy evaluation inputs

### Important Distinctions
A user account is not the same as:
- a member
- an officer
- an office holder
- a certifier
- an eligible voter

Those may overlap, but they must not be conflated.

---

## 4. Membership Context

### Purpose
Represent how persons become, remain, or cease to be members of the institution.

### Core Concepts
- Membership Application
- Membership Review
- Membership Decision
- Membership Status
- Membership Class
- Suspension
- Reinstatement
- Membership Event
- Member Directory Visibility

### Responsibilities
- application intake
- review workflow
- approval/rejection/return
- active member lifecycle tracking
- membership classification
- status change history

### Canonical Questions
- Who is currently a member?
- By what decision did they become a member?
- What class of membership do they hold?
- What restrictions currently apply?
- Who changed their status and why?

---

## 5. Governance Structure Context

### Purpose
Represent the institutional bodies and offices through which governance occurs.

### Core Concepts
- Governance Body
- Body Membership
- Office
- Office Holder
- Term
- Vacancy
- Delegation
- Appointment
- Removal or End-of-Term Event

### Responsibilities
- define institutional structure
- track bodies and offices
- assign office holders
- track terms and vacancies
- support authority derivation from office or body role

### Canonical Questions
- What bodies exist?
- What offices exist?
- Who currently holds which office?
- What term boundaries apply?
- What powers derive from which office/body affiliation?

---

## 6. Governance Procedure Context

### Purpose
Represent the decision-making workflows of the institution.

### Core Concepts
- Session or Meeting
- Agenda
- Agenda Item
- Proposal
- Amendment
- Vote
- Ballot or Voting Record
- Outcome
- Certification
- Ratification (where in scope)
- Procedural Rule Reference

### Responsibilities
- manage proposal lifecycle
- manage amendment lifecycle
- manage agenda/session association
- manage voting lifecycle
- manage certification of outcomes
- track procedural state transitions

### Canonical Questions
- What proposals are active?
- What state is a proposal in?
- Has voting opened or closed?
- What outcome resulted?
- Has the outcome been certified?
- Under what rule version did the decision occur?

---

## 7. Records and Registry Context

### Purpose
Represent authoritative records, their versions, lineage, and official status.

### Core Concepts
- Canonical Record
- Record Version
- Record Type
- Certification Record
- Publication Eligibility
- Supersession
- Archival Status
- Provenance Metadata

### Responsibilities
- track authoritative documents/records
- maintain lineage across versions
- distinguish draft from official/final states
- support historical reconstruction
- support public register rendering

### Canonical Questions
- What is the official version of this record?
- What preceded it?
- Has it been certified?
- Is it published?
- Has it been superseded or archived?

---

## 8. Publication Context

### Purpose
Represent how official and editorial outputs become visible to the public or scoped internal audiences.

### Core Concepts
- Publication Event
- Notice
- Gazette Entry
- Register Entry
- Visibility Scope
- Publication Channel
- Effective Date
- Withdrawal/Correction/Supersession Notice

### Responsibilities
- determine what is publishable
- record publication events
- drive public register outputs
- maintain visibility discipline
- represent corrections and supersession publicly

### Canonical Questions
- Is this official outcome public?
- When was it published?
- What public surface displays it?
- Was a correction later issued?
- What is the current official public representation?

---

## 9. Content and Editorial Context

### Purpose
Represent non-canonical public-facing informational and narrative content.

### Core Concepts
- Page
- Post/Announcement
- Biography
- Navigation Structure
- Media Asset
- Structured Content Block

### Responsibilities
- manage institutional presentation
- support public explanation and storytelling
- host informational pages not themselves canonical records

### Important Rule
Editorial content may reference canonical records, but it does not define canonical procedural truth.

---

## 10. Administrative Operations Context

### Purpose
Provide operators with workflow oversight, exception handling, and control surfaces.

### Core Concepts
- Review Queue
- Admin Task
- Exception Case
- Manual Intervention
- Resolution Note
- Escalation

### Responsibilities
- allow staff/operators to review pending cases
- handle exceptional or incomplete situations
- support remediation and operational continuity
- expose workflow status and bottlenecks

### Important Principle
Administrative operations are part of the institution’s operating model and must themselves be observable and auditable.

---

## 11. Audit and Policy Context

### Purpose
Represent the cross-cutting system of authority evaluation, audit, and rule versioning.

### Core Concepts
- Policy
- Policy Version
- Rule Set
- Authority Check
- Audit Event
- Correlation ID
- Actor Attribution
- Reason/Justification

### Responsibilities
- evaluate permissions and authority
- preserve procedural version references
- record privileged and meaningful actions
- support accountability and reconstruction

### Important Principle
This context is cross-cutting but must still be modeled explicitly, not left as incidental implementation detail.

---

## 12. Integration Boundaries Context

### Purpose
Represent external systems and synchronization boundaries.

### Candidate Integrations
- Keycloak
- Payload CMS
- Decidim
- email/notification providers
- storage/media systems
- future search/indexing systems

### Principle
External integrations are boundaries, not excuses to outsource Ardtire’s canonical institutional model.

---

## 13. Major Entities by Domain

## 13.1 Identity and Access
- User
- UserProfile
- RoleAssignment
- PermissionGrant
- ActorContext

## 13.2 Membership
- MembershipApplication
- MembershipReview
- MembershipDecision
- MembershipRecord
- MembershipStatusEvent
- MembershipClass

## 13.3 Governance Structure
- GovernanceBody
- BodySeat or BodyMembership
- Office
- OfficeHolderAssignment
- Term
- Delegation

## 13.4 Governance Procedure
- Session
- Agenda
- AgendaItem
- Proposal
- Amendment
- Vote
- Ballot
- Outcome
- Certification
- RatificationRecord

## 13.5 Records and Registry
- Record
- RecordVersion
- RecordLinkage
- RecordCertification
- RecordArchiveState

## 13.6 Publication
- PublicationEvent
- GazetteEntry
- RegisterEntry
- Notice
- CorrectionNotice

## 13.7 Editorial
- Page
- Post
- Bio
- NavigationItem
- MediaAsset

## 13.8 Audit and Policy
- AuditEvent
- PolicyDefinition
- PolicyVersion
- AuthorityDecision

---

## 14. Key Relationships

### Identity to Membership
A user may have zero or one current membership records at a time, with many historical membership events.

### Identity to Office Holding
A user/person may hold zero or more offices over time, but assignments are term-bound and event-backed.

### Governance Body to Office
An office may belong to or be associated with a governance body.

### Proposal to Session/Agenda
A proposal may be linked to zero or more sessions or agenda items depending on procedural design.

### Proposal to Amendments
A proposal may have zero or many amendments.

### Proposal to Votes
A proposal may trigger one or more voting events depending on procedure.

### Outcome to Certification
An official procedural outcome may require certification before becoming final/publishable.

### Record to Publication
A canonical record may become publishable via a publication event; publication is not assumed.

### Policy Version to Outcome
A governed outcome should retain references to the policies or rule versions that governed it.

---

## 15. Invariants Across Domains

1. Membership state must be decision-backed.
2. Office-holder state must be appointment/assignment-backed.
3. Official outcomes must be workflow-backed.
4. Publication of official material must be event-backed.
5. Significant status changes must be auditable.
6. Canonical record truth must not depend on editorial content.
7. Authorization must be evaluated in institutional context, not only app role context.
8. Historical interpretation must remain possible after rule changes.

---

## 16. Draft vs Official State

Many domains require explicit distinction between draft and official state.

Examples:
- a proposal draft is not yet an official admitted proposal
- a content page draft is not yet published editorial content
- a draft record version is not yet the certified official version
- an uncategorized meeting note is not necessarily an official notice

The domain model must preserve these distinctions.

---

## 17. Deferred Domains

These are acknowledged but not part of the initial core bounded contexts:
- judicial/dispute resolution
- land registry
- treasury/finance governance
- sanctions/enforcement systems
- complex constitutional amendment machinery beyond initial needs
- external federation/inter-polity relations

They should not be silently smuggled into the core model prematurely.

---

## 18. Domain Events Perspective

Most meaningful changes in this system are best understood as domain events.

Examples:
- membership_application_submitted
- membership_approved
- office_assigned
- proposal_admitted
- vote_opened
- vote_closed
- outcome_certified
- record_published
- member_suspended

This does not require a full event-sourced architecture, but the system should think eventfully even if state is stored relationally.

---

## 19. Conceptual Summary

The domain model consists of:
- people and identities
- institutional roles and authority
- membership status and lifecycle
- bodies and offices
- procedures and decisions
- records and publication
- editorial representation
- audit, policy, and accountability

Together, these define the digital operating model of Ardtire.

The platform must implement these domains in a way that keeps:
- governance canonical
- publication disciplined
- authority explicit
- history intelligible