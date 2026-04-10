<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proyecto extends Model
{
    protected $table = 'proyectos';

    public const ESTADOS = ['pendiente', 'aprobado', 'rechazado'];

    protected $fillable = [
        'usuario_id',
        'categoria_id',
        'titulo',
        'descripcion',
        'tecnologias',
        'herramientas',
        'imagen',
        'github',
        'demo',
        'cliente',
        'fecha_proyecto',
        'estado',
    ];

    protected $casts = [
        'fecha_proyecto' => 'date',
    ];

    // CORRECCIÓN: Ahora apunta a User::class
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class, 'categoria_id');
    }

    public function comentarios(): HasMany
    {
        return $this->hasMany(Comentario::class, 'proyecto_id');
    }

    public function scopePublicos(Builder $query): Builder
    {
        return $query->where('estado', 'aprobado');
    }

    public function scopePendientes(Builder $query): Builder
    {
        return $query->where('estado', 'pendiente');
    }

    public function estaAprobado(): bool
    {
        return $this->estado === 'aprobado';
    }
}