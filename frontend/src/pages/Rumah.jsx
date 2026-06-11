import { useState } from 'react';
import { Plus } from 'lucide-react';
import Swal from 'sweetalert2';
import api, { fetchCsrfToken } from '../lib/api';
import useRumahFilter from '../hooks/useRumahFilter';
import RumahList from '../components/RumahList';
import RumahDetail from '../components/RumahDetail';
import PenghuniList from '../components/PenghuniList';
import PembayaranList from '../components/PembayaranList';
import RumahModal from '../components/RumahModal';

export default function Rumah() {
    const [selectedRumah, setSelectedRumah] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState('add');

    const {
        searchQuery,
        setSearchQuery,
        showFilter,
        setShowFilter,
        statusFilter,
        toggleStatus,
        clearFilters,
        activeFilterCount,
        paginatedRumah,
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
    } = useRumahFilter();

    const handleOpenModal = (mode, rumah = null) => {
        setModalMode(mode);
        if (mode === 'edit' && rumah) {
            setSelectedRumah(rumah);
        }
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSubmit = async (data, id) => {
        try {
            await fetchCsrfToken();

            if (id) {
                const response = await api.put(`/api/data/${id}`, { ...data, tipe: 'rumah' });

                setSelectedRumah(response.data);

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: response.data.message || 'Rumah berhasil diubah',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            } else {
                const response = await api.post('/api/data', { ...data, tipe: 'rumah' });

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil!',
                    text: response.data.message || 'Rumah berhasil ditambahkan',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: 'OK'
                });
            }

            refetch();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menambahkan rumah',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        } finally {
            handleCloseModal();
        }
    };

    // Callback to refresh selected rumah data after penghuni/pembayaran changes
    const refreshSelectedRumah = async () => {
        if (!selectedRumah) return;

        try {
            const response = await api.get(`/api/data/${selectedRumah.id}`);
            setSelectedRumah(response.data);
        } catch (error) {
            console.error('Error refreshing selected rumah:', error);
        }
    };

    const handleEditRumah = (rumah) => {
        handleOpenModal('edit', rumah);
    };

    const handleDeleteRumah = async (rumah) => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Hapus Rumah?',
            text: `Apakah Anda yakin ingin menghapus "${rumah.nama}"?`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (!result.isConfirmed) return;

        try {
            await fetchCsrfToken();

            await api.delete(`/api/data/${rumah.id}`);

            if (selectedRumah?.id === rumah.id) {
                setSelectedRumah(null);
            }

            await Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Rumah berhasil dihapus',
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK'
            });

            refetch();
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Terjadi kesalahan saat menghapus rumah',
                confirmButtonColor: '#d33',
                confirmButtonText: 'OK'
            });
        }
    };

    return (
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Rumah
                    </h2>
                    <button
                        onClick={() => handleOpenModal('add')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm"
                    >
                        <Plus size={18} />
                        Tambah Rumah
                    </button>
                </div>

                {/* Search, Filter, and List */}
                <RumahList
                    paginatedRumah={paginatedRumah}
                    totalItems={totalItems}
                    selectedRumah={selectedRumah}
                    onSelectRumah={setSelectedRumah}
                    onDeleteRumah={handleDeleteRumah}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    showFilter={showFilter}
                    setShowFilter={setShowFilter}
                    statusFilter={statusFilter}
                    toggleStatus={toggleStatus}
                    clearFilters={clearFilters}
                    activeFilterCount={activeFilterCount}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                    nextPage={nextPage}
                    prevPage={prevPage}
                    itemsPerPage={itemsPerPage}
                    loading={loading}
                    error={error}
                    refetch={refetch}
                />

                {/* Detail, Penghuni, Pembayaran */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <RumahDetail selectedRumah={selectedRumah} onEdit={handleEditRumah} />
                    <PenghuniList selectedRumah={selectedRumah} onRefreshRumah={refreshSelectedRumah} />
                    <PembayaranList selectedRumah={selectedRumah} onRefreshRumah={refreshSelectedRumah} />
                </div>

                {/* Modal */}
                <RumahModal
                    isOpen={modalOpen}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmit}
                    rumah={selectedRumah}
                    mode={modalMode}
                />
            </div>
        </div>
    );
}