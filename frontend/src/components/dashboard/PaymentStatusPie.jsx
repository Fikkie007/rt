import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = {
    lunas: '#22c55e',
    pending: '#f97316',
    terlambat: '#ef4444',
};

const LABELS = {
    lunas: 'Lunas',
    pending: 'Pending',
    terlambat: 'Terlambat',
};

function CustomTooltip({ active, payload }) {
    if (!active || !payload?.length) return null;
    const data = payload[0];
    return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
            <p className="font-medium text-gray-900 dark:text-white">{LABELS[data.payload.status] || data.payload.status}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                {data.payload.count} transaksi
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
                Rp {Number(data.payload.total).toLocaleString('id-ID')}
            </p>
        </div>
    );
}

export default function PaymentStatusPie({ data }) {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Status Pembayaran
                </h3>
                <p className="text-center text-gray-500 dark:text-gray-400">Belum ada data status pembayaran</p>
            </div>
        );
    }

    const chartData = data.map(item => ({
        ...item,
        name: LABELS[item.status] || item.status,
        value: item.count,
        color: COLORS[item.status] || '#6b7280',
    }));

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Status Pembayaran
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ name, count }) => `${name} (${count})`}
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={index} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}