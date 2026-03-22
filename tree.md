.
├── apps
│   ├── blog
│   │   ├── 2026-03-20-why-this-project-exists.md
│   │   ├── 2026-03-21-designing-the-domain.md
│   │   ├── 2026-03-22-building-the-docs-engine.md
│   │   └── README.md
│   ├── cms
│   │   ├── package.json
│   │   ├── src
│   │   │   ├── access
│   │   │   │   ├── editorOrAdmin.ts
│   │   │   │   ├── isAdmin.ts
│   │   │   │   ├── isAuthenticated.ts
│   │   │   │   └── isEditor.ts
│   │   │   ├── app
│   │   │   │   └── api
│   │   │   │       └── auth
│   │   │   │           ├── callback
│   │   │   │           │   └── route.ts
│   │   │   │           ├── login
│   │   │   │           │   └── route.ts
│   │   │   │           └── logout
│   │   │   │               └── route.ts
│   │   │   ├── collections
│   │   │   │   ├── Pages.ts
│   │   │   │   └── Users.ts
│   │   │   ├── lib
│   │   │   │   ├── auth
│   │   │   │   │   └── session.ts
│   │   │   │   ├── keycloak.ts
│   │   │   │   ├── request-auth.ts
│   │   │   │   └── role-mapping.ts
│   │   │   ├── middleware.ts
│   │   │   └── tests
│   │   │       ├── access.test.ts
│   │   │       └── role-mapping.test.ts
│   │   ├── tsconfig.json
│   │   └── vitest.config.ts
│   ├── gov-api
│   │   ├── openapi.yaml
│   │   ├── package.json
│   │   ├── README.md
│   │   └── src
│   │       ├── application
│   │       │   ├── gazette
│   │       │   │   ├── create-gazette-issue-handler.test.ts
│   │       │   │   ├── create-gazette-issue-handler.ts
│   │       │   │   ├── create-gazette-issue.ts
│   │       │   │   ├── gazette-mappers.ts
│   │       │   │   ├── get-gazette-issue-handler.ts
│   │       │   │   ├── get-gazette-issue.ts
│   │       │   │   ├── list-gazette-issues-handler.ts
│   │       │   │   ├── list-gazette-issues.ts
│   │       │   │   ├── publish-gazette-issue-handler.test.ts
│   │       │   │   ├── publish-gazette-issue-handler.ts
│   │       │   │   └── publish-gazette-issue.ts
│   │       │   ├── identity
│   │       │   │   ├── get-authority-context.ts
│   │       │   │   └── get-current-identity.ts
│   │       │   ├── proposals
│   │       │   │   ├── assign-committee.ts
│   │       │   │   ├── create-proposal-draft.ts
│   │       │   │   ├── create-proposal-version.ts
│   │       │   │   ├── get-proposal-detail.ts
│   │       │   │   ├── list-proposals.ts
│   │       │   │   ├── list-proposal-versions.ts
│   │       │   │   ├── set-current-proposal-version.ts
│   │       │   │   └── submit-proposal.ts
│   │       │   └── shared
│   │       │       └── pagination.ts
│   │       ├── app.ts
│   │       ├── context
│   │       │   ├── app-context.ts
│   │       │   └── request-context.ts
│   │       ├── domain
│   │       ├── governance-bodies
│   │       │   └── service.ts
│   │       ├── http
│   │       │   ├── errors.ts
│   │       │   ├── json.ts
│   │       │   ├── problem-details.ts
│   │       │   ├── request-id.ts
│   │       │   └── routes
│   │       │       ├── agendas.ts
│   │       │       ├── amendments.ts
│   │       │       ├── governance-bodies.ts
│   │       │       ├── offices.ts
│   │       │       ├── proposals.ts
│   │       │       └── sessions.ts
│   │       ├── index.ts
│   │       ├── infrastructure
│   │       ├── lib
│   │       │   └── errors.ts
│   │       ├── main.ts
│   │       ├── middleware
│   │       │   ├── app-context.ts
│   │       │   ├── auth.ts
│   │       │   ├── error-handler.ts
│   │       │   ├── request-context.ts
│   │       │   ├── require-authority.ts
│   │       │   └── require-auth.ts
│   │       ├── offices
│   │       │   └── service.ts
│   │       ├── proposals
│   │       │   ├── amendments-service.ts
│   │       │   └── service.ts
│   │       ├── routes
│   │       │   ├── gazette.test.ts
│   │       │   ├── gazette.ts
│   │       │   ├── identity.ts
│   │       │   ├── index.ts
│   │       │   └── proposals.ts
│   │       ├── server
│   │       │   └── build-app-context.ts
│   │       ├── server.ts
│   │       ├── sessions
│   │       │   ├── agendas-service.ts
│   │       │   └── service.ts
│   │       └── types
│   │           └── hono.ts
│   └── web
│       └── src
│           ├── features
│           │   ├── governance-bodies
│           │   │   └── server.ts
│           │   └── proposals
│           │       └── server.ts
│           └── routes
│               ├── admin
│               │   ├── agendas.tsx
│               │   ├── governance-bodies.tsx
│               │   ├── offices.tsx
│               │   ├── proposals.$proposalId.tsx
│               │   ├── proposals.new.tsx
│               │   ├── proposals.tsx
│               │   └── sessions.tsx
│               ├── governance
│               │   ├── bodies.tsx
│               │   ├── index.tsx
│               │   ├── offices.tsx
│               │   ├── proposals.$proposalId.tsx
│               │   ├── proposals.tsx
│               │   └── sessions.tsx
│               └── member
│                   ├── proposals.$proposalId.tsx
│                   └── proposals.tsx
├── CONTRIBUTING.md
├── db
│   └── migrations
│       ├── 202603210201_init.sql.old
│       └── 202603210205_init.sql
├── docs
│   ├── ai
│   │   ├── ARCHITECTURE_SUMMARY.md
│   │   ├── BOOTSTRAP_PROMPT.md
│   │   ├── context
│   │   │   ├── AI_RULES.md
│   │   │   ├── ARCHITECTURE_SUMMARY.md
│   │   │   ├── COMPILED_CONTEXT.md
│   │   │   ├── DOMAIN_MODEL.md
│   │   │   ├── IMPLEMENTATION_STATE.md
│   │   │   ├── MASTER_CONTEXT_BOOTSTRAP_PROMPT.md
│   │   │   ├── NEXT_STEPS.md
│   │   │   ├── openapi.yaml
│   │   │   ├── PROJECT_CONTEXT.md
│   │   │   └── schema.prisma
│   │   ├── HANDOFF_CHECKLIST.md
│   │   ├── NEXT_ACTIONS.md
│   │   ├── PROJECT_CONTEXT.md
│   │   ├── prompts
│   │   │   ├── MASTER_AUTONOMOUS_IMPLEMENTATION_PROMPT.md
│   │   │   └── MASTER_CONTINUATION_PROMPT.md
│   │   ├── README.md
│   │   ├── REPO_BLUEPRINT.md
│   │   ├── system
│   │   │   ├── REPO_CONSTRAINTS.md
│   │   │   ├── SYSTEM_CONTRACT.md
│   │   │   └── VALIDATION_RULES.md
│   │   └── transcript
│   │       └── FULL_TRANSCRIPT.md
│   ├── dev
│   │   ├── 00-vision
│   │   │   ├── 0000-initial-response.md
│   │   │   ├── 0001-blueprint.md
│   │   │   ├── 0001_product-mission.md
│   │   │   ├── 0002_institutional-model.md
│   │   │   ├── 0003_personas-and-actors.md
│   │   │   ├── 0004_problem-statements-and-goals.md
│   │   │   ├── constraints.md
│   │   │   ├── design-principles.md
│   │   │   ├── mission-and-goals.md
│   │   │   ├── problem-statement.md
│   │   │   ├── README.md
│   │   │   ├── risks-and-assumptions.md
│   │   │   ├── scope-and-non-goals.md
│   │   │   ├── stakeholders-and-users.md
│   │   │   └── success-metrics.md
│   │   ├── 01-product
│   │   │   ├── content-ownership.md
│   │   │   ├── feature-map.md
│   │   │   ├── glossary-product.md
│   │   │   ├── information-architecture.md
│   │   │   ├── mvp-scope.md
│   │   │   ├── permissions-from-user-perspective.md
│   │   │   ├── personas.md
│   │   │   ├── README.md
│   │   │   ├── roadmap-themes.md
│   │   │   ├── route-map.md
│   │   │   ├── user-journeys.md
│   │   │   └── ux-principles.md
│   │   ├── 02-domain
│   │   │   ├── actor-model.md
│   │   │   ├── authority-model.md
│   │   │   ├── bounded-context-language.md
│   │   │   ├── decision-tables.md
│   │   │   ├── domain
│   │   │   │   ├── 0005_bounded-contexts.md
│   │   │   │   ├── 0006_ubiquitous-language.md
│   │   │   │   ├── 0007_domain-model.md
│   │   │   │   ├── 0008_state-machines.md
│   │   │   │   ├── 0009_governance-rules-model.md
│   │   │   │   ├── 0010_authority-model.md
│   │   │   │   ├── AUTHORITY_MODEL.md
│   │   │   │   ├── DOMAIN_MODEL.md
│   │   │   │   ├── PUBLICATION_MODEL.md
│   │   │   │   ├── RECORDS_MODEL.md
│   │   │   │   └── STATE_MACHINES.md
│   │   │   ├── domain-events.md
│   │   │   ├── glossary.md
│   │   │   ├── governance-model.md
│   │   │   ├── identifiers-and-canonicality.md
│   │   │   ├── invariants.md
│   │   │   ├── membership-model.md
│   │   │   ├── publication-model.md
│   │   │   ├── README.md
│   │   │   ├── records-model.md
│   │   │   ├── rule-versioning.md
│   │   │   ├── scenarios-and-examples.md
│   │   │   ├── state-machines.md
│   │   │   └── temporal-rules.md
│   │   ├── 03-architecture
│   │   │   ├── 0030_future-evolution.md
│   │   │   ├── api-conventions.md
│   │   │   ├── API_SPEC.yaml
│   │   │   ├── async-and-jobs.md
│   │   │   ├── audit-and-observability.md
│   │   │   ├── bounded-contexts.md
│   │   │   ├── caching-strategy.md
│   │   │   ├── cms-boundary.md
│   │   │   ├── CMS_IDENTITY_ALIGNMENT.md
│   │   │   ├── component-model.md
│   │   │   ├── database-strategy.md
│   │   │   ├── deployment-topology.md
│   │   │   ├── eventing-and-integrations.md
│   │   │   ├── external-system-boundary.md
│   │   │   ├── frontend-backend-boundary.md
│   │   │   ├── identity-and-access.md
│   │   │   ├── interaction-diagram.md
│   │   │   ├── performance-and-reliability.md
│   │   │   ├── README.md
│   │   │   ├── request-lifecycle.md
│   │   │   ├── search-strategy.md
│   │   │   ├── security-architecture.md
│   │   │   ├── storage-and-files.md
│   │   │   ├── system-context.md
│   │   │   └── trust-boundaries.md
│   │   ├── 04-decisions
│   │   │   ├── ADR-000-template.md
│   │   │   ├── ADR-INDEX.md
│   │   │   └── README.md
│   │   ├── 05-specs
│   │   │   ├── auth
│   │   │   │   ├── identity-bootstrap.md
│   │   │   │   ├── login-session-lifecycle.md
│   │   │   │   └── role-resolution.md
│   │   │   ├── cross-cutting
│   │   │   │   ├── authorization-enforcement.md
│   │   │   │   ├── idempotency.md
│   │   │   │   ├── pagination-filtering-sorting.md
│   │   │   │   └── problem-details-errors.md
│   │   │   ├── governance
│   │   │   │   ├── ballot-closing.md
│   │   │   │   ├── ballot-opening.md
│   │   │   │   ├── certification.md
│   │   │   │   ├── committee-assignment.md
│   │   │   │   ├── office-holder-management.md
│   │   │   │   ├── proposal-creation.md
│   │   │   │   ├── proposal-stage-transitions.md
│   │   │   │   ├── proposal-versioning.md
│   │   │   │   └── publication-release.md
│   │   │   ├── membership
│   │   │   │   ├── application-submission.md
│   │   │   │   ├── membership-approval.md
│   │   │   │   ├── membership-review.md
│   │   │   │   ├── membership-suspension.md
│   │   │   │   └── profile-management.md
│   │   │   ├── platform
│   │   │   │   ├── audit-log-access.md
│   │   │   │   ├── file-upload-policy.md
│   │   │   │   ├── notifications.md
│   │   │   │   └── search-indexing.md
│   │   │   ├── publication
│   │   │   │   ├── article-lifecycle.md
│   │   │   │   ├── content-scheduling.md
│   │   │   │   └── gazette-publication.md
│   │   │   ├── README.md
│   │   │   ├── records
│   │   │   │   ├── record-creation.md
│   │   │   │   ├── record-publication.md
│   │   │   │   ├── record-versioning.md
│   │   │   │   └── retention-and-archival.md
│   │   │   └── SPEC-TEMPLATE.md
│   │   ├── 06-api
│   │   │   ├── authentication.md
│   │   │   ├── client-generation.md
│   │   │   ├── conventions.md
│   │   │   ├── errors.md
│   │   │   ├── examples
│   │   │   │   ├── auth.md
│   │   │   │   ├── ballots.md
│   │   │   │   ├── proposals.md
│   │   │   │   ├── publications.md
│   │   │   │   └── records.md
│   │   │   ├── idempotency-and-concurrency.md
│   │   │   ├── openapi.yaml
│   │   │   ├── overview.md
│   │   │   ├── pagination-filtering-sorting.md
│   │   │   ├── README.md
│   │   │   ├── resources.md
│   │   │   ├── versioning.md
│   │   │   └── webhooks-and-events.md
│   │   ├── 07-runbooks
│   │   │   ├── bootstrap-environment.md
│   │   │   ├── certify-release.md
│   │   │   ├── decommission-environment.md
│   │   │   ├── deploy-api.md
│   │   │   ├── deploy-cms.md
│   │   │   ├── deploy-web.md
│   │   │   ├── incident-first-response.md
│   │   │   ├── local-development.md
│   │   │   ├── README.md
│   │   │   ├── reindex-search.md
│   │   │   ├── restore-backup.md
│   │   │   ├── rollback-release.md
│   │   │   ├── rotate-credentials.md
│   │   │   ├── rotate-secrets.md
│   │   │   ├── run-database-migrations.md
│   │   │   └── seed-development-data.md
│   │   ├── 08-operations
│   │   │   ├── 0023_development-workflow.md
│   │   │   ├── 0024_testing-strategy.md
│   │   │   ├── 0025_release-and-change-management.md
│   │   │   ├── 0026_incident-response-and-recovery.md
│   │   │   ├── 0027_operational-runbooks.md
│   │   │   ├── alerting.md
│   │   │   ├── audit-model.md
│   │   │   ├── backups-and-recovery.md
│   │   │   ├── capacity-planning.md
│   │   │   ├── change-management.md
│   │   │   ├── dependency-risk-register.md
│   │   │   ├── environments.md
│   │   │   ├── incident-management.md
│   │   │   ├── logging.md
│   │   │   ├── observability.md
│   │   │   ├── on-call-model.md
│   │   │   ├── README.md
│   │   │   ├── retention-and-archival.md
│   │   │   ├── security-operations.md
│   │   │   └── service-level-objectives.md
│   │   ├── 09-ai-context
│   │   │   ├── AI_RULES.md
│   │   │   ├── ARCHITECTURE_SUMMARY.md
│   │   │   ├── CONTINUATION_PROMPT.md
│   │   │   ├── CURRENT_STATE_SUMMARY.md
│   │   │   ├── DEPENDENCY_RULES.md
│   │   │   ├── ENTITY_INVENTORY.md
│   │   │   ├── ENVIRONMENT_VARIABLE_REFERENCE.md
│   │   │   ├── FILE_IMPLEMENTATION_ORDER.md
│   │   │   ├── HANDOFF_PROMPT.md
│   │   │   ├── KNOWN_GAPS.md
│   │   │   ├── PROJECT_CONTEXT.md
│   │   │   ├── README.md
│   │   │   ├── REPO_BLUEPRINT.md
│   │   │   ├── ROUTE_INVENTORY.md
│   │   │   ├── SOURCE_OF_TRUTH_MAP.md
│   │   │   └── SYSTEM_INTERACTION_DIAGRAM.md
│   │   ├── 10-changelog
│   │   │   ├── README.md
│   │   │   ├── releases
│   │   │   │   ├── RELEASE_TEMPLATE.md
│   │   │   │   └── v0.1.0.md
│   │   │   ├── unreleased.md
│   │   │   └── yearly
│   │   │       └── 2026
│   │   │           ├── 2026-01.md
│   │   │           ├── 2026-02.md
│   │   │           └── 2026-03.md
│   │   ├── application
│   │   │   ├── 0011_use-cases.md
│   │   │   ├── 0012_application-services.md
│   │   │   ├── 0013_api-design.md
│   │   │   ├── 0014_event-architecture.md
│   │   │   └── 0015_read-models-and-projections.md
│   │   ├── canonical-refinements.md
│   │   ├── dev-notes
│   │   │   ├── blueprint.md
│   │   │   ├── planningpack
│   │   │   │   ├── 10.md
│   │   │   │   ├── 11.md
│   │   │   │   ├── 12.md
│   │   │   │   ├── 13.md
│   │   │   │   ├── 14.md
│   │   │   │   ├── 1.md
│   │   │   │   ├── 2.md
│   │   │   │   ├── 3.md
│   │   │   │   ├── 4.md
│   │   │   │   ├── 5.md
│   │   │   │   ├── 6.md
│   │   │   │   ├── 7.md
│   │   │   │   ├── 8.md
│   │   │   │   └── 9.md
│   │   │   └── starting.md
│   │   ├── DOCUMENTATION_GOVERNANCE.md
│   │   ├── files
│   │   │   ├── batches
│   │   │   │   ├── 10.md
│   │   │   │   ├── 11.md
│   │   │   │   ├── 12.md
│   │   │   │   ├── 13.md
│   │   │   │   ├── 14.md
│   │   │   │   ├── 15.md
│   │   │   │   ├── 16.md
│   │   │   │   ├── 17.md
│   │   │   │   ├── 18.md
│   │   │   │   ├── 19.md
│   │   │   │   ├── 1.md.bak
│   │   │   │   ├── 1.md.final
│   │   │   │   ├── 20.md
│   │   │   │   ├── 21.md
│   │   │   │   ├── 22.md
│   │   │   │   ├── 233.md
│   │   │   │   ├── 23a.md
│   │   │   │   ├── 23b.md
│   │   │   │   ├── 2.md
│   │   │   │   ├── 2.md.bak
│   │   │   │   ├── 3.md
│   │   │   │   ├── 3.md.bak
│   │   │   │   ├── 4.md
│   │   │   │   ├── 4.md.bak
│   │   │   │   ├── 5.md
│   │   │   │   ├── 6.md
│   │   │   │   ├── 7.md
│   │   │   │   ├── 8.md
│   │   │   │   ├── 9.md
│   │   │   │   ├── baatch13.md
│   │   │   │   ├── batch10.md
│   │   │   │   ├── batch11.md
│   │   │   │   ├── batch12.md
│   │   │   │   ├── batch14.md
│   │   │   │   ├── batch15.md
│   │   │   │   ├── batch16.md
│   │   │   │   ├── batch17.md
│   │   │   │   ├── batch18.md
│   │   │   │   ├── batch19.md
│   │   │   │   ├── batch20.md
│   │   │   │   ├── batch21.md
│   │   │   │   ├── batch5.md
│   │   │   │   ├── batch6.md
│   │   │   │   ├── batch7.md
│   │   │   │   ├── batch8.md
│   │   │   │   ├── batch9.md
│   │   │   │   └── notes23a.md
│   │   │   └── slices
│   │   │       └── packages
│   │   │           └── gov-client
│   │   │               ├── batch1.md
│   │   │               ├── batch2.md
│   │   │               ├── batch3.md
│   │   │               └── batch4.md
│   │   ├── first-pass-canonical-open-api-specification.md
│   │   ├── GLOSSARY.md
│   │   ├── governance
│   │   │   ├── 0028_platform-governance-model.md
│   │   │   └── 0029_data-sovereignty-and-records.md
│   │   ├── governance-api.yaml
│   │   ├── implementation
│   │   │   ├── 0031_monorepo-blueprint.md
│   │   │   ├── 0032_prisma-schema-plan.md
│   │   │   ├── 0033_gov-api-route-manifest.md
│   │   │   ├── 0034_gov-client-plan.md
│   │   │   ├── canonical-refinements.md
│   │   │   ├── doc221.md
│   │   │   ├── doc22.md
│   │   │   ├── gov-api-route-manifest.md
│   │   │   └── gov-client-plan.md
│   │   ├── infrastructure
│   │   │   ├── 0016_database-architecture.md
│   │   │   ├── 0017_repository-pattern.md
│   │   │   ├── 0018_background-jobs-and-workers.md
│   │   │   ├── 0019_observability-and-audit.md
│   │   │   ├── 0020_security-architecture.md
│   │   │   ├── 0021_deployment-architecture.md
│   │   │   └── 0022_environment-and-config.md
│   │   ├── prisma-schema-init-sql-updated.md
│   │   ├── prisma-schema-tightening.md
│   │   ├── SOURCE_OF_TRUTH_POLICY.md
│   │   └── STYLE_GUIDE.md
│   ├── journal
│   │   ├── 2026-03-20.md
│   │   ├── 2026-03-21.md
│   │   ├── 2026-03-22.md
│   │   └── README.md
│   ├── README.md
│   └── tutorials
│       ├── advanced
│       │   ├── architecture-tour.md
│       │   ├── authoring-a-feature-spec.md
│       │   ├── extending-the-domain-model.md
│       │   └── writing-an-adr.md
│       ├── first-api-endpoint.md
│       ├── first-deployment.md
│       ├── first-feature.md
│       ├── getting-started.md
│       ├── local-development.md
│       └── README.md
├── node_modules
│   ├── dom-walk
│   │   ├── example
│   │   │   └── index.js
│   │   ├── index.js
│   │   ├── LICENCE
│   │   ├── Makefile
│   │   ├── package.json
│   │   └── README.md
│   ├── global
│   │   ├── console.js
│   │   ├── document.js
│   │   ├── LICENSE
│   │   ├── package.json
│   │   ├── process.js
│   │   ├── README.md
│   │   └── window.js
│   ├── min-document
│   │   ├── CONTRIBUTION.md
│   │   ├── docs.mli
│   │   ├── document.js
│   │   ├── dom-comment.js
│   │   ├── dom-element.js
│   │   ├── dom-fragment.js
│   │   ├── dom-text.js
│   │   ├── event
│   │   │   ├── add-event-listener.js
│   │   │   ├── dispatch-event.js
│   │   │   └── remove-event-listener.js
│   │   ├── event.js
│   │   ├── index.js
│   │   ├── LICENCE
│   │   ├── package.json
│   │   ├── README.md
│   │   ├── serialize.js
│   │   └── test
│   │       ├── cleanup.js
│   │       ├── index.js
│   │       ├── static
│   │       │   ├── index.html
│   │       │   └── test-adapter.js
│   │       ├── test-document.js
│   │       ├── test-dom-comment.js
│   │       └── test-dom-element.js
│   ├── pnpm
│   │   ├── bin
│   │   │   ├── pnpm.cjs
│   │   │   └── pnpx.cjs
│   │   ├── dist
│   │   │   ├── node-gyp-bin
│   │   │   │   ├── node-gyp
│   │   │   │   └── node-gyp.cmd
│   │   │   ├── node_modules
│   │   │   │   ├── abbrev
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── agent-base
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── helpers.d.ts.map
│   │   │   │   │   │   ├── helpers.js
│   │   │   │   │   │   ├── helpers.js.map
│   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── index.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── ansi-regex
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── ansi-styles
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── balanced-match
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── brace-expansion
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── cacache
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── content
│   │   │   │   │   │   │   ├── path.js
│   │   │   │   │   │   │   ├── read.js
│   │   │   │   │   │   │   ├── rm.js
│   │   │   │   │   │   │   └── write.js
│   │   │   │   │   │   ├── entry-index.js
│   │   │   │   │   │   ├── get.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── memoization.js
│   │   │   │   │   │   ├── put.js
│   │   │   │   │   │   ├── rm.js
│   │   │   │   │   │   ├── util
│   │   │   │   │   │   │   ├── glob.js
│   │   │   │   │   │   │   ├── hash-to-segments.js
│   │   │   │   │   │   │   └── tmp.js
│   │   │   │   │   │   └── verify.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── chownr
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       └── package.json
│   │   │   │   │   └── package.json
│   │   │   │   ├── color-convert
│   │   │   │   │   ├── conversions.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── package.json
│   │   │   │   │   └── route.js
│   │   │   │   ├── color-name
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── cross-spawn
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── enoent.js
│   │   │   │   │   │   ├── parse.js
│   │   │   │   │   │   └── util
│   │   │   │   │   │       ├── escape.js
│   │   │   │   │   │       ├── readShebang.js
│   │   │   │   │   │       └── resolveCommand.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── node_modules
│   │   │   │   │   │   ├── isexe
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── LICENSE
│   │   │   │   │   │   │   ├── mode.js
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   └── windows.js
│   │   │   │   │   │   └── which
│   │   │   │   │   │       ├── bin
│   │   │   │   │   │       │   └── node-which
│   │   │   │   │   │       ├── LICENSE
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       └── which.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── debug
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── package.json
│   │   │   │   │   └── src
│   │   │   │   │       ├── browser.js
│   │   │   │   │       ├── common.js
│   │   │   │   │       ├── index.js
│   │   │   │   │       └── node.js
│   │   │   │   ├── eastasianwidth
│   │   │   │   │   ├── eastasianwidth.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── emoji-regex
│   │   │   │   │   ├── es2015
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── RGI_Emoji.js
│   │   │   │   │   │   └── text.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE-MIT.txt
│   │   │   │   │   ├── package.json
│   │   │   │   │   ├── RGI_Emoji.js
│   │   │   │   │   └── text.js
│   │   │   │   ├── encoding
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── encoding.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── env-paths
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── err-code
│   │   │   │   │   ├── bower.json
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── index.umd.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── exponential-backoff
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── backoff.js
│   │   │   │   │   │   ├── backoff.js.map
│   │   │   │   │   │   ├── delay
│   │   │   │   │   │   │   ├── always
│   │   │   │   │   │   │   │   ├── always.delay.js
│   │   │   │   │   │   │   │   └── always.delay.js.map
│   │   │   │   │   │   │   ├── delay.base.js
│   │   │   │   │   │   │   ├── delay.base.js.map
│   │   │   │   │   │   │   ├── delay.factory.js
│   │   │   │   │   │   │   ├── delay.factory.js.map
│   │   │   │   │   │   │   ├── delay.interface.js
│   │   │   │   │   │   │   ├── delay.interface.js.map
│   │   │   │   │   │   │   └── skip-first
│   │   │   │   │   │   │       ├── skip-first.delay.js
│   │   │   │   │   │   │       └── skip-first.delay.js.map
│   │   │   │   │   │   ├── jitter
│   │   │   │   │   │   │   ├── full
│   │   │   │   │   │   │   │   ├── full.jitter.js
│   │   │   │   │   │   │   │   └── full.jitter.js.map
│   │   │   │   │   │   │   ├── jitter.factory.js
│   │   │   │   │   │   │   ├── jitter.factory.js.map
│   │   │   │   │   │   │   └── no
│   │   │   │   │   │   │       ├── no.jitter.js
│   │   │   │   │   │   │       └── no.jitter.js.map
│   │   │   │   │   │   ├── options.js
│   │   │   │   │   │   └── options.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── fdir
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── index.cjs
│   │   │   │   │   │   ├── index.d.cts
│   │   │   │   │   │   ├── index.d.mts
│   │   │   │   │   │   └── index.mjs
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── foreground-child
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── all-signals.d.ts.map
│   │   │   │   │   │   │   ├── all-signals.js
│   │   │   │   │   │   │   ├── all-signals.js.map
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   ├── proxy-signals.d.ts.map
│   │   │   │   │   │   │   ├── proxy-signals.js
│   │   │   │   │   │   │   ├── proxy-signals.js.map
│   │   │   │   │   │   │   ├── watchdog.d.ts.map
│   │   │   │   │   │   │   ├── watchdog.js
│   │   │   │   │   │   │   └── watchdog.js.map
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── all-signals.d.ts.map
│   │   │   │   │   │       ├── all-signals.js
│   │   │   │   │   │       ├── all-signals.js.map
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       ├── proxy-signals.d.ts.map
│   │   │   │   │   │       ├── proxy-signals.js
│   │   │   │   │   │       ├── proxy-signals.js.map
│   │   │   │   │   │       ├── watchdog.d.ts.map
│   │   │   │   │   │       ├── watchdog.js
│   │   │   │   │   │       └── watchdog.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── fs-minipass
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── glob
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── glob.d.ts.map
│   │   │   │   │   │   │   ├── glob.js
│   │   │   │   │   │   │   ├── glob.js.map
│   │   │   │   │   │   │   ├── has-magic.d.ts.map
│   │   │   │   │   │   │   ├── has-magic.js
│   │   │   │   │   │   │   ├── has-magic.js.map
│   │   │   │   │   │   │   ├── ignore.d.ts.map
│   │   │   │   │   │   │   ├── ignore.js
│   │   │   │   │   │   │   ├── ignore.js.map
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   ├── pattern.d.ts.map
│   │   │   │   │   │   │   ├── pattern.js
│   │   │   │   │   │   │   ├── pattern.js.map
│   │   │   │   │   │   │   ├── processor.d.ts.map
│   │   │   │   │   │   │   ├── processor.js
│   │   │   │   │   │   │   ├── processor.js.map
│   │   │   │   │   │   │   ├── walker.d.ts.map
│   │   │   │   │   │   │   ├── walker.js
│   │   │   │   │   │   │   └── walker.js.map
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── bin.d.mts
│   │   │   │   │   │       ├── bin.d.mts.map
│   │   │   │   │   │       ├── bin.mjs
│   │   │   │   │   │       ├── bin.mjs.map
│   │   │   │   │   │       ├── glob.d.ts.map
│   │   │   │   │   │       ├── glob.js
│   │   │   │   │   │       ├── glob.js.map
│   │   │   │   │   │       ├── has-magic.d.ts.map
│   │   │   │   │   │       ├── has-magic.js
│   │   │   │   │   │       ├── has-magic.js.map
│   │   │   │   │   │       ├── ignore.d.ts.map
│   │   │   │   │   │       ├── ignore.js
│   │   │   │   │   │       ├── ignore.js.map
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       ├── pattern.d.ts.map
│   │   │   │   │   │       ├── pattern.js
│   │   │   │   │   │       ├── pattern.js.map
│   │   │   │   │   │       ├── processor.d.ts.map
│   │   │   │   │   │       ├── processor.js
│   │   │   │   │   │       ├── processor.js.map
│   │   │   │   │   │       ├── walker.d.ts.map
│   │   │   │   │   │       ├── walker.js
│   │   │   │   │   │       └── walker.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── graceful-fs
│   │   │   │   │   ├── clone.js
│   │   │   │   │   ├── graceful-fs.js
│   │   │   │   │   ├── legacy-streams.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── package.json
│   │   │   │   │   └── polyfills.js
│   │   │   │   ├── http-cache-semantics
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── http-proxy-agent
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── index.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── https-proxy-agent
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   ├── parse-proxy-response.d.ts.map
│   │   │   │   │   │   ├── parse-proxy-response.js
│   │   │   │   │   │   └── parse-proxy-response.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── iconv-lite
│   │   │   │   │   ├── encodings
│   │   │   │   │   │   ├── dbcs-codec.js
│   │   │   │   │   │   ├── dbcs-data.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── internal.js
│   │   │   │   │   │   ├── sbcs-codec.js
│   │   │   │   │   │   ├── sbcs-data-generated.js
│   │   │   │   │   │   ├── sbcs-data.js
│   │   │   │   │   │   ├── tables
│   │   │   │   │   │   │   ├── big5-added.json
│   │   │   │   │   │   │   ├── cp936.json
│   │   │   │   │   │   │   ├── cp949.json
│   │   │   │   │   │   │   ├── cp950.json
│   │   │   │   │   │   │   ├── eucjp.json
│   │   │   │   │   │   │   ├── gb18030-ranges.json
│   │   │   │   │   │   │   ├── gbk-added.json
│   │   │   │   │   │   │   └── shiftjis.json
│   │   │   │   │   │   ├── utf16.js
│   │   │   │   │   │   ├── utf32.js
│   │   │   │   │   │   └── utf7.js
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── bom-handling.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── streams.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── imurmurhash
│   │   │   │   │   ├── imurmurhash.js
│   │   │   │   │   ├── imurmurhash.min.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── ip-address
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── address-error.d.ts.map
│   │   │   │   │   │   ├── address-error.js
│   │   │   │   │   │   ├── address-error.js.map
│   │   │   │   │   │   ├── common.d.ts.map
│   │   │   │   │   │   ├── common.js
│   │   │   │   │   │   ├── common.js.map
│   │   │   │   │   │   ├── ip-address.d.ts.map
│   │   │   │   │   │   ├── ip-address.js
│   │   │   │   │   │   ├── ip-address.js.map
│   │   │   │   │   │   ├── ipv4.d.ts.map
│   │   │   │   │   │   ├── ipv4.js
│   │   │   │   │   │   ├── ipv4.js.map
│   │   │   │   │   │   ├── ipv6.d.ts.map
│   │   │   │   │   │   ├── ipv6.js
│   │   │   │   │   │   ├── ipv6.js.map
│   │   │   │   │   │   ├── v4
│   │   │   │   │   │   │   ├── constants.d.ts.map
│   │   │   │   │   │   │   ├── constants.js
│   │   │   │   │   │   │   └── constants.js.map
│   │   │   │   │   │   └── v6
│   │   │   │   │   │       ├── constants.d.ts.map
│   │   │   │   │   │       ├── constants.js
│   │   │   │   │   │       ├── constants.js.map
│   │   │   │   │   │       ├── helpers.d.ts.map
│   │   │   │   │   │       ├── helpers.js
│   │   │   │   │   │       ├── helpers.js.map
│   │   │   │   │   │       ├── regular-expressions.d.ts.map
│   │   │   │   │   │       ├── regular-expressions.js
│   │   │   │   │   │       └── regular-expressions.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── @isaacs
│   │   │   │   │   ├── cliui
│   │   │   │   │   │   ├── build
│   │   │   │   │   │   │   ├── index.cjs
│   │   │   │   │   │   │   ├── index.d.cts
│   │   │   │   │   │   │   └── lib
│   │   │   │   │   │   │       └── index.js
│   │   │   │   │   │   ├── index.mjs
│   │   │   │   │   │   ├── LICENSE.txt
│   │   │   │   │   │   └── package.json
│   │   │   │   │   └── fs-minipass
│   │   │   │   │       ├── dist
│   │   │   │   │       │   ├── commonjs
│   │   │   │   │       │   │   ├── index.d.ts.map
│   │   │   │   │       │   │   ├── index.js
│   │   │   │   │       │   │   ├── index.js.map
│   │   │   │   │       │   │   └── package.json
│   │   │   │   │       │   └── esm
│   │   │   │   │       │       ├── index.d.ts.map
│   │   │   │   │       │       ├── index.js
│   │   │   │   │       │       ├── index.js.map
│   │   │   │   │       │       └── package.json
│   │   │   │   │       ├── LICENSE
│   │   │   │   │       └── package.json
│   │   │   │   ├── isexe
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── cjs
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── options.d.ts.map
│   │   │   │   │   │   │   ├── options.js
│   │   │   │   │   │   │   ├── options.js.map
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   ├── posix.d.ts.map
│   │   │   │   │   │   │   ├── posix.js
│   │   │   │   │   │   │   ├── posix.js.map
│   │   │   │   │   │   │   ├── win32.d.ts.map
│   │   │   │   │   │   │   ├── win32.js
│   │   │   │   │   │   │   └── win32.js.map
│   │   │   │   │   │   └── mjs
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── options.d.ts.map
│   │   │   │   │   │       ├── options.js
│   │   │   │   │   │       ├── options.js.map
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       ├── posix.d.ts.map
│   │   │   │   │   │       ├── posix.js
│   │   │   │   │   │       ├── posix.js.map
│   │   │   │   │   │       ├── win32.d.ts.map
│   │   │   │   │   │       ├── win32.js
│   │   │   │   │   │       └── win32.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── is-fullwidth-code-point
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── jackspeak
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   ├── parse-args-cjs.cjs.map
│   │   │   │   │   │   │   ├── parse-args-cjs.d.cts.map
│   │   │   │   │   │   │   └── parse-args.js
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       ├── parse-args.d.ts.map
│   │   │   │   │   │       ├── parse-args.js
│   │   │   │   │   │       └── parse-args.js.map
│   │   │   │   │   └── package.json
│   │   │   │   ├── lru-cache
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── index.min.js
│   │   │   │   │   │   │   ├── index.min.js.map
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── index.min.js
│   │   │   │   │   │       ├── index.min.js.map
│   │   │   │   │   │       └── package.json
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── make-fetch-happen
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── cache
│   │   │   │   │   │   │   ├── entry.js
│   │   │   │   │   │   │   ├── errors.js
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── key.js
│   │   │   │   │   │   │   └── policy.js
│   │   │   │   │   │   ├── fetch.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── options.js
│   │   │   │   │   │   ├── pipeline.js
│   │   │   │   │   │   └── remote.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── minimatch
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── assert-valid-pattern.d.ts.map
│   │   │   │   │   │   │   ├── assert-valid-pattern.js
│   │   │   │   │   │   │   ├── assert-valid-pattern.js.map
│   │   │   │   │   │   │   ├── ast.d.ts.map
│   │   │   │   │   │   │   ├── ast.js
│   │   │   │   │   │   │   ├── ast.js.map
│   │   │   │   │   │   │   ├── brace-expressions.d.ts.map
│   │   │   │   │   │   │   ├── brace-expressions.js
│   │   │   │   │   │   │   ├── brace-expressions.js.map
│   │   │   │   │   │   │   ├── escape.d.ts.map
│   │   │   │   │   │   │   ├── escape.js
│   │   │   │   │   │   │   ├── escape.js.map
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   ├── unescape.d.ts.map
│   │   │   │   │   │   │   ├── unescape.js
│   │   │   │   │   │   │   └── unescape.js.map
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── assert-valid-pattern.d.ts.map
│   │   │   │   │   │       ├── assert-valid-pattern.js
│   │   │   │   │   │       ├── assert-valid-pattern.js.map
│   │   │   │   │   │       ├── ast.d.ts.map
│   │   │   │   │   │       ├── ast.js
│   │   │   │   │   │       ├── ast.js.map
│   │   │   │   │   │       ├── brace-expressions.d.ts.map
│   │   │   │   │   │       ├── brace-expressions.js
│   │   │   │   │   │       ├── brace-expressions.js.map
│   │   │   │   │   │       ├── escape.d.ts.map
│   │   │   │   │   │       ├── escape.js
│   │   │   │   │   │       ├── escape.js.map
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       ├── unescape.d.ts.map
│   │   │   │   │   │       ├── unescape.js
│   │   │   │   │   │       └── unescape.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── minipass
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       └── package.json
│   │   │   │   │   └── package.json
│   │   │   │   ├── minipass-collect
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── minipass-fetch
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── abort-error.js
│   │   │   │   │   │   ├── blob.js
│   │   │   │   │   │   ├── body.js
│   │   │   │   │   │   ├── fetch-error.js
│   │   │   │   │   │   ├── headers.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── request.js
│   │   │   │   │   │   └── response.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── minipass-flush
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── node_modules
│   │   │   │   │   │   ├── minipass
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── LICENSE
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── yallist
│   │   │   │   │   │       ├── iterator.js
│   │   │   │   │   │       ├── LICENSE
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       └── yallist.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── minipass-pipeline
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── node_modules
│   │   │   │   │   │   ├── minipass
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── LICENSE
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── yallist
│   │   │   │   │   │       ├── iterator.js
│   │   │   │   │   │       ├── LICENSE
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       └── yallist.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── minipass-sized
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── node_modules
│   │   │   │   │   │   ├── minipass
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── LICENSE
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── yallist
│   │   │   │   │   │       ├── iterator.js
│   │   │   │   │   │       ├── LICENSE
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       └── yallist.js
│   │   │   │   │   ├── package.json
│   │   │   │   │   └── package-lock.json
│   │   │   │   ├── minizlib
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── constants.d.ts.map
│   │   │   │   │   │   │   ├── constants.js
│   │   │   │   │   │   │   ├── constants.js.map
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── constants.d.ts.map
│   │   │   │   │   │       ├── constants.js
│   │   │   │   │   │       ├── constants.js.map
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       └── package.json
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── ms
│   │   │   │   │   ├── index.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── negotiator
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── charset.js
│   │   │   │   │   │   ├── encoding.js
│   │   │   │   │   │   ├── language.js
│   │   │   │   │   │   └── mediaType.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── node-gyp
│   │   │   │   │   ├── addon.gypi
│   │   │   │   │   ├── bin
│   │   │   │   │   │   └── node-gyp.js
│   │   │   │   │   ├── eslint.config.js
│   │   │   │   │   ├── gyp
│   │   │   │   │   │   ├── data
│   │   │   │   │   │   │   ├── ninja
│   │   │   │   │   │   │   │   └── build.ninja
│   │   │   │   │   │   │   └── win
│   │   │   │   │   │   │       └── large-pdb-shim.cc
│   │   │   │   │   │   ├── gyp
│   │   │   │   │   │   ├── gyp.bat
│   │   │   │   │   │   ├── gyp_main.py
│   │   │   │   │   │   ├── LICENSE
│   │   │   │   │   │   ├── pylib
│   │   │   │   │   │   │   ├── gyp
│   │   │   │   │   │   │   │   ├── common.py
│   │   │   │   │   │   │   │   ├── common_test.py
│   │   │   │   │   │   │   │   ├── easy_xml.py
│   │   │   │   │   │   │   │   ├── easy_xml_test.py
│   │   │   │   │   │   │   │   ├── flock_tool.py
│   │   │   │   │   │   │   │   ├── generator
│   │   │   │   │   │   │   │   │   ├── analyzer.py
│   │   │   │   │   │   │   │   │   ├── android.py
│   │   │   │   │   │   │   │   │   ├── cmake.py
│   │   │   │   │   │   │   │   │   ├── compile_commands_json.py
│   │   │   │   │   │   │   │   │   ├── dump_dependency_json.py
│   │   │   │   │   │   │   │   │   ├── eclipse.py
│   │   │   │   │   │   │   │   │   ├── gypd.py
│   │   │   │   │   │   │   │   │   ├── gypsh.py
│   │   │   │   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   │   │   │   ├── make.py
│   │   │   │   │   │   │   │   │   ├── msvs.py
│   │   │   │   │   │   │   │   │   ├── msvs_test.py
│   │   │   │   │   │   │   │   │   ├── ninja.py
│   │   │   │   │   │   │   │   │   ├── ninja_test.py
│   │   │   │   │   │   │   │   │   ├── xcode.py
│   │   │   │   │   │   │   │   │   └── xcode_test.py
│   │   │   │   │   │   │   │   ├── __init__.py
│   │   │   │   │   │   │   │   ├── input.py
│   │   │   │   │   │   │   │   ├── input_test.py
│   │   │   │   │   │   │   │   ├── mac_tool.py
│   │   │   │   │   │   │   │   ├── msvs_emulation.py
│   │   │   │   │   │   │   │   ├── MSVSNew.py
│   │   │   │   │   │   │   │   ├── MSVSProject.py
│   │   │   │   │   │   │   │   ├── MSVSSettings.py
│   │   │   │   │   │   │   │   ├── MSVSSettings_test.py
│   │   │   │   │   │   │   │   ├── MSVSToolFile.py
│   │   │   │   │   │   │   │   ├── MSVSUserFile.py
│   │   │   │   │   │   │   │   ├── MSVSUtil.py
│   │   │   │   │   │   │   │   ├── MSVSVersion.py
│   │   │   │   │   │   │   │   ├── ninja_syntax.py
│   │   │   │   │   │   │   │   ├── simple_copy.py
│   │   │   │   │   │   │   │   ├── win_tool.py
│   │   │   │   │   │   │   │   ├── xcode_emulation.py
│   │   │   │   │   │   │   │   ├── xcode_emulation_test.py
│   │   │   │   │   │   │   │   ├── xcode_ninja.py
│   │   │   │   │   │   │   │   ├── xcodeproj_file.py
│   │   │   │   │   │   │   │   └── xml_fix.py
│   │   │   │   │   │   │   └── packaging
│   │   │   │   │   │   │       ├── _elffile.py
│   │   │   │   │   │   │       ├── __init__.py
│   │   │   │   │   │   │       ├── LICENSE
│   │   │   │   │   │   │       ├── LICENSE.APACHE
│   │   │   │   │   │   │       ├── LICENSE.BSD
│   │   │   │   │   │   │       ├── _manylinux.py
│   │   │   │   │   │   │       ├── markers.py
│   │   │   │   │   │   │       ├── metadata.py
│   │   │   │   │   │   │       ├── _musllinux.py
│   │   │   │   │   │   │       ├── _parser.py
│   │   │   │   │   │   │       ├── py.typed
│   │   │   │   │   │   │       ├── requirements.py
│   │   │   │   │   │   │       ├── specifiers.py
│   │   │   │   │   │   │       ├── _structures.py
│   │   │   │   │   │   │       ├── tags.py
│   │   │   │   │   │   │       ├── _tokenizer.py
│   │   │   │   │   │   │       ├── utils.py
│   │   │   │   │   │   │       └── version.py
│   │   │   │   │   │   ├── pyproject.toml
│   │   │   │   │   │   ├── release-please-config.json
│   │   │   │   │   │   └── test_gyp.py
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── build.js
│   │   │   │   │   │   ├── clean.js
│   │   │   │   │   │   ├── configure.js
│   │   │   │   │   │   ├── create-config-gypi.js
│   │   │   │   │   │   ├── download.js
│   │   │   │   │   │   ├── find-node-directory.js
│   │   │   │   │   │   ├── find-python.js
│   │   │   │   │   │   ├── Find-VisualStudio.cs
│   │   │   │   │   │   ├── find-visualstudio.js
│   │   │   │   │   │   ├── install.js
│   │   │   │   │   │   ├── list.js
│   │   │   │   │   │   ├── log.js
│   │   │   │   │   │   ├── node-gyp.js
│   │   │   │   │   │   ├── process-release.js
│   │   │   │   │   │   ├── rebuild.js
│   │   │   │   │   │   ├── remove.js
│   │   │   │   │   │   └── util.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── macOS_Catalina_acid_test.sh
│   │   │   │   │   ├── package.json
│   │   │   │   │   ├── release-please-config.json
│   │   │   │   │   └── src
│   │   │   │   │       └── win_delay_load_hook.cc
│   │   │   │   ├── nopt
│   │   │   │   │   ├── bin
│   │   │   │   │   │   └── nopt.js
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── debug.js
│   │   │   │   │   │   ├── nopt.js
│   │   │   │   │   │   ├── nopt-lib.js
│   │   │   │   │   │   └── type-defs.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── @npmcli
│   │   │   │   │   ├── agent
│   │   │   │   │   │   ├── lib
│   │   │   │   │   │   │   ├── agents.js
│   │   │   │   │   │   │   ├── dns.js
│   │   │   │   │   │   │   ├── errors.js
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── options.js
│   │   │   │   │   │   │   └── proxy.js
│   │   │   │   │   │   └── package.json
│   │   │   │   │   └── fs
│   │   │   │   │       ├── lib
│   │   │   │   │       │   ├── common
│   │   │   │   │       │   │   ├── get-options.js
│   │   │   │   │       │   │   └── node.js
│   │   │   │   │       │   ├── cp
│   │   │   │   │       │   │   ├── errors.js
│   │   │   │   │       │   │   ├── index.js
│   │   │   │   │       │   │   ├── LICENSE
│   │   │   │   │       │   │   └── polyfill.js
│   │   │   │   │       │   ├── index.js
│   │   │   │   │       │   ├── move-file.js
│   │   │   │   │       │   ├── readdir-scoped.js
│   │   │   │   │       │   └── with-temp-dir.js
│   │   │   │   │       └── package.json
│   │   │   │   ├── package-json-from-dist
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       └── package.json
│   │   │   │   │   └── package.json
│   │   │   │   ├── path-key
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── path-scurry
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       └── package.json
│   │   │   │   │   └── package.json
│   │   │   │   ├── picomatch
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── constants.js
│   │   │   │   │   │   ├── parse.js
│   │   │   │   │   │   ├── picomatch.js
│   │   │   │   │   │   ├── scan.js
│   │   │   │   │   │   └── utils.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── package.json
│   │   │   │   │   └── posix.js
│   │   │   │   ├── @pkgjs
│   │   │   │   │   └── parseargs
│   │   │   │   │       ├── index.js
│   │   │   │   │       ├── internal
│   │   │   │   │       │   ├── errors.js
│   │   │   │   │       │   ├── primordials.js
│   │   │   │   │       │   ├── util.js
│   │   │   │   │       │   └── validators.js
│   │   │   │   │       ├── LICENSE
│   │   │   │   │       ├── package.json
│   │   │   │   │       └── utils.js
│   │   │   │   ├── p-map
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── proc-log
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── promise-retry
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── retry
│   │   │   │   │   ├── equation.gif
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── lib
│   │   │   │   │   │   ├── retry.js
│   │   │   │   │   │   └── retry_operation.js
│   │   │   │   │   ├── License
│   │   │   │   │   └── package.json
│   │   │   │   ├── safer-buffer
│   │   │   │   │   ├── dangerous.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── package.json
│   │   │   │   │   ├── safer.js
│   │   │   │   │   └── tests.js
│   │   │   │   ├── semver
│   │   │   │   │   ├── bin
│   │   │   │   │   │   └── semver.js
│   │   │   │   │   ├── classes
│   │   │   │   │   │   ├── comparator.js
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   ├── range.js
│   │   │   │   │   │   └── semver.js
│   │   │   │   │   ├── functions
│   │   │   │   │   │   ├── clean.js
│   │   │   │   │   │   ├── cmp.js
│   │   │   │   │   │   ├── coerce.js
│   │   │   │   │   │   ├── compare-build.js
│   │   │   │   │   │   ├── compare.js
│   │   │   │   │   │   ├── compare-loose.js
│   │   │   │   │   │   ├── diff.js
│   │   │   │   │   │   ├── eq.js
│   │   │   │   │   │   ├── gte.js
│   │   │   │   │   │   ├── gt.js
│   │   │   │   │   │   ├── inc.js
│   │   │   │   │   │   ├── lte.js
│   │   │   │   │   │   ├── lt.js
│   │   │   │   │   │   ├── major.js
│   │   │   │   │   │   ├── minor.js
│   │   │   │   │   │   ├── neq.js
│   │   │   │   │   │   ├── parse.js
│   │   │   │   │   │   ├── patch.js
│   │   │   │   │   │   ├── prerelease.js
│   │   │   │   │   │   ├── rcompare.js
│   │   │   │   │   │   ├── rsort.js
│   │   │   │   │   │   ├── satisfies.js
│   │   │   │   │   │   ├── sort.js
│   │   │   │   │   │   └── valid.js
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── internal
│   │   │   │   │   │   ├── constants.js
│   │   │   │   │   │   ├── debug.js
│   │   │   │   │   │   ├── identifiers.js
│   │   │   │   │   │   ├── lrucache.js
│   │   │   │   │   │   ├── parse-options.js
│   │   │   │   │   │   └── re.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── package.json
│   │   │   │   │   ├── preload.js
│   │   │   │   │   ├── range.bnf
│   │   │   │   │   └── ranges
│   │   │   │   │       ├── gtr.js
│   │   │   │   │       ├── intersects.js
│   │   │   │   │       ├── ltr.js
│   │   │   │   │       ├── max-satisfying.js
│   │   │   │   │       ├── min-satisfying.js
│   │   │   │   │       ├── min-version.js
│   │   │   │   │       ├── outside.js
│   │   │   │   │       ├── simplify.js
│   │   │   │   │       ├── subset.js
│   │   │   │   │       ├── to-comparators.js
│   │   │   │   │       └── valid.js
│   │   │   │   ├── shebang-command
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── shebang-regex
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── signal-exit
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── cjs
│   │   │   │   │   │   │   ├── browser.d.ts.map
│   │   │   │   │   │   │   ├── browser.js
│   │   │   │   │   │   │   ├── browser.js.map
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   ├── signals.d.ts.map
│   │   │   │   │   │   │   ├── signals.js
│   │   │   │   │   │   │   └── signals.js.map
│   │   │   │   │   │   └── mjs
│   │   │   │   │   │       ├── browser.d.ts.map
│   │   │   │   │   │       ├── browser.js
│   │   │   │   │   │       ├── browser.js.map
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       ├── signals.d.ts.map
│   │   │   │   │   │       ├── signals.js
│   │   │   │   │   │       └── signals.js.map
│   │   │   │   │   ├── LICENSE.txt
│   │   │   │   │   └── package.json
│   │   │   │   ├── smart-buffer
│   │   │   │   │   ├── build
│   │   │   │   │   │   ├── smartbuffer.js
│   │   │   │   │   │   ├── smartbuffer.js.map
│   │   │   │   │   │   ├── utils.js
│   │   │   │   │   │   └── utils.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── socks
│   │   │   │   │   ├── build
│   │   │   │   │   │   ├── client
│   │   │   │   │   │   │   ├── socksclient.js
│   │   │   │   │   │   │   └── socksclient.js.map
│   │   │   │   │   │   ├── common
│   │   │   │   │   │   │   ├── constants.js
│   │   │   │   │   │   │   ├── constants.js.map
│   │   │   │   │   │   │   ├── helpers.js
│   │   │   │   │   │   │   ├── helpers.js.map
│   │   │   │   │   │   │   ├── receivebuffer.js
│   │   │   │   │   │   │   ├── receivebuffer.js.map
│   │   │   │   │   │   │   ├── util.js
│   │   │   │   │   │   │   └── util.js.map
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── index.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── socks-proxy-agent
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   └── index.js.map
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── ssri
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── index.js
│   │   │   │   │   └── package.json
│   │   │   │   ├── string-width
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── string-width-cjs
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   ├── node_modules
│   │   │   │   │   │   ├── ansi-regex
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── license
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   ├── emoji-regex
│   │   │   │   │   │   │   ├── es2015
│   │   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   │   └── text.js
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── LICENSE-MIT.txt
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   └── text.js
│   │   │   │   │   │   └── strip-ansi
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── license
│   │   │   │   │   │       └── package.json
│   │   │   │   │   └── package.json
│   │   │   │   ├── strip-ansi
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── strip-ansi-cjs
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   ├── node_modules
│   │   │   │   │   │   └── ansi-regex
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── license
│   │   │   │   │   │       └── package.json
│   │   │   │   │   └── package.json
│   │   │   │   ├── tar
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── commonjs
│   │   │   │   │   │   │   ├── create.d.ts.map
│   │   │   │   │   │   │   ├── create.js
│   │   │   │   │   │   │   ├── create.js.map
│   │   │   │   │   │   │   ├── cwd-error.d.ts.map
│   │   │   │   │   │   │   ├── cwd-error.js
│   │   │   │   │   │   │   ├── cwd-error.js.map
│   │   │   │   │   │   │   ├── extract.d.ts.map
│   │   │   │   │   │   │   ├── extract.js
│   │   │   │   │   │   │   ├── extract.js.map
│   │   │   │   │   │   │   ├── get-write-flag.d.ts.map
│   │   │   │   │   │   │   ├── get-write-flag.js
│   │   │   │   │   │   │   ├── get-write-flag.js.map
│   │   │   │   │   │   │   ├── header.d.ts.map
│   │   │   │   │   │   │   ├── header.js
│   │   │   │   │   │   │   ├── header.js.map
│   │   │   │   │   │   │   ├── index.d.ts.map
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── index.js.map
│   │   │   │   │   │   │   ├── index.min.js
│   │   │   │   │   │   │   ├── index.min.js.map
│   │   │   │   │   │   │   ├── large-numbers.d.ts.map
│   │   │   │   │   │   │   ├── large-numbers.js
│   │   │   │   │   │   │   ├── large-numbers.js.map
│   │   │   │   │   │   │   ├── list.d.ts.map
│   │   │   │   │   │   │   ├── list.js
│   │   │   │   │   │   │   ├── list.js.map
│   │   │   │   │   │   │   ├── make-command.d.ts.map
│   │   │   │   │   │   │   ├── make-command.js
│   │   │   │   │   │   │   ├── make-command.js.map
│   │   │   │   │   │   │   ├── mkdir.d.ts.map
│   │   │   │   │   │   │   ├── mkdir.js
│   │   │   │   │   │   │   ├── mkdir.js.map
│   │   │   │   │   │   │   ├── mode-fix.d.ts.map
│   │   │   │   │   │   │   ├── mode-fix.js
│   │   │   │   │   │   │   ├── mode-fix.js.map
│   │   │   │   │   │   │   ├── normalize-unicode.d.ts.map
│   │   │   │   │   │   │   ├── normalize-unicode.js
│   │   │   │   │   │   │   ├── normalize-unicode.js.map
│   │   │   │   │   │   │   ├── normalize-windows-path.d.ts.map
│   │   │   │   │   │   │   ├── normalize-windows-path.js
│   │   │   │   │   │   │   ├── normalize-windows-path.js.map
│   │   │   │   │   │   │   ├── options.d.ts.map
│   │   │   │   │   │   │   ├── options.js
│   │   │   │   │   │   │   ├── options.js.map
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   ├── pack.d.ts.map
│   │   │   │   │   │   │   ├── pack.js
│   │   │   │   │   │   │   ├── pack.js.map
│   │   │   │   │   │   │   ├── parse.d.ts.map
│   │   │   │   │   │   │   ├── parse.js
│   │   │   │   │   │   │   ├── parse.js.map
│   │   │   │   │   │   │   ├── path-reservations.d.ts.map
│   │   │   │   │   │   │   ├── path-reservations.js
│   │   │   │   │   │   │   ├── path-reservations.js.map
│   │   │   │   │   │   │   ├── pax.d.ts.map
│   │   │   │   │   │   │   ├── pax.js
│   │   │   │   │   │   │   ├── pax.js.map
│   │   │   │   │   │   │   ├── process-umask.d.ts.map
│   │   │   │   │   │   │   ├── process-umask.js
│   │   │   │   │   │   │   ├── process-umask.js.map
│   │   │   │   │   │   │   ├── read-entry.d.ts.map
│   │   │   │   │   │   │   ├── read-entry.js
│   │   │   │   │   │   │   ├── read-entry.js.map
│   │   │   │   │   │   │   ├── replace.d.ts.map
│   │   │   │   │   │   │   ├── replace.js
│   │   │   │   │   │   │   ├── replace.js.map
│   │   │   │   │   │   │   ├── strip-absolute-path.d.ts.map
│   │   │   │   │   │   │   ├── strip-absolute-path.js
│   │   │   │   │   │   │   ├── strip-absolute-path.js.map
│   │   │   │   │   │   │   ├── strip-trailing-slashes.d.ts.map
│   │   │   │   │   │   │   ├── strip-trailing-slashes.js
│   │   │   │   │   │   │   ├── strip-trailing-slashes.js.map
│   │   │   │   │   │   │   ├── symlink-error.d.ts.map
│   │   │   │   │   │   │   ├── symlink-error.js
│   │   │   │   │   │   │   ├── symlink-error.js.map
│   │   │   │   │   │   │   ├── types.d.ts.map
│   │   │   │   │   │   │   ├── types.js
│   │   │   │   │   │   │   ├── types.js.map
│   │   │   │   │   │   │   ├── unpack.d.ts.map
│   │   │   │   │   │   │   ├── unpack.js
│   │   │   │   │   │   │   ├── unpack.js.map
│   │   │   │   │   │   │   ├── update.d.ts.map
│   │   │   │   │   │   │   ├── update.js
│   │   │   │   │   │   │   ├── update.js.map
│   │   │   │   │   │   │   ├── warn-method.d.ts.map
│   │   │   │   │   │   │   ├── warn-method.js
│   │   │   │   │   │   │   ├── warn-method.js.map
│   │   │   │   │   │   │   ├── winchars.d.ts.map
│   │   │   │   │   │   │   ├── winchars.js
│   │   │   │   │   │   │   ├── winchars.js.map
│   │   │   │   │   │   │   ├── write-entry.d.ts.map
│   │   │   │   │   │   │   ├── write-entry.js
│   │   │   │   │   │   │   └── write-entry.js.map
│   │   │   │   │   │   └── esm
│   │   │   │   │   │       ├── create.d.ts.map
│   │   │   │   │   │       ├── create.js
│   │   │   │   │   │       ├── create.js.map
│   │   │   │   │   │       ├── cwd-error.d.ts.map
│   │   │   │   │   │       ├── cwd-error.js
│   │   │   │   │   │       ├── cwd-error.js.map
│   │   │   │   │   │       ├── extract.d.ts.map
│   │   │   │   │   │       ├── extract.js
│   │   │   │   │   │       ├── extract.js.map
│   │   │   │   │   │       ├── get-write-flag.d.ts.map
│   │   │   │   │   │       ├── get-write-flag.js
│   │   │   │   │   │       ├── get-write-flag.js.map
│   │   │   │   │   │       ├── header.d.ts.map
│   │   │   │   │   │       ├── header.js
│   │   │   │   │   │       ├── header.js.map
│   │   │   │   │   │       ├── index.d.ts.map
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── index.js.map
│   │   │   │   │   │       ├── index.min.js
│   │   │   │   │   │       ├── index.min.js.map
│   │   │   │   │   │       ├── large-numbers.d.ts.map
│   │   │   │   │   │       ├── large-numbers.js
│   │   │   │   │   │       ├── large-numbers.js.map
│   │   │   │   │   │       ├── list.d.ts.map
│   │   │   │   │   │       ├── list.js
│   │   │   │   │   │       ├── list.js.map
│   │   │   │   │   │       ├── make-command.d.ts.map
│   │   │   │   │   │       ├── make-command.js
│   │   │   │   │   │       ├── make-command.js.map
│   │   │   │   │   │       ├── mkdir.d.ts.map
│   │   │   │   │   │       ├── mkdir.js
│   │   │   │   │   │       ├── mkdir.js.map
│   │   │   │   │   │       ├── mode-fix.d.ts.map
│   │   │   │   │   │       ├── mode-fix.js
│   │   │   │   │   │       ├── mode-fix.js.map
│   │   │   │   │   │       ├── normalize-unicode.d.ts.map
│   │   │   │   │   │       ├── normalize-unicode.js
│   │   │   │   │   │       ├── normalize-unicode.js.map
│   │   │   │   │   │       ├── normalize-windows-path.d.ts.map
│   │   │   │   │   │       ├── normalize-windows-path.js
│   │   │   │   │   │       ├── normalize-windows-path.js.map
│   │   │   │   │   │       ├── options.d.ts.map
│   │   │   │   │   │       ├── options.js
│   │   │   │   │   │       ├── options.js.map
│   │   │   │   │   │       ├── package.json
│   │   │   │   │   │       ├── pack.d.ts.map
│   │   │   │   │   │       ├── pack.js
│   │   │   │   │   │       ├── pack.js.map
│   │   │   │   │   │       ├── parse.d.ts.map
│   │   │   │   │   │       ├── parse.js
│   │   │   │   │   │       ├── parse.js.map
│   │   │   │   │   │       ├── path-reservations.d.ts.map
│   │   │   │   │   │       ├── path-reservations.js
│   │   │   │   │   │       ├── path-reservations.js.map
│   │   │   │   │   │       ├── pax.d.ts.map
│   │   │   │   │   │       ├── pax.js
│   │   │   │   │   │       ├── pax.js.map
│   │   │   │   │   │       ├── process-umask.d.ts.map
│   │   │   │   │   │       ├── process-umask.js
│   │   │   │   │   │       ├── process-umask.js.map
│   │   │   │   │   │       ├── read-entry.d.ts.map
│   │   │   │   │   │       ├── read-entry.js
│   │   │   │   │   │       ├── read-entry.js.map
│   │   │   │   │   │       ├── replace.d.ts.map
│   │   │   │   │   │       ├── replace.js
│   │   │   │   │   │       ├── replace.js.map
│   │   │   │   │   │       ├── strip-absolute-path.d.ts.map
│   │   │   │   │   │       ├── strip-absolute-path.js
│   │   │   │   │   │       ├── strip-absolute-path.js.map
│   │   │   │   │   │       ├── strip-trailing-slashes.d.ts.map
│   │   │   │   │   │       ├── strip-trailing-slashes.js
│   │   │   │   │   │       ├── strip-trailing-slashes.js.map
│   │   │   │   │   │       ├── symlink-error.d.ts.map
│   │   │   │   │   │       ├── symlink-error.js
│   │   │   │   │   │       ├── symlink-error.js.map
│   │   │   │   │   │       ├── types.d.ts.map
│   │   │   │   │   │       ├── types.js
│   │   │   │   │   │       ├── types.js.map
│   │   │   │   │   │       ├── unpack.d.ts.map
│   │   │   │   │   │       ├── unpack.js
│   │   │   │   │   │       ├── unpack.js.map
│   │   │   │   │   │       ├── update.d.ts.map
│   │   │   │   │   │       ├── update.js
│   │   │   │   │   │       ├── update.js.map
│   │   │   │   │   │       ├── warn-method.d.ts.map
│   │   │   │   │   │       ├── warn-method.js
│   │   │   │   │   │       ├── warn-method.js.map
│   │   │   │   │   │       ├── winchars.d.ts.map
│   │   │   │   │   │       ├── winchars.js
│   │   │   │   │   │       ├── winchars.js.map
│   │   │   │   │   │       ├── write-entry.d.ts.map
│   │   │   │   │   │       ├── write-entry.js
│   │   │   │   │   │       └── write-entry.js.map
│   │   │   │   │   └── package.json
│   │   │   │   ├── tinyglobby
│   │   │   │   │   ├── dist
│   │   │   │   │   │   ├── index.cjs
│   │   │   │   │   │   ├── index.d.cts
│   │   │   │   │   │   ├── index.d.mts
│   │   │   │   │   │   └── index.mjs
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── unique-filename
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── unique-slug
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── v8-compile-cache
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   ├── package.json
│   │   │   │   │   └── v8-compile-cache.js
│   │   │   │   ├── which
│   │   │   │   │   ├── bin
│   │   │   │   │   │   └── which.js
│   │   │   │   │   ├── lib
│   │   │   │   │   │   └── index.js
│   │   │   │   │   ├── LICENSE
│   │   │   │   │   └── package.json
│   │   │   │   ├── wrap-ansi
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   └── package.json
│   │   │   │   ├── wrap-ansi-cjs
│   │   │   │   │   ├── index.js
│   │   │   │   │   ├── license
│   │   │   │   │   ├── node_modules
│   │   │   │   │   │   ├── ansi-regex
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── license
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   ├── ansi-styles
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── license
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   ├── emoji-regex
│   │   │   │   │   │   │   ├── es2015
│   │   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   │   └── text.js
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── LICENSE-MIT.txt
│   │   │   │   │   │   │   ├── package.json
│   │   │   │   │   │   │   └── text.js
│   │   │   │   │   │   ├── string-width
│   │   │   │   │   │   │   ├── index.js
│   │   │   │   │   │   │   ├── license
│   │   │   │   │   │   │   └── package.json
│   │   │   │   │   │   └── strip-ansi
│   │   │   │   │   │       ├── index.js
│   │   │   │   │   │       ├── license
│   │   │   │   │   │       └── package.json
│   │   │   │   │   └── package.json
│   │   │   │   └── yallist
│   │   │   │       ├── dist
│   │   │   │       │   ├── commonjs
│   │   │   │       │   │   ├── index.d.ts.map
│   │   │   │       │   │   ├── index.js
│   │   │   │       │   │   ├── index.js.map
│   │   │   │       │   │   └── package.json
│   │   │   │       │   └── esm
│   │   │   │       │       ├── index.d.ts.map
│   │   │   │       │       ├── index.js
│   │   │   │       │       ├── index.js.map
│   │   │   │       │       └── package.json
│   │   │   │       └── package.json
│   │   │   ├── pnpm.cjs
│   │   │   ├── pnpmrc
│   │   │   ├── reflink.darwin-arm64-2HJ4WGO6.node
│   │   │   ├── reflink.darwin-x64-3G3H6IW4.node
│   │   │   ├── reflink.win32-arm64-msvc-Q6BARPPB.node
│   │   │   ├── reflink.win32-x64-msvc-J2TZHRQI.node
│   │   │   ├── templates
│   │   │   │   ├── completion.bash
│   │   │   │   ├── completion.fish
│   │   │   │   ├── completion.ps1
│   │   │   │   └── completion.zsh
│   │   │   ├── vendor
│   │   │   │   ├── fastlist-0.3.0-x64.exe
│   │   │   │   └── fastlist-0.3.0-x86.exe
│   │   │   └── worker.js
│   │   ├── LICENSE
│   │   ├── package.json
│   │   └── README.md
│   └── process
│       ├── browser.js
│       ├── index.js
│       ├── LICENSE
│       ├── package.json
│       ├── README.md
│       └── test.js
├── package.json
├── package-lock.json
├── packages
│   ├── contracts
│   │   └── src
│   │       ├── agendas.ts
│   │       ├── amendments.ts
│   │       ├── governance-bodies.ts
│   │       ├── index.ts
│   │       ├── offices.ts
│   │       ├── proposals.ts
│   │       └── sessions.ts
│   ├── domain
│   │   └── src
│   │       ├── enums.ts
│   │       └── types.ts
│   ├── gov-client
│   │   ├── README.md
│   │   └── src
│   │       ├── agendas.ts
│   │       ├── amendments.ts
│   │       ├── governance-bodies.ts
│   │       ├── index.ts
│   │       ├── offices.ts
│   │       ├── proposals.ts
│   │       └── sessions.ts
│   └── workflows
│       └── src
│           ├── amendment.ts
│           └── index.ts
├── pnpm-workspace.yaml
├── prisma
│   ├── prisma.schema
│   ├── prisma.schema.first-pass
│   └── schema.prisma
├── tools
│   ├── codegen
│   │   └── generate-client.sh
│   ├── context-compiler
│   │   └── compile_context.py
│   ├── docs-engine
│   │   ├── dist
│   │   │   ├── analyzers
│   │   │   │   ├── build-impact-report.d.ts
│   │   │   │   ├── build-impact-report.js
│   │   │   │   ├── build-impact-report.js.map
│   │   │   │   ├── detect-adr-candidate.d.ts
│   │   │   │   ├── detect-adr-candidate.js
│   │   │   │   ├── detect-adr-candidate.js.map
│   │   │   │   ├── detect-drift.d.ts
│   │   │   │   ├── detect-drift.js
│   │   │   │   ├── detect-drift.js.map
│   │   │   │   ├── impact-rules.d.ts
│   │   │   │   ├── impact-rules.js
│   │   │   │   ├── impact-rules.js.map
│   │   │   │   ├── map-file-to-docs.d.ts
│   │   │   │   ├── map-file-to-docs.js
│   │   │   │   └── map-file-to-docs.js.map
│   │   │   ├── cli
│   │   │   │   ├── command-changelog.d.ts
│   │   │   │   ├── command-changelog.js
│   │   │   │   ├── command-changelog.js.map
│   │   │   │   ├── command-compile-ai.d.ts
│   │   │   │   ├── command-compile-ai.js
│   │   │   │   ├── command-compile-ai.js.map
│   │   │   │   ├── command-impact.d.ts
│   │   │   │   ├── command-impact.js
│   │   │   │   ├── command-impact.js.map
│   │   │   │   ├── command-inventory.d.ts
│   │   │   │   ├── command-inventory.js
│   │   │   │   ├── command-inventory.js.map
│   │   │   │   ├── command-manifest.d.ts
│   │   │   │   ├── command-manifest.js
│   │   │   │   ├── command-manifest.js.map
│   │   │   │   ├── command-tutorial-draft.d.ts
│   │   │   │   ├── command-tutorial-draft.js
│   │   │   │   ├── command-tutorial-draft.js.map
│   │   │   │   ├── command-validate.d.ts
│   │   │   │   ├── command-validate.js
│   │   │   │   ├── command-validate.js.map
│   │   │   │   ├── command-watch.d.ts
│   │   │   │   ├── command-watch.js
│   │   │   │   ├── command-watch.js.map
│   │   │   │   ├── main.d.ts
│   │   │   │   ├── main.js
│   │   │   │   └── main.js.map
│   │   │   ├── compilers
│   │   │   │   ├── compile-architecture-summary.d.ts
│   │   │   │   ├── compile-architecture-summary.js
│   │   │   │   ├── compile-architecture-summary.js.map
│   │   │   │   ├── compile-current-state-summary.d.ts
│   │   │   │   ├── compile-current-state-summary.js
│   │   │   │   ├── compile-current-state-summary.js.map
│   │   │   │   ├── compile-entity-inventory.d.ts
│   │   │   │   ├── compile-entity-inventory.js
│   │   │   │   ├── compile-entity-inventory.js.map
│   │   │   │   ├── compile-known-gaps.d.ts
│   │   │   │   ├── compile-known-gaps.js
│   │   │   │   ├── compile-known-gaps.js.map
│   │   │   │   ├── compile-project-context.d.ts
│   │   │   │   ├── compile-project-context.js
│   │   │   │   ├── compile-project-context.js.map
│   │   │   │   ├── compile-repo-blueprint.d.ts
│   │   │   │   ├── compile-repo-blueprint.js
│   │   │   │   ├── compile-repo-blueprint.js.map
│   │   │   │   ├── compile-route-inventory.d.ts
│   │   │   │   ├── compile-route-inventory.js
│   │   │   │   ├── compile-route-inventory.js.map
│   │   │   │   ├── write-ai-context.d.ts
│   │   │   │   ├── write-ai-context.js
│   │   │   │   └── write-ai-context.js.map
│   │   │   ├── config
│   │   │   │   ├── defaults.d.ts
│   │   │   │   ├── defaults.js
│   │   │   │   ├── defaults.js.map
│   │   │   │   ├── docs-engine.config.schema.json
│   │   │   │   ├── load-config.d.ts
│   │   │   │   ├── load-config.js
│   │   │   │   └── load-config.js.map
│   │   │   ├── generators
│   │   │   │   ├── generate-blog-draft.d.ts
│   │   │   │   ├── generate-blog-draft.js
│   │   │   │   ├── generate-blog-draft.js.map
│   │   │   │   ├── generate-changelog-entry.d.ts
│   │   │   │   ├── generate-changelog-entry.js
│   │   │   │   ├── generate-changelog-entry.js.map
│   │   │   │   ├── generate-journal-entry.d.ts
│   │   │   │   ├── generate-journal-entry.js
│   │   │   │   ├── generate-journal-entry.js.map
│   │   │   │   ├── generate-release-note.d.ts
│   │   │   │   ├── generate-release-note.js
│   │   │   │   ├── generate-release-note.js.map
│   │   │   │   ├── generate-tutorial-draft.d.ts
│   │   │   │   ├── generate-tutorial-draft.js
│   │   │   │   └── generate-tutorial-draft.js.map
│   │   │   ├── index.d.ts
│   │   │   ├── index.js
│   │   │   ├── index.js.map
│   │   │   ├── inventory
│   │   │   │   ├── build-inventory.d.ts
│   │   │   │   ├── build-inventory.js
│   │   │   │   ├── build-inventory.js.map
│   │   │   │   ├── scan-api.d.ts
│   │   │   │   ├── scan-api.js
│   │   │   │   ├── scan-api.js.map
│   │   │   │   ├── scan-db.d.ts
│   │   │   │   ├── scan-db.js
│   │   │   │   ├── scan-db.js.map
│   │   │   │   ├── scan-docs.d.ts
│   │   │   │   ├── scan-docs.js
│   │   │   │   ├── scan-docs.js.map
│   │   │   │   ├── scan-env.d.ts
│   │   │   │   ├── scan-env.js
│   │   │   │   ├── scan-env.js.map
│   │   │   │   ├── scan-repo.d.ts
│   │   │   │   ├── scan-repo.js
│   │   │   │   ├── scan-repo.js.map
│   │   │   │   ├── scan-routes.d.ts
│   │   │   │   ├── scan-routes.js
│   │   │   │   └── scan-routes.js.map
│   │   │   ├── manifests
│   │   │   │   ├── build-manifest.d.ts
│   │   │   │   ├── build-manifest.js
│   │   │   │   ├── build-manifest.js.map
│   │   │   │   ├── classify-change.d.ts
│   │   │   │   ├── classify-change.js
│   │   │   │   ├── classify-change.js.map
│   │   │   │   ├── diff-files.d.ts
│   │   │   │   ├── diff-files.js
│   │   │   │   ├── diff-files.js.map
│   │   │   │   ├── write-manifest.d.ts
│   │   │   │   ├── write-manifest.js
│   │   │   │   └── write-manifest.js.map
│   │   │   ├── schemas
│   │   │   │   └── change-manifest.schema.json
│   │   │   ├── shared
│   │   │   │   ├── dates.d.ts
│   │   │   │   ├── dates.js
│   │   │   │   ├── dates.js.map
│   │   │   │   ├── fs.d.ts
│   │   │   │   ├── fs.js
│   │   │   │   ├── fs.js.map
│   │   │   │   ├── json.d.ts
│   │   │   │   ├── json.js
│   │   │   │   ├── json.js.map
│   │   │   │   ├── logging.d.ts
│   │   │   │   ├── logging.js
│   │   │   │   ├── logging.js.map
│   │   │   │   ├── markdown.d.ts
│   │   │   │   ├── markdown.js
│   │   │   │   ├── markdown.js.map
│   │   │   │   ├── paths.d.ts
│   │   │   │   ├── paths.js
│   │   │   │   ├── paths.js.map
│   │   │   │   ├── types.d.ts
│   │   │   │   ├── types.js
│   │   │   │   └── types.js.map
│   │   │   └── validators
│   │   │       ├── validate-ai-context.d.ts
│   │   │       ├── validate-ai-context.js
│   │   │       ├── validate-ai-context.js.map
│   │   │       ├── validate-doc-coverage.d.ts
│   │   │       ├── validate-doc-coverage.js
│   │   │       ├── validate-doc-coverage.js.map
│   │   │       ├── validate-links.d.ts
│   │   │       ├── validate-links.js
│   │   │       ├── validate-links.js.map
│   │   │       ├── validate-manifests.d.ts
│   │   │       ├── validate-manifests.js
│   │   │       ├── validate-manifests.js.map
│   │   │       ├── validate-references.d.ts
│   │   │       ├── validate-references.js
│   │   │       ├── validate-references.js.map
│   │   │       ├── validate-required-docs.d.ts
│   │   │       ├── validate-required-docs.js
│   │   │       ├── validate-required-docs.js.map
│   │   │       ├── validate-source-of-truth.d.ts
│   │   │       ├── validate-source-of-truth.js
│   │   │       └── validate-source-of-truth.js.map
│   │   ├── node_modules
│   │   │   ├── ajv -> .pnpm/ajv@8.18.0/node_modules/ajv
│   │   │   ├── chokidar -> .pnpm/chokidar@4.0.3/node_modules/chokidar
│   │   │   ├── commander -> .pnpm/commander@13.1.0/node_modules/commander
│   │   │   ├── fast-glob -> .pnpm/fast-glob@3.3.3/node_modules/fast-glob
│   │   │   ├── tsx -> .pnpm/tsx@4.21.0/node_modules/tsx
│   │   │   ├── @types
│   │   │   │   └── node -> ../.pnpm/@types+node@22.19.15/node_modules/@types/node
│   │   │   └── typescript -> .pnpm/typescript@5.9.3/node_modules/typescript
│   │   ├── package.json
│   │   ├── pnpm-lock.yaml
│   │   ├── README.md
│   │   ├── snapshots
│   │   │   └── README.md
│   │   ├── src
│   │   │   ├── analyzers
│   │   │   │   ├── build-impact-report.ts
│   │   │   │   ├── detect-adr-candidate.ts
│   │   │   │   ├── detect-drift.ts
│   │   │   │   ├── impact-rules.ts
│   │   │   │   └── map-file-to-docs.ts
│   │   │   ├── cli
│   │   │   │   ├── command-changelog.ts
│   │   │   │   ├── command-compile-ai.ts
│   │   │   │   ├── command-impact.ts
│   │   │   │   ├── command-inventory.ts
│   │   │   │   ├── command-manifest.ts
│   │   │   │   ├── command-tutorial-draft.ts
│   │   │   │   ├── command-validate.ts
│   │   │   │   ├── command-watch.ts
│   │   │   │   └── main.ts
│   │   │   ├── compilers
│   │   │   │   ├── compile-architecture-summary.ts
│   │   │   │   ├── compile-current-state-summary.ts
│   │   │   │   ├── compile-entity-inventory.ts
│   │   │   │   ├── compile-known-gaps.ts
│   │   │   │   ├── compile-project-context.ts
│   │   │   │   ├── compile-repo-blueprint.ts
│   │   │   │   ├── compile-route-inventory.ts
│   │   │   │   └── write-ai-context.ts
│   │   │   ├── config
│   │   │   │   ├── defaults.ts
│   │   │   │   ├── docs-engine.config.schema.json
│   │   │   │   └── load-config.ts
│   │   │   ├── generators
│   │   │   │   ├── generate-blog-draft.ts
│   │   │   │   ├── generate-changelog-entry.ts
│   │   │   │   ├── generate-journal-entry.ts
│   │   │   │   ├── generate-release-note.ts
│   │   │   │   └── generate-tutorial-draft.ts
│   │   │   ├── index.ts
│   │   │   ├── inventory
│   │   │   │   ├── build-inventory.ts
│   │   │   │   ├── scan-api.ts
│   │   │   │   ├── scan-db.ts
│   │   │   │   ├── scan-docs.ts
│   │   │   │   ├── scan-env.ts
│   │   │   │   ├── scan-repo.ts
│   │   │   │   └── scan-routes.ts
│   │   │   ├── manifests
│   │   │   │   ├── build-manifest.ts
│   │   │   │   ├── classify-change.ts
│   │   │   │   ├── diff-files.ts
│   │   │   │   └── write-manifest.ts
│   │   │   ├── output
│   │   │   │   └── README.md
│   │   │   ├── schemas
│   │   │   │   ├── change-manifest.schema.json
│   │   │   │   ├── docs-index.schema.json
│   │   │   │   ├── impact-report.schema.json
│   │   │   │   └── repo-inventory.schema.json
│   │   │   ├── shared
│   │   │   │   ├── dates.ts
│   │   │   │   ├── fs.ts
│   │   │   │   ├── json.ts
│   │   │   │   ├── logging.ts
│   │   │   │   ├── markdown.ts
│   │   │   │   ├── paths.ts
│   │   │   │   └── types.ts
│   │   │   ├── templates
│   │   │   │   ├── adr-template.md
│   │   │   │   ├── blog-template.md
│   │   │   │   ├── changelog-template.md
│   │   │   │   ├── spec-template.md
│   │   │   │   └── tutorial-template.md
│   │   │   └── validators
│   │   │       ├── validate-ai-context.ts
│   │   │       ├── validate-doc-coverage.ts
│   │   │       ├── validate-links.ts
│   │   │       ├── validate-manifests.ts
│   │   │       ├── validate-references.ts
│   │   │       ├── validate-required-docs.ts
│   │   │       └── validate-source-of-truth.ts
│   │   ├── tools
│   │   │   └── docs-engine
│   │   │       └── src
│   │   │           └── output
│   │   │               ├── api-inventory.json
│   │   │               ├── docs-index.json
│   │   │               ├── entity-inventory.json
│   │   │               ├── env-inventory.json
│   │   │               ├── repo-inventory.json
│   │   │               └── route-inventory.json
│   │   └── tsconfig.json
│   ├── migrations
│   │   └── create-migration.sh
│   └── repo-validator
│       └── validate_repo.py
└── tree.md

388 directories, 1808 files
