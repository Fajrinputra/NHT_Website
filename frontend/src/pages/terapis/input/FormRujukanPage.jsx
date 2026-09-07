import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { terapisInputApi } from '../../../api/terapisApi';
import { ArrowLeftIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function FormRujukanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catatan, setCatatan] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!catatan.trim()) return alert('Mohon isi alasan/catatan rujukan');

    setIsSubmitting(true);
    try {
      const response = await terapisInputApi.tandaiRujukan(id, { catatanRujukan: catatan });
      if (response.data.success) {
        alert('Rujukan berhasil dilaporkan ke Admin');
        navigate(`/terapis/booking/${id}`);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal melaporkan rujukan');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-red-600">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-red-600">Laporan Rujukan</h2>
      </div>

      <div className="bg-red-50 text-red-800 p-4 rounded-2xl text-sm border border-red-100 flex gap-3">
        <ExclamationTriangleIcon className="w-6 h-6 flex-shrink-0 text-red-600" />
        <p>Gunakan form ini HANYA jika Anda menemukan kondisi medis pada klien yang memerlukan perhatian khusus dari dokter atau fasilitas kesehatan rujukan. Admin akan segera di-notifikasi.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-2">Alasan & Catatan Rujukan</label>
          <textarea
            required
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Jelaskan secara detail gejala atau temuan yang membuat klien/anak ini perlu dirujuk..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-red-600 text-white rounded-xl font-bold shadow-md shadow-red-600/20 active:bg-red-700 disabled:opacity-50 transition-all"
        >
          {isSubmitting ? 'Mengirim...' : 'Kirim Laporan Rujukan'}
        </button>
      </form>
    </div>
  );
}
