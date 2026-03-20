import type { DriftReport, EngineConfig, ImpactReport, RepoInventory } from '../shared/types.js';
export declare function writeAiContext(config: EngineConfig, inventory: RepoInventory, impact: ImpactReport, drift: DriftReport): Promise<void>;
