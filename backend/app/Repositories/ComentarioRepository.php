<?php

namespace App\Repositories;

use App\Models\Comentario;
use App\Models\Proyecto;

class ComentarioRepository
{
    public function getAprobadosByProyecto(int $proyectoId)
    {
        return Comentario::where('proyecto_id', $proyectoId)
            ->where('aprobado', true)
            ->with([
                'usuario:id,nombre,username,foto',
            ])
            ->latest()
            ->get();
    }

    public function create(array $data): Comentario
    {
        return Comentario::create($data);
    }

    public function findProyectoAprobado(int $proyectoId): ?Proyecto
    {
        return Proyecto::where('id', $proyectoId)
            ->where('estado', 'aprobado')
            ->first();
    }
    
    public function getAllByProyecto(int $proyectoId)
    {
        return Comentario::where('proyecto_id', $proyectoId)
            ->with(['usuario:id,nombre,username,foto'])
            ->latest()
            ->get();
    }

    // NUEVO: Buscar un comentario por su ID
    public function findById(int $comentarioId): ?Comentario
    {
        // Cargamos la relación 'proyecto' para verificar al dueño
        return Comentario::with('proyecto')->find($comentarioId);
    }
}
