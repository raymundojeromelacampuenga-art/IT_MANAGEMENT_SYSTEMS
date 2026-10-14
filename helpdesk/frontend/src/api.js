const BASE = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/$/, '');

async function request(path, options = {}) {
  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      ...options,
    });
  } catch {
    throw Object.assign(new Error('Cannot reach the server. Check your connection and try again.'), { errors: {} });
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw Object.assign(new Error(data?.message || `Request failed (${res.status}).`), {
      status: res.status,
      errors: data?.errors || {},
    });
  }
  return data;
}

export const api = {
  list: () => request('/tickets'),
  get: (id) => request(`/tickets/${id}`),
  create: (body) => request('/tickets', { method: 'POST', body: JSON.stringify(body) }),
  update: (id, body) => request(`/tickets/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  remove: (id) => request(`/tickets/${id}`, { method: 'DELETE' }),
};

export const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account Access', 'Email', 'Other'];
export const PRIORITIES = ['Low', 'Medium', 'High', 'Critical'];
export const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export const fmtDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
