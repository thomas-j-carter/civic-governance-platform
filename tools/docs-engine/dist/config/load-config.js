import path from 'node:path';
import { buildDefaultConfig } from './defaults.js';
import { fileExists, readText } from '../shared/fs.js';
import { validateJsonSchema } from '../shared/json.js';
import schema from './docs-engine.config.schema.json' with { type: 'json' };
export async function loadConfig(repoRoot = process.cwd()) {
    const defaults = buildDefaultConfig(repoRoot);
    const configPath = path.join(repoRoot, 'docs-engine.config.json');
    if (!(await fileExists(configPath))) {
        return defaults;
    }
    const raw = await readText(configPath);
    const parsed = JSON.parse(raw);
    const validation = await validateJsonSchema(schema, parsed);
    if (!validation.ok) {
        throw new Error(`Invalid docs-engine.config.json:\n${validation.errors.join('\n')}`);
    }
    return { ...defaults, ...parsed };
}
//# sourceMappingURL=load-config.js.map