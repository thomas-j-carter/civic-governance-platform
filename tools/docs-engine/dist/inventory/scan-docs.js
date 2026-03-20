import fg from 'fast-glob';
import path from 'node:path';
import { extractMarkdownHeadings, extractMarkdownLinks, extractMarkdownTitle } from '../shared/markdown.js';
import { readText } from '../shared/fs.js';
import { toRepoRelative } from '../shared/paths.js';
import { nowIso } from '../shared/dates.js';
export async function scanDocs(config) {
    const files = await fg([`${config.docsRoot}/**/*.md`, 'README.md', 'CONTRIBUTING.md'], {
        cwd: config.repoRoot,
        ignore: config.excludeGlobs,
        onlyFiles: true,
        suppressErrors: true
    });
    const docs = await Promise.all(files.map(async (file) => {
        const absolutePath = path.resolve(config.repoRoot, file);
        const markdown = await readText(absolutePath);
        return {
            path: toRepoRelative(config, absolutePath),
            title: extractMarkdownTitle(markdown),
            headings: extractMarkdownHeadings(markdown),
            links: extractMarkdownLinks(markdown)
        };
    }));
    return {
        generatedAt: nowIso(),
        docs: docs.sort((a, b) => a.path.localeCompare(b.path))
    };
}
//# sourceMappingURL=scan-docs.js.map