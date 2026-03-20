import type { ChangeManifest } from '../shared/types.js';

export function generateReleaseNote(manifests: ChangeManifest[]): string {
  return `# Release Notes\n\n` + manifests.map((manifest) => `- ${manifest.summary}`).join('\n') + '\n';
}
