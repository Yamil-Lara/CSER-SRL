<?php

namespace App\Repositories;

use App\Models\User;
use App\Models\Proyecto;
use Illuminate\Pagination\LengthAwarePaginator;

class ExploreRepository
{
    public function searchUsers(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $query = User::select([
                'id',
                'nombre',
                'username',
                'foto',
                'profesion',
                'especialidad',
                'ubicacion',
                'universidad',
                'carrera',
                'linkedin',
                'github_perfil',
                'sitio_web',
                'estado',
                'activo',
            ])
            ->where('activo', true)
            ->where('estado', 'aprobado')
            ->where('rol', '!=', 'admin')
            ->withCount(['proyectos' => fn($q) => $q->where('estado', 'aprobado')]);

        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->where('nombre', 'LIKE', "%{$term}%")
                  ->orWhere('profesion', 'LIKE', "%{$term}%")
                  ->orWhere('especialidad', 'LIKE', "%{$term}%")
                  ->orWhere('ubicacion', 'LIKE', "%{$term}%")
                  ->orWhere('carrera', 'LIKE', "%{$term}%")
                  ->orWhere('universidad', 'LIKE', "%{$term}%")
                  ->orWhereHas('skills', function ($sq) use ($term) {
                      $sq->where('name', 'LIKE', "%{$term}%");
                  });
            });
        }

        if (!empty($filters['filter'])) {
            match ($filters['filter']) {
                'profesionales' => $query->whereNotNull('profesion')
                                         ->where('profesion', '!=', ''),
                'estudiantes'   => $query->whereNotNull('universidad')
                                         ->where('universidad', '!=', ''),
                default         => null,
            };
        }

        return $query->latest('id')->paginate($perPage);
    }

    public function searchProjects(array $filters, int $perPage = 12): LengthAwarePaginator
    {
        $query = Proyecto::select([
                'id',
                'titulo',
                'descripcion',
                'tecnologias',
                'imagen',
                'categoria_id',
                'usuario_id',
                'estado',
            ])
            ->where('estado', 'aprobado')
            ->with(['categoria:id,nombre,icono,color', 'usuario:id,nombre,username,foto']);

        // 1. Filtro de categoría (INDEPENDIENTE)
        if (!empty($filters['categoria_id'])) {
            $query->where('categoria_id', $filters['categoria_id']);
        } // <-- Aquí se cierra correctamente

        // 2. Filtro de búsqueda por texto (INDEPENDIENTE)
        if (!empty($filters['search'])) {
            $term = $filters['search'];
            $query->where(function ($q) use ($term) {
                $q->where('titulo', 'LIKE', "%{$term}%")
                  ->orWhere('descripcion', 'LIKE', "%{$term}%")
                  ->orWhere('tecnologias', 'LIKE', "%{$term}%");
            });
        }

        return $query->latest('id')->paginate($perPage);
    }
}
