<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class DataStoreRequest extends FormRequest
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
            'tipe' => 'nullable|string',
            'nama' => 'required_if:tipe,rumah|nullable|string',
            'alamat' => 'required_if:tipe,rumah|nullable|string',
            'status' => 'required_if:tipe,rumah|nullable|string|in:dihuni,tidak dihuni',
        ];
    }
}
