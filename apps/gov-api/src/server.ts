// apps/gov-api/src/server.ts

import { createApp } from "./app";
import type { AppContext } from "./context/app-context";

/**
 * Temporary placeholder app context.
 * Replace with real handler wiring as implementation proceeds.
 */
const appContext: AppContext = {
  handlers: {
    identity: {
      getCurrentIdentity: {
        async execute(query) {
          return {
            personId: query.actor.personId,
            userAccountId: query.actor.userAccountId,
            displayName: "Development User",
            primaryEmail: query.actor.email,
            member: query.actor.memberId
              ? {
                  memberId: query.actor.memberId,
                  membershipStatus: "ACTIVE",
                }
              : undefined,
          };
        },
      },
      getAuthorityContext: {
        async execute(query) {
          return {
            roles: query.actor.roles.map((role, index) => ({
              id: `role-${index + 1}`,
              code: role,
              name: role,
            })),
            offices: [],
            authorityGrants: query.actor.authorityGrants,
          };
        },
      },
    },
    proposals: {
      createDraft: {
        async execute(command) {
          const proposalId = crypto.randomUUID();
          const versionId = crypto.randomUUID();
          const now = new Date().toISOString();

          return {
            id: proposalId,
            title: command.input.title,
            summary: command.input.summary,
            proposalType: command.input.proposalType ?? "GENERAL",
            currentStage: "DRAFT",
            proposerPersonId: command.actor.personId,
            proposerMemberId: command.actor.memberId,
            currentVersionId: versionId,
            createdAt: now,
            updatedAt: now,
          };
        },
      },
      getDetail: {
        async execute(query) {
          return {
            id: query.proposalId,
            title: "Stub Proposal",
            proposalType: "GENERAL",
            currentStage: "DRAFT",
            proposerPersonId: "dev-person-id",
            proposerMemberId: "dev-member-id",
            currentVersionId: "stub-version-id",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      },
      list: {
        async execute(query) {
          const now = new Date().toISOString();

          return {
            items: [
              {
                id: crypto.randomUUID(),
                title: "Stub Proposal",
                proposalType: query.filters.proposalType ?? "GENERAL",
                currentStage: query.filters.stage ?? "DRAFT",
                proposerPersonId: "dev-person-id",
                proposerMemberId: "dev-member-id",
                currentVersionId: "stub-version-id",
                createdAt: now,
                updatedAt: now,
              },
            ],
            page: query.page.page,
            limit: query.page.limit,
            total: 1,
            totalPages: 1,
          };
        },
      },
      listVersions: {
        async execute(query) {
          return [
            {
              id: crypto.randomUUID(),
              proposalId: query.proposalId,
              versionNumber: 1,
              titleSnapshot: "Stub Proposal",
              bodyMarkdown: "# Stub Proposal",
              createdByPersonId: "dev-person-id",
              createdAt: new Date().toISOString(),
            },
          ];
        },
      },
      createVersion: {
        async execute(command) {
          return {
            id: crypto.randomUUID(),
            proposalId: command.proposalId,
            versionNumber: 2,
            titleSnapshot: command.input.titleSnapshot,
            bodyMarkdown: command.input.bodyMarkdown,
            changeSummary: command.input.changeSummary,
            createdByPersonId: command.actor.personId,
            createdAt: new Date().toISOString(),
          };
        },
      },
      setCurrentVersion: {
        async execute(command) {
          return {
            id: command.proposalId,
            title: "Stub Proposal",
            proposalType: "GENERAL",
            currentStage: "DRAFT",
            proposerPersonId: command.actor.personId,
            proposerMemberId: command.actor.memberId,
            currentVersionId: command.input.proposalVersionId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      },
      submit: {
        async execute(command) {
          return {
            id: command.proposalId,
            title: "Stub Proposal",
            proposalType: "GENERAL",
            currentStage: "SUBMITTED",
            proposerPersonId: command.actor.personId,
            proposerMemberId: command.actor.memberId,
            currentVersionId: "submitted-version-id",
            submittedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      },
      assignCommittee: {
        async execute(command) {
          return {
            id: command.proposalId,
            title: "Stub Proposal",
            proposalType: "GENERAL",
            currentStage: "COMMITTEE_ASSIGNED",
            proposerPersonId: command.actor.personId,
            proposerMemberId: command.actor.memberId,
            currentVersionId: "committee-version-id",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        },
      },
    },
  },
};

const app = createApp(appContext);

export default app;