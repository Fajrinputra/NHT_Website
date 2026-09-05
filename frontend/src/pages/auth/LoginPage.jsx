import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Heart } from 'lucide-react';
import { login } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginCtx } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setApiError('');
    setIsLoading(true);
    try {
      const res = await login({
        nomorTelepon: data.nomorTelepon,
        kataSandi: data.kataSandi,
      });
      const { token, klien } = res.data.data;
      loginCtx(token, klien);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const msg = err.response?.data?.error || 'Terjadi kesalahan, coba lagi';
      // Jika masih MENUNGGU, arahkan ke halaman verifikasi
      if (msg.includes('verifikasi') || msg.includes('menunggu')) {
        navigate('/menunggu-verifikasi');
      } else {
        setApiError(msg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6 py-10">
      {/* Max-width wrapper: mobile natural, tablet/desktop centered card */}
      <div className="w-full max-w-sm lg:max-w-md">

        {/* Logo & Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center mb-4 shadow-sm">
            <Heart size={28} className="text-primary-600" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-bold text-primary-600 tracking-tight">Nata House</h1>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.2em] mt-0.5">Treatment</p>
          <p className="text-sm text-gray-500 text-center mt-3 max-w-xs leading-relaxed">
            Masuk untuk memantau kehamilan, bayi, dan anak Anda
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {apiError}
            </div>
          )}

          {/* Nomor Telepon */}
          <div>
            <label htmlFor="nomorTelepon" className="input-label">Nomor Telepon</label>
            <input
              id="nomorTelepon"
              type="tel"
              placeholder="08xxxxxxxxxx"
              className={`input-field ${errors.nomorTelepon ? 'border-red-400 focus:ring-red-400' : ''}`}
              {...register('nomorTelepon', {
                required: 'Nomor telepon wajib diisi',
                minLength: { value: 10, message: 'Nomor telepon minimal 10 digit' },
              })}
            />
            {errors.nomorTelepon && (
              <p className="input-error">{errors.nomorTelepon.message}</p>
            )}
          </div>

          {/* Kata Sandi */}
          <div>
            <label htmlFor="kataSandi" className="input-label">Kata Sandi</label>
            <div className="relative">
              <input
                id="kataSandi"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`input-field pr-12 ${errors.kataSandi ? 'border-red-400 focus:ring-red-400' : ''}`}
                {...register('kataSandi', {
                  required: 'Kata sandi wajib diisi',
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.kataSandi && (
              <p className="input-error">{errors.kataSandi.message}</p>
            )}
          </div>

          {/* Lupa Kata Sandi */}
          <div className="flex justify-end">
            <Link to="/lupa-sandi" className="text-sm text-primary-600 font-medium hover:underline">
              Lupa kata sandi?
            </Link>
          </div>

          {/* Spacer */}
          <div className="pt-4 space-y-3">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              id="btn-masuk"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Masuk...
                </span>
              ) : 'Masuk'}
            </button>

            <Link to="/register" className="block">
              <button
                type="button"
                className="btn-outline"
                id="btn-daftar-baru"
              >
                Daftar akun baru
              </button>
            </Link>
          </div>
        </form>

        {/* Footer note */}
        <p className="text-xs text-gray-400 text-center mt-8">
          Khusus pelanggan terdaftar Nata House Treatment
        </p>
      </div>
    </div>
  );
}
