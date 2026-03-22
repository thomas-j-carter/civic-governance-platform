// FILE: packages/gov-client/src/client/transport.ts

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

async function parseResponseBody(response: Response): Promise<unknown> {
  if (response.status === 204) {
    return undefined;
  }

  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    const text = await response.text();
    return text ? { raw: text } : undefined;
  }

  return response.json();
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