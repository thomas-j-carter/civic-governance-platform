import fg from 'fast-glob';
import path from 'node:path';
import { readText } from '../shared/fs.js';
import { toRepoRelative } from '../shared/paths.js';
export async function scanEnv(config) {
    const files = await fg(['**/*.{ts,tsx,js,jsx,mjs,cjs,env,md}'], {
        cwd: config.repoRoot,
        ignore: config.excludeGlobs,
        onlyFiles: true
    });
    const found = new Map();
    for (const file of files) {
        const absolute = path.resolve(config.repoRoot, file);
        const content = await readText(absolute);
        for (const match of content.matchAll(/(?:process\.env|import\.meta\.env)\.([A-Z][A-Z0-9_]+)/g)) {
            const name = match[1];
            const key = `${name}:${file}`;
            found.set(key, { name, file: toRepoRelative(config, absolute) });
        }
    }
    return [...found.values()].sort((a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file));
}
//# sourceMappingURL=scan-env.js.map