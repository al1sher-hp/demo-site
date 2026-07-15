import { getPool, ensureCoreTables } from '../_db.js';
import { makeId } from '../_id.js';
import { requireAuth } from './_auth.js';

const COLUMNS = `id, name, price, duration_min AS "durationMin", active`;

function validateFields(body) {
  const name = String(body.name || '').trim();
  const price = Number(body.price);
  const durationMin = Number(body.durationMin);

  if (!name) return { error: "Xizmat nomini kiriting" };
  if (!Number.isFinite(price) || price <= 0) return { error: "Narxni to'g'ri kiriting" };
  if (!Number.isFinite(durationMin) || durationMin <= 0) return { error: "Davomiylikni tanlang" };

  return { name, price: Math.round(price), durationMin: Math.round(durationMin) };
}

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  try {
    await ensureCoreTables();
    const pool = getPool();

    if (req.method === 'GET') {
      const { rows } = await pool.query(`SELECT ${COLUMNS} FROM services ORDER BY name`);
      res.status(200).json(rows);
      return;
    }

    if (req.method === 'POST') {
      const parsed = validateFields(req.body || {});
      if (parsed.error) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const id = makeId(parsed.name);
      const { rows } = await pool.query(
        `INSERT INTO services (id, name, price, duration_min) VALUES ($1, $2, $3, $4)
         RETURNING ${COLUMNS}`,
        [id, parsed.name, parsed.price, parsed.durationMin],
      );
      res.status(200).json(rows[0]);
      return;
    }

    if (req.method === 'PUT') {
      const { id, active } = req.body || {};
      if (!id) {
        res.status(400).json({ error: "Xizmat topilmadi" });
        return;
      }

      if (Object.keys(req.body || {}).length === 2 && typeof active === 'boolean') {
        const { rows } = await pool.query(
          `UPDATE services SET active = $2 WHERE id = $1 RETURNING ${COLUMNS}`,
          [id, active],
        );
        if (rows.length === 0) {
          res.status(404).json({ error: "Xizmat topilmadi" });
          return;
        }
        res.status(200).json(rows[0]);
        return;
      }

      const parsed = validateFields(req.body || {});
      if (parsed.error) {
        res.status(400).json({ error: parsed.error });
        return;
      }
      const { rows } = await pool.query(
        `UPDATE services SET name = $2, price = $3, duration_min = $4, active = $5
         WHERE id = $1 RETURNING ${COLUMNS}`,
        [id, parsed.name, parsed.price, parsed.durationMin, active !== false],
      );
      if (rows.length === 0) {
        res.status(404).json({ error: "Xizmat topilmadi" });
        return;
      }
      res.status(200).json(rows[0]);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/services] Unexpected error:', err);
    res.status(500).json({ error: "Ma'lumotlar bazasiga ulanib bo'lmadi" });
  }
}
