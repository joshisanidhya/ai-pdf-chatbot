/**
 * API Service — Axios instance with interceptors
 * Handles authentication headers and error normalization
 */

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 120000, // 2 minutes for LLM responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request Interceptor: attach JWT ──────────────────────────────────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sage_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor: error handling ─────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout on token expiry
      localStorage.removeItem('sage_token');
      localStorage.removeItem('sage_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

// ── Auth Service ──────────────────────────────────────────────────────────────
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data),
};

// ── Document Service ─────────────────────────────────────────────────────────
export const documentService = {
  upload: (formData, onUploadProgress) =>
    api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  getAll: (params) => api.get('/documents', { params }),
  getById: (id) => api.get(`/documents/${id}`),
  delete: (id) => api.delete(`/documents/${id}`),
  reprocess: (id) => api.post(`/documents/${id}/reprocess`),
};

// ── Chat Service ──────────────────────────────────────────────────────────────
export const chatService = {
  sendMessage: (data) => api.post('/chat', data),
  submitFeedback: (data) => api.post('/chat/feedback', data),
};

// ── Conversation Service ──────────────────────────────────────────────────────
export const conversationService = {
  getAll: (params) => api.get('/conversations', { params }),
  getById: (id) => api.get(`/conversations/${id}`),
  update: (id, data) => api.put(`/conversations/${id}`, data),
  delete: (id) => api.delete(`/conversations/${id}`),
  clearAll: (params) => api.delete('/conversations', { params }),
};

export default api;
