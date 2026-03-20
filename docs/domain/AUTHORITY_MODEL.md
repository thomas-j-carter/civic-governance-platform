# AUTHORITY_MODEL

## Document Status
- Status: Canonical working baseline
- Purpose: define how authority, permissions, and action legitimacy are modeled in the Ardtire digital governance platform
- Audience: product, architecture, backend/frontend engineers, security-minded implementers, future AI implementation agents

---

## 1. Why This Document Exists

Authority is one of the most critical concerns in governance software.

This platform cannot rely on simplistic assumptions such as:
- logged in = allowed
- admin = can do everything
- member = can vote on everything
- editor = can publish official outcomes

The system must determine:
- who the actor is
- what capacities they currently hold
- what permissions they possess
- what office/body/term context applies
- what procedural preconditions exist
- what policy version governs the action
- whether the action is valid on this object in this state

This document defines that model.

---

## 2. Foundational Principle

Authority in the system is derived from multiple layers, not one.

A valid action may depend on:
- authenticated identity
- application role
- membership status
- office held
- body affiliation
- delegated authority
- object state
- workflow state
- policy/rule version
- environment or scope visibility

Therefore, authorization must be modeled as a layered decision, not a flat role lookup.

---

## 3. Authority Layers

## 3.1 Authentication Layer
Question:
- Is the actor authenticated as a recognized identity?

Source:
- Keycloak and application session context

Output:
- actor identity available for downstream checks

Authentication alone grants no substantive institutional authority beyond access to basic authenticated surfaces.

---

## 3.2 Surface Access Layer
Question:
- Can the actor access the relevant area of the application?

Examples:
- public area
- applicant area
- member area
- admin area
- editorial area

This is the broad RBAC-like layer.

---

## 3.3 Institutional Status Layer
Question:
- What institutional standing does the actor currently have?

Examples:
- applicant
- active member
- suspended member
- former member
- officer
- reviewer
- certifier

This is distinct from mere login state.

---

## 3.4 Office and Body Authority Layer
Question:
- Does the actor currently hold an office or body position that grants relevant powers?

Examples:
- council member
- chair
- secretary/registrar equivalent
- certifier
- administrative officer

This requires time-bounded, event-backed office-holder status.

---

## 3.5 Delegated Authority Layer
Question:
- Has authority been delegated to the actor for this class of action?

This supports limited operational flexibility without rewriting core power structures.

---

## 3.6 Object and Workflow Layer
Question:
- Is the actor allowed to perform this action on this object in its current state?

Examples:
- a proposal may be editable in draft but not after certification
- a reviewer may act on an application in review, but not after final decision
- a certifier may certify an outcome only after prerequisites are met

---

## 3.7 Policy/Rule Version Layer
Question:
- Which rule set governs this action and does the actor satisfy it?

Examples:
- voting eligibility rules
- quorum rules
- threshold rules
- publication rules
- certification rules

---

## 4. Practical Authorization Model

The recommended model is hybrid:

### Broad access control
RBAC-style application roles grant or deny broad surface access.

### Fine-grained authority control
Policy checks determine whether the actor may perform a specific procedural action on a specific object in a specific state.

This means:
- route access may be role-based
- action execution must be policy-based

---

## 5. Canonical Actor Types

These actor types are conceptual and may map to multiple implementation roles.

### Public Visitor
Unauthenticated user.
Can access only public content and public records.

### Authenticated User
Known logged-in actor without any special institutional standing beyond authentication.

### Applicant
Actor with an active or historical membership application.

### Member
Actor with active recognized membership.

### Suspended Member
Actor whose membership is temporarily restricted.

### Reviewer
Actor authorized to review applications or workflow items.

### Editor
Actor authorized to manage editorial content.

### Officer
Actor holding an institutional office.

### Body Member
Actor who participates in one or more governance bodies.

### Certifier
Actor authorized to certify specific categories of outcomes or records.

### Administrator
Actor with elevated application administration power.

### Founder or Super-Administrative Actor
Potential early-phase bootstrap role, to be minimized and eventually constrained by explicit governance design.

### System Actor
Automated job/process acting in bounded, auditable ways.

---

## 6. Role Categories

To avoid conflation, role categories must remain distinct.

### 6.1 Application Roles
Used for broad app access and operational grouping.
Examples:
- visitor
- authenticated_user
- admin
- editor
- moderator

### 6.2 Institutional Statuses
Used to reflect the actor’s place in the institution.
Examples:
- applicant
- active_member
- suspended_member

### 6.3 Governance Capacities
Used for procedural action eligibility.
Examples:
- body_member
- chair
- certifier
- presiding officer
- secretary/registrar equivalent

### 6.4 Office-Derived Powers
Derived from current office holding and term validity.

### 6.5 Delegated Powers
Granted temporarily or specifically by another valid authority source.

The implementation must not compress all of these into one flat role field.

---

## 7. Permission Families

The system should define permission families rather than only endpoint-specific permissions.

### 7.1 View Permissions
Examples:
- view_public_content
- view_member_dashboard
- view_internal_member_records
- view_governance_admin
- view_audit_data
- view_official_registers_internal

### 7.2 Membership Permissions
Examples:
- submit_membership_application
- review_membership_application
- approve_membership_application
- reject_membership_application
- suspend_member
- reinstate_member

### 7.3 Governance Structure Permissions
Examples:
- create_governance_body
- modify_governance_body
- create_office
- assign_office_holder
- end_office_assignment

### 7.4 Proposal Permissions
Examples:
- create_proposal_draft
- submit_proposal
- review_proposal_admissibility
- admit_proposal
- reject_proposal
- amend_proposal
- withdraw_proposal
- schedule_proposal

### 7.5 Voting Permissions
Examples:
- open_vote
- close_vote
- cast_vote
- certify_vote_result
- view_ballot_details_internal

### 7.6 Publication Permissions
Examples:
- create_publication_event
- publish_notice
- publish_official_record
- withdraw_publication
- issue_correction_notice

### 7.7 Administrative Permissions
Examples:
- manage_roles
- view_audit_logs
- resolve_exceptions
- run_backfill_tools
- configure_policy_versions

---

## 8. Object-Sensitive Authorization

Permissions alone are insufficient. Authorization must consider object context.

Examples:
- A reviewer may review only applications assigned to their jurisdiction or scope.
- An editor may publish editorial content but not certify official institutional outcomes.
- A body member may vote only on matters for which they are an eligible participant.
- An admin may manage roles but may not necessarily certify constitutional outcomes unless separately authorized.
- A certifier may certify only specified categories of records.

Therefore, authorization must evaluate:
- actor
- action
- target object
- object state
- actor’s relationship to object
- applicable rules

---

## 9. Time Sensitivity of Authority

Authority is often time-bound.

Examples:
- office holder authority exists only during an active term
- delegated authority may expire
- voting eligibility may depend on current active member status at a cutoff time
- review assignments may be temporary

All authority decisions should be evaluated with time-awareness where relevant.

---

## 10. Rule-Version Sensitivity of Authority

Some authority decisions depend on the procedural rule version in force.

Examples:
- who counts toward quorum
- who is eligible to vote
- who may certify which outcomes
- what publication step is required before public visibility

Where a rule materially affects the action or outcome, the system should preserve the rule reference used.

---

## 11. Policy Evaluation Model

A practical evaluation flow:

1. Confirm actor identity.
2. Confirm surface access.
3. Load institutional statuses and active roles.
4. Load office/body/delegation context.
5. Load target object and current workflow state.
6. Load applicable policy/rule version(s).
7. Evaluate action-specific guard conditions.
8. Return decision with reason and auditability.

This should be implemented through explicit application-layer policy services/helpers, not scattered inline checks.

---

## 12. Examples of Authority Decisions

### Example A: Approve membership application
Requires:
- authenticated actor
- reviewer/admin-level operational access
- application in reviewable state
- actor has authority to approve this application class
- policy allows approval path
- decision recorded with reason

### Example B: Open proposal vote
Requires:
- authenticated actor
- governance administration access
- proposal in schedulable/openable state
- prerequisites satisfied
- actor has authority to open vote for this body/process
- applicable procedural rules loaded

### Example C: Certify outcome
Requires:
- authenticated actor
- certifier or equivalent capacity
- vote/outcome complete and eligible for certification
- no blocking unresolved exception
- action within scope of certifier authority
- certification event recorded immutably

### Example D: Publish editorial page
Requires:
- editorial role
- content ready for publication
- editorial workflow conditions satisfied
- does not require governance certification unless also bound to canonical record publication rules

---

## 13. Bootstrap vs Mature Authority

In early implementation phases, there may be bootstrap administrative roles that possess broad authority to establish the system.

This is acceptable temporarily but must be treated as:
- explicit
- documented
- auditable
- progressively constrained as the governance model matures

The platform should not assume permanent superuser behavior as the final institutional model.

---

## 14. Human vs System Authority

Automated jobs may perform actions such as:
- sending notifications
- rendering public register pages
- syncing data projections
- issuing scheduled reminders

System actors must:
- have bounded scopes
- emit auditable events
- never silently impersonate human institutional authority
- avoid performing substantive governed transitions unless explicitly designed and documented

---

## 15. Denial Transparency

Authorization decisions should be explainable internally.

The system should be able to tell operators, in bounded safe ways:
- why an action was denied
- which precondition failed
- whether the denial was due to missing role, missing office, wrong state, expired authority, or policy mismatch

This improves supportability and reduces “mystery admin behavior.”

---

## 16. Security Principles

1. Least privilege by default
2. Separate authentication from authorization
3. Never trust client-side checks alone
4. Require explicit server-side policy evaluation for governed mutations
5. Audit privileged and meaningful actions
6. Prefer explainable denials over silent failures
7. Avoid permanent unconstrained superuser dependence

---

## 17. Summary

Authority in the Ardtire platform is a layered composition of:
- identity
- access role
- institutional status
- office/body capacity
- delegation
- object relationship
- workflow state
- governing policy version

The platform must therefore use a hybrid model:
- RBAC for broad access
- policy/guard-based authorization for real institutional actions

This is essential to building software that behaves like a trustworthy governance system rather than a generic admin dashboard.