import path from 'node:path';
import type { EngineConfig } from '../shared/types.js';
import { fileExists } from '../shared/fs.js';

export async function validateAiContext(config: EngineConfig): Promise<string[]> {
  const required = [
    'PROJECT_CONTEXT.md',
    'ARCHITECTURE_SUMMARY.md',
    'REPO_BLUEPRINT.md',
    'CURRENT_STATE_SUMMARY.md',
    'KNOWN_GAPS.md'
  ];

  const errors: string[] = [];
  for (const file of required) {
    const exists = await fileExists(path.join(config.repoRoot, config.aiContextRoot, file));
    if (!exists) errors.push(`Missing AI context file: ${config.aiContextRoot}/${file}`);
  }
  return errors;
}
