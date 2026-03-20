import fg from 'fast-glob';
import path from 'node:path';
import { readText } from '../shared/fs.js';
import { toRepoRelative } from '../shared/paths.js';
const METHOD_PATTERN = /(get|post|put|patch|delete|options|head)\s*\(\s*['"`]([^'"`]+)['"`]/gi;
export async function scanApi(config) {
    const files = await fg(['apps/**/*.{ts,tsx,js,jsx}', 'packages/**/*.{ts,tsx,js,jsx}'], {
        cwd: config.repoRoot,
        ignore: config.excludeGlobs,
        onlyFiles: true
    });
    const endpoints = [];
    for (const file of files) {
        const absolute = path.resolve(config.repoRoot, file);
        const content = await readText(absolute);
        for (const match of content.matchAll(METHOD_PATTERN)) {
            endpoints.push({
                method: match[1].toUpperCase(),
                path: match[2],
                file: toRepoRelative(config, absolute)
            });
        }
    }
    return endpoints.sort((a, b) => a.path.localeCompare(b.path) || a.method.localeCompare(b.method));
}
//# sourceMappingURL=scan-api.js.map