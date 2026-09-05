import apiClient from './client';

export const getAnak = () => apiClient.get('/anak');
export const createAnak = (data) => apiClient.post('/anak', data);
export const updateAnak = (id, data) => apiClient.put(`/anak/${id}`, data);
export const getGrafikPertumbuhan = (id) => apiClient.get(`/anak/${id}/grafik-pertumbuhan`);
export const getCatatanImunisasi = (id) => apiClient.get(`/anak/${id}/imunisasi`);
export const getHasilDenverII = (id) => apiClient.get(`/anak/${id}/denver-ii`);
