export function generateReleaseNote(manifests) {
    return `# Release Notes\n\n` + manifests.map((manifest) => `- ${manifest.summary}`).join('\n') + '\n';
}
//# sourceMappingURL=generate-release-note.js.map