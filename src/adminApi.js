const API_BASE = '/api/admin';

export const GENERIC_ERROR_MESSAGE = "Ma'lumotlarni yuklab bo'lmadi — sahifani yangilab ko'ring";

async function request(path, { method = 'GET', body } = {}) {
  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body,
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

export function checkAuth() {
  return request('/me');
}

export function login(password) {
  return request('/login', { method: 'POST', body: JSON.stringify({ password }) });
}

export function logout() {
  return request('/logout', { method: 'POST' });
}

export function fetchAdminServices() {
  return request('/services');
}

export function createService(payload) {
  return request('/services', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateService(payload) {
  return request('/services', { method: 'PUT', body: JSON.stringify(payload) });
}

export function toggleServiceActive(id, active) {
  return request('/services', { method: 'PUT', body: JSON.stringify({ id, active }) });
}

export function fetchAdminMasters() {
  return request('/masters');
}

export function createMaster(payload) {
  return request('/masters', { method: 'POST', body: JSON.stringify(payload) });
}

export function updateMaster(payload) {
  return request('/masters', { method: 'PUT', body: JSON.stringify(payload) });
}

export function toggleMasterActive(id, active) {
  return request('/masters', { method: 'PUT', body: JSON.stringify({ id, active }) });
}

export function fetchAdminBookings(date) {
  return request(`/bookings?date=${encodeURIComponent(date)}`);
}

export function cancelBooking(id) {
  return request(`/bookings?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
}
