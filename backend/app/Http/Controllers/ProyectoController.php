<?php

namespace App\Http\Controllers;

use App\Http\Requests\Proyecto\StoreProyectoRequest;
use App\Http\Requests\Proyecto\UpdateProyectoRequest;
use App\Models\Proyecto;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProyectoController extends Controller
{
    // Obtener todos los proyectos
    public function index(): JsonResponse
    {
        $proyectos = Proyecto::with(['categoria', 'usuario:id,nombre,email,foto'])
            ->latest()
            ->get();
        
        return response()->json([
            'success' => true,
            'message' => 'Proyectos obtenidos exitosamente',
            'data' => $proyectos
        ]);
    }

    // Crear un nuevo proyecto (usando Form Request)
    public function store(StoreProyectoRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['usuario_id'] = auth()->id();
        $data['estado'] = 'pendiente';

        // Manejo de la subida de imagen
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('proyectos', 'public');
            $data['imagen'] = $path;
        }

        $proyecto = Proyecto::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Proyecto creado exitosamente',
            'data' => $proyecto->load(['categoria', 'usuario'])
        ], 201);
    }

    // Obtener un proyecto por ID
    public function show($id): JsonResponse
    {
        $proyecto = Proyecto::with(['categoria', 'usuario:id,nombre,email,foto'])
            ->find($id);

        if (!$proyecto) {
            return response()->json([
                'success' => false,
                'message' => 'Proyecto no encontrado'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $proyecto
        ]);
    }

    // Actualizar un proyecto (usando Form Request)
    public function update(UpdateProyectoRequest $request, $id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return response()->json([
                'success' => false,
                'message' => 'Proyecto no encontrado'
            ], 404);
        }

        // Verificar permisos (solo dueño o admin)
        $user = auth()->user();
        if ($user->id !== $proyecto->usuario_id && $user->rol !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para editar este proyecto'
            ], 403);
        }

        $data = $request->validated();

        // Manejar nueva imagen
        if ($request->hasFile('imagen')) {
            // Eliminar imagen anterior
            if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
                Storage::disk('public')->delete($proyecto->imagen);
            }
            
            $path = $request->file('imagen')->store('proyectos', 'public');
            $data['imagen'] = $path;
        }

        $proyecto->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Proyecto actualizado exitosamente',
            'data' => $proyecto->fresh(['categoria', 'usuario'])
        ]);
    }

    // Eliminar un proyecto
    public function destroy($id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return response()->json([
                'success' => false,
                'message' => 'Proyecto no encontrado'
            ], 404);
        }

        // Verificar permisos (solo dueño o admin)
        $user = auth()->user();
        if ($user->id !== $proyecto->usuario_id && $user->rol !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'No tienes permiso para eliminar este proyecto'
            ], 403);
        }

        // Eliminar imagen asociada
        if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
            Storage::disk('public')->delete($proyecto->imagen);
        }

        $proyecto->delete();

        return response()->json([
            'success' => true,
            'message' => 'Proyecto eliminado exitosamente'
        ]);
    }
}


