import { getPool, ensureBookingsTable, ensureCoreTables } from '../_db.js';
import { requireAuth } from './_auth.js';

const BOOKING_COLUMNS = `
  b.id,
  b.service_id AS "serviceId",
  b.master_id AS "masterId",
  b.date,
  b.time,
  b.client_name AS "name",
  b.client_phone AS "phone",
  b.created_at AS "createdAt",
  s.name AS "serviceName",
  s.price AS "price",
  m.name AS "masterName"
`;

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  try {
    await Promise.all([ensureBookingsTable(), ensureCoreTables()]);
    const pool = getPool();

    if (req.method === 'GET') {
      const { date } = req.query;
      if (!date) {
        res.status(400).json({ error: 'Sana kerak' });
        return;
      }
      const { rows } = await pool.query(
        `SELECT ${BOOKING_COLUMNS}
         FROM demo_bookings b
         LEFT JOIN services s ON s.id = b.service_id
         LEFT JOIN masters m ON m.id = b.master_id
         WHERE b.date = $1
         ORDER BY b.time ASC`,
        [date],
      );
      res.status(200).json(
        rows.map((r) => ({
          ...r,
          serviceName: r.serviceName ?? r.serviceId,
          masterName: r.masterName ?? r.masterId,
          price: r.price ?? null,
        })),
      );
      return;
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        res.status(400).json({ error: 'Navbat topilmadi' });
        return;
      }
      const { rowCount } = await pool.query('DELETE FROM demo_bookings WHERE id = $1', [id]);
      if (rowCount === 0) {
        res.status(404).json({ error: 'Navbat topilmadi' });
        return;
      }
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/bookings] Unexpected error:', err);
    res.status(500).json({ error: "Ma'lumotlar bazasiga ulanib bo'lmadi" });
  }
}
