import type { EngineConfig } from '../shared/types.js';
export declare function scanRepo(config: EngineConfig): Promise<{
    packages: string[];
    apps: string[];
    docs: string[];
}>;
