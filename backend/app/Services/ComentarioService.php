<?php

namespace App\Services;

use App\Repositories\ComentarioRepository;

class ComentarioService
{
    protected ComentarioRepository $comentarioRepository;

    public function __construct(ComentarioRepository $comentarioRepository)
    {
        $this->comentarioRepository = $comentarioRepository;
    }

    public function getComentariosByProyecto(int $proyectoId): array
    {
        $proyecto = $this->comentarioRepository->findProyectoAprobado($proyectoId);

        if (!$proyecto) {
            throw new \Exception('Proyecto no encontrado o no disponible');
        }

        $comentarios = $this->comentarioRepository->getAprobadosByProyecto($proyectoId);

        return $comentarios->map(fn($c) => $this->formatComentario($c))->toArray();
    }

    public function createComentario(int $usuarioId, int $proyectoId, string $contenido): array
    {
        $proyecto = $this->comentarioRepository->findProyectoAprobado($proyectoId);

        if (!$proyecto) {
            throw new \Exception('Proyecto no encontrado o no disponible');
        }

        $comentario = $this->comentarioRepository->create([
            'proyecto_id' => $proyectoId,
            'usuario_id'  => $usuarioId,
            'contenido'   => $contenido,
            'aprobado'    => false,
        ]);

        return $this->formatComentario($comentario->load('usuario:id,nombre,username,foto'));
    }

    private function formatComentario($comentario): array
    {
        return [
            'id'        => $comentario->id,
            'contenido' => $comentario->contenido,
            'fecha'     => $comentario->created_at->format('d/m/Y H:i'),
            'autor'     => $comentario->usuario ? [
                'id'       => $comentario->usuario->id,
                'nombre'   => $comentario->usuario->nombre,
                'username' => $comentario->usuario->username,
                'foto'     => $comentario->usuario->foto
                    ? asset('storage/' . $comentario->usuario->foto)
                    : null,
            ] : null,
        ];
    }
}
