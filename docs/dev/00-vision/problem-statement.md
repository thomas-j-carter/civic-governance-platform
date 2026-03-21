# Problem Statement

The Ardtire Society requires a digital platform capable of supporting serious civic governance in a way that is structured, auditable, evolvable, and institutionally legible. Existing generic software categories do not adequately solve this problem.

The core problem is not merely the absence of a website or a member portal. The deeper problem is the absence of a coherent digital system that can faithfully model and administer the Society’s governance-related processes across identity, membership, proposals, ballots, certifications, records, publications, and transparency.

## The problem in plain terms

The Ardtire Society needs a platform that can do all of the following at once:

- identify actors and their relevant standing
- manage membership workflows with legitimacy and traceability
- model institutional roles and authority correctly
- support proposal drafting, review, amendment, and versioning
- support formal transitions in governance workflows
- administer ballots and certifications responsibly
- preserve records in a durable and inspectable manner
- publish institutional outputs clearly and consistently
- maintain auditable history over time
- remain evolvable as the Society’s processes mature

Most off-the-shelf systems solve only fragments of this.

A CMS can publish content but does not natively model governance workflows.
A forum can facilitate discussion but does not create institutional records.
A generic membership system can track users but not civic legitimacy.
A project management tool can track tasks but not formal proposals and certifications.
A low-code admin tool can store data but usually lacks durable institutional semantics.

The problem, therefore, is not that no digital tools exist. The problem is that the required combination of semantics, process rigor, institutional memory, and public legitimacy is not well served by generic tools.

## Nature of the platform problem

This problem is simultaneously:

- product-level
- domain-level
- architectural
- procedural
- operational
- institutional

That makes it easy to underestimate.

If the platform is designed too narrowly as a web app, it will fail to capture the governance model.
If it is designed too abstractly as a rules engine, it will fail to serve real users.
If it is designed too casually, it will become operationally untrustworthy.
If it is designed without documentation discipline, it will become semantically incoherent over time.

## Current gap

Without a dedicated platform, the Society risks operating key workflows across fragmented tools, ad hoc conventions, private memory, and inconsistent records.

That creates several failure modes:

- unclear process legitimacy
- inconsistent authority handling
- poor traceability
- duplicate or conflicting records
- opaque institutional state
- difficulty onboarding future contributors
- inability to scale beyond founder-memory
- weak public and internal confidence in process integrity

These are not merely software inconveniences. They are governance-quality problems.

## Why generic tooling is insufficient

Generic tooling tends to fail in one or more of the following ways:

### It lacks domain meaning
Many tools can store proposals, votes, or records as arbitrary rows, but they do not understand the difference between a draft, a current version, a certified result, a published record, or an office-bound authority.

### It lacks lifecycle discipline
Governance artifacts move through states. Those states must be explicit, rule-bound, and inspectable. Generic systems often treat status as a loose label rather than a governed lifecycle.

### It lacks authority nuance
Not every permission is merely a UI toggle. Some actions require specific institutional standing, role scope, process stage, or separation of duties.

### It lacks durable auditability
Institutional trust requires reconstructable history. The platform must support not just “what is current,” but “how it became current.”

### It lacks coherent integration across concerns
Membership, governance, records, and publication are related. They should not be modeled as isolated software islands if the institution treats them as a connected process landscape.

## Desired future state

The Ardtire Civic Governance Platform should provide a coherent digital operating environment in which institutional workflows can be performed in a way that is:

- clear to participants
- consistent in semantics
- enforceable in software
- inspectable after the fact
- evolvable without collapse
- sufficiently modular for future growth
- sufficiently formal for serious governance use

## Problem summary

The problem is the lack of a purpose-built digital governance platform that can faithfully represent and operate the institutional logic of the Ardtire Society.

The solution must not be a loose collection of web features.
It must be a platform that treats governance, membership, records, publication, and auditability as first-class concerns.

## Framing statement

This repository exists because Ardtire needs more than software that stores data and serves pages. It needs software that can carry institutional meaning.
