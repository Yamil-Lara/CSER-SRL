<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Visibilidad;
use Illuminate\Support\Facades\Auth;

class VisibilidadController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $visibilidad = Visibilidad::firstOrCreate(
            ['user_id' => $user->id],
            [
                'proyectos_visible' => true,
                'habilidades_visible' => true,
                'experiencia_visible' => true,
                'redes_visible' => true,
            ]
        );

        return response()->json($visibilidad);
    }

    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'proyectos_visible' => 'boolean',
            'habilidades_visible' => 'boolean',
            'experiencia_visible' => 'boolean',
            'redes_visible' => 'boolean',
        ]);

        $visibilidad = Visibilidad::updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'message' => 'Configuración guardada correctamente',
            'visibilidad' => $visibilidad
        ]);
    }
}
