import type { DriftReport, EngineConfig, RepoInventory } from '../shared/types.js';
export declare function detectDrift(config: EngineConfig, inventory: RepoInventory): Promise<DriftReport>;
