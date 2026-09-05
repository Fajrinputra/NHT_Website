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
                className="h-36 sm:h-44 md:h-52 object-contain mix-blend-multiply"
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
