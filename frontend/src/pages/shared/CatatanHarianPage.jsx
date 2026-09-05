import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, PencilLine, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import AppShell from '../../components/layout/AppShell';
import PageHeader from '../../components/layout/PageHeader';
import { getCatatanHarian, createCatatanHarian, updateCatatanHarian } from '../../api/catatanHarianApi';
import { formatTanggal } from '../../utils/formatters';

export default function CatatanHarianPage({ konteks }) {
  const { id } = useParams(); // anakId for Bayi/Anak context
  const navigate = useNavigate();
  const [catatanList, setCatatanList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  const loadData = () => {
    setIsLoading(true);
    getCatatanHarian(konteks, id)
      .then(res => setCatatanList(res.data.data || []))
      .catch(err => alert("Gagal memuat catatan: " + (err.response?.data?.error || err.message)))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [konteks, id]);

  const openForm = (item = null) => {
    if (item) {
      setEditingItem(item);
      // Format tanggal from ISO string to YYYY-MM-DD for input[type="date"]
      setValue('tanggal', item.tanggal.split('T')[0]);
      setValue('isiCatatan', item.isiCatatan);
    } else {
      setEditingItem(null);
      reset({ tanggal: new Date().toISOString().split('T')[0], isiCatatan: '' });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingItem(null);
    reset();
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      if (editingItem) {
        await updateCatatanHarian(editingItem.id, {
          tanggal: data.tanggal,
          isiCatatan: data.isiCatatan
        });
      } else {
        await createCatatanHarian({
          konteks,
          anakId: id || null,
          tanggal: data.tanggal,
          isiCatatan: data.isiCatatan
        });
      }
      closeForm();
      loadData();
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan catatan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const titlePrefix = konteks === 'IBU_HAMIL' ? 'Ibu Hamil' : (konteks === 'BAYI' ? 'Bayi' : 'Anak');

  return (
    <AppShell>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <PageHeader title={`Catatan Harian ${titlePrefix}`} />
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <PencilLine size={20} className="text-primary-600" />
            <h2 className="font-bold text-gray-800">Daftar Catatan</h2>
          </div>
          <button 
            onClick={() => openForm()}
            className="flex items-center gap-1 text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1.5 rounded-lg hover:bg-primary-100"
          >
            <Plus size={16} /> Tambah
          </button>
        </div>

        {isFormOpen && (
          <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl">
            <h3 className="font-bold text-gray-800 mb-3">{editingItem ? 'Edit Catatan' : 'Tambah Catatan Baru'}</h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              <div>
                <label className="input-label">Tanggal</label>
                <input 
                  type="date" 
                  className={`input-field ${errors.tanggal ? 'border-red-400' : ''}`}
                  {...register('tanggal', { required: 'Tanggal wajib diisi' })} 
                />
                {errors.tanggal && <p className="input-error">{errors.tanggal.message}</p>}
              </div>
              
              <div>
                <label className="input-label">Isi Catatan</label>
                <textarea 
                  rows="4"
                  placeholder="Tuliskan keluhan, perkembangan, atau catatan penting lainnya..."
                  className={`input-field resize-none ${errors.isiCatatan ? 'border-red-400' : ''}`}
                  {...register('isiCatatan', { required: 'Isi catatan wajib diisi' })} 
                ></textarea>
                {errors.isiCatatan && <p className="input-error">{errors.isiCatatan.message}</p>}
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
                  {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" onClick={closeForm} disabled={isSubmitting} className="btn-outline px-4 py-2 flex-1">
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : catatanList.length === 0 ? (
          <div className="py-8 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <PencilLine size={32} className="text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Belum ada catatan harian.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {catatanList.map((catatan) => (
              <div key={catatan.id} className="border border-gray-100 rounded-xl p-4 bg-white hover:shadow-card-hover transition-shadow relative group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                    {formatTanggal(catatan.tanggal)}
                  </span>
                  <button 
                    onClick={() => openForm(catatan)}
                    className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit catatan"
                  >
                    <PencilLine size={16} />
                  </button>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{catatan.isiCatatan}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
