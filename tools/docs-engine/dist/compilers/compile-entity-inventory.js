export function compileEntityInventory(inventory) {
    return `# ENTITY_INVENTORY\n\n` +
        inventory.entities.map((entity) => `- ${entity.name} (${entity.source}) — ${entity.file}`).join('\n') + '\n';
}
//# sourceMappingURL=compile-entity-inventory.js.map