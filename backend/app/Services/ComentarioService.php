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
            'aprobado'    => 0,
        ]);

        return $this->formatComentario($comentario->load('usuario:id,nombre,username,foto'));
    }

    // NUEVO: Obtener todos los comentarios para el admin
    public function getAllComentariosByProyecto(int $proyectoId): array
    {
        $comentarios = $this->comentarioRepository->getAllByProyecto($proyectoId);

        return $comentarios->map(fn($c) => $this->formatComentarioAdmin($c))->toArray();
    }

    // NUEVO: Actualizar el estado (aprobar/rechazar)
    public function updateEstadoComentario(int $comentarioId, int $estado): array
    {
        $comentario = $this->comentarioRepository->findById($comentarioId);

        if (!$comentario) {
            throw new \Exception('Comentario no encontrado');
        }

        $comentario->aprobado = $estado;
        $comentario->save();

        return $this->formatComentarioAdmin($comentario->load('usuario:id,nombre,username,foto'));
    }

    // FORMATEADOR BASE (Solo debe existir una vez)
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
                'foto'     => $comentario->usuario->foto ? $comentario->usuario->foto : null,
            ] : null,
        ];
    }

    // FORMATEADOR EXTENDIDO PARA ADMIN
    private function formatComentarioAdmin($comentario): array
    {
        $formatted = $this->formatComentario($comentario);
        $formatted['aprobado'] = $comentario->aprobado; // Incluye el estado (1 o 2)
        return $formatted;
    }

    // Añade este método dentro de la clase ComentarioService
    public function deleteComentario(int $comentarioId, int $usuarioId): void
    {
        $comentario = $this->comentarioRepository->findById($comentarioId);

        if (!$comentario) {
            throw new \Exception('Comentario no encontrado');
        }

        // Verificamos si es el autor del comentario
        $isAuthor = $comentario->usuario_id === $usuarioId;
        
        // Verificamos si es el dueño del proyecto
        $isProjectOwner = $comentario->proyecto && $comentario->proyecto->usuario_id === $usuarioId;

        if (!$isAuthor && !$isProjectOwner) {
            throw new \Exception('No tienes permiso para eliminar este comentario');
        }

        $comentario->delete();
    }
}