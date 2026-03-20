export function detectAdrCandidate(changedFiles: string[]): boolean {
  return changedFiles.some((file) => /(architecture|boundary|deploy|infra|auth|database|service)/i.test(file));
}
