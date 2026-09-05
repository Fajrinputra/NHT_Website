import apiClient from './client';

export const getCatatanHarian = (konteks, anakId = null) => {
  let url = `/catatan-harian?konteks=${konteks}`;
  if (anakId) url += `&anakId=${anakId}`;
  return apiClient.get(url);
};

export const createCatatanHarian = (data) => apiClient.post('/catatan-harian', data);
export const updateCatatanHarian = (id, data) => apiClient.put(`/catatan-harian/${id}`, data);
