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
        'name',
        'type',
        'level',
    ];

    protected $casts = [
        'level' => 'integer',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeByUsuario($query, $usuarioId)
    {
        return $query->where('usuario_id', $usuarioId);
    }

    public function scopeByType($query, $type)
    {
        return $query->where('type', $type);
    }

    public function scopeTecnicas($query)
    {
        return $query->where('type', 'tecnica');
    }

    public function scopeBlandas($query)
    {
        return $query->where('type', 'blanda');
    }
}
