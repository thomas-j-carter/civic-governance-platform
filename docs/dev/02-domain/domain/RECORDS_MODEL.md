# RECORDS_MODEL

## Document Status
- Status: Canonical working baseline
- Purpose: define how authoritative records, versions, lineage, certification, and archival state are modeled in the Ardtire digital governance platform
- Audience: architecture, backend engineering, frontend engineering, operations, future AI implementation agents

---

## 1. Why This Document Exists

A governance platform is only as trustworthy as its record model.

The platform must preserve:
- what the authoritative record is
- which version is official
- how a record became official
- whether the record has been certified
- whether it has been published
- whether it has been corrected, superseded, or archived
- how to reconstruct the historical chain of changes

This document defines the canonical model for records and record lineage.

---

## 2. Foundational Principle

A record is not just a file.

A record is an authoritative institutional object with:
- a type
- a lifecycle
- provenance
- one or more versions
- official status semantics
- optional certification
- optional publication
- historical lineage

The platform must distinguish between:
- drafts
- review-stage artifacts
- official records
- public renderings of records
- superseded records
- archived records

---

## 3. Scope

The records model applies to canonical institutional materials such as:
- proposals
- amendment texts
- agendas and agenda items where official
- certified vote results
- appointment records
- office-holder records
- official notices
- policy/rule version records
- ratification records
- constitutional or procedural documents as canonical governed records
- register entries where modeled canonically

This model does not directly govern purely editorial CMS content.

---

## 4. Core Concepts

### 4.1 Record
A canonical institutional object tracked by the platform.

Examples:
- proposal record
- office-holder assignment record
- certified outcome record
- official notice record

A record is the durable identity of the object across versions.

### 4.2 Record Version
A concrete version of a record’s content and/or structured state representation.

A record may have multiple versions over time.

### 4.3 Record Type
A classification indicating the semantic kind of the record.

Examples:
- proposal
- amendment
- outcome
- vote_result
- notice
- office_assignment
- rule_set
- rule_version
- register_entry

### 4.4 Officiality
The record-level notion of whether a version is considered official for institutional use.

This is not the same thing as publication.

### 4.5 Certification
A formal attestation that a record or outcome satisfies institutional procedural requirements for official recognition.

### 4.6 Publication
A public or scoped-internal visibility event applied to a record or record-derived output.

### 4.7 Supersession
A relationship by which a later version or later record replaces an earlier official one for current-use purposes while preserving history.

### 4.8 Archival State
The status indicating that a record remains historically preserved but is no longer active/current.

---

## 5. Canonical Record Identity

Each canonical record must have:
- a stable unique identifier
- a record type
- a created-at timestamp
- an originating actor/system reference where applicable
- a current status
- lineage relationships
- a current version pointer where useful
- optional publication/certification summary pointers

The record identity persists even as versions change.

---

## 6. Record Version Model

Each version should capture:
- version identifier
- parent record identifier
- version number or sequence
- content payload and/or structured projection
- content hash or integrity hash where useful
- draft/review/official/published/superseded/archive state
- created by
- created at
- reason/change summary
- source event or workflow context
- certification reference if version-specific
- publication reference(s) if version-specific

A version is the unit of content history.

---

## 7. Record Status Model

Recommended status values for record versions:
- `draft`
- `under_review`
- `official`
- `published`
- `superseded`
- `archived`

These may be implemented as version status plus record summary status.

### Important Distinction
A record may be:
- official but not published
- published and later corrected
- superseded but still historically official for its time
- archived without being deleted

Deletion should be extremely rare and tightly constrained for canonical records.

---

## 8. Record Type Taxonomy

The exact taxonomy may evolve, but the platform should begin with a controlled enumeration.

Recommended starting types:
- `membership_decision`
- `membership_status_event`
- `governance_body`
- `office`
- `office_assignment`
- `session`
- `agenda`
- `agenda_item`
- `proposal`
- `amendment`
- `vote`
- `vote_result`
- `outcome`
- `certification`
- `ratification`
- `notice`
- `gazette_entry`
- `register_entry`
- `policy_definition`
- `policy_version`
- `constitutional_text`
- `procedural_rule_text`

---

## 9. Official Record Rules

A record version becomes official only through an explicit transition or workflow-backed event.

Examples:
- proposal admitted and locked as official text for consideration
- certified vote result marked official
- office assignment confirmed and made official
- policy version adopted and marked official

The system must not infer officiality from:
- mere creation
- presence in the database
- CMS publication
- admin visibility
- arbitrary timestamp thresholds

Officiality must be explicit.

---

## 10. Certification Model

Certification may apply to:
- outcomes
- vote tallies
- official notices
- rule/policy records
- record packages

Certification must support:
- certifier actor
- certification scope
- certification timestamp
- certification basis
- related policy/rule version
- notes/findings
- supersession or invalidation handling if later corrected

### Certification Principles
1. Certification is explicit, not implied.
2. Certification may be required before certain records can be treated as final or publishable.
3. Certification should be auditable and historically preserved.
4. Certification does not erase earlier uncertified drafts.

---

## 11. Publication Model Relationship

Publication is related to records but not identical to them.

A record may have:
- no publication
- one publication event
- multiple publication events across channels/scopes
- a correction publication
- a withdrawal publication
- a supersession publication

The public-facing representation may be:
- a direct rendering of the record
- a register entry derived from the record
- a gazette entry derived from the record
- a notice referencing the record

But the canonical record remains the source.

---

## 12. Lineage and Supersession

The platform must model historical lineage explicitly.

### Lineage relationships may include:
- version_of
- supersedes
- superseded_by
- derived_from
- certified_from
- published_as
- corrected_by

### Examples
- Proposal v3 supersedes Proposal v2
- Official notice correction supersedes initial notice publication
- Revised rule version supersedes prior rule version for future governance only
- New office assignment record ends and supersedes prior active assignment

### Principle
Supersession updates current-use interpretation without destroying historical traceability.

---

## 13. Record Provenance

Each record/version should preserve provenance where feasible:
- creator actor
- originating workflow
- originating domain event
- originating body/office context
- related proposal/session/outcome
- timestamps
- change reason

This helps answer:
- where did this record come from
- why does it exist
- what process created it

---

## 14. Draft vs Official Content

Records often move through multiple stages before officiality.

Examples:
- proposal draft prepared privately
- proposal text reviewed
- admitted proposal becomes official consideration text
- certified outcome becomes official final record
- published public rendering is derived from official record

The system must retain the difference between:
- working text
- reviewed text
- official text
- public text

Those are often related but not interchangeable.

---

## 15. Registers

A register is a structured view over canonical records.

Examples:
- active offices register
- office-holder register
- membership class register where allowed
- official outcomes register
- notices register
- rules/policies register

A register entry may be:
- directly canonical
- a derived projection of a canonical record
- a publication-layer view

The implementation must document which is the case for each register.

---

## 16. Corrections

The record model must support correction without falsifying history.

Correction approaches may include:
- new corrected record version
- correction notice publication
- corrected projection on public register with preserved historical note
- certification supersession or revision

### Principle
The platform must prefer additive correction over destructive replacement.

---

## 17. Archival Model

Archival status means:
- the record remains preserved
- it is historically retrievable
- it is no longer current/active for ordinary operational use
- it may still be cited historically

Archival must not mean deletion.

Deletion should generally be limited to:
- accidental duplicate stub creation under tightly controlled conditions
- legally required removal scenarios with special handling
- non-canonical temporary artifacts

---

## 18. Integrity and Immutability Expectations

Not every record version must be physically immutable at the storage layer, but the system should behave as though official historical versions are immutable in practice.

Recommended integrity measures:
- version append model
- audit every status-changing mutation
- content hashes for official versions where useful
- soft-locking of official/certified records
- explicit supersession instead of overwrite

---

## 19. Query and UX Expectations

Operators should be able to answer:
- what is the current official version
- what versions existed before
- what changed and why
- whether the record was certified
- whether it was published
- whether it has been corrected or superseded
- which public outputs derive from it

Public users should be able to answer, within appropriate bounds:
- what the current official public record is
- whether a public notice has been corrected or superseded
- how to view prior versions if policy permits

---

## 20. Cross-Domain Relationships

The records context intersects with:
- Governance Procedure: proposals, votes, outcomes
- Governance Structure: office assignments
- Publication: notices, gazette, registers
- Audit and Policy: certification, policy version references
- Membership: decisions and status events where canonicalized

The record model is therefore a core institutional backbone, not a peripheral storage convenience.

---

## 21. Minimal Canonical Fields

At minimum, canonical record tables/models should preserve:
- `id`
- `record_type`
- `status`
- `current_version_id` where applicable
- `created_at`
- `created_by_user_id` where applicable
- `superseded_by_record_id` where applicable
- `archived_at` where applicable

Version tables/models should preserve:
- `id`
- `record_id`
- `version_number`
- `status`
- `content` or structured payload
- `change_summary`
- `created_at`
- `created_by_user_id`
- `certification_id` where applicable

---

## 22. Rules for Implementation

1. Canonical records must have stable identity across versions.
2. Officiality must be explicit.
3. Certification and publication must be separately representable.
4. Supersession must preserve historical lineage.
5. Archival must not erase history.
6. Public rendering must derive from canonical records or clearly identified editorial content.
7. Corrections should be additive and traceable.
8. Record queries must support current and historical views.

---

## 23. Summary

The Ardtire records model treats institutional truth as:
- typed
- versioned
- provenance-aware
- certifiable
- publishable
- correctable
- supersedable
- archivable

This is necessary for a platform that aims to function as a trustworthy governance system rather than a collection of pages and forms.