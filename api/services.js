import { getPool, ensureCoreTables } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await ensureCoreTables();
    const { rows } = await getPool().query(
      `SELECT id, name, price, duration_min AS "durationMin"
       FROM services WHERE active = true ORDER BY name`,
    );
    res.status(200).json(rows);
  } catch (err) {
    console.error('[services] Unexpected error:', err);
    res.status(500).json({ error: "Ma'lumotlar bazasiga ulanib bo'lmadi" });
  }
}
