export function nowIso(): string {
  return new Date().toISOString();
}

export function timestampId(): string {
  return nowIso().replace(/[:.]/g, '').replace(/-/g, '').replace('T', 'T').replace('Z', 'Z');
}
