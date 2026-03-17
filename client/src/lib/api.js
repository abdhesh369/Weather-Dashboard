import axios from 'axios';

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || '',
  withCredentials: true,
  timeout:         12_000,
});

// ── CSRF init ────────────────────────────────────────────────────────────────
export async function initCsrf() {
  try {
    const { data } = await api.get('/api/csrf-token');
    api.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
  } catch (err) {
    console.warn('[CSRF] Could not fetch token:', err.message);
  }
}

// ── Response interceptor: refresh-token flow + 401 handling ─────────────────
let refreshing = null; // shared promise so concurrent 401s don't double-refresh

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    // Token expired → try silent refresh once
    if (
      err.response?.status === 401 &&
      !original._retried &&
      !original.url?.includes('/auth/') && // Catch both /api/auth and auth
      window.location.pathname !== '/login' // Don't auto-refresh/retry if we are already trying to log in
    ) {
      original._retried = true;
      try {
        if (!refreshing) {
          refreshing = api.post('/api/auth/refresh').finally(() => { refreshing = null; });
        }
        await refreshing;
        return api(original); // replay original request
      } catch {
        // Refresh failed — redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(err);
  }
);

// ── Request interceptor: add request timestamp for debugging ─────────────────
api.interceptors.request.use(config => {
  config.metadata = { startTime: Date.now() };
  return config;
});

export default api;
