import { Sparkles, Shield, AlertCircle } from 'lucide-react';

const BULAN_NAMES = {
    1: 'Januari', 2: 'Februari', 3: 'Maret', 4: 'April',
    5: 'Mei', 6: 'Juni', 7: 'Juli', 8: 'Agustus',
    9: 'September', 10: 'Oktober', 11: 'November', 12: 'Desember',
};

export default function IuranStats({ data }) {
    if (!data || !data.per_tipe) return null;

    const kebersihan = data.per_tipe.find(t => t.tipe3 === 'kebersihan') || {
        total_bayar: 0, total_lunas: 0, lunas_count: 0, pending_count: 0, terlambat_count: 0,
    };
    const satpam = data.per_tipe.find(t => t.tipe3 === 'satpam') || {
        total_bayar: 0, total_lunas: 0, lunas_count: 0, pending_count: 0, terlambat_count: 0,
    };

    const formatCurrency = (val) => `Rp ${(val ?? 0).toLocaleString('id-ID')}`;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Iuran Kebersihan Total */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                <div className="bg-teal-500 p-3 rounded-lg text-white">
                    <Sparkles size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Iuran Kebersihan</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(kebersihan.total_lunas)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Lunas: {kebersihan.lunas_count} | Pending: {kebersihan.pending_count}
                    </p>
                </div>
            </div>

            {/* Iuran Satpam Total */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                <div className="bg-purple-500 p-3 rounded-lg text-white">
                    <Shield size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Iuran Satpam</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(satpam.total_lunas)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Lunas: {satpam.lunas_count} | Pending: {satpam.pending_count}
                    </p>
                </div>
            </div>

            {/* Total Iuran Lunas */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                <div className="bg-green-500 p-3 rounded-lg text-white">
                    <Sparkles size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Total Iuran Lunas</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(kebersihan.total_lunas + satpam.total_lunas)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        {kebersihan.lunas_count + satpam.lunas_count} pembayaran
                    </p>
                </div>
            </div>

            {/* Iuran Tertunggak */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
                <div className="bg-red-500 p-3 rounded-lg text-white">
                    <AlertCircle size={24} />
                </div>
                <div className="min-w-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Iuran Tertunggak</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {kebersihan.terlambat_count + satpam.terlambat_count}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                        Kebersihan: {kebersihan.terlambat_count} | Satpam: {satpam.terlambat_count}
                    </p>
                </div>
            </div>
        </div>
    );
}