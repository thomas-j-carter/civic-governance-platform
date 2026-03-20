export function compileArchitectureSummary(inventory) {
    const appLines = inventory.apps.map((app) => `- ${app}`).join('\n') || '- none detected';
    const packageLines = inventory.packages.map((pkg) => `- ${pkg}`).join('\n') || '- none detected';
    return `# ARCHITECTURE_SUMMARY\n\n` +
        `## Runtime Surface\n` +
        `${appLines}\n\n` +
        `## Shared Packages\n` +
        `${packageLines}\n\n` +
        `## API Surface\n` +
        `Discovered ${inventory.apiEndpoints.length} endpoint candidate(s).\n\n` +
        `## Routing Surface\n` +
        `Discovered ${inventory.routes.length} route candidate(s).\n\n` +
        `## Data Surface\n` +
        `Discovered ${inventory.entities.length} entity candidate(s).\n`;
}
//# sourceMappingURL=compile-architecture-summary.js.map