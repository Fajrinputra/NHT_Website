import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminArtikelApi } from '../../../api/adminApi';
import { PlusIcon, PencilSquareIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function ArtikelListPage() {
  const [artikels, setArtikels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKategori, setFilterKategori] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchArtikels();
  }, []);

  const fetchArtikels = async () => {
    setLoading(true);
    try {
      const response = await adminArtikelApi.getAll();
      if (response.data.success) {
        setArtikels(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch artikels', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, judul) => {
    if (!window.confirm(`Yakin ingin menghapus artikel "${judul}"?`)) return;
    
    try {
      const response = await adminArtikelApi.delete(id);
      if (response.data.success) {
        setArtikels(artikels.filter(a => a.id !== id));
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus artikel');
    }
  };

  const filteredArtikels = artikels.filter(a => {
    const matchSearch = a.judul.toLowerCase().includes(search.toLowerCase());
    const matchKategori = filterKategori === '' || a.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Artikel</h2>
        <Link
          to="/admin/artikel/tambah"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
        >
          <PlusIcon className="w-5 h-5" />
          Tulis Artikel
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['', 'IBU_HAMIL', 'BAYI', 'ANAK'].map(kat => (
              <button
                key={kat}
                onClick={() => setFilterKategori(kat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filterKategori === kat 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {kat === '' ? 'Semua Kategori' : kat.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari judul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 w-1/2">Judul Artikel</th>
                <th className="px-6 py-4">Kategori</th>
                <th className="px-6 py-4">Tanggal Publikasi</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredArtikels.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada artikel yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredArtikels.map(artikel => (
                  <tr key={artikel.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                          {artikel.gambarUrl ? (
                            <img src={artikel.gambarUrl} alt={artikel.judul} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Img</div>
                          )}
                        </div>
                        <span className="line-clamp-2">{artikel.judul}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600">
                        {artikel.kategori.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{artikel.createdAt.split('T')[0]}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <Link
                          to={`/admin/artikel/${artikel.id}/edit`}
                          state={{ artikel }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Artikel"
                        >
                          <PencilSquareIcon className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(artikel.id, artikel.judul)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Artikel"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
