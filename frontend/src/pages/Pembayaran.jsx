import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import api, { fetchCsrfToken } from '../lib/api';
import usePembayaranFilter from '../hooks/usePembayaranFilter';
import PembayaranTable from '../components/PembayaranTable';
import PembayaranModal from '../components/PembayaranModal';

export default function Pembayaran() {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');
    const [editingPembayaran, setEditingPembayaran] = useState(null);
    const [rumahOptions, setRumahOptions] = useState([]);

    const {
        searchQuery,
        setSearchQuery,
        showFilter,
        setShowFilter,
        statusFilter,
        toggleStatus,
        clearFilters,
        activeFilterCount,
        dateFrom,
        setDateFrom,
        dateTo,
        setDateTo,
        rumahFilter,
        setRumahFilter,
        pembayaranData,
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
    } = usePembayaranFilter();

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

    const handleOpenModal = (mode, pembayaran = null) => {
        setModalMode(mode);
        setEditingPembayaran(pembayaran);
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setEditingPembayaran(null);
    };

    const handleSubmit = async (data, id) => {
        try {
            await fetchCsrfToken();

            const payload = {
                ...data,
                tipe: 'bayar',
                id_data: Number(data.id_data),
                bayar: Number(data.bayar),
            };

            if (id) {
                const response = await api.put(`/api/tran/${id}`, payload);

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: response.data.message || 'Pembayaran berhasil diubah',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                });
            } else {
                const response = await api.post('/api/tran', payload);

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: response.data.message || 'Pembayaran berhasil ditambahkan',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK',
                });
            }

            refetch();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan pembayaran',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK',
            });
        } finally {
            handleCloseModal();
        }
    };

    const handleDelete = async (pembayaran) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Hapus Pembayaran?',
            text: `Apakah Anda yakin ingin menghapus pembayaran ini?`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

        try {
            await fetchCsrfToken();
            await api.delete(`/api/tran/${pembayaran.id}`);

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Pembayaran berhasil dihapus',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
            });

            refetch();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus pembayaran',
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
                        Pembayaran
                    </h2>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        <Plus size={18} />
                        Tambah Pembayaran
                    </button>
                </div>

                {/* Table with search, filter, pagination */}
                <PembayaranTable
                    pembayaranData={pembayaranData}
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
                    dateFrom={dateFrom}
                    setDateFrom={setDateFrom}
                    dateTo={dateTo}
                    setDateTo={setDateTo}
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
                    onEdit={(p) => handleOpenModal('edit', p)}
                    onDelete={handleDelete}
                />

                {/* Modal */}
                <PembayaranModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    pembayaran={editingPembayaran}
                    mode={modalMode}
                    rumahOptions={rumahOptions}
                />
            </div>
        </div>
    );
}