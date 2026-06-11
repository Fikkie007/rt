import { useAuth } from '../context/useAuth';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import useDashboardStats from '../hooks/useDashboardStats';
import StatCard from '../components/dashboard/StatCard';
import MonthlyChart from '../components/dashboard/MonthlyChart';
import PaymentStatusPie from '../components/dashboard/PaymentStatusPie';
import SaldoTrend from '../components/dashboard/SaldoTrend';

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - i);

export default function Dashboard() {
    const { user } = useAuth();
    const { stats, loading, error, year, setYear, refetch } = useDashboardStats();

    return (
        <div className="flex-1 bg-gray-100 dark:bg-gray-900 p-6">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            Dashboard
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Welcome, {user?.name}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        >
                            {YEAR_OPTIONS.map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                        <button
                            onClick={refetch}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 flex items-center gap-3">
                        <AlertCircle className="text-red-500" size={20} />
                        <p className="text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                {/* Loading state */}
                {loading && !stats && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="ml-3 text-gray-500 dark:text-gray-400">Memuat data...</p>
                    </div>
                )}

                {/* Stat Cards */}
                {stats && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard type="pemasukan" label="Total Pemasukan" value={stats.summary.total_pemasukan} />
                            <StatCard type="pengeluaran" label="Total Pengeluaran" value={stats.summary.total_pengeluaran} />
                            <StatCard type="saldo" label="Saldo" value={stats.summary.saldo} />
                            <StatCard type="rumah" label="Jumlah Rumah" value={stats.summary.jumlah_rumah} format="number" />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard type="penghuni" label="Penghuni Aktif" value={stats.summary.jumlah_penghuni_aktif} format="number" />
                            <StatCard type="tertunda" label="Pembayaran Pending" value={stats.summary.pembayaran_tertunda} format="number" />
                            <StatCard type="terlambat" label="Pembayaran Terlambat" value={stats.summary.pembayaran_terlambat} format="number" />
                        </div>

                        {/* Charts */}
                        <MonthlyChart data={stats.monthly} />
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <SaldoTrend data={stats.monthly} />
                            <PaymentStatusPie data={stats.payment_status_breakdown} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}