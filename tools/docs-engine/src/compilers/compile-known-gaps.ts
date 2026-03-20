import type { DriftReport } from '../shared/types.js';

export function compileKnownGaps(drift: DriftReport): string {
  return `# KNOWN_GAPS\n\n` +
    `## Errors\n` +
    `${drift.errors.map((error) => `- ${error}`).join('\n') || '- none'}\n\n` +
    `## Warnings\n` +
    `${drift.warnings.map((warning) => `- ${warning}`).join('\n') || '- none'}\n`;
}
