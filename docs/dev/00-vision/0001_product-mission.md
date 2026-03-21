# Document 1 — `docs/vision/product-mission.md`

## Purpose of this document

This document defines the mission, scope, intended outcomes, and foundational product posture for the Ardtire Society Digital Governance Platform. It is the top-level product orientation document for the program. All later architecture, domain, data, workflow, and implementation decisions should be consistent with this document unless it is formally revised.

This document is not a marketing page. It is an internal source-of-truth artifact intended to align founders, architects, engineers, designers, and future contributors around what the platform is, why it exists, what problems it is meant to solve, and what it must not become.

---

## 1. Product name

**Ardtire Society Digital Governance Platform**

Working short names that may be used in technical documentation:

* Ardtire Governance Platform
* Ardtire Civic Governance System
* Ardtire Digital Governance Platform

Unless a narrower subdomain is being discussed, “the platform” in architecture documents refers to the Ardtire Society Digital Governance Platform as a whole.

---

## 2. Product mission

The mission of the Ardtire Society Digital Governance Platform is to provide a durable, auditable, rules-driven digital institutional system through which Ardtire Society can conduct membership administration, governance operations, legislative processes, voting procedures, official recordkeeping, and public publication in a manner that is orderly, transparent where appropriate, and faithful to the Society’s governing rules and institutional intent.

Stated more directly:

> The platform exists to make Ardtire Society governable in software without reducing governance to improvised admin actions, scattered spreadsheets, informal chats, or opaque manual processes.

The platform should enable Ardtire Society to move from informal or partially manual coordination into a coherent digital operating model in which institutional actions are:

* intentionally structured
* traceable to actors and authority
* constrained by formal rules
* recorded for later verification
* published appropriately when official and public-facing
* maintainable over long time horizons

---

## 3. Core product thesis

The core thesis of the platform is that Ardtire Society requires not merely a website or member portal, but a digital institutional framework that can faithfully support a constitutional-style civic organization with real procedures, formal roles, durable records, and public-facing legitimacy.

This means the platform must be treated as:

* an institutional system, not just a content site
* a governance engine, not just a collaboration workspace
* a record-bearing system, not just a CRUD application
* a long-lived source of organizational memory, not just a launch-phase MVP

The platform must therefore be designed from first principles around:

* authority
* procedure
* state
* auditability
* publication
* institutional continuity

---

## 4. Why this platform exists

Ardtire Society’s intended mode of operation includes more structural and procedural depth than a typical membership website or nonprofit portal. The organization needs software that can support, over time, all or most of the following:

* membership intake and review
* member status administration
* role and office administration
* governance body composition
* proposal drafting and progression
* procedural review and readings
* voting and ballot management
* certification and ratification workflows
* official records and archives
* gazette/publication workflows
* public transparency and institutional communication
* separation between editorial content and authoritative governance state

Without a purpose-built governance platform, these functions tend to fragment across unrelated tools:

* email threads
* chat messages
* cloud docs
* spreadsheets
* ad hoc PDFs
* CMS entries used beyond their proper scope
* manual judgment calls with poor traceability
* duplicated records with unclear authority

That fragmentation creates risk. It makes it difficult to answer questions such as:

* What is the current official status of this proposal?
* Who had authority to take this action?
* Under what rules was this vote certified?
* Which version of the text was adopted?
* What is public, what is internal, and what is still draft?
* What is the official record of this officeholder or decision?
* What changed, when, and by whom?

This platform exists to eliminate or drastically reduce that ambiguity.

---

## 5. Primary product goals

The platform should satisfy the following primary goals.

### 5.1 Governance execution

The platform must enable Ardtire Society to execute its governance procedures in software through explicit, structured workflows rather than through informal administrative improvisation.

### 5.2 Institutional clarity

The platform must make it clear:

* who can do what
* in what context
* under what authority
* at what stage of a process
* with what resulting record

### 5.3 Durable records

The platform must produce and preserve reliable institutional records of significant actions, outcomes, and publications.

### 5.4 Procedural fidelity

The platform must support governance procedures in a way that is aligned with Ardtire Society’s actual governing model and not force the institution into an ill-fitting generic SaaS workflow.

### 5.5 Public legitimacy and transparency

Where appropriate, the platform must support public visibility into official outputs such as notices, records, publications, officeholders, and governance outcomes.

### 5.6 Controlled internal operations

The platform must support internal review, drafting, moderation, administration, and certification processes without prematurely exposing in-progress internal state as public truth.

### 5.7 Auditability

The platform must make consequential actions reconstructable after the fact, including actor identity, timestamps, transitions, and rule context.

### 5.8 Long-term maintainability

The platform must be understandable, evolvable, and operable over years, not merely weeks. Its architecture must support continuity, revision, and institutional memory.

---

## 6. Secondary product goals

In addition to the primary goals above, the platform should also aim to provide the following secondary benefits.

### 6.1 Better member experience

Members should have a clear, understandable digital experience for applications, status, participation, proposals, votes, notices, and records relevant to them.

### 6.2 Better officer experience

Officers and administrators should be able to carry out institutional responsibilities with strong tooling, clear queues, reliable state, and reduced ambiguity.

### 6.3 Better editorial coherence

Public-facing communications, pages, explanatory materials, and announcements should be manageable through a CMS and coordinated with official record/publication workflows.

### 6.4 Stronger institutional continuity

The platform should reduce dependence on any one operator’s memory, inbox, or private document collection.

### 6.5 Better future extensibility

The system should be designed so that later capabilities can be added without breaking the conceptual model. This includes future participation modules, public consultations, richer registers, more sophisticated legislative workflows, or integration with external systems.

---

## 7. Product non-goals

A senior engineer would define non-goals early so the system does not accrete uncontrolled scope. The following are non-goals unless later elevated explicitly.

### 7.1 It is not a generic social network

The platform is not intended to optimize for feed engagement, viral sharing, or social-media-style interaction patterns.

### 7.2 It is not primarily a forum

Discussion may exist in limited or structured forms, but free-form discussion tooling is not the constitutional center of the product.

### 7.3 It is not merely a brochure website

The public site matters, but it is not the core of the system. The core is the institutional engine behind the public presentation.

### 7.4 It is not a document dump

The platform should not become a miscellaneous repository of unstructured files with little metadata, workflow meaning, or procedural context.

### 7.5 It is not an unconstrained wiki

Knowledge and explanatory content may exist, but official governance state and authoritative records must not be reduced to editable wiki pages.

### 7.6 It is not a pure CMS solution

The CMS is an important subsystem, but it must not become the de facto authority layer for membership, proposals, ballots, certification, ratification, or official legal/procedural state.

### 7.7 It is not “admin panel first” software

An internal admin interface will exist, but the system is not to be architected as a pile of hidden administrative shortcuts without formal domain logic.

### 7.8 It is not a thin wrapper over Decidim

Decidim may be integrated for participation use cases, but Ardtire’s canonical governance outcomes, records, and authority model should remain under Ardtire’s own domain architecture.

---

## 8. Product users and stakeholders

The platform serves multiple user classes with different responsibilities and expectations.

### 8.1 Public visitors

Public visitors may browse public pages, announcements, records, gazette items, officeholder registers, and other transparency surfaces. They are not authenticated institutional actors by default.

### 8.2 Applicants

Applicants interact with the membership intake process and related communications. They may have limited authenticated access.

### 8.3 Members

Members require access to member-specific experiences such as:

* profile/status visibility
* notices
* proposal participation
* ballots
* governance information
* member-only documents or resources as authorized

### 8.4 Officers

Officers require action-oriented interfaces and auditability for institutional tasks such as review, approvals, oversight, assignments, and governance operations.

### 8.5 Administrators

Administrators maintain operational continuity, configuration, and selected supervisory functions, but should not be modeled as all-powerful actors outside governance rules.

### 8.6 Editors / communications staff

Editors manage public content, media, explanatory pages, and announcements through the CMS or equivalent editorial systems.

### 8.7 Certifiers / authorized officials

Certain actors may require elevated procedural authority for certification, ratification handling, publication finalization, or official register confirmation.

### 8.8 Founders / constitutional stewards / top-level institutional authorities

Depending on the final authority model, some small set of actors may hold special authority in narrowly defined areas. Their powers must be modeled explicitly, not hand-waved.

### 8.9 Engineers and operators

Internal technical stakeholders rely on the platform being understandable, supportable, and observable in production.

---

## 9. Product philosophy

The platform should be developed according to the following product philosophy.

### 9.1 Institutional software over ad hoc tooling

The platform should encode stable institutional patterns, not depend on operator memory and improvised workarounds.

### 9.2 Explicitness over hidden logic

Lifecycle stages, permissions, rule applications, and publication states should be explicit and inspectable.

### 9.3 Authority-aware design

All important processes should consider not just “can someone click the button” but “does this actor have the authority to do this here and now.”

### 9.4 Record-first thinking

Official outcomes and consequential transitions should generate durable records, not merely transient UI state changes.

### 9.5 Public clarity without procedural recklessness

The system should support meaningful transparency while preserving proper internal review and avoiding premature publication of draft or uncertified matter.

### 9.6 Long-horizon architecture

The platform should be designed to remain coherent as the institution becomes more complex.

### 9.7 Human-legible governance

The software should help users understand process and status rather than obscure it behind technical abstractions.

---

## 10. Foundational product principles

The following principles should govern product decisions unless a later authoritative architecture document explicitly narrows or supersedes them.

### Principle 1: Governance is a domain, not a feature

Proposal handling, voting, ratification, publication, and records are not generic “features.” They are expressions of a deeper governance domain and should be modeled as such.

### Principle 2: Consequential actions require traceability

Any action that changes institutional state in a meaningful way must be attributable, timestamped, and reconstructable.

### Principle 3: Public truth is not identical to internal draft state

The platform must distinguish between internal working state and publicly authoritative state.

### Principle 4: Rules matter as much as data

The platform must not only store outcomes; it must support the logic and rule context by which those outcomes were produced.

### Principle 5: Authority must be modeled directly

Roles, offices, delegations, approvals, and procedural powers should be represented in the domain model rather than approximated with a single coarse admin flag.

### Principle 6: Official records deserve stronger handling than ordinary content

Certified outcomes, promulgated texts, official notices, and public registers require stronger durability and clearer provenance than normal web content.

### Principle 7: Software should reduce ambiguity, not relocate it

If the product merely moves confusion from spreadsheets into screens, it has failed.

### Principle 8: Architecture should preserve future options

Early implementation should not prevent later introduction of richer workflows, stronger certification logic, or additional governance domains.

---

## 11. Scope of the initial platform

The initial platform should focus on the minimum set of capabilities required to establish a strong, coherent governance foundation. At this stage, “minimum” should mean “minimum viable institutional integrity,” not “minimum number of screens.”

The likely initial scope includes:

### 11.1 Identity and authentication integration

Users must be able to authenticate reliably through the chosen identity provider and enter the platform with a normalized application identity context.

### 11.2 Membership administration

The system should support application intake, review, decisioning, status tracking, and ongoing member administration.

### 11.3 Governance bodies and offices

The platform should support the definition and display of bodies, offices, officeholders, terms, and related authority-bearing assignments.

### 11.4 Proposal lifecycle management

The system should support proposal creation, drafting, submission, review, progression, and version-aware handling.

### 11.5 Voting lifecycle management

The system should support ballots, eligibility handling, tallying, and result progression through proper states.

### 11.6 Certification / ratification handling

The initial platform should include at least a foundational model for handling the officialization of outcomes beyond simple vote completion.

### 11.7 Records and archives

The system should support official records and public/internal retrieval as appropriate.

### 11.8 Gazette / publication pipeline

The platform should support structured publication of official notices, outcomes, acts, or equivalent public-facing institutional outputs.

### 11.9 Public information surfaces

The system should provide a public-facing website and register-style views that expose appropriate official/public information.

### 11.10 Administrative and operational tooling

Internal users should have reliable interfaces for carrying out legitimate institutional work.

---

## 12. Likely deferred or intentionally limited scope

The following may be deferred, minimized, or treated as secondary until the governance foundation is stable.

* extensive social/community features
* complex discussion/forum ecosystems
* deep mobile-native apps
* generalized knowledge-base/wiki systems
* advanced analytics dashboards beyond operational necessity
* broad third-party app marketplace patterns
* speculative automation not tied to governance needs
* overbuilt public engagement features before authoritative core workflows exist
* judicial or land-registry-style domains unless separately elevated and specified

This does not mean these are unimportant forever. It means they should not displace the foundational institutional core.

---

## 13. What success looks like

The platform will be successful when Ardtire Society can honestly say that it has a coherent digital institutional operating layer rather than a patchwork of partial tools.

Concrete signs of success include:

* membership statuses and decisions are clear, current, and historically traceable
* governance bodies and officeholders are reliably represented
* proposals move through defined lifecycle states rather than ad hoc handling
* ballots and outcomes are managed with strong procedural clarity
* official actions result in durable records
* public-facing official information reflects authorized publication states
* internal users know where to perform governance tasks
* the organization can answer “what happened, when, by whom, and under what authority/rules?”
* the platform reduces confusion instead of generating new ambiguity
* the system remains understandable to engineers and operators over time

---

## 14. What failure would look like

This document should also define anti-success conditions. The platform should be considered off track if it begins to exhibit the following properties.

### 14.1 CMS overreach

Editorial tooling begins to function as the real governance source of truth.

### 14.2 Authority ambiguity

Actions are possible in the UI without a clear and modeled authority basis.

### 14.3 Hidden transitions

Important institutional changes occur through implicit or poorly visible backend side effects.

### 14.4 Weak auditability

Operators cannot reconstruct who changed what and why.

### 14.5 Conflation of draft and official state

Users or the public cannot tell whether a matter is draft, pending, certified, ratified, or published.

### 14.6 CRUD masquerading as governance

The platform degenerates into generic record editing with labels instead of actual workflow logic.

### 14.7 Excessive coupling

The web app, CMS, and governance logic become so entangled that institutional rules cannot evolve safely.

### 14.8 Over-customized chaos

Fast tactical additions accumulate without a strong domain model, producing brittle and contradictory behavior.

---

## 15. Product positioning relative to major subsystems

This section clarifies the role of major planned subsystems.

### 15.1 Web application

The web application is the primary user-facing interface layer for public, member, officer, and admin experiences. It should present process and state clearly, but it should not be the ultimate location of business truth.

### 15.2 Governance API

The governance API is the canonical application layer for authoritative domain operations, workflow execution, permission enforcement, and durable state mutation.

### 15.3 CMS

The CMS is the editorial and content-management subsystem for public and structured content. It should support communication and public presentation, not replace governance logic.

### 15.4 Identity provider

The identity provider authenticates users and provides identity/session infrastructure. It should not alone determine final governance permissions or eligibility.

### 15.5 Participation platforms such as Decidim

External participation systems may support consultation, engagement, or adjunct participation patterns, but Ardtire’s own platform should remain authoritative for canonical institutional state unless explicitly and carefully designed otherwise.

### 15.6 Database and records storage

Persistent storage is not just a technical necessity; it is the substrate of institutional memory. Data design must therefore reflect governance semantics, not merely app convenience.

---

## 16. Product posture on transparency

Ardtire Society’s platform should be designed to support meaningful transparency while respecting the difference between internal procedure and official public output.

The transparency model should assume at least three broad categories:

* internal working material
* official but non-public or restricted material
* public official material

The product must support correct transitions between these categories where authorized.

The platform should not default to one of two bad extremes:

* total opacity, where nothing is understandable
* reckless exposure, where draft or internal material is treated as official public output

The correct posture is controlled, structured transparency.

---

## 17. Product posture on institutional memory

The platform should be designed as a long-lived institutional memory system.

This means:

* preserving history matters
* superseded records still matter
* prior versions matter
* adopted text lineage matters
* prior officeholder and term history matters
* rule context matters
* publication chronology matters

The product should assume that future users will need to understand not only the current state but the sequence by which the current state came to exist.

---

## 18. Product posture on correctness versus speed

For Ardtire’s governance platform, correctness in domain modeling, authority handling, workflow semantics, and recordkeeping should take precedence over raw speed of feature shipping in the foundational phases.

This does not justify paralysis or endless overdesign. It does require discipline. A rushed but conceptually wrong governance core is more expensive than a deliberately designed one.

The practical interpretation is:

* move steadily
* design intentionally
* keep scope disciplined
* avoid premature UI flourish
* prefer explicit models over clever shortcuts
* ship in phases without sacrificing conceptual integrity

---

## 19. Product constraints

The platform should be designed within the following current strategic constraints.

### 19.1 It should fit a polyglot monorepo without Bazel

This reflects the preferred engineering posture.

### 19.2 It should separate governance logic from content management

This is foundational.

### 19.3 It should support role- and authority-aware experiences

This is intrinsic to the domain.

### 19.4 It should be capable of strong auditability

The platform must be able to explain itself.

### 19.5 It should be evolvable

The system must support additional procedural sophistication later without architectural collapse.

### 19.6 It should support public and internal surfaces

Ardtire requires both.

---

## 20. Product assumptions

The following assumptions are adopted for current planning and should be validated or refined in later documents.

1. Ardtire Society intends to operate with enough procedural depth that explicit governance workflows are justified.
2. Membership is not merely a mailing-list concept; it has institutional significance.
3. Proposals, votes, and official publications require better handling than generic document storage.
4. Public transparency matters, but not every internal state is automatically public.
5. Authority is differentiated and cannot be represented adequately by a single super-admin role.
6. Editorial content and institutional records are related but distinct.
7. The organization’s digital systems should become a durable operational backbone, not a temporary patchwork.

These assumptions should be revisited only through deliberate revision, not drift.

---

## 21. Product summary

In summary, the Ardtire Society Digital Governance Platform is intended to be a digital institutional framework that enables Ardtire Society to conduct governance, administration, recordkeeping, and public publication in a structured, auditable, authority-aware manner.

It should be understood as:

* more than a website
* more than a member portal
* more than a CMS
* more than a voting tool
* more than an admin dashboard

It is a platform for digital governance and institutional continuity.

Its architecture must therefore serve not only usability and maintainability, but also legitimacy, procedural clarity, and durable record-bearing operation.

---

## 22. Decision implications for later documents

This document implies the following mandatory downstream architecture directions.

1. Later documents must model governance as a first-class domain.
2. Authority, role, office, and permission distinctions must be explicit.
3. State machines will be required for major workflows.
4. Official records and publication flows must be modeled separately from editorial content.
5. Public-facing projections must not be assumed to be identical to internal operational state.
6. Auditability is a baseline requirement, not a later enhancement.
7. Data and API design must reflect institutional meaning rather than generic CRUD convenience.

---

## 23. Status

**Status:** Draft for adoption as foundational product mission document.
**Intended authority level:** High.
**Supersedes:** None yet.
**Superseded by:** Nothing.
**Next document:** `docs/vision/institutional-model.md`

3… 2… 1… next: I’ll continue with **Document 2 — `docs/vision/institutional-model.md`**.
