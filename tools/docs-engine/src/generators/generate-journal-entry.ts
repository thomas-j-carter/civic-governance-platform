import type { ChangeManifest } from '../shared/types.js';

export function generateJournalEntry(manifest: ChangeManifest): string {
  return `# ${manifest.date.slice(0, 10)}\n\n` +
    `Worked on: ${manifest.summary}\n\n` +
    `Observed documentation impacts:\n${manifest.doc_impacts.map((doc) => `- ${doc}`).join('\n')}\n`;
}
