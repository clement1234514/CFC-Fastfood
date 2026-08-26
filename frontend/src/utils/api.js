export async function apiFetch(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('cfc_token') : null;
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };
    const res = await fetch(`${endpoint}`, { ...options, headers, signal: controller.signal });
    clearTimeout(timeout);
    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error(`Le serveur ne répond pas correctement (${res.status}). Le backend est peut-être en cours de démarrage, réessayez dans 30 secondes.`);
    }
    if (!res.ok) throw new Error(data.error || 'Erreur serveur');
    return data;
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') throw new Error('Le serveur backend ne répond pas. Le serveur est peut-être en cours de démarrage, réessayez dans 30 secondes.');
    throw err;
  }
}

export default apiFetch;
