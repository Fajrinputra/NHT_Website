import apiClient from './client';

export const getNotifikasi = () => apiClient.get('/notifikasi');
export const getUnreadCount = () => apiClient.get('/notifikasi/unread-count');
export const markAsRead = (id) => apiClient.put(`/notifikasi/${id}/read`);
