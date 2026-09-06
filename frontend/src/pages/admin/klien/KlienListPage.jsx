import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminKlienApi } from '../../../api/adminApi';
import { MagnifyingGlassIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function KlienListPage() {
  const [kliens, setKliens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(''); // '' = Semua, 'MENUNGGU', 'AKTIF', 'DITOLAK'
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchKliens();
  }, [filterStatus]);

  const fetchKliens = async () => {
    setLoading(true);
    try {
      const response = await adminKlienApi.getAll(filterStatus);
      if (response.data.success) {
        setKliens(response.data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch kliens', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredKliens = kliens.filter(k => 
    k.namaLengkap.toLowerCase().includes(search.toLowerCase()) ||
    k.nomorTelepon.includes(search)
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'MENUNGGU':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">Menunggu Verifikasi</span>;
      case 'AKTIF':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Aktif</span>;
      case 'DITOLAK':
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Ditolak</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Manajemen Klien</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters & Search */}
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['', 'MENUNGGU', 'AKTIF', 'DITOLAK'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                  filterStatus === status 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {status === '' ? 'Semua Status' : status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-64">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama atau no. HP..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Nama Lengkap</th>
                <th className="px-6 py-4">Nomor Telepon</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tgl Mendaftar</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : filteredKliens.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    Tidak ada data klien yang ditemukan.
                  </td>
                </tr>
              ) : (
                filteredKliens.map(klien => (
                  <tr key={klien.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{klien.namaLengkap}</td>
                    <td className="px-6 py-4 text-gray-600">{klien.nomorTelepon}</td>
                    <td className="px-6 py-4">{getStatusBadge(klien.statusVerifikasi)}</td>
                    <td className="px-6 py-4 text-gray-500">{klien.createdAt.split(' ')[0]}</td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/klien/${klien.id}`}
                        className="inline-flex items-center justify-center p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        title="Lihat Detail"
                      >
                        <EyeIcon className="w-5 h-5" />
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
