import type { ChangeManifest, EngineConfig } from '../shared/types.js';
export declare function buildManifest(config: EngineConfig, changedFiles: string[], explicitSummary?: string): Promise<ChangeManifest>;
