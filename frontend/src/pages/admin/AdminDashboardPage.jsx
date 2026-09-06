import { useState, useEffect } from 'react';
import { adminDashboardApi } from './../../api/adminApi';
import { UsersIcon, UserGroupIcon, CalendarIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

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
          <button className="text-sm text-primary font-medium hover:underline">Lihat Semua</button>
        </div>
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
          <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Modul Manajemen Booking Belum Diimplementasikan</p>
          <p className="text-sm text-gray-400 mt-1">Daftar booking akan muncul di sini setelah API Booking Admin selesai.</p>
        </div>
      </div>
    </div>
  );
}
