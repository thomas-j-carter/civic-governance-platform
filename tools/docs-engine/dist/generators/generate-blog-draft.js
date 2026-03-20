export function generateBlogDraft(manifest) {
    return `# ${manifest.summary}\n\n` +
        `Today we updated the system in the following areas: ${manifest.domains.join(', ') || 'general platform work'}.\n\n` +
        `Key implementation files:\n${manifest.files_changed.map((file) => `- ${file}`).join('\n')}\n`;
}
//# sourceMappingURL=generate-blog-draft.js.map