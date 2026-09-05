import apiClient from './client';

export const getArtikels = (params = {}) => apiClient.get('/artikel', { params });
export const getArtikelById = (id) => apiClient.get(`/artikel/${id}`);
