import path from 'node:path';
import { nowIso } from '../shared/dates.js';
import { writeJson } from '../shared/fs.js';
import type { EngineConfig, RepoInventory } from '../shared/types.js';
import { scanApi } from './scan-api.js';
import { scanDb } from './scan-db.js';
import { scanDocs } from './scan-docs.js';
import { scanEnv } from './scan-env.js';
import { scanRepo } from './scan-repo.js';
import { scanRoutes } from './scan-routes.js';

export async function buildInventory(config: EngineConfig): Promise<RepoInventory> {
  const repoScan = await scanRepo(config);
  const [routes, envVars, apiEndpoints, entities, docsIndex] = await Promise.all([
    scanRoutes(config),
    scanEnv(config),
    scanApi(config),
    scanDb(config),
    scanDocs(config)
  ]);

  const inventory: RepoInventory = {
    generatedAt: nowIso(),
    repoRoot: config.repoRoot,
    packages: repoScan.packages,
    apps: repoScan.apps,
    docs: repoScan.docs,
    routes,
    envVars,
    apiEndpoints,
    entities
  };

  const outputRoot = path.resolve(config.repoRoot, config.outputRoot);
  await Promise.all([
    writeJson(path.join(outputRoot, 'repo-inventory.json'), inventory),
    writeJson(path.join(outputRoot, 'docs-index.json'), docsIndex),
    writeJson(path.join(outputRoot, 'route-inventory.json'), routes),
    writeJson(path.join(outputRoot, 'env-inventory.json'), envVars),
    writeJson(path.join(outputRoot, 'api-inventory.json'), apiEndpoints),
    writeJson(path.join(outputRoot, 'entity-inventory.json'), entities)
  ]);

  return inventory;
}
