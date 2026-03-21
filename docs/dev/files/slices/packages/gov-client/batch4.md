# Batch 4 — packages/gov-client

First, fix the transport bug so the tests reflect the correct contract.

```ts
// packages/gov-client/src/client/transport.ts

import { GovApiError, ProblemDetails, isProblemDetails } from "./errors";
import { QueryParams, buildUrl } from "./request";
import { ResolvedGovClientConfig } from "./config";

export interface TransportRequestOptions<TBody = unknown> {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  query?: QueryParams;
  body?: TBody;
  headers?: Record<string, string>;
  signal?: AbortSignal;
}

export interface HttpTransport {
  request<TResponse, TBody = unknown>(
    options: TransportRequestOptions<TBody>,
  ): Promise<TResponse>;
}

export function createHttpTransport(config: ResolvedGovClientConfig): HttpTransport {
  return {
    async request<TResponse, TBody = unknown>(
      options: TransportRequestOptions<TBody>,
    ): Promise<TResponse> {
      const url = buildUrl(config.baseUrl, options.path, options.query);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      try {
        const accessToken = await resolveAccessToken(config.getAccessToken);
        const headers = buildHeaders({
          defaultHeaders: config.defaultHeaders,
          requestHeaders: options.headers,
          accessToken,
          hasJsonBody: options.body !== undefined,
        });

        const response = await config.fetchImpl(url, {
          method: options.method,
          headers,
          body: options.body === undefined ? undefined : JSON.stringify(options.body),
          signal: options.signal ?? controller.signal,
        });

        const responseBody = await parseResponseBody(response);

        if (!response.ok) {
          throw createErrorFromResponse(response, responseBody);
        }

        return responseBody as TResponse;
      } finally {
        clearTimeout(timeout);
      }
    },
  };
}

async function resolveAccessToken(
  provider?: (() => Promise<string | null> | string | null) | undefined,
): Promise<string | null> {
  if (!provider) {
    return null;
  }

  return await provider();
}

function buildHeaders(args: {
  defaultHeaders: Record<string, string>;
  requestHeaders?: Record<string, string>;
  accessToken: string | null;
  hasJsonBody: boolean;
}): Headers {
  const headers = new Headers(args.defaultHeaders);

  if (args.hasJsonBody && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  if (!headers.has("accept")) {
    headers.set("accept", "application/json");
  }

  if (args.accessToken && !headers.has("authorization")) {
    headers.set("authorization", `Bearer ${args.accessToken}`);
  }

  for (const [key, value] of Object.entries(args.requestHeaders ?? {})) {
    headers.set(key, value);
  }

  return headers;
}

function isJsonLikeContentType(contentType: string): boolean {
  const normalized = contentType.toLowerCase();
  return normalized.includes("application/json") || normalized.includes("+json");
}

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const text = await response.text();

  if (!text) {
    return undefined;
  }

  if (!isJsonLikeContentType(contentType)) {
    return { raw: text };
  }

  return JSON.parse(text) as unknown;
}

function createErrorFromResponse(response: Response, responseBody: unknown): GovApiError {
  if (isProblemDetails(responseBody)) {
    return new GovApiError(attachTraceId(response, responseBody));
  }

  const fallback: ProblemDetails = attachTraceId(response, {
    type: "about:blank",
    title: response.statusText || "HTTP error",
    status: response.status,
    detail: tryExtractDetail(responseBody),
  });

  return new GovApiError(fallback);
}

function attachTraceId(response: Response, problem: ProblemDetails): ProblemDetails {
  const traceId = response.headers.get("x-trace-id") ?? problem.traceId;
  return traceId ? { ...problem, traceId } : problem;
}

function tryExtractDetail(body: unknown): string | undefined {
  if (!body) {
    return undefined;
  }

  if (typeof body === "string") {
    return body;
  }

  if (typeof body === "object") {
    const candidate = body as Record<string, unknown>;
    if (typeof candidate.detail === "string") {
      return candidate.detail;
    }
    if (typeof candidate.message === "string") {
      return candidate.message;
    }
    if (typeof candidate.raw === "string") {
      return candidate.raw;
    }
  }

  return undefined;
}
```

Now the first unit-test batch.

```ts
// packages/gov-client/src/client/transport.test.ts

import { describe, expect, it, vi } from "vitest";
import { resolveGovClientConfig } from "./config";
import { createHttpTransport } from "./transport";
import { GovApiError } from "./errors";

function createTransport(fetchImpl: typeof fetch) {
  return createHttpTransport(
    resolveGovClientConfig({
      baseUrl: "https://gov-api.example.test/api/v1/",
      fetchImpl,
      getAccessToken: async () => "test-access-token",
      defaultHeaders: {
        "x-client-name": "gov-client-test",
      },
      timeoutMs: 5_000,
    }),
  );
}

describe("createHttpTransport", () => {
  it("builds the request URL, injects headers, and serializes JSON bodies", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }) as unknown as typeof fetch;

    const transport = createTransport(fetchImpl);

    const result = await transport.request<{ ok: boolean }, { title: string }>({
      method: "POST",
      path: "/proposals",
      query: {
        page: 2,
        stage: "DRAFT",
        tag: ["constitutional", "priority"],
        ignored: undefined,
      },
      body: {
        title: "Founding Resolution",
      },
    });

    expect(result).toEqual({ ok: true });
    expect(fetchImpl).toHaveBeenCalledTimes(1);

    const [url, init] = vi.mocked(fetchImpl).mock.calls[0];
    expect(url).toBe(
      "https://gov-api.example.test/api/v1/proposals?page=2&stage=DRAFT&tag=constitutional&tag=priority",
    );
    expect(init?.method).toBe("POST");

    const headers = new Headers(init?.headers);
    expect(headers.get("accept")).toBe("application/json");
    expect(headers.get("content-type")).toBe("application/json");
    expect(headers.get("authorization")).toBe("Bearer test-access-token");
    expect(headers.get("x-client-name")).toBe("gov-client-test");

    expect(JSON.parse(String(init?.body))).toEqual({
      title: "Founding Resolution",
    });
  });

  it("returns undefined for 204 responses", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(null, { status: 204 });
    }) as unknown as typeof fetch;

    const transport = createTransport(fetchImpl);

    const result = await transport.request<void>({
      method: "DELETE",
      path: "/proposals/proposal-1",
    });

    expect(result).toBeUndefined();
  });

  it("maps RFC 7807 application/problem+json responses into GovApiError", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(
        JSON.stringify({
          type: "https://gov-api.ardtiresociety.org/problems/forbidden",
          title: "Forbidden",
          status: 403,
          detail: "Missing required authority.",
          code: "insufficient_authority",
        }),
        {
          status: 403,
          headers: {
            "content-type": "application/problem+json",
            "x-trace-id": "trace-123",
          },
        },
      );
    }) as unknown as typeof fetch;

    const transport = createTransport(fetchImpl);

    await expect(
      transport.request({
        method: "POST",
        path: "/proposals/proposal-1/actions/assign-committee",
      }),
    ).rejects.toMatchObject<Partial<GovApiError>>({
      name: "GovApiError",
      status: 403,
      problem: {
        title: "Forbidden",
        detail: "Missing required authority.",
        code: "insufficient_authority",
        traceId: "trace-123",
      },
    });
  });

  it("maps non-JSON error responses into GovApiError with extracted text detail", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response("Upstream gateway failed.", {
        status: 502,
        statusText: "Bad Gateway",
        headers: {
          "content-type": "text/plain",
        },
      });
    }) as unknown as typeof fetch;

    const transport = createTransport(fetchImpl);

    await expect(
      transport.request({
        method: "GET",
        path: "/ballots/ballot-1/tally",
      }),
    ).rejects.toMatchObject<Partial<GovApiError>>({
      name: "GovApiError",
      status: 502,
      problem: {
        title: "Bad Gateway",
        detail: "Upstream gateway failed.",
      },
    });
  });

  it("uses an explicit per-request signal when one is provided", async () => {
    const fetchImpl = vi.fn(async () => {
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      });
    }) as unknown as typeof fetch;

    const transport = createTransport(fetchImpl);
    const controller = new AbortController();

    await transport.request({
      method: "GET",
      path: "/identity/me",
      signal: controller.signal,
    });

    const [, init] = vi.mocked(fetchImpl).mock.calls[0];
    expect(init?.signal).toBe(controller.signal);
  });
});
```

```ts
// packages/gov-client/src/modules/proposals.test.ts

import { describe, expect, it, vi } from "vitest";
import type { HttpTransport } from "../client/transport";
import { createProposalsClient } from "./proposals";

function createTransportMock() {
  const request = vi.fn();
  const transport: HttpTransport = {
    request: request as HttpTransport["request"],
  };
  return { transport, request };
}

describe("createProposalsClient", () => {
  it("lists proposals and unwraps pagination", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    request.mockResolvedValue({
      data: [
        {
          id: "proposal-1",
          title: "Founding Resolution",
          proposalType: "RESOLUTION",
          currentStage: "DRAFT",
          createdAt: "2026-03-21T00:00:00.000Z",
          updatedAt: "2026-03-21T00:00:00.000Z",
        },
      ],
      pagination: {
        page: 2,
        limit: 10,
        total: 21,
        totalPages: 3,
      },
    });

    const result = await client.list({
      page: 2,
      limit: 10,
      stage: "DRAFT",
      proposalType: "RESOLUTION",
    });

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/proposals",
      query: {
        page: 2,
        limit: 10,
        stage: "DRAFT",
        proposalType: "RESOLUTION",
      },
    });

    expect(result).toEqual({
      items: [
        {
          id: "proposal-1",
          title: "Founding Resolution",
          proposalType: "RESOLUTION",
          currentStage: "DRAFT",
          createdAt: "2026-03-21T00:00:00.000Z",
          updatedAt: "2026-03-21T00:00:00.000Z",
        },
      ],
      page: 2,
      limit: 10,
      total: 21,
      totalPages: 3,
    });
  });

  it("gets a proposal by id", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "proposal-1",
        title: "Founding Resolution",
        proposalType: "RESOLUTION",
        currentStage: "SUBMITTED",
        createdAt: "2026-03-21T00:00:00.000Z",
        updatedAt: "2026-03-21T00:00:00.000Z",
      },
    });

    const result = await client.get("proposal-1");

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/proposals/proposal-1",
    });

    expect(result).toEqual({
      id: "proposal-1",
      title: "Founding Resolution",
      proposalType: "RESOLUTION",
      currentStage: "SUBMITTED",
      createdAt: "2026-03-21T00:00:00.000Z",
      updatedAt: "2026-03-21T00:00:00.000Z",
    });
  });

  it("creates a draft", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    const input = {
      title: "Founding Resolution",
      summary: "Establishes the founding framework.",
      proposalType: "RESOLUTION" as const,
      bodyMarkdown: "# Founding Resolution",
    };

    request.mockResolvedValue({
      data: {
        id: "proposal-1",
        ...input,
        currentStage: "DRAFT",
        createdAt: "2026-03-21T00:00:00.000Z",
        updatedAt: "2026-03-21T00:00:00.000Z",
      },
    });

    const result = await client.createDraft(input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/proposals",
      body: input,
    });

    expect(result.id).toBe("proposal-1");
    expect(result.currentStage).toBe("DRAFT");
  });

  it("lists proposal versions", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    request.mockResolvedValue({
      data: [
        {
          id: "version-1",
          proposalId: "proposal-1",
          versionNumber: 1,
          titleSnapshot: "Founding Resolution",
          bodyMarkdown: "# Founding Resolution",
          createdByPersonId: "person-1",
          createdAt: "2026-03-21T00:00:00.000Z",
        },
      ],
    });

    const result = await client.listVersions("proposal-1");

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/proposals/proposal-1/versions",
    });

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("version-1");
  });

  it("creates a proposal version", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    const input = {
      titleSnapshot: "Founding Resolution v2",
      bodyMarkdown: "# Founding Resolution\n\nUpdated text",
      changeSummary: "Clarified ratification section.",
    };

    request.mockResolvedValue({
      data: {
        id: "version-2",
        proposalId: "proposal-1",
        versionNumber: 2,
        createdByPersonId: "person-1",
        createdAt: "2026-03-21T00:00:00.000Z",
        ...input,
      },
    });

    const result = await client.createVersion("proposal-1", input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/proposals/proposal-1/versions",
      body: input,
    });

    expect(result.versionNumber).toBe(2);
  });

  it("sets the current proposal version via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    const input = {
      proposalVersionId: "version-2",
    };

    request.mockResolvedValue({
      data: {
        id: "proposal-1",
        title: "Founding Resolution",
        proposalType: "RESOLUTION",
        currentStage: "DRAFT",
        currentVersionId: "version-2",
        createdAt: "2026-03-21T00:00:00.000Z",
        updatedAt: "2026-03-21T01:00:00.000Z",
      },
    });

    const result = await client.setCurrentVersion("proposal-1", input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/proposals/proposal-1/actions/set-current-version",
      body: input,
    });

    expect(result.currentVersionId).toBe("version-2");
  });

  it("submits a proposal via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "proposal-1",
        title: "Founding Resolution",
        proposalType: "RESOLUTION",
        currentStage: "SUBMITTED",
        submittedAt: "2026-03-21T02:00:00.000Z",
        createdAt: "2026-03-21T00:00:00.000Z",
        updatedAt: "2026-03-21T02:00:00.000Z",
      },
    });

    const result = await client.submit("proposal-1", {
      note: "Ready for committee review.",
    });

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/proposals/proposal-1/actions/submit",
      body: {
        note: "Ready for committee review.",
      },
    });

    expect(result.currentStage).toBe("SUBMITTED");
  });

  it("assigns a committee via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    const input = {
      governanceBodyId: "committee-1",
    };

    request.mockResolvedValue({
      data: {
        id: "proposal-1",
        title: "Founding Resolution",
        proposalType: "RESOLUTION",
        currentStage: "COMMITTEE_ASSIGNED",
        createdAt: "2026-03-21T00:00:00.000Z",
        updatedAt: "2026-03-21T03:00:00.000Z",
      },
    });

    const result = await client.assignCommittee("proposal-1", input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/proposals/proposal-1/actions/assign-committee",
      body: input,
    });

    expect(result.currentStage).toBe("COMMITTEE_ASSIGNED");
  });

  it("lists amendments", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    request.mockResolvedValue({
      data: [
        {
          id: "amendment-1",
          proposalId: "proposal-1",
          title: "Amendment A",
          bodyText: "Replace section 2.",
          status: "SUBMITTED",
          submittedAt: "2026-03-21T04:00:00.000Z",
        },
      ],
    });

    const result = await client.listAmendments("proposal-1");

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/proposals/proposal-1/amendments",
    });

    expect(result[0].id).toBe("amendment-1");
  });

  it("creates an amendment", async () => {
    const { transport, request } = createTransportMock();
    const client = createProposalsClient(transport);

    const input = {
      title: "Amendment A",
      bodyText: "Replace section 2.",
    };

    request.mockResolvedValue({
      data: {
        id: "amendment-1",
        proposalId: "proposal-1",
        status: "SUBMITTED",
        submittedAt: "2026-03-21T04:00:00.000Z",
        ...input,
      },
    });

    const result = await client.createAmendment("proposal-1", input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/proposals/proposal-1/amendments",
      body: input,
    });

    expect(result.id).toBe("amendment-1");
  });
});
```

```ts
// packages/gov-client/src/modules/ballots.test.ts

import { describe, expect, it, vi } from "vitest";
import type { HttpTransport } from "../client/transport";
import { createBallotsClient } from "./ballots";

function createTransportMock() {
  const request = vi.fn();
  const transport: HttpTransport = {
    request: request as HttpTransport["request"],
  };
  return { transport, request };
}

describe("createBallotsClient", () => {
  it("lists ballots and unwraps pagination", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValue({
      data: [
        {
          id: "ballot-1",
          proposalId: "proposal-1",
          title: "Ratification Ballot",
          state: "OPEN",
        },
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 1,
        totalPages: 1,
      },
    });

    const result = await client.list({
      page: 1,
      limit: 20,
      state: "OPEN",
    });

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/ballots",
      query: {
        page: 1,
        limit: 20,
        state: "OPEN",
      },
    });

    expect(result).toEqual({
      items: [
        {
          id: "ballot-1",
          proposalId: "proposal-1",
          title: "Ratification Ballot",
          state: "OPEN",
        },
      ],
      page: 1,
      limit: 20,
      total: 1,
      totalPages: 1,
    });
  });

  it("gets a ballot by id", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "ballot-1",
        title: "Ratification Ballot",
        state: "DRAFT",
      },
    });

    const result = await client.get("ballot-1");

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/ballots/ballot-1",
    });

    expect(result.id).toBe("ballot-1");
  });

  it("creates a ballot", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    const input = {
      proposalId: "proposal-1",
      title: "Ratification Ballot",
      description: "Open ballot for final vote.",
      scheduledOpenAt: "2026-03-22T12:00:00.000Z",
      scheduledCloseAt: "2026-03-23T12:00:00.000Z",
    };

    request.mockResolvedValue({
      data: {
        id: "ballot-1",
        state: "DRAFT",
        ...input,
      },
    });

    const result = await client.create(input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/ballots",
      body: input,
    });

    expect(result.state).toBe("DRAFT");
  });

  it("opens a ballot via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "ballot-1",
        title: "Ratification Ballot",
        state: "OPEN",
        openedAt: "2026-03-22T12:00:00.000Z",
      },
    });

    const result = await client.open("ballot-1");

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/ballots/ballot-1/actions/open",
    });

    expect(result.state).toBe("OPEN");
  });

  it("closes a ballot via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "ballot-1",
        title: "Ratification Ballot",
        state: "CLOSED",
        closedAt: "2026-03-23T12:00:00.000Z",
      },
    });

    const result = await client.close("ballot-1");

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/ballots/ballot-1/actions/close",
    });

    expect(result.state).toBe("CLOSED");
  });

  it("cancels a ballot via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "ballot-1",
        title: "Ratification Ballot",
        state: "CANCELLED",
        cancelledAt: "2026-03-23T10:00:00.000Z",
      },
    });

    const result = await client.cancel("ballot-1");

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/ballots/ballot-1/actions/cancel",
    });

    expect(result.state).toBe("CANCELLED");
  });

  it("gets ballot eligibility", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValue({
      data: [
        {
          ballotId: "ballot-1",
          memberId: "member-1",
          eligibilityStatus: "ELIGIBLE",
          snapshotAt: "2026-03-22T12:00:00.000Z",
        },
      ],
    });

    const result = await client.getEligibility("ballot-1");

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/ballots/ballot-1/eligibility",
    });

    expect(result[0].eligibilityStatus).toBe("ELIGIBLE");
  });

  it("lists votes and casts votes", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValueOnce({
      data: [
        {
          id: "vote-1",
          ballotId: "ballot-1",
          memberId: "member-1",
          choice: "YES",
          castAt: "2026-03-22T12:30:00.000Z",
        },
      ],
    });

    const votes = await client.listVotes("ballot-1");

    expect(request).toHaveBeenNthCalledWith(1, {
      method: "GET",
      path: "/ballots/ballot-1/votes",
    });
    expect(votes[0].choice).toBe("YES");

    request.mockResolvedValueOnce({
      data: {
        id: "vote-2",
        ballotId: "ballot-1",
        memberId: "member-2",
        choice: "NO",
        castAt: "2026-03-22T12:45:00.000Z",
      },
    });

    const created = await client.castVote("ballot-1", {
      choice: "NO",
    });

    expect(request).toHaveBeenNthCalledWith(2, {
      method: "POST",
      path: "/ballots/ballot-1/votes",
      body: {
        choice: "NO",
      },
    });
    expect(created.choice).toBe("NO");
  });

  it("gets a ballot tally", async () => {
    const { transport, request } = createTransportMock();
    const client = createBallotsClient(transport);

    request.mockResolvedValue({
      data: {
        ballotId: "ballot-1",
        yesCount: 7,
        noCount: 2,
        abstainCount: 1,
        totalCount: 10,
        quorumMet: true,
        thresholdMet: true,
        computedAt: "2026-03-23T12:05:00.000Z",
      },
    });

    const result = await client.getTally("ballot-1");

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/ballots/ballot-1/tally",
    });

    expect(result.totalCount).toBe(10);
    expect(result.thresholdMet).toBe(true);
  });
});
```

```ts
// packages/gov-client/src/modules/certifications.test.ts

import { describe, expect, it, vi } from "vitest";
import type { HttpTransport } from "../client/transport";
import { createCertificationsClient } from "./certifications";

function createTransportMock() {
  const request = vi.fn();
  const transport: HttpTransport = {
    request: request as HttpTransport["request"],
  };
  return { transport, request };
}

describe("createCertificationsClient", () => {
  it("creates a certification", async () => {
    const { transport, request } = createTransportMock();
    const client = createCertificationsClient(transport);

    const input = {
      ballotId: "ballot-1",
      notes: "Tally ready for certification review.",
    };

    request.mockResolvedValue({
      data: {
        id: "certification-1",
        ballotId: "ballot-1",
        status: "PENDING",
        notes: input.notes,
        quorumRuleVersionId: "rule-version-quorum-1",
        thresholdRuleVersionId: "rule-version-threshold-1",
        certificationRuleVersionId: "rule-version-certification-1",
      },
    });

    const result = await client.create(input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/certifications",
      body: input,
    });

    expect(result.status).toBe("PENDING");
  });

  it("gets a certification by id", async () => {
    const { transport, request } = createTransportMock();
    const client = createCertificationsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "certification-1",
        ballotId: "ballot-1",
        status: "UNDER_REVIEW",
        quorumRuleVersionId: "rule-version-quorum-1",
        thresholdRuleVersionId: "rule-version-threshold-1",
      },
    });

    const result = await client.get("certification-1");

    expect(request).toHaveBeenCalledWith({
      method: "GET",
      path: "/certifications/certification-1",
    });

    expect(result.id).toBe("certification-1");
  });

  it("certifies a result via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createCertificationsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "certification-1",
        ballotId: "ballot-1",
        status: "CERTIFIED",
        certifiedByPersonId: "person-1",
        certifiedAt: "2026-03-23T13:00:00.000Z",
        quorumRuleVersionId: "rule-version-quorum-1",
        thresholdRuleVersionId: "rule-version-threshold-1",
      },
    });

    const result = await client.certify("certification-1");

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/certifications/certification-1/actions/certify",
    });

    expect(result.status).toBe("CERTIFIED");
  });

  it("rejects a certification via explicit action endpoint", async () => {
    const { transport, request } = createTransportMock();
    const client = createCertificationsClient(transport);

    request.mockResolvedValue({
      data: {
        id: "certification-1",
        ballotId: "ballot-1",
        status: "REJECTED",
        rejectedAt: "2026-03-23T13:00:00.000Z",
        notes: "Threshold calculation was disputed.",
        quorumRuleVersionId: "rule-version-quorum-1",
        thresholdRuleVersionId: "rule-version-threshold-1",
      },
    });

    const result = await client.reject("certification-1", {
      notes: "Threshold calculation was disputed.",
    });

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/certifications/certification-1/actions/reject",
      body: {
        notes: "Threshold calculation was disputed.",
      },
    });

    expect(result.status).toBe("REJECTED");
  });

  it("creates a ratification through the dedicated ratifications resource", async () => {
    const { transport, request } = createTransportMock();
    const client = createCertificationsClient(transport);

    const input = {
      proposalId: "proposal-1",
      certificationRecordId: "certification-1",
      notes: "Ratified by competent authority.",
    };

    request.mockResolvedValue({
      data: {
        id: "ratification-1",
        proposalId: "proposal-1",
        certificationRecordId: "certification-1",
        status: "RATIFIED",
        ratifiedByPersonId: "person-1",
        ratifiedAt: "2026-03-23T14:00:00.000Z",
        notes: input.notes,
      },
    });

    const result = await client.createRatification(input);

    expect(request).toHaveBeenCalledWith({
      method: "POST",
      path: "/ratifications",
      body: input,
    });

    expect(result.status).toBe("RATIFIED");
  });
});
```

Next, the `gov-api` route-handler batch that matches these client tests.

This assumes your batch-1 foundation already exists in `apps/gov-api` (`jsonData`, `jsonList`, `requireAuth`, `requireAuthority`, `ValidationError`, `NotFoundError`, `parsePageInput`, and `HonoEnv`).

```ts
// apps/gov-api/src/routes/ballots.ts

import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { jsonData, jsonList } from "../http/json";
import { requireAuth } from "../middleware/require-auth";
import { requireAuthority } from "../middleware/require-authority";
import { ValidationError, NotFoundError } from "../http/errors";
import { parsePageInput } from "../application/shared/pagination";

export function createBallotRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.get("/", requireAuth, async (c) => {
    const appContext = c.get("appContext");

    const page = parsePageInput({
      page: c.req.query("page"),
      limit: c.req.query("limit"),
    });

    const result = await appContext.handlers.ballots.list.execute({
      page,
      filters: {
        state: c.req.query("state") ?? undefined,
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

  app.post("/", requireAuth, requireAuthority("ballot.create"), async (c) => {
    const appContext = c.get("appContext");
    const requestContext = c.get("requestContext");
    const actor = requestContext.actor!;

    const body = await c.req.json<{
      proposalId?: string;
      title?: string;
      description?: string;
      scheduledOpenAt?: string;
      scheduledCloseAt?: string;
    }>();

    const errors: Record<string, string[]> = {};

    if (!body.title?.trim()) {
      errors.title = ["Title is required."];
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError("Create ballot request was invalid.", errors);
    }

    const result = await appContext.handlers.ballots.create.execute({
      actor: {
        personId: actor.personId,
        memberId: actor.memberId,
      },
      input: {
        proposalId: body.proposalId,
        title: body.title!,
        description: body.description,
        scheduledOpenAt: body.scheduledOpenAt,
        scheduledCloseAt: body.scheduledCloseAt,
      },
    });

    return c.json(jsonData(result), 201);
  });

  app.get("/:ballotId", requireAuth, async (c) => {
    const appContext = c.get("appContext");
    const ballotId = c.req.param("ballotId");

    const result = await appContext.handlers.ballots.getDetail.execute({ ballotId });

    if (!result) {
      throw new NotFoundError(`Ballot ${ballotId} was not found.`);
    }

    return c.json(jsonData(result), 200);
  });

  app.post(
    "/:ballotId/actions/open",
    requireAuth,
    requireAuthority("ballot.open"),
    async (c) => {
      const appContext = c.get("appContext");
      const requestContext = c.get("requestContext");
      const actor = requestContext.actor!;
      const ballotId = c.req.param("ballotId");

      const result = await appContext.handlers.ballots.open.execute({
        actor: {
          personId: actor.personId,
          memberId: actor.memberId,
        },
        ballotId,
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/:ballotId/actions/close",
    requireAuth,
    requireAuthority("ballot.close"),
    async (c) => {
      const appContext = c.get("appContext");
      const requestContext = c.get("requestContext");
      const actor = requestContext.actor!;
      const ballotId = c.req.param("ballotId");

      const result = await appContext.handlers.ballots.close.execute({
        actor: {
          personId: actor.personId,
          memberId: actor.memberId,
        },
        ballotId,
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/:ballotId/actions/cancel",
    requireAuth,
    requireAuthority("ballot.cancel"),
    async (c) => {
      const appContext = c.get("appContext");
      const requestContext = c.get("requestContext");
      const actor = requestContext.actor!;
      const ballotId = c.req.param("ballotId");

      const result = await appContext.handlers.ballots.cancel.execute({
        actor: {
          personId: actor.personId,
          memberId: actor.memberId,
        },
        ballotId,
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.get("/:ballotId/eligibility", requireAuth, async (c) => {
    const appContext = c.get("appContext");
    const ballotId = c.req.param("ballotId");

    const result = await appContext.handlers.ballots.listEligibility.execute({
      ballotId,
    });

    return c.json(jsonData(result), 200);
  });

  app.get("/:ballotId/votes", requireAuth, async (c) => {
    const appContext = c.get("appContext");
    const ballotId = c.req.param("ballotId");

    const result = await appContext.handlers.ballots.listVotes.execute({
      ballotId,
    });

    return c.json(jsonData(result), 200);
  });

  app.post("/:ballotId/votes", requireAuth, requireAuthority("vote.cast"), async (c) => {
    const appContext = c.get("appContext");
    const requestContext = c.get("requestContext");
    const actor = requestContext.actor!;
    const ballotId = c.req.param("ballotId");

    const body = await c.req.json<{ choice?: "YES" | "NO" | "ABSTAIN" }>();

    if (!body.choice) {
      throw new ValidationError("Cast vote request was invalid.", {
        choice: ["choice is required."],
      });
    }

    const result = await appContext.handlers.ballots.castVote.execute({
      actor: {
        personId: actor.personId,
        memberId: actor.memberId,
      },
      ballotId,
      input: {
        choice: body.choice,
      },
    });

    return c.json(jsonData(result), 201);
  });

  app.get("/:ballotId/tally", requireAuth, async (c) => {
    const appContext = c.get("appContext");
    const ballotId = c.req.param("ballotId");

    const result = await appContext.handlers.ballots.getTally.execute({
      ballotId,
    });

    if (!result) {
      throw new NotFoundError(`No tally exists for ballot ${ballotId}.`);
    }

    return c.json(jsonData(result), 200);
  });

  return app;
}
```

```ts
// apps/gov-api/src/routes/certifications.ts

import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { jsonData } from "../http/json";
import { requireAuth } from "../middleware/require-auth";
import { requireAuthority } from "../middleware/require-authority";
import { NotFoundError, ValidationError } from "../http/errors";

export function createCertificationRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.post("/", requireAuth, requireAuthority("certification.create"), async (c) => {
    const appContext = c.get("appContext");
    const actor = c.get("requestContext").actor!;

    const body = await c.req.json<{ ballotId?: string; notes?: string }>();

    if (!body.ballotId?.trim()) {
      throw new ValidationError("Create certification request was invalid.", {
        ballotId: ["ballotId is required."],
      });
    }

    const result = await appContext.handlers.certifications.create.execute({
      actor: { personId: actor.personId },
      input: {
        ballotId: body.ballotId,
        notes: body.notes,
      },
    });

    return c.json(jsonData(result), 201);
  });

  app.get("/:certificationId", requireAuth, async (c) => {
    const appContext = c.get("appContext");
    const certificationId = c.req.param("certificationId");

    const result = await appContext.handlers.certifications.get.execute({
      certificationId,
    });

    if (!result) {
      throw new NotFoundError(`Certification ${certificationId} was not found.`);
    }

    return c.json(jsonData(result), 200);
  });

  app.post(
    "/:certificationId/actions/certify",
    requireAuth,
    requireAuthority("result.certify"),
    async (c) => {
      const appContext = c.get("appContext");
      const actor = c.get("requestContext").actor!;
      const certificationId = c.req.param("certificationId");

      const result = await appContext.handlers.certifications.certify.execute({
        actor: { personId: actor.personId },
        certificationId,
      });

      return c.json(jsonData(result), 200);
    },
  );

  app.post(
    "/:certificationId/actions/reject",
    requireAuth,
    requireAuthority("result.certify"),
    async (c) => {
      const appContext = c.get("appContext");
      const actor = c.get("requestContext").actor!;
      const certificationId = c.req.param("certificationId");
      const body = await c.req.json<{ notes?: string }>().catch(() => ({}));

      const result = await appContext.handlers.certifications.reject.execute({
        actor: { personId: actor.personId },
        certificationId,
        input: {
          notes: body.notes,
        },
      });

      return c.json(jsonData(result), 200);
    },
  );

  return app;
}
```

```ts
// apps/gov-api/src/routes/ratifications.ts

import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { jsonData } from "../http/json";
import { requireAuth } from "../middleware/require-auth";
import { requireAuthority } from "../middleware/require-authority";
import { ValidationError } from "../http/errors";

export function createRatificationRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.post("/", requireAuth, requireAuthority("result.ratify"), async (c) => {
    const appContext = c.get("appContext");
    const actor = c.get("requestContext").actor!;
    const body = await c.req.json<{
      proposalId?: string;
      certificationRecordId?: string;
      notes?: string;
    }>();

    if (!body.proposalId?.trim()) {
      throw new ValidationError("Create ratification request was invalid.", {
        proposalId: ["proposalId is required."],
      });
    }

    const result = await appContext.handlers.certifications.createRatification.execute({
      actor: { personId: actor.personId },
      input: {
        proposalId: body.proposalId,
        certificationRecordId: body.certificationRecordId,
        notes: body.notes,
      },
    });

    return c.json(jsonData(result), 201);
  });

  return app;
}
```

```ts
// apps/gov-api/src/routes/index.ts

import { Hono } from "hono";
import type { HonoEnv } from "../types/hono";
import { createIdentityRoutes } from "./identity";
import { createProposalRoutes } from "./proposals";
import { createBallotRoutes } from "./ballots";
import { createCertificationRoutes } from "./certifications";
import { createRatificationRoutes } from "./ratifications";

export function createApiRoutes(): Hono<HonoEnv> {
  const app = new Hono<HonoEnv>();

  app.route("/identity", createIdentityRoutes());
  app.route("/proposals", createProposalRoutes());
  app.route("/ballots", createBallotRoutes());
  app.route("/certifications", createCertificationRoutes());
  app.route("/ratifications", createRatificationRoutes());

  return app;
}
```

And the required `AppHandlers` additions:

```ts
// apps/gov-api/src/context/app-context.ts
// add these imports

import type { CreateBallotCommandHandler } from "../application/ballots/create-ballot";
import type { ListBallotsQueryHandler } from "../application/ballots/list-ballots";
import type { GetBallotDetailQueryHandler } from "../application/ballots/get-ballot-detail";
import type { OpenBallotCommandHandler } from "../application/ballots/open-ballot";
import type { CloseBallotCommandHandler } from "../application/ballots/close-ballot";
import type { CancelBallotCommandHandler } from "../application/ballots/cancel-ballot";
import type { ListBallotEligibilityQueryHandler } from "../application/ballots/list-ballot-eligibility";
import type { ListVotesQueryHandler } from "../application/ballots/list-votes";
import type { CastVoteCommandHandler } from "../application/ballots/cast-vote";
import type { GetBallotTallyQueryHandler } from "../application/ballots/get-ballot-tally";

import type { CreateCertificationCommandHandler } from "../application/certifications/create-certification";
import type { GetCertificationQueryHandler } from "../application/certifications/get-certification";
import type { CertifyResultCommandHandler } from "../application/certifications/certify-result";
import type { RejectCertificationCommandHandler } from "../application/certifications/reject-certification";
import type { CreateRatificationCommandHandler } from "../application/certifications/create-ratification";
```

```ts
// apps/gov-api/src/context/app-context.ts
// add these sections inside AppHandlers

ballots: {
  create: CreateBallotCommandHandler;
  list: ListBallotsQueryHandler;
  getDetail: GetBallotDetailQueryHandler;
  open: OpenBallotCommandHandler;
  close: CloseBallotCommandHandler;
  cancel: CancelBallotCommandHandler;
  listEligibility: ListBallotEligibilityQueryHandler;
  listVotes: ListVotesQueryHandler;
  castVote: CastVoteCommandHandler;
  getTally: GetBallotTallyQueryHandler;
};

certifications: {
  create: CreateCertificationCommandHandler;
  get: GetCertificationQueryHandler;
  certify: CertifyResultCommandHandler;
  reject: RejectCertificationCommandHandler;
  createRatification: CreateRatificationCommandHandler;
};
```

That gives you the first proper validation layer for `gov-client` and the corresponding `gov-api` route layer for the ballot/certification workflow. The next strongest batch is route tests for these same endpoints so the client and API contracts harden together.
