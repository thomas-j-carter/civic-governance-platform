export function compileKnownGaps(drift) {
    return `# KNOWN_GAPS\n\n` +
        `## Errors\n` +
        `${drift.errors.map((error) => `- ${error}`).join('\n') || '- none'}\n\n` +
        `## Warnings\n` +
        `${drift.warnings.map((warning) => `- ${warning}`).join('\n') || '- none'}\n`;
}
//# sourceMappingURL=compile-known-gaps.js.map