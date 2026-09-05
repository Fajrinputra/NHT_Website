import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { getStatus } from '../../api/authApi';

const POLL_INTERVAL_MS = 5000;

/**
 * VerificationPendingPage — halaman menunggu verifikasi admin.
 * Melakukan polling GET /auth/status setiap 5 detik.
 * Saat status berubah jadi AKTIF, otomatis redirect ke /login.
 */
export default function VerificationPendingPage() {
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await getStatus();
        const status = res.data.data?.statusVerifikasi;
        if (status === 'AKTIF') {
          clearInterval(intervalRef.current);
          navigate('/login', {
            replace: true,
            state: { message: 'Akun Anda sudah aktif! Silakan masuk.' },
          });
        }
      } catch {
        // Token belum ada atau expired — tidak masalah, terus polling
      }
    };

    // Cek langsung saat mount
    checkStatus();
    intervalRef.current = setInterval(checkStatus, POLL_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-between px-6 py-12">
      {/* Content area */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-sm text-center">
        {/* Icon */}
        <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center mb-8">
          <Clock size={40} className="text-primary-600" strokeWidth={1.5} />
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Akun Anda sedang diverifikasi
        </h1>
        <p className="text-gray-500 leading-relaxed text-sm">
          Tim kami sedang melakukan verifikasi data pelanggan Anda. Proses ini biasanya memakan
          waktu 1×24 jam.
        </p>

        {/* Polling indicator */}
        <div className="mt-8 flex items-center gap-2 text-xs text-gray-400">
          <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
          Memeriksa status secara otomatis...
        </div>
      </div>

      {/* Back to login button */}
      <div className="w-full max-w-sm">
        <button
          onClick={() => navigate('/login')}
          className="btn-outline"
          id="btn-kembali-login"
        >
          Kembali ke Login
        </button>
      </div>
    </div>
  );
}
