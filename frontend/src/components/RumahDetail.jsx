import { Home, MapPin, Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function RumahDetail({ selectedRumah, onEdit }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Detail Rumah
            </h3>

            {!selectedRumah ? (
                <div className="py-8 text-center">
                    <Home className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                        Pilih rumah dari daftar
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Nama</label>
                        <p className="font-medium text-gray-900 dark:text-white">{selectedRumah.nama}</p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Alamat</label>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                            {selectedRumah.alamat}
                        </p>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Status</label>
                        <div className="mt-1">
                            <StatusBadge status={selectedRumah.status} />
                        </div>
                    </div>
                    <div>
                        <label className="text-sm text-gray-500 dark:text-gray-400">Penghuni</label>
                        <p className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                            <Users size={16} className="text-gray-400 dark:text-gray-500" />
                            {selectedRumah.jumlah_penghuni} orang
                        </p>
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700 flex gap-2">
                        <button
                            onClick={() => onEdit?.(selectedRumah)}
                            className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                        >
                            Edit
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}