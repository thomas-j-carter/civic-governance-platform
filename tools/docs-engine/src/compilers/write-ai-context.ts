import path from 'node:path';
import type { DriftReport, EngineConfig, ImpactReport, RepoInventory } from '../shared/types.js';
import { writeText } from '../shared/fs.js';
import { compileArchitectureSummary } from './compile-architecture-summary.js';
import { compileCurrentStateSummary } from './compile-current-state-summary.js';
import { compileEntityInventory } from './compile-entity-inventory.js';
import { compileKnownGaps } from './compile-known-gaps.js';
import { compileProjectContext } from './compile-project-context.js';
import { compileRepoBlueprint } from './compile-repo-blueprint.js';
import { compileRouteInventory } from './compile-route-inventory.js';

export async function writeAiContext(config: EngineConfig, inventory: RepoInventory, impact: ImpactReport, drift: DriftReport): Promise<void> {
  const root = path.join(config.repoRoot, config.aiContextRoot);
  await Promise.all([
    writeText(path.join(root, 'PROJECT_CONTEXT.md'), compileProjectContext(config, inventory)),
    writeText(path.join(root, 'ARCHITECTURE_SUMMARY.md'), compileArchitectureSummary(inventory)),
    writeText(path.join(root, 'REPO_BLUEPRINT.md'), compileRepoBlueprint(inventory)),
    writeText(path.join(root, 'ROUTE_INVENTORY.md'), compileRouteInventory(inventory)),
    writeText(path.join(root, 'ENTITY_INVENTORY.md'), compileEntityInventory(inventory)),
    writeText(path.join(root, 'CURRENT_STATE_SUMMARY.md'), compileCurrentStateSummary(inventory, impact, drift)),
    writeText(path.join(root, 'KNOWN_GAPS.md'), compileKnownGaps(drift))
  ]);
}
