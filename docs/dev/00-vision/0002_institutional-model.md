# Document 2 — `docs/vision/institutional-model.md`

## Purpose of this document

This document defines the institutional model that the Ardtire Society Digital Governance Platform is intended to serve. Its purpose is to describe the organization, its operating posture, its internal authorities, its public-facing role, and the kinds of institutional actions the platform must be able to represent faithfully.

This is not yet the detailed authority matrix, permission model, or state-machine specification. Those will be defined in later documents. This document instead establishes the conceptual institutional shape of Ardtire Society so that later architecture, data, API, and workflow decisions are made in service of the real organization rather than in service of generic software patterns.

This document should be read immediately after `docs/vision/product-mission.md`.

---

## 1. Why an institutional model is necessary

A seasoned software architect would not attempt to design a governance platform without first answering a foundational question:

**What kind of institution is this software actually for?**

Many software projects fail because they begin with screens, forms, and tables before establishing what the underlying institution is supposed to do. That mistake is especially dangerous here.

Ardtire Society is not well-modeled as merely:

* a content website
* a member directory
* a forum
* a nonprofit CRM
* a volunteer portal
* a petition app
* a lightweight board-management tool

It has characteristics of a more formal civic and constitutional-style organization. That means the software must reflect:

* structured authority
* procedural action
* formal statuses
* official outputs
* internal and public boundaries
* durable records
* institutional continuity

Without an explicit institutional model, later implementation will drift into a collection of unrelated modules that do not compose into a coherent operational whole.

---

## 2. Working description of Ardtire Society as an institution

For architecture and implementation purposes, Ardtire Society should currently be modeled as a **civic-governance institution with formal membership, internal offices and bodies, structured proposal and voting processes, official recordkeeping, and a public-facing publication/transparency function**.

In plain terms, this means Ardtire Society is treated as an organization that:

* has members, applicants, and office-bearing actors
* acts through defined procedures rather than only informal discussion
* distinguishes draft/internal activity from official/public output
* produces decisions, records, notices, and publications with institutional significance
* needs traceable and authority-aware digital operations
* expects to preserve continuity over time

This working description is broad enough to support the current vision while still being specific enough to guide architecture.

---

## 3. Core characteristics of the institution

The platform should assume that Ardtire Society has the following core institutional characteristics.

### 3.1 Membership-bearing

Membership is not incidental. It is part of the organization’s operating structure. The system must therefore treat membership as more than contact management.

Membership likely includes:

* entry criteria
* review or decision processes
* standing/status
* categories or classes
* participation implications
* rights or privileges subject to rules
* historical continuity

This means the software must support not just “user accounts,” but a distinct concept of institutional membership.

### 3.2 Authority-bearing

Ardtire Society acts through people, but not all people act with the same authority. Some actors may hold office, delegated powers, certification powers, publication responsibilities, moderation authority, or administrative capabilities.

The platform must therefore distinguish:

* identity
* membership
* role
* office
* delegated authority
* procedural eligibility

These distinctions are easy to blur in a typical SaaS application and must not be blurred here.

### 3.3 Procedure-bearing

The institution acts through procedures. Significant actions should not be modeled as arbitrary edits to data rows.

Examples include:

* admitting or rejecting members
* appointing officeholders
* introducing proposals
* moving proposals through stages
* opening and closing ballots
* certifying results
* issuing official notices
* publishing public records

Each of these is procedural in nature and should later be modeled as commands and workflows, not just CRUD.

### 3.4 Record-bearing

Ardtire Society must be able to create, preserve, and retrieve official records. Some outputs of the system are not merely temporary data states but institutional records with long-lived relevance.

Examples include:

* membership decisions
* officeholder histories
* proposal versions
* certified outcomes
* ratified measures
* official notices
* gazette publications
* archived records

The platform must therefore distinguish ordinary operational data from stronger record-bearing outputs.

### 3.5 Public-facing

Ardtire Society is not purely inward-facing. It has at least some public-facing functions. This likely includes public pages, notices, records, registers, official publications, and explanatory materials.

This means the platform must support a meaningful public surface, but without collapsing the distinction between internal state and public truth.

### 3.6 Continuity-oriented

The institution is expected to persist through time. Its software must therefore support continuity:

* historical memory
* succession of officeholders
* prior decisions
* superseded texts
* retained archives
* evolving but traceable procedures

The platform must be built for continuity rather than short-term campaign-style operation.

---

## 4. Institutional layers the platform must recognize

A senior engineer would identify that the platform is serving several institutional layers at once. These layers must be kept conceptually distinct even where they share infrastructure.

### 4.1 Public institutional layer

This is the public-facing layer of Ardtire Society.

It includes, at minimum:

* public website pages
* public announcements
* official notices
* public registers
* gazette or equivalent publications
* publicly visible officeholder and governance information
* public explanations of institutional processes where appropriate

This layer is important for clarity and legitimacy, but it is not the only layer.

### 4.2 Internal operational layer

This layer includes the in-progress, working, and administrative side of the institution.

Examples include:

* application review
* moderation queues
* draft proposals
* internal workflow states
* review notes
* pending certifications
* unpublished records
* admin and officer tooling

This layer must exist because institutions cannot function if every internal step is automatically public.

### 4.3 Official institutional layer

This is a particularly important conceptual layer.

Some information is more than internal, but not simply “public website content.” It is officially recognized institutional state or record.

Examples include:

* active member status
* current officeholder of record
* certified vote result
* adopted proposal text
* official record entry
* publication-ready gazette content

This layer matters because the platform must distinguish between:

* internal draft working state
* official institutional truth
* public publication state

Those are related, but not identical.

### 4.4 Editorial/content layer

This layer covers explanatory and communicative content, including:

* articles
* static pages
* editorial announcements
* about pages
* media
* structured informational content

This layer is important, but it must not become the hidden authority layer for governance itself.

---

## 5. Institutional actors

The platform must be designed around institutional actors, not only around generic application users.

At this stage, the system should assume at least the following actor categories.

### 5.1 Public visitor

A public visitor is an unauthenticated or lightly identified actor who can consume public information but does not ordinarily participate in internal governance actions.

Capabilities may include:

* browse public content
* view public notices
* view public registers
* read public publications
* learn about the organization

### 5.2 Applicant

An applicant is an actor pursuing entry into membership or another recognized institutional relationship.

Applicants may need to:

* submit applications
* provide information
* view status
* respond to requests
* receive notices

Applicants are not yet assumed to hold member rights merely by having an account.

### 5.3 Member

A member is an institutional actor recognized by the organization according to its membership framework.

A member may have rights or capabilities such as:

* access to member-only areas
* proposal participation
* voting participation where eligible
* receipt of internal notices
* service in roles or offices if qualified

Not all members necessarily have identical powers.

### 5.4 Officer

An officer is a member or actor entrusted with specific responsibilities or powers within the institution.

Officers may be involved in:

* review
* approvals
* administration
* committee functions
* certification steps
* publication oversight
* institutional operations

Officer status should eventually be modeled more precisely through offices, terms, and delegations.

### 5.5 Administrator

An administrator is a technical or operational steward of the platform and/or certain institutional workflows.

This actor category should be used carefully. A senior engineer would avoid allowing “administrator” to become an all-purpose bypass around the authority model.

Administrators may have operational privileges, but not necessarily unlimited constitutional authority.

### 5.6 Editor / communications actor

An editorial actor manages public or structured content.

This includes:

* page authorship
* announcements
* informational content
* media management
* public-facing narrative content

This role should remain distinct from governance authority unless explicitly combined in specific contexts.

### 5.7 Certifying or publication authority

Some actions likely require specially recognized authority, such as:

* certifying outcomes
* finalizing official records
* authorizing publication
* promulgating notices
* confirming register entries

These actors may overlap with officers or other authorities, but the platform should model the distinction explicitly.

### 5.8 System actor

The system itself may perform scheduled or automated functions, such as:

* dispatching notices
* projecting public views
* generating publication artifacts
* refreshing derived registers
* expiring time-bounded states

System actions must also be auditable and clearly attributable as system-generated rather than human-initiated.

---

## 6. Institutional objects the platform must understand

The platform should be designed around institutional objects that carry governance meaning.

At this stage, the likely core objects include:

* person / user identity
* membership application
* member record
* membership status
* governance body
* office
* officeholder assignment
* proposal
* proposal version
* amendment
* reading or stage event
* ballot
* vote
* result
* certification record
* ratification record or status
* official record
* gazette issue or entry
* notice
* publication artifact
* authority grant or delegation
* rule/version reference

These are not final schema definitions yet, but they indicate the shape of the institution the platform must support.

---

## 7. Institutional actions

A strong institutional model names what the organization actually does. The software must support these actions as first-class operations.

Likely institutional actions include:

* accept an application
* reject an application
* request more information
* admit a member
* suspend or restore status
* create or maintain governance bodies
* appoint an officeholder
* end a term or mark vacancy
* draft a proposal
* submit a proposal
* review a proposal
* amend a proposal
* move a proposal between stages
* schedule a vote
* open a ballot
* cast a vote
* close a ballot
* tally and evaluate a result
* certify an outcome
* record a final text
* publish a notice
* add an official record
* issue a gazette entry
* supersede or archive a record
* notify affected parties

A senior engineer would use this list to drive use-case modeling, API design, and workflow specifications later.

---

## 8. Institutional boundaries the software must preserve

One of the most important tasks of the architecture is to preserve correct boundaries. If the software collapses all distinctions into one administrative blob, the institutional model is lost.

The platform should preserve at least the following boundaries.

### 8.1 Identity boundary

Authentication and identity are foundational, but identity alone does not equal authority.

### 8.2 Membership boundary

A person may be known to the system without being a member, and may be a member without holding office.

### 8.3 Authority boundary

An actor may have authority in one procedural context and none in another.

### 8.4 Draft versus official boundary

Working material is not automatically official truth.

### 8.5 Official versus public boundary

Official institutional state may exist before or apart from public publication.

### 8.6 Content versus record boundary

A CMS page is not the same thing as an official record, even if the page displays or summarizes that record.

### 8.7 Operational versus constitutional boundary

Routine technical administration must not quietly redefine institutional authority or legal/procedural meaning.

---

## 9. Institutional posture on authority

The system should assume that authority within Ardtire Society is structured, contextual, and not reducible to a single “admin can do anything” model.

At the conceptual level, the platform should be ready to support several types of authority.

### 9.1 Status-based authority

Some authority may flow from recognized member standing or class.

### 9.2 Role-based authority

Some authority may flow from assigned functional roles.

### 9.3 Office-based authority

Some authority may attach to formal offices and terms.

### 9.4 Delegated authority

Some powers may be delegated for defined scopes or durations.

### 9.5 Procedural authority

Some actions may be allowed only at specific stages in a workflow and only under certain conditions.

### 9.6 Publication authority

Some actors may control whether an official matter becomes publicly published.

### 9.7 Certification authority

Some actors may possess authority to certify or finalize outcomes.

The later authority-model document should turn these into explicit constructs, but this document establishes that Ardtire’s institutional reality likely requires all of them.

---

## 10. Institutional posture on procedure

The platform should assume that important institutional acts are procedural rather than arbitrary.

This means that many actions should have:

* prerequisites
* authorized actors
* required data inputs
* valid stages
* transition effects
* resulting records
* visibility implications

For example, “approve proposal” should not simply be a boolean toggle. It should be understood as a procedural act occurring within a lifecycle and under authority.

This procedural posture will later justify explicit state machines and command-style APIs.

---

## 11. Institutional posture on records

The platform should treat records as part of the institution’s operating substance, not merely as byproducts.

Key implications:

* some outputs are archival in character
* some records should be immutable or version-locked once finalized
* historical retrieval matters
* provenance matters
* supersession matters
* records may have stronger handling requirements than general content

The platform must therefore be capable of distinguishing:

* live workflow state
* historical events
* official records
* public renderings of official records

---

## 12. Institutional posture on publication

Publication should be treated as an institutional act, not just “content went live.”

The system should assume that publication may involve:

* a readiness threshold
* an authorized publisher
* a public-visibility transition
* a recorded publication timestamp
* association with an official artifact, notice, or gazette entry
* public discoverability rules

This is especially important for a system that distinguishes internal draft activity from official public output.

---

## 13. Institutional posture on time

Institutions exist through time, and the platform should model time explicitly where relevant.

Examples:

* membership begins, changes, pauses, and ends over time
* terms of office have start and end dates
* proposals pass through stages over time
* ballots open and close at specific times
* publication occurs at specific times
* records may be superseded later but still remain historically valid for their original period

A strong institutional system is not just current-state aware; it is historically aware.

---

## 14. Institutional posture on legitimacy and clarity

The platform must help Ardtire Society act in ways that are legible and defensible.

That means users should be able to answer questions such as:

* What is this item?
* What stage is it in?
* Is it draft, official, or public?
* Who acted on it?
* Under what authority?
* What changed?
* What is the current official version?
* What previous versions existed?
* Has it been certified?
* Has it been published?

The system should reduce ambiguity, not merely digitize it.

---

## 15. Institutional domains implied by this model

This institutional model directly implies the following major domains for later architecture.

### 15.1 Identity domain

Who the actor is.

### 15.2 Membership domain

What institutional standing they hold.

### 15.3 Authority domain

What powers they hold, in what context.

### 15.4 Governance domain

Bodies, offices, terms, delegations.

### 15.5 Legislative/proposal domain

Structured proposals and their lifecycles.

### 15.6 Voting domain

Ballots, votes, tallies, and result evaluation.

### 15.7 Certification / ratification domain

Finalization and officialization of outcomes.

### 15.8 Records domain

Official memory and archival artifacts.

### 15.9 Publication domain

Notices, gazettes, registers, public projection.

### 15.10 Content/editorial domain

Pages, articles, informational content, media.

This mapping is one of the core bridges between institutional understanding and software architecture.

---

## 16. What this institutional model rejects

This document also implies the rejection of several weak or misleading models.

### 16.1 “It’s just a website”

Rejected. The website is only one surface of a deeper system.

### 16.2 “It’s just a CMS with some workflows”

Rejected. Editorial content management is not sufficient to represent governance.

### 16.3 “It’s basically a forum with voting”

Rejected. Discussion may support governance, but governance is not reducible to discussion.

### 16.4 “It’s just an admin panel over a database”

Rejected. Institutional actions must mean more than edits to rows.

### 16.5 “Admins can always fix it manually”

Rejected as a default posture. Manual operational intervention may exist, but must not replace the authority and audit model.

### 16.6 “Public pages equal official state”

Rejected. Public display should reflect authoritative, publication-aware projections.

---

## 17. Initial assumptions carried forward

The following assumptions from this document should guide downstream design unless explicitly revised.

1. Ardtire Society should be modeled as a formal civic-governance institution, not a casual online community.
2. Membership is institutionally meaningful.
3. Authority is differentiated and contextual.
4. Procedures matter and should be represented explicitly.
5. Official records matter and require stronger handling than general content.
6. Public communication and official institutional truth are related but distinct.
7. The platform must support long-term institutional continuity.

These assumptions should be treated as active planning assumptions in subsequent documents.

---

## 18. Implications for software architecture

This document has direct architectural consequences.

### 18.1 Domain-driven design is justified

The complexity is institutional, not just technical.

### 18.2 State machines will be required

Because the institution acts procedurally.

### 18.3 Permissions alone are insufficient

Authority modeling must go beyond a flat RBAC table.

### 18.4 CMS and governance must be separated

Because content and official institutional truth are not the same.

### 18.5 Audit and history are foundational

Because the institution must be able to explain its own actions.

### 18.6 Data models must reflect institutional meaning

Not simply UI convenience or CRUD habits.

### 18.7 Public projections must be deliberate

Because internal, official, and public states differ.

---

## 19. Summary

Ardtire Society should be treated by the platform as a membership-bearing, authority-bearing, procedure-bearing, record-bearing, public-facing, continuity-oriented civic-governance institution.

That sentence is the compact institutional model.

It implies that the platform must support:

* meaningful membership
* explicit authority
* structured procedures
* durable records
* controlled publication
* long-term continuity
* public and internal surfaces
* authority-aware digital operations

This institutional model is the conceptual anchor for all later architecture decisions.

---

## 20. Status

**Status:** Draft for adoption as foundational institutional model document.
**Intended authority level:** High.
**Depends on:** `docs/vision/product-mission.md`
**Next document:** `docs/vision/personas-and-actors.md`

3… 2… 1… next: I’ll continue with **Document 3 — `docs/vision/personas-and-actors.md`**.
