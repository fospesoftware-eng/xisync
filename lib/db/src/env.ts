import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Loads the nearest `.env` file when `DATABASE_URL` is not already provided by
 * the real environment (Replit Secrets, CI, shell export, ...).
 *
 * There is no dotenv dependency in this workspace, so this relies on Node's
 * built-in `process.loadEnvFile` (Node >= 20.12).
 */
export function loadEnv(): void {
  if (process.env.DATABASE_URL) return;

  for (const candidate of [resolve(process.cwd(), '.env'), resolve(process.cwd(), '../../.env')]) {
    if (!existsSync(candidate)) continue;
    try {
      process.loadEnvFile(candidate);
    } catch {
      continue;
    }
    if (process.env.DATABASE_URL) return;
  }
}
