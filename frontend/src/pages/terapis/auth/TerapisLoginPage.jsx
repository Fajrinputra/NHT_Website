import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { terapisAuthApi } from '../../../api/terapisApi';
import { TerapisAuthContext } from '../../../context/TerapisAuthContext';

export default function TerapisLoginPage() {
  const [formData, setFormData] = useState({ nomorTelepon: '', kataSandi: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { loginTerapis } = useContext(TerapisAuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await terapisAuthApi.login(formData);
      if (response.data.success) {
        const { token, terapis } = response.data.data;
        loginTerapis(token, terapis);
        // TerapisAuthContext handles navigation to /terapis/jadwal
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login gagal. Silakan periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 tracking-tight">
          Masuk sebagai Terapis
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Gunakan nomor telepon dan kata sandi dari Admin.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-2xl sm:px-10 border border-gray-100">
          
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm text-center border border-red-100 font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="nomorTelepon" className="block text-sm font-medium text-gray-700">
                Nomor Telepon
              </label>
              <div className="mt-2">
                <input
                  id="nomorTelepon"
                  type="tel"
                  required
                  value={formData.nomorTelepon}
                  onChange={(e) => setFormData({ ...formData, nomorTelepon: e.target.value })}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="kataSandi" className="block text-sm font-medium text-gray-700">
                Kata Sandi
              </label>
              <div className="mt-2">
                <input
                  id="kataSandi"
                  type="password"
                  required
                  value={formData.kataSandi}
                  onChange={(e) => setFormData({ ...formData, kataSandi: e.target.value })}
                  className="appearance-none block w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md shadow-primary/20 text-sm font-bold text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50"
              >
                {loading ? 'Memeriksa Kredensial...' : 'Masuk Sekarang'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
