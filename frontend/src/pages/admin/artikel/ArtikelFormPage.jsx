import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams, Link } from 'react-router-dom';
import { adminArtikelApi } from '../../../api/adminApi';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function ArtikelFormPage({ mode = 'create' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const [formData, setFormData] = useState({
    judul: '',
    kategori: 'IBU_HAMIL',
    cuplikan: '',
    isiKonten: '',
    gambarUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (mode === 'edit') {
      // For editing, we ideally fetch full details if not provided via state.
      // But we can check location.state first for basic info, 
      // however isiKonten might be missing if we used getAll response.
      fetchDetail();
    }
  }, [mode, id]);

  const fetchDetail = async () => {
    try {
      // We don't have a specific getDetail in adminArtikelApi yet, 
      // but we can reuse the client api or create one. 
      // For now, if we have it in state, we use it (but it might lack isiKonten).
      // Wait, adminArtikelSvc doesn't have a GetByID endpoint? Let's use the public one if needed,
      // or we should fetch from client API. Let's just use axios directly or add it.
      // Actually, since I didn't add GET /api/v1/admin/artikel/:id, 
      // I'll just use the public endpoint to get full details.
      const response = await fetch(`${import.meta.env.VITE_API_URL}/artikel/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('nata_admin_token')}` }
      });
      const result = await response.json();
      if (result.success) {
        setFormData({
          judul: result.data.judul,
          kategori: result.data.kategori,
          cuplikan: result.data.cuplikan,
          isiKonten: result.data.isiKonten || '',
          gambarUrl: result.data.gambarUrl || '',
        });
      }
    } catch (error) {
      console.error('Error fetching detail', error);
      setError('Gagal memuat detail konten artikel');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'create') {
        await adminArtikelApi.create(formData);
      } else {
        await adminArtikelApi.update(id, formData);
      }
      navigate('/admin/artikel');
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || `Gagal ${mode === 'create' ? 'menyimpan' : 'memperbarui'} artikel`);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/admin/artikel" className="p-2 bg-white rounded-xl shadow-sm text-gray-500 hover:text-primary transition-colors">
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h2 className="text-2xl font-bold text-gray-800">
          {mode === 'create' ? 'Tulis Artikel Baru' : 'Edit Artikel'}
        </h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        {error && (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Judul Artikel</label>
              <input
                type="text"
                value={formData.judul}
                onChange={(e) => setFormData({ ...formData, judul: e.target.value })}
                required
                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="Masukkan judul edukasi..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kategori Target</label>
              <select
                value={formData.kategori}
                onChange={(e) => setFormData({ ...formData, kategori: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              >
                <option value="IBU_HAMIL">Ibu Hamil</option>
                <option value="BAYI">Bayi</option>
                <option value="ANAK">Anak</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">URL Gambar Sampul (Opsional)</label>
              <input
                type="url"
                value={formData.gambarUrl}
                onChange={(e) => setFormData({ ...formData, gambarUrl: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Cuplikan (Singkat)</label>
            <textarea
              value={formData.cuplikan}
              onChange={(e) => setFormData({ ...formData, cuplikan: e.target.value })}
              required
              rows="2"
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
              placeholder="Ringkasan singkat untuk ditampilkan di kartu..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Isi Konten</label>
            <textarea
              value={formData.isiKonten}
              onChange={(e) => setFormData({ ...formData, isiKonten: e.target.value })}
              required
              rows="12"
              className="w-full px-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Tulis konten edukasi lengkap di sini..."
            />
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <Link
              to="/admin/artikel"
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-dark shadow-md shadow-primary/20 transition-all disabled:opacity-50"
            >
              {loading ? 'Menyimpan...' : 'Publikasikan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
