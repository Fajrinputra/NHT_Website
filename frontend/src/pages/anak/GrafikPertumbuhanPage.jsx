import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { getGrafikPertumbuhan } from '../../api/anakApi';
import { formatTanggal } from '../../utils/formatters';

export default function GrafikPertumbuhanPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getGrafikPertumbuhan(id)
        .then(res => {
          // Format data for Recharts
          const chartData = (res.data.data || []).map(item => ({
            ...item,
            displayDate: formatTanggal(item.tanggalUkur),
          }));
          setData(chartData);
        })
        .catch(err => alert("Gagal memuat grafik pertumbuhan: " + (err.response?.data?.error || err.message)))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  return (
    <AppShell>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <PageHeader title="Grafik Pertumbuhan (KMS)" />
      </div>

      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <LineChartIcon size={20} className="text-blue-500" />
          <h2 className="font-bold text-gray-800">Kurva Berat Badan</h2>
        </div>
        
        {isLoading ? (
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl animate-pulse">
            <p className="text-gray-400">Memuat grafik...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-xl">
            <p className="text-gray-500">Belum ada data pertumbuhan.</p>
          </div>
        ) : (
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="displayDate" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Line type="monotone" name="Berat Badan (kg)" dataKey="beratBadan" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {!isLoading && data.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-gray-800 mb-4">Riwayat Pengukuran</h3>
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Tanggal</th>
                  <th className="px-4 py-3">BB (kg)</th>
                  <th className="px-4 py-3">PB/TB (cm)</th>
                  <th className="px-4 py-3">LK (cm)</th>
                  <th className="px-4 py-3 rounded-r-lg">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 last:border-0">
                    <td className="px-4 py-3 font-medium text-gray-900">{item.displayDate}</td>
                    <td className="px-4 py-3">{item.beratBadan}</td>
                    <td className="px-4 py-3">{item.panjangBadan}</td>
                    <td className="px-4 py-3">{item.lingkarKepala || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AppShell>
  );
}
