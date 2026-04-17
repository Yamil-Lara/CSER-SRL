<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visibilidad extends Model
{
    use HasFactory;

    protected $table = 'visibilidades';

    protected $fillable = [
        'user_id',
        'proyectos_visible',
        'habilidades_visible',
        'experiencia_visible',
        'redes_visible',
    ];

    protected $casts = [
        'proyectos_visible' => 'boolean',
        'habilidades_visible' => 'boolean',
        'experiencia_visible' => 'boolean',
        'redes_visible' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
