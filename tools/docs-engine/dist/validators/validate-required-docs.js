import path from 'node:path';
import { fileExists } from '../shared/fs.js';
export async function validateRequiredDocs(config) {
    const errors = [];
    for (const requiredDoc of config.requiredDocs) {
        const exists = await fileExists(path.join(config.repoRoot, requiredDoc));
        if (!exists) {
            errors.push(`Missing required doc: ${requiredDoc}`);
        }
    }
    return errors;
}
//# sourceMappingURL=validate-required-docs.js.map