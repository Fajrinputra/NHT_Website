import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  UserGroupIcon, 
  DocumentTextIcon, 
  CalendarIcon,
  ClipboardDocumentCheckIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

export default function AdminLayout() {
  const { logoutAdmin } = useAdminAuth();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: HomeIcon },
    { name: 'Manajemen Klien', path: '/admin/klien', icon: UsersIcon },
    { name: 'Manajemen Terapis', path: '/admin/terapis', icon: UserGroupIcon },
    { name: 'Manajemen Artikel', path: '/admin/artikel', icon: DocumentTextIcon },
    { name: 'Manajemen Jadwal', path: '/admin/jadwal', icon: CalendarIcon },
    { name: 'Manajemen Booking', path: '/admin/booking', icon: ClipboardDocumentCheckIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop First */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col fixed inset-y-0 left-0 z-10">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-primary">Nata Admin</h1>
          <p className="text-sm text-gray-500 mt-1">Super Admin Panel</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-primary text-white font-medium shadow-md shadow-primary/20' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logoutAdmin}
            className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 overflow-y-auto min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm mb-6">
          <h1 className="text-xl font-bold text-primary">Nata Admin</h1>
          <button onClick={logoutAdmin} className="text-red-500">
            <ArrowRightOnRectangleIcon className="w-6 h-6" />
          </button>
        </header>

        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Nav (Simplified for Admin, though desktop is preferred) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around p-3 z-50">
        {menuItems.slice(0, 4).map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          const Icon = item.icon;
          return (
            <Link key={item.name} to={item.path} className={`flex flex-col items-center p-2 ${isActive ? 'text-primary' : 'text-gray-400'}`}>
              <Icon className="w-6 h-6" />
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
