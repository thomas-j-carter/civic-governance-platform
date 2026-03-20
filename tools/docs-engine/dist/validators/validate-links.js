import path from 'node:path';
import { fileExists } from '../shared/fs.js';
export async function validateLinks(config, docsIndex) {
    const errors = [];
    for (const doc of docsIndex.docs) {
        for (const link of doc.links) {
            if (/^https?:\/\//.test(link) || link.startsWith('#') || link.startsWith('mailto:'))
                continue;
            const normalized = link.split('#')[0];
            if (!normalized)
                continue;
            const candidate = path.resolve(config.repoRoot, path.dirname(doc.path), normalized);
            if (!(await fileExists(candidate))) {
                errors.push(`Broken link in ${doc.path}: ${link}`);
            }
        }
    }
    return errors;
}
//# sourceMappingURL=validate-links.js.map