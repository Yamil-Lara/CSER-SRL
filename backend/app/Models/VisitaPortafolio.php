<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitaPortafolio extends Model
{
    protected $table = 'visitas_portafolio';

    protected $fillable = [
        'usuario_id',
        'ip_address',
        'visitado_en',
    ];

    protected $casts = [
        'visitado_en' => 'datetime',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}