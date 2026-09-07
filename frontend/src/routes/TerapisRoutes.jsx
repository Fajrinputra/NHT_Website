import { Routes, Route, Navigate } from 'react-router-dom';
import TerapisLayout from '../components/layout/TerapisLayout';
import TerapisProtectedRoute from '../components/auth/TerapisProtectedRoute';
import TerapisLoginPage from '../pages/terapis/auth/TerapisLoginPage';
import JadwalKunjunganPage from '../pages/terapis/jadwal/JadwalKunjunganPage';
import DetailKunjunganPage from '../pages/terapis/jadwal/DetailKunjunganPage';
import RiwayatKesehatanKlienPage from '../pages/terapis/klien/RiwayatKesehatanKlienPage';

const ComingSoonTerapis = ({ title }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center mt-10">
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-500 text-sm">Modul sedang dalam tahap pengembangan.</p>
  </div>
);

export default function TerapisRoutes() {
  return (
    <Routes>
      <Route path="login" element={<TerapisLoginPage />} />

      <Route element={<TerapisProtectedRoute />}>
        <Route element={<TerapisLayout />}>
          <Route path="jadwal" element={<JadwalKunjunganPage />} />
          <Route path="booking/:id" element={<DetailKunjunganPage />} />
          <Route path="klien/:klienId/riwayat-kesehatan" element={<RiwayatKesehatanKlienPage />} />
          
          <Route path="riwayat" element={<ComingSoonTerapis title="Riwayat Input Hasil" />} />
          <Route path="profil" element={<ComingSoonTerapis title="Profil Terapis" />} />
          
          <Route path="" element={<Navigate to="/terapis/jadwal" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
