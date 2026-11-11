import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

/**
 * Password hashing for the credentials sign-in path.
 *
 * Format: `scrypt$N$r$p$<salt base64url>$<derived key base64url>`
 * Parameters are stored with the hash so they can be raised later without
 * invalidating existing rows.
 */

const PARAMS = { N: 16384, r: 8, p: 1 } as const;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const DEFAULT_MAX_MEM = 64 * 1024 * 1024;

function derive(password: string, salt: Buffer, keyLength: number, options: ScryptOptions): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLength, options, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LENGTH);
  const key = await derive(password, salt, KEY_LENGTH, {
    N: PARAMS.N,
    r: PARAMS.r,
    p: PARAMS.p,
    maxmem: DEFAULT_MAX_MEM,
  });
  return `scrypt$${PARAMS.N}$${PARAMS.r}$${PARAMS.p}$${salt.toString('base64url')}$${key.toString('base64url')}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;

  const N = Number(parts[1]);
  const r = Number(parts[2]);
  const p = Number(parts[3]);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return false;
  // Reject parameters that are too small to be useful or large enough to be a DoS vector.
  if (N < 1024 || N > 1 << 20 || r < 1 || r > 32 || p < 1 || p > 16) return false;

  const salt = Buffer.from(parts[4], 'base64url');
  const expected = Buffer.from(parts[5], 'base64url');
  if (salt.length === 0 || expected.length === 0) return false;

  try {
    const actual = await derive(password, salt, expected.length, {
      N,
      r,
      p,
      maxmem: Math.max(DEFAULT_MAX_MEM, 256 * N * r),
    });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}
