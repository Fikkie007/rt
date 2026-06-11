<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Data;
use App\Models\Tran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics.
     */
    public function stats(Request $request)
    {
        $year = $request->input('year', now()->year);

        // Monthly pemasukan/pengeluaran aggregation
        $monthly = DB::table('tran')
            ->selectRaw("
                DATE_FORMAT(tanggal, '%Y-%m') as month,
                SUM(CASE WHEN tipe2 = 'masuk' THEN bayar ELSE 0 END) as pemasukan,
                SUM(CASE WHEN tipe2 = 'keluar' THEN bayar ELSE 0 END) as pengeluaran
            ")
            ->whereYear('tanggal', $year)
            ->where('tipe', 'bayar')
            ->groupByRaw("DATE_FORMAT(tanggal, '%Y-%m')")
            ->orderBy('month')
            ->get()
            ->map(fn($row) => [
                'month' => $row->month,
                'pemasukan' => (float) $row->pemasukan,
                'pengeluaran' => (float) $row->pengeluaran,
            ]);

        // Summary totals
        $totals = DB::table('tran')
            ->whereYear('tanggal', $year)
            ->where('tipe', 'bayar')
            ->selectRaw("
                SUM(CASE WHEN tipe2 = 'masuk' THEN bayar ELSE 0 END) as total_pemasukan,
                SUM(CASE WHEN tipe2 = 'keluar' THEN bayar ELSE 0 END) as total_pengeluaran
            ")
            ->first();

        // Payment status breakdown
        $paymentStatus = DB::table('tran')
            ->selectRaw("
                status_bayar,
                COUNT(*) as count,
                SUM(bayar) as total
            ")
            ->whereYear('tanggal', $year)
            ->where('tipe', 'bayar')
            ->whereNotNull('status_bayar')
            ->groupBy('status_bayar')
            ->get()
            ->map(fn($row) => [
                'status' => $row->status_bayar,
                'count' => (int) $row->count,
                'total' => (float) $row->total,
            ]);

        // Count queries
        $jumlahRumah = Data::where('tipe', 'rumah')->count();
        $jumlahRumahDihuni = Data::where('tipe', 'rumah')->where('status', 'dihuni')->count();
        $jumlahPenghuniAktif = Tran::where('tipe', 'penghuni')
            ->where('status_penghuni', '<>', 'Pindah')
            ->count();

        $pembayaranTertunda = Tran::where('tipe', 'bayar')
            ->where('status_bayar', 'pending')
            ->whereYear('tanggal', $year)
            ->count();

        $pembayaranTerlambat = Tran::where('tipe', 'bayar')
            ->where('status_bayar', 'terlambat')
            ->whereYear('tanggal', $year)
            ->count();

        $pemasukan = (float) ($totals->total_pemasukan ?? 0);
        $pengeluaran = (float) ($totals->total_pengeluaran ?? 0);

        // Iuran summary per type
        $iuranPerTipe = DB::table('tran')
            ->selectRaw("
                tipe3,
                SUM(bayar) as total_bayar,
                SUM(CASE WHEN status_bayar = 'lunas' THEN bayar ELSE 0 END) as total_lunas,
                SUM(CASE WHEN status_bayar = 'lunas' THEN 1 ELSE 0 END) as lunas_count,
                SUM(CASE WHEN status_bayar = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN status_bayar = 'terlambat' THEN 1 ELSE 0 END) as terlambat_count
            ")
            ->where('tahun', $year)
            ->where('tipe', 'bayar')
            ->where('tipe2', 'masuk')
            ->whereIn('tipe3', ['kebersihan', 'satpam'])
            ->groupBy('tipe3')
            ->get()
            ->map(fn($row) => [
                'tipe3' => $row->tipe3,
                'total_bayar' => (float) $row->total_bayar,
                'total_lunas' => (float) $row->total_lunas,
                'lunas_count' => (int) $row->lunas_count,
                'pending_count' => (int) $row->pending_count,
                'terlambat_count' => (int) $row->terlambat_count,
            ]);

        // Iuran monthly breakdown
        $iuranMonthly = DB::table('tran')
            ->selectRaw("
                bulan,
                tipe3,
                SUM(bayar) as total,
                SUM(CASE WHEN status_bayar = 'lunas' THEN bayar ELSE 0 END) as total_lunas,
                SUM(CASE WHEN status_bayar = 'lunas' THEN 1 ELSE 0 END) as lunas_count,
                COUNT(*) as total_records
            ")
            ->where('tahun', $year)
            ->where('tipe', 'bayar')
            ->where('tipe2', 'masuk')
            ->whereIn('tipe3', ['kebersihan', 'satpam'])
            ->groupBy('bulan', 'tipe3')
            ->orderBy('bulan')
            ->get()
            ->map(fn($row) => [
                'bulan' => (int) $row->bulan,
                'tipe3' => $row->tipe3,
                'total' => (float) $row->total,
                'total_lunas' => (float) $row->total_lunas,
                'lunas_count' => (int) $row->lunas_count,
                'total_records' => (int) $row->total_records,
            ]);

        $iuranData = [
            'per_tipe' => $iuranPerTipe,
            'monthly' => $iuranMonthly,
        ];

        return response()->json([
            'summary' => [
                'total_pemasukan' => $pemasukan,
                'total_pengeluaran' => $pengeluaran,
                'saldo' => $pemasukan - $pengeluaran,
                'jumlah_rumah' => $jumlahRumah,
                'jumlah_rumah_dihuni' => $jumlahRumahDihuni,
                'jumlah_penghuni_aktif' => $jumlahPenghuniAktif,
                'pembayaran_tertunda' => $pembayaranTertunda,
                'pembayaran_terlambat' => $pembayaranTerlambat,
            ],
            'monthly' => $monthly,
            'payment_status_breakdown' => $paymentStatus,
            'iuran' => $iuranData,
        ]);
    }
}