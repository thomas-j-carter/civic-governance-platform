import path from 'node:path';
import type { EngineConfig } from '../shared/types.js';
import { fileExists } from '../shared/fs.js';

export async function validateRequiredDocs(config: EngineConfig): Promise<string[]> {
  const errors: string[] = [];
  for (const requiredDoc of config.requiredDocs) {
    const exists = await fileExists(path.join(config.repoRoot, requiredDoc));
    if (!exists) {
      errors.push(`Missing required doc: ${requiredDoc}`);
    }
  }
  return errors;
}
