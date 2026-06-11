const PAYMENT_CONFIG = {
    lunas: {
        color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        text: 'Lunas',
    },
    pending: {
        color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
        text: 'Pending',
    },
    terlambat: {
        color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        text: 'Terlambat',
    },
};

export default function PaymentBadge({ status }) {
    const config = PAYMENT_CONFIG[status] || PAYMENT_CONFIG.pending;
    const { color, text } = config;

    return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
            {text}
        </span>
    );
}