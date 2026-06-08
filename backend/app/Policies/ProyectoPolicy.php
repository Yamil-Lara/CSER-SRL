<?php

namespace App\Policies;

use App\Models\Proyecto;
use App\Models\User;

class ProyectoPolicy
{
    /**
     * Determinar si el usuario puede actualizar el proyecto.
     */
    public function update(User $user, Proyecto $proyecto): bool
    {
        return $user->id === $proyecto->usuario_id || $user->rol === 'admin';
    }

    /**
     * Determinar si el usuario puede eliminar el proyecto.
     */
    public function delete(User $user, Proyecto $proyecto): bool
    {
        return $user->id === $proyecto->usuario_id || $user->rol === 'admin';
    }
}
