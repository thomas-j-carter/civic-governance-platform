// FILE: packages/gov-client/src/utils/pagination.ts

export interface PaginationEnvelope {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface Paginated<T> extends PaginationEnvelope {
  items: T[];
}

export interface ApiListEnvelope<T> {
  data: T[];
  pagination: PaginationEnvelope;
}

export function unwrapPaginated<T>(input: ApiListEnvelope<T>): Paginated<T> {
  return {
    items: input.data,
    page: input.pagination.page,
    limit: input.pagination.limit,
    total: input.pagination.total,
    totalPages: input.pagination.totalPages,
  };
}