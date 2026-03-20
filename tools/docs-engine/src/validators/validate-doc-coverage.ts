import type { DriftReport, RepoInventory } from '../shared/types.js';

export async function validateDocCoverage(inventory: RepoInventory, drift: DriftReport): Promise<string[]> {
  const warnings: string[] = [];
  if (inventory.envVars.length > 0 && drift.warnings.some((warning) => warning.includes('Environment variable'))) {
    warnings.push('Environment variable coverage is incomplete.');
  }
  if (inventory.routes.length > 0 && drift.warnings.some((warning) => warning.includes('Route '))) {
    warnings.push('Route coverage is incomplete.');
  }
  return warnings;
}
