import fg from 'fast-glob';
import path from 'node:path';
import schema from '../schemas/change-manifest.schema.json' with { type: 'json' };
import { readText } from '../shared/fs.js';
import { validateJsonSchema } from '../shared/json.js';
export async function validateManifests(config) {
    const files = await fg([`${config.changesRoot}/*.json`], {
        cwd: config.repoRoot,
        onlyFiles: true,
        ignore: config.excludeGlobs
    });
    const errors = [];
    for (const file of files) {
        const raw = await readText(path.resolve(config.repoRoot, file));
        const parsed = JSON.parse(raw);
        const result = await validateJsonSchema(schema, parsed);
        if (!result.ok) {
            errors.push(`Invalid manifest ${file}: ${result.errors.join('; ')}`);
        }
    }
    return errors;
}
//# sourceMappingURL=validate-manifests.js.map