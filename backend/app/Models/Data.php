<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Data extends Model
{

    protected $guarded = [];
    protected $appends = ['jumlah_penghuni'];

    public function penghuni()
    {
        return $this
            ->hasMany(Tran::class, 'id_data')
            ->where('tipe', 'penghuni')
            ->where('status_penghuni', '<>', 'Pindah');
    }

    public function getJumlahPenghuniAttribute(): int
    {
        return $this->penghuni()->count() ?? 0;
    }
}
