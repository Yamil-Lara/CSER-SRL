<?php

namespace App\Repositories;

use App\Models\User;
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
}
