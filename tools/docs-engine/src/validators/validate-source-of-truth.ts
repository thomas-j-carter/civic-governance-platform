import path from 'node:path';
import type { EngineConfig } from '../shared/types.js';
import { fileExists, readText } from '../shared/fs.js';

export async function validateSourceOfTruth(config: EngineConfig): Promise<string[]> {
  const errors: string[] = [];
  const policyPath = path.join(config.repoRoot, 'docs', 'SOURCE_OF_TRUTH_POLICY.md');
  if (!(await fileExists(policyPath))) {
    errors.push('Missing docs/SOURCE_OF_TRUTH_POLICY.md');
    return errors;
  }

  const content = await readText(policyPath);
  for (const root of config.sourceOfTruthRoots) {
    if (!content.includes(root)) {
      errors.push(`SOURCE_OF_TRUTH_POLICY.md does not mention canonical root: ${root}`);
    }
  }
  return errors;
}
