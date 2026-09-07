import { Routes, Route, Navigate } from 'react-router-dom';
import TerapisLayout from '../components/layout/TerapisLayout';
import TerapisProtectedRoute from '../components/auth/TerapisProtectedRoute';
import TerapisLoginPage from '../pages/terapis/auth/TerapisLoginPage';
import JadwalKunjunganPage from '../pages/terapis/jadwal/JadwalKunjunganPage';
import DetailKunjunganPage from '../pages/terapis/jadwal/DetailKunjunganPage';
import RiwayatKesehatanKlienPage from '../pages/terapis/klien/RiwayatKesehatanKlienPage';
import FormInputMedisPage from '../pages/terapis/input/FormInputMedisPage';
import FormRujukanPage from '../pages/terapis/input/FormRujukanPage';
import RiwayatKunjunganPage from '../pages/terapis/riwayat/RiwayatKunjunganPage';
import ProfilTerapisPage from '../pages/terapis/profil/ProfilTerapisPage';

export default function TerapisRoutes() {
  return (
    <Routes>
      <Route path="login" element={<TerapisLoginPage />} />

      <Route element={<TerapisProtectedRoute />}>
        <Route element={<TerapisLayout />}>
          <Route path="jadwal" element={<JadwalKunjunganPage />} />
          <Route path="booking/:id" element={<DetailKunjunganPage />} />
          <Route path="klien/:klienId/riwayat-kesehatan" element={<RiwayatKesehatanKlienPage />} />
          <Route path="booking/:id/input" element={<FormInputMedisPage />} />
          <Route path="booking/:id/rujukan" element={<FormRujukanPage />} />
          
          <Route path="riwayat" element={<RiwayatKunjunganPage />} />
          <Route path="profil" element={<ProfilTerapisPage />} />
          
          <Route path="" element={<Navigate to="/terapis/jadwal" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}
