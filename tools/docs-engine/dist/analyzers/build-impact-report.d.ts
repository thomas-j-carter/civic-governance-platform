import type { EngineConfig, ImpactReport } from '../shared/types.js';
export declare function buildImpactReport(config: EngineConfig, changedFiles: string[]): Promise<ImpactReport>;
