<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfertaReclutador extends Model
{
    use HasFactory;

    protected $table = 'oferta_reclutadores';

    protected $fillable = [
        'usuario_id',
        'nombre',
        'empresa',
        'email_contacto',
        'ciudad',
        'pais',
        'titulo_puesto',
        'modalidad',
        'tipo_contrato',
        'salario',
        'tecnologias',
        'mensaje',
        'estado',
        'match_score',
    ];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }
}
