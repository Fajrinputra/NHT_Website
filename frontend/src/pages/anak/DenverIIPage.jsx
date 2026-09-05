import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Activity, CheckCircle2, AlertCircle } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { getHasilDenverII } from '../../api/anakApi';
import { formatTanggal } from '../../utils/formatters';

export default function DenverIIPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getHasilDenverII(id)
        .then(res => {
          // Asumsikan kita menampilkan hasil skrining terbaru (index 0) jika ada riwayat
          const denverData = res.data.data || [];
          if (denverData.length > 0) {
            setData(denverData[0]); // Ambil yang paling terbaru
          } else {
            setData(null);
          }
        })
        .catch(err => alert("Gagal memuat data Denver II: " + (err.response?.data?.error || err.message)))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const getStatusDisplay = (status) => {
    if (status === 'SESUAI_USIA') {
      return (
        <div className="flex items-center gap-2 mt-2">
          <CheckCircle2 size={18} className="text-green-500" />
          <span className="text-sm font-medium text-green-700 bg-green-50 px-2 py-0.5 rounded-md">Sesuai Usia</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 mt-2">
        <AlertCircle size={18} className="text-amber-500" />
        <span className="text-sm font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">Perlu Perhatian</span>
      </div>
    );
  };

  return (
    <AppShell>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <PageHeader title="Skrining Denver II" />
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={20} className="text-purple-500" />
          <h2 className="font-bold text-gray-800">Hasil Tumbuh Kembang</h2>
        </div>
        
        {isLoading ? (
          <div className="space-y-4 mt-6">
            <div className="h-4 w-1/3 bg-gray-100 animate-pulse rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : !data ? (
          <div className="py-8 text-center bg-gray-50 rounded-xl mt-4">
            <p className="text-gray-500">Belum ada hasil skrining Denver II.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">
              Skrining terakhir dilakukan pada <span className="font-medium text-gray-700">{formatTanggal(data.tanggalSkrining)}</span> oleh <span className="font-medium text-gray-700">{data.diisiOleh}</span>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-100 rounded-xl p-4 hover:shadow-card-hover transition-shadow bg-white">
                <h3 className="font-bold text-gray-800">Motorik Kasar</h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">Gerakan tubuh yang menggunakan otot-otot besar.</p>
                {getStatusDisplay(data.motorikKasar)}
              </div>
              
              <div className="border border-gray-100 rounded-xl p-4 hover:shadow-card-hover transition-shadow bg-white">
                <h3 className="font-bold text-gray-800">Motorik Halus</h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">Koordinasi mata, tangan, dan jari untuk hal presisi.</p>
                {getStatusDisplay(data.motorikHalus)}
              </div>

              <div className="border border-gray-100 rounded-xl p-4 hover:shadow-card-hover transition-shadow bg-white">
                <h3 className="font-bold text-gray-800">Bahasa</h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">Kemampuan mendengar, mengerti, dan berbicara.</p>
                {getStatusDisplay(data.bahasa)}
              </div>

              <div className="border border-gray-100 rounded-xl p-4 hover:shadow-card-hover transition-shadow bg-white">
                <h3 className="font-bold text-gray-800">Personal-Sosial</h3>
                <p className="text-xs text-gray-500 mt-1 mb-2">Kemampuan berinteraksi dan mengurus diri sendiri.</p>
                {getStatusDisplay(data.personalSosial)}
              </div>
            </div>
            
            <div className="mt-6 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
              <h4 className="text-sm font-bold text-blue-800 mb-1">Catatan Penting</h4>
              <p className="text-xs text-blue-700 leading-relaxed">
                Hasil skrining ini merupakan gambaran perkembangan anak berdasarkan observasi terapis saat sesi homecare. Jika terdapat parameter yang "Perlu Perhatian", disarankan untuk berkonsultasi lebih lanjut dengan dokter spesialis anak.
              </p>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
