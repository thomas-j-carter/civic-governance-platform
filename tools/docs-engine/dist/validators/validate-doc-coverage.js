export async function validateDocCoverage(inventory, drift) {
    const warnings = [];
    if (inventory.envVars.length > 0 && drift.warnings.some((warning) => warning.includes('Environment variable'))) {
        warnings.push('Environment variable coverage is incomplete.');
    }
    if (inventory.routes.length > 0 && drift.warnings.some((warning) => warning.includes('Route '))) {
        warnings.push('Route coverage is incomplete.');
    }
    return warnings;
}
//# sourceMappingURL=validate-doc-coverage.js.map