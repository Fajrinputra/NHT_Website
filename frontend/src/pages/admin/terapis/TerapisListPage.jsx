import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminTerapisApi } from '../../../api/adminApi';
import { PlusIcon, PencilSquareIcon } from '@heroicons/react/24/outline';

export default function TerapisListPage() {
  const [terapisList, setTerapisList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTerapis();
  }, []);

  const fetchTerapis = async () => {
    try {
      const response = await adminTerapisApi.getAll();
      if (response.data.success) {
        setTerapisList(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch terapis', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Terapis</h2>
        <Link
          to="/admin/terapis/tambah"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl font-medium hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
        >
          <PlusIcon className="w-5 h-5" />
          Tambah Terapis
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Nama Terapis</th>
                <th className="px-6 py-4">Nomor Telepon</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : terapisList.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                    Belum ada data terapis.
                  </td>
                </tr>
              ) : (
                terapisList.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{t.nama}</td>
                    <td className="px-6 py-4 text-gray-600">{t.nomorTelepon}</td>
                    <td className="px-6 py-4">
                      {t.aktif ? (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Aktif</span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">Nonaktif</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/terapis/${t.id}/edit`}
                        state={{ terapis: t }}
                        className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Edit Terapis"
                      >
                        <PencilSquareIcon className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
