import axios from 'axios';

// Base URL — change to your Render backend URL in production
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Tickets ───────────────────────────────────────────
export const getTickets = () => api.get('/tickets');
export const getTicketById = (id) => api.get(`/tickets/${id}`);
export const createTicket = (data) => api.post('/tickets', data);
export const updateTicket = (id, data) => api.put(`/tickets/${id}`, data);
export const deleteTicket = (id) => api.delete(`/tickets/${id}`);

// ─── ML Classification ──────────────────────────────────
export const classifyTicket = (data) => api.post('/ml/classify', data);

// ─── Chatbot ────────────────────────────────────────────
export const sendChatMessage = (message) => api.post('/chatbot/message', { message });

// ─── Admin / Analytics ─────────────────────────────────
export const getDashboardStats = () => api.get('/admin/stats');
export const getChartData = () => api.get('/admin/chart-data');
export const getAgentPerformance = () => api.get('/admin/agents');
export const getRecentActivity = () => api.get('/admin/activity');

// ─── Auth ───────────────────────────────────────────────
export const login = (data) => api.post('/auth/login', data);
export const register = (data) => api.post('/auth/register', data);
export const logout = () => { localStorage.removeItem('token'); };

export default api;
