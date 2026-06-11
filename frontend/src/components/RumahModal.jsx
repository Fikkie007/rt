import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { rumahSchema } from '../validation/rumahSchema';

export default function RumahModal({ isOpen, onClose, onSubmit, rumah, mode }) {
    const isEdit = mode === 'edit';

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(rumahSchema),
        defaultValues: {
            tipe: 'rumah',
            nama: '',
            alamat: '',
            status: 'dihuni',
        },
    });

    // Reset form when modal opens with data
    useEffect(() => {
        if (isOpen) {
            if (isEdit && rumah) {
                reset({
                    tipe: 'rumah',
                    nama: rumah.nama,
                    alamat: rumah.alamat,
                    status: rumah.status,
                });
            } else {
                reset({
                    tipe: 'rumah',
                    nama: '',
                    alamat: '',
                    status: 'dihuni',
                });
            }
        }
    }, [isOpen, isEdit, rumah, reset]);

    if (!isOpen) return null;

    const onFormSubmit = (data) => {
        onSubmit(data, isEdit ? rumah?.id : null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={isSubmitting ? undefined : onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {isEdit ? 'Edit Rumah' : 'Tambah Rumah'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                    {/* Hidden tipe field */}
                    <input type="hidden" {...register('tipe')} value="rumah" />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nama
                        </label>
                        <input
                            type="text"
                            {...register('nama')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.nama
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                            placeholder="Nama rumah..."
                        />
                        {errors.nama && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.nama.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Alamat
                        </label>
                        <input
                            type="text"
                            {...register('alamat')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.alamat
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                            placeholder="Alamat rumah..."
                        />
                        {errors.alamat && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.alamat.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                        </label>
                        <select
                            {...register('status')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.status
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <option value="dihuni">Dihuni</option>
                            <option value="tidak dihuni">Tidak Dihuni</option>
                        </select>
                        {errors.status && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.status.message}
                            </p>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}