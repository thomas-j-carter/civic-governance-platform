import { loadConfig } from '../config/load-config.js';
import { buildInventory } from '../inventory/build-inventory.js';
import { logInfo } from '../shared/logging.js';

export async function runInventoryCommand(): Promise<void> {
  const config = await loadConfig();
  const inventory = await buildInventory(config);
  logInfo(`Inventory built. apps=${inventory.apps.length} packages=${inventory.packages.length} docs=${inventory.docs.length}`);
}
