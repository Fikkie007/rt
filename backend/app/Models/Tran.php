<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tran extends Model
{
    protected $table   = 'tran';
    protected $guarded = [];

    protected $appends = ['foto_ktp', 'bulan_label'];

    protected $casts = [
        'bulan' => 'integer',
        'tahun' => 'integer',
        'bayar' => 'decimal:2',
    ];

    public function rumah()
    {
        return $this->belongsTo(Data::class, 'id_data');
    }

    public function getFotoKtpAttribute()
    {
        return File::where([
            'parent_id' => $this->id,
            'parent_table' => 'tran',
            'nama' => 'ktp'
        ])->value('path') ?? '';
    }

    public function getBulanLabelAttribute(): string
    {
        if (!$this->bulan) {
            return '';
        }

        $months = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember',
        ];

        return $months[$this->bulan] ?? '';
    }

    public function getPeriodeLabelAttribute(): string
    {
        if (!$this->bulan || !$this->tahun) {
            return '';
        }

        return $this->bulan_label . ' ' . $this->tahun;
    }
}
