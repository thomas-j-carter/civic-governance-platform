import type { DriftReport, ImpactReport, RepoInventory } from '../shared/types.js';
export declare function compileCurrentStateSummary(inventory: RepoInventory, impact: ImpactReport, drift: DriftReport): string;
