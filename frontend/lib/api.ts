import { useAuthStore } from '@/stores/authStore';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor - attach token
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Response interceptor - handle 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

// Public API calls
export const publicApi = {
  getHome: () => api.get('/home'),
  getAbout: () => api.get('/about'),
  getCourses: (params?: object) => api.get('/courses', { params }),
  getCourse: (id: string) => api.get(`/courses/${id}`),
  getFaculty: (params?: object) => api.get('/faculty', { params }),
  getGallery: (params?: object) => api.get('/gallery', { params }),
  submitContact: (data: object) => api.post('/contact', data),
  submitAdmission: (data: object) => api.post('/admissions', data),
  checkAdmission: (appNo: string) => api.get(`/admissions/check/${appNo}`),
};

// Admin API calls
export const adminApi = {
  login: (data: object) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  changePassword: (data: object) => api.put('/auth/change-password', data),
  getDashboardStats: () => api.get('/dashboard/stats'),

  // Faculty
  getFaculty: (params?: object) => api.get('/faculty', { params }),
  createFaculty: (data: FormData) => api.post('/faculty', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateFaculty: (id: string, data: FormData) => api.put(`/faculty/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteFaculty: (id: string) => api.delete(`/faculty/${id}`),

  // Courses
  getCourses: () => api.get('/courses'),
  createCourse: (data: FormData) => api.post('/courses', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateCourse: (id: string, data: FormData) => api.put(`/courses/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  deleteCourse: (id: string) => api.delete(`/courses/${id}`),

  // Gallery
  getGallery: (params?: object) => api.get('/gallery', { params }),
  uploadGallery: (data: FormData) => api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateGallery: (id: string, data: object) => api.put(`/gallery/${id}`, data),
  deleteGallery: (id: string) => api.delete(`/gallery/${id}`),
  bulkDeleteGallery: (ids: string[]) => api.post('/gallery/bulk-delete', { ids }),

  // Admissions
  getAdmissions: (params?: object) => api.get('/admissions', { params }),
  getAdmission: (id: string) => api.get(`/admissions/${id}`),
  updateAdmissionStatus: (id: string, data: object) => api.put(`/admissions/${id}/status`, data),

  // Contacts
  getContacts: (params?: object) => api.get('/contact', { params }),
  updateContact: (id: string, data: object) => api.put(`/contact/${id}`, data),
  deleteContact: (id: string) => api.delete(`/contact/${id}`),

  // Content
  updateHome: (data: object) => api.put('/home', data),
  addNotice: (data: object) => api.post('/home/notices', data),
  deleteNotice: (id: string) => api.delete(`/home/notices/${id}`),
  updateAbout: (data: object) => api.put('/about', data),
};

export default api;