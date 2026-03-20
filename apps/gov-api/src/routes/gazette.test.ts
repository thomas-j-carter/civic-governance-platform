import { describe, expect, it } from "vitest";
import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { requestContextMiddleware } from "../middleware/request-context";
import { errorHandler } from "../middleware/error-handler";
import { createGazetteRoutes } from "./gazette";
import { IdempotencyService } from "../application/shared/idempotency-service";
import { InMemoryIdempotencyRepository } from "../infrastructure/persistence/in-memory/in-memory-idempotency-repository";

describe("gazette routes", () => {
  it("creates a gazette issue", async () => {
    const app = new Hono<HonoEnv>();

    app.use("*", requestContextMiddleware);
    app.use("*", async (c, next) => {
      c.set("requestContext", {
        requestId: "req-1",
        actor: {
          personId: "admin-1",
          isAuthenticated: true,
          roles: ["publisher"],
          authorityGrants: [
            "gazette.issue.create",
            "gazette.issue.read",
            "gazette.entry.create",
            "gazette.entry.read",
            "gazette.issue.publish",
          ],
        },
      });

      c.set("appContext", {
        handlers: {
          gazette: {
            createIssue: {
              async execute(command) {
                return {
                  id: "issue-1",
                  issueNumber: command.input.issueNumber,
                  title: command.input.title,
                  publicationState: "DRAFT",
                  createdByPersonId: command.actor.personId,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              },
            },
            getIssue: { async execute() { return null; } },
            listIssues: { async execute() { return []; } },
            publishIssue: {
              async execute() {
                return {
                  id: "issue-1",
                  title: "Issue 1",
                  publicationState: "PUBLISHED",
                  createdByPersonId: "admin-1",
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
              },
            },
            createEntry: { async execute() { throw new Error("unused"); } },
          },
          gazettePromotion: {
            addRecordToIssue: {
              async execute() {
                return {
                  id: "entry-1",
                  gazetteIssueId: "issue-1",
                  officialRecordId: "record-1",
                  titleSnapshot: "Act I",
                  publicationOrder: 1,
                  createdAt: new Date().toISOString(),
                };
              },
            },
            listEntries: { async execute() { return []; } },
          },
        } as never,
        services: {
          transactionRunner: {
            runInTransaction: async <T>(work: () => Promise<T>) => work(),
          },
          idempotencyService: new IdempotencyService(
            new InMemoryIdempotencyRepository(),
          ),
          auditWriter: {} as never,
          ruleResolutionService: {} as never,
          authorityResolutionService: {} as never,
          tokenValidator: {} as never,
          principalToPersonService: {} as never,
          authenticatedActorService: {} as never,
        },
      });

      await next();
    });
    app.use("*", errorHandler);

    app.route("/gazette", createGazetteRoutes());

    const res = await app.request("http://localhost/gazette/issues", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "idempotency-key": "idem-issue-1",
      },
      body: JSON.stringify({
        issueNumber: "0001",
        title: "Issue 1",
      }),
    });

    expect(res.status).toBe(201);
    const body = await res.json();
    expect(body.data.issueNumber).toBe("0001");
    expect(body.data.title).toBe("Issue 1");
  });
});
