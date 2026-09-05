import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import LupaSandiPage from '../pages/auth/LupaSandiPage';
import VerificationPendingPage from '../pages/auth/VerificationPendingPage';

// Dashboard
import DashboardPage from '../pages/dashboard/DashboardPage';

// Ibu Hamil
import IbuHamilPage from '../pages/ibu-hamil/IbuHamilPage';

// Anak & Bayi
import BayiPage from '../pages/bayi/BayiPage';
import AnakPage from '../pages/anak/AnakPage';
import GrafikPertumbuhanPage from '../pages/anak/GrafikPertumbuhanPage';
import TabelImunisasiPage from '../pages/anak/TabelImunisasiPage';
import DenverIIPage from '../pages/anak/DenverIIPage';
import CatatanHarianPage from '../pages/shared/CatatanHarianPage';

// Booking Homecare
import BookingPage from '../pages/booking/BookingPage';

// Artikel
import ArtikelPage from '../pages/artikel/ArtikelPage';
import ArtikelDetailPage from '../pages/artikel/ArtikelDetailPage';

// Profil & Notifikasi
import ProfilPage from '../pages/profil/ProfilPage';
import NotifikasiPage from '../pages/notifikasi/NotifikasiPage';

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
      <Route path="/lupa-sandi" element={<LupaSandiPage />} />
      <Route path="/menunggu-verifikasi" element={<VerificationPendingPage />} />

      {/* Protected */}
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/ibu-hamil" element={<ProtectedRoute><IbuHamilPage /></ProtectedRoute>} />
      <Route path="/bayi" element={<ProtectedRoute><BayiPage /></ProtectedRoute>} />
      <Route path="/anak" element={<ProtectedRoute><AnakPage /></ProtectedRoute>} />
      
      {/* KIA Digital (Bayi & Anak) */}
      <Route path="/bayi/pertumbuhan/:id" element={<ProtectedRoute><GrafikPertumbuhanPage /></ProtectedRoute>} />
      <Route path="/bayi/imunisasi/:id" element={<ProtectedRoute><TabelImunisasiPage /></ProtectedRoute>} />
      <Route path="/bayi/denver/:id" element={<ProtectedRoute><DenverIIPage /></ProtectedRoute>} />
      <Route path="/anak/pertumbuhan/:id" element={<ProtectedRoute><GrafikPertumbuhanPage /></ProtectedRoute>} />
      <Route path="/anak/imunisasi/:id" element={<ProtectedRoute><TabelImunisasiPage /></ProtectedRoute>} />
      <Route path="/anak/denver/:id" element={<ProtectedRoute><DenverIIPage /></ProtectedRoute>} />

      {/* Catatan Harian */}
      <Route path="/ibu-hamil/catatan-harian" element={<ProtectedRoute><CatatanHarianPage konteks="IBU_HAMIL" /></ProtectedRoute>} />
      <Route path="/bayi/catatan-harian/:id" element={<ProtectedRoute><CatatanHarianPage konteks="BAYI" /></ProtectedRoute>} />
      <Route path="/anak/catatan-harian/:id" element={<ProtectedRoute><CatatanHarianPage konteks="ANAK" /></ProtectedRoute>} />
      <Route path="/booking" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
      <Route path="/artikel" element={<ProtectedRoute><ArtikelPage /></ProtectedRoute>} />
      <Route path="/artikel/:id" element={<ProtectedRoute><ArtikelDetailPage /></ProtectedRoute>} />
      <Route path="/notifikasi" element={<ProtectedRoute><NotifikasiPage /></ProtectedRoute>} />
      <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
