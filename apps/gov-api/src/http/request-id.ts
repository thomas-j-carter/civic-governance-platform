// apps/gov-api/src/http/request-id.ts

export function createRequestId(): string {
  return crypto.randomUUID();
}