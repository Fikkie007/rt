/**
 * Reusable form field component
 * Supports text input and select dropdown
 */
export default function FormField({ label, required, type = 'text', options, error, ...props }) {
    const inputClasses = `w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
        error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
    }`;

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {type === 'select' ? (
                <select {...props} className={inputClasses}>
                    <option value="">Pilih {label.toLowerCase()}</option>
                    {options?.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            ) : (
                <input type={type} {...props} className={inputClasses} />
            )}

            {error && <p className="text-sm text-red-500">{error.message}</p>}
        </div>
    );
}