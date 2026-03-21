// apps/gov-api/src/application/shared/pagination.ts

export interface PageInput {
  page: number;
  limit: number;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function parsePageInput(input: {
  page?: string;
  limit?: string;
  defaultLimit?: number;
  maxLimit?: number;
}): PageInput {
  const defaultLimit = input.defaultLimit ?? 20;
  const maxLimit = input.maxLimit ?? 100;

  const page = Math.max(1, Number.parseInt(input.page ?? "1", 10) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, Number.parseInt(input.limit ?? String(defaultLimit), 10) || defaultLimit),
  );

  return { page, limit };
}