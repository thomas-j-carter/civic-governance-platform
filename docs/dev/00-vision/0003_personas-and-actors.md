# Document 3 — `docs/vision/personas-and-actors.md`

## Purpose of this document

This document defines the human and system actors that interact with the Ardtire Society Digital Governance Platform, the roles they play, the goals they pursue, the kinds of actions they need to perform, and the risks that arise if they are modeled poorly.

This document sits between the institutional model and the later authority, permissions, workflow, and UI architecture documents.

Its purpose is not yet to define final access-control rules. Instead, it establishes the **actor landscape** the platform must be designed around. A seasoned senior software engineer would insist on this step because governance software fails quickly when all users are treated as generic “accounts” or when the product is designed around admin convenience rather than around real actor needs and authority boundaries.

This document should be read after:

* `docs/vision/product-mission.md`
* `docs/vision/institutional-model.md`

---

## 1. Why personas and actors matter here

For an ordinary content site, a simple split such as “visitor vs admin” might be enough.

For Ardtire Society, that would be dangerously inadequate.

This platform must support:

* public visibility
* applicant workflows
* membership-bearing participation
* officer and administrative work
* editorial publication
* governance procedures
* certification/publication authority
* automated system actions

That means the platform must distinguish between at least three related but different things:

* **persona**: the human or system archetype being served
* **actor**: the specific participant taking an action in the system
* **authority context**: the role, office, status, delegation, or rule condition under which the actor may or may not perform that action

A single person may appear under multiple contexts.

For example, one human being could simultaneously be:

* a member
* an officeholder
* an editor
* a certifying authority in narrow circumstances

That does not mean the system should flatten those distinctions. It means the system should preserve them.

---

## 2. Key modeling principle

The platform should be designed around this principle:

> A user account is not the same thing as an institutional actor, and an institutional actor is not the same thing as an authority-bearing context.

This single principle prevents many future design mistakes.

For example:

* an authenticated account does not automatically imply membership
* membership does not automatically imply proposal authority
* officer status does not automatically imply publication authority
* admin tooling access does not automatically imply constitutional authority
* editorial capability does not automatically imply authority over official governance state

This separation will be critical later in:

* identity design
* membership logic
* office and delegation modeling
* permission evaluation
* workflow guards
* audit log design
* public projection logic

---

## 3. Actor taxonomy overview

For planning purposes, the platform should initially recognize the following actor classes:

1. Public Visitor
2. Interested Public Follower
3. Applicant
4. Pending Applicant Under Review
5. Member
6. Member with Restricted Standing
7. Officer
8. Governance Body Participant
9. Editor / Communications Steward
10. Administrative Operator
11. Certifying Authority
12. Publication Authority
13. Founder / High Constitutional Authority
14. External Institutional Counterparty
15. System Actor

Not every one of these must exist as a first-class role on day one, but the platform architecture should be able to support them cleanly.

---

## 4. Persona and actor profiles

## 4.1 Public Visitor

### Description

A public visitor is a person who browses the public-facing portions of the platform without being authenticated or without holding an institutional relationship of consequence.

### Primary goals

* understand what Ardtire Society is
* read public-facing information
* view public notices or registers
* explore official publications
* learn how governance works at a high level
* determine whether they want to apply or engage further

### Likely actions

* browse public pages
* search public records or notices
* view officeholder information
* read public announcements
* read gazette or publication entries
* view public explanations of membership or governance processes

### Key needs

* clarity
* public trust
* easy navigation
* confidence that public information is official and current where indicated
* understandable distinction between informational content and official record

### Design implications

The public visitor experience should be optimized for legibility and confidence, not for exposing internal system complexity.

### Risks if modeled badly

* public confusion about what is official
* exposure of draft/internal material
* inability to distinguish content pages from official notices
* inconsistent register or publication views

---

## 4.2 Interested Public Follower

### Description

This actor is not merely browsing casually, but is tracking the organization’s public work more intentionally. They may be considering application, following governance developments, or monitoring publications.

### Primary goals

* follow public institutional developments
* monitor official announcements or registers
* understand ongoing public-facing processes
* determine whether and how to engage

### Likely actions

* revisit the site regularly
* search public records or publications
* subscribe to updates if supported
* review governance or membership information in depth

### Key needs

* continuity of public information
* stable URLs and records
* chronological traceability
* confidence in publication dates and official status indicators

### Design implications

Public publication and record pages should be durable, searchable, and structured.

### Risks if modeled badly

* weak public legitimacy
* inability to follow institutional chronology
* confusion around superseded versus current public material

---

## 4.3 Applicant

### Description

An applicant is a person seeking entry into membership or another recognized institutional relationship.

### Primary goals

* understand eligibility and process
* submit required information
* track status
* respond to requests
* receive clear outcomes

### Likely actions

* create an account or begin an application
* complete application forms
* upload supporting information if required
* view notices and requests
* amend or resubmit information
* withdraw if desired

### Key needs

* procedural clarity
* trust in handling of information
* understandable status
* clear next steps
* reliable notification of requests and decisions

### Design implications

Application flow should be stateful and explicit rather than a one-off form submission black box.

### Risks if modeled badly

* applicants do not know whether they are pending, incomplete, or under review
* missing auditability around review decisions
* ad hoc back-channel handling outside the platform
* confusion between “has an account” and “is a member”

---

## 4.4 Pending Applicant Under Review

### Description

This is a narrower operational persona: an applicant whose file is currently undergoing institutional review.

### Primary goals

* know whether more information is needed
* respond appropriately to review outcomes
* understand whether the matter is active, paused, or decided

### Likely actions

* read system notices
* upload or revise information
* acknowledge requests
* wait on formal determination

### Key needs

* status visibility
* timestamped requests
* formal decision notices
* confidence that no informal side channel is required

### Design implications

The application lifecycle should support intermediate states such as information requested, resubmitted, under review, approved, rejected, or withdrawn.

### Risks if modeled badly

* applicants disappear into ambiguous queues
* review becomes email-driven rather than system-driven
* staff resort to off-platform tracking

---

## 4.5 Member

### Description

A member is a person recognized by the institution according to its membership framework and current standing rules.

### Primary goals

* maintain a clear understanding of their status
* receive institutional notices
* access member-only information and workflows
* participate in governance where eligible
* track matters relevant to them

### Likely actions

* sign in to member portal
* view membership status and profile
* read notices
* review proposals or ballots
* participate in votes if eligible
* view institutional records relevant to members

### Key needs

* trust in current status accuracy
* role-appropriate visibility
* clear separation between what they may view and what they may do
* clear signals when eligibility differs by context

### Design implications

Member experience should not be reduced to a generic dashboard. It must reflect institutional standing and available actions.

### Risks if modeled badly

* members cannot tell what they are eligible to do
* members confuse internal visibility with authority to act
* participation rules appear arbitrary because rule context is hidden

---

## 4.6 Member with Restricted Standing

### Description

A member may remain recognized by the institution but have some restricted standing due to suspension, provisional status, incomplete prerequisites, lapse conditions, or other rule-based limitations.

### Primary goals

* understand present status
* understand restrictions
* understand remediation path if any
* receive fair notice of institutional action

### Likely actions

* view restriction notice
* review reasons or references where appropriate
* complete remedial actions
* appeal or respond if processes allow
* monitor reinstatement progress

### Key needs

* dignity and clarity
* formal status transparency
* no silent disappearance of privileges
* explicit distinction between identity, membership existence, and eligibility limitations

### Design implications

The platform must support nuanced standing states rather than a simplistic active/inactive member flag.

### Risks if modeled badly

* poor procedural fairness
* unexplained denial of actions
* audit and legal ambiguity around status changes
* inconsistent UI behavior

---

## 4.7 Officer

### Description

An officer is an institutional actor entrusted with responsibilities that go beyond ordinary membership.

### Primary goals

* perform assigned duties
* review and decide matters within authority
* manage workflows efficiently
* maintain record quality
* act with clarity about scope and legitimacy

### Likely actions

* review applications
* manage proposal stages
* schedule procedural events
* oversee governance body operations
* confirm readiness for certification or publication
* maintain official records within authority

### Key needs

* clear work queues
* explicit authority indicators
* confidence they are acting within scope
* strong audit trails
* reduced ambiguity about next valid actions

### Design implications

Officer interfaces should be task- and workflow-oriented, not just record-edit pages.

### Risks if modeled badly

* officers act through ad hoc edits
* process drift occurs
* hidden or invalid transitions become common
* authority confusion increases institutional risk

---

## 4.8 Governance Body Participant

### Description

This persona captures actors participating in a specific governance body, committee, chamber, council, or similar internal grouping.

### Primary goals

* understand body-specific responsibilities
* review matters assigned to that body
* participate in deliberative or procedural stages
* receive body-specific notices and tasks

### Likely actions

* view assigned proposals or matters
* record stage decisions
* participate in readings or committee steps
* review agenda/history of matters within scope

### Key needs

* scoped views
* body-specific queues and context
* clear relationship between body membership and authority
* procedural guidance tied to current stage

### Design implications

The platform should eventually support body-scoped workflow views and actor context.

### Risks if modeled badly

* committee/body participation is approximated through generic tags
* unclear relationship between body assignment and action rights
* historical governance traceability is weakened

---

## 4.9 Editor / Communications Steward

### Description

This actor is responsible for public or internal informational content, communications, pages, announcements, media, and explanatory narrative.

### Primary goals

* keep public information current
* publish non-governance editorial content
* coordinate publication of notices or explanatory summaries where appropriate
* maintain coherent information architecture

### Likely actions

* edit pages and articles
* manage media
* update structured content
* prepare announcement content
* collaborate with official publication flows

### Key needs

* robust CMS tools
* content preview and review
* separation from authoritative governance state
* clear distinction between editorial narrative and official record text

### Design implications

The CMS should strongly support this persona, but governance record mutation should remain outside ordinary editorial power unless explicitly authorized.

### Risks if modeled badly

* editorial content becomes accidental source of truth
* public articles contradict official records
* communications actors unintentionally alter constitutional meaning

---

## 4.10 Administrative Operator

### Description

An administrative operator supports operational continuity of the platform and institution. This may include configuration, user support, maintenance, and some process administration.

### Primary goals

* keep the platform functioning
* resolve operational issues
* maintain data quality and process continuity
* support users without becoming an unbounded constitutional superuser

### Likely actions

* manage settings
* handle platform support tasks
* assist with user/account issues
* inspect operational logs or queue states
* perform tightly controlled interventions where authorized

### Key needs

* operational tools
* visibility into system health and queues
* guardrails around exceptional intervention
* clear separation between technical authority and governance authority

### Design implications

Admin tooling should be strong, but it should include auditable safeguards and constrained capabilities.

### Risks if modeled badly

* “admin” becomes a magic bypass
* constitutional meaning is overridden through technical convenience
* audit trail becomes muddy
* data integrity suffers from informal repair actions

---

## 4.11 Certifying Authority

### Description

This persona represents actors empowered to certify results, finalize official outcomes, or confirm that procedural requirements have been satisfied.

### Primary goals

* review whether an outcome is procedurally ready
* certify official status where authorized
* create trustworthy finalization records
* preserve legitimacy of institutional outputs

### Likely actions

* review result package
* confirm quorum/threshold/eligibility context
* certify result
* record certification metadata
* reject or return matters that are not ready

### Key needs

* strong procedural visibility
* access to supporting evidence and rule context
* explicit certification workflow
* tamper-resistant records of certification act

### Design implications

Certification should be a distinct domain action, not an implied side effect of ballot close or proposal completion.

### Risks if modeled badly

* uncertified results appear official
* certification becomes invisible or informal
* inability to prove how an official result became official

---

## 4.12 Publication Authority

### Description

This actor controls or confirms the transition from official internal matter to public official publication.

### Primary goals

* ensure publication is authorized
* ensure public artifact is accurate and complete
* control timing and form of public release
* preserve chronology and provenance

### Likely actions

* approve publication package
* publish gazette issue or notice
* confirm public register entry
* withhold publication pending correction
* trigger public projection refresh

### Key needs

* publication queue tooling
* clear view of official readiness state
* immutable publication timestamps
* stable public artifacts

### Design implications

Publication should be treated as an explicit action with explicit authority, even when automated steps support it.

### Risks if modeled badly

* public truth diverges from official truth
* internal draft data leaks into public views
* publication chronology becomes unreliable

---

## 4.13 Founder / High Constitutional Authority

### Description

Depending on final institutional design, there may be a small class of actors with unique constitutional or top-level authority.

### Primary goals

* steward institutional continuity
* exercise reserved or exceptional powers if they exist
* oversee foundational governance structure
* maintain legitimacy of top-level institutional acts

### Likely actions

* appoint certain officials if rules allow
* issue certain classes of approval or ratification
* oversee constitutional changes or reserved domains
* act in exceptional institutional scenarios

### Key needs

* extremely clear scoping
* strong auditability
* constrained explicit workflows
* avoidance of vague “god mode” behavior

### Design implications

This actor must be modeled narrowly and explicitly if it exists. Senior engineers should avoid encoding mystique as software permission.

### Risks if modeled badly

* hidden or arbitrary overrides
* collapse of formal authority model
* loss of trust in governance integrity

---

## 4.14 External Institutional Counterparty

### Description

This persona represents a non-member or external organization/person interacting with Ardtire in a formal but limited way, such as a correspondent, partner, invited participant, or outside stakeholder.

### Primary goals

* interact on a defined matter
* provide required documents or responses
* receive notices or outcomes relevant to them
* do so without being treated as a full internal participant

### Likely actions

* receive formal communications
* upload or respond to requested materials
* access limited-purpose portals or artifacts
* confirm receipt where needed

### Key needs

* scoped access
* clear limitation of visibility
* reliable communication
* procedural dignity

### Design implications

The platform should not assume all meaningful actors are members.

### Risks if modeled badly

* ad hoc off-platform processes proliferate
* external formal interactions become untraceable
* access boundaries become unsafe

---

## 4.15 System Actor

### Description

The platform itself may perform actions as an automated actor under predefined rules.

### Primary goals

* execute scheduled or deterministic tasks
* maintain projections and notifications
* enforce time-based transitions where appropriate
* assist human users without obscuring accountability

### Likely actions

* send notices
* close expired windows
* refresh search/index projections
* create publication artifacts
* emit reminders
* recompute derived views

### Key needs

* explicit attribution
* predictable behavior
* strong logging
* operator observability
* safe retry and failure handling

### Design implications

System actions should appear as system-attributed events, not as mysterious background mutations.

### Risks if modeled badly

* hidden state changes
* impossible-to-debug workflow behavior
* weak auditability
* accidental overreach by background jobs

---

## 5. Cross-cutting actor distinctions

A strong design must preserve the following cross-cutting distinctions.

## 5.1 Authenticated vs unauthenticated

Being signed in changes identity certainty, but not automatically institutional standing.

## 5.2 Known person vs member

A known person may be an applicant, former member, external counterparty, or editor without current member standing.

## 5.3 Member vs eligible participant

A member may not be eligible for every ballot, office, or action.

## 5.4 Role vs office

A role may be a software or organizational capability; an office may be a formal institutional appointment with term-based authority.

## 5.5 Operational authority vs constitutional authority

Technical control over a system is not identical to governance legitimacy.

## 5.6 Editorial authority vs official publication authority

Publishing an article is not the same as promulgating an official notice.

## 5.7 Human actor vs system actor

Automated behavior must remain attributable and bounded.

---

## 6. Persona-to-surface mapping

A senior engineer would start mapping actors to platform surfaces early.

### Public surfaces

Primarily serve:

* Public Visitor
* Interested Public Follower
* External Institutional Counterparty in limited cases

### Applicant surfaces

Primarily serve:

* Applicant
* Pending Applicant Under Review

### Member surfaces

Primarily serve:

* Member
* Member with Restricted Standing
* Governance Body Participant in some contexts

### Officer / governance surfaces

Primarily serve:

* Officer
* Governance Body Participant
* Certifying Authority
* Publication Authority
* Founder / High Constitutional Authority where relevant

### Editorial surfaces

Primarily serve:

* Editor / Communications Steward

### Operational/admin surfaces

Primarily serve:

* Administrative Operator
* selected Officer personas
* system support staff

### Internal service surfaces

Serve:

* System Actor
* other machine-to-machine processes

This mapping will later inform route architecture, information architecture, and access boundaries.

---

## 7. Primary jobs to be done by persona

This section translates personas into practical product jobs.

### Public Visitor

“Help me understand the institution and find trustworthy public information.”

### Interested Public Follower

“Help me track official public developments over time.”

### Applicant

“Help me apply clearly and understand where I stand.”

### Pending Applicant Under Review

“Help me know what is needed from me and what happens next.”

### Member

“Help me understand my standing and participate where I am entitled to.”

### Member with Restricted Standing

“Help me understand what is restricted, why, and what I can do next.”

### Officer

“Help me perform institutional duties correctly and efficiently.”

### Governance Body Participant

“Help me act within my body’s scope and on the matters assigned to it.”

### Editor / Communications Steward

“Help me publish and maintain high-quality informational content without confusing it with official institutional record.”

### Administrative Operator

“Help me keep the platform operational and support users without breaking governance integrity.”

### Certifying Authority

“Help me certify outcomes confidently, with full procedural context.”

### Publication Authority

“Help me publish official matters accurately, intentionally, and traceably.”

### Founder / High Constitutional Authority

“Help me exercise reserved authority only through explicit, auditable institutional pathways.”

### External Institutional Counterparty

“Help me participate in this one formal interaction without unnecessary exposure or complexity.”

### System Actor

“Execute bounded automated tasks transparently, predictably, and audibly.”

---

## 8. Risks of collapsing personas together

A senior engineer would identify this as a major hazard.

If the platform collapses personas into a few coarse buckets, the likely results are:

* public and official information become conflated
* applicants are treated like incomplete members
* officers act through hidden admin powers
* editors gain accidental authority over governance truth
* admins become de facto sovereign actors
* certification and publication become invisible side effects
* audit trails lose institutional meaning

This is one of the central reasons to define personas early and carefully.

---

## 9. Recommendations for the future authority model

Based on these personas, the later authority model should avoid a naive flat-RBAC approach.

A stronger model will likely need at least:

* identity context
* membership standing
* software role assignment
* officeholding/term context
* delegated authority context
* workflow-state conditions
* rule-version-based eligibility checks

In other words, permissions alone will not be enough.

---

## 10. Recommendations for UX architecture

Based on these personas, a seasoned engineer would recommend:

### 10.1 Separate surfaces by purpose

Do not put every action into one overloaded dashboard.

### 10.2 Make actor context visible

Users should know whether they are acting as a member, officer, editor, or publication authority.

### 10.3 Show why actions are or are not available

Especially in governance and membership contexts.

### 10.4 Avoid magic admin controls

Exceptional powers should be explicit, justified, and logged.

### 10.5 Make status and stage legible

Applicants, members, officers, and certifiers all depend on it.

### 10.6 Distinguish public content from official records visually and semantically

This is crucial for legitimacy.

---

## 11. Recommendations for data and audit modeling

This actor model implies several downstream requirements.

### 11.1 Audit events must record actor type and context

Not just a raw user ID.

### 11.2 Actions should preserve acting authority basis

For example, whether the actor acted as officer, certifier, publication authority, or system.

### 11.3 Membership and office context must be queryable historically

Because actor meaning changes over time.

### 11.4 System actions must be attributable

No silent background mutations without trace.

---

## 12. Assumptions carried forward

The following assumptions should be used in subsequent architecture documents unless explicitly revised.

1. The platform serves multiple materially distinct actor classes.
2. A single human may occupy multiple actor contexts.
3. Authority depends on more than authentication or generic role assignment.
4. Editorial actors, administrative operators, governance actors, and certifying/publication actors must remain distinguishable.
5. System automation is a real actor category for audit and workflow design.
6. Public, applicant, member, officer, editorial, and operator experiences should not be flattened into one undifferentiated product surface.

---

## 13. Summary

The Ardtire Society Digital Governance Platform must be designed around real institutional actors rather than generic “users.”

At minimum, the platform must cleanly support:

* public visitors
* applicants
* members
* restricted-standing members
* officers
* governance body participants
* editors
* administrative operators
* certifying authorities
* publication authorities
* possible high constitutional authorities
* external counterparties
* system actors

This actor model is essential because Ardtire’s platform is not merely account-based software. It is authority-aware institutional software. Later documents must therefore preserve actor distinctions in permissions, workflows, records, APIs, UI surfaces, and audit trails.

---

## 14. Status

**Status:** Draft for adoption as actor and persona baseline.
**Intended authority level:** High.
**Depends on:**

* `docs/vision/product-mission.md`
* `docs/vision/institutional-model.md`

**Next document:** `docs/vision/problem-statements-and-goals.md`

3… 2… 1… next: I’ll continue with **Document 4 — `docs/vision/problem-statements-and-goals.md`**.
