import { Routes, Route, Navigate } from 'react-router-dom';
import AdminProtectedRoute from './AdminProtectedRoute';
import AdminLayout from '../components/layout/AdminLayout';

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import KlienListPage from '../pages/admin/klien/KlienListPage';
import KlienDetailPage from '../pages/admin/klien/KlienDetailPage';
import TerapisListPage from '../pages/admin/terapis/TerapisListPage';
import TerapisFormPage from '../pages/admin/terapis/TerapisFormPage';
import ArtikelListPage from '../pages/admin/artikel/ArtikelListPage';
import ArtikelFormPage from '../pages/admin/artikel/ArtikelFormPage';
import JadwalPage from '../pages/admin/jadwal/JadwalPage';
import BookingListPage from '../pages/admin/booking/BookingListPage';
import BookingDetailPage from '../pages/admin/booking/BookingDetailPage';

const ComingSoonAdmin = ({ title }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center min-h-[400px] flex flex-col items-center justify-center">
    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
      <span className="text-2xl text-gray-400">🚧</span>
    </div>
    <h2 className="text-xl font-bold text-gray-800 mb-2">{title}</h2>
    <p className="text-gray-500">Fitur ini sedang dalam tahap pengembangan.</p>
  </div>
);

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<AdminLoginPage />} />
      
      <Route element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
        <Route path="/dashboard" element={<AdminDashboardPage />} />
        
        <Route path="/klien" element={<KlienListPage />} />
        <Route path="/klien/:id" element={<KlienDetailPage />} />
        
        <Route path="/terapis" element={<TerapisListPage />} />
        <Route path="/terapis/tambah" element={<TerapisFormPage mode="create" />} />
        <Route path="/terapis/:id/edit" element={<TerapisFormPage mode="edit" />} />
        
        <Route path="/artikel" element={<ArtikelListPage />} />
        <Route path="/artikel/tambah" element={<ArtikelFormPage mode="create" />} />
        <Route path="/artikel/:id/edit" element={<ArtikelFormPage mode="edit" />} />
        
        <Route path="/jadwal" element={<JadwalPage />} />
        
        <Route path="/booking" element={<BookingListPage />} />
        <Route path="/booking/:id" element={<BookingDetailPage />} />
        
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      </Route>
    </Routes>
  );
}
