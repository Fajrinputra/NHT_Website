import { useState, useEffect } from 'react';
import { adminJadwalApi } from '../../../api/adminApi';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import idLocale from 'date-fns/locale/id';
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

export default function JadwalPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const [jadwals, setJadwals] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newJam, setNewJam] = useState('09:00');
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      fetchJadwalForDate(selectedDate);
    }
  }, [selectedDate]);

  const fetchJadwalForDate = async (date) => {
    setLoading(true);
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      const response = await adminJadwalApi.getByTanggal(formattedDate);
      if (response.data.success) {
        setJadwals(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch jadwals', error);
      setJadwals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    try {
      const response = await adminJadwalApi.toggle(id, !currentStatus);
      if (response.data.success) {
        setJadwals(jadwals.map(j => j.id === id ? { ...j, tersedia: !currentStatus } : j));
      }
    } catch (error) {
      alert('Gagal mengubah status jadwal');
    }
  };

  const handleAddJadwal = async (e) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const response = await adminJadwalApi.create({
        tanggal: formattedDate,
        jam: newJam
      });
      
      if (response.data.success) {
        // Refresh list
        fetchJadwalForDate(selectedDate);
        setShowAddModal(false);
      }
    } catch (error) {
      alert(error.response?.data?.error || 'Gagal menambahkan jadwal');
    } finally {
      setAddLoading(false);
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // Create calendar grid including padding days
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay()); // Start from Sunday
  
  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay())); // End on Saturday
  
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const weekDays = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Jadwal Layanan</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Calendar Section */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800 capitalize">
              {format(currentDate, 'MMMM yyyy', { locale: idLocale })}
            </h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ChevronRightIcon className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-sm font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => {
              const isCurrentMonth = isSameMonth(day, currentDate);
              const isSelected = isSameDay(day, selectedDate);
              const isToday = isSameDay(day, new Date());

              return (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedDate(day);
                    if (!isCurrentMonth) setCurrentDate(day);
                  }}
                  className={`
                    aspect-square flex flex-col items-center justify-center p-2 rounded-xl transition-all relative
                    ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-700 hover:bg-gray-50'}
                    ${isSelected ? 'bg-primary text-white font-bold hover:bg-primary-dark shadow-md' : ''}
                    ${isToday && !isSelected ? 'border-2 border-primary/30 text-primary font-bold' : ''}
                  `}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Slot Panel Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800">Slot Waktu</h3>
              <p className="text-sm text-gray-500">
                {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: idLocale })}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
              title="Tambah Slot"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Memuat slot...</div>
            ) : jadwals.length === 0 ? (
              <div className="text-center py-8 text-gray-400">Tidak ada slot untuk tanggal ini.</div>
            ) : (
              jadwals.map((jadwal) => (
                <div key={jadwal.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-lg font-bold text-gray-800">{jadwal.jam}</div>
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${
                      jadwal.tersedia ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {jadwal.tersedia ? 'Tersedia' : 'Ditutup / Dipesan'}
                    </span>
                  </div>
                  
                  {/* Toggle Switch */}
                  <button
                    onClick={() => handleToggle(jadwal.id, jadwal.tersedia)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      jadwal.tersedia ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span className="sr-only">Toggle Slot</span>
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        jadwal.tersedia ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Add Slot Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl animate-scaleIn">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Tambah Slot Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddJadwal} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm text-gray-600 font-medium">
                  {format(selectedDate, 'EEEE, d MMMM yyyy', { locale: idLocale })}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jam (HH:MM)</label>
                <input
                  type="time"
                  required
                  value={newJam}
                  onChange={(e) => setNewJam(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                />
              </div>

              <div className="pt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={addLoading}
                  className="flex-1 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors font-medium disabled:opacity-50"
                >
                  {addLoading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
