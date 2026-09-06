import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { loginAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await loginAdmin(email, kataSandi);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-primary p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Nata Admin</h1>
          <p className="text-primary-light/80">Login ke Panel Super Admin</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-2xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Admin</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="admin@natahouse.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kata Sandi</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={kataSandi}
                  onChange={(e) => setKataSandi(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50 mt-4"
            >
              {loading ? 'Memproses...' : 'Login Admin'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
