<?php

namespace App\Services;

use App\Repositories\ExploreRepository;
use Illuminate\Pagination\LengthAwarePaginator;

class ExploreService
{
    protected ExploreRepository $exploreRepository;

    public function __construct(ExploreRepository $exploreRepository)
    {
        $this->exploreRepository = $exploreRepository;
    }

    public function searchUsers(array $filters): LengthAwarePaginator
    {
        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 12;

        $paginator = $this->exploreRepository->searchUsers($filters, $perPage);

        $paginator->getCollection()->transform(function ($user) {
            return $this->formatUserCard($user);
        });

        return $paginator;
    }

    private function formatUserCard($user): array
    {
        return [
            'id'               => $user->id,
            'nombre'           => $user->nombre,
            'username'         => $user->username,
            'foto'             => $user->foto ? asset('storage/' . $user->foto) : null,
            'profesion'        => $user->profesion,
            'especialidad'     => $user->especialidad,
            'ubicacion'        => $user->ubicacion,
            'universidad'      => $user->universidad,
            'carrera'          => $user->carrera,
            'proyectos_count'  => $user->proyectos_count,
            'tiene_linkedin'   => !empty($user->linkedin),
            'tiene_github'     => !empty($user->github_perfil),
            'tiene_sitio_web'  => !empty($user->sitio_web),
            'tipo_perfil'      => $this->resolveTipoPerfil($user),
        ];
    }

    private function resolveTipoPerfil($user): string
    {
        if (!empty($user->profesion)) {
            return 'profesional';
        }

        if (!empty($user->universidad)) {
            return 'estudiante';
        }

        return 'general';
    }

    public function searchProjects(array $filters): LengthAwarePaginator
    {
        $perPage = isset($filters['per_page']) ? (int) $filters['per_page'] : 12;

        $paginator = $this->exploreRepository->searchProjects($filters, $perPage);

        $paginator->getCollection()->transform(function ($proyecto) {
            return $this->formatProjectCard($proyecto);
        });

        return $paginator;
    }

    private function formatProjectCard($proyecto): array
    {
        return [
            'id' => $proyecto->id,
            'titulo' => $proyecto->titulo,
            'descripcion' => $proyecto->descripcion,
            'tecnologias' => $proyecto->tecnologias,
            'imagen' => $proyecto->imagen ? asset('storage/' . $proyecto->imagen) : null,
            'categoria' => $proyecto->categoria ? [
                'id' => $proyecto->categoria->id,
                'nombre' => $proyecto->categoria->nombre,
                'icono' => $proyecto->categoria->icono,
                'color' => $proyecto->categoria->color,
            ] : null,
            'autor' => $proyecto->usuario ? [
                'id' => $proyecto->usuario->id,
                'nombre' => $proyecto->usuario->nombre,
                'username' => $proyecto->usuario->username,
                'foto' => $proyecto->usuario->foto ? asset('storage/' . $proyecto->usuario->foto) : null,
            ] : null,
        ];
    }
}