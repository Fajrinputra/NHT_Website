import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { terapisProfilApi } from '../../../api/terapisApi';
import { UserCircleIcon, PhoneIcon, KeyIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

export default function ProfilTerapisPage() {
  const navigate = useNavigate();
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [kataSandiBaru, setKataSandiBaru] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchProfil();
  }, []);

  const fetchProfil = async () => {
    try {
      const response = await terapisProfilApi.getProfil();
      if (response.data.success) {
        setProfil(response.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar?')) {
      localStorage.removeItem('nata_terapis_token');
      navigate('/terapis/login');
    }
  };

  const handleGantiPassword = async (e) => {
    e.preventDefault();
    if (kataSandiBaru.length < 6) return alert('Kata sandi minimal 6 karakter');
    
    setIsSubmitting(true);
    try {
      await terapisProfilApi.gantiKataSandi({ kataSandiBaru });
      alert('Kata sandi berhasil diubah!');
      setKataSandiBaru('');
      setShowPasswordForm(false);
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengubah kata sandi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Memuat...</div>;
  if (!profil) return <div className="text-center py-12 text-red-500">Gagal memuat profil</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Profil Saya</h2>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
          <UserCircleIcon className="w-16 h-16 text-primary" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{profil.nama}</h3>
        <p className="text-gray-500 mb-6 flex items-center justify-center gap-1">
          <PhoneIcon className="w-4 h-4" /> {profil.nomorTelepon}
        </p>

        <span className={`px-3 py-1 text-xs font-bold rounded-full ${profil.aktif ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {profil.aktif ? 'Akun Aktif' : 'Akun Nonaktif'}
        </span>
      </div>

      {/* Settings List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <button 
          onClick={() => setShowPasswordForm(!showPasswordForm)}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <KeyIcon className="w-5 h-5" />
          </div>
          <span className="font-medium text-gray-700">Ganti Kata Sandi</span>
        </button>

        {showPasswordForm && (
          <div className="p-4 bg-gray-50 border-b border-gray-100">
            <form onSubmit={handleGantiPassword} className="space-y-3">
              <input
                type="password"
                required
                minLength={6}
                value={kataSandiBaru}
                onChange={e => setKataSandiBaru(e.target.value)}
                placeholder="Kata sandi baru (min. 6 karakter)"
                className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <div className="flex gap-2">
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-primary text-white rounded-xl py-2 font-bold text-sm shadow-sm disabled:opacity-50">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" onClick={() => setShowPasswordForm(false)} className="flex-1 bg-white border border-gray-200 text-gray-600 rounded-xl py-2 font-bold text-sm">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 text-left hover:bg-red-50 transition-colors"
        >
          <div className="bg-red-100 p-2 rounded-lg text-red-600">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </div>
          <span className="font-medium text-red-600">Keluar</span>
        </button>
        
      </div>
    </div>
  );
}
