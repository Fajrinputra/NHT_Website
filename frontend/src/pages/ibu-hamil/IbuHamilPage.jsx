import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { CalendarDays, ChevronRight, BookOpen, Baby, PencilLine } from 'lucide-react';
import { getIbuHamil, updateIbuHamil } from '../../api/ibuHamilApi';
import { getArtikels } from '../../api/artikelApi';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { formatTanggal } from '../../utils/formatters';

export default function IbuHamilPage() {
  const [data, setData] = useState(null);
  const [artikels, setArtikels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [apiError, setApiError] = useState('');

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();

  // Load existing data
  useEffect(() => {
    Promise.all([
      getIbuHamil(),
      getArtikels({ limit: 2, kategori: 'IBU_HAMIL' }),
    ])
      .then(([ibuRes, artikelRes]) => {
        const ibuData = ibuRes.data.data;
        setData(ibuData);

        // Pre-fill form if data exists
        if (ibuData?.hpht) {
          setValue('hpht', ibuData.hpht.split('T')[0]);
        }
        if (ibuData?.beratSebelumHamil) {
          setValue('beratSebelumHamil', ibuData.beratSebelumHamil);
        }
        if (ibuData?.tinggiBadan) {
          setValue('tinggiBadan', ibuData.tinggiBadan);
        }

        setArtikels(artikelRes.data.data || []);
      })
      .catch(() => {})
      .finally(() => setIsFetching(false));
  }, [setValue]);

  const onSubmit = async (formData) => {
    setApiError('');
    setIsLoading(true);
    try {
      const res = await updateIbuHamil({
        hpht: formData.hpht,
        beratSebelumHamil: parseFloat(formData.beratSebelumHamil),
        tinggiBadan: parseFloat(formData.tinggiBadan),
      });
      setData(res.data.data);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Gagal menyimpan data');
    } finally {
      setIsLoading(false);
    }
  };

  const trimesterLabel = data?.trimester
    ? `Trimester ${data.trimester}`
    : null;

  return (
    <AppShell>
      <PageHeader title="Ibu Hamil" />

      <div className="mt-4 space-y-4 lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0">
        {/* ── Kalkulator Kehamilan ── */}
        <section className="card">
          <h2 className="text-base font-bold text-gray-800 mb-4">Kalkulator Kehamilan</h2>

          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {/* HPHT */}
            <div>
              <label htmlFor="hpht" className="input-label">Tanggal HPHT</label>
              <input
                id="hpht"
                type="date"
                className={`input-field ${errors.hpht ? 'border-red-400' : ''}`}
                {...register('hpht', { required: 'Tanggal HPHT wajib diisi' })}
              />
              {errors.hpht && <p className="input-error">{errors.hpht.message}</p>}
            </div>

            {/* BB & TB side by side */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="beratSebelumHamil" className="input-label">BB saat ini (kg)</label>
                <input
                  id="beratSebelumHamil"
                  type="number"
                  step="0.1"
                  placeholder="62"
                  className={`input-field ${errors.beratSebelumHamil ? 'border-red-400' : ''}`}
                  {...register('beratSebelumHamil', {
                    required: 'Wajib diisi',
                    min: { value: 20, message: 'Terlalu kecil' },
                    max: { value: 300, message: 'Terlalu besar' },
                  })}
                />
                {errors.beratSebelumHamil && (
                  <p className="input-error">{errors.beratSebelumHamil.message}</p>
                )}
              </div>
              <div>
                <label htmlFor="tinggiBadan" className="input-label">Tinggi Badan (cm)</label>
                <input
                  id="tinggiBadan"
                  type="number"
                  step="0.1"
                  placeholder="158"
                  className={`input-field ${errors.tinggiBadan ? 'border-red-400' : ''}`}
                  {...register('tinggiBadan', {
                    required: 'Wajib diisi',
                    min: { value: 100, message: 'Terlalu kecil' },
                    max: { value: 250, message: 'Terlalu besar' },
                  })}
                />
                {errors.tinggiBadan && (
                  <p className="input-error">{errors.tinggiBadan.message}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || isFetching}
              className="btn-primary mt-2"
              id="btn-hitung-kandungan"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Menghitung...
                </span>
              ) : 'Hitung usia kandungan'}
            </button>
          </form>
        </section>

        {/* ── Hasil Kalkulasi ── */}
        <div className="space-y-4">
          {data?.usiaKandunganMinggu != null && (
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-4">
              {/* Usia & Trimester */}
              <div className="flex items-center gap-2 mb-3">
                <CalendarDays size={18} className="text-primary-600" />
                <span className="font-semibold text-primary-700 text-sm">
                  Usia kandungan: {data.usiaKandunganMinggu} minggu · {trimesterLabel}
                </span>
              </div>

              <div className="space-y-1.5 text-sm text-gray-700">
                <p>
                  <span className="text-gray-500">HPL: </span>
                  <span className="font-medium">{formatTanggal(data.hpl)}</span>
                </p>
                {data.kategoriImt && (
                  <>
                    <p>
                      <span className="text-gray-500">IMT Sebelum Hamil: </span>
                      <span className="font-semibold text-gray-800">{data.kategoriImt}</span>
                    </p>
                    <p>
                      <span className="text-gray-500">Rekomendasi Kenaikan BB Ideal: </span>
                      <span className="font-semibold text-primary-700">{data.rekomendasiKenaikanBb}</span>
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ── Catatan Harian (Placeholder) ── */}
          <Link to="/ibu-hamil/catatan-harian" className="block">
            <div className="card flex items-center gap-3 hover:shadow-card-hover transition-shadow cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <PencilLine size={18} className="text-primary-600" />
              </div>
              <span className="text-sm font-medium text-gray-700 flex-1">Catatan Harian Ibu Hamil</span>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          </Link>
        </div>
      </div>

      {/* ── Artikel Ibu Hamil ── */}
      <section className="mt-6">
        <h3 className="text-base font-bold text-gray-800 mb-4">
          Artikel Ibu Hamil{trimesterLabel ? ` ${trimesterLabel}` : ''}
        </h3>

        {artikels.length === 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="h-28 bg-gray-100 rounded-xl mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {artikels.map((artikel) => (
              <Link key={artikel.id} to={`/artikel/${artikel.id}`}>
                <div className="card p-0 overflow-hidden hover:shadow-card-hover transition-shadow">
                  <div className="h-28 bg-gray-100">
                    {artikel.gambarUrl ? (
                      <img
                        src={artikel.gambarUrl}
                        alt={artikel.judul}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen size={24} className="text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <div className="flex items-center gap-1 mb-1">
                      <BookOpen size={10} className="text-primary-600" />
                      <span className="text-[10px] font-semibold text-primary-600 uppercase tracking-wide">
                        Edukasi
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug">
                      {artikel.judul}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </AppShell>
  );
}
