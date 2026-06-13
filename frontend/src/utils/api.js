const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cfc_token') : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers, signal: controller.signal });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Erreur serveur');
    return data;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('Le serveur backend ne répond pas. Vérifie que le backend tourne sur http://localhost:5000');
    throw err;
  }
}

export default apiFetch;
