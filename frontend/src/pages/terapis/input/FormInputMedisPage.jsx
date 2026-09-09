import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { terapisKunjunganApi, terapisInputApi } from '../../../api/terapisApi';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function FormInputMedisPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [anakId, setAnakId] = useState('');
  
  const [activeTab, setActiveTab] = useState('grafik'); // grafik, imunisasi, denver
  const [anakList, setAnakList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [grafik, setGrafik] = useState({ tanggalUkur: '', beratBadan: '', panjangBadan: '', lingkarKepala: '', status: '' });
  const [denver, setDenver] = useState({ motorikKasar: 'SESUAI_USIA', motorikHalus: 'SESUAI_USIA', bahasa: 'SESUAI_USIA', personalSosial: 'SESUAI_USIA' });
  
  const [imunisasiList, setImunisasiList] = useState([]);
  const [selectedImunisasiId, setSelectedImunisasiId] = useState('');
  const [imunisasiForm, setImunisasiForm] = useState({ status: 'SUDAH', tanggalPemberian: '' });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRiwayat();
  }, [id]);

  useEffect(() => {
    if (anakId) {
      fetchImunisasi(anakId);
    }
  }, [anakId]);

  const fetchImunisasi = async (idAnak) => {
    try {
      const response = await terapisInputApi.getImunisasi(idAnak);
      if (response.data.success) {
        setImunisasiList(response.data.data || []);
        if (response.data.data && response.data.data.length > 0) {
          setSelectedImunisasiId(response.data.data[0].id);
        } else {
          setSelectedImunisasiId('');
        }
      }
    } catch (err) {
      console.error('Gagal memuat imunisasi', err);
    }
  };

  const fetchRiwayat = async () => {
    try {
      // Get detail booking first to get klienId
      const bookingRes = await terapisKunjunganApi.getDetail(id);
      if (bookingRes.data.success) {
        const klienId = bookingRes.data.data.klienId;
        const riwayatRes = await terapisKunjunganApi.getRiwayatKlien(klienId);
        if (riwayatRes.data.success) {
          const data = riwayatRes.data.data;
          const allAnak = [...(data.bayi || []), ...(data.anak || [])];
          setAnakList(allAnak);
          if (allAnak.length > 0) {
            setAnakId(allAnak[0].id);
          }
        }
      }
    } catch (err) {
      console.error(err);
      alert('Gagal memuat data anak');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitGrafik = async (e) => {
    e.preventDefault();
    if (!anakId) return alert('Pilih anak terlebih dahulu');
    setIsSubmitting(true);
    try {
      const payload = {
        tanggalUkur: grafik.tanggalUkur,
        beratBadan: parseFloat(grafik.beratBadan) || 0,
        panjangBadan: parseFloat(grafik.panjangBadan) || 0,
        lingkarKepala: parseFloat(grafik.lingkarKepala) || 0,
        status: grafik.status
      };
      await terapisInputApi.tambahGrafikPertumbuhan(anakId, payload);
      alert('Data Grafik Pertumbuhan berhasil disimpan');
      setGrafik({ tanggalUkur: '', beratBadan: '', panjangBadan: '', lingkarKepala: '', status: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitDenver = async (e) => {
    e.preventDefault();
    if (!anakId) return alert('Pilih anak terlebih dahulu');
    setIsSubmitting(true);
    try {
      await terapisInputApi.tambahDenverII(anakId, denver);
      alert('Data Denver II berhasil disimpan');
      setDenver({ motorikKasar: 'SESUAI_USIA', motorikHalus: 'SESUAI_USIA', bahasa: 'SESUAI_USIA', personalSosial: 'SESUAI_USIA' });
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateImunisasi = async (e) => {
    e.preventDefault();
    if (!selectedImunisasiId) return alert('Pilih imunisasi terlebih dahulu');
    setIsSubmitting(true);
    try {
      await terapisInputApi.updateImunisasi(selectedImunisasiId, imunisasiForm);
      alert('Status imunisasi berhasil diupdate');
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal mengupdate imunisasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-12">Memuat data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-gray-500 hover:text-primary">
          <ArrowLeftIcon className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">Input Hasil Kunjungan</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Anak yang Ditangani</label>
        <select
          value={anakId}
          onChange={(e) => setAnakId(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary focus:border-primary"
        >
          {anakList.map(anak => (
            <option key={anak.id} value={anak.id}>{anak.nama} (Lahir: {new Date(anak.tanggalLahir).toLocaleDateString()})</option>
          ))}
          {anakList.length === 0 && <option value="">Tidak ada data anak ditemukan</option>}
        </select>
      </div>

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['grafik', 'imunisasi', 'denver'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap capitalize transition-colors ${
              activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {tab.replace('grafik', 'Grafik KMS').replace('denver', 'Denver II')}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        {activeTab === 'grafik' && (
          <form onSubmit={handleSubmitGrafik} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Ukur</label>
              <input type="date" required value={grafik.tanggalUkur} onChange={e => setGrafik({...grafik, tanggalUkur: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Berat (kg)</label>
                <input type="number" step="0.01" required value={grafik.beratBadan} onChange={e => setGrafik({...grafik, beratBadan: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Panjang/Tinggi (cm)</label>
                <input type="number" step="0.1" required value={grafik.panjangBadan} onChange={e => setGrafik({...grafik, panjangBadan: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lingkar Kepala (cm)</label>
              <input type="number" step="0.1" required value={grafik.lingkarKepala} onChange={e => setGrafik({...grafik, lingkarKepala: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status/Kesimpulan</label>
              <input type="text" required value={grafik.status} onChange={e => setGrafik({...grafik, status: e.target.value})} placeholder="Contoh: Normal, Gizi Baik" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
            </div>
            <button type="submit" disabled={isSubmitting || !anakId} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 active:bg-primary-dark transition-all disabled:opacity-50">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Grafik KMS'}
            </button>
          </form>
        )}

        {activeTab === 'denver' && (
          <form onSubmit={handleSubmitDenver} className="space-y-4">
            {['motorikKasar', 'motorikHalus', 'bahasa', 'personalSosial'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1').trim()}</label>
                <select value={denver[field]} onChange={e => setDenver({...denver, [field]: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary">
                  <option value="SESUAI_USIA">Sesuai Usia</option>
                  <option value="PERLU_PERHATIAN">Perlu Perhatian</option>
                </select>
              </div>
            ))}
            <button type="submit" disabled={isSubmitting || !anakId} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 active:bg-primary-dark transition-all disabled:opacity-50 mt-4">
              {isSubmitting ? 'Menyimpan...' : 'Simpan Hasil Denver II'}
            </button>
          </form>
        )}

        {activeTab === 'imunisasi' && (
          <form onSubmit={handleUpdateImunisasi} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Jenis Vaksin Imunisasi</label>
              <select 
                required 
                value={selectedImunisasiId} 
                onChange={e => setSelectedImunisasiId(e.target.value)} 
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="" disabled>-- Pilih Imunisasi --</option>
                {imunisasiList.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.namaVaksin} (Status Saat Ini: {item.status})
                  </option>
                ))}
              </select>
              {imunisasiList.length === 0 && <p className="text-red-500 text-xs mt-1">Belum ada jadwal imunisasi terdaftar untuk anak ini.</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={imunisasiForm.status} onChange={e => setImunisasiForm({...imunisasiForm, status: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary">
                <option value="SUDAH">SUDAH</option>
                <option value="BELUM">BELUM</option>
                <option value="TERLAMBAT">TERLAMBAT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Pemberian (Opsional)</label>
              <input type="date" value={imunisasiForm.tanggalPemberian} onChange={e => setImunisasiForm({...imunisasiForm, tanggalPemberian: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm" />
            </div>
            <button type="submit" disabled={isSubmitting || !anakId} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-md shadow-primary/20 active:bg-primary-dark transition-all disabled:opacity-50">
              {isSubmitting ? 'Menyimpan...' : 'Update Imunisasi'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
