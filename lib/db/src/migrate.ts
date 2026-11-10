import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { migrate as runMigrations } from 'drizzle-orm/node-postgres/migrator';
import { readMigrationFiles } from 'drizzle-orm/migrator';
import { db, pool } from './index';

const migrationsFolder = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../migrations',
);

async function tableExists(qualifiedName: string): Promise<boolean> {
  const { rows } = await pool.query<{ reg: string | null }>(
    'select to_regclass($1)::text as reg',
    [qualifiedName],
  );
  return rows[0]?.reg != null;
}

/**
 * Databases created with the legacy `drizzle-kit push` hook already have all
 * tables but no migration journal. Record the baseline as applied so the
 * migrator does not try to recreate existing objects.
 */
async function baselinePushedSchema(): Promise<void> {
  if (!(await tableExists('public.tenants'))) return;

  if (await tableExists('drizzle.__drizzle_migrations')) {
    const { rows } = await pool.query<{ count: string }>(
      'select count(*)::text as count from drizzle.__drizzle_migrations',
    );
    if (Number(rows[0]?.count ?? 0) > 0) return;
  }

  await pool.query('create schema if not exists drizzle');
  await pool.query(`create table if not exists drizzle.__drizzle_migrations (
    id serial primary key,
    hash text not null,
    created_at bigint
  )`);

  for (const migration of readMigrationFiles({ migrationsFolder })) {
    await pool.query(
      'insert into drizzle.__drizzle_migrations (hash, created_at) values ($1, $2)',
      [migration.hash, migration.folderMillis],
    );
  }
  console.log('[db:migrate] Existing schema found; recorded the baseline as applied.');
}

async function main(): Promise<void> {
  await baselinePushedSchema();
  await runMigrations(db, { migrationsFolder });
  console.log('[db:migrate] Schema is up to date.');
}

main()
  .catch((error: unknown) => {
    console.error('[db:migrate] Migration failed:', error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
