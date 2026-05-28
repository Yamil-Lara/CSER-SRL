<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VisitaPortafolio extends Model
{
    use HasFactory;

    protected $table = 'visitas_portafolio';

    protected $fillable = [
        'usuario_id',
        'visitante_id',
        'ip_address',
        'visitado_en',
    ];

    protected $casts = [
        'visitado_en' => 'datetime',
    ];

    /**
     * El usuario dueño del portafolio.
     */
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    /**
     * El usuario que visitó el portafolio (visitante registrado).
     */
    public function visitante(): BelongsTo
    {
        return $this->belongsTo(User::class, 'visitante_id');
    }
}
