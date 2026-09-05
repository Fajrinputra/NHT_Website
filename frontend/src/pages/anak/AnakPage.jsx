import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Plus, Baby, LineChart, Syringe, Activity, PencilLine, X } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { getAnak, createAnak } from '../../api/anakApi';
import { formatTanggal, formatUsiaAnak } from '../../utils/formatters';

export default function AnakPage() {
  const [anaks, setAnaks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [selectedAnakId, setSelectedAnakId] = useState(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const loadData = () => {
    setIsFetching(true);
    getAnak()
      .then((res) => {
        const allAnak = res.data.data || [];
        const anaks = allAnak.filter(a => a.tipeAnak === 'ANAK');
        setAnaks(anaks);
        if (anaks.length > 0 && !selectedAnakId) {
          setSelectedAnakId(anaks[0].id);
        }
      })
      .catch(() => setAnaks([]))
      .finally(() => setIsFetching(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await createAnak({
        nama: data.nama,
        tanggalLahir: data.tanggalLahir,
        jenisKelamin: data.jenisKelamin,
        beratLahir: parseFloat(data.beratLahir),
        panjangLahir: parseFloat(data.panjangLahir),
        lingkarKepalaLahir: parseFloat(data.lingkarKepalaLahir),
      });
      setIsModalOpen(false);
      reset();
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppShell>
      <PageHeader title="Buku KIA Digital - Bayi & Anak" />

      {/* Profil Anak List */}
      <section className="mt-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-800">Profil Anak (≥ 24 Bulan)</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-sm text-primary-600 font-medium hover:underline flex items-center gap-1"
            id="btn-tambah-anak"
          >
            <Plus size={16} /> Tambah Anak
          </button>
        </div>

        {isFetching ? (
          <div className="animate-pulse flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2].map((i) => (
              <div key={i} className="min-w-[260px] h-24 bg-gray-100 rounded-2xl" />
            ))}
          </div>
        ) : anaks.length === 0 ? (
          <div className="card text-center py-8">
            <Baby size={40} className="text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Belum ada data anak.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-4 btn-outline px-6 py-2 inline-flex w-auto"
            >
              Tambah Profil Anak
            </button>
          </div>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
            {anaks.map((anak) => (
              <div 
                key={anak.id} 
                onClick={() => setSelectedAnakId(anak.id)}
                className={`card min-w-[260px] flex-shrink-0 flex items-center gap-3 cursor-pointer border ${selectedAnakId === anak.id ? 'bg-primary-50 border-primary-500' : 'bg-gradient-to-br from-primary-50 to-white border-primary-100'}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${anak.jenisKelamin === 'LAKI_LAKI' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                  <Baby size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-800">{anak.nama}</p>
                  <p className="text-xs text-gray-500">
                    {formatUsiaAnak(anak.tanggalLahir)} • {formatTanggal(anak.tanggalLahir)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Menu Layanan Anak */}
      {anaks.length > 0 && (
        <section className="mt-8 space-y-3">
          <h2 className="text-base font-bold text-gray-800 mb-4">Layanan & Pemantauan</h2>
          
          <Link to={`/anak/pertumbuhan/${selectedAnakId}`} className="block">
            <div className="card flex items-center gap-3 hover:shadow-card-hover cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                <LineChart size={20} />
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">Grafik Pertumbuhan (KMS)</span>
            </div>
          </Link>
          
          <Link to={`/anak/imunisasi/${selectedAnakId}`} className="block">
            <div className="card flex items-center gap-3 hover:shadow-card-hover cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-500">
                <Syringe size={20} />
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">Catatan Imunisasi</span>
            </div>
          </Link>

          <Link to={`/anak/denver/${selectedAnakId}`} className="block">
            <div className="card flex items-center gap-3 hover:shadow-card-hover cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500">
                <Activity size={20} />
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">Hasil Denver II (Tumbuh Kembang)</span>
            </div>
          </Link>

          <Link to={`/anak/catatan-harian/${selectedAnakId}`} className="block">
            <div className="card flex items-center gap-3 hover:shadow-card-hover cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
                <PencilLine size={20} />
              </div>
              <span className="text-sm font-medium text-gray-800 flex-1">Catatan Harian Anak</span>
            </div>
          </Link>
        </section>
      )}

      {/* Modal Tambah Anak */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
              <h3 className="font-bold text-lg text-gray-800">Tambah Profil Anak</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="input-label">Nama Lengkap Anak</label>
                  <input
                    type="text"
                    className="input-field"
                    {...register('nama', { required: 'Wajib diisi' })}
                  />
                </div>
                
                <div>
                  <label className="input-label">Tanggal Lahir</label>
                  <input
                    type="date"
                    className="input-field"
                    {...register('tanggalLahir', { required: 'Wajib diisi' })}
                  />
                </div>
                
                <div>
                  <label className="input-label">Jenis Kelamin</label>
                  <select className="input-field" {...register('jenisKelamin', { required: 'Wajib diisi' })}>
                    <option value="">Pilih Jenis Kelamin</option>
                    <option value="LAKI_LAKI">Laki-laki</option>
                    <option value="PEREMPUAN">Perempuan</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="input-label">Berat Lahir (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      {...register('beratLahir')}
                    />
                  </div>
                  <div>
                    <label className="input-label">Panjang Lahir (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="input-field"
                      {...register('panjangLahir')}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label">Lingkar Kepala Lahir (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    className="input-field"
                    {...register('lingkarKepalaLahir')}
                  />
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isLoading} className="btn-primary">
                    {isLoading ? 'Menyimpan...' : 'Simpan Profil'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
