import { Link } from 'react-router-dom';
import { adminDashboardApi, adminBookingApi } from './../../api/adminApi';
import { UsersIcon, UserGroupIcon, CalendarIcon, ClipboardDocumentListIcon, EyeIcon } from '@heroicons/react/24/outline';

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

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentBookings();
  }, []);

  const fetchRecentBookings = async () => {
    try {
      const response = await adminBookingApi.getAll();
      if (response.data.success) {
        // Take the top 5 recent bookings
        setRecentBookings((response.data.data || []).slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to fetch recent bookings', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminDashboardApi.getStats();
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard stats', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { name: 'Total Klien', value: stats?.totalKlien || 0, icon: UsersIcon, color: 'bg-blue-50 text-blue-600', border: 'border-blue-100' },
    { name: 'Klien Menunggu Verifikasi', value: stats?.klienMenunggu || 0, icon: ClipboardDocumentListIcon, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
    { name: 'Booking Menunggu', value: stats?.bookingMenunggu || 0, icon: CalendarIcon, color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100' },
    { name: 'Terapis Aktif', value: stats?.terapisAktif || 0, icon: UserGroupIcon, color: 'bg-green-50 text-green-600', border: 'border-green-100' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Statistik</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.name} className={`bg-white rounded-2xl p-6 border ${card.border} shadow-sm flex items-start gap-4`}>
              <div className={`p-3 rounded-xl ${card.color}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{card.name}</p>
                <p className="text-3xl font-bold text-gray-800 mt-1">{card.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-gray-800">Booking Terbaru</h3>
          <Link to="/admin/booking" className="text-sm text-primary font-medium hover:underline">Lihat Semua</Link>
        </div>
        
        {recentBookings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">Belum ada booking terbaru</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Klien</th>
                  <th className="px-4 py-3">Layanan</th>
                  <th className="px-4 py-3">Tanggal & Jam</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-medium text-gray-900">{booking.namaKlien}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.jenisLayanan.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-gray-600">{booking.tanggal} <span className="font-mono">{booking.jam}</span></td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[booking.status]}`}>
                        {STATUS_LABELS[booking.status]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/admin/booking/${booking.id}`} className="text-primary hover:bg-primary/10 p-1 rounded transition-colors inline-block">
                        <EyeIcon className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
