import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminBookingApi } from '../../../api/adminApi';
import { EyeIcon } from '@heroicons/react/24/outline';

const STATUS_COLORS = {
  MENUNGGU_KONFIRMASI: 'bg-yellow-100 text-yellow-800',
  DIKONFIRMASI: 'bg-green-100 text-green-800',
  SELESAI: 'bg-blue-100 text-blue-800',
  DITOLAK: 'bg-red-100 text-red-800',
  DIBATALKAN: 'bg-gray-100 text-gray-800',
};

const STATUS_LABELS = {
  MENUNGGU_KONFIRMASI: 'Menunggu',
  DIKONFIRMASI: 'Dikonfirmasi',
  SELESAI: 'Selesai',
  DITOLAK: 'Ditolak',
  DIBATALKAN: 'Dibatalkan',
};

export default function BookingListPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await adminBookingApi.getAll(filterStatus);
      if (response.data.success) {
        setBookings(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch bookings', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Booking</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filter Tabs */}
        <div className="p-4 border-b border-gray-100 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {['', 'MENUNGGU_KONFIRMASI', 'DIKONFIRMASI', 'SELESAI', 'DITOLAK', 'DIBATALKAN'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  filterStatus === status
                    ? 'bg-primary text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === '' ? 'Semua Status' : STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Nama Klien</th>
                <th className="px-6 py-4">Layanan</th>
                <th className="px-6 py-4">Tanggal & Jam</th>
                <th className="px-6 py-4">Terapis</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">Tidak ada data booking.</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-gray-900">{booking.namaKlien}</td>
                    <td className="px-6 py-4 text-gray-600">{booking.jenisLayanan.replace('_', ' ')}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {booking.tanggal} <span className="font-mono bg-gray-100 px-1 rounded">{booking.jam}</span>
                    </td>
                    <td className="px-6 py-4">
                      {booking.namaTerapis !== '-' ? (
                        <span className="font-medium text-primary">{booking.namaTerapis}</span>
                      ) : (
                        <span className="text-gray-400 italic">Belum ditugaskan</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/booking/${booking.id}`}
                        className="inline-block p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Detail Booking"
                      >
                        <EyeIcon className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
