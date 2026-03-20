# Scope and Non-Goals

This document defines what the Ardtire Civic Governance Platform is intended to include and what it is intentionally not intended to include, especially in its initial and near-term forms.

The purpose of this document is to keep the platform strategically focused and to prevent accidental expansion into adjacent but currently unsupported problem spaces.

## Scope statement

The platform is in scope to the extent that it supports the Society’s civic governance operating needs across:

- identity-aware participation
- membership workflows
- governance workflows
- proposal lifecycle management
- proposal versioning and transitions
- ballots and certifications
- records management
- publication workflows
- institutional transparency surfaces
- auditable administrative and operational handling
- documentation-driven software governance

## In-scope functional areas

## 1. Identity and access foundations
The platform should support the identity and access patterns necessary to determine who is acting, in what capacity, and with what effective authority.

This includes:
- authentication integration
- role and membership-aware access resolution
- separation between public and privileged actions
- support for governance-sensitive permission boundaries

## 2. Membership workflows
The platform should support the Society’s membership-related lifecycle and administrative needs.

This includes:
- applications
- review workflows
- approval and denial handling
- status changes
- profile and standing-aware behavior
- visibility of relevant membership state where appropriate

## 3. Governance workflows
The platform should support structured governance processes rather than ad hoc discussion alone.

This includes:
- proposals
- versioning
- stage transitions
- committee or review handling where applicable
- ballots
- certification outcomes
- lifecycle visibility

## 4. Records and publication
The platform should support the creation, maintenance, and release of institutional artifacts.

This includes:
- durable records
- version-aware artifacts
- publication state distinctions
- official release handling
- traceable historical outputs

## 5. Public and internal surfaces
The platform should support both internal workflow surfaces and public-facing read surfaces where appropriate.

This includes:
- public publication surfaces
- member/admin workflow surfaces
- route and content structure aligned with institutional needs

## 6. Operational and engineering discipline
The platform includes not only user-facing functionality but also the documentation, runbooks, observability, and engineering systems needed to maintain it responsibly.

This includes:
- source-of-truth docs
- ADRs
- specs
- runbooks
- operations docs
- AI-context docs
- change manifests and traceability tooling

## Initial implementation scope

The initial practical platform scope should emphasize the core governance operating loop:

- user identity foundation
- membership foundation
- proposal creation and versioning
- proposal stage transitions
- ballots and certification
- records and publication basics
- audit-friendly architecture and documentation
- admin and public route foundations

The early platform should prioritize a coherent end-to-end vertical slice over breadth.

## Near-term scope

After the core workflow is coherent, near-term scope may expand into:

- richer records workflows
- more advanced publication controls
- stronger transparency surfaces
- improved search and discovery
- better reporting and administrative tooling
- stronger operational automation
- more polished contributor and AI workflows

## Non-goals

The following are currently non-goals unless later explicitly brought into scope.

## 1. Generic social networking platform behavior
The platform is not being built as a generic social network, engagement platform, or community feed product.

That means it is not primarily optimizing for:
- virality
- content feeds
- algorithmic engagement
- generic reaction mechanics
- broad consumer social patterns

## 2. Broad general-purpose CMS replacement
While the platform may integrate with a CMS or include content capabilities, it is not intended to become a universal replacement for every content-management need unrelated to governance and institutional publication.

## 3. Full general e-government stack
The platform is civic in character, but it is not currently attempting to become an all-purpose state-grade government ERP or full digital state stack.

It is focused on the Ardtire Society’s actual governance and institutional needs.

## 4. Unbounded workflow engine
The platform may encode many workflows, but it is not currently trying to become a generic workflow builder for arbitrary unknown business processes.

The system should be explicit and opinionated about its institutional domain.

## 5. Total automation of governance meaning
The platform is meant to support governance, not dissolve all judgment into automation.

Not every serious institutional decision should be reduced to a button click or a hidden rules engine.

## 6. Excessive feature breadth in the first phase
The platform should not try to ship every conceivable module before the core membership-governance-records-publication loop is coherent.

## Deferred areas

Some areas may be strategically relevant later but are deferred for now unless explicitly prioritized in downstream docs.

Possible deferred areas may include:
- more advanced analytics
- extensive notification sophistication
- advanced external federation
- broader land, judicial, or other adjacent institutional modules
- highly specialized archival tooling beyond initial needs
- advanced search ranking and discovery mechanics
- complex public consultation workflows beyond the first governance surface

Deferred does not mean unimportant. It means not part of current core scope.

## Scope control rule

A proposed feature should be considered in scope only if it clearly improves one or more of the following:

- governance clarity
- membership administration
- proposal or ballot lifecycle integrity
- records or publication integrity
- transparency and auditability
- platform maintainability in support of the above

If it does not do one of those things, it should face a higher bar before being accepted into scope.

## Summary

The Ardtire Civic Governance Platform is intentionally scoped as a serious civic governance operating platform, not a generic catch-all software product.

Its scope is broad enough to support institutional life, but narrow enough to preserve coherence.
