<?php

namespace App\Policies;

use App\Models\Comentario;
use App\Models\User;

class ComentarioPolicy
{
    /**
     * Determinar si el usuario puede eliminar el comentario.
     * Permitido si es el autor del comentario o el dueño del proyecto.
     */
    public function delete(User $user, Comentario $comentario): bool
    {
        $isAuthor = $comentario->usuario_id === $user->id;
        $isProjectOwner = $comentario->proyecto && $comentario->proyecto->usuario_id === $user->id;

        return $isAuthor || $isProjectOwner;
    }
}
