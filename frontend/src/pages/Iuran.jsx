import { useState, useEffect } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import Swal from 'sweetalert2';
import api, { fetchCsrfToken } from '../lib/api';
import useIuranFilter from '../hooks/useIuranFilter';
import IuranTable from '../components/IuranTable';
import IuranModal from '../components/IuranModal';
import IuranBatchModal from '../components/IuranBatchModal';

export default function Iuran() {
    const [modalOpen, setModalOpen] = useState(false);
    const [batchModalOpen, setBatchModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingIuran, setEditingIuran] = useState(null);
    const [rumahOptions, setRumahOptions] = useState([]);

    const {
        searchQuery,
        setSearchQuery,
        showFilter,
        setShowFilter,
        tahunFilter,
        setTahunFilter,
        bulanFilter,
        setBulanFilter,
        tipe3Filter,
        setTipe3Filter,
        statusFilter,
        toggleStatus,
        clearFilters,
        activeFilterCount,
        rumahFilter,
        setRumahFilter,
        iuranData,
        currentPage,
        totalPages,
        totalItems,
        goToPage,
        nextPage,
        prevPage,
        itemsPerPage,
        loading,
        error,
        refetch,
    } = useIuranFilter();

    // Load rumah options for dropdown
    useEffect(() => {
        async function loadRumahOptions() {
            try {
                await fetchCsrfToken();
                const response = await api.get('/api/data?tipe=rumah&per_page=1000');
                setRumahOptions(response.data.data || []);
            } catch (err) {
                console.error('Error loading rumah options:', err);
            }
        }
        loadRumahOptions();
    }, []);

    const handleOpenModal = (mode, iuran = null) => {
        setModalMode(mode);
        setEditingIuran(iuran);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingIuran(null);
    };

    const handleOpenBatchModal = () => {
        setBatchModalOpen(true);
    };

    const handleCloseBatchModal = () => {
        setBatchModalOpen(false);
    };

    const handleSubmit = async (data, id) => {
        try {
            await fetchCsrfToken();

            const payload = {
                ...data,
                tipe: 'bayar',
                tipe2: 'masuk',
                id_data: Number(data.id_data),
                bayar: Number(data.bayar),
            };

            if (id) {
                const response = await api.put(`/api/tran/${id}`, payload);

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: response.data.message || 'Iuran berhasil diubah',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                });
            } else {
                const response = await api.post('/api/tran', payload);

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: response.data.message || 'Iuran berhasil ditambahkan',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                });
            }

            refetch();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan iuran',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
        } finally {
            handleCloseModal();
        }
    };

    const handleBatchSubmit = async (data) => {
        try {
            await fetchCsrfToken();

            const payload = {
                ...data,
                id_data: Number(data.id_data),
                bayar_per_bulan: Number(data.bayar_per_bulan),
            };

            const response = await api.post('/api/tran/batch-iuran', payload);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: `${response.data.count} iuran berhasil disimpan`,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });

            refetch();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan iuran',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
        } finally {
            handleCloseBatchModal();
        }
    };

    const handleDelete = async (iuran) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Hapus Iuran?',
            text: `Apakah Anda yakin ingin menghapus iuran ini?`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

        try {
            await fetchCsrfToken();
            await api.delete(`/api/tran/${iuran.id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Iuran berhasil dihapus',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });

            refetch();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus iuran',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
        }
    };

    return (
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Iuran
                    </h2>
                    <div className="flex gap-2">
                        <button
                            onClick={handleOpenBatchModal}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium shadow-sm"
                        >
                            <CalendarDays size={18} />
                            Bayar Multi Bulan
                        </button>
                        <button
                            onClick={() => handleOpenModal('add')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                        >
                            <Plus size={18} />
                            Tambah Iuran
                        </button>
                    </div>
                </div>

                {/* Table with search, filter, pagination */}
                <IuranTable
                    iuranData={iuranData}
                    totalItems={totalItems}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    itemsPerPage={itemsPerPage}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    tahunFilter={tahunFilter}
                    setTahunFilter={setTahunFilter}
                    bulanFilter={bulanFilter}
                    setBulanFilter={setBulanFilter}
                    tipe3Filter={tipe3Filter}
                    setTipe3Filter={setTipe3Filter}
                    statusFilter={statusFilter}
                    toggleStatus={toggleStatus}
                    clearFilters={clearFilters}
                    activeFilterCount={activeFilterCount}
                    rumahFilter={rumahFilter}
                    setRumahFilter={setRumahFilter}
                    rumahOptions={rumahOptions}
                    loading={loading}
                    error={error}
                    refetch={refetch}
                    onEdit={(i) => handleOpenModal('edit', i)}
                    onDelete={handleDelete}
                />

                {/* Modal */}
                <IuranModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    iuran={editingIuran}
                    mode={modalMode}
                    rumahOptions={rumahOptions}
                />

                {/* Batch Modal */}
                <IuranBatchModal
                    isOpen={batchModalOpen}
                    onClose={handleCloseBatchModal}
                    onSubmit={handleBatchSubmit}
                    rumahOptions={rumahOptions}
                />
            </div>
        </div>
    );
}