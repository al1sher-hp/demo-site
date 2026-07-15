import { getPool, ensureCoreTables } from '../_db.js';
import { makeId } from '../_id.js';
import { requireAuth } from './_auth.js';

const TIME_RE = /^([01]\d|2[0-3]):(00|30)$/;

function validateMasterFields(body) {
  const name = String(body.name || '').trim();
  const serviceIds = Array.isArray(body.serviceIds)
    ? body.serviceIds.filter((s) => typeof s === 'string')
    : [];
  const hours = Array.isArray(body.hours) ? body.hours : [];

  if (!name) return { error: 'Mutaxassis ismini kiriting' };
  if (hours.length !== 7) return { error: "Haftalik jadval to'liq emas" };

  const normalizedHours = [];
  for (let weekday = 0; weekday <= 6; weekday++) {
    const row = hours.find((h) => Number(h.weekday) === weekday);
    if (!row) return { error: "Haftalik jadval to'liq emas" };

    const isDayOff = Boolean(row.isDayOff);
    const startTime = String(row.startTime || '09:00');
    const endTime = String(row.endTime || '20:00');

    if (!isDayOff) {
      if (!TIME_RE.test(startTime) || !TIME_RE.test(endTime)) {
        return { error: "Ish vaqtini to'g'ri tanlang" };
      }
      if (startTime >= endTime) {
        return { error: 'Boshlanish vaqti tugash vaqtidan oldin bo\'lishi kerak' };
      }
    }
    normalizedHours.push({ weekday, isDayOff, startTime, endTime });
  }

  return { name, serviceIds, hours: normalizedHours };
}

async function replaceServicesAndHours(client, masterId, serviceIds, hours) {
  await client.query('DELETE FROM master_services WHERE master_id = $1', [masterId]);
  for (const serviceId of serviceIds) {
    await client.query(
      `INSERT INTO master_services (master_id, service_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [masterId, serviceId],
    );
  }

  await client.query('DELETE FROM master_hours WHERE master_id = $1', [masterId]);
  for (const h of hours) {
    await client.query(
      `INSERT INTO master_hours (master_id, weekday, start_time, end_time, is_day_off)
       VALUES ($1, $2, $3, $4, $5)`,
      [masterId, h.weekday, h.startTime, h.endTime, h.isDayOff],
    );
  }
}

async function fetchMasters(pool, onlyId) {
  const params = onlyId ? [onlyId] : [];
  const where = onlyId ? 'WHERE id = $1' : '';
  const { rows: masterRows } = await pool.query(
    `SELECT id, name, active FROM masters ${where} ORDER BY name`,
    params,
  );
  if (masterRows.length === 0) return [];

  const ids = masterRows.map((m) => m.id);
  const { rows: msRows } = await pool.query(
    `SELECT master_id AS "masterId", service_id AS "serviceId" FROM master_services WHERE master_id = ANY($1)`,
    [ids],
  );
  const { rows: hourRows } = await pool.query(
    `SELECT master_id AS "masterId", weekday, start_time AS "startTime", end_time AS "endTime",
            is_day_off AS "isDayOff"
     FROM master_hours WHERE master_id = ANY($1) ORDER BY weekday`,
    [ids],
  );

  return masterRows.map((m) => ({
    ...m,
    serviceIds: msRows.filter((r) => r.masterId === m.id).map((r) => r.serviceId),
    hours: hourRows.filter((r) => r.masterId === m.id),
  }));
}

export default async function handler(req, res) {
  if (!requireAuth(req, res)) return;

  try {
    await ensureCoreTables();
    const pool = getPool();

    if (req.method === 'GET') {
      res.status(200).json(await fetchMasters(pool));
      return;
    }

    if (req.method === 'POST') {
      const parsed = validateMasterFields(req.body || {});
      if (parsed.error) {
        res.status(400).json({ error: parsed.error });
        return;
      }

      const id = makeId(parsed.name);
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        await client.query('INSERT INTO masters (id, name) VALUES ($1, $2)', [id, parsed.name]);
        await replaceServicesAndHours(client, id, parsed.serviceIds, parsed.hours);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }

      const [master] = await fetchMasters(pool, id);
      res.status(200).json(master);
      return;
    }

    if (req.method === 'PUT') {
      const body = req.body || {};
      const { id, active } = body;
      if (!id) {
        res.status(400).json({ error: 'Mutaxassis topilmadi' });
        return;
      }

      if (Object.keys(body).length === 2 && typeof active === 'boolean') {
        const { rows } = await pool.query(
          'UPDATE masters SET active = $2 WHERE id = $1 RETURNING id',
          [id, active],
        );
        if (rows.length === 0) {
          res.status(404).json({ error: 'Mutaxassis topilmadi' });
          return;
        }
        const [master] = await fetchMasters(pool, id);
        res.status(200).json(master);
        return;
      }

      const parsed = validateMasterFields(body);
      if (parsed.error) {
        res.status(400).json({ error: parsed.error });
        return;
      }

      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await client.query(
          'UPDATE masters SET name = $2, active = $3 WHERE id = $1 RETURNING id',
          [id, parsed.name, active !== false],
        );
        if (result.rows.length === 0) {
          await client.query('ROLLBACK');
          res.status(404).json({ error: 'Mutaxassis topilmadi' });
          return;
        }
        await replaceServicesAndHours(client, id, parsed.serviceIds, parsed.hours);
        await client.query('COMMIT');
      } catch (err) {
        await client.query('ROLLBACK');
        throw err;
      } finally {
        client.release();
      }

      const [master] = await fetchMasters(pool, id);
      res.status(200).json(master);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[admin/masters] Unexpected error:', err);
    res.status(500).json({ error: "Ma'lumotlar bazasiga ulanib bo'lmadi" });
  }
}
