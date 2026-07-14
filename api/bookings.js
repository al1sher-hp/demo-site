import { services, masters } from './_data.js';
import { getPool, ensureTable } from './_db.js';
import { sendTelegramNotification } from './_telegram.js';

const BOOKING_COLUMNS = `
  id,
  service_id AS "serviceId",
  master_id AS "masterId",
  date,
  time,
  client_name AS "name",
  client_phone AS "phone",
  created_at AS "createdAt"
`;

function enrich(row) {
  const service = services.find((s) => s.id === row.serviceId);
  const master = masters.find((m) => m.id === row.masterId);
  return {
    ...row,
    serviceName: service?.name ?? row.serviceId,
    masterName: master?.name ?? row.masterId,
    price: service?.price ?? null,
  };
}

async function handleGet(req, res, pool) {
  const { date, masterId } = req.query;
  const conditions = [];
  const params = [];

  if (date) {
    params.push(date);
    conditions.push(`date = $${params.length}`);
  }
  if (masterId) {
    params.push(masterId);
    conditions.push(`master_id = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const { rows } = await pool.query(
    `SELECT ${BOOKING_COLUMNS} FROM demo_bookings ${where} ORDER BY time ASC`,
    params,
  );

  res.status(200).json(rows.map(enrich));
}

async function handlePost(req, res, pool) {
  const { serviceId, masterId, date, time, name, phone } = req.body || {};

  if (!serviceId || !masterId || !date || !time || !name || !phone) {
    res.status(400).json({ error: "Ma'lumotlar to'liq emas" });
    return;
  }

  const service = services.find((s) => s.id === serviceId);
  const master = masters.find((m) => m.id === masterId);

  if (!service || !master || !master.services.includes(serviceId)) {
    res.status(400).json({ error: "Noto'g'ri xizmat yoki mutaxassis tanlandi" });
    return;
  }

  let rows;
  try {
    ({ rows } = await pool.query(
      `INSERT INTO demo_bookings (service_id, master_id, date, time, client_name, client_phone)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${BOOKING_COLUMNS}`,
      [serviceId, masterId, date, time, String(name).trim(), String(phone).trim()],
    ));
  } catch (err) {
    if (err.code === '23505') {
      res.status(409).json({ error: 'Kechirasiz, bu vaqt band qilindi. Boshqa vaqtni tanlang.' });
      return;
    }
    throw err;
  }

  const booking = enrich(rows[0]);

  try {
    await sendTelegramNotification(booking);
  } catch (err) {
    console.error('[bookings] Telegram notification threw unexpectedly:', err);
  }

  res.status(200).json({ success: true, booking });
}

export default async function handler(req, res) {
  try {
    const pool = getPool();
    await ensureTable();

    if (req.method === 'GET') {
      await handleGet(req, res, pool);
      return;
    }
    if (req.method === 'POST') {
      await handlePost(req, res, pool);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[bookings] Unexpected error:', err);
    res.status(500).json({ error: "Ma'lumotlar bazasiga ulanib bo'lmadi" });
  }
}
