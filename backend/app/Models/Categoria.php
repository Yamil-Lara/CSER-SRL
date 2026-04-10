<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Categoria extends Model
{
    use HasFactory;

    protected $table = 'categorias';

    protected $fillable = [
        'nombre',
        'descripcion',
        'icono',
        'activo',
    ];

    protected $casts = [
        'activo' => 'boolean',
    ];

    public function proyectos(): HasMany
    {
        return $this->hasMany(Proyecto::class);
    }
}
