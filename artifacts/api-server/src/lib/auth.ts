import crypto from 'crypto';
import type { AuthUser } from '@workspace/api-zod';
import { db, sessionsTable } from '@workspace/db';
import { eq } from 'drizzle-orm';
import { type Request, type Response } from 'express';
import * as client from 'openid-client';

export const ISSUER_URL = process.env.ISSUER_URL ?? 'https://replit.com/oidc';
export const SESSION_COOKIE = 'sid';
export const SESSION_TTL = 7 * 24 * 60 * 60 * 1000;

export interface SessionData {
  user: AuthUser;
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

type EncryptedSession = {
  version: 1;
  iv: string;
  authTag: string;
  data: string;
};

function sessionEncryptionKey(): Buffer {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('SESSION_SECRET is required to protect sign-in sessions.');
  return crypto.createHash('sha256').update('xisync-session-v1\0').update(secret).digest();
}

function encryptSession(data: SessionData): Record<string, unknown> {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv('aes-256-gcm', sessionEncryptionKey(), iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(data), 'utf8'),
    cipher.final(),
  ]);
  const encrypted: EncryptedSession = {
    version: 1,
    iv: iv.toString('base64url'),
    authTag: cipher.getAuthTag().toString('base64url'),
    data: ciphertext.toString('base64url'),
  };
  return encrypted;
}

function decryptSession(value: unknown): SessionData {
  if (!value || typeof value !== 'object') throw new Error('Invalid encrypted session.');
  const encrypted = value as Partial<EncryptedSession>;
  if (
    encrypted.version !== 1
    || typeof encrypted.iv !== 'string'
    || typeof encrypted.authTag !== 'string'
    || typeof encrypted.data !== 'string'
  ) throw new Error('Invalid encrypted session.');

  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    sessionEncryptionKey(),
    Buffer.from(encrypted.iv, 'base64url'),
  );
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'base64url'));
  const plaintext = Buffer.concat([
    decipher.update(Buffer.from(encrypted.data, 'base64url')),
    decipher.final(),
  ]).toString('utf8');
  const data = JSON.parse(plaintext) as SessionData;
  if (!data.user?.id || typeof data.access_token !== 'string') throw new Error('Invalid session payload.');
  return data;
}

let oidcConfig: client.Configuration | null = null;

export async function getOidcConfig(): Promise<client.Configuration> {
  if (!process.env.REPL_ID) throw new Error('Replit OIDC is not configured for this workspace.');
  if (!oidcConfig) {
    oidcConfig = await client.discovery(new URL(ISSUER_URL), process.env.REPL_ID);
  }
  return oidcConfig;
}

export async function createSession(data: SessionData): Promise<string> {
  const sid = crypto.randomBytes(32).toString('hex');
  await db.insert(sessionsTable).values({
    sid,
    sess: encryptSession(data),
    expire: new Date(Date.now() + SESSION_TTL),
  });
  return sid;
}

export async function getSession(sid: string): Promise<SessionData | null> {
  const [row] = await db.select().from(sessionsTable).where(eq(sessionsTable.sid, sid));
  if (!row || row.expire < new Date()) {
    if (row) await deleteSession(sid);
    return null;
  }
  try {
    return decryptSession(row.sess);
  } catch {
    await deleteSession(sid);
    return null;
  }
}

export async function updateSession(sid: string, data: SessionData): Promise<void> {
  await db.update(sessionsTable)
    .set({ sess: encryptSession(data), expire: new Date(Date.now() + SESSION_TTL) })
    .where(eq(sessionsTable.sid, sid));
}

export async function deleteSession(sid: string): Promise<void> {
  await db.delete(sessionsTable).where(eq(sessionsTable.sid, sid));
}

export async function clearSession(res: Response, sid?: string): Promise<void> {
  if (sid) await deleteSession(sid);
  res.clearCookie(SESSION_COOKIE, { path: '/' });
}

export function getSessionId(req: Request): string | undefined {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);
  return req.cookies?.[SESSION_COOKIE];
}