import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { penghuniSchema, STATUS_PENGHUNI_OPTIONS, STATUS_OPTIONS } from './constants';
import { fetchCsrfToken } from '../../lib/api';
import FormField from './FormField';
import FileUploadField from './FileUploadField';
import api from '../../lib/api';
import Swal from 'sweetalert2';

/**
 * Modal form component for creating/editing penghuni
 * Uses react-hook-form's reset to initialize from props
 */
export default function PenghuniForm({ selectedRumah, editingPenghuni, onClose, onSuccess }) {
    const [selectedFileName, setSelectedFileName] = useState(() => {
        if (editingPenghuni?.foto_ktp) {
            return editingPenghuni.foto_ktp.replace('ktp/', '');
        }
        return '';
    });
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(penghuniSchema),
        defaultValues: editingPenghuni ? {
            nama: editingPenghuni.nama,
            nomor: editingPenghuni.nomor,
            status_penghuni: editingPenghuni.status_penghuni,
            status: editingPenghuni.status,
            foto_ktp: editingPenghuni.foto_ktp || '',
            isEditing: true,
        } : {
            nama: '',
            nomor: '',
            status_penghuni: '',
            status: '',
            foto_ktp: null,
            isEditing: false,
        }
    });

    // Helper: Fetch KTP image
    const fetchKtpImage = async (fotoKtpPath) => {
        if (!fotoKtpPath) return null;

        try {
            const filename = fotoKtpPath.replace('ktp/', '');
            const response = await api.get(`/api/files/ktp/${filename}`, {
                responseType: 'blob',
            });
            return URL.createObjectURL(response.data);
        } catch (error) {
            console.error('Error fetching KTP image:', error);
            return null;
        }
    };

    // Fetch existing KTP image if editing (runs once on mount)
    useEffect(() => {
        if (editingPenghuni?.foto_ktp) {
            fetchKtpImage(editingPenghuni.foto_ktp).then(url => {
                if (url) setPreviewImage(url);
            });
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (previewImage?.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // Handle file selection
    const handleFileChange = (file) => {
        setValue('foto_ktp', file);
        setSelectedFileName(file.name);

        // Cleanup old blob URL if exists
        if (previewImage?.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
        }

        const previewUrl = URL.createObjectURL(file);
        setPreviewImage(previewUrl);
    };

    // Handle file removal
    const handleFileRemove = () => {
        if (previewImage?.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
        }
        setPreviewImage(null);
        setSelectedFileName('');
        setValue('foto_ktp', null);
    };

    // Handle form submission
    const onSubmit = async (data) => {
        await fetchCsrfToken();

        const formData = new FormData();
        formData.append('id_data', selectedRumah.id);
        formData.append('tipe', 'penghuni');
        formData.append('nama', data.nama);
        formData.append('nomor', data.nomor);
        formData.append('status_penghuni', data.status_penghuni);
        formData.append('status', data.status);

        // Only append foto_ktp if it's a new file
        if (data.foto_ktp && typeof data.foto_ktp !== 'string') {
            formData.append('foto_ktp', data.foto_ktp);
        }

        setLoading(true);
        try {
            if (editingPenghuni) {
                formData.append('_method', 'PUT');
                await api.post(`/api/tran/${editingPenghuni.id}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            } else {
                if (data.foto_ktp && typeof data.foto_ktp !== 'string') {
                    formData.append('foto_ktp', data.foto_ktp);
                }
                await api.post('/api/tran', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: editingPenghuni ? 'Data penghuni berhasil diupdate!' : 'Data penghuni berhasil disimpan!',
                timer: 2000,
                showConfirmButton: false,
            });

            onSuccess();
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal!',
                text: error.response?.data?.message || 'Gagal menyimpan data',
                html: error.response?.data?.errors
                    ? Object.values(error.response.data.errors).flat().join('<br>')
                    : undefined,
            });
        } finally {
            setLoading(false);
        }
    };

    // Handle modal close with cleanup
    const handleClose = () => {
        if (previewImage?.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {editingPenghuni ? 'Edit Penghuni' : 'Tambah Penghuni'}
                    </h3>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden">
                    <div className="p-4 space-y-4 overflow-y-auto flex-1">
                        <FormField
                            label="Nama"
                            required
                            error={errors.nama}
                            {...register('nama')}
                            placeholder="Masukkan nama"
                        />

                        <FormField
                            label="Nomor Telepon"
                            required
                            error={errors.nomor}
                            {...register('nomor')}
                            placeholder="Masukkan Nomor Telepon"
                        />

                        <FormField
                            label="Status Penghuni"
                            required
                            type="select"
                            options={STATUS_PENGHUNI_OPTIONS}
                            error={errors.status_penghuni}
                            {...register('status_penghuni')}
                        />

                        <FormField
                            label="Status"
                            required
                            type="select"
                            options={STATUS_OPTIONS}
                            error={errors.status}
                            {...register('status')}
                        />

                        <FileUploadField
                            label="Foto KTP"
                            required={!editingPenghuni}
                            error={errors.foto_ktp}
                            selectedFileName={selectedFileName}
                            previewImage={previewImage}
                            onFileChange={handleFileChange}
                            onFileRemove={handleFileRemove}
                        />
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-4 border-t dark:border-gray-700">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}