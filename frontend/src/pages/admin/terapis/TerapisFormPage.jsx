import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { adminTerapisApi } from '../../../api/adminApi';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function TerapisFormPage({ mode = 'create' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    nama: '',
    nomorTelepon: '',
    aktif: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit') {
      if (location.state?.terapis) {
        setFormData(location.state.terapis);
      } else {
        // Fallback: If accessed directly via URL, should fetch by ID. 
        // For simplicity in this demo, redirect back to list if no state.
        navigate('/admin/terapis');
      }
    }
  }, [mode, location, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'create') {
        await adminTerapisApi.create(formData);
      } else {
        await adminTerapisApi.update(id, formData);
      }
      navigate('/admin/terapis');
    } catch (err) {
      setError(err.response?.data?.message || `Gagal ${mode === 'create' ? 'menambah' : 'menyimpan'} data terapis`);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link to="/admin/terapis" className="p-2 bg-white rounded-xl shadow-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'create' ? 'Tambah Terapis Baru' : 'Edit Data Terapis'}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
            <input
              type="text"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Masukkan nama terapis"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Telepon (WhatsApp)</label>
            <input
              type="tel"
              value={formData.nomorTelepon}
              onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
              required
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="081234567890"
            />
          </div>

          {mode === 'edit' && (
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div>
                <p className="font-medium text-gray-900">Status Aktif</p>
                <p className="text-sm text-gray-500">Terapis yang nonaktif tidak akan muncul di opsi booking.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={formData.aktif}
                  onChange={(e) => setFormData({ ...formData, aktif: e.target.checked })}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          )}

          <div className="pt-4 flex gap-4 justify-end">
            <Link
              to="/admin/terapis"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark shadow-md shadow-primary/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Simpan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
