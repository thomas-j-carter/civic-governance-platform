export function compileCurrentStateSummary(inventory, impact, drift) {
    return `# CURRENT_STATE_SUMMARY\n\n` +
        `## Inventory\n` +
        `- Docs: ${inventory.docs.length}\n` +
        `- Routes: ${inventory.routes.length}\n` +
        `- API endpoints: ${inventory.apiEndpoints.length}\n` +
        `- Entities: ${inventory.entities.length}\n\n` +
        `## Current Change Impact\n` +
        `- Changed files analyzed: ${impact.changedFiles.length}\n` +
        `- Impacted doc targets: ${impact.impactedDocs.length}\n` +
        `- ADR suggested: ${impact.adrSuggested ? 'yes' : 'no'}\n\n` +
        `## Drift\n` +
        `- Errors: ${drift.errors.length}\n` +
        `- Warnings: ${drift.warnings.length}\n`;
}
//# sourceMappingURL=compile-current-state-summary.js.map