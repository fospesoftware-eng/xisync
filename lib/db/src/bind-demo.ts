import { eq } from 'drizzle-orm';
import { db, pool, profilesTable, tenantsTable, usersTable } from './index';

/**
 * Points an existing login at the seeded demo workspace. The app derives the
 * tenant from `profiles.tenant_id`, so a brand-new Replit login otherwise gets
 * its own empty workspace instead of the demo data.
 *
 * Usage: pnpm --filter @workspace/db bind <email-or-profile-id>
 */
async function main(): Promise<void> {
  const target = process.argv[2];
  if (!target) {
    console.error('Usage: pnpm --filter @workspace/db bind <email-or-profile-id>');
    process.exitCode = 1;
    return;
  }

  const [tenant] = await db
    .select()
    .from(tenantsTable)
    .where(eq(tenantsTable.slug, 'lumen-trading'))
    .limit(1);
  if (!tenant) {
    console.error('Demo workspace not found. Run `pnpm --filter @workspace/db seed` first.');
    process.exitCode = 1;
    return;
  }

  let [profile] = await db
    .select()
    .from(profilesTable)
    .where(eq(profilesTable.id, target))
    .limit(1);

  if (!profile) {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, target)).limit(1);
    if (user) {
      [profile] = await db
        .select()
        .from(profilesTable)
        .where(eq(profilesTable.id, user.id))
        .limit(1);
    }
  }

  if (!profile) {
    console.error(
      `No profile found for "${target}". Sign in to the app once (so the profile row exists), then run this again.`,
    );
    process.exitCode = 1;
    return;
  }

  await db
    .update(profilesTable)
    .set({ tenantId: tenant.id, updatedAt: new Date() })
    .where(eq(profilesTable.id, profile.id));

  console.log(
    `Bound profile ${profile.id} (${profile.fullName ?? 'unnamed'}) to ${tenant.name} [${tenant.slug}].`,
  );
}

main()
  .catch((error: unknown) => {
    console.error('[db:bind] Failed:', error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
