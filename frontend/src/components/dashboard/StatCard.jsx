import { TrendingUp, TrendingDown, Home, Users, Clock, AlertTriangle } from 'lucide-react';

const ICON_MAP = {
    pemasukan: TrendingUp,
    pengeluaran: TrendingDown,
    saldo: TrendingUp,
    rumah: Home,
    penghuni: Users,
    tertunda: Clock,
    terlambat: AlertTriangle,
};

const COLOR_MAP = {
    pemasukan: 'bg-green-500',
    pengeluaran: 'bg-red-500',
    saldo: 'bg-blue-500',
    rumah: 'bg-purple-500',
    penghuni: 'bg-indigo-500',
    tertunda: 'bg-orange-500',
    terlambat: 'bg-red-600',
};

export default function StatCard({ type, label, value, format = 'currency' }) {
    const Icon = ICON_MAP[type] || TrendingUp;
    const bgColor = COLOR_MAP[type] || 'bg-gray-500';

    const formattedValue = format === 'currency'
        ? `Rp ${(value ?? 0).toLocaleString('id-ID')}`
        : String(value ?? 0);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-5 flex items-center gap-4">
            <div className={`${bgColor} p-3 rounded-lg text-white`}>
                <Icon size={24} />
            </div>
            <div className="min-w-0">
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{label}</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{formattedValue}</p>
            </div>
        </div>
    );
}