import pg from 'pg';
import { SEED_SERVICES, SEED_MASTERS, SEED_WORKING_HOURS } from './_data.js';

const { Pool } = pg;

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
  }
  return pool;
}

let bookingsReady;

export function ensureBookingsTable() {
  if (!bookingsReady) {
    bookingsReady = getPool()
      .query(`
        CREATE TABLE IF NOT EXISTS demo_bookings (
          id SERIAL PRIMARY KEY,
          service_id TEXT NOT NULL,
          master_id TEXT NOT NULL,
          date TEXT NOT NULL,
          time TEXT NOT NULL,
          client_name TEXT NOT NULL,
          client_phone TEXT NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT now(),
          UNIQUE (master_id, date, time)
        )
      `)
      .catch((err) => {
        bookingsReady = undefined;
        throw err;
      });
  }
  return bookingsReady;
}

let coreReady;

export function ensureCoreTables() {
  if (!coreReady) {
    coreReady = setupCoreTables().catch((err) => {
      coreReady = undefined;
      throw err;
    });
  }
  return coreReady;
}

async function setupCoreTables() {
  const pool = getPool();

  await pool.query(`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration_min INTEGER NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS masters (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      active BOOLEAN NOT NULL DEFAULT true,
      rating NUMERIC(2, 1) NOT NULL DEFAULT 4.9
    )
  `);
  // Column added after the initial release — ALTER ... ADD COLUMN IF NOT EXISTS
  // migrates already-deployed databases without a separate migration step.
  await pool.query(`ALTER TABLE masters ADD COLUMN IF NOT EXISTS rating NUMERIC(2, 1) NOT NULL DEFAULT 4.9`);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS master_services (
      master_id TEXT NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
      service_id TEXT NOT NULL REFERENCES services(id) ON DELETE CASCADE,
      PRIMARY KEY (master_id, service_id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS master_hours (
      master_id TEXT NOT NULL REFERENCES masters(id) ON DELETE CASCADE,
      weekday SMALLINT NOT NULL CHECK (weekday BETWEEN 0 AND 6),
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      is_day_off BOOLEAN NOT NULL DEFAULT false,
      PRIMARY KEY (master_id, weekday)
    )
  `);

  await seedIfEmpty(pool);
}

async function seedIfEmpty(pool) {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM services');
  if (rows[0].count > 0) return;

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    for (const s of SEED_SERVICES) {
      await client.query(
        `INSERT INTO services (id, name, price, duration_min) VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO NOTHING`,
        [s.id, s.name, s.price, s.durationMin],
      );
    }

    for (const m of SEED_MASTERS) {
      await client.query(
        `INSERT INTO masters (id, name, rating) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING`,
        [m.id, m.name, m.rating],
      );

      for (const serviceId of m.services) {
        await client.query(
          `INSERT INTO master_services (master_id, service_id) VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [m.id, serviceId],
        );
      }

      for (let weekday = 0; weekday <= 6; weekday++) {
        await client.query(
          `INSERT INTO master_hours (master_id, weekday, start_time, end_time, is_day_off)
           VALUES ($1, $2, $3, $4, false)
           ON CONFLICT DO NOTHING`,
          [m.id, weekday, SEED_WORKING_HOURS.start, SEED_WORKING_HOURS.end],
        );
      }
    }

    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
