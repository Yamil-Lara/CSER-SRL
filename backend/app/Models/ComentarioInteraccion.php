<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComentarioInteraccion extends Model
{
    use HasFactory;

    protected $table = 'comentario_interacciones';

    protected $fillable = [
        'comentario_id',
        'usuario_id',
        'tipo',
    ];

    public function comentario()
    {
        return $this->belongsTo(Comentario::class, 'comentario_id');
    }

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
