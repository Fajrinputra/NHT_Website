import apiClient from './client';

export const createBooking = (data) => apiClient.post('/booking', data);
export const getBookingHistory = () => apiClient.get('/booking');
export const getJadwalTersedia = (params) => apiClient.get('/booking/jadwal', { params });
