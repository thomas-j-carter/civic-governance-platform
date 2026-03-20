import type { RepoInventory } from '../shared/types.js';

export function compileRouteInventory(inventory: RepoInventory): string {
  return `# ROUTE_INVENTORY\n\n` +
    `Generated route inventory.\n\n` +
    inventory.routes.map((route) => `- ${route.path} — ${route.file}`).join('\n') + '\n';
}
