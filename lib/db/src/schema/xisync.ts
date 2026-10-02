import { sql } from 'drizzle-orm';
import {
  index,
  boolean,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { usersTable } from './auth';

export const tenantsTable = pgTable(
  'tenants',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    nameCn: text('name_cn'),
    slug: text('slug').notNull(),
    industry: text('industry'),
    region: text('region'),
    timezone: text('timezone').default('Asia/Shanghai'),
    currency: text('currency').default('USD'),
    defaultLanguage: text('default_language').default('zh'),
    logoUrl: text('logo_url'),
    status: text('status').notNull().default('trial'),
    plan: text('plan').notNull().default('trial'),
    settings: jsonb('settings').notNull().default(sql`'{}'::jsonb`),
    trialEndsAt: timestamp('trial_ends_at', { withTimezone: true }).default(sql`now() + interval '14 days'`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('tenants_slug_uidx').on(table.slug)],
);

export const profilesTable = pgTable(
  'profiles',
  {
    id: varchar('id').primaryKey().references(() => usersTable.id, { onDelete: 'cascade' }),
    tenantId: uuid('tenant_id').references(() => tenantsTable.id, { onDelete: 'set null' }),
    fullName: text('full_name'),
    fullNameCn: text('full_name_cn'),
    role: text('role').notNull().default('admin'),
    avatarUrl: text('avatar_url'),
    phone: text('phone'),
    language: text('language').notNull().default('en'),
    isActive: boolean('is_active').notNull().default(true),
    settings: jsonb('settings').notNull().default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('profiles_tenant_idx').on(table.tenantId)],
);

export const leadsTable = pgTable(
  'leads',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
    source: text('source'),
    companyName: text('company_name'),
    companyNameCn: text('company_name_cn'),
    contactName: text('contact_name'),
    email: text('email'),
    phone: text('phone'),
    country: text('country'),
    industry: text('industry'),
    status: text('status').notNull().default('new'),
    score: numeric('score', { precision: 8, scale: 0, mode: 'number' }).notNull().default(0),
    notes: text('notes'),
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('leads_tenant_idx').on(table.tenantId),
    index('leads_tenant_created_idx').on(table.tenantId, table.createdAt),
  ],
);

export const accountsTable = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  nameCn: text('name_cn'),
  type: text('type').notNull().default('customer'),
  industry: text('industry'),
  website: text('website'),
  country: text('country'),
  city: text('city'),
  status: text('status').notNull().default('active'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const contactsTable = pgTable(
  'contacts',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accountsTable.id, { onDelete: 'set null' }),
    firstName: text('first_name'),
    lastName: text('last_name'),
    email: text('email'),
    phone: text('phone'),
    status: text('status').notNull().default('active'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('contacts_tenant_idx').on(table.tenantId)],
);

export const dealsTable = pgTable(
  'deals',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accountsTable.id, { onDelete: 'set null' }),
    contactId: uuid('contact_id').references(() => contactsTable.id, { onDelete: 'set null' }),
    name: text('name').notNull(),
    value: numeric('value', { precision: 15, scale: 2, mode: 'number' }).notNull().default(0),
    currency: text('currency').notNull().default('USD'),
    stage: text('stage').notNull().default('qualification'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('deals_tenant_idx').on(table.tenantId)],
);

export const shipmentsTable = pgTable(
  'shipments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
    accountId: uuid('account_id').references(() => accountsTable.id, { onDelete: 'set null' }),
    shipmentNumber: text('shipment_number').notNull(),
    orderId: text('order_id'),
    mode: text('mode').notNull().default('sea'),
    trackingNumber: text('tracking_number'),
    carrier: text('carrier'),
    originPort: text('origin_port'),
    originCountry: text('origin_country'),
    destinationPort: text('destination_port'),
    destinationCountry: text('destination_country'),
    etd: timestamp('etd', { withTimezone: true }),
    status: text('status').notNull().default('booked'),
    eta: timestamp('eta', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('shipments_tenant_idx').on(table.tenantId)],
);

export const conversationsTable = pgTable(
  'conversations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
    channelType: text('channel_type'),
    contactId: uuid('contact_id').references(() => contactsTable.id, { onDelete: 'set null' }),
    subject: text('subject'),
    status: text('status').notNull().default('open'),
    lastMessageAt: timestamp('last_message_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('conversations_tenant_idx').on(table.tenantId)],
);

export const messagesTable = pgTable(
  'messages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
    conversationId: uuid('conversation_id').notNull().references(() => conversationsTable.id, { onDelete: 'cascade' }),
    senderId: varchar('sender_id').references(() => usersTable.id, { onDelete: 'set null' }),
    senderType: text('sender_type').notNull().default('customer'),
    direction: text('direction').notNull().default('inbound'),
    content: text('content').notNull(),
    contentTranslated: text('content_translated'),
    contentType: text('content_type').notNull().default('text'),
    status: text('status').notNull().default('sent'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('messages_conversation_created_idx').on(table.conversationId, table.createdAt)],
);

export const cmsPagesTable = pgTable(
  'cms_pages',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tenantId: uuid('tenant_id').notNull().references(() => tenantsTable.id, { onDelete: 'cascade' }),
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description').notNull().default(''),
    status: text('status').notNull().default('draft'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex('cms_pages_tenant_slug_uidx').on(table.tenantId, table.slug)],
);

export const cmsSectionsTable = pgTable(
  'cms_sections',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    pageId: uuid('page_id').notNull().references(() => cmsPagesTable.id, { onDelete: 'cascade' }),
    sectionType: text('section_type').notNull().default('content'),
    sectionKey: text('section_key').notNull().default(''),
    content: jsonb('content').notNull().default(sql`'{}'::jsonb`),
    sortOrder: integer('order').notNull().default(0),
    visible: boolean('visible').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index('cms_sections_page_order_idx').on(table.pageId, table.sortOrder)],
);

export type XiSyncTenant = typeof tenantsTable.$inferSelect;
export type XiSyncProfile = typeof profilesTable.$inferSelect;