import type { EngineConfig, RepoInventory } from '../shared/types.js';

export function compileProjectContext(config: EngineConfig, inventory: RepoInventory): string {
  return `# PROJECT_CONTEXT\n\n` +
    `## Purpose\n` +
    `This project uses docs-engine to keep documentation, inventories, AI context, and drift checks synchronized.\n\n` +
    `## Repository Snapshot\n` +
    `- Apps discovered: ${inventory.apps.length}\n` +
    `- Packages discovered: ${inventory.packages.length}\n` +
    `- Docs discovered: ${inventory.docs.length}\n` +
    `- Routes discovered: ${inventory.routes.length}\n` +
    `- Env vars discovered: ${inventory.envVars.length}\n` +
    `- API endpoints discovered: ${inventory.apiEndpoints.length}\n` +
    `- Entities discovered: ${inventory.entities.length}\n\n` +
    `## Source of Truth\n` +
    `Canonical truth lives in README.md and docs/00-vision through docs/08-operations. AI context files are derived artifacts.\n\n` +
    `## Engine Roots\n` +
    `- docs root: ${config.docsRoot}\n` +
    `- AI context root: ${config.aiContextRoot}\n` +
    `- changelog root: ${config.changelogRoot}\n` +
    `- changes root: ${config.changesRoot}\n`;
}
