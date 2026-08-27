import axios from 'axios';

const TOKEN_KEY = 'nexgen_admin_token';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const trimmed = envUrl.trim().replace(/\/+$/, '');
  if (!trimmed.endsWith('/api')) {
    return `${trimmed}/api`;
  }
  return trimmed;
};

const api = axios.create({
  baseURL: getBaseUrl(),
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for token attachment
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized 401 handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const token = localStorage.getItem(TOKEN_KEY);
    const requestUrl = error.config?.url || '';

    // Only dispatch admin unauthorized event if an admin token actually exists
    // AND the request belongs to an authenticated admin flow or protected route.
    if (
      error.response &&
      error.response.status === 401 &&
      token &&
      (requestUrl.includes('/admin') || requestUrl.includes('/auth/me'))
    ) {
      window.dispatchEvent(new CustomEvent('nexgen_auth_unauthorized'));
    }
    return Promise.reject(error);
  }
);

export default api;
