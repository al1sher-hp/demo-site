const API_BASE = '/api';

export const GENERIC_ERROR_MESSAGE = "Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring";

async function getJson(url) {
  let res;
  try {
    res = await fetch(url);
  } catch {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  if (!res.ok) {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  return res.json();
}

export function fetchServices() {
  return getJson(`${API_BASE}/services`);
}

export function fetchMasters() {
  return getJson(`${API_BASE}/masters`);
}

export function fetchBookingsForDate(date) {
  return getJson(`${API_BASE}/bookings?date=${encodeURIComponent(date)}`);
}

export async function createBooking(payload) {
  let res;
  try {
    res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(GENERIC_ERROR_MESSAGE);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || GENERIC_ERROR_MESSAGE);
    err.status = res.status;
    throw err;
  }
  return data;
}
