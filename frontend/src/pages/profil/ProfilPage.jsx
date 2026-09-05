import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, Lock, Phone, CreditCard, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { changePassword } from '../../api/authApi';

export default function ProfilPage() {
  const { klien, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ passwordLama: '', passwordBaru: '' });
  const [passwordStatus, setPasswordStatus] = useState({ loading: false, error: '', success: '' });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleChangePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordStatus({ loading: true, error: '', success: '' });
    try {
      await changePassword(passwordForm);
      setPasswordStatus({ loading: false, error: '', success: 'Password berhasil diubah!' });
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordForm({ passwordLama: '', passwordBaru: '' });
        setPasswordStatus({ loading: false, error: '', success: '' });
      }, 1500);
    } catch (err) {
      setPasswordStatus({ loading: false, error: err.response?.data?.error || 'Gagal mengubah password', success: '' });
    }
  };

  if (!klien) return null;

  return (
    <AppShell>
      <PageHeader title="Profil Saya" />

      {/* Profil Card */}
      <section className="mt-4">
        <div className="card text-center py-8">
          <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full mx-auto flex items-center justify-center mb-4 shadow-sm border border-primary-200">
            <User size={40} />
          </div>
          <h2 className="text-lg font-bold text-gray-800">{klien.namaLengkap}</h2>
          <p className="text-sm text-gray-500 mb-4">{klien.email}</p>
          
          <div className="inline-flex px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-lg items-center gap-1.5 border border-green-200">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Terverifikasi
          </div>
        </div>
      </section>

      {/* Info Detail */}
      <section className="mt-6">
        <h3 className="text-sm font-bold text-gray-800 mb-3 px-1">Informasi Akun</h3>
        <div className="card space-y-4 p-0 divide-y divide-gray-100">
          <div className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
              <Phone size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">Nomor Telepon</p>
              <p className="text-sm font-bold text-gray-700">{klien.nomorTelepon}</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-500">
              <CreditCard size={16} />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-medium">NIK</p>
              <p className="text-sm font-bold text-gray-700">{klien.nik}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Pengaturan */}
      <section className="mt-6 mb-8">
        <h3 className="text-sm font-bold text-gray-800 mb-3 px-1">Pengaturan Keamanan</h3>
        <div className="card p-0 divide-y divide-gray-100 overflow-hidden">
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-600">
                <Lock size={16} />
              </div>
              <span className="text-sm font-medium text-gray-700">Ubah Password</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
          
          <button 
            onClick={handleLogout}
            className="w-full p-4 flex items-center justify-between hover:bg-red-50 transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center text-red-500">
                <LogOut size={16} />
              </div>
              <span className="text-sm font-medium text-red-600">Keluar (Logout)</span>
            </div>
            <ChevronRight size={18} className="text-red-400" />
          </button>
        </div>
      </section>

      {/* Modal Ubah Password */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Ubah Password</h3>
            
            {passwordStatus.error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm mb-4 border border-red-100">
                {passwordStatus.error}
              </div>
            )}
            {passwordStatus.success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-xl text-sm mb-4 border border-green-100">
                {passwordStatus.success}
              </div>
            )}

            <form onSubmit={handleChangePasswordSubmit} className="space-y-4">
              <div>
                <label className="input-label">Password Lama</label>
                <input
                  type="password"
                  className="input-field"
                  required
                  value={passwordForm.passwordLama}
                  onChange={e => setPasswordForm({...passwordForm, passwordLama: e.target.value})}
                />
              </div>
              <div>
                <label className="input-label">Password Baru</label>
                <input
                  type="password"
                  className="input-field"
                  required
                  value={passwordForm.passwordBaru}
                  onChange={e => setPasswordForm({...passwordForm, passwordBaru: e.target.value})}
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 btn-outline"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={passwordStatus.loading}
                  className="flex-1 btn-primary"
                >
                  {passwordStatus.loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </AppShell>
  );
}
