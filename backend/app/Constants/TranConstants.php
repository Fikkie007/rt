<?php

namespace App\Constants;

class TranConstants
{
    // Iuran types (tipe3)
    const TIPE3_IURAN_KEBERSIHAN = 'kebersihan';
    const TIPE3_IURAN_SATPAM = 'satpam';
    const TIPE3_LAINNYA = 'lainnya';

    const TIPE3_OPTIONS = [
        self::TIPE3_IURAN_KEBERSIHAN => 'Iuran Kebersihan',
        self::TIPE3_IURAN_SATPAM => 'Iuran Satpam',
        self::TIPE3_LAINNYA => 'Lainnya',
    ];

    // Payment type (tipe2)
    const TIPE2_MASUK = 'masuk';
    const TIPE2_KELUAR = 'keluar';

    const TIPE2_OPTIONS = [
        self::TIPE2_MASUK => 'Pemasukan',
        self::TIPE2_KELUAR => 'Pengeluaran',
    ];

    // Payment status
    const STATUS_BAYAR_LUNAS = 'lunas';
    const STATUS_BAYAR_PENDING = 'pending';
    const STATUS_BAYAR_TERLAMBAT = 'terlambat';

    const STATUS_BAYAR_OPTIONS = [
        self::STATUS_BAYAR_LUNAS => 'Lunas',
        self::STATUS_BAYAR_PENDING => 'Pending',
        self::STATUS_BAYAR_TERLAMBAT => 'Terlambat',
    ];

    // Resident status
    const STATUS_PENGHUNI_KONTRAK = 'Kontrak';
    const STATUS_PENGHUNI_TETAP = 'Tetap';
    const STATUS_PENGHUNI_PINDAH = 'Pindah';

    const STATUS_PENGHUNI_OPTIONS = [
        self::STATUS_PENGHUNI_KONTRAK => 'Kontrak',
        self::STATUS_PENGHUNI_TETAP => 'Tetap',
        self::STATUS_PENGHUNI_PINDAH => 'Pindah',
    ];

    // Transaction types (tipe)
    const TIPE_PENGHUNI = 'penghuni';
    const TIPE_BAYAR = 'bayar';

    // Month names in Indonesian
    const BULAN_NAMES = [
        1 => 'Januari',
        2 => 'Februari',
        3 => 'Maret',
        4 => 'April',
        5 => 'Mei',
        6 => 'Juni',
        7 => 'Juli',
        8 => 'Agustus',
        9 => 'September',
        10 => 'Oktober',
        11 => 'November',
        12 => 'Desember',
    ];

    // Default amounts for iuran types (in IDR)
    const DEFAULT_AMOUNT_KEBERSIHAN = 15000;
    const DEFAULT_AMOUNT_SATPAM = 100000;
}
