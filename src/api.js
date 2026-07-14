const API_BASE = '/api';

export async function fetchServices() {
  const res = await fetch(`${API_BASE}/services`);
  return res.json();
}

export async function fetchMasters() {
  const res = await fetch(`${API_BASE}/masters`);
  return res.json();
}

export async function fetchSlots(masterId, date) {
  const res = await fetch(`${API_BASE}/slots?masterId=${encodeURIComponent(masterId)}&date=${encodeURIComponent(date)}`);
  return res.json();
}

export async function createBooking(payload) {
  const res = await fetch(`${API_BASE}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.error || 'Nimadir xato ketdi');
    err.status = res.status;
    throw err;
  }
  return data;
}

export async function fetchTodayBookings() {
  const res = await fetch(`${API_BASE}/bookings/today`);
  return res.json();
}
