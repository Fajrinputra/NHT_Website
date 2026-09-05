import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';

export default function LoginPage() {
  const navigate = useNavigate();
  const { loginCtx } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

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
    <AuthLayout 
      title="Selamat Datang Kembali" 
      subtitle={
        <>
          Baru di Nata House?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Daftar Gratis
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* API Error */}
        {apiError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
            {apiError}
          </div>
        )}

        {/* Nomor Telepon */}
        <div className="space-y-1.5">
          <label htmlFor="nomorTelepon" className="block text-sm font-semibold text-gray-700">
            Nomor Telepon
          </label>
          <input
            id="nomorTelepon"
            type="tel"
            placeholder="Contoh: 081234567890"
            className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
              errors.nomorTelepon ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
            }`}
            {...register('nomorTelepon', {
              required: 'Nomor telepon wajib diisi',
              minLength: { value: 10, message: 'Minimal 10 digit' },
            })}
          />
          {errors.nomorTelepon && (
            <p className="text-xs text-red-500 ml-1 font-medium">{errors.nomorTelepon.message}</p>
          )}
        </div>

        {/* Kata Sandi */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="kataSandi" className="block text-sm font-semibold text-gray-700">
              Kata Sandi
            </label>
            <Link to="/lupa-sandi" className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              Lupa Sandi?
            </Link>
          </div>
          <div className="relative">
            <input
              id="kataSandi"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm pr-12 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all tracking-widest ${
                errors.kataSandi ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
              }`}
              {...register('kataSandi', {
                required: 'Kata sandi wajib diisi',
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.kataSandi && (
            <p className="text-xs text-red-500 ml-1 font-medium">{errors.kataSandi.message}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="remember"
            className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">Ingat perangkat ini</label>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
            id="btn-masuk"
          >
            {isLoading ? 'Memproses...' : 'Masuk'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
