import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('the app no longer includes Supabase demo-password scaffolding', () => {
  const packageJson = JSON.parse(read('package.json'));
  assert.equal(packageJson.dependencies?.['@supabase/supabase-js'], undefined);
  assert.equal(existsSync(resolve(root, 'src/lib/supabase.ts')), false);
  assert.match(read('src/lib/auth-context.tsx'), /useReplitAuth/);

  const loginPage = read('src/pages/auth/LoginPage.tsx');
  assert.match(loginPage, /\/api\/auth\/login/);
  assert.match(loginPage, /type="password"/);
  // Email/password is the only entry point in the UI; OIDC routes stay server-side.
  assert.doesNotMatch(loginPage, /continue securely|安全继续/i);
  assert.doesNotMatch(loginPage, /onClick=\{signIn\}/);
  // Credentials live in the seed/API only; the UI must never embed them.
  assert.doesNotMatch(loginPage, /Xisync#2026Admin/);
  assert.doesNotMatch(loginPage, /demo@/i);
});

test('registration hands off to the credentials login', () => {
  const registerPage = read('src/pages/auth/RegisterPage.tsx');
  assert.match(registerPage, /to="\/login"/);
  // No client-side entry point may start the Replit OIDC redirect.
  assert.doesNotMatch(registerPage, /useAuth|signIn|\/api\/login|onClick=/);
  assert.doesNotMatch(read('src/pages/auth/LoginPage.tsx'), /\/api\/login|onClick=\{signIn\}/);
});

test('workspace APIs derive scope from the authenticated profile', () => {
  const routes = read('../api-server/src/routes/xisync.ts');
  assert.match(routes, /function requireUser/);
  assert.match(routes, /getOrCreateWorkspace\(user\)/);
  assert.match(routes, /eq\(leadsTable\.tenantId, tenant\.id\)/);
  assert.match(routes, /eq\(conversationsTable\.tenantId, tenant\.id\)/);
});