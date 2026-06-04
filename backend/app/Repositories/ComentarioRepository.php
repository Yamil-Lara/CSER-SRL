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
            ->whereNull('parent_id')
            ->with([
                'usuario:id,nombre,username,foto',
                'respuestas.usuario:id,nombre,username,foto',
                'interacciones'
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

    // NUEVAS FUNCIONES PARA EL ADMIN
    public function findById(int $id): ?Comentario
    {
        return Comentario::find($id);
    }

    public function getAllByProyecto(int $proyectoId)
    {
        return Comentario::where('proyecto_id', $proyectoId)
            ->whereNull('parent_id')
            ->with([
                'usuario:id,nombre,username,foto',
                'respuestas.usuario:id,nombre,username,foto',
                'interacciones'
            ])
            ->latest()
            ->get();
    }
}
