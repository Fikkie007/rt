import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
    ResponsiveContainer,
} from 'recharts';

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
            {payload.map((entry) => (
                <p key={entry.name} style={{ color: entry.color }} className="text-sm">
                    {entry.name === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}: {formatCurrency(entry.value)}
                </p>
            ))}
        </div>
    );
}

export default function MonthlyChart({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Pemasukan vs Pengeluaran per Bulan
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Belum ada data bulanan</p>
            </div>
        );
    }

    const chartData = data.map(item => ({
        ...item,
        monthLabel: MONTH_NAMES[item.month?.split('-')?.[1]] || item.month,
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pemasukan vs Pengeluaran per Bulan
            </h3>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis dataKey="monthLabel" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}jt`} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend formatter={(value) => value === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'} />
                    <Bar dataKey="pemasukan" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pengeluaran" fill="#ef4444" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}