import { CheckCircle, XCircle } from 'lucide-react';

const BULAN_NAMES_SHORT = {
    1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
    5: 'Mei', 6: 'Jun', 7: 'Jul', 8: 'Ags',
    9: 'Sep', 10: 'Okt', 11: 'Nov', 12: 'Des',
};

export default function IuranStatusGrid({ data, totalRumah }) {
    if (!data || !data.monthly) return null;

    // Build status grid data
    const gridData = [];
    for (let b = 1; b <= 12; b++) {
        const kebersihanData = data.monthly.find(m => m.bulan === b && m.tipe3 === 'kebersihan');
        const satpamData = data.monthly.find(m => m.bulan === b && m.tipe3 === 'satpam');

        gridData.push({
            bulan: b,
            label: BULAN_NAMES_SHORT[b],
            kebersihanLunas: kebersihanData?.lunas_count || 0,
            kebersihanTotal: totalRumah || 0,
            satpamLunas: satpamData?.lunas_count || 0,
            satpamTotal: totalRumah || 0,
        });
    }

    const getPercentage = (lunas, total) => {
        if (!total) return 0;
        return Math.round((lunas / total) * 100);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Status Iuran per Bulan
            </h3>

            {/* Grid header */}
            <div className="grid grid-cols-12 gap-1 mb-2">
                {gridData.map(item => (
                    <div key={item.bulan} className="text-center">
                        <span className="text-xs text-gray-500 dark:text-gray-400">{item.label}</span>
                    </div>
                ))}
            </div>

            {/* Kebersihan row */}
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-20">Kebersihan</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                    {gridData.map(item => {
                        const pct = getPercentage(item.kebersihanLunas, item.kebersihanTotal);
                        const isComplete = pct === 100;
                        const isPartial = pct > 0 && pct < 100;

                        return (
                            <div
                                key={item.bulan}
                                className={`h-8 rounded flex items-center justify-center text-xs font-medium cursor-default transition-colors ${
                                    isComplete
                                        ? 'bg-teal-500 text-white'
                                        : isPartial
                                        ? 'bg-teal-200 dark:bg-teal-800 text-teal-700 dark:text-teal-300'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                }`}
                                title={`${item.kebersihanLunas}/${item.kebersihanTotal} (${pct}%)`}
                            >
                                {isComplete ? (
                                    <CheckCircle size={14} />
                                ) : isPartial ? (
                                    `${pct}%`
                                ) : (
                                    <XCircle size={14} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Satpam row */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-400 w-20">Satpam</span>
                </div>
                <div className="grid grid-cols-12 gap-1">
                    {gridData.map(item => {
                        const pct = getPercentage(item.satpamLunas, item.satpamTotal);
                        const isComplete = pct === 100;
                        const isPartial = pct > 0 && pct < 100;

                        return (
                            <div
                                key={item.bulan}
                                className={`h-8 rounded flex items-center justify-center text-xs font-medium cursor-default transition-colors ${
                                    isComplete
                                        ? 'bg-purple-500 text-white'
                                        : isPartial
                                        ? 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                                }`}
                                title={`${item.satpamLunas}/${item.satpamTotal} (${pct}%)`}
                            >
                                {isComplete ? (
                                    <CheckCircle size={14} />
                                ) : isPartial ? (
                                    `${pct}%`
                                ) : (
                                    <XCircle size={14} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-teal-500" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Lunas 100%</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-teal-200 dark:bg-teal-800 rounded" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Partial</span>
                </div>
                <div className="flex items-center gap-2">
                    <XCircle size={14} className="text-gray-400" />
                    <span className="text-xs text-gray-600 dark:text-gray-400">Belum Bayar</span>
                </div>
            </div>
        </div>
    );
}