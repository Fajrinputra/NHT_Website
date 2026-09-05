import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import { getArtikels } from '../../api/artikelApi';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { formatTanggal } from '../../utils/formatters';

const KATEGORI = [
  { id: '', label: 'Semua' },
  { id: 'IBU_HAMIL', label: 'Ibu Hamil' },
  { id: 'BAYI_ANAK', label: 'Bayi & Anak' },
];

export default function ArtikelPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialKategori = searchParams.get('kategori') || '';

  const [artikels, setArtikels] = useState([]);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [kategori, setKategori] = useState(initialKategori);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    getArtikels({ q: searchQuery, kategori: kategori, limit: 20 })
      .then(res => setArtikels(res.data.data || []))
      .catch(() => setArtikels([]))
      .finally(() => setIsLoading(false));
  }, [searchQuery, kategori]); // Fetch when search or category changes

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (kategori) params.kategori = kategori;
    setSearchParams(params);
  };

  const handleKategoriClick = (catId) => {
    setKategori(catId);
    const params = {};
    if (searchQuery) params.q = searchQuery;
    if (catId) params.kategori = catId;
    setSearchParams(params);
  };

  return (
    <AppShell>
      <PageHeader title="Edukasi" />

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mt-4 mb-5">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            placeholder="Cari artikel edukasi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11 shadow-sm border-gray-100"
          />
        </div>
      </form>

      {/* Kategori Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
        {KATEGORI.map(cat => (
          <button
            key={cat.id}
            onClick={() => handleKategoriClick(cat.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              kategori === cat.id
                ? 'bg-primary-600 text-white shadow-sm'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid Artikel */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card p-0 animate-pulse">
              <div className="h-40 bg-gray-100 rounded-t-xl" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-100 rounded w-1/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-5/6" />
              </div>
            </div>
          ))}
        </div>
      ) : artikels.length === 0 ? (
        <div className="text-center py-20">
          <BookOpen size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-gray-800">Artikel Tidak Ditemukan</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto">
            Maaf, kami tidak menemukan artikel edukasi yang sesuai dengan pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {artikels.map(artikel => (
            <Link key={artikel.id} to={`/artikel/${artikel.id}`}>
              <div className="card p-0 h-full flex flex-col hover:shadow-card-hover transition-shadow overflow-hidden group">
                {/* Image */}
                <div className="relative h-40 bg-gray-100 overflow-hidden">
                  {artikel.gambarUrl ? (
                    <img
                      src={artikel.gambarUrl}
                      alt={artikel.judul}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <BookOpen size={32} className="text-gray-300" />
                    </div>
                  )}
                  {/* Category Badge overlay */}
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                    <BookOpen size={12} className="text-primary-600" />
                    <span className="text-[10px] font-bold text-primary-700 uppercase tracking-wider">
                      {artikel.kategori === 'IBU_HAMIL' ? 'Ibu Hamil' : 'Bayi & Anak'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug mb-2 group-hover:text-primary-600 transition-colors">
                    {artikel.judul}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 flex-1">
                    {artikel.cuplikan}
                  </p>
                  <p className="text-[10px] text-gray-400 font-medium">
                    {formatTanggal(artikel.createdAt)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </AppShell>
  );
}
