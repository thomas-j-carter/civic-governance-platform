import path from 'node:path';
import { writeJson } from '../shared/fs.js';
export async function writeManifest(config, manifest) {
    const fileName = `${manifest.id}.json`;
    const filePath = path.join(config.repoRoot, config.changesRoot, fileName);
    await writeJson(filePath, manifest);
    return filePath;
}
//# sourceMappingURL=write-manifest.js.map