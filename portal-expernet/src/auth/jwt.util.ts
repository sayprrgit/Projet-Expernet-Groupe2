import { createHmac, timingSafeEqual } from 'node:crypto';

export interface JwtPayload {
  sub: number;
  role: string;
  iat: number;
  exp: number;
}

// Pas de valeur par défaut : avec une clé connue, n'importe qui pourrait forger un jeton
const secret = (): string => {
  const valeur = process.env.JWT_SECRET;
  if (!valeur) throw new Error("JWT_SECRET manquant dans les variables d'environnement");
  return valeur;
};

function encode(value: string | Buffer): string {
  return Buffer.from(value).toString('base64url');
}

export function signToken(userId: number, role: string, expiresInSeconds = 60 * 60 * 8): string {
  const now = Math.floor(Date.now() / 1000);
  const header = encode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = encode(
    JSON.stringify({ sub: userId, role, iat: now, exp: now + expiresInSeconds }),
  );
  const signature = createHmac('sha256', secret()).update(`${header}.${payload}`).digest('base64url');
  return `${header}.${payload}.${signature}`;
}

export function verifyToken(token: string): JwtPayload | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [header, payload, signature] = parts;

  const expected = createHmac('sha256', secret()).update(`${header}.${payload}`).digest('base64url');
  const provided = Buffer.from(signature);
  const wanted = Buffer.from(expected);
  if (provided.length !== wanted.length || !timingSafeEqual(provided, wanted)) return null;

  try {
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as JwtPayload;
    if (!decoded?.sub || decoded.exp < Math.floor(Date.now() / 1000)) return null;
    return decoded;
  } catch {
    return null;
  }
}
