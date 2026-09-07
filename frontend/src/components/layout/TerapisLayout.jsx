import { Outlet, Link, useLocation } from 'react-router-dom';
import { CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { CalendarIcon as CalendarIconSolid, ClockIcon as ClockIconSolid, UserIcon as UserIconSolid } from '@heroicons/react/24/solid';

export default function TerapisLayout() {
  const location = useLocation();

  const navItems = [
    { path: '/terapis/jadwal', label: 'Jadwal', IconOutline: CalendarIcon, IconSolid: CalendarIconSolid },
    { path: '/terapis/riwayat', label: 'Riwayat', IconOutline: ClockIcon, IconSolid: ClockIconSolid },
    { path: '/terapis/profil', label: 'Profil', IconOutline: UserIcon, IconSolid: UserIconSolid },
  ];

  return (
    <div className="bg-gray-50 min-h-screen pb-20 md:pb-0">
      
      {/* Top Header (Mobile) */}
      <header className="bg-primary text-white p-4 sticky top-0 z-40 shadow-md">
        <h1 className="text-xl font-bold text-center tracking-wide">NHT Terapis</h1>
      </header>

      {/* Main Content */}
      <main className="p-4 max-w-lg mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = isActive ? item.IconSolid : item.IconOutline;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Sidebar Navigation (Desktop fallback) */}
      <nav className="hidden md:flex flex-col fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-primary tracking-wide">NHT Terapis</h1>
        </div>
        <div className="flex flex-col gap-2 p-4">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = isActive ? item.IconSolid : item.IconOutline;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                  isActive ? 'bg-primary/10 text-primary font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-6 h-6" />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop Main Content offset */}
      <div className="hidden md:block fixed inset-0 left-64 overflow-y-auto bg-gray-50">
        <main className="p-8 max-w-4xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
