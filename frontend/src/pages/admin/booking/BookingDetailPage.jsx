import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminBookingApi, adminTerapisApi } from '../../../api/adminApi';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const STATUS_LABELS = {
  MENUNGGU_KONFIRMASI: 'Menunggu',
  DIKONFIRMASI: 'Dikonfirmasi',
  SELESAI: 'Selesai',
  DITOLAK: 'Ditolak',
  DIBATALKAN: 'Dibatalkan',
};

export default function BookingDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [terapisList, setTerapisList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    terapisId: '',
    status: '',
    catatanTerapis: ''
  });

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bookingRes, terapisRes] = await Promise.all([
        adminBookingApi.getById(id),
        adminTerapisApi.getAll()
      ]);
      
      if (bookingRes.data.success) {
        const b = bookingRes.data.data;
        setBooking(b);
        setFormData({
          terapisId: b.terapisId || '',
          status: b.status,
          catatanTerapis: b.catatanTerapis || ''
        });
      }
      
      if (terapisRes.data.success) {
        // Filter only active terapis
        setTerapisList(terapisRes.data.data.filter(t => t.aktif));
      }
    } catch (error) {
      console.error('Error fetching data', error);
      alert('Gagal memuat detail booking');
      navigate('/admin/booking');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        terapisId: formData.terapisId === '' ? null : formData.terapisId,
        status: formData.status,
        catatanTerapis: formData.catatanTerapis
      };
      
      const response = await adminBookingApi.update(id, payload);
      if (response.data.success) {
        alert('Booking berhasil diperbarui');
        navigate('/admin/booking');
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menyimpan perubahan');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !booking) {
    return <div className="text-center py-12 text-gray-500">Memuat detail...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/admin/booking" className="p-2 bg-white rounded-xl shadow-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Detail & Penugasan Booking</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Informasi Klien */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3">Informasi Pesanan</h3>
          
          <div>
            <p className="text-sm text-gray-500">Nama Klien</p>
            <p className="font-bold text-gray-900">{booking.namaKlien}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Layanan</p>
            <p className="font-medium text-gray-900">{booking.jenisLayanan.replace('_', ' ')}</p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Jadwal</p>
            <p className="font-medium text-gray-900">{booking.tanggal} <span className="font-mono bg-gray-100 px-1 rounded">{booking.jam}</span></p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">Waktu Dipesan</p>
            <p className="text-sm text-gray-700">{new Date(booking.createdAt).toLocaleString('id-ID')}</p>
          </div>
        </div>

        {/* Form Penugasan */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-3 mb-4">Penugasan & Status</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Terapis Bertugas</label>
              <select
                value={formData.terapisId}
                onChange={(e) => setFormData({ ...formData, terapisId: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="">-- Belum Ditugaskan --</option>
                {terapisList.map(t => (
                  <option key={t.id} value={t.id}>{t.nama}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hanya menampilkan terapis yang berstatus aktif.</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Status Booking</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all font-medium"
              >
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
        </div>

        {/* Keluhan & Catatan */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Keluhan / Skrining dari Klien</h3>
            <div className="p-4 bg-yellow-50 text-yellow-900 rounded-xl whitespace-pre-wrap text-sm border border-yellow-100 min-h-[80px]">
              {booking.keluhanScreening || <span className="italic text-yellow-700/50">Tidak ada keluhan yang ditulis.</span>}
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-gray-800 text-lg mb-2">Catatan Terapis (Internal/Hasil)</h3>
            <textarea
              value={formData.catatanTerapis}
              onChange={(e) => setFormData({ ...formData, catatanTerapis: e.target.value })}
              rows="4"
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Catatan hasil pelayanan, rekomendasi, dll..."
            />
            <p className="text-xs text-gray-500 mt-1 text-right">Tekan "Simpan Perubahan" di panel atas untuk menyimpan catatan.</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
