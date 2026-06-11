<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class IuranBatchRequest extends FormRequest
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
            'id_data' => 'required|integer|exists:data,id',
            'tipe3' => 'required|string|in:kebersihan,satpam',
            'bulan_dari' => 'required|integer|min:1|max:12',
            'bulan_sampai' => 'required|integer|min:1|max:12|gte:bulan_dari',
            'tahun' => 'required|integer|min:2020|max:2030',
            'bayar_per_bulan' => 'required|numeric|min:0',
            'status_bayar' => 'required|string|in:lunas,pending,terlambat',
            'tanggal_bayar' => 'nullable|date',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'id_data.required' => 'Rumah wajib dipilih',
            'id_data.exists' => 'Rumah tidak ditemukan',
            'tipe3.required' => 'Tipe iuran wajib dipilih',
            'tipe3.in' => 'Tipe iuran harus kebersihan atau satpam',
            'bulan_dari.required' => 'Bulan awal wajib dipilih',
            'bulan_sampai.required' => 'Bulan akhir wajib dipilih',
            'bulan_sampai.gte' => 'Bulan akhir harus lebih besar atau sama dengan bulan awal',
            'tahun.required' => 'Tahun wajib diisi',
            'bayar_per_bulan.required' => 'Jumlah per bulan wajib diisi',
            'bayar_per_bulan.min' => 'Jumlah per bulan minimal 0',
            'status_bayar.required' => 'Status bayar wajib dipilih',
            'status_bayar.in' => 'Status bayar harus lunas, pending, atau terlambat',
        ];
    }
}