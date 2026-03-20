# REPO_BLUEPRINT

## Document Status
- Status: Canonical working baseline
- Purpose: define the intended repository structure and ownership boundaries for the Ardtire digital governance platform
- Audience: engineering, architecture, future AI implementation agents

---

## 1. Repo Philosophy

The repository must make architectural boundaries obvious.

A good blueprint should:
- separate deployable applications from shared packages
- separate source-of-truth docs from implementation code
- make domain ownership visible
- reduce accidental coupling
- support phased growth without reorganization churn

---

## 2. Top-Level Structure

```text
.
├── apps
│   ├── web
│   ├── gov-api
│   └── cms
├── packages
│   ├── audit
│   ├── authz
│   ├── config
│   ├── contracts
│   ├── domain
│   ├── gov-client
│   ├── test-helpers
│   ├── ui
│   └── workflows
├── prisma
│   ├── schema.prisma
│   ├── migrations
│   └── seed
├── docs
│   ├── adr
│   ├── ai
│   ├── architecture
│   ├── delivery
│   ├── domain
│   └── runbooks
├── infra
│   ├── docker
│   ├── k8s
│   └── scripts
├── tools
│   ├── codegen
│   ├── lint
│   ├── validation
│   └── scripts
├── .github
│   └── workflows
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── turbo.json
├── .env.example
└── README.md

Below is the canonical finished-project repo shape, followed by a file manifest with the purpose of each file, followed by a complete route inventory.

This is the intended finished-state tree for the Ardtire digital governance platform based on the architecture and implementation direction we have frozen so far. It is the strongest current source-of-truth version, not a claim that every deferred file has already been implemented.


---

1) Complete finished project tree

.
├── .env.example
├── .gitignore
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── prisma.config.ts
├── tsconfig.base.json
├── turbo.json
│
├── .github
│   └── workflows
│       ├── ci.yml
│       ├── typecheck.yml
│       ├── test.yml
│       ├── build.yml
│       ├── preview-deploy.yml
│       └── production-deploy.yml
│
├── apps
│   ├── web
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── vite.config.ts
│   │   ├── vitest.config.ts
│   │   ├── app.config.ts
│   │   ├── public
│   │   │   ├── favicon.ico
│   │   │   ├── robots.txt
│   │   │   ├── site.webmanifest
│   │   │   ├── og-default.png
│   │   │   └── icons
│   │   │       ├── icon-192.png
│   │   │       └── icon-512.png
│   │   └── src
│   │       ├── router.tsx
│   │       ├── routeTree.gen.ts
│   │       ├── styles
│   │       │   ├── global.css
│   │       │   ├── tokens.css
│   │       │   └── utilities.css
│   │       ├── components
│   │       │   ├── layout
│   │       │   │   ├── AppShell.tsx
│   │       │   │   ├── PublicShell.tsx
│   │       │   │   ├── MemberShell.tsx
│   │       │   │   ├── AdminShell.tsx
│   │       │   │   ├── Header.tsx
│   │       │   │   ├── Footer.tsx
│   │       │   │   ├── SideNav.tsx
│   │       │   │   └── Breadcrumbs.tsx
│   │       │   ├── ui
│   │       │   │   ├── Button.tsx
│   │       │   │   ├── Card.tsx
│   │       │   │   ├── Badge.tsx
│   │       │   │   ├── Alert.tsx
│   │       │   │   ├── Input.tsx
│   │       │   │   ├── Textarea.tsx
│   │       │   │   ├── Select.tsx
│   │       │   │   ├── Table.tsx
│   │       │   │   ├── EmptyState.tsx
│   │       │   │   ├── LoadingState.tsx
│   │       │   │   ├── ErrorState.tsx
│   │       │   │   ├── Modal.tsx
│   │       │   │   ├── ConfirmDialog.tsx
│   │       │   │   └── Pagination.tsx
│   │       │   └── auth
│   │       │       ├── AuthGate.tsx
│   │       │       ├── RoleGate.tsx
│   │       │       └── SessionStatus.tsx
│   │       ├── lib
│   │       │   ├── auth
│   │       │   │   ├── session.ts
│   │       │   │   ├── keycloak.ts
│   │       │   │   ├── ensure-session.ts
│   │       │   │   └── claims.ts
│   │       │   ├── api
│   │       │   │   ├── gov-client-server.ts
│   │       │   │   ├── error-mapping.ts
│   │       │   │   └── query-keys.ts
│   │       │   ├── env.ts
│   │       │   ├── seo.ts
│   │       │   ├── formatters.ts
│   │       │   ├── dates.ts
│   │       │   ├── navigation.ts
│   │       │   └── constants.ts
│   │       ├── features
│   │       │   ├── auth
│   │       │   │   ├── server.ts
│   │       │   │   ├── route-access.ts
│   │       │   │   ├── route-access.test.ts
│   │       │   │   ├── AuthHeaderStatus.tsx
│   │       │   │   └── LoginButton.tsx
│   │       │   ├── public
│   │       │   │   ├── cms-pages.ts
│   │       │   │   ├── notices.ts
│   │       │   │   ├── gazette.ts
│   │       │   │   ├── registers.ts
│   │       │   │   └── officer-directory.ts
│   │       │   ├── membership
│   │       │   │   ├── server.ts
│   │       │   │   ├── ApplicantApplicationCard.tsx
│   │       │   │   ├── ApplicantApplicationCard.test.tsx
│   │       │   │   ├── ReviewerApplicationCard.tsx
│   │       │   │   ├── ReviewerApplicationCard.test.tsx
│   │       │   │   ├── MembershipStatusCard.tsx
│   │       │   │   ├── MembershipReviewHistory.tsx
│   │       │   │   └── MembershipAdminTable.tsx
│   │       │   ├── governance-bodies
│   │       │   │   ├── server.ts
│   │       │   │   ├── BodyCard.tsx
│   │       │   │   ├── OfficeCard.tsx
│   │       │   │   ├── OfficeHolderCard.tsx
│   │       │   │   └── SessionCard.tsx
│   │       │   ├── proposals
│   │       │   │   ├── server.ts
│   │       │   │   ├── ProposalCard.tsx
│   │       │   │   ├── ProposalForm.tsx
│   │       │   │   ├── ProposalTimeline.tsx
│   │       │   │   ├── AmendmentCard.tsx
│   │       │   │   └── ProposalAdminActions.tsx
│   │       │   ├── voting
│   │       │   │   ├── server.ts
│   │       │   │   ├── VoteStatusCard.tsx
│   │       │   │   ├── BallotForm.tsx
│   │       │   │   ├── TallySummary.tsx
│   │       │   │   └── OutcomeCard.tsx
│   │       │   ├── records
│   │       │   │   ├── server.ts
│   │       │   │   ├── RecordCard.tsx
│   │       │   │   ├── RecordVersionHistory.tsx
│   │       │   │   └── CertificationBadge.tsx
│   │       │   ├── publications
│   │       │   │   ├── server.ts
│   │       │   │   ├── PublicationCard.tsx
│   │       │   │   ├── GazetteEntryCard.tsx
│   │       │   │   ├── RegisterTable.tsx
│   │       │   │   └── CorrectionNotice.tsx
│   │       │   └── admin
│   │       │       ├── DashboardStats.tsx
│   │       │       ├── ReviewQueue.tsx
│   │       │       ├── AuditEventTable.tsx
│   │       │       ├── PolicyVersionTable.tsx
│   │       │       └── SystemHealthPanel.tsx
│   │       ├── test
│   │       │   ├── setup.ts
│   │       │   ├── helpers.tsx
│   │       │   └── mocks
│   │       │       ├── auth.ts
│   │       │       └── gov-client.ts
│   │       └── routes
│   │           ├── __root.tsx
│   │           ├── index.tsx
│   │           ├── login.tsx
│   │           ├── logout.tsx
│   │           ├── auth
│   │           │   └── callback.tsx
│   │           ├── member.tsx
│   │           ├── member
│   │           │   ├── index.tsx
│   │           │   ├── applications.tsx
│   │           │   ├── status.tsx
│   │           │   ├── notices.tsx
│   │           │   ├── proposals.tsx
│   │           │   ├── proposals.$proposalId.tsx
│   │           │   ├── votes.$voteId.tsx
│   │           │   ├── records.tsx
│   │           │   └── publications.tsx
│   │           ├── admin.tsx
│   │           ├── admin
│   │           │   ├── index.tsx
│   │           │   ├── membership-applications.tsx
│   │           │   ├── memberships.tsx
│   │           │   ├── governance-bodies.tsx
│   │           │   ├── offices.tsx
│   │           │   ├── office-assignments.tsx
│   │           │   ├── sessions.tsx
│   │           │   ├── agendas.tsx
│   │           │   ├── proposals.tsx
│   │           │   ├── proposals.new.tsx
│   │           │   ├── proposals.$proposalId.tsx
│   │           │   ├── amendments.tsx
│   │           │   ├── votes.tsx
│   │           │   ├── outcomes.tsx
│   │           │   ├── records.tsx
│   │           │   ├── publications.tsx
│   │           │   ├── policy-versions.tsx
│   │           │   ├── audit-events.tsx
│   │           │   └── system.tsx
│   │           ├── governance
│   │           │   ├── index.tsx
│   │           │   ├── bodies.tsx
│   │           │   ├── bodies.$bodySlug.tsx
│   │           │   ├── offices.tsx
│   │           │   ├── officers.tsx
│   │           │   ├── proposals.tsx
│   │           │   ├── proposals.$proposalId.tsx
│   │           │   ├── sessions.tsx
│   │           │   ├── records.tsx
│   │           │   └── publications.tsx
│   │           ├── registers
│   │           │   ├── index.tsx
│   │           │   ├── offices.tsx
│   │           │   ├── office-holders.tsx
│   │           │   ├── outcomes.tsx
│   │           │   ├── notices.tsx
│   │           │   ├── policies.tsx
│   │           │   └── records.$recordId.tsx
│   │           ├── gazette
│   │           │   ├── index.tsx
│   │           │   └── $publicationId.tsx
│   │           ├── notices
│   │           │   ├── index.tsx
│   │           │   └── $noticeSlug.tsx
│   │           ├── pages
│   │           │   └── $slug.tsx
│   │           └── legal
│   │               ├── privacy.tsx
│   │               ├── terms.tsx
│   │               └── accessibility.tsx
│   │
│   ├── gov-api
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── app.ts
│   │       ├── bootstrap
│   │       │   ├── env.ts
│   │       │   └── services.ts
│   │       ├── lib
│   │       │   ├── prisma.ts
│   │       │   ├── logger.ts
│   │       │   ├── clock.ts
│   │       │   ├── ids.ts
│   │       │   └── errors.ts
│   │       ├── auth
│   │       │   ├── verify-keycloak-access-token.ts
│   │       │   ├── actor-context.ts
│   │       │   └── permissions.ts
│   │       ├── audit
│   │       │   ├── emit-audit-event.ts
│   │       │   ├── audit-metadata.ts
│   │       │   └── audit.test.ts
│   │       ├── repositories
│   │       │   ├── membership-repository.ts
│   │       │   ├── governance-bodies-repository.ts
│   │       │   ├── offices-repository.ts
│   │       │   ├── sessions-repository.ts
│   │       │   ├── proposals-repository.ts
│   │       │   ├── votes-repository.ts
│   │       │   ├── outcomes-repository.ts
│   │       │   ├── records-repository.ts
│   │       │   ├── publications-repository.ts
│   │       │   └── policies-repository.ts
│   │       ├── membership-applications
│   │       │   ├── repository.ts
│   │       │   ├── service.ts
│   │       │   ├── policy.ts
│   │       │   ├── transitions.ts
│   │       │   └── http.integration.test.ts
│   │       ├── memberships
│   │       │   ├── service.ts
│   │       │   ├── policy.ts
│   │       │   └── transitions.ts
│   │       ├── governance-bodies
│   │       │   ├── service.ts
│   │       │   └── policy.ts
│   │       ├── offices
│   │       │   ├── service.ts
│   │       │   ├── assignments-service.ts
│   │       │   └── policy.ts
│   │       ├── sessions
│   │       │   ├── service.ts
│   │       │   ├── agendas-service.ts
│   │       │   └── policy.ts
│   │       ├── proposals
│   │       │   ├── service.ts
│   │       │   ├── amendments-service.ts
│   │       │   ├── policy.ts
│   │       │   ├── transitions.ts
│   │       │   └── proposal.integration.test.ts
│   │       ├── votes
│   │       │   ├── service.ts
│   │       │   ├── ballots-service.ts
│   │       │   ├── tally-service.ts
│   │       │   ├── policy.ts
│   │       │   └── vote.integration.test.ts
│   │       ├── outcomes
│   │       │   ├── service.ts
│   │       │   ├── certification-service.ts
│   │       │   └── policy.ts
│   │       ├── records
│   │       │   ├── service.ts
│   │       │   ├── versions-service.ts
│   │       │   ├── certification-service.ts
│   │       │   └── record.integration.test.ts
│   │       ├── publications
│   │       │   ├── service.ts
│   │       │   ├── notices-service.ts
│   │       │   ├── gazette-service.ts
│   │       │   ├── registers-service.ts
│   │       │   └── publication.integration.test.ts
│   │       ├── policies
│   │       │   ├── service.ts
│   │       │   ├── evaluator.ts
│   │       │   └── policy-version.integration.test.ts
│   │       ├── queries
│   │       │   ├── membership-queries.ts
│   │       │   ├── governance-queries.ts
│   │       │   ├── proposal-queries.ts
│   │       │   ├── vote-queries.ts
│   │       │   ├── record-queries.ts
│   │       │   └── publication-queries.ts
│   │       ├── jobs
│   │       │   ├── index.ts
│   │       │   ├── publication-projection-job.ts
│   │       │   ├── notification-job.ts
│   │       │   └── stale-review-reminder-job.ts
│   │       └── http
│   │           ├── types.ts
│   │           ├── middleware
│   │           │   ├── request-id.ts
│   │           │   ├── auth-context.ts
│   │           │   ├── dev-actor-provisioning.ts
│   │           │   ├── error-handler.ts
│   │           │   └── audit-context.ts
│   │           ├── presenters
│   │           │   ├── membership-presenters.ts
│   │           │   ├── governance-presenters.ts
│   │           │   ├── proposal-presenters.ts
│   │           │   ├── vote-presenters.ts
│   │           │   ├── record-presenters.ts
│   │           │   └── publication-presenters.ts
│   │           └── routes
│   │               ├── health.ts
│   │               ├── auth-context.ts
│   │               ├── membership-applications.ts
│   │               ├── memberships.ts
│   │               ├── governance-bodies.ts
│   │               ├── offices.ts
│   │               ├── sessions.ts
│   │               ├── agendas.ts
│   │               ├── proposals.ts
│   │               ├── amendments.ts
│   │               ├── votes.ts
│   │               ├── outcomes.ts
│   │               ├── records.ts
│   │               ├── publications.ts
│   │               ├── policies.ts
│   │               └── audit.ts
│   │
│   └── cms
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.mjs
│       ├── payload.config.ts
│       └── src
│           ├── payload-types.ts
│           ├── access
│           │   ├── isAuthenticated.ts
│           │   ├── isEditor.ts
│           │   ├── isAdmin.ts
│           │   └── editorOrAdmin.ts
│           ├── collections
│           │   ├── Users.ts
│           │   ├── Pages.ts
│           │   ├── Posts.ts
│           │   ├── Notices.ts
│           │   ├── GazetteEntries.ts
│           │   ├── OfficerProfiles.ts
│           │   ├── Media.ts
│           │   └── NavigationLinks.ts
│           ├── globals
│           │   ├── SiteSettings.ts
│           │   ├── Homepage.ts
│           │   ├── FooterSettings.ts
│           │   └── AnnouncementBanner.ts
│           ├── fields
│           │   ├── slugField.ts
│           │   ├── seoFields.ts
│           │   ├── richTextField.ts
│           │   └── publicationStateField.ts
│           ├── hooks
│           │   ├── populatePublishedAt.ts
│           │   ├── revalidateFrontend.ts
│           │   └── enforceEditorialRules.ts
│           ├── lib
│           │   ├── env.ts
│           │   ├── keycloak.ts
│           │   └── role-mapping.ts
│           ├── app
│           │   ├── (payload)
│           │   │   └── admin
│           │   │       └── [[...segments]]
│           │   │           └── page.tsx
│           │   ├── api
│           │   │   ├── auth
│           │   │   │   ├── login
│           │   │   │   │   └── route.ts
│           │   │   │   ├── callback
│           │   │   │   │   └── route.ts
│           │   │   │   └── logout
│           │   │   │       └── route.ts
│           │   │   └── payload
│           │   │       └── [...slug]
│           │   │           └── route.ts
│           │   └── layout.tsx
│           └── tests
│               ├── role-mapping.test.ts
│               └── access.test.ts
│
├── packages
│   ├── audit
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── types.ts
│   │       ├── helpers.ts
│   │       └── helpers.test.ts
│   │
│   ├── authz
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── roles.ts
│   │       ├── permissions.ts
│   │       ├── actor.ts
│   │       ├── policy-helpers.ts
│   │       └── permissions.test.ts
│   │
│   ├── config
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── env.ts
│   │       └── env.test.ts
│   │
│   ├── contracts
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── health.ts
│   │       ├── auth-context.ts
│   │       ├── membership-applications.ts
│   │       ├── membership-reviews.ts
│   │       ├── memberships.ts
│   │       ├── governance-bodies.ts
│   │       ├── offices.ts
│   │       ├── sessions.ts
│   │       ├── agendas.ts
│   │       ├── proposals.ts
│   │       ├── amendments.ts
│   │       ├── votes.ts
│   │       ├── outcomes.ts
│   │       ├── records.ts
│   │       ├── publications.ts
│   │       ├── policies.ts
│   │       └── audit.ts
│   │
│   ├── domain
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── enums.ts
│   │       ├── types.ts
│   │       ├── ids.ts
│   │       └── state-machine-types.ts
│   │
│   ├── gov-client
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── http.ts
│   │       ├── membership-applications.ts
│   │       ├── memberships.ts
│   │       ├── governance-bodies.ts
│   │       ├── offices.ts
│   │       ├── sessions.ts
│   │       ├── agendas.ts
│   │       ├── proposals.ts
│   │       ├── amendments.ts
│   │       ├── votes.ts
│   │       ├── outcomes.ts
│   │       ├── records.ts
│   │       ├── publications.ts
│   │       ├── policies.ts
│   │       └── audit.ts
│   │
│   ├── test-helpers
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── factories
│   │       │   ├── users.ts
│   │       │   ├── memberships.ts
│   │       │   ├── proposals.ts
│   │       │   ├── votes.ts
│   │       │   ├── records.ts
│   │       │   └── publications.ts
│   │       ├── fixtures
│   │       │   ├── auth.ts
│   │       │   ├── membership.ts
│   │       │   ├── governance.ts
│   │       │   └── publications.ts
│   │       └── database.ts
│   │
│   ├── ui
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src
│   │       ├── index.ts
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── badge.tsx
│   │       ├── alert.tsx
│   │       ├── table.tsx
│   │       └── empty-state.tsx
│   │
│   └── workflows
│       ├── package.json
│       ├── tsconfig.json
│       └── src
│           ├── index.ts
│           ├── membership-application.ts
│           ├── membership-status.ts
│           ├── proposal.ts
│           ├── amendment.ts
│           ├── vote.ts
│           ├── certification.ts
│           ├── publication.ts
│           ├── office-assignment.ts
│           └── record-version.ts
│
├── prisma
│   ├── schema.prisma
│   ├── seed.ts
│   ├── README.md
│   └── migrations
│       ├── 0001_initial_foundation
│       │   └── migration.sql
│       ├── 0002_membership_domain
│       │   └── migration.sql
│       ├── 0003_governance_structure
│       │   └── migration.sql
│       ├── 0004_proposals_and_voting
│       │   └── migration.sql
│       ├── 0005_records_and_publications
│       │   └── migration.sql
│       └── migration_lock.toml
│
├── generated
│   └── prisma
│       ├── client.ts
│       ├── browser.ts
│       ├── commonInputTypes.ts
│       ├── enums.ts
│       ├── models
│       │   ├── User.ts
│       │   ├── ApplicationRole.ts
│       │   ├── UserRoleAssignment.ts
│       │   ├── MembershipApplication.ts
│       │   ├── MembershipApplicationReview.ts
│       │   ├── MembershipDecision.ts
│       │   ├── MembershipRecord.ts
│       │   ├── MembershipStatusEvent.ts
│       │   ├── GovernanceBody.ts
│       │   ├── GovernanceBodyMembership.ts
│       │   ├── Office.ts
│       │   ├── OfficeAssignment.ts
│       │   ├── GovernanceSession.ts
│       │   ├── AgendaItem.ts
│       │   ├── Proposal.ts
│       │   ├── Amendment.ts
│       │   ├── Vote.ts
│       │   ├── Ballot.ts
│       │   ├── Outcome.ts
│       │   ├── Certification.ts
│       │   ├── Record.ts
│       │   ├── RecordVersion.ts
│       │   ├── Publication.ts
│       │   ├── PolicyDefinition.ts
│       │   ├── PolicyVersion.ts
│       │   └── AuditEvent.ts
│       └── internal
│           └── ...
│
├── docs
│   ├── ai
│   │   ├── PROJECT_CONTEXT.md
│   │   ├── ARCHITECTURE_SUMMARY.md
│   │   ├── REPO_BLUEPRINT.md
│   │   ├── FILE_IMPLEMENTATION_ORDER.md
│   │   └── AI_RULES.md
│   ├── adr
│   │   ├── 001-gov-api-is-canonical.md
│   │   ├── 002-cms-is-not-canonical-state.md
│   │   ├── 003-rule-versions-persisted-on-outcomes.md
│   │   ├── 004-governance-lifecycles-are-state-machines.md
│   │   ├── 005-keycloak-authoritative-authentication.md
│   │   ├── 006-prisma-canonical-schema.md
│   │   ├── 007-web-uses-server-side-app-session.md
│   │   └── 008-dev-auth-fallback-is-non-production-only.md
│   ├── architecture
│   │   ├── API_SPEC.yaml
│   │   ├── BOUNDED_CONTEXTS.md
│   │   ├── SYSTEM_CONTEXT.md
│   │   ├── INTERACTION_DIAGRAM.md
│   │   ├── IDENTITY_AND_ACCESS.md
│   │   ├── AUDIT_AND_OBSERVABILITY.md
│   │   ├── ASYNC_AND_JOBS.md
│   │   ├── CMS_BOUNDARY.md
│   │   ├── DECIDIM_BOUNDARY.md
│   │   ├── DATABASE_STRATEGY.md
│   │   ├── API_CONVENTIONS.md
│   │   └── KEYCLOAK_ROLE_CLAIM_MAPPING.md
│   ├── delivery
│   │   ├── ROADMAP.md
│   │   ├── MILESTONES.md
│   │   ├── TEST_STRATEGY.md
│   │   ├── DEFINITION_OF_DONE.md
│   │   └── RISK_REGISTER.md
│   ├── domain
│   │   ├── DOMAIN_MODEL.md
│   │   ├── AUTHORITY_MODEL.md
│   │   ├── STATE_MACHINES.md
│   │   ├── RECORDS_MODEL.md
│   │   ├── PUBLICATION_MODEL.md
│   │   ├── GOVERNANCE_MODEL.md
│   │   ├── MEMBERSHIP_MODEL.md
│   │   ├── PROPOSAL_LIFECYCLE.md
│   │   ├── VOTING_AND_RATIFICATION.md
│   │   └── PUBLIC_REGISTERS.md
│   └── runbooks
│       ├── LOCAL_DEVELOPMENT.md
│       ├── LOCAL_KEYCLOAK_SETUP.md
│       ├── DEPLOY_WEB.md
│       ├── DEPLOY_GOV_API.md
│       ├── DEPLOY_CMS.md
│       ├── ROTATE_KEYCLOAK_SECRETS.md
│       ├── RUN_DB_MIGRATIONS.md
│       ├── SEED_LOCAL_DATA.md
│       ├── CERTIFY_GOVERNANCE_OUTCOME.md
│       └── PUBLISH_OFFICIAL_RECORD.md
│
├── infra
│   ├── docker
│   │   ├── docker-compose.local.yml
│   │   ├── web.Dockerfile
│   │   ├── gov-api.Dockerfile
│   │   ├── cms.Dockerfile
│   │   └── keycloak.realm.import.json
│   ├── k8s
│   │   ├── namespace.yaml
│   │   ├── web-deployment.yaml
│   │   ├── web-service.yaml
│   │   ├── gov-api-deployment.yaml
│   │   ├── gov-api-service.yaml
│   │   ├── cms-deployment.yaml
│   │   ├── cms-service.yaml
│   │   ├── ingress.yaml
│   │   ├── secrets.example.yaml
│   │   └── configmaps.yaml
│   └── scripts
│       ├── bootstrap-local.sh
│       ├── run-keycloak-local.sh
│       ├── migrate-and-seed.sh
│       ├── reset-local-db.sh
│       └── smoke-test.sh
│
└── tools
    ├── codegen
    │   ├── generate-openapi-types.ts
    │   ├── generate-route-docs.ts
    │   └── generate-seed-snapshots.ts
    ├── lint
    │   ├── eslint.base.mjs
    │   ├── eslint.web.mjs
    │   ├── eslint.api.mjs
    │   └── eslint.cms.mjs
    ├── validation
    │   ├── validate-env.ts
    │   ├── validate-route-coverage.ts
    │   ├── validate-doc-links.ts
    │   └── validate-role-mapping.ts
    └── scripts
        ├── print-tree.ts
        ├── list-routes.ts
        └── check-generated-files.ts



File manifest with purpose of each file
I am grouping this by directory so it remains readable while still covering every file in the tree.
Root
.env.example — canonical environment variable template for all apps and services.
.gitignore — ignored local/build/generated artifacts policy.
README.md — repository overview, setup, architecture entry point, dev commands.
package.json — root workspace scripts and shared dev/runtime dependencies.
pnpm-workspace.yaml — pnpm workspace package discovery.
prisma.config.ts — Prisma 7 config, schema path, migration path, seed command.
tsconfig.base.json — shared TypeScript compiler settings and path aliases.
turbo.json — task graph and caching rules for the monorepo.
.github/workflows
ci.yml — umbrella CI workflow.
typecheck.yml — TypeScript verification workflow.
test.yml — unit/integration test workflow.
build.yml — build verification workflow.
preview-deploy.yml — preview environment deployment workflow.
production-deploy.yml — production deployment workflow.
apps/web
Top-level
package.json — web app dependencies and scripts.
tsconfig.json — app-specific TS config.
vite.config.ts — Vite + TanStack Start + Solid configuration.
vitest.config.ts — web test runner configuration.
app.config.ts — app-level runtime/config wrapper for future centralized web settings.
public
favicon.ico — browser tab icon.
robots.txt — crawler directives.
site.webmanifest — PWA/site metadata.
og-default.png — default social sharing image.
icons/icon-192.png — PWA icon.
icons/icon-512.png — PWA icon.
src/router.tsx
router construction and route tree registration.
src/routeTree.gen.ts
generated TanStack route tree committed to repo.
src/styles
global.css — app-wide base styles.
tokens.css — color/spacing/typography tokens.
utilities.css — utility classes/helpers.
src/components/layout
AppShell.tsx — master page shell component.
PublicShell.tsx — public pages wrapper.
MemberShell.tsx — member route wrapper.
AdminShell.tsx — admin route wrapper.
Header.tsx — top navigation/header.
Footer.tsx — footer.
SideNav.tsx — side navigation for member/admin areas.
Breadcrumbs.tsx — breadcrumb display.
src/components/ui
Button.tsx — reusable button.
Card.tsx — reusable card container.
Badge.tsx — reusable status/label pill.
Alert.tsx — message/notice component.
Input.tsx — reusable text input.
Textarea.tsx — reusable text area.
Select.tsx — reusable select field.
Table.tsx — reusable tabular component.
EmptyState.tsx — empty-state UI.
LoadingState.tsx — loading placeholder.
ErrorState.tsx — error placeholder.
Modal.tsx — modal wrapper.
ConfirmDialog.tsx — destructive/confirm dialog.
Pagination.tsx — pagination control.
src/components/auth
AuthGate.tsx — client-side auth guard helper.
RoleGate.tsx — role-based UI visibility helper.
SessionStatus.tsx — authenticated session status component.
src/lib/auth
session.ts — encrypted app session storage contract.
keycloak.ts — OIDC discovery, auth URL, token exchange/refresh/logout helpers.
ensure-session.ts — refresh-aware session hardening logic.
claims.ts — claim parsing/normalization helpers.
src/lib/api
gov-client-server.ts — server-side authenticated gov-api client creator.
error-mapping.ts — map API failures to UI-safe messages.
query-keys.ts — future query cache keys.
Other src/lib
env.ts — web env parsing/wrapping.
seo.ts — metadata helpers.
formatters.ts — display formatting helpers.
dates.ts — date/time helpers.
navigation.ts — central navigation definitions.
constants.ts — app-level constants.
src/features/auth
server.ts — server functions for login, callback completion, logout, current auth.
route-access.ts — canonical route-access decision helpers.
route-access.test.ts — tests for route-access rules.
AuthHeaderStatus.tsx — header auth display component.
LoginButton.tsx — reusable login CTA.
src/features/public
cms-pages.ts — CMS page loading helpers.
notices.ts — notice loading logic.
gazette.ts — gazette loading logic.
registers.ts — register loading logic.
officer-directory.ts — officer directory loading logic.
src/features/membership
server.ts — membership server functions.
ApplicantApplicationCard.tsx — applicant-facing application card.
ApplicantApplicationCard.test.tsx — tests for applicant card.
ReviewerApplicationCard.tsx — reviewer-facing application card.
ReviewerApplicationCard.test.tsx — tests for reviewer card.
MembershipStatusCard.tsx — current membership summary component.
MembershipReviewHistory.tsx — review-history display component.
MembershipAdminTable.tsx — admin table for memberships.
src/features/governance-bodies
server.ts — governance bodies server functions.
BodyCard.tsx — governance body summary card.
OfficeCard.tsx — office summary card.
OfficeHolderCard.tsx — office holder summary card.
SessionCard.tsx — governance session summary card.
src/features/proposals
server.ts — proposal/amendment server functions.
ProposalCard.tsx — proposal summary card.
ProposalForm.tsx — create/edit form.
ProposalTimeline.tsx — lifecycle timeline display.
AmendmentCard.tsx — amendment display.
ProposalAdminActions.tsx — admin action controls.
src/features/voting
server.ts — vote/outcome server functions.
VoteStatusCard.tsx — vote state summary.
BallotForm.tsx — cast-vote form.
TallySummary.tsx — tally display.
OutcomeCard.tsx — certified/ratified outcome display.
src/features/records
server.ts — records server functions.
RecordCard.tsx — record summary.
RecordVersionHistory.tsx — version lineage UI.
CertificationBadge.tsx — certification display badge.
src/features/publications
server.ts — publications server functions.
PublicationCard.tsx — publication summary.
GazetteEntryCard.tsx — gazette entry display.
RegisterTable.tsx — public register table.
CorrectionNotice.tsx — correction/supersession display.
src/features/admin
DashboardStats.tsx — admin dashboard summary stats.
ReviewQueue.tsx — generic queue UI.
AuditEventTable.tsx — audit event display.
PolicyVersionTable.tsx — policy version display.
SystemHealthPanel.tsx — system status panel.
src/test
setup.ts — test setup.
helpers.tsx — render/helpers for tests.
mocks/auth.ts — auth mocks.
mocks/gov-client.ts — gov-client mocks.
src/routes
Each file is an actual route entry:
__root.tsx — root document and shared route context.
index.tsx — homepage.
login.tsx — login redirect route.
logout.tsx — logout route.
auth/callback.tsx — OIDC callback route.
member.tsx — parent auth guard for member subtree.
member/index.tsx — member landing page.
member/applications.tsx — membership applications page.
member/status.tsx — current membership page.
member/notices.tsx — member-scoped notices.
member/proposals.tsx — member-visible proposals list.
member/proposals.$proposalId.tsx — member-visible proposal detail.
member/votes.$voteId.tsx — member vote detail/ballot route.
member/records.tsx — member-visible records.
member/publications.tsx — member-visible publications.
admin.tsx — parent auth/role guard for admin subtree.
admin/index.tsx — admin dashboard.
admin/membership-applications.tsx — membership review queue.
admin/memberships.tsx — memberships admin view.
admin/governance-bodies.tsx — governance bodies admin page.
admin/offices.tsx — offices admin page.
admin/office-assignments.tsx — office assignment admin page.
admin/sessions.tsx — governance sessions admin page.
admin/agendas.tsx — agendas admin page.
admin/proposals.tsx — proposals admin list.
admin/proposals.new.tsx — create proposal page.
admin/proposals.$proposalId.tsx — proposal admin detail/action page.
admin/amendments.tsx — amendments admin page.
admin/votes.tsx — votes admin page.
admin/outcomes.tsx — outcomes admin page.
admin/records.tsx — records admin page.
admin/publications.tsx — publications admin page.
admin/policy-versions.tsx — policy versions admin page.
admin/audit-events.tsx — audit event admin page.
admin/system.tsx — system/ops page.
governance/index.tsx — public governance landing page.
governance/bodies.tsx — public body list.
governance/bodies.$bodySlug.tsx — body detail.
governance/offices.tsx — office list.
governance/officers.tsx — officer list.
governance/proposals.tsx — public proposal list.
governance/proposals.$proposalId.tsx — public proposal detail.
governance/sessions.tsx — session list.
governance/records.tsx — governance records list.
governance/publications.tsx — governance publications list.
registers/index.tsx — public registers landing page.
registers/offices.tsx — offices register.
registers/office-holders.tsx — office holders register.
registers/outcomes.tsx — official outcomes register.
registers/notices.tsx — notices register.
registers/policies.tsx — policy/rule version register.
registers/records.$recordId.tsx — public record detail.
gazette/index.tsx — gazette index.
gazette/$publicationId.tsx — gazette entry detail.
notices/index.tsx — notices index.
notices/$noticeSlug.tsx — public notice detail.
pages/$slug.tsx — CMS page catch-all by slug.
legal/privacy.tsx — privacy page.
legal/terms.tsx — terms page.
legal/accessibility.tsx — accessibility page.
apps/gov-api
Top-level
package.json — gov-api dependencies/scripts.
tsconfig.json — gov-api TS config.
src/index.ts
server entrypoint.
src/app.ts
Hono app composition.
src/bootstrap
env.ts — gov-api env loading.
services.ts — bootstrapped service wiring.
src/lib
prisma.ts — Prisma client initialization.
logger.ts — structured logging helpers.
clock.ts — centralized time abstraction.
ids.ts — ID generation utilities.
errors.ts — common application errors.
src/auth
verify-keycloak-access-token.ts — JWT verification using Keycloak JWKS.
actor-context.ts — normalized actor context helpers.
permissions.ts — permission bridging helpers.
src/audit
emit-audit-event.ts — centralized audit writing.
audit-metadata.ts — audit metadata helpers.
audit.test.ts — audit tests.
src/repositories
Typed persistence access for each domain:
membership-repository.ts
governance-bodies-repository.ts
offices-repository.ts
sessions-repository.ts
proposals-repository.ts
votes-repository.ts
outcomes-repository.ts
records-repository.ts
publications-repository.ts
policies-repository.ts
Domain service folders
Each contains application-layer business logic, policy, and transitions for that domain:
membership-applications/*
memberships/*
governance-bodies/*
offices/*
sessions/*
proposals/*
votes/*
outcomes/*
records/*
publications/*
policies/*
src/queries
Read-optimized query services by domain.
src/jobs
Background jobs for projections, notifications, reminders.
src/http/middleware
request-id.ts — correlation ID middleware.
auth-context.ts — bearer/dev auth context middleware.
dev-actor-provisioning.ts — optional local auto-provisioning.
error-handler.ts — standardized error formatting.
audit-context.ts — request-scoped audit helpers.
src/http/presenters
Response shaping for domain objects.
src/http/routes
Each file defines the HTTP endpoints for that domain:
health.ts
auth-context.ts
membership-applications.ts
memberships.ts
governance-bodies.ts
offices.ts
sessions.ts
agendas.ts
proposals.ts
amendments.ts
votes.ts
outcomes.ts
records.ts
publications.ts
policies.ts
audit.ts
apps/cms
Top-level
package.json — CMS dependencies/scripts.
tsconfig.json — CMS TS config.
next.config.mjs — Next config for Payload app.
payload.config.ts — Payload root config.
src/payload-types.ts
generated Payload types.
src/access
isAuthenticated.ts — generic authenticated access.
isEditor.ts — editor-only access.
isAdmin.ts — admin-only access.
editorOrAdmin.ts — shared editorial access check.
src/collections
Users.ts — CMS users collection.
Pages.ts — general site pages.
Posts.ts — editorial posts/news.
Notices.ts — editorial notices.
GazetteEntries.ts — editorial gazette support content.
OfficerProfiles.ts — officer biography/profile content.
Media.ts — uploaded assets/media.
NavigationLinks.ts — navigational entries.
src/globals
SiteSettings.ts — sitewide settings.
Homepage.ts — homepage configuration.
FooterSettings.ts — footer configuration.
AnnouncementBanner.ts — sitewide banner config.
src/fields
Reusable Payload field definitions.
src/hooks
populatePublishedAt.ts — publish timestamp helper.
revalidateFrontend.ts — trigger frontend revalidation.
enforceEditorialRules.ts — editorial-state guard logic.
src/lib
env.ts — CMS env parsing.
keycloak.ts — future CMS Keycloak integration helpers.
role-mapping.ts — Keycloak-to-editorial role mapping.
src/app
(payload)/admin/.../page.tsx — Payload admin UI route.
api/auth/login/route.ts — CMS login entrypoint.
api/auth/callback/route.ts — CMS auth callback.
api/auth/logout/route.ts — CMS logout.
api/payload/[...slug]/route.ts — Payload API route.
layout.tsx — Next app layout.
src/tests
role-mapping.test.ts — CMS role mapping tests.
access.test.ts — CMS access policy tests.

packages
audit
Cross-app audit types and helper utilities.
authz
Canonical roles, permissions, actor context, policy helpers.
config
Zod-backed env parsing and configuration helpers.
contracts
Shared DTO and validation schemas for all API surfaces/domains.
domain
Shared enums/types/ID/state-machine vocabulary.
gov-client
Typed client wrappers for gov-api endpoints.
test-helpers
Factories, fixtures, and database test helpers.
ui
Shared UI primitives that can be reused by web or future apps.
workflows
Explicit state machine definitions and transition helpers.
prisma
schema.prisma — canonical DB schema.
seed.ts — seed roles, demo users, baseline records.
README.md — DB usage notes.
migrations/*/migration.sql — migration history.
generated/prisma
Committed/generated Prisma client output:
client.ts, browser.ts, commonInputTypes.ts, enums.ts — generated client/runtime files.
models/* — generated model files for each Prisma model.
internal/* — Prisma internal generated support files.
docs
docs/ai
AI/source-of-truth planning packet.
docs/adr
Architecture decisions.
docs/architecture
System, auth, API, database, and boundary docs.
docs/delivery
Roadmap, milestones, tests, risks, done criteria.
docs/domain
Institutional and workflow model docs.
docs/runbooks
Operations/deployment/local-development runbooks.
infra
docker
Local containers, Dockerfiles, Keycloak realm import.
k8s
Kubernetes manifests for deployable services.
scripts
Bootstrap, migration, reset, and smoke-test scripts.
tools
codegen
Project-local codegen tasks.
lint
ESLint config files by target.
validation
Validation scripts for env/routes/docs/roles.
scripts
Repo utility scripts like printing tree/listing routes/checking generated files.
3) Complete list of all routes
I am listing these in three categories:
web application routes
gov-api routes
CMS routes
A. Web application routes
Public routes
/
/login
/logout
/auth/callback
/governance
/governance/bodies
/governance/bodies/:bodySlug
/governance/offices
/governance/officers
/governance/proposals
/governance/proposals/:proposalId
/governance/sessions
/governance/records
/governance/publications
/registers
/registers/offices
/registers/office-holders
/registers/outcomes
/registers/notices
/registers/policies
/registers/records/:recordId
/gazette
/gazette/:publicationId
/notices
/notices/:noticeSlug
/pages/:slug
/legal/privacy
/legal/terms
/legal/accessibility
Authenticated member routes
/member
/member/applications
/member/status
/member/notices
/member/proposals
/member/proposals/:proposalId
/member/votes/:voteId
/member/records
/member/publications
Authenticated admin routes
/admin
/admin/membership-applications
/admin/memberships
/admin/governance-bodies
/admin/offices
/admin/office-assignments
/admin/sessions
/admin/agendas
/admin/proposals
/admin/proposals/new
/admin/proposals/:proposalId
/admin/amendments
/admin/votes
/admin/outcomes
/admin/records
/admin/publications
/admin/policy-versions
/admin/audit-events
/admin/system
B. Governance API routes
Health and auth
GET /health
GET /auth/context
Membership applications
GET /membership-applications
POST /membership-applications
GET /membership-applications/:applicationId
GET /membership-applications/:applicationId/reviews
POST /membership-applications/:applicationId/submit
POST /membership-applications/:applicationId/start-review
POST /membership-applications/:applicationId/return-for-revision
POST /membership-applications/:applicationId/approve
POST /membership-applications/:applicationId/reject
Memberships
GET /memberships
GET /memberships/:membershipId
GET /memberships/me
POST /memberships/:membershipId/suspend
POST /memberships/:membershipId/reinstate
POST /memberships/:membershipId/end
Governance bodies
GET /governance/bodies
POST /governance/bodies
GET /governance/bodies/:bodyId
PATCH /governance/bodies/:bodyId
Offices
GET /offices
POST /offices
GET /offices/:officeId
PATCH /offices/:officeId
POST /offices/:officeId/assignments
POST /offices/assignments/:assignmentId/end
Sessions and agendas
GET /sessions
POST /sessions
GET /sessions/:sessionId
PATCH /sessions/:sessionId
GET /sessions/:sessionId/agendas
POST /sessions/:sessionId/agendas
PATCH /agendas/:agendaItemId
Proposals
GET /proposals
POST /proposals
GET /proposals/:proposalId
PATCH /proposals/:proposalId
POST /proposals/:proposalId/submit
POST /proposals/:proposalId/start-admissibility-review
POST /proposals/:proposalId/admit
POST /proposals/:proposalId/reject
POST /proposals/:proposalId/open-amendment-window
POST /proposals/:proposalId/schedule
POST /proposals/:proposalId/open-vote
POST /proposals/:proposalId/close-vote
POST /proposals/:proposalId/certify
POST /proposals/:proposalId/ratify
POST /proposals/:proposalId/fail
POST /proposals/:proposalId/withdraw
POST /proposals/:proposalId/publish
POST /proposals/:proposalId/archive
Amendments
GET /amendments
POST /amendments
GET /amendments/:amendmentId
PATCH /amendments/:amendmentId
POST /amendments/:amendmentId/submit
POST /amendments/:amendmentId/start-review
POST /amendments/:amendmentId/accept
POST /amendments/:amendmentId/reject
POST /amendments/:amendmentId/incorporate
POST /amendments/:amendmentId/withdraw
Votes and ballots
GET /votes
GET /votes/:voteId
POST /votes/:voteId/cast
POST /votes/:voteId/open
POST /votes/:voteId/close
POST /votes/:voteId/tally
POST /votes/:voteId/certify
POST /votes/:voteId/void
Outcomes
GET /outcomes
GET /outcomes/:outcomeId
POST /outcomes/:outcomeId/certify
POST /outcomes/:outcomeId/ratify
POST /outcomes/:outcomeId/fail
POST /outcomes/:outcomeId/withdraw
POST /outcomes/:outcomeId/supersede
POST /outcomes/:outcomeId/archive
Records
GET /records
POST /records
GET /records/:recordId
PATCH /records/:recordId
GET /records/:recordId/versions
POST /records/:recordId/versions
POST /records/:recordId/versions/:versionId/mark-official
POST /records/:recordId/versions/:versionId/certify
POST /records/:recordId/versions/:versionId/publish
POST /records/:recordId/supersede
POST /records/:recordId/archive
Publications
GET /publications
POST /publications
GET /publications/:publicationId
POST /publications/:publicationId/publish
POST /publications/:publicationId/withdraw
POST /publications/:publicationId/correct
POST /publications/:publicationId/supersede
POST /publications/:publicationId/archive
Policies
GET /policies
POST /policies
GET /policies/:policyId
GET /policies/versions
POST /policies/:policyId/versions
POST /policies/versions/:policyVersionId/activate
POST /policies/versions/:policyVersionId/supersede
POST /policies/versions/:policyVersionId/archive
Audit
GET /audit/events
C. CMS routes
CMS auth/admin routes
/admin
/api/auth/login
/api/auth/callback
/api/auth/logout
Payload API routes
/api/payload/*
These are CMS-internal/editorial routes, distinct from the public web routes.
4) Practical note on “all and every file”
To be precise, there are three categories here:
Canonical repo files
These should exist in the repository as part of the finished system.
Generated committed files
Example: apps/web/src/routeTree.gen.ts, generated/prisma/*, apps/cms/src/payload-types.ts.
Runtime/build artifacts not meant to live in git
Example: node_modules, build outputs, .next, dist, coverage.
The tree above includes the intended finished repo state, including the important generated files that are part of the working codebase.