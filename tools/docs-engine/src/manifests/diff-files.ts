import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

export async function diffFiles(repoRoot: string): Promise<string[]> {
  try {
    const [{ stdout: staged }, { stdout: unstaged }] = await Promise.all([
      execFileAsync('git', ['diff', '--cached', '--name-only'], { cwd: repoRoot }),
      execFileAsync('git', ['diff', '--name-only'], { cwd: repoRoot })
    ]);
    return [...new Set(`${staged}\n${unstaged}`.split('\n').map((line) => line.trim()).filter(Boolean))].sort();
  } catch {
    return [];
  }
}
