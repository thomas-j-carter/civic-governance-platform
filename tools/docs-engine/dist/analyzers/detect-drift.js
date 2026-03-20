import path from 'node:path';
import { fileExists, readText, writeJson } from '../shared/fs.js';
import { nowIso } from '../shared/dates.js';
export async function detectDrift(config, inventory) {
    const warnings = [];
    const errors = [];
    const envReferencePath = path.join(config.repoRoot, config.aiContextRoot, 'ENVIRONMENT_VARIABLE_REFERENCE.md');
    if (await fileExists(envReferencePath)) {
        const envReference = await readText(envReferencePath);
        for (const envVar of inventory.envVars) {
            if (!envReference.includes(envVar.name)) {
                warnings.push(`Environment variable ${envVar.name} appears in code but not in ${config.aiContextRoot}/ENVIRONMENT_VARIABLE_REFERENCE.md`);
            }
        }
    }
    const routeInventoryPath = path.join(config.repoRoot, config.aiContextRoot, 'ROUTE_INVENTORY.md');
    if (await fileExists(routeInventoryPath)) {
        const routeInventory = await readText(routeInventoryPath);
        for (const route of inventory.routes) {
            if (!routeInventory.includes(route.path)) {
                warnings.push(`Route ${route.path} appears in code but not in ${config.aiContextRoot}/ROUTE_INVENTORY.md`);
            }
        }
    }
    const openApiPath = path.join(config.repoRoot, config.docsRoot, '06-api', 'openapi.yaml');
    if (!(await fileExists(openApiPath)) && inventory.apiEndpoints.length > 0) {
        errors.push('API endpoints were discovered, but docs/06-api/openapi.yaml is missing.');
    }
    const report = {
        generatedAt: nowIso(),
        warnings,
        errors
    };
    await writeJson(path.join(config.repoRoot, config.outputRoot, 'drift-report.json'), report);
    return report;
}
//# sourceMappingURL=detect-drift.js.map