import fg from 'fast-glob';
import path from 'node:path';
import { readText } from '../shared/fs.js';
import { toRepoRelative } from '../shared/paths.js';
import type { EngineConfig, RouteInventory } from '../shared/types.js';

function routeFromFile(file: string): string | null {
  const normalized = file.replace(/\\/g, '/');
  const match = normalized.match(/(?:routes|pages|app)\/(.+)\.(tsx|ts|jsx|js)$/);
  if (!match) return null;
  let route = `/${match[1]}`
    .replace(/\/index$/, '')
    .replace(/\[(.+?)\]/g, ':$1')
    .replace(/\/route$/, '')
    .replace(/\/page$/, '');
  route = route.replace(/\/+/g, '/');
  return route === '' ? '/' : route;
}

export async function scanRoutes(config: EngineConfig): Promise<RouteInventory[]> {
  const files = await fg(['apps/**/*.{ts,tsx,js,jsx}'], {
    cwd: config.repoRoot,
    ignore: config.excludeGlobs,
    onlyFiles: true
  });

  const results: RouteInventory[] = [];
  for (const file of files) {
    const route = routeFromFile(file);
    if (route) {
      results.push({ path: route, file, kind: 'filesystem' });
      continue;
    }
    const absolute = path.resolve(config.repoRoot, file);
    const content = await readText(absolute);
    for (const match of content.matchAll(/(?:route|path)\s*[:=]\s*['"]([^'"]+)['"]/g)) {
      results.push({ path: match[1], file: toRepoRelative(config, absolute), kind: 'code' });
    }
  }

  return results.sort((a, b) => a.path.localeCompare(b.path) || a.file.localeCompare(b.file));
}
