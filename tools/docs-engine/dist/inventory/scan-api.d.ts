import type { ApiEndpointInventory, EngineConfig } from '../shared/types.js';
export declare function scanApi(config: EngineConfig): Promise<ApiEndpointInventory[]>;
