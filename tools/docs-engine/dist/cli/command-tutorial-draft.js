import path from 'node:path';
import fg from 'fast-glob';
import { loadConfig } from '../config/load-config.js';
import { readText, writeText } from '../shared/fs.js';
import { logInfo, logWarn } from '../shared/logging.js';
import { generateBlogDraft } from '../generators/generate-blog-draft.js';
import { generateJournalEntry } from '../generators/generate-journal-entry.js';
import { generateTutorialDraft } from '../generators/generate-tutorial-draft.js';
export async function runTutorialDraftCommand() {
    const config = await loadConfig();
    const manifestFiles = await fg([`${config.changesRoot}/*.json`], { cwd: config.repoRoot, onlyFiles: true });
    if (manifestFiles.length === 0) {
        logWarn('No manifest files found.');
        return;
    }
    const newest = manifestFiles.sort().at(-1);
    if (!newest) {
        logWarn('No manifest files found after sorting.');
        return;
    }
    const manifest = JSON.parse(await readText(path.join(config.repoRoot, newest)));
    const slug = manifest.id;
    await Promise.all([
        writeText(path.join(config.repoRoot, config.tutorialsRoot, `${slug}.md`), generateTutorialDraft(manifest)),
        writeText(path.join(config.repoRoot, config.blogRoot, `${slug}.md`), generateBlogDraft(manifest)),
        writeText(path.join(config.repoRoot, config.journalRoot, `${manifest.date.slice(0, 10)}.md`), generateJournalEntry(manifest))
    ]);
    logInfo(`Tutorial, blog, and journal drafts generated for ${manifest.id}`);
}
//# sourceMappingURL=command-tutorial-draft.js.map