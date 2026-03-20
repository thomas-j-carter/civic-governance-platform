import fg from 'fast-glob';
import path from 'node:path';
import { toRepoRelative } from '../shared/paths.js';
export async function scanRepo(config) {
    const [packageJsons, docs] = await Promise.all([
        fg(['apps/*/package.json', 'packages/*/package.json', 'tools/*/package.json'], {
            cwd: config.repoRoot,
            ignore: config.excludeGlobs,
            onlyFiles: true
        }),
        fg([`${config.docsRoot}/**/*.md`, `${config.docsRoot}/**/*.yaml`, `${config.docsRoot}/**/*.yml`], {
            cwd: config.repoRoot,
            ignore: config.excludeGlobs,
            onlyFiles: true
        })
    ]);
    const packages = packageJsons.filter((file) => file.startsWith('packages/'));
    const apps = packageJsons.filter((file) => file.startsWith('apps/'));
    return {
        packages: packages.map((file) => path.dirname(file)).sort(),
        apps: apps.map((file) => path.dirname(file)).sort(),
        docs: docs.map((file) => toRepoRelative(config, path.resolve(config.repoRoot, file))).sort()
    };
}
//# sourceMappingURL=scan-repo.js.map