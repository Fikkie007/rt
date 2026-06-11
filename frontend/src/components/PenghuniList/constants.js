import * as yup from 'yup';

// Status options for dropdowns
export const STATUS_PENGHUNI_OPTIONS = [
    { value: 'Kontrak', label: 'Kontrak' },
    { value: 'Tetap', label: 'Tetap' },
    { value: 'Pindah', label: 'Pindah' },
];

export const STATUS_OPTIONS = [
    { value: 'Sudah Menikah', label: 'Sudah Menikah' },
    { value: 'Belum Menikah', label: 'Belum Menikah' },
];

// Yup validation schema
export const penghuniSchema = yup.object().shape({
    nama: yup.string().required('Nama wajib diisi'),
    nomor: yup.string().required('Nomor Telepon wajib diisi'),
    status_penghuni: yup.string().required('Status penghuni wajib dipilih'),
    status: yup.string().required('Status wajib dipilih'),
    foto_ktp: yup.mixed()
        .test('fileSize', 'File terlalu besar (max 5MB)', (value) => {
            if (typeof value === 'string') return true;
            if (!value) return true;
            return value.size <= 5000000;
        })
        .test('fileType', 'Format file harus JPG/PNG', (value) => {
            if (typeof value === 'string') return true;
            if (!value) return true;
            return ['image/jpeg', 'image/jpg', 'image/png'].includes(value.type);
        })
        .test('requiredOnCreate', 'Foto KTP wajib diupload', function (value) {
            const { isEditing } = this.parent;
            if (isEditing) return true;
            return value !== null && value !== undefined;
        }),
});

// Initial form values
export const DEFAULT_FORM_VALUES = {
    nama: '',
    nomor: '',
    status_penghuni: '',
    status: '',
    foto_ktp: null,
    isEditing: false,
};