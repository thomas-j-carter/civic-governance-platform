import path from 'node:path';
import type { ChangeManifest, EngineConfig } from '../shared/types.js';
import { writeJson } from '../shared/fs.js';

export async function writeManifest(config: EngineConfig, manifest: ChangeManifest): Promise<string> {
  const fileName = `${manifest.id}.json`;
  const filePath = path.join(config.repoRoot, config.changesRoot, fileName);
  await writeJson(filePath, manifest);
  return filePath;
}
