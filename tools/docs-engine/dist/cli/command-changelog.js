import path from 'node:path';
import fg from 'fast-glob';
import { loadConfig } from '../config/load-config.js';
import { readText, writeText } from '../shared/fs.js';
import { logInfo, logWarn } from '../shared/logging.js';
import { generateChangelogEntry } from '../generators/generate-changelog-entry.js';
export async function runChangelogCommand() {
    const config = await loadConfig();
    const manifestFiles = await fg([`${config.changesRoot}/*.json`], { cwd: config.repoRoot, onlyFiles: true });
    if (manifestFiles.length === 0) {
        logWarn('No manifest files found.');
        return;
    }
    const manifests = [];
    for (const file of manifestFiles) {
        manifests.push(JSON.parse(await readText(path.join(config.repoRoot, file))));
    }
    const changelogPath = path.join(config.repoRoot, config.changelogRoot, 'unreleased.md');
    const header = '# Unreleased\n\n';
    const body = manifests
        .sort((a, b) => a.date.localeCompare(b.date))
        .map((manifest) => generateChangelogEntry(manifest))
        .join('\n');
    await writeText(changelogPath, header + body);
    logInfo(`Changelog updated at ${changelogPath}`);
}
//# sourceMappingURL=command-changelog.js.map