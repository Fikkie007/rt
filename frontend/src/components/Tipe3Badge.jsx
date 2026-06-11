const TIPE3_CONFIG = {
    kebersihan: {
        color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        text: 'Kebersihan',
    },
    satpam: {
        color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
        text: 'Satpam',
    },
    lainnya: {
        color: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
        text: 'Lainnya',
    },
};

export default function Tipe3Badge({ status }) {
    if (!status) return null;

    const config = TIPE3_CONFIG[status] || TIPE3_CONFIG.lainnya;
    const { color, text } = config;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {text}
        </span>
    );
}