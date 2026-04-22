<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConfiguracionVisibilidad extends Model
{
    protected $table = 'configuracion_visibilidad';

    protected $fillable = [
        'usuario_id',
        'mostrar_proyectos',
        'mostrar_habilidades',
        'mostrar_experiencia',
        'mostrar_redes',
    ];

    protected $casts = [
        'mostrar_proyectos' => 'boolean',
        'mostrar_habilidades' => 'boolean',
        'mostrar_experiencia' => 'boolean',
        'mostrar_redes' => 'boolean',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}