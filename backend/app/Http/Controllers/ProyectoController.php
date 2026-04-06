<?php

namespace App\Http\Controllers;

use App\Models\Proyecto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProyectoController extends Controller
{
    // Leer: Obtener todos los proyectos (con su categoría y creador)
    public function index(): JsonResponse
    {
        $proyectos = Proyecto::with(['categoria', 'usuario:id,nombre,email,foto'])->get();
        return response()->json($proyectos, 200);
    }

    // Crear: Guardar un nuevo proyecto
    public function store(Request $request): JsonResponse
    {

        $usuario_id = auth()->id();

        $validator = Validator::make($request->all(), [
            'usuario_id'     => 'required|exists:usuarios,id',
            'categoria_id'   => 'required|exists:categorias,id',
            'titulo'         => 'required|string|max:255',
            'descripcion'    => 'required|string',
            'tecnologias'    => 'required|string',
            'herramientas'   => 'nullable|string',
            'imagen'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240', // Máx 10MB
            'github'         => 'nullable|url|max:255',
            'demo'           => 'nullable|url|max:255',
            'cliente'        => 'nullable|string|max:255',
            'fecha_proyecto' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();
        $data['usuario_id'] = $usuario_id;
        $data['estado'] = 'pendiente'; // Regla de negocio: inician pendientes

        // Manejo de la subida de imagen
        if ($request->hasFile('imagen')) {
            $path = $request->file('imagen')->store('proyectos', 'public');
            $data['imagen'] = $path;
        }

        $proyecto = Proyecto::create($data);

        return response()->json([
            'message' => 'Proyecto creado exitosamente',
            'proyecto' => $proyecto
        ], 201);
    }

    // Leer: Obtener un solo proyecto por su ID
    public function show($id): JsonResponse
    {
        $proyecto = Proyecto::with(['categoria', 'usuario:id,nombre,email'])->find($id);

        if (!$proyecto) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        return response()->json($proyecto, 200);
    }

    // Actualizar: Editar un proyecto existente
    public function update(Request $request, $id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        $validator = Validator::make($request->all(), [
            'categoria_id'   => 'sometimes|required|exists:categorias,id',
            'titulo'         => 'sometimes|required|string|max:255',
            'descripcion'    => 'sometimes|required|string',
            'tecnologias'    => 'sometimes|required|string',
            'herramientas'   => 'nullable|string',
            'imagen'         => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'github'         => 'nullable|url|max:255',
            'demo'           => 'nullable|url|max:255',
            'cliente'        => 'nullable|string|max:255',
            'fecha_proyecto' => 'nullable|date',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $validator->validated();

        // Si se sube una nueva imagen, eliminar la anterior del storage
        if ($request->hasFile('imagen')) {
            if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
                Storage::disk('public')->delete($proyecto->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('proyectos', 'public');
        }

        $proyecto->update($data);

        return response()->json([
            'message' => 'Proyecto actualizado exitosamente',
            'proyecto' => $proyecto
        ], 200);
    }

    // Eliminar: Borrar un proyecto y su imagen
    public function destroy($id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return response()->json(['message' => 'Proyecto no encontrado'], 404);
        }

        // Eliminar imagen asociada si existe
        if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
            Storage::disk('public')->delete($proyecto->imagen);
        }

        $proyecto->delete();

        return response()->json(['message' => 'Proyecto eliminado exitosamente'], 200);
    }
}