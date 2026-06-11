import * as yup from "yup";

export const STATUS_BAYAR_OPTIONS = [
  { value: "lunas", label: "Lunas" },
  { value: "pending", label: "Pending" },
  { value: "terlambat", label: "Terlambat" },
];

export const TIPE2 = [
  { value: "masuk", label: "Pemasukan" },
  { value: "keluar", label: "Pengeluaran" },
];

// Iuran type options (tipe3)
export const TIPE3_OPTIONS = [
  { value: "kebersihan", label: "Iuran Kebersihan", defaultAmount: 15000 },
  { value: "satpam", label: "Iuran Satpam", defaultAmount: 100000 },
  { value: "lainnya", label: "Lainnya", defaultAmount: 0 },
];

// Month options (bulan)
export const BULAN_OPTIONS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

export const pembayaranSchema = yup.object({
  id_data: yup
    .number()
    .transform((value, originalValue) => {
      return originalValue === "" ||
        originalValue === null ||
        originalValue === undefined
        ? undefined
        : value;
    })
    .when("tipe2", {
      is: "masuk",
      then: (schema) => schema.required("Rumah wajib dipilih"),
      otherwise: (schema) => schema.optional(),
    }),
  nama: yup.string().typeError("Nama wajib diisi").required("Nama wajib diisi"),
  tanggal: yup.string().required("Tanggal wajib diisi"),
  bayar: yup
    .number()
    .typeError("Jumlah harus berupa angka")
    .min(0, "Jumlah minimal 0")
    .required("Jumlah wajib diisi"),
  status_bayar: yup
    .string()
    .oneOf(
      STATUS_BAYAR_OPTIONS.map((o) => o.value),
      "Status tidak valid",
    )
    .required("Status wajib dipilih"),
  tipe2: yup
    .string()
    .oneOf(
      TIPE2.map((o) => o.value),
      "Tipe tidak valid",
    )
    .required("Tipe wajib dipilih"),
});

export const DEFAULT_FORM_VALUES = {
  id_data: "",
  tipe2: "masuk",
  nama: "",
  tanggal: new Date().toISOString().split("T")[0],
  bayar: "",
  status_bayar: "pending",
};

// Iuran schema for single-month payment
export const iuranSchema = yup.object({
  id_data: yup.number().required("Rumah wajib dipilih"),
  tipe3: yup.string().required("Tipe iuran wajib dipilih"),
  bulan: yup.number().min(1).max(12).required("Bulan wajib dipilih"),
  tahun: yup.number().min(2020).max(2030).required("Tahun wajib diisi"),
  bayar: yup
    .number()
    .typeError("Jumlah harus berupa angka")
    .min(0, "Jumlah minimal 0")
    .required("Jumlah wajib diisi"),
  status_bayar: yup
    .string()
    .oneOf(
      STATUS_BAYAR_OPTIONS.map((o) => o.value),
      "Status tidak valid",
    )
    .required("Status wajib dipilih"),
  tanggal_bayar: yup.string().nullable(),
});

// Iuran batch schema for multi-month payment
export const iuranBatchSchema = yup.object({
  id_data: yup.number().required("Rumah wajib dipilih"),
  tipe3: yup.string().required("Tipe iuran wajib dipilih"),
  bulan_dari: yup.number().min(1).max(12).required("Bulan awal wajib dipilih"),
  bulan_sampai: yup
    .number()
    .min(1)
    .max(12)
    .required("Bulan akhir wajib dipilih")
    .test(
      "gte-bulan-dari",
      "Bulan akhir harus lebih besar atau sama dengan bulan awal",
      (val, ctx) => val >= ctx.parent.bulan_dari,
    ),
  tahun: yup.number().min(2020).max(2030).required("Tahun wajib diisi"),
  bayar_per_bulan: yup
    .number()
    .typeError("Jumlah harus berupa angka")
    .min(0, "Jumlah minimal 0")
    .required("Jumlah per bulan wajib diisi"),
  status_bayar: yup
    .string()
    .oneOf(
      STATUS_BAYAR_OPTIONS.map((o) => o.value),
      "Status tidak valid",
    )
    .required("Status wajib dipilih"),
  tanggal_bayar: yup.string().nullable(),
});

// Default values for iuran form
export const DEFAULT_IURAN_FORM_VALUES = {
  id_data: "",
  tipe3: "kebersihan",
  bulan: new Date().getMonth() + 1,
  tahun: new Date().getFullYear(),
  bayar: 15000,
  status_bayar: "lunas",
  tanggal_bayar: new Date().toISOString().split("T")[0],
};

// Default values for iuran batch form
export const DEFAULT_IURAN_BATCH_FORM_VALUES = {
  id_data: "",
  tipe3: "kebersihan",
  bulan_dari: 1,
  bulan_sampai: 12,
  tahun: new Date().getFullYear(),
  bayar_per_bulan: 15000,
  status_bayar: "lunas",
  tanggal_bayar: new Date().toISOString().split("T")[0],
};

// Helper to get default amount for tipe3
export const getDefaultAmountForTipe3 = (tipe3) => {
  const option = TIPE3_OPTIONS.find((o) => o.value === tipe3);
  return option?.defaultAmount || 0;
};
