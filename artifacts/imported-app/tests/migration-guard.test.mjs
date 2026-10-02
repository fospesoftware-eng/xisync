import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('the app no longer includes Supabase or demo-password sign-in', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.dependencies?.['@supabase/supabase-js'], undefined);
  assert.equal(existsSync(resolve(root, 'src/lib/supabase.ts')), false);
  assert.match(read('src/lib/auth-context.tsx'), /useReplitAuth/);
  assert.doesNotMatch(read('src/pages/auth/LoginPage.tsx'), /type=["']password["']|demo@/i);
});

test('workspace APIs derive scope from the authenticated profile', () => {
  const routes = read('../api-server/src/routes/xisync.ts');
  assert.match(routes, /function requireUser/);
  assert.match(routes, /getOrCreateWorkspace\(user\)/);
  assert.match(routes, /eq\(leadsTable\.tenantId, tenant\.id\)/);
  assert.match(routes, /eq\(conversationsTable\.tenantId, tenant\.id\)/);
});