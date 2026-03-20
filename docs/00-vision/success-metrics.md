# Success Metrics

This document defines how success should be evaluated for the Ardtire Civic Governance Platform.

Success for this platform cannot be measured by generic software vanity metrics alone. It must be measured by the degree to which the platform successfully carries out its institutional purpose with clarity, trustworthiness, and sustainability.

## Success categories

Platform success should be evaluated across six categories:

1. governance correctness
2. user and steward clarity
3. operational trustworthiness
4. documentation and continuity quality
5. engineering maintainability
6. adoption and practical usefulness

## 1. Governance correctness

The first and most important success category is whether the platform correctly supports the intended governance workflows.

Indicators include:
- proposals move through explicit and correct lifecycle stages
- versioning rules are enforced consistently
- ballots and certifications operate with correct constraints
- authority-sensitive actions are appropriately restricted
- records and publications reflect correct institutional state
- invariant violations are rare and treated as serious defects

A platform that is fast or attractive but semantically wrong is not successful.

## 2. User and steward clarity

The second success category is whether participants can understand what is happening in the platform.

Indicators include:
- users can tell what stage a proposal or record is in
- members and applicants understand their workflow state
- governance actors understand what actions are currently valid
- public readers can distinguish official from draft or internal material
- terminology remains consistent across the platform surface
- administrative actions are understandable rather than magical

Clarity is not a cosmetic concern here. It is part of legitimacy.

## 3. Operational trustworthiness

The third success category is whether the platform can be run safely and reliably.

Indicators include:
- releases are manageable
- rollback paths exist and are credible
- backups and recovery are documented and testable
- audit records are available where expected
- incidents can be triaged and understood
- environments are coherent
- secrets and credentials are handled with discipline

A platform that works only while the original builder is watching it is not operationally successful.

## 4. Documentation and continuity quality

The fourth success category is whether the platform remains understandable over time.

Indicators include:
- core source-of-truth docs exist and stay aligned
- major design decisions are captured in ADRs
- feature behavior is grounded in specs
- AI-context artifacts remain aligned with canonical docs
- a new contributor can regain context from the repo
- important repository truth is not trapped in private memory

Continuity quality is especially important for this project.

## 5. Engineering maintainability

The fifth success category is whether the implementation can evolve without collapse.

Indicators include:
- domain boundaries remain coherent
- code structure matches architectural intent
- API contracts remain understandable
- changes can be made without excessive fear
- drift between docs and code is detected and corrected
- the system can grow in scope without large-scale rewrite pressure

Maintainability is not just code cleanliness. It is the ability to preserve coherence as the institution evolves.

## 6. Adoption and practical usefulness

The sixth success category is whether the platform is actually useful in practice to the Society and its participants.

Indicators include:
- real workflows can be completed in the platform
- stakeholders prefer the platform to fragmented ad hoc workarounds
- the platform reduces ambiguity in institutional process
- the platform becomes the trusted place to check process and record state
- contributors can build upon it instead of bypassing it

## Metric posture

Not all success metrics are equally quantitative.

Some can be measured numerically:
- number of workflows fully supported
- documentation coverage ratios
- broken-link and validation failures
- incident counts
- deployment success rates
- audit event coverage
- route or API contract coverage

Some are partly qualitative:
- clarity of state presentation
- coherence of terminology
- contributor ability to reenter the project
- confidence in legitimacy and records integrity

This platform should use both quantitative and qualitative measures.

## Suggested early success indicators

Early-stage success should be judged by whether the platform establishes a coherent and trustworthy core, not by sheer feature count.

Strong early indicators include:
- core governance flow modeled end to end
- canonical domain docs completed for the first major slice
- clear route map and architecture summary
- explicit proposal/version/ballot/certification behavior
- working source-of-truth discipline
- credible AI continuation and onboarding capability

## Failure indicators

The following are warning signs that the platform is not succeeding even if work appears to be progressing:

- important rules exist only in code or chat history
- users cannot tell what the official state of an artifact is
- authority decisions feel ad hoc
- records and publications drift from governance process
- future contributors cannot reconstruct intent
- the system becomes harder to change with every feature
- documentation surface grows but clarity does not

## Summary

Success for this platform means more than shipping software.

It means the platform becomes a trustworthy digital medium for Ardtire’s civic process, one that is understandable, operable, and durable.
