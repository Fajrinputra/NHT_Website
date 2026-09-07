import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { terapisKunjunganApi } from '../../../api/terapisApi';
import { ArrowLeftIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function RiwayatKesehatanKlienPage() {
  const { klienId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRiwayat();
  }, [klienId]);

  const fetchRiwayat = async () => {
    try {
      const response = await terapisKunjunganApi.getRiwayatKlien(klienId);
      if (response.data.success) {
        setData(response.data.data);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Gagal memuat riwayat klien');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Memuat riwayat...</div>;
  if (error || !data) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Riwayat Kesehatan</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 flex items-center gap-4">
        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center">
          <UserCircleIcon className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Nama Klien</p>
          <h3 className="font-bold text-gray-900 text-lg">{data.namaLengkap}</h3>
        </div>
      </div>

      <div className="space-y-4">
        
        {/* Data Ibu Hamil */}
        {data.ibuHamil && (
          <div className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden">
            <div className="bg-pink-50 p-3 border-b border-pink-100">
              <h4 className="font-bold text-pink-800">Data Kehamilan</h4>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-sm">HPHT</span>
                <span className="font-medium text-gray-800">{data.ibuHamil.hpht}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500 text-sm">HPL</span>
                <span className="font-medium text-gray-800">{data.ibuHamil.hpl}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500 text-sm">Riwayat Komplikasi</span>
                <span className="font-medium text-gray-800 max-w-[60%] text-right">{data.ibuHamil.riwayatKomplikasi || '-'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Data Bayi */}
        {data.bayi && data.bayi.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
            <div className="bg-blue-50 p-3 border-b border-blue-100">
              <h4 className="font-bold text-blue-800">Data Bayi</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {data.bayi.map(b => (
                <div key={b.id} className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{b.namaLengkap}</span>
                    <span className="text-blue-600">{b.jenisKelamin}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tgl Lahir</span>
                    <span>{b.tanggalLahir}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>BB Lahir</span>
                    <span>{b.bbLahir} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Data Anak */}
        {data.anak && data.anak.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-green-100 overflow-hidden">
            <div className="bg-green-50 p-3 border-b border-green-100">
              <h4 className="font-bold text-green-800">Data Anak</h4>
            </div>
            <div className="divide-y divide-gray-100">
              {data.anak.map(a => (
                <div key={a.id} className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between font-bold text-gray-800">
                    <span>{a.namaLengkap}</span>
                    <span className="text-green-600">{a.jenisKelamin}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tgl Lahir</span>
                    <span>{a.tanggalLahir}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>BB Lahir</span>
                    <span>{a.bbLahir} kg</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!data.ibuHamil && (!data.bayi || data.bayi.length === 0) && (!data.anak || data.anak.length === 0) && (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            Klien ini belum mengisi profil kesehatan apa pun.
          </div>
        )}

      </div>
    </div>
  );
}
