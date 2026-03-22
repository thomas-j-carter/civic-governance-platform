// FILE: packages/gov-client/src/client/request.ts

export type PrimitiveQueryValue = string | number | boolean | null | undefined;
export type QueryValue = PrimitiveQueryValue | PrimitiveQueryValue[];

export type QueryParams = Record<string, QueryValue>;

export function buildUrl(
  baseUrl: string,
  path: string,
  query?: QueryParams,
): string {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const url = new URL(`${baseUrl}${normalizedPath}`);

  if (query) {
    appendQueryParams(url.searchParams, query);
  }

  return url.toString();
}

export function appendQueryParams(
  searchParams: URLSearchParams,
  query: QueryParams,
): void {
  for (const [key, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const entry of value) {
        if (entry !== null && entry !== undefined) {
          searchParams.append(key, String(entry));
        }
      }
      continue;
    }

    if (value !== null && value !== undefined) {
      searchParams.set(key, String(value));
    }
  }
}