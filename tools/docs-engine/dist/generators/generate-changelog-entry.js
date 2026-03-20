export function generateChangelogEntry(manifest) {
    const lines = [
        `## ${manifest.date.slice(0, 10)} — ${manifest.summary}`,
        '',
        `- Type: ${manifest.type}`,
        `- Status: ${manifest.status}`,
        `- Domains: ${manifest.domains.join(', ') || 'none'}`,
        `- Breaking: ${manifest.breaking ? 'yes' : 'no'}`,
        `- Migration required: ${manifest.migration_required ? 'yes' : 'no'}`,
        `- User visible: ${manifest.user_visible ? 'yes' : 'no'}`,
        `- Ops impact: ${manifest.ops_impact ? 'yes' : 'no'}`,
        '',
        `### Changed files`,
        ...manifest.files_changed.map((file) => `- ${file}`),
        '',
        `### Impacted docs`,
        ...manifest.doc_impacts.map((doc) => `- ${doc}`)
    ];
    if (manifest.notes?.length) {
        lines.push('', '### Notes', ...manifest.notes.map((note) => `- ${note}`));
    }
    return `${lines.join('\n')}\n`;
}
//# sourceMappingURL=generate-changelog-entry.js.map