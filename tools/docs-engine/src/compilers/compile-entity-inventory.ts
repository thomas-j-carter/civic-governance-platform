import type { RepoInventory } from '../shared/types.js';

export function compileEntityInventory(inventory: RepoInventory): string {
  return `# ENTITY_INVENTORY\n\n` +
    inventory.entities.map((entity) => `- ${entity.name} (${entity.source}) — ${entity.file}`).join('\n') + '\n';
}
