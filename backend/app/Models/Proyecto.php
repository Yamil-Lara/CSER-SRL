<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proyecto extends Model
{
    use HasFactory;

    protected $table = 'proyectos';

    protected $fillable = [
        'user_id',
        'categoria_id',
        'titulo',
        'descripcion',
        'tecnologias',
        'herramientas',
        'imagen',
        'url_github',
        'url_demo',
        'cliente',
        'fecha_proyecto',
        'publicado',
        'activo',
    ];

    protected $casts = [
        'tecnologias'    => 'array',
        'herramientas'   => 'array',
        'fecha_proyecto' => 'date',
        'publicado'      => 'boolean',
        'activo'         => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class);
    }
}