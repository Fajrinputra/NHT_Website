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

export const terapisInputApi = {
  tambahGrafikPertumbuhan: (anakId, data) => terapisApi.post(`/anak/${anakId}/grafik-pertumbuhan`, data),
  updateImunisasi: (imunisasiId, data) => terapisApi.put(`/imunisasi/${imunisasiId}`, data),
  tambahDenverII: (anakId, data) => terapisApi.post(`/anak/${anakId}/denver-ii`, data),
  selesaikanKunjungan: (bookingId, data) => terapisApi.put(`/booking/${bookingId}/selesai`, data),
  tandaiRujukan: (bookingId, data) => terapisApi.put(`/booking/${bookingId}/rujukan`, data),
};

export const terapisProfilApi = {
  getProfil: () => terapisApi.get('/profil'),
  gantiKataSandi: (data) => terapisApi.put('/profil/kata-sandi', data),
};

export default terapisApi;
