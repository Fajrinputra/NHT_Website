import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminKlienApi } from '../../../api/adminApi';
import { ArrowLeftIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function KlienDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await adminKlienApi.getDetail(id);
      if (response.data.success) {
        setDetail(response.data.data);
      }
    } catch (error) {
      setError('Gagal memuat detail klien');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifikasi = async (status) => {
    if (!window.confirm(`Yakin ingin mengubah status klien ini menjadi ${status}?`)) return;
    
    setProcessing(true);
    try {
      const response = await adminKlienApi.updateVerifikasi(id, status);
      if (response.data.success) {
        alert('Status berhasil diperbarui');
        navigate('/admin/klien');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal memperbarui status');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) return <div className="text-center p-8">Memuat detail...</div>;
  if (error || !detail) return <div className="text-center p-8 text-red-500">{error || 'Data tidak ditemukan'}</div>;

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/klien" className="p-2 bg-white rounded-xl shadow-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">Detail & Verifikasi Klien</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Informasi Profil</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Nomor Telepon (Akun)</p>
              <p className="font-medium text-gray-900">{detail.nomorTelepon}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ID Klien</p>
              <p className="font-mono text-xs text-gray-900 mt-1">{detail.klienId}</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Daftar Anggota Keluarga</h3>
          {detail.keluarga && detail.keluarga.length > 0 ? (
            <div className="space-y-3">
              {detail.keluarga.map((k, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100 flex justify-between items-center">
                  <div>
                    <span className="inline-block px-2 py-1 bg-white text-xs font-bold text-primary rounded-md mb-1 border border-primary/10">
                      {k.peran}
                    </span>
                    <p className="font-medium text-gray-900">{k.nama}</p>
                  </div>
                  {k.tanggalLahir && (
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Tgl Lahir</p>
                      <p className="text-sm font-medium">{k.tanggalLahir.split('T')[0]}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Belum ada data keluarga yang diisi.</p>
          )}
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-end">
          <button
            onClick={() => handleVerifikasi('DITOLAK')}
            disabled={processing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-100 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <XCircleIcon className="w-5 h-5" />
            Tolak Registrasi
          </button>
          
          <button
            onClick={() => handleVerifikasi('AKTIF')}
            disabled={processing}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark shadow-md shadow-primary/20 transition-all disabled:opacity-50"
          >
            <CheckCircleIcon className="w-5 h-5" />
            Verifikasi & Aktifkan
          </button>
        </div>
      </div>
    </div>
  );
}
