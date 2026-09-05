import { NavLink } from 'react-router-dom';
import { Home, Heart, Baby, User, Smile, MessageCircle, Instagram } from 'lucide-react';
import { INSTAGRAM_URL, LINK_WA_KONTAK } from '../../constants/sosialMedia';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Beranda' },
  { to: '/ibu-hamil', icon: Heart, label: 'Ibu Hamil' },
  { to: '/bayi', icon: Baby, label: 'Bayi' },
  { to: '/anak', icon: Smile, label: 'Anak' },
  { to: '/profil', icon: User, label: 'Profil' },
];

/**
 * BottomNav — bottom navigation (mobile/tablet).
 * Pada lg: berubah menjadi sidebar kiri vertikal.
 */
export default function BottomNav() {
  return (
    <>
      {/* ── Mobile & Tablet: Bottom Bar ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 safe-area-pb">
        <div className="flex items-stretch">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-2 gap-0.5 text-[10px] font-medium transition-colors
                ${isActive ? 'text-primary-600' : 'text-gray-400'}`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ── Desktop: Left Sidebar ── */}
      <aside className="hidden lg:flex flex-col fixed top-0 left-0 h-full w-56 bg-white border-r border-gray-100 z-40 py-6 px-3 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 px-3 mb-8">
          <img src="/logo.jpg" alt="Logo" className="w-9 h-9 object-contain rounded-xl" />
          <div>
            <p className="text-sm font-bold text-primary-700 leading-tight">Nata House</p>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest">Treatment</p>
          </div>
        </div>

        {/* Nav Items */}
        <nav className="flex flex-col gap-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Sosial Media — di bagian bawah sidebar */}
        <div className="mt-auto pt-6 border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-3 mb-2">Ikuti Kami</p>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-pink-50 hover:text-pink-600 transition-all"
          >
            <Instagram size={18} />
            Instagram
          </a>
          <a
            href={LINK_WA_KONTAK}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-green-50 hover:text-green-600 transition-all"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        </div>
      </aside>
    </>
  );
}
