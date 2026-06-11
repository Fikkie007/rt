import { useMemo } from 'react';

const BULAN_NAMES_SHORT = {
    1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
    5: 'Mei', 6: 'Jun', 7: 'Jul', 8: 'Ags',
    9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Des',
};

export default function IuranMonthlyChart({ data }) {
    if (!data || !data.monthly) return null;

    // Aggregate data by month
    const chartData = useMemo(() => {
        const months = {};
        for (let b = 1; b <= 12; b++) {
            months[b] = { kebersihan: 0, satpam: 0 };
        }

        data.monthly.forEach(item => {
            if (item.bulan && months[item.bulan]) {
                months[item.bulan][item.tipe3] = item.total_lunas || 0;
            }
        });

        return Object.entries(months).map(([bulan, values]) => ({
            bulan: parseInt(bulan),
            label: BULAN_NAMES_SHORT[bulan],
            kebersihan: values.kebersihan,
            satpam: values.satpam,
        }));
    }, [data]);

    const maxValue = useMemo(() => {
        const max = Math.max(...chartData.map(d => Math.max(d.kebersihan, d.satpam)));
        return max > 0 ? max : 1;
    }, [chartData]);

    const formatCurrency = (val) => {
        if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `${(val / 1000).toFixed(0)}K`;
        return val.toString();
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Iuran Bulanan (Lunas)
            </h3>
            <div className="space-y-3">
                {chartData.map(item => (
                    <div key={item.bulan} className="flex items-center gap-3">
                        <span className="w-8 text-xs text-gray-500 dark:text-gray-400 text-right">
                            {item.label}
                        </span>
                        <div className="flex-1 flex gap-1">
                            {/* Kebersihan bar */}
                            <div
                                className="h-5 bg-teal-500 rounded-l"
                                style={{ width: `${(item.kebersihan / maxValue) * 100}%`, minWidth: item.kebersihan > 0 ? '4px' : '0' }}
                            />
                            {/* Satpam bar */}
                            <div
                                className="h-5 bg-purple-500 rounded-r"
                                style={{ width: `${(item.satpam / maxValue) * 100}%`, minWidth: item.satpam > 0 ? '4px' : '0' }}
                            />
                        </div>
                        <span className="w-16 text-xs text-gray-500 dark:text-gray-400">
                            {formatCurrency(item.kebersihan + item.satpam)}
                        </span>
                    </div>
                ))}
            </div>
            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-teal-500 rounded" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Kebersihan</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Satpam</span>
                </div>
            </div>
        </div>
    );
}