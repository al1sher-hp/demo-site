import { createHash, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'admin_session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

function sessionToken() {
  return createHash('sha256').update(process.env.ADMIN_PASSWORD || '').digest('hex');
}

function parseCookies(req) {
  const header = req.headers?.cookie || '';
  const cookies = {};
  for (const part of header.split(';')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const idx = trimmed.indexOf('=');
    if (idx === -1) continue;
    cookies[trimmed.slice(0, idx)] = decodeURIComponent(trimmed.slice(idx + 1));
  }
  return cookies;
}

export function setSessionCookie(res) {
  const isProd = process.env.VERCEL_ENV === 'production' || process.env.NODE_ENV === 'production';
  const parts = [
    `${COOKIE_NAME}=${sessionToken()}`,
    'HttpOnly',
    'Path=/',
    'SameSite=Lax',
    `Max-Age=${MAX_AGE_SECONDS}`,
  ];
  if (isProd) parts.push('Secure');
  res.setHeader('Set-Cookie', parts.join('; '));
}

export function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0`);
}

export function isAuthenticated(req) {
  if (!process.env.ADMIN_PASSWORD) return false;
  const provided = parseCookies(req)[COOKIE_NAME];
  if (!provided) return false;

  const expected = sessionToken();
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function requireAuth(req, res) {
  if (!isAuthenticated(req)) {
    res.status(401).json({ error: 'Avtorizatsiya talab qilinadi' });
    return false;
  }
  return true;
}
