import { useEffect, useState } from 'react';
import { Bell, CheckCircle2, Calendar as CalendarIcon, Info } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { formatTanggal } from '../../utils/formatters';
import { getNotifikasi, markAsRead } from '../../api/notifikasiApi';

export default function NotifikasiPage() {
  const [notifs, setNotifs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = () => {
    setIsLoading(true);
    getNotifikasi()
      .then(res => setNotifs(res.data.data || []))
      .catch(() => setNotifs([]))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

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

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    const unread = notifs.filter(n => !n.isRead);
    for (const notif of unread) {
      try {
        await markAsRead(notif.id);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
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
        {isLoading ? (
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
          ))
        ) : notifs.length === 0 ? (
          <div className="text-center py-10">
            <Bell size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Belum ada notifikasi.</p>
          </div>
        ) : (
          notifs.map(notif => (
            <div 
              key={notif.id} 
              onClick={() => !notif.isRead && handleMarkAsRead(notif.id)}
              className={`card flex gap-4 p-4 transition-colors ${!notif.isRead ? 'cursor-pointer' : ''} ${notif.isRead ? 'opacity-70 bg-white' : 'bg-primary-50 border border-primary-100'}`}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${getBgColor(notif.tipe)}`}>
                {getIcon(notif.tipe)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm ${notif.isRead ? 'font-semibold text-gray-700' : 'font-bold text-gray-900'}`}>
                    {notif.judul}
                  </h3>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap ml-2">
                    {formatTanggal(notif.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{notif.pesan}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </AppShell>
  );
}
