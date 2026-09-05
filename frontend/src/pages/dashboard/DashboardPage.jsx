import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Heart, Baby, Smile, CalendarDays, Search, ChevronRight, BookOpen, MessageCircle, Instagram } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getArtikels } from '../../api/artikelApi';
import AppShell from '../../components/layout/AppShell';
import { formatTanggal } from '../../utils/formatters';
import { INSTAGRAM_URL, LINK_WA_KONTAK } from '../../constants/sosialMedia';

const menuItems = [
  {
    to: '/ibu-hamil',
    icon: Heart,
    label: 'Ibu Hamil',
    bgColor: 'bg-pink-50',
    iconColor: 'text-pink-500',
    id: 'menu-ibu-hamil',
  },
  {
    to: '/bayi',
    icon: Baby,
    label: 'Bayi',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-500',
    id: 'menu-bayi',
  },
  {
    to: '/anak',
    icon: Smile,
    label: 'Anak',
    bgColor: 'bg-amber-50',
    iconColor: 'text-amber-500',
    id: 'menu-anak',
  },
  {
    to: '/booking',
    icon: CalendarDays,
    label: 'Booking Homecare',
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary-600',
    id: 'menu-booking',
  },
];

export default function DashboardPage() {
  const { klien } = useAuth();
  const navigate = useNavigate();
  const [artikels, setArtikels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getArtikels({ limit: 2 })
      .then((res) => setArtikels(res.data.data || []))
      .catch(() => setArtikels([]));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/artikel?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const firstName = klien?.namaLengkap?.split(' ')[0] || 'Bunda';

  return (
    <AppShell>
      {/* Header */}
      <header className="flex items-center justify-between mb-5 lg:mb-6">
        <div className="flex items-center gap-2">
          <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-xl lg:hidden" />
          <span className="text-base font-bold text-primary-700 lg:text-xl">Nata House</span>
        </div>
        <Link to="/notifikasi" aria-label="Notifikasi" id="btn-notifikasi">
          <div className="relative w-9 h-9 rounded-full border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors">
            <Bell size={18} className="text-gray-600" />
            {/* Badge notifikasi */}
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white" />
          </div>
        </Link>
      </header>

      {/* Sapaan */}
      <div className="mb-5">
        <h2 className="text-2xl font-bold text-gray-800 lg:text-3xl">Halo, {firstName} 👋</h2>
        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
          Selamat datang kembali! Mari bersama-sama wujudkan keluarga yang sehat dan bahagia.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-6">
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            id="search-artikel"
            type="search"
            placeholder="Cari artikel edukasi"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-11"
          />
        </div>
      </form>

      {/* Menu Grid — 2 col mobile → 4 col desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {menuItems.map(({ to, icon: Icon, label, bgColor, iconColor, id }) => (
          <Link key={to} to={to} id={id}>
            <div className="card-menu">
              <div className={`w-12 h-12 rounded-2xl ${bgColor} flex items-center justify-center`}>
                <Icon size={22} className={iconColor} />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Edukasi Terbaru */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-gray-800">Edukasi Terbaru</h3>
          <Link
            to="/artikel"
            className="text-sm text-primary-600 font-medium hover:underline"
            id="btn-lihat-semua-artikel"
          >
            Lihat Semua
          </Link>
        </div>

        {artikels.length === 0 ? (
          /* Skeleton / Empty */
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[1, 2].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="w-full h-28 bg-gray-100 rounded-xl mb-3" />
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {artikels.map((artikel) => (
              <Link key={artikel.id} to={`/artikel/${artikel.id}`} id={`artikel-${artikel.id}`}>
                <div className="card p-0 overflow-hidden hover:shadow-card-hover transition-shadow cursor-pointer">
                  {/* Gambar */}
                  <div className="relative h-28 bg-gray-100">
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
                    {/* Badge kategori */}
                    <div className="flex items-center gap-1 mb-1.5">
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

      {/* Sosial Media & Kontak */}
      <section className="mt-8 mb-2">
        <h3 className="text-base font-bold text-gray-800 mb-3">Hubungi & Ikuti Kami</h3>
        <div className="grid grid-cols-2 gap-3">
          {/* WhatsApp */}
          <a
            href={LINK_WA_KONTAK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-colors group"
            id="btn-kontak-wa"
          >
            <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <MessageCircle size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">WhatsApp</p>
              <p className="text-[11px] text-gray-500 leading-tight">Chat Admin Nata</p>
            </div>
          </a>

          {/* Instagram */}
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-100 hover:from-pink-100 hover:to-purple-100 transition-colors group"
            id="btn-instagram"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <Instagram size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-800">Instagram</p>
              <p className="text-[11px] text-gray-500 leading-tight">@nata_housetreatment</p>
            </div>
          </a>
        </div>
      </section>
    </AppShell>
  );
}
