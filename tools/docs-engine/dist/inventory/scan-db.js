import fg from 'fast-glob';
import path from 'node:path';
import { readText } from '../shared/fs.js';
import { toRepoRelative } from '../shared/paths.js';
export async function scanDb(config) {
    const files = await fg(['**/*.{prisma,sql,ts,tsx,js,jsx}'], {
        cwd: config.repoRoot,
        ignore: config.excludeGlobs,
        onlyFiles: true
    });
    const entities = [];
    for (const file of files) {
        const absolute = path.resolve(config.repoRoot, file);
        const content = await readText(absolute);
        for (const match of content.matchAll(/^model\s+(\w+)/gm)) {
            entities.push({ name: match[1], file: toRepoRelative(config, absolute), source: 'prisma' });
        }
        for (const match of content.matchAll(/(?:export\s+)?(?:interface|type|enum)\s+([A-Z][A-Za-z0-9_]+)/g)) {
            entities.push({ name: match[1], file: toRepoRelative(config, absolute), source: 'type' });
        }
        for (const match of content.matchAll(/create\s+table\s+(?:if\s+not\s+exists\s+)?(?:public\.)?(\w+)/gi)) {
            entities.push({ name: match[1], file: toRepoRelative(config, absolute), source: 'schema' });
        }
    }
    const unique = new Map();
    for (const entity of entities) {
        unique.set(`${entity.name}:${entity.file}:${entity.source}`, entity);
    }
    return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name) || a.file.localeCompare(b.file));
}
//# sourceMappingURL=scan-db.js.map