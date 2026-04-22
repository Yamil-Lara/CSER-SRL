<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comentario\StoreComentarioRequest;
use App\Services\ComentarioService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

class ComentarioController extends Controller
{
    use ApiResponseTrait;

    protected ComentarioService $comentarioService;

    public function __construct(ComentarioService $comentarioService)
    {
        $this->comentarioService = $comentarioService;
    }

    public function index(int $proyectoId): JsonResponse
    {
        try {
            $comentarios = $this->comentarioService->getComentariosByProyecto($proyectoId);
            return $this->successResponse($comentarios, 'Comentarios obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    public function store(StoreComentarioRequest $request, int $proyectoId): JsonResponse
    {
        try {
            $comentario = $this->comentarioService->createComentario(
                Auth::id(),
                $proyectoId,
                $request->validated()['contenido']
            );
            return $this->successResponse($comentario, 'Comentario publicado exitosamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function adminIndex(int $proyectoId): JsonResponse
    {
        try {
            $comentarios = $this->comentarioService->getAllComentariosByProyecto($proyectoId);
            return $this->successResponse($comentarios, 'Comentarios de administración obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    // NUEVO: Controlador para actualizar el estado
    public function updateEstado(Request $request, int $comentarioId): JsonResponse
    {
        // Validamos que el estado solo pueda ser 1 (Aprobado) o 2 (Rechazado)
        $request->validate([
            'aprobado' => 'required|integer|in:1,2'
        ]);

        try {
            $comentario = $this->comentarioService->updateEstadoComentario($comentarioId, $request->aprobado);
            return $this->successResponse($comentario, 'Estado del comentario actualizado');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            // Pasamos el ID del comentario y el ID del usuario autenticado
            $this->comentarioService->deleteComentario($id, Auth::id());
            return $this->successResponse(null, 'Comentario eliminado exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}