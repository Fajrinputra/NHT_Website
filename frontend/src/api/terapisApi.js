import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/v1/terapis';

const terapisApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

terapisApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('nata_terapis_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const terapisAuthApi = {
  login: (data) => terapisApi.post('/auth/login', data),
};

export const terapisKunjunganApi = {
  getJadwal: (status = 'DIKONFIRMASI') => terapisApi.get(`/jadwal-kunjungan?status=${status}`),
  getDetail: (id) => terapisApi.get(`/booking/${id}`),
  getRiwayatKlien: (klienId) => terapisApi.get(`/klien/${klienId}/riwayat-kesehatan`),
};

export default terapisApi;
