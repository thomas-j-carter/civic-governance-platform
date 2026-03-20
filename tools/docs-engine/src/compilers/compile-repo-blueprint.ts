import type { RepoInventory } from '../shared/types.js';

export function compileRepoBlueprint(inventory: RepoInventory): string {
  return `# REPO_BLUEPRINT\n\n` +
    `## Apps\n${inventory.apps.map((v) => `- ${v}`).join('\n') || '- none'}\n\n` +
    `## Packages\n${inventory.packages.map((v) => `- ${v}`).join('\n') || '- none'}\n\n` +
    `## Canonical Docs\n${inventory.docs.slice(0, 50).map((v) => `- ${v}`).join('\n') || '- none'}\n`;
}
