export function logInfo(message: string): void {
  console.log(`[docs-engine] ${message}`);
}

export function logWarn(message: string): void {
  console.warn(`[docs-engine] WARN: ${message}`);
}

export function logError(message: string): void {
  console.error(`[docs-engine] ERROR: ${message}`);
}
