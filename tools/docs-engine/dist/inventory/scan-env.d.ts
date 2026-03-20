import type { EngineConfig, EnvVarInventory } from '../shared/types.js';
export declare function scanEnv(config: EngineConfig): Promise<EnvVarInventory[]>;
