import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { pembayaranSchema, STATUS_BAYAR_OPTIONS, DEFAULT_FORM_VALUES, TIPE2 } from '../validation/pembayaranSchema';

// Currency formatter helper
const formatCurrency = (value) => {
    if (!value) return '';
    const num = String(value).replace(/\D/g, '');
    if (!num) return '';
    return Number(num).toLocaleString('id-ID');
};

const parseCurrency = (formatted) => {
    return String(formatted).replace(/\D/g, '');
};

export default function PembayaranModal({ isOpen, onClose, onSubmit, pembayaran, mode, rumahOptions }) {
    const isEdit = mode === 'edit';

    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(pembayaranSchema),
        defaultValues: DEFAULT_FORM_VALUES,
    });

    const tipe2Value = watch('tipe2');

    // Reset form when modal opens with data
    useEffect(() => {
        if (isOpen) {
            if (isEdit && pembayaran) {
                reset({
                    id_data: pembayaran.id_data || '',
                    tipe: pembayaran.tipe || 'bayar',
                    tipe2: pembayaran.tipe2 || 'masuk',
                    nama: pembayaran.nama || '',
                    tanggal: pembayaran.tanggal || new Date().toISOString().split('T')[0],
                    bayar: pembayaran.bayar || '',
                    status_bayar: pembayaran.status_bayar || 'pending',
                });
            } else {
                reset(DEFAULT_FORM_VALUES);
            }
        }
    }, [isOpen, isEdit, pembayaran, reset]);

    if (!isOpen) return null;

    const onFormSubmit = (data) => {
        // Parse currency back to number
        const bayarNum = parseCurrency(data.bayar);
        const submitData = {
            ...data,
            bayar: bayarNum ? Number(bayarNum) : 0,
            tipe: 'bayar',
        };
        onSubmit(submitData, isEdit ? pembayaran?.id : null);
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
                        {isEdit ? 'Edit Pembayaran' : 'Tambah Pembayaran'}
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
                    {/* Rumah Dropdown - hidden for Pengeluaran */}
                    {tipe2Value !== 'keluar' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Rumah <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('id_data', { valueAsNumber: true })}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.id_data
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <option value="">Pilih rumah...</option>
                                {rumahOptions && rumahOptions.map((rumah) => (
                                    <option key={rumah.id} value={rumah.id}>
                                        {rumah.nama}
                                    </option>
                                ))}
                            </select>
                            {errors.id_data && (
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                    {errors.id_data.message}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Tanggal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            {...register('tanggal')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.tanggal
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        />
                        {errors.tanggal && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.tanggal.message}
                            </p>
                        )}
                    </div>

                    {/* Tanggal */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nama <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            {...register('nama')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.tanggal
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        />
                        {errors.nama && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.nama.message}
                            </p>
                        )}
                    </div>

                    {/* Jumlah (Bayar) - with currency mask */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Jumlah (Rp) <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="bayar"
                            control={control}
                            render={({ field }) => (
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        value={formatCurrency(field.value)}
                                        onChange={(e) => {
                                            const rawValue = parseCurrency(e.target.value);
                                            field.onChange(rawValue);
                                        }}
                                        onBlur={field.onBlur}
                                        disabled={isSubmitting}
                                        placeholder="0"
                                        className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.bayar
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    />
                                </div>
                            )}
                        />
                        {errors.bayar && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.bayar.message}
                            </p>
                        )}
                    </div>

                    {/* Status Bayar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipe Pemasukan <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('tipe2')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.status_bayar
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {TIPE2.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.status_bayar && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.status_bayar.message}
                            </p>
                        )}
                    </div>

                    {/* Status Bayar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('status_bayar')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.status_bayar
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {STATUS_BAYAR_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.status_bayar && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.status_bayar.message}
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