import path from 'node:path';
import { EngineConfig } from './types.js';

export function resolveFromRepo(config: EngineConfig, relativePath: string): string {
  return path.resolve(config.repoRoot, relativePath);
}

export function toRepoRelative(config: EngineConfig, absolutePath: string): string {
  return path.relative(config.repoRoot, absolutePath).replace(/\\/g, '/');
}
