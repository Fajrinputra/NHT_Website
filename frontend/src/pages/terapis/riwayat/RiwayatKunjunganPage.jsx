import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { terapisKunjunganApi } from '../../../api/terapisApi';
import { CalendarIcon, ClockIcon, UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

export default function RiwayatKunjunganPage() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      const response = await terapisKunjunganApi.getJadwal('SELESAI');
      if (response.data.success) {
        setJadwal(response.data.data || []);
      }
    } catch (error) {
      console.error('Gagal memuat riwayat kunjungan:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Riwayat Kunjungan Selesai</h2>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat riwayat...</div>
      ) : jadwal.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircleIcon className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 font-medium">Belum ada riwayat kunjungan yang diselesaikan.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jadwal.map((item) => (
            <Link
              key={item.id}
              to={`/terapis/booking/${item.id}`}
              className="block bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-1.5 rounded-lg">
                    <UserIcon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-bold text-gray-900">{item.namaKlien}</h3>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-md">
                  SELESAI
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-1.5">
                  <CalendarIcon className="w-4 h-4" />
                  {item.tanggal}
                </div>
                <div className="flex items-center gap-1.5">
                  <ClockIcon className="w-4 h-4" />
                  {item.jam}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {item.jenisLayanan.replace('_', ' ')}
                </span>
                <span className="text-primary text-sm font-bold">Lihat Detail &rarr;</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
