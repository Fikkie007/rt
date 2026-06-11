<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class TranUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check();
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'id_data' => 'nullable|integer',
            'tipe' => 'required|string',
            'tipe2' => 'nullable|string',
            'tipe3' => 'nullable|string|in:kebersihan,satpam,lainnya',
            'nama' => 'required_if:tipe,penghuni|string',
            'nomor' => 'required_if:tipe,penghuni|string',
            'status_penghuni' => 'required_if:tipe,penghuni|string',
            'status_bayar' => 'nullable|string',
            'bayar' => 'nullable|numeric|min:0',
            'tanggal' => 'nullable|date',
            'bulan' => 'nullable|integer|min:1|max:12',
            'tahun' => 'nullable|integer|min:2020|max:2030',
            'tanggal_bayar' => 'nullable|date',
            'status' => 'required_if:tipe,penghuni|string',
            'foto_ktp' => 'nullable|file|mimes:jpeg,jpg,png|max:5120', // Optional on update
        ];
    }
}
