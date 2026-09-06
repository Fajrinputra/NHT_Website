import axios from 'axios';

const ADMIN_API_URL = import.meta.env.VITE_API_URL + '/admin';

const adminApi = axios.create({
  baseURL: ADMIN_API_URL,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nata_admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const adminAuthApi = {
  login: (email, kataSandi) => adminApi.post('/auth/login', { email, kataSandi }),
};

export const adminDashboardApi = {
  getStats: () => adminApi.get('/dashboard/stats'),
};

export const adminKlienApi = {
  getAll: (status) => adminApi.get('/klien', { params: { status } }),
  getDetail: (id) => adminApi.get(`/klien/${id}`),
  updateVerifikasi: (id, status) => adminApi.put(`/klien/${id}/verifikasi`, { status }),
};

export const adminTerapisApi = {
  getAll: () => adminApi.get('/terapis'),
  create: (data) => adminApi.post('/terapis', data),
  update: (id, data) => adminApi.put(`/terapis/${id}`, data),
};

export const adminArtikelApi = {
  getAll: () => adminApi.get('/artikel'),
  create: (data) => adminApi.post('/artikel', data),
  update: (id, data) => adminApi.put(`/artikel/${id}`, data),
  delete: (id) => adminApi.delete(`/artikel/${id}`),
};

export const adminJadwalApi = {
  getByTanggal: (tanggal) => adminApi.get(`/jadwal?tanggal=${tanggal}`),
  create: (data) => adminApi.post('/jadwal', data),
  toggle: (id, tersedia) => adminApi.put(`/jadwal/${id}/toggle`, { tersedia }),
};

export const adminBookingApi = {
  getAll: (status = '') => adminApi.get(`/booking${status ? `?status=${status}` : ''}`),
  getById: (id) => adminApi.get(`/booking/${id}`),
  update: (id, data) => adminApi.put(`/booking/${id}`, data),
};

export default adminApi;
