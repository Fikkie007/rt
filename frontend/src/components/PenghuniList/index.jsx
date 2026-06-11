import { Users, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import PenghuniForm from './PenghuniForm';
import PenghuniListItem from './PenghuniListItem';
import usePenghuni from './usePenghuni';

/**
 * Main PenghuniList component - simplified and easier to maintain
 * Responsibilities:
 * - Display list of penghuni for selected rumah
 * - Show loading/empty states
 * - Handle add/edit modal visibility
 */
export default function PenghuniList({ selectedRumah, onRefreshRumah }) {
    const { penghuniData, fetchLoading, refreshPenghuni, deletePenghuni } = usePenghuni(selectedRumah);
    const [showForm, setShowForm] = useState(false);
    const [editingPenghuni, setEditingPenghuni] = useState(null);

    // Fetch data when selectedRumah changes
    useEffect(() => {
        refreshPenghuni();
    }, [refreshPenghuni]);

    // Open form for new penghuni
    const handleAddNew = () => {
        setEditingPenghuni(null);
        setShowForm(true);
    };

    // Open form for editing
    const handleEdit = (penghuni) => {
        setEditingPenghuni(penghuni);
        setShowForm(true);
    };

    // Close form modal
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingPenghuni(null);
    };

    // Handle successful form submission
    const handleFormSuccess = () => {
        setShowForm(false);
        setEditingPenghuni(null);
        onRefreshRumah?.();
    };

    // Handle delete penghuni
    const handleDelete = async (penghuni) => {
        const result = await deletePenghuni(penghuni.id);
        if (result.success) {
            onRefreshRumah?.();
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">List Penghuni</h3>
                {selectedRumah && (
                    <button
                        onClick={handleAddNew}
                        className="flex items-center gap-2 px-3 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-lg transition-colors"
                    >
                        <Plus size={16} />
                        Tambah
                    </button>
                )}
            </div>

            {/* Content States */}
            {!selectedRumah ? (
                <EmptyState message="Pilih rumah terlebih dahulu" />
            ) : fetchLoading ? (
                <LoadingState />
            ) : penghuniData.length === 0 ? (
                <EmptyState message="Belum ada penghuni" />
            ) : (
                <div className="space-y-3">
                    {penghuniData.map((penghuni) => (
                        <PenghuniListItem key={penghuni.id} penghuni={penghuni} onEdit={handleEdit} onDelete={handleDelete} />
                    ))}
                </div>
            )}

            {/* Modal Form */}
            {showForm && (
                <PenghuniForm
                    selectedRumah={selectedRumah}
                    editingPenghuni={editingPenghuni}
                    onClose={handleCloseForm}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}

/**
 * Loading state component
 */
function LoadingState() {
    return (
        <div className="py-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Memuat data penghuni...</p>
        </div>
    );
}

/**
 * Empty state component
 */
function EmptyState({ message }) {
    return (
        <div className="py-8 text-center">
            <Users className="w-10 h-10 mx-auto text-gray-300 dark:text-gray-600 mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
        </div>
    );
}