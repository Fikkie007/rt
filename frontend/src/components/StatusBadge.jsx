import { CheckCircle, XCircle, HelpCircle } from 'lucide-react';

const STATUS_CONFIG = {
    occupied: {
        color:
            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        icon: CheckCircle,
        text: 'Dihuni',
    },
    vacant: {
        color:
            'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
        icon: XCircle,
        text: 'Tidak Dihuni',
    },
    unknown: {
        color:
            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        icon: HelpCircle,
        text: 'Status Tidak Diketahui',
    },
};

const STATUS_MAP = {
    dihuni: 'occupied',
    'tidak dihuni': 'vacant',
};

export default function StatusBadge({ status }) {
    const normalized = String(status ?? '').trim().toLowerCase();
    const statusKey = STATUS_MAP[normalized] ?? 'unknown';

    const { color, icon: Icon, text } = STATUS_CONFIG[statusKey];

    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${color}`}>
            <Icon size={12} />
            {text}
        </span>
    );
}