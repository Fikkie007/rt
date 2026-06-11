import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { useMemo } from 'react';

const MONTH_NAMES = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
    '05': 'Mei', '06': 'Jun', '07': 'Jul', '08': 'Agu',
    '09': 'Sep', '10': 'Okt', '11': 'Nov', '12': 'Des',
};

function formatCurrency(value) {
    return `Rp ${Number(value).toLocaleString('id-ID')}`;
}

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
            <p className="font-medium text-gray-900 dark:text-white mb-1">{label}</p>
            <p className="text-sm text-blue-600">Saldo: {formatCurrency(payload[0].value)}</p>
        </div>
    );
}

export default function SaldoTrend({ data }) {
    // Compute cumulative saldo using useMemo (must be called before any conditional returns)
    const chartData = useMemo(() => {
        if (!data || data.length === 0) return [];
        const result = [];
        let cumulativeSaldo = 0;
        for (const item of data) {
            cumulativeSaldo += (item.pemasukan - item.pengeluaran);
            result.push({
                monthLabel: MONTH_NAMES[item.month?.split('-')?.[1]] || item.month,
                saldo: cumulativeSaldo,
            });
        }
        return result;
    }, [data]);

    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Tren Saldo
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Belum ada data saldo</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Tren Saldo
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="monthLabel" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}jt`} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="saldo" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}