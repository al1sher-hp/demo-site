import pg from 'pg';

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

let ensured;

export function ensureTable() {
  if (!ensured) {
    ensured = getPool()
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
        ensured = undefined;
        throw err;
      });
  }
  return ensured;
}
