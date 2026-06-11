import { Phone, Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

/**
 * Single penghuni list item component
 * Displays penghuni info with edit and delete actions
 */
export default function PenghuniListItem({ penghuni, onEdit, onDelete }) {
    const handleDelete = async () => {
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Hapus Penghuni?',
            text: `Apakah Anda yakin ingin menghapus "${penghuni.nama}"?`,
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        });

        if (result.isConfirmed) {
            onDelete(penghuni);
        }
    };

    return (
        <div className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
            {/* Avatar and Info */}
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                    {penghuni.nama.charAt(0)}
                </div>

                <div>
                    <p className="font-medium text-gray-900 dark:text-white">{penghuni.nama}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {penghuni.status_penghuni} • {penghuni.status}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Phone className="w-4 h-4" />
                        {penghuni.nomor}
                    </p>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-1">
                <button
                    onClick={() => onEdit(penghuni)}
                    className="p-2 text-gray-500 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    title="Edit penghuni"
                >
                    <Pencil size={18} />
                </button>
                <button
                    onClick={handleDelete}
                    className="p-2 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    title="Hapus penghuni"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
}