import { getPool, ensureCoreTables } from './_db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    await ensureCoreTables();
    const pool = getPool();

    const { rows: masterRows } = await pool.query(
      `SELECT id, name FROM masters WHERE active = true ORDER BY name`,
    );
    if (masterRows.length === 0) {
      res.status(200).json([]);
      return;
    }

    const ids = masterRows.map((m) => m.id);
    const { rows: serviceRows } = await pool.query(
      `SELECT ms.master_id AS "masterId", ms.service_id AS "serviceId"
       FROM master_services ms
       JOIN services s ON s.id = ms.service_id
       WHERE ms.master_id = ANY($1) AND s.active = true`,
      [ids],
    );
    const { rows: hourRows } = await pool.query(
      `SELECT master_id AS "masterId", weekday, start_time AS "startTime", end_time AS "endTime",
              is_day_off AS "isDayOff"
       FROM master_hours WHERE master_id = ANY($1) ORDER BY weekday`,
      [ids],
    );

    res.status(200).json(
      masterRows.map((m) => ({
        id: m.id,
        name: m.name,
        services: serviceRows.filter((r) => r.masterId === m.id).map((r) => r.serviceId),
        hours: hourRows.filter((r) => r.masterId === m.id),
      })),
    );
  } catch (err) {
    console.error('[masters] Unexpected error:', err);
    res.status(500).json({ error: "Ma'lumotlar bazasiga ulanib bo'lmadi" });
  }
}
