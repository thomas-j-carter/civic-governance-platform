// apps/gov-api/src/routes/proposals.ts

import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { jsonData, jsonList } from "../http/json";
import { requireAuth } from "../middleware/require-auth";
import { requireAuthority } from "../middleware/require-authority";
import { ValidationError, NotFoundError } from "../http/errors";
import { parsePageInput } from "../application/shared/pagination";

export function createProposalRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.get("/", requireAuth, async (c) => {
    const appContext = c.get("appContext");

    const page = parsePageInput({
      page: c.req.query("page"),
      limit: c.req.query("limit"),
    });

    const result = await appContext.handlers.proposals.list.execute({
      page,
      filters: {
        stage: c.req.query("stage") ?? undefined,
        proposalType: c.req.query("proposalType") ?? undefined,
      },
    });

    return c.json(
      jsonList(result.items, {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages,
      }),
      200,
    );
  });

  app.post("/", requireAuth, requireAuthority("proposal.create_draft"), async (c) => {
    const appContext = c.get("appContext");
    const requestContext = c.get("requestContext");
    const actor = requestContext.actor!;

    const body = await c.req.json<{
      title?: string;
      summary?: string;
      proposalType?: string;
      bodyMarkdown?: string;
    }>();

    const errors: Record<string, string[]> = {};

    if (!body.title?.trim()) {
      errors.title = ["Title is required."];
    }

    if (!body.bodyMarkdown?.trim()) {
      errors.bodyMarkdown = ["bodyMarkdown is required."];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Proposal draft request was invalid.", errors);
    }

    const result = await appContext.handlers.proposals.createDraft.execute({
      actor: {
        personId: actor.personId,
        memberId: actor.memberId,
      },
      input: {
        title: body.title!,
        summary: body.summary,
        proposalType: body.proposalType,
        bodyMarkdown: body.bodyMarkdown!,
      },
    });

    return c.json(jsonData(result), 201);
  });

  app.get("/:proposalId", requireAuth, async (c) => {
    const appContext = c.get("appContext");
    const proposalId = c.req.param("proposalId");

    const result = await appContext.handlers.proposals.getDetail.execute({
      proposalId,
    });

    if (!result) {
      throw new NotFoundError(`Proposal ${proposalId} was not found.`);
    }

    return c.json(jsonData(result), 200);
  });

  app.get("/:proposalId/versions", requireAuth, async (c) => {
    const appContext = c.get("appContext");
    const proposalId = c.req.param("proposalId");

    const result = await appContext.handlers.proposals.listVersions.execute({
      proposalId,
    });

    return c.json(jsonData(result), 200);
  });

  app.post(
    "/:proposalId/versions",
    requireAuth,
    requireAuthority("proposal.version.create"),
    async (c) => {
      const appContext = c.get("appContext");
      const requestContext = c.get("requestContext");
      const actor = requestContext.actor!;
      const proposalId = c.req.param("proposalId");

      const body = await c.req.json<{
        titleSnapshot?: string;
        bodyMarkdown?: string;
        changeSummary?: string;
      }>();

      const errors: Record<string, string[]> = {};

      if (!body.titleSnapshot?.trim()) {
        errors.titleSnapshot = ["titleSnapshot is required."];
      }

      if (!body.bodyMarkdown?.trim()) {
        errors.bodyMarkdown = ["bodyMarkdown is required."];
      }

      if (Object.keys(errors).length > 0) {
        throw new ValidationError("Proposal version request was invalid.", errors);
      }

      const result = await appContext.handlers.proposals.createVersion.execute({
        actor: {
          personId: actor.personId,
          memberId: actor.memberId,
        },
        proposalId,
        input: {
          titleSnapshot: body.titleSnapshot!,
          bodyMarkdown: body.bodyMarkdown!,
          changeSummary: body.changeSummary,
        },
      });

      return c.json(jsonData(result), 201);
    },
  );

  app.post(
    "/:proposalId/actions/set-current-version",
    requireAuth,
    requireAuthority("proposal.version.set_current"),
    async (c) => {
      const appContext = c.get("appContext");
      const requestContext = c.get("requestContext");
      const actor = requestContext.actor!;
      const proposalId = c.req.param("proposalId");

      const body = await c.req.json<{ proposalVersionId?: string }>();

      if (!body.proposalVersionId?.trim()) {
        throw new ValidationError("Current version request was invalid.", {
          proposalVersionId: ["proposalVersionId is required."],
        });
      }

      const result = await appContext.handlers.proposals.setCurrentVersion.execute({
        actor: {
          personId: actor.personId,
          memberId: actor.memberId,
        },
        proposalId,
        input: {
          proposalVersionId: body.proposalVersionId,
        },
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/:proposalId/actions/submit",
    requireAuth,
    requireAuthority("proposal.submit"),
    async (c) => {
      const appContext = c.get("appContext");
      const requestContext = c.get("requestContext");
      const actor = requestContext.actor!;
      const proposalId = c.req.param("proposalId");

      const body = await c.req.json<{ note?: string }>().catch(() => ({}));

      const result = await appContext.handlers.proposals.submit.execute({
        actor: {
          personId: actor.personId,
          memberId: actor.memberId,
        },
        proposalId,
        input: {
          note: body.note,
        },
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/:proposalId/actions/assign-committee",
    requireAuth,
    requireAuthority("proposal.assign_committee"),
    async (c) => {
      const appContext = c.get("appContext");
      const requestContext = c.get("requestContext");
      const actor = requestContext.actor!;
      const proposalId = c.req.param("proposalId");

      const body = await c.req.json<{ governanceBodyId?: string }>();

      if (!body.governanceBodyId?.trim()) {
        throw new ValidationError("Assign committee request was invalid.", {
          governanceBodyId: ["governanceBodyId is required."],
        });
      }

      const result = await appContext.handlers.proposals.assignCommittee.execute({
        actor: {
          personId: actor.personId,
          memberId: actor.memberId,
        },
        proposalId,
        input: {
          governanceBodyId: body.governanceBodyId,
        },
      });

      return c.json(jsonData(result), 200);
    },
  );

  return app;
}