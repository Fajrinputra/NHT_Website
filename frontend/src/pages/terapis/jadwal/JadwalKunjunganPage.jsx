import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { terapisKunjunganApi } from '../../../api/terapisApi';
import { CalendarIcon, ClockIcon, MapPinIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { isToday, isFuture, parseISO } from 'date-fns';

export default function JadwalKunjunganPage() {
  const [jadwal, setJadwal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('hari_ini'); // 'hari_ini' or 'mendatang'

  useEffect(() => {
    fetchJadwal();
  }, []);

  const fetchJadwal = async () => {
    try {
      const response = await terapisKunjunganApi.getJadwal('DIKONFIRMASI');
      if (response.data.success) {
        setJadwal(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch jadwal', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredJadwal = jadwal.filter(item => {
    const date = parseISO(item.tanggal);
    if (tab === 'hari_ini') {
      return isToday(date);
    }
    return isFuture(date) && !isToday(date);
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-16 z-30 md:static">
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setTab('hari_ini')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              tab === 'hari_ini' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
            }`}
          >
            Hari Ini
          </button>
          <button
            onClick={() => setTab('mendatang')}
            className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${
              tab === 'mendatang' ? 'bg-white text-primary shadow-sm' : 'text-gray-500'
            }`}
          >
            Mendatang
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Memuat jadwal kunjungan...</p>
          </div>
        ) : filteredJadwal.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Tidak ada jadwal</h3>
            <p className="text-sm text-gray-500">Anda tidak memiliki jadwal kunjungan {tab === 'hari_ini' ? 'hari ini' : 'mendatang'}.</p>
          </div>
        ) : (
          filteredJadwal.map((item) => (
            <Link
              key={item.id}
              to={`/terapis/booking/${item.id}`}
              className="block bg-white rounded-2xl shadow-sm border border-gray-100 p-4 hover:border-primary/30 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900 text-lg line-clamp-1">{item.namaKlien}</h3>
                  <p className="text-sm text-primary font-medium">{item.jenisLayanan.replace('_', ' ')}</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-full">
                  <ChevronRightIcon className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <CalendarIcon className="w-4 h-4 text-primary" />
                  <span>{item.tanggal}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600 text-sm">
                  <ClockIcon className="w-4 h-4 text-primary" />
                  <span className="font-mono bg-gray-100 px-1.5 rounded">{item.jam}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
