// FILE: packages/gov-client/src/client/config.ts

export type AccessTokenProvider = () => Promise<string | null> | string | null;

export interface GovClientConfig {
  baseUrl: string;
  getAccessToken?: AccessTokenProvider;
  fetchImpl?: typeof fetch;
  defaultHeaders?: Record<string, string>;
  timeoutMs?: number;
}

export interface ResolvedGovClientConfig {
  baseUrl: string;
  getAccessToken?: AccessTokenProvider;
  fetchImpl: typeof fetch;
  defaultHeaders: Record<string, string>;
  timeoutMs: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

export function resolveGovClientConfig(config: GovClientConfig): ResolvedGovClientConfig {
  if (!config.baseUrl || !config.baseUrl.trim()) {
    throw new Error("GovClientConfig.baseUrl is required.");
  }

  const fetchImpl = config.fetchImpl ?? globalThis.fetch;
  if (!fetchImpl) {
    throw new Error(
      "No fetch implementation available. Provide GovClientConfig.fetchImpl in this runtime.",
    );
  }

  return {
    baseUrl: stripTrailingSlash(config.baseUrl),
    getAccessToken: config.getAccessToken,
    fetchImpl,
    defaultHeaders: config.defaultHeaders ?? {},
    timeoutMs: config.timeoutMs ?? DEFAULT_TIMEOUT_MS,
  };
}

export function stripTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}