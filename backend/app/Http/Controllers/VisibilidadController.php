<?php

namespace App\Http\Controllers;

use App\Models\ConfiguracionVisibilidad;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class VisibilidadController extends Controller
{
    use ApiResponseTrait;

    /**
     * Obtener la configuración de visibilidad del usuario autenticado
     */
    public function show(Request $request)
    {
        $usuario = $request->user();
        
        $config = ConfiguracionVisibilidad::where('usuario_id', $usuario->id)->first();
        
        // Si no existe configuración, devolver valores por defecto
        if (!$config) {
            return $this->successResponse([
                'mostrar_proyectos' => true,
                'mostrar_habilidades' => true,
                'mostrar_experiencia' => true,
                'mostrar_redes' => true,
            ]);
        }
        
        return $this->successResponse($config);
    }

    /**
     * Guardar la configuración de visibilidad del usuario autenticado
     */
    public function update(Request $request)
    {
        $validated = $request->validate([
            'mostrar_proyectos' => 'sometimes|boolean',
            'mostrar_habilidades' => 'sometimes|boolean',
            'mostrar_experiencia' => 'sometimes|boolean',
            'mostrar_redes' => 'sometimes|boolean',
        ]);

        $config = ConfiguracionVisibilidad::updateOrCreate(
            ['usuario_id' => $request->user()->id],
            $validated
        );

        return $this->successResponse($config, 'Configuración guardada correctamente');
    }
}