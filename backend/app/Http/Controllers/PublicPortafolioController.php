<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Visibilidad;

class PublicPortafolioController extends Controller
{
    public function show($username)
    {
        // Try to load with 'profile' just in case they added it in another commit, 
        // but it'll likely just load the User fields. We include the new 'visibilidad' relation.
        $user = User::where('username', $username)
            ->with(['proyectos', 'skills', 'experiencias', 'visibilidad'])
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Portafolio no encontrado'], 404);
        }

        // Si el usuario no tiene visibilidad configurada, le creamos la default
        if (!$user->visibilidad) {
            $visibilidad = Visibilidad::create([
                'user_id' => $user->id,
                'proyectos_visible' => true,
                'habilidades_visible' => true,
                'experiencia_visible' => true,
                'redes_visible' => true,
            ]);
            $user->setRelation('visibilidad', $visibilidad);
        }

        return response()->json([
            'user' => $user
        ]);
    }

    public function showProject($username, $projectId)
    {
        $user = User::where('username', $username)->firstOrFail();

        // CORRECCIÓN: Usar 'usuario_id' en lugar de 'user_id'
        $proyecto = Proyecto::where('usuario_id', $user->id)
                            ->where('id', $projectId)
                            ->firstOrFail();
        
        return response()->json(['data' => $proyecto]);
    }
}
