import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  withCredentials: true,
});

export async function initCsrf() {
  try {
    const { data } = await api.get('/api/csrf-token');
    api.defaults.headers.common['X-CSRF-Token'] = data.csrfToken;
  } catch (err) {
    console.warn('[CSRF] Could not fetch token:', err.message);
  }
}

// Intercept 401 — clear state, redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && window.location.pathname !== '/login') {
      // Let AuthContext handle the redirect; just pass through
    }
    return Promise.reject(err);
  }
);

export default api;
