import {
  GetCurrentAuthUserResponse,
} from '@workspace/api-zod';
import type { AuthUser } from '@workspace/api-zod';
import { db, usersTable, verifyPassword } from '@workspace/db';
import { eq, sql } from 'drizzle-orm';
import { Router, type IRouter, type Request, type Response } from 'express';
import * as oidc from 'openid-client';
import {
  clearSession,
  createSession,
  getOidcConfig,
  getSessionId,
  ISSUER_URL,
  SESSION_COOKIE,
  SESSION_TTL,
  type SessionData,
} from '../lib/auth';

const router: IRouter = Router();
const OIDC_COOKIE_TTL = 10 * 60 * 1000;
const MAX_PASSWORD_LENGTH = 200;

// Verified against when the email is unknown, so both failure paths do the same work.
const DUMMY_PASSWORD_HASH =
  'scrypt$16384$8$1$Y80RXn5h7s8lMc5sylf8OA$iGz51-ozqtKXNlt8Hp6aCJJczwxOYQBgv-LqIt4YX4VhVhRLe6Z1-I_q7ayvguAmFrw8RN5ZH9KWuts0V52Tlg';

function isSecureRequest(req: Request): boolean {
  const forwarded = String(req.headers['x-forwarded-proto'] ?? '').split(',')[0].trim();
  return req.secure || forwarded === 'https';
}

function getOrigin(req: Request): string {
  const protocol = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  const host = String(req.headers['x-forwarded-host'] || req.headers.host || '').split(',')[0].trim();
  if (!host) throw new Error('Unable to determine the authentication callback host.');
  return `${protocol}://${host}`;
}

function setCookie(res: Response, name: string, value: string, maxAge: number): void {
  res.cookie(name, value, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    path: '/',
    maxAge,
  });
}

function safeReturnTo(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return '/';
  return value;
}

async function upsertUser(claims: Record<string, unknown>) {
  const userData = {
    id: claims.sub as string,
    email: (claims.email as string) || null,
    firstName: (claims.first_name as string) || (claims.given_name as string) || null,
    lastName: (claims.last_name as string) || (claims.family_name as string) || null,
    profileImageUrl: (claims.profile_image_url || claims.picture) as string | null,
  };

  const [user] = await db.insert(usersTable)
    .values(userData)
    .onConflictDoUpdate({
      target: usersTable.id,
      set: { ...userData, updatedAt: new Date() },
    })
    .returning();
  return user;
}

router.get('/auth/user', (req: Request, res: Response) => {
  const user = req.isAuthenticated() ? req.user : null;
  res.json(GetCurrentAuthUserResponse.parse({ user: user ?? null }));
});

router.get('/login', async (req: Request, res: Response): Promise<void> => {
  const config = await getOidcConfig();
  const callbackUrl = `${getOrigin(req)}/api/callback`;
  const state = oidc.randomState();
  const nonce = oidc.randomNonce();
  const codeVerifier = oidc.randomPKCECodeVerifier();
  const codeChallenge = await oidc.calculatePKCECodeChallenge(codeVerifier);
  const redirectTo = oidc.buildAuthorizationUrl(config, {
    redirect_uri: callbackUrl,
    scope: 'openid email profile offline_access',
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    prompt: 'login consent',
    state,
    nonce,
  });

  setCookie(res, 'code_verifier', codeVerifier, OIDC_COOKIE_TTL);
  setCookie(res, 'nonce', nonce, OIDC_COOKIE_TTL);
  setCookie(res, 'state', state, OIDC_COOKIE_TTL);
  setCookie(res, 'return_to', safeReturnTo(req.query.returnTo), OIDC_COOKIE_TTL);
  res.redirect(redirectTo.href);
});

router.post('/auth/login', async (req: Request, res: Response): Promise<void> => {
  const body = (req.body ?? {}) as { email?: unknown; password?: unknown };
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  const reject = (): void => {
    res.status(401).json({ error: 'Invalid email or password.' });
  };

  if (!email || !email.includes('@') || !password || password.length > MAX_PASSWORD_LENGTH) {
    reject();
    return;
  }

  const [dbUser] = await db
    .select()
    .from(usersTable)
    .where(sql`lower(${usersTable.email}) = ${email}`)
    .limit(1);

  // Always run a full scrypt verification, even for unknown accounts, so the
  // response time does not reveal whether the email exists.
  const passwordMatches = await verifyPassword(password, dbUser?.passwordHash ?? DUMMY_PASSWORD_HASH);

  if (!dbUser || !dbUser.passwordHash || !passwordMatches) {
    req.log.warn('Rejected credentials sign-in');
    reject();
    return;
  }

  const user: AuthUser = {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    profileImageUrl: dbUser.profileImageUrl,
  };
  const sessionData: SessionData = {
    user,
    access_token: 'credentials',
  };
  const sid = await createSession(sessionData);
  res.cookie(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: isSecureRequest(req),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL,
  });
  res.json(GetCurrentAuthUserResponse.parse({ user }));
});

router.get('/callback', async (req: Request, res: Response): Promise<void> => {
  const config = await getOidcConfig();
  const origin = getOrigin(req);
  const callbackUrl = `${origin}/api/callback`;
  const codeVerifier = req.cookies?.code_verifier;
  const nonce = req.cookies?.nonce;
  const expectedState = req.cookies?.state;
  if (!codeVerifier || !expectedState) {
    res.redirect('/login');
    return;
  }

  const currentUrl = new URL(`${callbackUrl}?${new URL(req.url, `${origin}/`).searchParams}`);
  let tokens: oidc.TokenEndpointResponse & oidc.TokenEndpointResponseHelpers;
  try {
    tokens = await oidc.authorizationCodeGrant(config, currentUrl, {
      pkceCodeVerifier: codeVerifier,
      expectedNonce: nonce,
      expectedState,
      idTokenExpected: true,
    });
  } catch (error) {
    req.log.warn({ errorName: error instanceof Error ? error.name : 'Error' }, 'Replit sign-in callback failed');
    res.redirect('/login');
    return;
  }

  const returnTo = safeReturnTo(req.cookies?.return_to);
  for (const name of ['code_verifier', 'nonce', 'state', 'return_to']) {
    res.clearCookie(name, { path: '/' });
  }

  const claims = tokens.claims();
  if (!claims?.sub) {
    res.redirect('/login');
    return;
  }
  const dbUser = await upsertUser(claims as unknown as Record<string, unknown>);
  const now = Math.floor(Date.now() / 1000);
  const user: AuthUser = {
    id: dbUser.id,
    email: dbUser.email,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    profileImageUrl: dbUser.profileImageUrl,
  };
  const sessionData: SessionData = {
    user,
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    expires_at: tokens.expiresIn() ? now + tokens.expiresIn()! : claims.exp,
  };
  const sid = await createSession(sessionData);
  setCookie(res, SESSION_COOKIE, sid, SESSION_TTL);
  res.redirect(returnTo);
});

router.get('/logout', async (req: Request, res: Response): Promise<void> => {
  const origin = getOrigin(req);
  const returnTo = safeReturnTo(req.query.returnTo);
  await clearSession(res, getSessionId(req));

  let redirectTo = returnTo;
  try {
    const config = await getOidcConfig();
    redirectTo = oidc.buildEndSessionUrl(config, {
      client_id: process.env.REPL_ID!,
      post_logout_redirect_uri: new URL(returnTo, `${origin}/`).href,
    }).href;
  } catch {
    // OIDC is not configured (for example local Postgres development).
  }
  res.redirect(redirectTo);
});

export default router;