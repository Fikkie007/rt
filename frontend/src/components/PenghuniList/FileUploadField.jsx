import { Upload, X } from 'lucide-react';

/**
 * Reusable file upload field with preview
 * Handles image file selection and preview display
 */
export default function FileUploadField({
    label,
    required,
    error,
    selectedFileName,
    previewImage,
    onFileChange,
    onFileRemove,
}) {
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            onFileChange(file);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            <div
                className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 ${
                    error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
            >
                <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="foto_ktp_upload"
                />
                <label
                    htmlFor="foto_ktp_upload"
                    className="flex items-center gap-2 cursor-pointer text-gray-700 dark:text-gray-300"
                >
                    <Upload size={20} />
                    <span>{selectedFileName || 'Upload foto KTP (JPG/PNG, max 5MB)'}</span>
                </label>
            </div>

            {error && <p className="text-sm text-red-500">{error.message}</p>}

            {/* Image Preview */}
            {previewImage && (
                <div className="mt-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Preview:</p>
                    <div className="relative">
                        <img
                            src={previewImage}
                            alt="Preview KTP"
                            className="w-full max-h-48 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                        />
                        <button
                            type="button"
                            onClick={onFileRemove}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Hapus gambar"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}