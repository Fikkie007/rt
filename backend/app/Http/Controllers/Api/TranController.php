<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\IuranBatchRequest;
use App\Http\Requests\TranStoreRequest;
use App\Http\Requests\TranUpdateRequest;
use App\Models\Data;
use App\Models\File;
use App\Models\Tran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class TranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Tran::query()->with('rumah');

        // Filter by tipe (e.g., 'bayar' or 'penghuni')
        if ($request->has('tipe') && !empty($request->tipe)) {
            $query->where('tipe', $request->tipe);
        }

        // Filter by tipe2 (e.g., 'keluar' or 'masuk')
        if ($request->has('tipe2') && !empty($request->tipe2)) {
            $query->where('tipe2', $request->tipe2);
        }

        // Filter by tipe3 (e.g., 'kebersihan', 'satpam', 'lainnya')
        if ($request->has('tipe3') && !empty($request->tipe3)) {
            $query->where('tipe3', $request->tipe3);
        }

        // Filter by id_data (existing)
        if ($request->has('id_data') && !empty($request->id_data)) {
            $query->where('id_data', $request->id_data);
        }

        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where('nama', 'like', "%{$search}%");
        }

        // Date range filter on tanggal
        if ($request->has('tanggal_from') && !empty($request->tanggal_from)) {
            $query->whereDate('tanggal', '>=', $request->tanggal_from);
        }
        if ($request->has('tanggal_to') && !empty($request->tanggal_to)) {
            $query->whereDate('tanggal', '<=', $request->tanggal_to);
        }

        // Filter by bulan (month)
        if ($request->has('bulan') && !empty($request->bulan)) {
            $query->where('bulan', $request->bulan);
        }

        // Filter by tahun (year)
        if ($request->has('tahun') && !empty($request->tahun)) {
            $query->where('tahun', $request->tahun);
        }

        // Status filter
        if ($request->has('status_bayar') && !empty($request->status_bayar)) {
            $statuses = is_array($request->status_bayar) ? $request->status_bayar : [$request->status_bayar];
            $query->whereIn('status_bayar', $statuses);
        }

        $data = $query->latest()->paginate();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(TranStoreRequest $request)
    {
        $validated = $request->validated();

        $fotoKtp = $request->file('foto_ktp');
        unset($validated['foto_ktp']);

        $tran = Tran::create($validated);

        if ($fotoKtp) {
            $path = $fotoKtp->store('ktp', 'public');

            File::create([
                'parent_id' => $tran->id,
                'parent_table' => 'tran',
                'nama' => 'ktp',
                'path' => $path,
            ]);
        }

        return response()->json($tran);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TranUpdateRequest $request, string $id)
    {
        $tran = Tran::findOrFail($id);

        $validated = $request->validated();

        $fotoKtp = $request->file('foto_ktp');
        unset($validated['foto_ktp']);

        $tran->update($validated);

        if ($fotoKtp) {
            $existingFile = File::where([
                'parent_id' => $tran->id,
                'parent_table' => 'tran',
                'nama' => 'ktp'
            ])->first();

            if ($existingFile && Storage::disk('public')->exists($existingFile->path)) {
                Storage::disk('public')->delete($existingFile->path);
            }

            $path = $fotoKtp->store('ktp', 'public');

            if ($existingFile) {
                $existingFile->update(['path' => $path]);
            } else {
                File::create([
                    'parent_id' => $tran->id,
                    'parent_table' => 'tran',
                    'nama' => 'ktp',
                    'path' => $path,
                ]);
            }
        }

        return response()->json($tran);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Tran::findOrFail($id);
        $data->delete();

        return response()->noContent();
    }

    /**
     * Batch create/update iuran records (multi-month payment).
     */
    public function batchIuran(IuranBatchRequest $request)
    {
        $validated = $request->validated();

        $records = [];
        $bulanDari = $validated['bulan_dari'];
        $bulanSampai = $validated['bulan_sampai'];
        $tahun = $validated['tahun'];
        $idData = $validated['id_data'];
        $tipe3 = $validated['tipe3'];
        $bayarPerBulan = $validated['bayar_per_bulan'];
        $statusBayar = $validated['status_bayar'];
        $tanggalBayar = $validated['tanggal_bayar'] ?? now()->toDateString();

        // Get rumah nama for nama field
        $rumah = Data::find($idData);
        $namaBase = $tipe3 === 'kebersihan' ? 'Iuran Kebersihan' : 'Iuran Satpam';
        $namaRumah = $rumah ? $rumah->nama : '';

        for ($b = $bulanDari; $b <= $bulanSampai; $b++) {
            $nama = "{$namaBase} - {$namaRumah} - Bulan {$b}";

            $records[] = Tran::updateOrCreate(
                [
                    'id_data' => $idData,
                    'tipe' => 'bayar',
                    'tipe2' => 'masuk',
                    'tipe3' => $tipe3,
                    'bulan' => $b,
                    'tahun' => $tahun,
                ],
                [
                    'nama' => $nama,
                    'bayar' => $bayarPerBulan,
                    'status_bayar' => $statusBayar,
                    'tanggal' => $tanggalBayar,
                    'tanggal_bayar' => $tanggalBayar,
                ]
            );
        }

        return response()->json([
            'message' => 'Iuran berhasil disimpan',
            'data' => $records,
            'count' => count($records),
        ]);
    }

    /**
     * Get iuran summary for dashboard.
     */
    public function iuranSummary(Request $request)
    {
        $tahun = $request->input('tahun', now()->year);

        // Per-type totals
        $perTipe = DB::table('tran')
            ->selectRaw("
                tipe3,
                SUM(bayar) as total_bayar,
                COUNT(*) as total_records,
                SUM(CASE WHEN status_bayar = 'lunas' THEN bayar ELSE 0 END) as total_lunas,
                SUM(CASE WHEN status_bayar = 'lunas' THEN 1 ELSE 0 END) as lunas_count,
                SUM(CASE WHEN status_bayar = 'pending' THEN 1 ELSE 0 END) as pending_count,
                SUM(CASE WHEN status_bayar = 'terlambat' THEN 1 ELSE 0 END) as terlambat_count
            ")
            ->where('tahun', $tahun)
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

        // Monthly breakdown per type
        $monthly = DB::table('tran')
            ->selectRaw("
                bulan,
                tipe3,
                SUM(bayar) as total,
                SUM(CASE WHEN status_bayar = 'lunas' THEN bayar ELSE 0 END) as total_lunas,
                COUNT(*) as total_records,
                SUM(CASE WHEN status_bayar = 'lunas' THEN 1 ELSE 0 END) as lunas_count
            ")
            ->where('tahun', $tahun)
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
            ]);

        // Unpaid houses per month per type
        $rumahCount = Data::where('tipe', 'rumah')->where('status', 'dihuni')->count();
        $unpaidPerMonth = [];

        for ($b = 1; $b <= 12; $b++) {
            foreach (['kebersihan', 'satpam'] as $tipe) {
                $paid = Tran::where('tahun', $tahun)
                    ->where('bulan', $b)
                    ->where('tipe', 'bayar')
                    ->where('tipe2', 'masuk')
                    ->where('tipe3', $tipe)
                    ->where('status_bayar', 'lunas')
                    ->count();

                $unpaidPerMonth[] = [
                    'bulan' => $b,
                    'tipe3' => $tipe,
                    'paid' => $paid,
                    'unpaid' => $rumahCount - $paid,
                    'total_houses' => $rumahCount,
                ];
            }
        }

        return response()->json([
            'per_tipe' => $perTipe,
            'monthly' => $monthly,
            'unpaid_per_month' => $unpaidPerMonth,
            'tahun' => (int) $tahun,
            'total_rumah_dihuni' => $rumahCount,
        ]);
    }

    /**
     * Serve KTP file securely.
     */
    public function serveKtp(string $path)
    {
        // Ensure path is within ktp directory
        $fullPath = 'ktp/' . $path;

        if (!Storage::disk('public')->exists($fullPath)) {
            return response()->json(['message' => 'File not found'], 404);
        }

        $file = Storage::disk('public')->get($fullPath);
        $mimeType = Storage::disk('public')->mimeType($fullPath);

        return response($file, 200)->header('Content-Type', $mimeType);
    }
}
