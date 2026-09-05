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
    <div className="min-h-screen relative flex items-center justify-center bg-gray-50 font-sans overflow-hidden">
      
      {/* Blurred Background Overlay (Landing Page simulation) */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Soft abstract shapes in the background */}
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary-100/60 rounded-full blur-[80px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-100/60 rounded-full blur-[80px]"></div>
        <div className="absolute top-[30%] left-[20%] w-[300px] h-[300px] bg-teal-50/50 rounded-full blur-[60px]"></div>
      </div>

      {/* Login Modal Box */}
      <div className="relative z-10 w-full max-w-[440px] mx-4 p-8 sm:p-10 bg-white rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100/50 backdrop-blur-sm flex flex-col">
        
        {/* Logo */}
        <div className="flex justify-center items-center mb-6">
          <img 
            src="/logo.jpg" 
            alt="Nata House Treatment" 
            className="h-28 sm:h-36 object-contain mix-blend-multiply drop-shadow-sm transition-transform hover:scale-105 duration-300"
          />
        </div>
        
        {/* Header Typography */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Sign in to your Nata House account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
              {apiError}
            </div>
          )}

          {/* Nomor Telepon / Email Input */}
          <div className="space-y-1.5">
            <label htmlFor="nomorTelepon" className="block text-sm font-semibold text-gray-700">
              Phone Number
            </label>
            <input
              id="nomorTelepon"
              type="tel"
              placeholder="e.g. 081234567890"
              className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                errors.nomorTelepon ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
              }`}
              {...register('nomorTelepon', {
                required: 'Phone number is required',
                minLength: { value: 10, message: 'Minimum 10 digits required' },
              })}
            />
            {errors.nomorTelepon && (
              <p className="text-xs text-red-500 ml-1 font-medium">{errors.nomorTelepon.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="kataSandi" className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <Link to="/lupa-sandi" className="text-xs text-primary-600 font-semibold hover:text-primary-700 transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <input
                id="kataSandi"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••••••"
                className={`w-full px-4 py-3 bg-gray-50/50 border rounded-xl text-sm pr-12 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all tracking-widest ${
                  errors.kataSandi ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500 hover:border-gray-300'
                }`}
                {...register('kataSandi', {
                  required: 'Password is required',
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.kataSandi && (
              <p className="text-xs text-red-500 ml-1 font-medium">{errors.kataSandi.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-[0_4px_14px_0_rgba(13,148,136,0.39)] hover:shadow-[0_6px_20px_rgba(13,148,136,0.23)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              id="btn-masuk"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary-600 font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
