import path from 'node:path';
import { fileExists } from '../shared/fs.js';
export async function validateAiContext(config) {
    const required = [
        'PROJECT_CONTEXT.md',
        'ARCHITECTURE_SUMMARY.md',
        'REPO_BLUEPRINT.md',
        'CURRENT_STATE_SUMMARY.md',
        'KNOWN_GAPS.md'
    ];
    const errors = [];
    for (const file of required) {
        const exists = await fileExists(path.join(config.repoRoot, config.aiContextRoot, file));
        if (!exists)
            errors.push(`Missing AI context file: ${config.aiContextRoot}/${file}`);
    }
    return errors;
}
//# sourceMappingURL=validate-ai-context.js.map