// Mock data - replace with API calls later
export const mockRumah = [
  {
    id: 1,
    nama: "Rumah A",
    alamat: "Jl. Merdeka No. 1",
    status: "ditempati",
    penghuniCount: 3,
  },
  {
    id: 2,
    nama: "Rumah B",
    alamat: "Jl. Merdeka No. 2",
    status: "kosong",
    penghuniCount: 0,
  },
  {
    id: 3,
    nama: "Rumah C",
    alamat: "Jl. Merdeka No. 3",
    status: "ditempati",
    penghuniCount: 2,
  },
  {
    id: 4,
    nama: "Rumah D",
    alamat: "Jl. Merdeka No. 4",
    status: "renovasi",
    penghuniCount: 0,
  },
];

export const mockPenghuni = [
  { id: 1, nama: "Ahmad", telepon: "08123456789", sejak: "2024-01-15" },
  { id: 2, nama: "Budi", telepon: "08123456790", sejak: "2024-02-20" },
  { id: 3, nama: "Citra", telepon: "08123456791", sejak: "2024-03-10" },
];

export const mockPembayaran = [
  {
    id: 1,
    bulan: "Januari 2024",
    jumlah: 500000,
    status: "lunas",
    tanggal: "2024-01-05",
  },
  {
    id: 2,
    bulan: "Februari 2024",
    jumlah: 500000,
    status: "lunas",
    tanggal: "2024-02-03",
  },
  {
    id: 3,
    bulan: "Maret 2024",
    jumlah: 500000,
    status: "pending",
    tanggal: null,
  },
];
