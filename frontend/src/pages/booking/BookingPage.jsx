import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Calendar as CalendarIcon, Clock, HeartHandshake, FileText, CheckCircle2 } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { createBooking, getBookingHistory, getJadwalTersedia } from '../../api/bookingApi';
import { formatTanggal } from '../../utils/formatters';

const LAYANAN_OPTIONS = [
  { value: 'PIJAT_HAMIL', label: 'Pijat Hamil' },
  { value: 'PIJAT_NIFAS', label: 'Pijat Nifas' },
  { value: 'TERAPI_LAKTASI', label: 'Terapi Laktasi' },
  { value: 'PIJAT_BAYI', label: 'Pijat Bayi' },
];

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState('pesan'); // pesan | riwayat
  const [jadwals, setJadwals] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm();
  
  const selectedTanggal = watch('tanggal');

  useEffect(() => {
    if (activeTab === 'riwayat') {
      loadRiwayat();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'pesan' && selectedTanggal) {
      loadJadwal(selectedTanggal);
      setValue('jam', ''); // Reset jam jika tanggal berubah
    }
  }, [selectedTanggal, activeTab, setValue]);

  const loadRiwayat = () => {
    getBookingHistory()
      .then(res => setRiwayat(res.data.data || []))
      .catch(() => {});
  };

  const loadJadwal = (tanggal) => {
    const d = new Date(tanggal);
    getJadwalTersedia({ tahun: d.getFullYear(), bulan: d.getMonth() + 1 })
      .then(res => {
        // Filter out jadwals to only match the selected date
        const allJadwals = res.data.data || [];
        const matchingJadwals = allJadwals.filter(j => j.tanggal.startsWith(tanggal));
        setJadwals(matchingJadwals);
      })
      .catch(() => setJadwals([]));
  };

  const onSubmit = async (data) => {
    setApiError('');
    setIsLoading(true);
    try {
      await createBooking(data);
      setIsSuccess(true);
      reset();
      setActiveTab('riwayat');
      loadRiwayat();
    } catch (err) {
      setApiError(err.response?.data?.error || 'Gagal membuat pesanan');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      MENUNGGU_KONFIRMASI: 'bg-yellow-100 text-yellow-700',
      DIKONFIRMASI: 'bg-green-100 text-green-700',
      DITOLAK: 'bg-red-100 text-red-700',
      SELESAI: 'bg-blue-100 text-blue-700',
      DIBATALKAN: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`text-[10px] font-semibold px-2 py-1 rounded-md tracking-wide ${badges[status] || badges.MENUNGGU_KONFIRMASI}`}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  return (
    <AppShell>
      <PageHeader title="Pesan Layanan Homecare" />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mt-4 mb-6">
        <button
          onClick={() => { setActiveTab('pesan'); setIsSuccess(false); }}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pesan' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Pesan Layanan
        </button>
        <button
          onClick={() => { setActiveTab('riwayat'); setIsSuccess(false); }}
          className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'riwayat' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Riwayat Pesanan
        </button>
      </div>

      {activeTab === 'pesan' && (
        <section className="card max-w-lg mx-auto lg:mx-0">
          {isSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl flex gap-3 mb-5">
              <CheckCircle2 size={24} className="flex-shrink-0" />
              <div>
                <p className="font-bold text-sm">Pesanan Berhasil!</p>
                <p className="text-xs mt-1">Tim kami akan segera menghubungi Anda untuk konfirmasi jadwal.</p>
              </div>
            </div>
          )}

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Jenis Layanan */}
            <div>
              <label className="input-label flex items-center gap-2">
                <HeartHandshake size={16} className="text-gray-400" /> Jenis Layanan
              </label>
              <select
                className={`input-field ${errors.jenisLayanan ? 'border-red-400' : ''}`}
                {...register('jenisLayanan', { required: 'Pilih jenis layanan' })}
              >
                <option value="">Pilih Layanan</option>
                {LAYANAN_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {errors.jenisLayanan && <p className="input-error">{errors.jenisLayanan.message}</p>}
            </div>

            {/* Tanggal */}
            <div>
              <label className="input-label flex items-center gap-2">
                <CalendarIcon size={16} className="text-gray-400" /> Tanggal
              </label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]} // tidak bisa masa lalu
                className={`input-field ${errors.tanggal ? 'border-red-400' : ''}`}
                {...register('tanggal', { required: 'Pilih tanggal pesanan' })}
              />
              {errors.tanggal && <p className="input-error">{errors.tanggal.message}</p>}
            </div>

            {/* Jam (Tergantung tanggal) */}
            <div>
              <label className="input-label flex items-center gap-2">
                <Clock size={16} className="text-gray-400" /> Jam
              </label>
              {!selectedTanggal ? (
                <p className="text-xs text-gray-500 italic mt-1">Pilih tanggal terlebih dahulu</p>
              ) : jadwals.length === 0 ? (
                <p className="text-xs text-red-500 italic mt-1">Tidak ada jadwal tersedia pada tanggal ini</p>
              ) : (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {jadwals.map((j) => (
                    <label key={j.id} className="cursor-pointer">
                      <input
                        type="radio"
                        value={j.jam}
                        className="peer sr-only"
                        {...register('jam', { required: 'Pilih jam' })}
                      />
                      <div className="text-center py-2 border rounded-xl text-sm font-medium transition-colors peer-checked:bg-primary-600 peer-checked:text-white peer-checked:border-primary-600 hover:bg-gray-50 peer-checked:hover:bg-primary-700">
                        {j.jam}
                      </div>
                    </label>
                  ))}
                </div>
              )}
              {errors.jam && <p className="input-error">{errors.jam.message}</p>}
            </div>

            {/* Keluhan */}
            <div>
              <label className="input-label flex items-center gap-2">
                <FileText size={16} className="text-gray-400" /> Catatan / Keluhan (Opsional)
              </label>
              <textarea
                rows="3"
                placeholder="Apakah ada keluhan khusus?"
                className="input-field"
                {...register('keluhanScreening')}
              ></textarea>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={isLoading} className="btn-primary" id="btn-pesan">
                {isLoading ? 'Memproses...' : 'Pesan Sekarang'}
              </button>
            </div>
          </form>
        </section>
      )}

      {activeTab === 'riwayat' && (
        <section className="space-y-3">
          {riwayat.length === 0 ? (
            <div className="card text-center py-10">
              <CalendarIcon size={40} className="text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">Belum ada riwayat pesanan.</p>
            </div>
          ) : (
            riwayat.map(item => (
              <div key={item.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-800">
                      {LAYANAN_OPTIONS.find(l => l.value === item.jenisLayanan)?.label || item.jenisLayanan}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatTanggal(item.tanggal)} • {item.jam}
                    </p>
                  </div>
                  {getStatusBadge(item.status)}
                </div>
                
                {item.keluhanScreening && (
                  <div className="bg-gray-50 p-2.5 rounded-lg mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-0.5">Catatan Anda:</p>
                    <p className="text-xs text-gray-600 line-clamp-2">{item.keluhanScreening}</p>
                  </div>
                )}
                
                {item.catatanTerapis && (
                  <div className="bg-primary-50 p-2.5 rounded-lg border border-primary-100">
                    <p className="text-xs font-medium text-primary-800 mb-0.5">Catatan Terapis:</p>
                    <p className="text-xs text-primary-700">{item.catatanTerapis}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </section>
      )}
    </AppShell>
  );
}
