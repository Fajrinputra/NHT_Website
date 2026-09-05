import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Syringe, Info } from 'lucide-react';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { getCatatanImunisasi } from '../../api/anakApi';
import { formatTanggal } from '../../utils/formatters';

export default function TabelImunisasiPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    if (id) {
      getCatatanImunisasi(id)
        .then(res => setData(res.data.data || []))
        .catch(err => alert("Gagal memuat data imunisasi: " + (err.response?.data?.error || err.message)))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUDAH':
        return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">Sudah</span>;
      case 'BELUM':
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">Belum</span>;
      case 'TERLAMBAT':
        return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">Terlambat</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">{status}</span>;
    }
  };

  return (
    <AppShell>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <PageHeader title="Catatan Imunisasi" />
      </div>

      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Syringe size={20} className="text-green-500" />
          <h2 className="font-bold text-gray-800">Daftar Vaksinasi</h2>
        </div>

        {isLoading ? (
          <div className="space-y-3 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : data.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-xl mt-4">
            <p className="text-gray-500">Belum ada data imunisasi.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {data.map((item) => (
              <div 
                key={item.id} 
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${expandedRow === item.id ? 'border-green-300 bg-green-50/30 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedRow(expandedRow === item.id ? null : item.id)}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.namaVaksin}</h3>
                    <p className="text-sm text-gray-500 mt-1">Usia: {item.usiaRekomendasi}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(item.status)}
                    {item.tanggalPemberian && (
                      <span className="text-xs text-gray-500">{formatTanggal(item.tanggalPemberian)}</span>
                    )}
                  </div>
                </div>
                
                {/* Expanded Section */}
                <div 
                  className={`px-4 pb-4 transition-all duration-300 ${expandedRow === item.id ? 'block opacity-100' : 'hidden opacity-0'}`}
                >
                  <div className="pt-3 border-t border-gray-100 flex gap-3 text-sm">
                    <div className="mt-0.5 text-blue-500">
                      <Info size={16} />
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Keterangan & Manfaat:</span>
                      <p className="text-gray-600 mt-1 leading-relaxed">{item.keteranganManfaat || 'Tidak ada keterangan spesifik.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
