import type { DriftReport, RepoInventory } from '../shared/types.js';
export declare function validateDocCoverage(inventory: RepoInventory, drift: DriftReport): Promise<string[]>;
