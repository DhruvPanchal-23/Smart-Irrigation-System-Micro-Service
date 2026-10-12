import axios from 'axios';
const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8100/api/v1', timeout: 15000 });
api.interceptors.request.use((config) => { const token = localStorage.getItem('irrigation_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
api.interceptors.response.use((r) => r, (error) => { if (error.response?.status === 401) { localStorage.removeItem('irrigation_token'); window.dispatchEvent(new Event('auth:expired')); } return Promise.reject(error); });
export default api;
