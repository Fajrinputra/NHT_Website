import apiClient from './client';

export const register = (data) => apiClient.post('/auth/register', data);
export const login = (data) => apiClient.post('/auth/login', data);
export const getStatus = (nomorTelepon) => apiClient.get('/auth/status', { params: { nomorTelepon } });
export const getMe = () => apiClient.get('/auth/me');
export const changePassword = (data) => apiClient.put('/auth/password', data);
