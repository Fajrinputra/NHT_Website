import apiClient from './client';

export const getIbuHamil = () => apiClient.get('/ibu-hamil');
export const updateIbuHamil = (data) => apiClient.put('/ibu-hamil', data);
