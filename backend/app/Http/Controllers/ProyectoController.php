<?php

namespace App\Http\Controllers;

use App\Http\Requests\Proyecto\StoreProyectoRequest;
use App\Http\Requests\Proyecto\UpdateProyectoRequest;
use App\Models\Proyecto;
use App\Traits\ApiResponseTrait;  // <-- AGREGAR
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProyectoController extends Controller
{
    use ApiResponseTrait;  // <-- AGREGAR

    public function index(): JsonResponse
    {
        $proyectos = Proyecto::with(['categoria', 'usuario:id,nombre,email,foto'])
            ->where('estado', 'aprobado')  // <-- AGREGAR filtro
            ->latest()
            ->get();
        
        return $this->successResponse($proyectos, 'Proyectos obtenidos exitosamente');  // <-- CAMBIAR
    }

    public function store(StoreProyectoRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['usuario_id'] = auth()->id();
        $data['estado'] = 'pendiente';

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('proyectos', 'public');
        }

        $proyecto = Proyecto::create($data);

        return $this->successResponse(  // <-- CAMBIAR
            $proyecto->load(['categoria', 'usuario']),
            'Proyecto creado exitosamente',
            201
        );
    }

    public function show($id): JsonResponse
    {
        $proyecto = Proyecto::with(['categoria', 'usuario:id,nombre,email,foto'])
            ->find($id);

        if (!$proyecto) {
            return $this->errorResponse('Proyecto no encontrado', 404);  // <-- CAMBIAR
        }

        return $this->successResponse($proyecto);  // <-- CAMBIAR
    }

    public function update(UpdateProyectoRequest $request, $id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return $this->errorResponse('Proyecto no encontrado', 404);  // <-- CAMBIAR
        }

        $user = auth()->user();
        if ($user->id !== $proyecto->usuario_id && $user->rol !== 'admin') {
            return $this->errorResponse('No tienes permiso para editar este proyecto', 403);  // <-- CAMBIAR
        }

        $data = $request->validated();

        if ($request->hasFile('imagen')) {
            if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
                Storage::disk('public')->delete($proyecto->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('proyectos', 'public');
        }

        $proyecto->update($data);

        return $this->successResponse(  // <-- CAMBIAR
            $proyecto->fresh(['categoria', 'usuario']),
            'Proyecto actualizado exitosamente'
        );
    }

    public function destroy($id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return $this->errorResponse('Proyecto no encontrado', 404);  // <-- CAMBIAR
        }

        $user = auth()->user();
        if ($user->id !== $proyecto->usuario_id && $user->rol !== 'admin') {
            return $this->errorResponse('No tienes permiso para eliminar este proyecto', 403);  // <-- CAMBIAR
        }

        if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
            Storage::disk('public')->delete($proyecto->imagen);
        }

        $proyecto->delete();

        return $this->successResponse(null, 'Proyecto eliminado exitosamente');  // <-- CAMBIAR
    }
}