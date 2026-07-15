import { setSessionCookie } from './_auth.js';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    console.error('[admin/login] ADMIN_PASSWORD is not set');
    res.status(500).json({ error: 'Admin paroli sozlanmagan' });
    return;
  }

  const { password } = req.body || {};
  if (password !== adminPassword) {
    res.status(401).json({ error: "Parol noto'g'ri" });
    return;
  }

  setSessionCookie(res);
  res.status(200).json({ success: true });
}
