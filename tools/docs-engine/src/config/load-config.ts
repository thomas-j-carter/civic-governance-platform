import path from 'node:path';
import { buildDefaultConfig } from './defaults.js';
import { fileExists, readText } from '../shared/fs.js';
import { validateJsonSchema } from '../shared/json.js';
import type { EngineConfig } from '../shared/types.js';
import schema from './docs-engine.config.schema.json' with { type: 'json' };

export async function loadConfig(repoRoot = process.cwd()): Promise<EngineConfig> {
  const defaults = buildDefaultConfig(repoRoot);
  const configPath = path.join(repoRoot, 'docs-engine.config.json');
  if (!(await fileExists(configPath))) {
    return defaults;
  }

  const raw = await readText(configPath);
  const parsed = JSON.parse(raw) as Partial<EngineConfig>;
  const validation = await validateJsonSchema(schema as object, parsed);
  if (!validation.ok) {
    throw new Error(`Invalid docs-engine.config.json:\n${validation.errors.join('\n')}`);
  }

  return { ...defaults, ...parsed };
}
