import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { register as registerApi } from '../../api/authApi';
import AuthLayout from '../../components/layout/AuthLayout';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const passwordValue = watch('kataSandi', '');

  const onSubmit = async (data) => {
    setApiError('');
    setSuccessMsg('');
    setIsLoading(true);
    try {
      await registerApi({
        namaLengkap: data.namaLengkap,
        nomorTelepon: data.nomorTelepon,
        kataSandi: data.kataSandi,
        email: data.email,
        nik: data.nik,
        alamat: data.alamat,
      });
      setSuccessMsg('Pendaftaran berhasil! Silakan tunggu verifikasi admin.');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setApiError(err.response?.data?.error || 'Pendaftaran gagal, coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  if (successMsg) {
    return (
      <AuthLayout title="Pendaftaran Berhasil!">
        <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100">
          <p className="font-bold mb-2">Terima kasih telah mendaftar.</p>
          <p className="text-sm">Tim kami akan memverifikasi akun Anda. Anda akan dialihkan ke halaman login...</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout 
      title="Daftar Akun Baru" 
      subtitle={
        <>
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Masuk di sini
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {apiError && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0" />
            {apiError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Nama Lengkap</label>
            <input
              type="text"
              placeholder="Sesuai KTP"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                errors.namaLengkap ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
              }`}
              {...register('namaLengkap', { required: 'Wajib diisi' })}
            />
            {errors.namaLengkap && <p className="text-xs text-red-500 ml-1">{errors.namaLengkap.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Nomor Telepon</label>
            <input
              type="tel"
              placeholder="08xxxxxxxxxx"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                errors.nomorTelepon ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
              }`}
              {...register('nomorTelepon', { required: 'Wajib diisi' })}
            />
            {errors.nomorTelepon && <p className="text-xs text-red-500 ml-1">{errors.nomorTelepon.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              placeholder="email@contoh.com"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                errors.email ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
              }`}
              {...register('email', { required: 'Wajib diisi', pattern: { value: /^\S+@\S+$/i, message: 'Email tidak valid' } })}
            />
            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">NIK (Nomor Induk Kependudukan)</label>
            <input
              type="text"
              placeholder="16 digit NIK"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                errors.nik ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-primary-500'
              }`}
              {...register('nik', { required: 'Wajib diisi', minLength: { value: 16, message: 'NIK harus 16 digit' } })}
            />
            {errors.nik && <p className="text-xs text-red-500 ml-1">{errors.nik.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-semibold text-gray-700">Kata Sandi</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 6 karakter"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-xl text-sm pr-12 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all ${
                errors.kataSandi ? 'border-red-400' : 'border-gray-200 focus:border-primary-500'
              }`}
              {...register('kataSandi', { required: 'Wajib diisi', minLength: { value: 6, message: 'Minimal 6 karakter' } })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.kataSandi && <p className="text-xs text-red-500 ml-1">{errors.kataSandi.message}</p>}
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70"
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}
