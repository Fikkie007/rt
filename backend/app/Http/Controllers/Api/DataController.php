<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\DataStoreRequest;
use App\Http\Requests\DataUpdateRequest;
use App\Models\Data;
use Illuminate\Http\Request;

class DataController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $tipe = $request->tipe;

        abort_if(empty($tipe), 400, 'Parameter tipe wajib diisi');

        $query = Data::whereTipe($tipe);

        // Search filter
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nama', 'like', "%{$search}%")
                    ->orWhere('alamat', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && !empty($request->status)) {
            $statuses = is_array($request->status) ? $request->status : [$request->status];
            $query->whereIn('status', $statuses);
        }

        $data = $query->latest()->paginate();

        return response()->json($data);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(DataStoreRequest $request)
    {
        $validated = $request->validated();

        $data = Data::create($validated);

        return response()->json($data);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $data = Data::findOrFail($id);

        return response()->json($data);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(DataUpdateRequest $request, string $id)
    {
        $data = Data::findOrFail($id);
        $data->fill($request->validated());
        $data->save();

        return response()->json($data);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $data = Data::findOrFail($id);
        $data->delete();

        return response()->noContent();
    }
}
