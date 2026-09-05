import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

/**
 * PageHeader — header dengan back button dan judul.
 * Dipakai di semua halaman kecuali Dashboard.
 * Responsif: fixed di mobile, sticky di lg.
 */
export default function PageHeader({ title, onBack }) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) onBack();
    else navigate(-1);
  };

  return (
    <header className="sticky top-0 z-30 bg-surface/95 backdrop-blur-sm border-b border-gray-100">
      <div className="page-container px-4 py-3.5 flex items-center gap-3">
        <button
          onClick={handleBack}
          className="p-1.5 -ml-1.5 rounded-lg text-primary-600 hover:bg-primary-50 transition-colors"
          aria-label="Kembali"
        >
          <ChevronLeft size={22} />
        </button>
        <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
      </div>
    </header>
  );
}
