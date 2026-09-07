import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { terapisKunjunganApi } from '../../../api/terapisApi';
import { ArrowLeftIcon, ClockIcon, CalendarIcon, UserIcon, DocumentTextIcon, ClipboardDocumentCheckIcon } from '@heroicons/react/24/outline';

export default function DetailKunjunganPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await terapisKunjunganApi.getDetail(id);
      if (response.data.success) {
        setBooking(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat detail kunjungan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Memuat detail...</div>;
  }

  if (error || !booking) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => navigate('/terapis/jadwal')} className="text-primary font-bold">
          Kembali ke Jadwal
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Detail Kunjungan</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-5">
        
        {/* Info Klien */}
        <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <UserIcon className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{booking.namaKlien}</h3>
            <p className="text-sm text-gray-500">{booking.jenisLayanan.replace('_', ' ')}</p>
          </div>
        </div>

        {/* Waktu Pelaksanaan */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <CalendarIcon className="w-4 h-4" />
              <span className="text-xs font-medium">Tanggal</span>
            </div>
            <p className="font-bold text-gray-800 text-sm">{booking.tanggal}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <ClockIcon className="w-4 h-4" />
              <span className="text-xs font-medium">Jam</span>
            </div>
            <p className="font-bold text-gray-800 font-mono text-sm">{booking.jam}</p>
          </div>
        </div>

        {/* Keluhan */}
        <div>
          <h4 className="text-sm font-bold text-gray-800 mb-2 flex items-center gap-2">
            <DocumentTextIcon className="w-4 h-4 text-primary" />
            Keluhan / Catatan Klien
          </h4>
          <div className="bg-yellow-50 text-yellow-900 p-4 rounded-xl text-sm leading-relaxed border border-yellow-100 whitespace-pre-wrap">
            {booking.keluhanScreening || <span className="italic text-yellow-700/50">Tidak ada keluhan.</span>}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 gap-3">
        <Link
          to={`/terapis/klien/${booking.klienId}/riwayat-kesehatan`}
          className="flex items-center justify-center gap-2 w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold shadow-sm active:bg-gray-50 transition-colors"
        >
          <DocumentTextIcon className="w-5 h-5" />
          Lihat Riwayat Kesehatan Klien
        </Link>

        {booking.status === 'DIKONFIRMASI' && (
          <button
            className="flex items-center justify-center gap-2 w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 active:bg-primary-dark transition-all"
            onClick={() => alert('Fitur Input Hasil (Terapis Prompt 2) akan dibangun di sesi berikutnya')}
          >
            <ClipboardDocumentCheckIcon className="w-5 h-5" />
            Mulai / Input Hasil Kunjungan
          </button>
        )}
      </div>

    </div>
  );
}
