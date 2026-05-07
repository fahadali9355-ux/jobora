// Add to your .env file: VITE_API_URL=http://localhost:5000
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data: any) => api.post('/api/auth/register', data),
  login: (data: any) => api.post('/api/auth/login', data),
};

export const jobsAPI = {
  getAll: (filters?: any) => api.get('/api/jobs', { params: filters }),
  getById: (id: number) => api.get(`/api/jobs/${id}`),
  create: (data: any) => api.post('/api/jobs', data),
  update: (id: number, data: any) => api.put(`/api/jobs/${id}`, data),
  delete: (id: number) => api.delete(`/api/jobs/${id}`),
};

export const applicationsAPI = {
  apply: (job_id: number, match_score?: number) => api.post('/api/apply', { job_id, match_score }),
  getSeekerApplications: () => api.get('/api/applications/seeker'),
  getJobApplications: (job_id: number) => api.get(`/api/applications/recruiter/${job_id}`),
  updateStatus: (app_id: number, status: string) => api.patch(`/api/applications/${app_id}/status`, { status }),
};

export const resumeAPI = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/resume/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  get: (user_id: number) => api.get(`/api/resume/${user_id}`),
  getTips: (user_id: number) => api.get(`/api/resume/tips/${user_id}`),
};

export const adminAPI = {
  getUsers: (role?: string) => api.get('/api/admin/users', { params: { role } }),
  getStats: () => api.get('/api/admin/stats'),
  updateUser: (id: number, data: any) => api.patch(`/api/admin/users/${id}`, data),
};

export const notificationsAPI = {
  getAll: () => api.get('/api/notifications'),
  markAllRead: () => api.patch('/api/notifications/read'),
  markOneRead: (id: number) => api.patch(`/api/notifications/${id}/read`),
};

export default api;
