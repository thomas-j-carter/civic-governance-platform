export async function validateReferences(inventory) {
    const warnings = [];
    if (inventory.routes.length > 0 && inventory.docs.length === 0) {
        warnings.push('Routes were discovered, but no docs were discovered.');
    }
    if (inventory.apiEndpoints.length > 0 && inventory.entities.length === 0) {
        warnings.push('API endpoints were discovered, but no entity candidates were discovered.');
    }
    return warnings;
}
//# sourceMappingURL=validate-references.js.map