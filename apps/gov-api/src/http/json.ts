// apps/gov-api/src/http/json.ts

export function jsonData<T>(data: T): { data: T } {
  return { data };
}

export function jsonList<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number; totalPages: number },
): { data: T[]; pagination: { page: number; limit: number; total: number; totalPages: number } } {
  return { data, pagination };
}