<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Experience extends Model
{
    use HasFactory;

    protected $table = 'experiencias';

    protected $fillable = [
        'usuario_id',
        'tipo',
        'cargo_titulo',
        'institucion_empresa',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'actual',
    ];

    protected $casts = [
        'actual' => 'boolean',
        'fecha_inicio' => 'date',
        'fecha_fin' => 'date',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
