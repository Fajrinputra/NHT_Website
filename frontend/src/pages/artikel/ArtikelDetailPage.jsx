import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { getArtikelById } from '../../api/artikelApi';
import { formatTanggal } from '../../utils/formatters';

export default function ArtikelDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [artikel, setArtikel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    getArtikelById(id)
      .then(res => setArtikel(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Gagal memuat artikel'))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        {/* Skeleton Header */}
        <div className="bg-white px-5 py-4 flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
        </div>
        {/* Skeleton Content */}
        <div className="p-4 flex-1">
          <div className="max-w-3xl mx-auto">
            <div className="w-full h-64 bg-gray-200 rounded-2xl animate-pulse mb-6" />
            <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse mb-4" />
            <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse mb-8" />
            
            <div className="space-y-4">
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !artikel) {
    return (
      <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4 text-center">
        <BookOpen size={48} className="text-gray-300 mb-4" />
        <h2 className="text-lg font-bold text-gray-800 mb-2">Artikel Tidak Ditemukan</h2>
        <p className="text-sm text-gray-500 mb-6">{error || 'Artikel yang Anda cari tidak tersedia.'}</p>
        <button onClick={() => navigate(-1)} className="btn-outline">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Sticky Header with Back Button */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => navigate(-1)}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-700" />
          </button>
          <span className="font-bold text-gray-800 line-clamp-1">Artikel Edukasi</span>
        </div>
      </header>

      <main className="pb-10">
        <article className="max-w-3xl mx-auto bg-white min-h-[calc(100vh-64px)] sm:my-6 sm:rounded-2xl sm:shadow-sm sm:overflow-hidden">
          {/* Hero Image */}
          {artikel.gambarUrl && (
            <div className="w-full h-56 sm:h-80 md:h-96 relative">
              <img 
                src={artikel.gambarUrl} 
                alt={artikel.judul}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm">
                <BookOpen size={14} className="text-primary-600" />
                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {artikel.kategori === 'IBU_HAMIL' ? 'Ibu Hamil' : 'Bayi & Anak'}
                </span>
              </div>
            </div>
          )}

          {/* Article Header (if no image, show category here) */}
          <div className="px-5 pt-6 sm:px-8 sm:pt-8">
            {!artikel.gambarUrl && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary-50 mb-4">
                <BookOpen size={14} className="text-primary-600" />
                <span className="text-xs font-bold text-primary-700 uppercase tracking-wider">
                  {artikel.kategori === 'IBU_HAMIL' ? 'Ibu Hamil' : 'Bayi & Anak'}
                </span>
              </div>
            )}
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight tracking-tight mb-4">
              {artikel.judul}
            </h1>
            
            <div className="flex items-center gap-2 text-xs text-gray-500 font-medium mb-8 pb-6 border-b border-gray-100">
              <CalendarIcon size={14} />
              <span>Dipublikasikan pada {formatTanggal(artikel.createdAt)}</span>
            </div>
          </div>

          {/* Article Body */}
          {/* Note: in a real app, content might be HTML. For now, it's plain text. We use whitespace-pre-wrap to respect newlines */}
          <div className="px-5 pb-8 sm:px-8 text-gray-700 leading-relaxed space-y-4 whitespace-pre-wrap text-[15px] sm:text-base">
            {artikel.konten}
          </div>
        </article>
      </main>
    </div>
  );
}
