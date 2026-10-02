import {
  CreateXiSyncLeadBody,
  CreateXiSyncLeadResponse,
  GetXiSyncWorkspaceContextResponse,
  GetXiSyncDashboardResponse,
  ListXiSyncLeadsResponse,
  ListXiSyncTenantsResponse,
  type AuthUser,
} from '@workspace/api-zod';
import {
  db,
  accountsTable,
  cmsPagesTable,
  cmsSectionsTable,
  contactsTable,
  conversationsTable,
  dealsTable,
  leadsTable,
  messagesTable,
  profilesTable,
  shipmentsTable,
  tenantsTable,
} from '@workspace/db';
import { and, asc, count, desc, eq, ne, sum } from 'drizzle-orm';
import { createHash } from 'node:crypto';
import { Router, type IRouter, type Request, type Response } from 'express';

const router: IRouter = Router();

async function getOrCreateWorkspace(user: AuthUser) {
  let [profile] = await db.select().from(profilesTable).where(eq(profilesTable.id, user.id)).limit(1);
  let tenant = profile?.tenantId
    ? (await db.select().from(tenantsTable).where(eq(tenantsTable.id, profile.tenantId)).limit(1))[0]
    : undefined;

  if (!tenant) {
    const slug = `replit-${createHash('sha256').update(user.id).digest('hex').slice(0, 32)}`;
    const [created] = await db.insert(tenantsTable)
      .values({ name: 'My XiSync Workspace', slug })
      .onConflictDoNothing({ target: tenantsTable.slug })
      .returning();
    tenant = created ?? (await db.select().from(tenantsTable).where(eq(tenantsTable.slug, slug)).limit(1))[0];
    if (!tenant) throw new Error('Unable to create the XiSync workspace.');
  }

  if (!profile) {
    await db.insert(profilesTable).values({
      id: user.id,
      tenantId: tenant.id,
      fullName: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email || 'XiSync User',
      avatarUrl: user.profileImageUrl,
      role: 'admin',
    }).onConflictDoNothing({ target: profilesTable.id });
    profile = (await db.select().from(profilesTable).where(eq(profilesTable.id, user.id)).limit(1))[0];
  } else if (!profile.tenantId) {
    await db.update(profilesTable).set({ tenantId: tenant.id, updatedAt: new Date() })
      .where(eq(profilesTable.id, user.id));
    profile = (await db.select().from(profilesTable).where(eq(profilesTable.id, user.id)).limit(1))[0];
  }

  if (!profile?.tenantId) throw new Error('Unable to load the XiSync user profile.');
  const [activeTenant] = await db.select().from(tenantsTable)
    .where(eq(tenantsTable.id, profile.tenantId)).limit(1);
  if (!activeTenant) throw new Error('The XiSync workspace could not be found.');
  return { profile, tenant: activeTenant };
}

function requireUser(req: Request, res: Response): AuthUser | null {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: 'Sign in is required to access XiSync data.' });
    return null;
  }
  return req.user;
}

function tenantRow(tenant: typeof tenantsTable.$inferSelect) {
  return {
    id: tenant.id,
    name: tenant.name,
    name_cn: tenant.nameCn,
    slug: tenant.slug,
    industry: tenant.industry,
    region: tenant.region,
    timezone: tenant.timezone,
    currency: tenant.currency,
    default_language: tenant.defaultLanguage,
    logo_url: tenant.logoUrl,
    status: tenant.status,
    plan: tenant.plan,
    settings: tenant.settings,
    trial_ends_at: tenant.trialEndsAt?.toISOString() ?? null,
    created_at: tenant.createdAt.toISOString(),
    updated_at: tenant.updatedAt.toISOString(),
  };
}

function leadRow(lead: typeof leadsTable.$inferSelect) {
  return {
    id: lead.id,
    contact_name: lead.contactName,
    company_name: lead.companyName,
    email: lead.email,
    phone: lead.phone,
    country: lead.country,
    source: lead.source,
    notes: lead.notes,
    status: lead.status,
    score: lead.score,
    created_at: lead.createdAt.toISOString(),
  };
}

router.get('/xisync/context', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const { profile, tenant } = await getOrCreateWorkspace(user);
  res.json(GetXiSyncWorkspaceContextResponse.parse({
    profile: {
      id: profile.id,
      full_name: profile.fullName,
      full_name_cn: profile.fullNameCn,
      role: profile.role,
      tenant_id: profile.tenantId,
      avatar_url: profile.avatarUrl,
      phone: profile.phone,
      language: profile.language,
      is_active: profile.isActive,
      settings: profile.settings,
      created_at: profile.createdAt.toISOString(),
      updated_at: profile.updatedAt.toISOString(),
    },
    tenant: tenantRow(tenant),
  }));
});

router.get('/xisync/dashboard', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const { tenant } = await getOrCreateWorkspace(user);
  const tenantFilter = eq(leadsTable.tenantId, tenant.id);
  const [
    [leadCount],
    [conversationCount],
    [shipmentCount],
    [pipeline],
    recentLeads,
    recentConversations,
  ] = await Promise.all([
    db.select({ value: count() }).from(leadsTable).where(tenantFilter),
    db.select({ value: count() }).from(conversationsTable).where(eq(conversationsTable.tenantId, tenant.id)),
    db.select({ value: count() }).from(shipmentsTable).where(eq(shipmentsTable.tenantId, tenant.id)),
    db.select({ value: sum(dealsTable.value) }).from(dealsTable)
      .where(and(eq(dealsTable.tenantId, tenant.id), ne(dealsTable.stage, 'closed_lost'))),
    db.select().from(leadsTable).where(tenantFilter)
      .orderBy(desc(leadsTable.createdAt)).limit(5),
    db.select({
      id: conversationsTable.id,
      subject: conversationsTable.subject,
      channel_type: conversationsTable.channelType,
      last_message_at: conversationsTable.lastMessageAt,
      contact: {
        first_name: contactsTable.firstName,
        last_name: contactsTable.lastName,
      },
    }).from(conversationsTable)
      .leftJoin(contactsTable, eq(conversationsTable.contactId, contactsTable.id))
      .where(eq(conversationsTable.tenantId, tenant.id))
      .orderBy(desc(conversationsTable.lastMessageAt)).limit(3),
  ]);

  res.json(GetXiSyncDashboardResponse.parse({
    lead_count: leadCount.value,
    conversation_count: conversationCount.value,
    shipment_count: shipmentCount.value,
    pipeline_value: Number(pipeline.value ?? 0),
    recent_leads: recentLeads.map(leadRow),
    recent_conversations: recentConversations.map((conversation) => ({
      ...conversation,
      last_message_at: conversation.last_message_at?.toISOString() ?? null,
      contact: conversation.contact?.first_name || conversation.contact?.last_name
        ? conversation.contact
        : null,
    })),
  }));
});

router.get('/xisync/leads', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const { tenant } = await getOrCreateWorkspace(user);
  const leads = await db.select().from(leadsTable)
    .where(eq(leadsTable.tenantId, tenant.id))
    .orderBy(desc(leadsTable.createdAt));
  res.json(ListXiSyncLeadsResponse.parse(leads.map(leadRow)));
});

router.post('/xisync/leads', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const body = CreateXiSyncLeadBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.issues[0]?.message ?? 'Invalid lead details.' });
    return;
  }

  const { tenant } = await getOrCreateWorkspace(user);
  const [lead] = await db.insert(leadsTable).values({
    tenantId: tenant.id,
    contactName: body.data.contact_name,
    companyName: body.data.company_name ?? null,
    email: body.data.email,
    phone: body.data.phone ?? null,
    country: body.data.country ?? null,
    source: body.data.source ?? 'Website',
    notes: body.data.notes ?? null,
    status: 'new',
  }).returning();
  res.status(201).json(CreateXiSyncLeadResponse.parse(leadRow(lead)));
});

router.get('/xisync/tenants', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const { tenant } = await getOrCreateWorkspace(user);
  res.json(ListXiSyncTenantsResponse.parse([tenantRow(tenant)]));
});

const allowedTables = new Set([
  'accounts', 'contacts', 'deals', 'shipments', 'conversations',
  'messages', 'cms_pages', 'cms_sections', 'leads',
]);

function toSnakeCase(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map(toSnakeCase);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      toSnakeCase(child),
    ]));
  }
  return value;
}

function requestFilters(req: Request): Array<{ field: string; value: unknown }> {
  const raw = req.query.filters;
  if (typeof raw !== 'string' || raw.length > 3000) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((item): item is { field: string; value: unknown } =>
      item && typeof item === 'object'
      && typeof item.field === 'string'
      && 'value' in item
      && ['id', 'page_id', 'conversation_id', 'contact_id'].includes(item.field));
  } catch {
    return [];
  }
}

async function rowsForTable(table: string, tenantId: string): Promise<unknown[]> {
  switch (table) {
    case 'leads':
      return db.select().from(leadsTable).where(eq(leadsTable.tenantId, tenantId)).orderBy(desc(leadsTable.createdAt));
    case 'accounts':
      return db.select().from(accountsTable).where(eq(accountsTable.tenantId, tenantId)).orderBy(desc(accountsTable.createdAt));
    case 'contacts':
      return db.select({
        id: contactsTable.id,
        tenantId: contactsTable.tenantId,
        accountId: contactsTable.accountId,
        firstName: contactsTable.firstName,
        lastName: contactsTable.lastName,
        email: contactsTable.email,
        phone: contactsTable.phone,
        status: contactsTable.status,
        createdAt: contactsTable.createdAt,
        updatedAt: contactsTable.updatedAt,
        account: { name: accountsTable.name },
      }).from(contactsTable)
        .leftJoin(accountsTable, eq(contactsTable.accountId, accountsTable.id))
        .where(eq(contactsTable.tenantId, tenantId)).orderBy(desc(contactsTable.createdAt));
    case 'deals':
      return db.select({
        id: dealsTable.id,
        tenantId: dealsTable.tenantId,
        accountId: dealsTable.accountId,
        contactId: dealsTable.contactId,
        name: dealsTable.name,
        value: dealsTable.value,
        currency: dealsTable.currency,
        stage: dealsTable.stage,
        createdAt: dealsTable.createdAt,
        updatedAt: dealsTable.updatedAt,
        account: { name: accountsTable.name },
      }).from(dealsTable)
        .leftJoin(accountsTable, eq(dealsTable.accountId, accountsTable.id))
        .where(eq(dealsTable.tenantId, tenantId)).orderBy(desc(dealsTable.createdAt));
    case 'shipments':
      return db.select({
        id: shipmentsTable.id,
        tenantId: shipmentsTable.tenantId,
        accountId: shipmentsTable.accountId,
        shipmentNumber: shipmentsTable.shipmentNumber,
        orderId: shipmentsTable.orderId,
        mode: shipmentsTable.mode,
        status: shipmentsTable.status,
        originPort: shipmentsTable.originPort,
        originCountry: shipmentsTable.originCountry,
        destinationPort: shipmentsTable.destinationPort,
        destinationCountry: shipmentsTable.destinationCountry,
        etd: shipmentsTable.etd,
        eta: shipmentsTable.eta,
        carrier: shipmentsTable.carrier,
        trackingNumber: shipmentsTable.trackingNumber,
        createdAt: shipmentsTable.createdAt,
        account: { name: accountsTable.name },
      }).from(shipmentsTable)
        .leftJoin(accountsTable, eq(shipmentsTable.accountId, accountsTable.id))
        .where(eq(shipmentsTable.tenantId, tenantId)).orderBy(desc(shipmentsTable.createdAt));
    case 'conversations':
      return db.select({
        id: conversationsTable.id,
        tenantId: conversationsTable.tenantId,
        channelType: conversationsTable.channelType,
        contactId: conversationsTable.contactId,
        subject: conversationsTable.subject,
        status: conversationsTable.status,
        lastMessageAt: conversationsTable.lastMessageAt,
        createdAt: conversationsTable.createdAt,
        contact: {
          firstName: contactsTable.firstName,
          lastName: contactsTable.lastName,
        },
        companyName: accountsTable.name,
      }).from(conversationsTable)
        .leftJoin(contactsTable, eq(conversationsTable.contactId, contactsTable.id))
        .leftJoin(accountsTable, eq(contactsTable.accountId, accountsTable.id))
        .where(eq(conversationsTable.tenantId, tenantId))
        .orderBy(desc(conversationsTable.lastMessageAt))
        .then((rows) => rows.map((row) => ({
          ...row,
          contact: row.contact
            ? { ...row.contact, account: row.companyName ? { name: row.companyName } : null }
            : null,
        })));
    case 'messages':
      return db.select().from(messagesTable).where(eq(messagesTable.tenantId, tenantId))
        .orderBy(asc(messagesTable.createdAt));
    case 'cms_pages':
      return db.select().from(cmsPagesTable).where(eq(cmsPagesTable.tenantId, tenantId))
        .orderBy(desc(cmsPagesTable.createdAt));
    case 'cms_sections':
      return db.select({
        id: cmsSectionsTable.id,
        pageId: cmsSectionsTable.pageId,
        sectionType: cmsSectionsTable.sectionType,
        sectionKey: cmsSectionsTable.sectionKey,
        content: cmsSectionsTable.content,
        order: cmsSectionsTable.sortOrder,
        isActive: cmsSectionsTable.visible,
        updatedAt: cmsSectionsTable.updatedAt,
      }).from(cmsSectionsTable)
        .innerJoin(cmsPagesTable, eq(cmsSectionsTable.pageId, cmsPagesTable.id))
        .where(eq(cmsPagesTable.tenantId, tenantId))
        .orderBy(asc(cmsSectionsTable.sortOrder));
    default:
      return [];
  }
}

router.get('/xisync/data/:table', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const table = String(req.params.table);
  if (!allowedTables.has(table)) {
    res.status(404).json({ error: 'This data collection is not available.' });
    return;
  }
  const { tenant } = await getOrCreateWorkspace(user);
  let rows = await rowsForTable(table, tenant.id);
  const filters = requestFilters(req);

  if (table === 'conversations' && filters.some(
    (filter) => filter.field === 'contact_id' && filter.value === user.id,
  )) {
    const ownedMessages = await db.selectDistinct({ conversationId: messagesTable.conversationId })
      .from(messagesTable)
      .where(and(eq(messagesTable.tenantId, tenant.id), eq(messagesTable.senderId, user.id)));
    const ownedIds = new Set(ownedMessages.map((message) => message.conversationId));
    rows = rows.filter((row) => ownedIds.has((row as { id: string }).id));
  } else {
    rows = rows.filter((row) => filters.every((filter) => {
      const key = filter.field.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
      return (row as Record<string, unknown>)[key] === filter.value;
    }));
  }

  const orderBy = typeof req.query.order === 'string' ? req.query.order : '';
  if (orderBy) {
    const key = orderBy.replace(/_([a-z])/g, (_, letter: string) => letter.toUpperCase());
    const ascending = req.query.ascending === 'true';
    rows.sort((a, b) => {
      const left = (a as Record<string, unknown>)[key];
      const right = (b as Record<string, unknown>)[key];
      const result = String(left ?? '').localeCompare(String(right ?? ''), undefined, { numeric: true });
      return ascending ? result : -result;
    });
  }
  const limit = Number(req.query.limit);
  rows = rows.slice(0, Number.isFinite(limit) && limit > 0 ? Math.min(limit, 500) : 500);
  if (table === 'conversations') {
    rows = rows.map((value) => {
      const row = value as { contact: { firstName: string | null; lastName: string | null } | null; companyName?: string | null };
      return {
        ...row,
        contact: row.contact
          ? { ...row.contact, account: row.companyName ? { name: row.companyName } : null }
          : null,
      };
    });
  }
  res.json(toSnakeCase(rows));
});

router.post('/xisync/data/:table', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const table = String(req.params.table);
  if (!allowedTables.has(table)) {
    res.status(404).json({ error: 'This data collection is not available.' });
    return;
  }
  const { tenant } = await getOrCreateWorkspace(user);
  const body = Array.isArray(req.body) ? req.body[0] : req.body;
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    res.status(400).json({ error: 'A valid record is required.' });
    return;
  }

  let row: unknown;
  if (table === 'leads') {
    const bodyFields = {
      contact_name: body.contact_name,
      company_name: body.company_name ?? null,
      email: body.email,
      phone: body.phone ?? null,
      country: body.country ?? null,
      source: body.source ?? null,
      notes: body.notes ?? null,
    };
    const parsed = CreateXiSyncLeadBody.safeParse(bodyFields);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'Invalid lead details.' });
      return;
    }
    [row] = await db.insert(leadsTable).values({
      tenantId: tenant.id,
      contactName: parsed.data.contact_name,
      companyName: parsed.data.company_name ?? null,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      country: parsed.data.country ?? null,
      source: parsed.data.source ?? null,
      notes: parsed.data.notes ?? null,
    }).returning();
  } else if (table === 'conversations') {
    const contactId = typeof body.contact_id === 'string' && body.contact_id !== user.id
      ? body.contact_id
      : null;
    if (contactId) {
      const [contact] = await db.select({ id: contactsTable.id }).from(contactsTable)
        .where(and(eq(contactsTable.id, contactId), eq(contactsTable.tenantId, tenant.id))).limit(1);
      if (!contact) {
        res.status(400).json({ error: 'The selected contact is not in this workspace.' });
        return;
      }
    }
    [row] = await db.insert(conversationsTable).values({
      tenantId: tenant.id,
      contactId,
      channelType: typeof body.channel_type === 'string' ? body.channel_type.slice(0, 50) : 'webchat',
      subject: typeof body.subject === 'string' ? body.subject.slice(0, 250) : 'Portal message',
      status: 'open',
    }).returning();
  } else if (table === 'messages') {
    const conversationId = typeof body.conversation_id === 'string' ? body.conversation_id : '';
    const content = typeof body.content === 'string' ? body.content.trim() : '';
    if (!content || content.length > 10000) {
      res.status(400).json({ error: 'Message content is required and must be under 10,000 characters.' });
      return;
    }
    const [conversation] = await db.select({ id: conversationsTable.id })
      .from(conversationsTable)
      .where(and(eq(conversationsTable.id, conversationId), eq(conversationsTable.tenantId, tenant.id)))
      .limit(1);
    if (!conversation) {
      res.status(404).json({ error: 'Conversation not found in this workspace.' });
      return;
    }
    [row] = await db.insert(messagesTable).values({
      tenantId: tenant.id,
      conversationId,
      senderId: user.id,
      senderType: typeof body.sender_type === 'string' ? body.sender_type.slice(0, 50) : 'customer',
      direction: body.direction === 'outbound' ? 'outbound' : 'inbound',
      content,
      status: 'sent',
    }).returning();
    await db.update(conversationsTable).set({ lastMessageAt: new Date(), updatedAt: new Date() })
      .where(and(eq(conversationsTable.id, conversationId), eq(conversationsTable.tenantId, tenant.id)));
  } else if (table === 'cms_pages') {
    const slug = typeof body.slug === 'string' ? body.slug.trim().toLowerCase() : '';
    const title = typeof body.title === 'string' ? body.title.trim() : '';
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || !title || title.length > 250) {
      res.status(400).json({ error: 'Enter a page title and a lowercase hyphenated page slug.' });
      return;
    }
    [row] = await db.insert(cmsPagesTable).values({
      tenantId: tenant.id,
      slug,
      title,
      description: typeof body.description === 'string' ? body.description.slice(0, 2000) : '',
    }).returning();
  } else {
    res.status(405).json({ error: 'Creating records in this collection is not supported.' });
    return;
  }
  res.status(201).json(toSnakeCase([row]));
});

router.patch('/xisync/data/:table', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  if (req.params.table !== 'cms_sections' || typeof req.body?.id !== 'string') {
    res.status(405).json({ error: 'Updating records in this collection is not supported.' });
    return;
  }
  const { tenant } = await getOrCreateWorkspace(user);
  const [section] = await db.select({ id: cmsSectionsTable.id })
    .from(cmsSectionsTable)
    .innerJoin(cmsPagesTable, eq(cmsSectionsTable.pageId, cmsPagesTable.id))
    .where(and(eq(cmsSectionsTable.id, req.body.id), eq(cmsPagesTable.tenantId, tenant.id)))
    .limit(1);
  if (!section) {
    res.status(404).json({ error: 'Section not found in this workspace.' });
    return;
  }

  let content: Record<string, unknown> = {};
  if (typeof req.body.content === 'string') {
    try {
      const parsed: unknown = JSON.parse(req.body.content);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) content = parsed as Record<string, unknown>;
    } catch {
      res.status(400).json({ error: 'Section content must be valid JSON.' });
      return;
    }
  } else if (req.body.content && typeof req.body.content === 'object' && !Array.isArray(req.body.content)) {
    content = req.body.content as Record<string, unknown>;
  }
  const [updated] = await db.update(cmsSectionsTable).set({
    sectionType: typeof req.body.section_type === 'string' ? req.body.section_type.slice(0, 80) : undefined,
    sectionKey: typeof req.body.section_key === 'string' ? req.body.section_key.slice(0, 120) : undefined,
    content,
    sortOrder: Number.isInteger(req.body.order) ? req.body.order : undefined,
    visible: typeof req.body.is_active === 'boolean' ? req.body.is_active : undefined,
    updatedAt: new Date(),
  }).where(eq(cmsSectionsTable.id, section.id)).returning();
  res.json(toSnakeCase([updated]));
});

router.delete('/xisync/data/:table', async (req: Request, res: Response): Promise<void> => {
  const user = requireUser(req, res);
  if (!user) return;
  const table = String(req.params.table);
  if (!['cms_pages', 'cms_sections'].includes(table) || typeof req.query.id !== 'string') {
    res.status(405).json({ error: 'Deleting records in this collection is not supported.' });
    return;
  }
  const { tenant } = await getOrCreateWorkspace(user);
  if (table === 'cms_pages') {
    const [deleted] = await db.delete(cmsPagesTable).where(and(
      eq(cmsPagesTable.id, req.query.id),
      eq(cmsPagesTable.tenantId, tenant.id),
    )).returning();
    if (!deleted) {
      res.status(404).json({ error: 'Page not found in this workspace.' });
      return;
    }
  } else {
    const [ownedSection] = await db.select({ id: cmsSectionsTable.id })
      .from(cmsSectionsTable)
      .innerJoin(cmsPagesTable, eq(cmsSectionsTable.pageId, cmsPagesTable.id))
      .where(and(eq(cmsSectionsTable.id, req.query.id), eq(cmsPagesTable.tenantId, tenant.id)))
      .limit(1);
    if (!ownedSection) {
      res.status(404).json({ error: 'Section not found in this workspace.' });
      return;
    }
    await db.delete(cmsSectionsTable).where(eq(cmsSectionsTable.id, ownedSection.id));
  }
  res.json({ success: true });
});

export default router;