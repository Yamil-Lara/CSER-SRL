<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'usuario_id',
        'nombre',
        'tipo',
        'nivel',
        'descripcion',
    ];

    protected $casts = [
        'nivel' => 'integer',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByUsuario($query, $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    public function scopeByTipo($query, $tipo)
    {
        return $query->where('tipo', $tipo);
    }

    public function scopeTecnicas($query)
    {
        return $query->where('tipo', 'tecnica');
    }

    public function scopeBlandas($query)
    {
        return $query->where('tipo', 'blanda');
    }
}
