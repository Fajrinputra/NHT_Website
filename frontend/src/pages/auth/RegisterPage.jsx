import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import { register as apiRegister } from '../../api/authApi';
import PageHeader from '../../components/layout/PageHeader';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const kataSandiValue = watch('kataSandi');

  const onSubmit = async (data) => {
    setApiError('');
    setIsLoading(true);
    try {
      await apiRegister({
        namaLengkap: data.namaLengkap,
        nomorTelepon: data.nomorTelepon,
        kataSandi: data.kataSandi,
        konfirmasiKataSandi: data.konfirmasiKataSandi,
      });
      navigate('/menunggu-verifikasi', { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.error || 'Terjadi kesalahan, coba lagi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface">
      <PageHeader title="Daftar Akun" onBack={() => navigate('/login')} />

      <div className="px-6 py-6 max-w-sm mx-auto lg:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* API Error */}
          {apiError && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {apiError}
            </div>
          )}

          {/* Nama Lengkap */}
          <div>
            <label htmlFor="namaLengkap" className="input-label">Nama Lengkap</label>
            <input
              id="namaLengkap"
              type="text"
              placeholder="Masukkan nama lengkap Anda"
              className={`input-field ${errors.namaLengkap ? 'border-red-400' : ''}`}
              {...register('namaLengkap', {
                required: 'Nama lengkap wajib diisi',
                minLength: { value: 2, message: 'Nama minimal 2 karakter' },
              })}
            />
            {errors.namaLengkap && <p className="input-error">{errors.namaLengkap.message}</p>}
          </div>

          {/* Nomor Telepon */}
          <div>
            <label htmlFor="nomorTelepon" className="input-label">Nomor Telepon</label>
            <input
              id="nomorTelepon"
              type="tel"
              placeholder="Contoh: 08123456789"
              className={`input-field ${errors.nomorTelepon ? 'border-red-400' : ''}`}
              {...register('nomorTelepon', {
                required: 'Nomor telepon wajib diisi',
                minLength: { value: 10, message: 'Minimal 10 digit' },
                maxLength: { value: 15, message: 'Maksimal 15 digit' },
              })}
            />
            {errors.nomorTelepon && <p className="input-error">{errors.nomorTelepon.message}</p>}
          </div>

          {/* Kata Sandi */}
          <div>
            <label htmlFor="kataSandi" className="input-label">Kata Sandi</label>
            <div className="relative">
              <input
                id="kataSandi"
                type={showPassword ? 'text' : 'password'}
                placeholder="Buat kata sandi minimal 8 karakter"
                className={`input-field pr-12 ${errors.kataSandi ? 'border-red-400' : ''}`}
                {...register('kataSandi', {
                  required: 'Kata sandi wajib diisi',
                  minLength: { value: 8, message: 'Kata sandi minimal 8 karakter' },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.kataSandi && <p className="input-error">{errors.kataSandi.message}</p>}
          </div>

          {/* Konfirmasi Kata Sandi */}
          <div>
            <label htmlFor="konfirmasiKataSandi" className="input-label">Konfirmasi Kata Sandi</label>
            <div className="relative">
              <input
                id="konfirmasiKataSandi"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Ulangi kata sandi Anda"
                className={`input-field pr-12 ${errors.konfirmasiKataSandi ? 'border-red-400' : ''}`}
                {...register('konfirmasiKataSandi', {
                  required: 'Konfirmasi kata sandi wajib diisi',
                  validate: (val) => val === kataSandiValue || 'Kata sandi tidak cocok',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.konfirmasiKataSandi && (
              <p className="input-error">{errors.konfirmasiKataSandi.message}</p>
            )}
          </div>

          {/* Checkbox Syarat */}
          <div className="flex items-start gap-3">
            <input
              id="setuju"
              type="checkbox"
              className="mt-0.5 w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-400 accent-primary-600"
              {...register('setuju', {
                required: 'Anda harus menyetujui syarat & ketentuan',
              })}
            />
            <label htmlFor="setuju" className="text-sm text-gray-600">
              Saya menyetujui{' '}
              <span className="text-primary-600 font-medium cursor-pointer hover:underline">
                syarat &amp; ketentuan
              </span>
            </label>
          </div>
          {errors.setuju && <p className="input-error -mt-2">{errors.setuju.message}</p>}

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary"
              id="btn-daftar"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Mendaftarkan...
                </span>
              ) : 'Daftar'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Sudah punya akun?{' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Masuk
          </Link>
        </p>
      </div>
    </div>
  );
}
