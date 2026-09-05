import { useState } from 'react';
import { Bell, CheckCircle2, Calendar as CalendarIcon, Info } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { formatTanggal } from '../../utils/formatters';

// MOCK DATA for now, until backend notification is ready
const MOCK_NOTIFIKASI = [
  {
    id: 1,
    type: 'BOOKING_CONFIRMED',
    title: 'Booking Dikonfirmasi',
    message: 'Pesanan Pijat Hamil Anda untuk tanggal 25 Sep 2026 jam 10:00 telah dikonfirmasi oleh admin.',
    createdAt: new Date().toISOString(),
    isRead: false
  },
  {
    id: 2,
    type: 'JADWAL_IMUNISASI',
    title: 'Pengingat Imunisasi',
    message: 'Jangan lupa jadwal imunisasi DPT 1 untuk Nata pada tanggal 28 Sep 2026.',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    isRead: true
  },
  {
    id: 3,
    type: 'INFO',
    title: 'Artikel Baru Tersedia',
    message: 'Cek artikel terbaru kami tentang "Pentingnya Pijat Laktasi Bagi Ibu Menyusui".',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    isRead: true
  }
];

export default function NotifikasiPage() {
  const [notifs, setNotifs] = useState(MOCK_NOTIFIKASI);

  const getIcon = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
        return <CheckCircle2 size={20} className="text-green-500" />;
      case 'JADWAL_IMUNISASI':
        return <CalendarIcon size={20} className="text-blue-500" />;
      default:
        return <Info size={20} className="text-primary-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'BOOKING_CONFIRMED':
        return 'bg-green-100';
      case 'JADWAL_IMUNISASI':
        return 'bg-blue-100';
      default:
        return 'bg-primary-100';
    }
  };

  const markAllAsRead = () => {
    setNotifs(notifs.map(n => ({ ...n, isRead: true })));
  };

  const unreadCount = notifs.filter(n => !n.isRead).length;

  return (
    <AppShell>
      <PageHeader title="Notifikasi" />

      <div className="flex items-center justify-between mt-4 mb-5">
        <h2 className="text-sm font-bold text-gray-800">
          Terbaru {unreadCount > 0 && <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{unreadCount}</span>}
        </h2>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-xs text-primary-600 font-medium hover:underline">
            Tandai semua dibaca
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifs.length === 0 ? (
          <div className="text-center py-10">
            <Bell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Belum ada notifikasi.</p>
          </div>
        ) : (
          notifs.map(notif => (
            <div 
              key={notif.id} 
              className={`card flex gap-4 p-4 transition-colors ${notif.isRead ? 'opacity-70 bg-white' : 'bg-primary-50 border border-primary-100'}`}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${getBgColor(notif.type)}`}>
                {getIcon(notif.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm ${notif.isRead ? 'font-semibold text-gray-700' : 'font-bold text-gray-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {formatTanggal(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{notif.message}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
