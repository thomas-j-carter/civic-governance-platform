# Stakeholders and Users

This document defines the major stakeholders and user classes relevant to the Ardtire Civic Governance Platform.

The purpose is to distinguish clearly among:

- who the platform serves
- who influences its design
- who operates it
- who depends on its correctness
- who may interact with it directly or indirectly

This is not yet the full domain actor model. That belongs in `docs/02-domain/actor-model.md`. This document stays at the vision layer and focuses on strategic stakeholder framing.

## Stakeholder categories

The platform has several major stakeholder categories:

1. Society leadership and institutional stewards
2. Members and prospective members
3. Governance participants and office holders
4. Records and publication stewards
5. Platform maintainers and operators
6. Public-facing observers and readers
7. Future contributors and successors

## 1. Society leadership and institutional stewards

These are the people ultimately responsible for ensuring that the platform reflects the Society’s real governance intent and institutional needs.

They care most about:
- legitimacy of process
- clarity of authority
- historical traceability
- durability of records
- trustworthy public and internal outputs
- continuity beyond any single builder or maintainer

They are not merely “admins” in a software sense. They are strategic stewards of institutional meaning.

## 2. Members and prospective members

These are people who interact with the platform as applicants, members, or participants in Society processes.

They care most about:
- understandable workflows
- fair and visible process states
- clarity about eligibility and standing
- access to relevant records and publications
- confidence that actions and outcomes have real standing

For them, the platform should feel coherent and serious rather than improvised or opaque.

## 3. Governance participants and office holders

These are actors who participate in proposal, review, voting, certification, or publication processes in a more formal capacity.

They care most about:
- clearly defined responsibilities
- correct authority handling
- formal workflow support
- traceable outcomes
- reduced ambiguity around what actions are valid and when

Their work depends on the platform accurately representing institutional process.

## 4. Records and publication stewards

These actors are concerned with the creation, maintenance, release, and integrity of records and published material.

They care most about:
- accurate versioning
- publication control
- archival discipline
- retention rules
- clarity between draft, official, certified, and published artifacts

For them, the platform must preserve documentary integrity, not merely content convenience.

## 5. Platform maintainers and operators

These include engineers, operators, and future technical contributors who will build, extend, maintain, deploy, and observe the platform.

They care most about:
- coherent architecture
- clear contracts and boundaries
- maintainable code
- explicit documentation
- safe operational procedures
- low ambiguity during debugging and change management

For them, the platform must be intelligible as a system, not just functional as a UI.

## 6. Public-facing observers and readers

Some platform outputs are intended to be visible beyond core internal participants. These users may consume published records, gazette outputs, public notices, or other official material.

They care most about:
- clarity
- legitimacy
- navigability
- trustworthiness of published state
- confidence that published outputs are authoritative

Even when they are not direct power users of the platform, their trust matters.

## 7. Future contributors and successors

A critical stakeholder class is the set of people who will inherit this system later.

They care most about:
- understanding what exists
- understanding why it was designed this way
- being able to extend it without breaking institutional semantics
- not depending on informal oral history or scattered chat transcripts

This stakeholder class is easy to neglect and strategically important.

## User classes

At a high level, the platform should anticipate at least the following user classes:

- anonymous public visitor
- authenticated user
- applicant
- member
- moderator or reviewer
- records or publication editor
- governance operator
- office holder
- administrator
- platform maintainer

The precise domain definitions of these classes belong downstream in product and domain docs, but vision-level planning should already assume that users are not homogeneous.

## Strategic implications

Recognizing these stakeholder classes has several design implications:

### The platform must support more than one mode of use
It is not just a public site, not just an admin panel, and not just an internal workflow engine. It is a connected platform with multiple surfaces and audiences.

### The platform must preserve distinctions
A member is not the same as an office holder.
A reviewer is not the same as a platform maintainer.
A public reader is not the same as an authenticated participant.

### The platform must support legitimacy, not only usability
Usability matters, but in this context legitimacy-bearing process also matters. The system must help users understand why a state or action has standing.

### The platform must be survivable
Future maintainers and successors are first-class stakeholders. This requires unusually strong documentation and architecture clarity.

## Stakeholder priority

When tradeoffs arise, the platform should generally prioritize:

1. institutional correctness for stewards and governance actors
2. clarity and fairness for members and applicants
3. maintainability and observability for platform maintainers
4. comprehensibility and trust for public-facing observers

This does not mean some users do not matter. It means the platform is being optimized first for serious civic process rather than generic engagement patterns.

## Summary

The Ardtire Civic Governance Platform serves not one user type but an institutional ecosystem.

Its design must therefore account for:
- different responsibilities
- different visibility needs
- different authority levels
- different expectations of trust
- different relationships to process legitimacy

Designing as though all users are simply “users” would erase distinctions the platform is specifically meant to preserve.
