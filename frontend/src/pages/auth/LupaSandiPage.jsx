import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';

export default function LupaSandiPage() {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API Call
    setIsSent(true);
  };

  return (
    <AuthLayout 
      title="Lupa Kata Sandi?" 
      subtitle="Masukkan nomor telepon atau email Anda, kami akan mengirimkan instruksi pemulihan sandi."
    >
      {isSent ? (
        <div className="bg-green-50 text-green-700 p-6 rounded-2xl text-center border border-green-100 mb-6">
          <p className="font-bold mb-2">Instruksi Terkirim!</p>
          <p className="text-sm">Silakan periksa pesan masuk (inbox) atau WhatsApp Anda untuk langkah selanjutnya.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label htmlFor="kontak" className="block text-sm font-semibold text-gray-700">
              Email atau Nomor Telepon
            </label>
            <input
              id="kontak"
              type="text"
              required
              placeholder="Contoh: 081234567890"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Kirim Instruksi
            </button>
          </div>
        </form>
      )}

      <div className="mt-8 text-center text-sm text-gray-500">
        Kembali ke{' '}
        <Link to="/login" className="text-primary-600 font-semibold hover:underline">
          Halaman Masuk
        </Link>
      </div>
    </AuthLayout>
  );
}
