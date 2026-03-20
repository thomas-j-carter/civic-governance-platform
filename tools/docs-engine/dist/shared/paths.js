import path from 'node:path';
export function resolveFromRepo(config, relativePath) {
    return path.resolve(config.repoRoot, relativePath);
}
export function toRepoRelative(config, absolutePath) {
    return path.relative(config.repoRoot, absolutePath).replace(/\\/g, '/');
}
//# sourceMappingURL=paths.js.map