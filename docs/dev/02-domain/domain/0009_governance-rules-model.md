# Document 9 — `docs/domain/governance-rules-model.md`

## Purpose of this document

This document defines **how governance rules are represented, versioned, and evaluated** in the Ardtire Society Digital Governance Platform.

Earlier documents established:

* the institutional model
* domain entities
* lifecycle state machines
* actors and authority structures

However, governance systems cannot rely only on workflows. They must also apply **rules that determine whether actions are valid**.

Examples include:

* quorum requirements
* voting thresholds
* membership eligibility
* proposal admissibility
* certification criteria
* publication authorization

These rules must be:

* explicit
* versioned
* auditable
* historically traceable

Without rule modeling, the platform cannot answer critical questions such as:

* Under which rules was this vote validated?
* Which quorum requirement applied at that time?
* Which version of the procedural rules governed the certification?

This document defines the **governance rules architecture** used to answer those questions.

---

# 1. Why rule modeling is necessary

Governance rules change over time.

Examples:

* quorum thresholds may change
* voting rules may change
* eligibility rules may change
* procedural steps may evolve

If rules are not versioned and referenced explicitly:

* historical outcomes become ambiguous
* past decisions cannot be validated
* institutional legitimacy may be questioned

Therefore, the platform must treat **rules as first-class domain objects**.

---

# 2. Types of governance rules

The platform must support several categories of rules.

## Procedural rules

Rules governing workflows.

Examples:

* proposal submission requirements
* amendment windows
* committee assignment procedures

---

## Eligibility rules

Rules determining who may participate.

Examples:

* voter eligibility
* candidate eligibility
* proposal sponsorship requirements

---

## Quorum rules

Rules defining minimum participation.

Examples:

* minimum number of voters
* percentage participation thresholds

---

## Voting threshold rules

Rules determining when a vote passes.

Examples:

* simple majority
* supermajority
* unanimity

---

## Certification rules

Rules determining whether results can be certified.

Examples:

* quorum satisfied
* ballot integrity verified
* voting window respected

---

## Publication rules

Rules determining when official information may be published.

Examples:

* certification required before publication
* review by publication authority

---

# 3. Governance rule hierarchy

Rules exist within a structured hierarchy.

```text
Institutional Constitution
        │
Procedural Regulations
        │
Operational Rules
        │
Workflow Guards
```

Each level may influence the levels below it.

---

## Constitution

Defines the highest-level institutional principles.

Examples:

* voting thresholds
* structural authority
* ratification requirements

These rules change rarely.

---

## Procedural regulations

Define operational procedures for governance actions.

Examples:

* proposal stages
* committee procedures
* voting mechanics

These may evolve occasionally.

---

## Operational rules

Define system-level implementation details.

Examples:

* timing windows
* notification deadlines
* administrative steps

---

## Workflow guards

These are rule checks used inside state machine transitions.

Example:

```text
Guard: quorumSatisfied(ballot)
```

---

# 4. Rule versioning

Every rule must have a **version identifier**.

Attributes:

* rule_id
* rule_version
* effective_date
* superseded_by
* rule_source

Example:

```text
rule_id: quorum_rule
version: 3
effective_date: 2027-01-01
```

This allows the system to evaluate rules historically.

---

# 5. Rule entity model

## GovernanceRule

Represents a rule definition.

Attributes:

* rule_id
* rule_type
* rule_description
* rule_source_reference

---

## RuleVersion

Represents a specific version of a rule.

Attributes:

* version_id
* rule_id
* effective_date
* parameters
* superseded_by

---

## RuleReference

Represents a link between a rule and a domain action.

Example:

* ballot references quorum rule version

---

# 6. Rule parameterization

Rules often require parameters.

Examples:

```text
quorum_percentage = 40%
supermajority_threshold = 66%
```

Parameters must be stored alongside the rule version.

---

# 7. Rule evaluation model

Rule evaluation follows a consistent process.

Steps:

1. Identify relevant rule
2. Select rule version based on effective date
3. Apply rule parameters
4. Evaluate against domain state
5. Produce result

---

## Example evaluation

Example quorum rule evaluation:

```text
eligible_voters = 120
votes_cast = 65

required = eligible_voters * quorum_percentage
required = 120 * 0.40 = 48

result = votes_cast >= required
```

---

# 8. Rule reference in domain outcomes

Every significant outcome must reference the rules used.

Example certification record:

```text
certification_record
  ballot_id: 123
  quorum_rule_version: 3
  threshold_rule_version: 2
  certification_date: 2028-03-04
```

This preserves historical traceability.

---

# 9. Rule storage strategy

Rules should be stored in a dedicated domain table.

Example structure:

```text
governance_rules
rule_versions
rule_parameters
```

Each rule version stores its parameters.

---

# 10. Rule scope

Rules may apply at different scopes.

Examples:

### Global rules

Apply to entire institution.

Example:

* quorum rule for all ballots

---

### Body-specific rules

Apply to specific governance bodies.

Example:

* council voting thresholds

---

### Proposal-specific rules

Apply to specific proposal types.

Example:

* constitutional amendment requirements

---

# 11. Rule selection

When evaluating a rule, the system determines:

1. rule scope
2. applicable body or context
3. effective date
4. rule version

Example selection algorithm:

```text
selectRule(rule_id, context, date):
  versions = ruleVersions(rule_id)

  applicable = versions where effective_date <= date

  return latest(applicable)
```

---

# 12. Rule enforcement locations

Rules should be enforced in several places.

### State machine guards

Example:

```text
guard quorumSatisfied(ballot)
```

---

### Domain services

Example:

* vote tally service
* certification validator

---

### API validation

Prevent invalid requests.

---

# 13. Rule change governance

Changing governance rules must itself follow a procedure.

Typical process:

```text
Propose rule change
Review
Adopt rule change
Create new rule version
Activate rule
```

Old versions must remain stored for historical reference.

---

# 14. Rule auditability

Rule evaluation must be auditable.

Audit records should include:

* rule version used
* parameters applied
* evaluation result
* timestamp

---

# 15. Rule conflict handling

Sometimes rules may conflict.

Example:

* two body-specific rules overlap

Resolution strategy:

1. specific scope overrides general scope
2. newer rule version overrides older
3. explicit rule precedence list

---

# 16. Rule caching

Rule evaluation may be performance-sensitive.

Strategies:

* cache rule versions in memory
* refresh on rule updates
* ensure evaluation still references version IDs

---

# 17. Rule evolution strategy

Rules should evolve without breaking historical data.

Approach:

* never overwrite rule versions
* only create new versions
* maintain historical linkage

---

# 18. Relationship to state machines

Rules work alongside state machines.

Example:

State machine allows transition:

```text
VotingClosed → ResultPendingCertification
```

Rule guard checks:

```text
quorumSatisfied(ballot)
thresholdSatisfied(ballot)
```

Only if rules pass can the transition occur.

---

# 19. Relationship to authority model

Rules interact with authority checks.

Example:

```text
if actor.hasAuthority(certify_result):
    evaluate certification rules
```

Both conditions must pass.

---

# 20. Implementation considerations

Rule evaluation may be implemented as:

* domain services
* rule engine
* policy evaluation layer

For early phases, domain services are typically sufficient.

---

# 21. Benefits of rule modeling

Explicit rule modeling provides:

* historical traceability
* procedural legitimacy
* transparency
* adaptability
* testability

It allows the platform to explain:

> “Why did this outcome occur?”

---

# 22. Summary

Governance rules are first-class elements of the Ardtire platform.

The system must support:

* rule definition
* rule versioning
* rule evaluation
* rule referencing in outcomes
* historical rule traceability

Key rule categories include:

* eligibility rules
* quorum rules
* voting thresholds
* procedural rules
* certification rules
* publication rules

By modeling rules explicitly, the platform preserves institutional clarity and legitimacy.

---

## Status

**Status:** Draft.
**Next document:**

`docs/domain/authority-model.md`

3… 2… 1… next: **Document 10 — Authority Model**, where we define **how institutional authority is represented and enforced in the system.**

This will be one of the most critical documents for preventing governance ambiguity.
