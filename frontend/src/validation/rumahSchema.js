import * as yup from "yup";

export const rumahSchema = yup.object({
  tipe: yup
    .string()
    .default("rumah"),

  nama: yup
    .string()
    .min(3, "Nama minimal 3 karakter")
    .max(50, "Nama maksimal 50 karakter")
    .required("Nama wajib diisi"),

  alamat: yup
    .string()
    .min(5, "Alamat minimal 5 karakter")
    .max(100, "Alamat maksimal 100 karakter")
    .required("Alamat wajib diisi"),

  status: yup
    .string()
    .oneOf(["dihuni", "tidak dihuni"], "Status tidak valid")
    .required("Status wajib diisi"),
});