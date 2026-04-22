<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Comentario extends Model
{
    protected $table = 'comentarios';

    protected $fillable = [
        'proyecto_id',
        'usuario_id',
        'contenido',
        'aprobado',
    ];

    protected $casts = [
        'aprobado'    => 'integer',
        'usuario_id' => 'integer',
    ];

    public function proyecto(): BelongsTo
    {
        return $this->belongsTo(Proyecto::class, 'proyecto_id');
    }

    // CORRECCIÓN: Ahora apunta a User::class
    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function autorEliminado(): bool
    {
        return is_null($this->usuario_id);
    }
}