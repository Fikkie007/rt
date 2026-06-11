import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { iuranBatchSchema, STATUS_BAYAR_OPTIONS, TIPE3_OPTIONS, BULAN_OPTIONS, DEFAULT_IURAN_BATCH_FORM_VALUES, getDefaultAmountForTipe3 } from '../validation/pembayaranSchema';

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

export default function IuranBatchModal({ isOpen, onClose, onSubmit, rumahOptions }) {
    const {
        register,
        handleSubmit,
        control,
        watch,
        setValue,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        resolver: yupResolver(iuranBatchSchema),
        defaultValues: DEFAULT_IURAN_BATCH_FORM_VALUES,
    });

    const tipe3Value = watch('tipe3');
    const bulanDari = watch('bulan_dari');
    const bulanSampai = watch('bulan_sampai');
    const bayarPerBulan = watch('bayar_per_bulan');

    // Auto-fill default amount when tipe3 changes
    useEffect(() => {
        if (tipe3Value) {
            const defaultAmount = getDefaultAmountForTipe3(tipe3Value);
            setValue('bayar_per_bulan', defaultAmount);
        }
    }, [tipe3Value, setValue]);

    // Reset form when modal opens
    useEffect(() => {
        if (isOpen) {
            reset(DEFAULT_IURAN_BATCH_FORM_VALUES);
        }
    }, [isOpen, reset]);

    if (!isOpen) return null;

    const totalMonths = bulanSampai - bulanDari + 1;
    const totalAmount = bayarPerBulan * totalMonths;

    const onFormSubmit = (data) => {
        // Parse currency back to number
        const bayarNum = parseCurrency(data.bayar_per_bulan);
        const submitData = {
            ...data,
            bayar_per_bulan: bayarNum ? Number(bayarNum) : 0,
        };
        onSubmit(submitData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={isSubmitting ? undefined : onClose}
            />

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6 max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Bayar Multi Bulan
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
                    {/* Rumah Dropdown */}
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

                    {/* Tipe Iuran */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tipe Iuran <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('tipe3')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.tipe3
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {TIPE3_OPTIONS.filter(o => o.value !== 'lainnya').map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {errors.tipe3 && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.tipe3.message}
                            </p>
                        )}
                    </div>

                    {/* Bulan Range */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Bulan Dari <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('bulan_dari', { valueAsNumber: true })}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.bulan_dari
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                {BULAN_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.bulan_dari && (
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                    {errors.bulan_dari.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Bulan Sampai <span className="text-red-500">*</span>
                            </label>
                            <select
                                {...register('bulan_sampai', { valueAsNumber: true })}
                                disabled={isSubmitting}
                                className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.bulan_sampai
                                    ? 'border-red-500 dark:border-red-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                {BULAN_OPTIONS.map((option) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                            {errors.bulan_sampai && (
                                <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                    {errors.bulan_sampai.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tahun */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tahun <span className="text-red-500">*</span>
                        </label>
                        <select
                            {...register('tahun', { valueAsNumber: true })}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.tahun
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {Array.from({ length: 11 }, (_, i) => 2020 + i).map((y) => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        {errors.tahun && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.tahun.message}
                            </p>
                        )}
                    </div>

                    {/* Jumlah Per Bulan - with currency mask */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Jumlah Per Bulan (Rp) <span className="text-red-500">*</span>
                        </label>
                        <Controller
                            name="bayar_per_bulan"
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
                                        className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.bayar_per_bulan
                                            ? 'border-red-500 dark:border-red-500'
                                            : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    />
                                </div>
                            )}
                        />
                        {errors.bayar_per_bulan && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.bayar_per_bulan.message}
                            </p>
                        )}
                    </div>

                    {/* Total Display */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                Total ({totalMonths} bulan):
                            </span>
                            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                                Rp {formatCurrency(totalAmount)}
                            </span>
                        </div>
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

                    {/* Tanggal Bayar */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Tanggal Bayar
                        </label>
                        <input
                            type="date"
                            {...register('tanggal_bayar')}
                            disabled={isSubmitting}
                            className={`w-full px-3 py-2 rounded-lg border bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${errors.tanggal_bayar
                                ? 'border-red-500 dark:border-red-500'
                                : 'border-gray-200 dark:border-gray-700'
                                }`}
                        />
                        {errors.tanggal_bayar && (
                            <p className="mt-1 text-xs text-red-500 dark:text-red-400">
                                {errors.tanggal_bayar.message}
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
                            {isSubmitting ? 'Menyimpan...' : `Simpan ${totalMonths} Iuran`}
                        </button>
                    </div>
                </form>
            </div>
        </div >
    );
}