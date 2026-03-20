export function compileRouteInventory(inventory) {
    return `# ROUTE_INVENTORY\n\n` +
        `Generated route inventory.\n\n` +
        inventory.routes.map((route) => `- ${route.path} — ${route.file}`).join('\n') + '\n';
}
//# sourceMappingURL=compile-route-inventory.js.map