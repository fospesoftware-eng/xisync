import test from 'node:test';
import assert from 'node:assert/strict';
import { createUnavailableSupabase, connectionError } from '../src/lib/unavailable-supabase.ts';

test('missing connection keeps visitors signed out and reports the configuration error', async () => {
  const client = createUnavailableSupabase();
  const result = await client.auth.getSession();
  assert.equal(result.data.session, null);
  assert.equal(result.error, connectionError);
  client.auth.onAuthStateChange().data.subscription.unsubscribe();
});

test('live login and registration cannot succeed without a connection', async () => {
  const client = createUnavailableSupabase();
  assert.equal((await client.auth.signInWithPassword({})).error, connectionError);
  const result = await client.auth.signUp({});
  assert.equal(result.data.user, null);
  assert.equal(result.error, connectionError);
});

test('queries and mutations explicitly fail instead of returning fake or saved data', async () => {
  const client = createUnavailableSupabase();
  for (const query of [
    client.from('leads').select('*').eq('tenant_id', 'example').order('created_at').limit(5),
    client.from('leads').insert({ company_name: 'Example' }).select().single(),
    client.from('leads').update({ company_name: 'Changed' }).eq('id', 'example'),
    client.from('leads').delete().eq('id', 'example'),
  ]) {
    const result = await query;
    assert.equal(result.data, null);
    assert.equal(result.error, connectionError);
  }
});