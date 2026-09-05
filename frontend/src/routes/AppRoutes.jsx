import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerificationPendingPage from '../pages/auth/VerificationPendingPage';

// Dashboard
import DashboardPage from '../pages/dashboard/DashboardPage';

// Ibu Hamil
import IbuHamilPage from '../pages/ibu-hamil/IbuHamilPage';

// Anak & Bayi
import BayiPage from '../pages/bayi/BayiPage';

// Booking Homecare
import BookingPage from '../pages/booking/BookingPage';

// Placeholder pages (dibuat session berikutnya)
const ComingSoon = ({ name }) => (
  <div className="min-h-screen bg-surface flex items-center justify-center">
    <p className="text-gray-400 font-medium">{name} — coming soon</p>
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      {/* Auth */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/menunggu-verifikasi" element={<VerificationPendingPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/ibu-hamil" element={<ProtectedRoute><IbuHamilPage /></ProtectedRoute>} />
      <Route path="/bayi" element={<ProtectedRoute><BayiPage /></ProtectedRoute>} />
      <Route path="/anak" element={<ProtectedRoute><BayiPage /></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/artikel" element={<ProtectedRoute><ComingSoon name="Artikel" /></ProtectedRoute>} />
      <Route path="/artikel/:id" element={<ProtectedRoute><ComingSoon name="Detail Artikel" /></ProtectedRoute>} />
      <Route path="/notifikasi" element={<ProtectedRoute><ComingSoon name="Notifikasi" /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ComingSoon name="Profil" /></ProtectedRoute>} />

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
