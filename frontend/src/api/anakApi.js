import apiClient from './client';

export const getAnak = () => apiClient.get('/anak');
export const createAnak = (data) => apiClient.post('/anak', data);
export const updateAnak = (id, data) => apiClient.put(`/anak/${id}`, data);
