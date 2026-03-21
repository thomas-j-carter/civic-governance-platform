# Document 10 — `docs/domain/authority-model.md`

## Purpose of this document

This document defines the **authority model** of the Ardtire Society Digital Governance Platform.

Authority modeling is one of the most critical aspects of governance software. It determines **who is permitted to perform which actions under what circumstances**.

Earlier documents established:

* actors and personas
* domain entities
* workflows and state machines
* governance rules

However, none of those define **who is allowed to trigger a transition or perform a governance action**.

That responsibility belongs to the **authority model**.

The authority model ensures that:

* actors act only within legitimate scope
* governance decisions follow institutional structure
* procedural legitimacy is preserved
* auditability is maintained

Without a well-defined authority model, the system would devolve into **administrator-driven overrides**, undermining governance integrity.

---

# 1. Authority modeling principles

The authority system must follow several principles.

## Principle 1 — Authority is contextual

Authority is never absolute.

An actor’s authority depends on:

* their identity
* their membership standing
* their assigned roles
* offices they hold
* delegated powers
* the current workflow state
* applicable governance rules

---

## Principle 2 — Authority derives from institutional structure

Authority must derive from real institutional constructs such as:

* membership status
* offices
* governance bodies
* delegations
* procedural roles

It must not derive purely from technical privileges.

---

## Principle 3 — Authority must be auditable

Every action performed under authority must record:

* the actor
* the authority context
* the action taken
* the time

---

## Principle 4 — Authority must be explicit

Authority relationships must be stored in the domain model, not embedded in hidden application logic.

---

# 2. Sources of authority

Authority in the system may originate from several sources.

## Identity authority

The most basic level: the system knows **who the actor is**.

Identity alone does not grant governance authority.

---

## Membership authority

Membership provides baseline institutional standing.

Some actions require:

* active membership
* specific membership classes

---

## Role authority

Roles represent permission groupings used in the application.

Examples:

* moderator
* reviewer
* operator

Roles are typically **software-level constructs**.

---

## Office authority

Offices represent **institutional positions** with defined powers.

Examples:

* chair
* secretary
* registrar
* certification authority

Office-based authority is usually **stronger and more formal than role authority**.

---

## Delegated authority

Delegations represent **temporary or scoped transfers of authority**.

Example:

* a committee chair delegates review authority to a subcommittee member.

---

## Procedural authority

Some actions are permitted only within specific workflow contexts.

Example:

* only certain actors may advance a proposal from “FirstReading” to “SecondReading”.

---

# 3. Authority hierarchy

Authority sources form a hierarchy.

```text id="q0m6v9"
Identity
   │
Membership
   │
Role Assignments
   │
Office Holdings
   │
Delegations
   │
Procedural Authority
```

Higher levels refine or expand authority.

---

# 4. Authority entities

The domain model must include entities representing authority.

## RoleAssignment

Represents assignment of a role to an actor.

Attributes:

* role_id
* person_id
* assignment_date
* expiration_date

---

## Office

Represents a defined institutional position.

Attributes:

* office_id
* office_name
* authority_scope

---

## OfficeHolder

Represents a person occupying an office.

Attributes:

* office_holder_id
* office_id
* person_id
* term_start
* term_end

---

## Delegation

Represents delegated authority.

Attributes:

* delegation_id
* delegator_person_id
* delegate_person_id
* authority_scope
* effective_date
* expiration_date

---

## AuthorityGrant

Represents a specific authority capability.

Example:

```text id="3f9pjz"
certify_result
publish_gazette
review_application
```

---

# 5. Authority scope

Authority must always include a **scope**.

Examples:

### Global scope

Applies across the entire institution.

Example:

* registrar authority

---

### Body scope

Applies within a governance body.

Example:

* committee chair authority

---

### Proposal scope

Applies to a specific proposal.

Example:

* amendment sponsor

---

### Ballot scope

Applies to a specific ballot.

Example:

* vote eligibility

---

# 6. Authority evaluation process

When an actor attempts an action, the system evaluates authority.

Evaluation steps:

1. Identify actor identity
2. Retrieve membership status
3. Retrieve roles
4. Retrieve office holdings
5. Retrieve delegations
6. Determine procedural context
7. Evaluate rule guards
8. Confirm authority

---

## Example evaluation

Example: certification attempt.

```text id="l3daxk"
actor = Person(42)

if actor.hasOffice("CertificationAuthority"):
    allow
else:
    deny
```

---

# 7. Authority resolution algorithm

Example resolution flow:

```text id="l1d71v"
resolveAuthority(actor, action, context):

  if not actor.authenticated:
      return DENY

  membership = getMembership(actor)

  if membership not valid:
      return DENY

  if roleAllows(action):
      return ALLOW

  if officeAllows(action):
      return ALLOW

  if delegationAllows(action):
      return ALLOW

  return DENY
```

---

# 8. Authority and state machines

Authority is enforced at state machine transitions.

Example:

```text id="6uv0hp"
Transition: VotingClosed → ResultPendingCertification
Guard: actor.hasAuthority(certify_result)
```

If guard fails, transition cannot occur.

---

# 9. Authority and governance rules

Authority checks occur **before rule evaluation**.

Example sequence:

```text id="mvtg0j"
1. actor authority validated
2. rule evaluation performed
3. state transition executed
```

Both must succeed.

---

# 10. Authority expiration

Authorities may expire.

Examples:

* role expiration
* office term end
* delegation expiration

The system must check expiration timestamps during evaluation.

---

# 11. Authority revocation

Authorities may be revoked.

Examples:

* removal from office
* role revocation
* delegation cancellation

Revocation should immediately invalidate authority.

---

# 12. Authority conflicts

Conflicts may arise when multiple authority sources apply.

Resolution order:

1. procedural constraints
2. office authority
3. delegated authority
4. role authority

Procedural constraints always override.

---

# 13. Authority audit logging

Each authority-based action must log:

* actor
* authority source
* action
* timestamp
* affected entity

Example:

```text id="n7s6b0"
Actor: Person 42
Authority: OfficeHolder(CertificationAuthority)
Action: CertifyResult
Time: 2029-04-12
```

---

# 14. Authority and impersonation

Administrative impersonation should be restricted.

If allowed, the system must record:

* impersonating actor
* impersonated actor
* reason
* timestamp

This preserves audit integrity.

---

# 15. Authority visualization

Users should be able to see their authority context.

Example:

```text id="ra9ccp"
You are acting as:

Member
Committee Reviewer
Certification Authority
```

This reduces confusion.

---

# 16. Authority boundaries

Authority must never allow actors to:

* bypass rule evaluation
* bypass certification processes
* modify immutable records

Even high-authority actors must operate within defined procedures.

---

# 17. Authority escalation

Some exceptional actions may require multiple authorities.

Example:

```text id="u8o8re"
ResultCertification requires:
  CertificationAuthority
  + PublicationAuthority confirmation
```

This supports checks and balances.

---

# 18. Authority data storage

Authority assignments should be stored in dedicated tables.

Example:

```text id="r45is6"
role_assignments
office_holders
delegations
authority_grants
```

These tables form the authority layer.

---

# 19. Authority testing

Authority logic must be heavily tested.

Example tests:

* role permission tests
* office authority tests
* delegation scope tests
* expiration tests
* conflict resolution tests

---

# 20. Authority failure handling

If authority validation fails:

* transition denied
* error returned
* audit entry recorded

Example:

```text id="pw86ib"
error: insufficient_authority
```

---

# 21. Summary

The authority model ensures that institutional power is:

* explicit
* structured
* auditable
* enforceable

Authority may derive from:

* membership
* roles
* offices
* delegations
* procedural contexts

The platform evaluates authority before executing governance actions.

By modeling authority carefully, the system prevents governance ambiguity and preserves institutional legitimacy.

---

## Status

**Status:** Draft.
**Next document:**

`docs/application/use-cases.md`

3… 2… 1… next: **Document 11 — Use Cases**, where we define **the concrete actions users perform in the system (SubmitProposal, CastVote, CertifyResult, etc.)** and how those actions interact with the domain model.
