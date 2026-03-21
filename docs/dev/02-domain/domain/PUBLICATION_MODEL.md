# PUBLICATION_MODEL

## Document Status
- Status: Canonical working baseline
- Purpose: define how official and editorial materials become visible on public and scoped surfaces
- Audience: product, architecture, frontend, backend, editorial operations, future AI implementation agents

---

## 1. Why This Document Exists

Governance software must define publication explicitly.

Without a publication model, institutions drift into:
- inconsistent public visibility
- accidental disclosure
- unclear official status
- confusion between draft and final materials
- inability to explain what is public, when, and why

This document defines the publication model for Ardtire.

---

## 2. Foundational Principle

Publication is an explicit institutional act or workflow consequence.

Publication is not equivalent to:
- data existence
- admin visibility
- record officiality
- CMS save action
- internal access

The platform must represent:
- eligibility for publication
- channel/scope of publication
- publication event
- withdrawal
- correction
- supersession
- archival visibility state

---

## 3. Publication Scopes

The system should support publication scope as a first-class field.

Recommended initial scopes:
- `public`
- `members_only`
- `internal_staff`
- `restricted_governance`
- `private_unpublished`

Not every canonical record may move through all scopes.

---

## 4. Publication Channels

Recommended conceptual channels:
- public website page
- public register
- public gazette/notices feed
- member portal
- internal admin/governance dashboard
- email or notification channel
- downloadable official document endpoint

A publication event may target one or more channels.

---

## 5. Publication-Eligible Material

Examples of materials that may be published:
- official notices
- proposal outcomes
- certified decisions
- office-holder changes
- active offices register
- selected governance records
- constitutional/procedural texts
- public announcements
- corrections or supersession notices

Examples of material that may remain unpublished or private:
- draft proposals
- internal review notes
- review queue metadata
- incomplete or uncertified outcomes where certification is required
- sensitive member information

---

## 6. Publication State Model

Recommended publication states:
- `not_publishable`
- `eligible`
- `scheduled`
- `published`
- `withdrawn`
- `corrected`
- `superseded`
- `archived`

### Meaning
- `not_publishable`: may not be published under current rules
- `eligible`: may be published if triggered/approved
- `scheduled`: publication planned
- `published`: currently visible on target channel(s)
- `withdrawn`: removed from normal display
- `corrected`: later correction exists
- `superseded`: later publication replaces it for current use
- `archived`: historically retained but not current

---

## 7. Publication Events

Each publication event should record:
- target record or derived object
- scope
- channel
- publication timestamp
- publishing actor or system actor
- effective date if distinct
- publication reason/category
- related certification if applicable
- related correction/supersession linkage if applicable

Publication events are part of the institutional audit trail.

---

## 8. Official vs Editorial Publication

### Official publication
Derived from canonical institutional records and subject to governance/publication rules.

Examples:
- certified outcome published to official register
- office-holder appointment notice
- official procedural text publication

### Editorial publication
Narrative or informational content published through CMS/editorial workflows.

Examples:
- homepage updates
- explanatory articles
- biographies
- public educational materials

These may coexist on the same public site, but they must remain conceptually separate.

---

## 9. Publication Preconditions

Publication may require one or more of:
- record exists
- record is official
- required certification complete
- required review complete
- scope/policy allows publication
- no active block/hold
- publishing actor has authority
- effective date reached

The platform must not treat all official records as automatically public.

---

## 10. Effective Date vs Publish Date

The system should distinguish:
- when something becomes visible
- when something becomes effective
- when something was adopted/decided

Examples:
- a notice may be published on one date but take effect later
- an office appointment may be decided now but term activates later
- a rule version may be published before it becomes active

These dates must not be conflated.

---

## 11. Public Registers

A public register is a structured public rendering of canonical data.

Examples:
- current offices and office holders
- official outcomes
- current policy versions
- official notices

Rules:
- register entries must derive from canonical records or well-defined projections
- entries must indicate correction/supersession where applicable
- historical access policy should be explicit

---

## 12. Gazette / Notices Model

A gazette-like surface is appropriate for:
- official announcements
- appointments
- decisions
- notices of publication
- corrections
- supersession notices
- effective date notices

A gazette item may:
- reference one or more canonical records
- summarize official action
- indicate publication class/category
- provide public legal/procedural notice without containing the full canonical record

---

## 13. Withdrawal

Publication withdrawal should be explicit.

Reasons may include:
- erroneous publication
- confidentiality issue
- publication before prerequisites were complete
- replacement by corrected version
- policy-driven removal from active surface

Withdrawal should preserve internal traceability and, where appropriate, public notice that a withdrawal occurred.

---

## 14. Corrections

Corrections should not silently replace history.

Correction patterns:
- issue corrected publication
- mark prior publication as corrected
- link correction notice to prior publication
- update current public display while preserving historical note

Public users should not be misled into thinking an erroneous earlier publication never existed if institutional policy requires transparency.

---

## 15. Supersession

A superseding publication replaces an earlier publication for current-use interpretation.

Examples:
- revised notice supersedes prior notice
- updated office-holder entry supersedes prior active entry
- newer rule publication supersedes current rule for future effect

Supersession should:
- preserve lineage
- update current display
- clearly indicate historical chain

---

## 16. Privacy and Visibility Discipline

The publication model must respect:
- member privacy
- internal review confidentiality
- draft confidentiality
- restricted governance visibility
- legal or policy obligations regarding records exposure

Default publication decisions should be explicit, not accidental.

---

## 17. Editorial Workflows

Editorial content may follow its own workflow:
- draft
- review
- scheduled
- published
- archived

But editorial publication must not create or modify canonical governance truth.

Editorial content may:
- reference official records
- explain decisions
- contextualize public materials

It may not:
- substitute for certification
- substitute for canonical outcome publication where formal record publication is required

---

## 18. Operator UX Requirements

Operators should be able to answer:
- what is currently public
- what is eligible but unpublished
- what is scheduled
- what was withdrawn
- what has been corrected
- what supersedes what
- who published it
- under what authority

That implies:
- publication dashboard
- filters by scope/channel/state
- publication history on each canonical record

---

## 19. Public UX Requirements

Public users should be able to understand:
- whether an item is official
- whether it is current
- whether it has been corrected or superseded
- when it was published
- when it became effective if relevant

This is especially important for notices, decisions, and office-holder changes.

---

## 20. Implementation Rules

1. Publication must be represented explicitly.
2. Publication scope and channel must be first-class.
3. Officiality and publication must remain distinct.
4. Corrections and supersession must preserve history.
5. Withdrawal must not silently erase traceability.
6. Public registers must derive from canonical records or defined projections.
7. Editorial publication must not create canonical governance truth.

---

## 21. Summary

The Ardtire publication model ensures that public and scoped visibility are:
- intentional
- policy-aware
- auditable
- historically honest
- clearly separated from mere data existence and from editorial content creation