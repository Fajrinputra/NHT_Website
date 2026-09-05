import apiClient from './client';

export const getProfil = () => apiClient.get('/profil');
export const updateProfil = (data) => apiClient.put('/profil', data); // mock, kita belum implement PUT profil di backend
