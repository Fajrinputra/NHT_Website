import BottomNav from './BottomNav';

/**
 * AppShell — wrapper untuk semua halaman yang butuh navigasi.
 * Desktop: margin kiri untuk sidebar, konten di tengah-kanan.
 * Mobile: konten full, padding bawah untuk bottom nav.
 */
export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-surface">
      <BottomNav />
      {/* Desktop: offset untuk sidebar width */}
      <main className="lg:ml-56 min-h-screen">
        <div className="page-container px-4 pt-4 pb-24 lg:pb-8 lg:px-8 lg:pt-6">
          {children}
        </div>
      </main>
    </div>
  );
}
