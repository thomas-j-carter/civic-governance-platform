export function generateTutorialDraft(manifest) {
    return `# Tutorial Draft — ${manifest.summary}\n\n` +
        `## Audience\nEngineers extending the affected area.\n\n` +
        `## What changed\n${manifest.summary}\n\n` +
        `## Files touched\n${manifest.files_changed.map((file) => `- ${file}`).join('\n')}\n\n` +
        `## Docs to update\n${manifest.doc_impacts.map((doc) => `- ${doc}`).join('\n')}\n`;
}
//# sourceMappingURL=generate-tutorial-draft.js.map