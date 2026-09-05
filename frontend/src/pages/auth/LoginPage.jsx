import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '../../api/authApi';
import { useAuth } from '../../hooks/useAuth';

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
    <div className="min-h-screen flex bg-white font-sans">
      {/* LEFT SIDE - Hero Illustration (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-blue-50/50 flex-col justify-center items-center overflow-hidden p-12">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary-100/50 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-5%] left-[-10%] w-[500px] h-[500px] bg-blue-200/40 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-lg w-full text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 leading-snug mb-2">
            Permudah interaksi antar <span className="text-orange-500">Terapis</span> dan <br/>
            <span className="text-orange-500">Ibu & Anak</span> secara online!
          </h1>
        </div>
        
        {/* 3D Illustration */}
        <div className="relative z-10 w-full max-w-lg aspect-square flex items-center justify-center">
          <img 
            src="/hero-login.jpg" 
            alt="3D Illustration of mother and nurse" 
            className="w-full h-full object-contain rounded-2xl shadow-xl mix-blend-multiply"
          />
        </div>
      </div>

      {/* RIGHT SIDE - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-20 overflow-y-auto">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header & Logo */}
          <div className="text-center space-y-6">
            <div className="flex justify-center items-center">
              {/* Logo with mix-blend-multiply to remove white background visually */}
              <img 
                src="/logo.jpg" 
                alt="Nata House Treatment" 
                className="h-28 sm:h-32 object-contain mix-blend-multiply"
              />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Hai, selamat datang kembali
              </h2>
              <p className="text-sm text-gray-500">
                Baru di Nata House?{' '}
                <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                  Daftar Gratis
                </Link>
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* API Error */}
            {apiError && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                {apiError}
              </div>
            )}

            {/* Nomor Telepon */}
            <div>
              <input
                id="nomorTelepon"
                type="tel"
                placeholder="Contoh: 081234567890"
                className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                  errors.nomorTelepon ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
                }`}
                {...register('nomorTelepon', {
                  required: 'Nomor telepon wajib diisi',
                  minLength: { value: 10, message: 'Nomor telepon minimal 10 digit' },
                })}
              />
              {errors.nomorTelepon && (
                <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.nomorTelepon.message}</p>
              )}
            </div>

            {/* Kata Sandi */}
            <div>
              <div className="relative">
                <input
                  id="kataSandi"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan kata sandi kamu"
                  className={`w-full px-4 py-3.5 bg-white border rounded-xl text-sm pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
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
                  aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.kataSandi && (
                <p className="text-xs text-red-500 mt-1.5 ml-1 font-medium">{errors.kataSandi.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-gray-600 select-none group-hover:text-gray-800 transition-colors">Ingat perangkat ini</span>
              </label>
              <Link to="/lupa-sandi" className="text-sm text-primary-600 font-medium hover:underline hover:text-primary-700 transition-colors">
                Lupa kata sandi?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3.5 rounded-xl transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                id="btn-masuk"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Masuk...
                  </span>
                ) : 'Masuk'}
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-400">Atau masuk menggunakan</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-3 gap-3">
            <button className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>
            <button className="flex justify-center items-center py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M16.365 7.143c-.714.714-1.875 1.18-2.91 1.18-.088-.856.36-1.84.973-2.51.684-.755 1.764-1.22 2.812-1.22.09 1.001-.225 1.835-.875 2.55zm-1.045 1.884c-1.332 0-2.433-.943-3.924-.943-1.474 0-2.843.96-4.04 1.95-1.26 1.045-3.172 4.19-2.58 7.42.225 1.25.753 2.55 1.572 3.52 1.043 1.25 2.163 1.34 3.238.99 1.085-.35 2.134-.96 3.486-.96 1.385 0 2.27.56 3.265.91 1.043.37 2.13-.15 2.977-1.12.92-1.05 1.55-2.29 2.08-3.55-.91-.56-1.92-1.46-1.92-3.11 0-1.884 1.21-2.88 1.48-3.04-1.17-1.55-2.84-1.82-3.66-1.85a5.53 5.53 0 0 0-1.934-.217z"/>
              </svg>
            </button>
          </div>

          {/* Terms & Privacy */}
          <div className="pt-4 text-xs text-gray-500 leading-relaxed text-center lg:text-left">
            Dengan melanjutkan, kamu menerima{' '}
            <Link to="/syarat" className="text-primary-600 font-semibold hover:underline">
              Syarat Penggunaan
            </Link>{' '}
            dan{' '}
            <Link to="/privasi" className="text-primary-600 font-semibold hover:underline">
              Kebijakan Privasi
            </Link>{' '}
            kami.
          </div>

        </div>
      </div>
    </div>
  );
}
