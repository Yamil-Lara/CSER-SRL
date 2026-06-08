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

    public function createComentario(int $usuarioId, int $proyectoId, string $contenido, ?int $parentId = null): array
    {
        $proyecto = $this->comentarioRepository->findProyectoAprobado($proyectoId);

        if (!$proyecto) {
            throw new \Exception('Proyecto no encontrado o no disponible');
        }

        $isProjectOwner = $proyecto->usuario_id === $usuarioId;

        $comentario = $this->comentarioRepository->create([
            'proyecto_id' => $proyectoId,
            'usuario_id'  => $usuarioId,
            'contenido'   => $contenido,
            'aprobado'    => $isProjectOwner ? 1 : 0,
            'parent_id'   => $parentId,
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
        $userId = \Illuminate\Support\Facades\Auth::id();
        $userInteraction = null;
        if ($userId && $comentario->relationLoaded('interacciones')) {
            $interaction = $comentario->interacciones->firstWhere('usuario_id', $userId);
            if ($interaction) {
                $userInteraction = $interaction->tipo;
            }
        }

        return [
            'id'        => $comentario->id,
            'contenido' => $comentario->contenido,
            'fecha'     => $comentario->created_at->format('d/m/Y H:i'),
            'likes'     => $comentario->likes ?? 0,
            'dislikes'  => $comentario->dislikes ?? 0,
            'user_interaction' => $userInteraction,
            'autor'     => $comentario->usuario ? [
                'id'       => $comentario->usuario->id,
                'nombre'   => $comentario->usuario->nombre,
                'username' => $comentario->usuario->username,
                'foto'     => $comentario->usuario->foto ? $comentario->usuario->foto : null,
            ] : null,
            'respuestas'=> $comentario->relationLoaded('respuestas') && $comentario->respuestas 
                            ? $comentario->respuestas->map(fn($r) => $this->formatComentario($r))->toArray() 
                            : [],
        ];
    }

    // FORMATEADOR EXTENDIDO PARA ADMIN
    private function formatComentarioAdmin($comentario): array
    {
        $formatted = $this->formatComentario($comentario);
        $formatted['aprobado'] = $comentario->aprobado; // Incluye el estado (1 o 2)
        return $formatted;
    }

    // Eliminación de comentario con autorización centralizada via ComentarioPolicy
    public function deleteComentario(int $comentarioId, int $usuarioId): void
    {
        $comentario = $this->comentarioRepository->findById($comentarioId);

        if (!$comentario) {
            throw new \Exception('Comentario no encontrado');
        }

        // Cargar relación proyecto para que la Policy pueda verificar si es dueño del proyecto
        $comentario->load('proyecto');

        // Autorización centralizada mediante ComentarioPolicy
        $user = \App\Models\User::findOrFail($usuarioId);
        if (!\Illuminate\Support\Facades\Gate::forUser($user)->allows('delete', $comentario)) {
            throw new \Exception('No tienes permiso para eliminar este comentario');
        }

        $comentario->delete();
    }
}