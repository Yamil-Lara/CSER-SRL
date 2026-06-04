<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comentario\StoreComentarioRequest;
use App\Services\ComentarioService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use App\Models\Comentario;

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
                $request->validated()['contenido'],
                $request->validated()['parent_id'] ?? null
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

    public function like(int $id): JsonResponse
    {
        return $this->handleInteraction($id, 'like');
    }

    public function dislike(int $id): JsonResponse
    {
        return $this->handleInteraction($id, 'dislike');
    }

    private function handleInteraction(int $comentarioId, string $tipo): JsonResponse
    {
        try {
            $userId = Auth::id();
            $comentario = Comentario::findOrFail($comentarioId);

            $interaccion = \App\Models\ComentarioInteraccion::where('comentario_id', $comentarioId)
                ->where('usuario_id', $userId)
                ->first();

            if ($interaccion) {
                if ($interaccion->tipo === $tipo) {
                    // Si ya tenía el mismo tipo, se lo quitamos (toggle off)
                    $interaccion->delete();
                } else {
                    // Si tenía el tipo opuesto, se lo cambiamos
                    $interaccion->update(['tipo' => $tipo]);
                }
            } else {
                // No tenía interacción, creamos una nueva
                \App\Models\ComentarioInteraccion::create([
                    'comentario_id' => $comentarioId,
                    'usuario_id' => $userId,
                    'tipo' => $tipo
                ]);
            }

            // Recalculamos los totales
            $likes = \App\Models\ComentarioInteraccion::where('comentario_id', $comentarioId)->where('tipo', 'like')->count();
            $dislikes = \App\Models\ComentarioInteraccion::where('comentario_id', $comentarioId)->where('tipo', 'dislike')->count();

            $comentario->update([
                'likes' => $likes,
                'dislikes' => $dislikes
            ]);

            return $this->successResponse([
                'likes' => $likes,
                'dislikes' => $dislikes,
                'user_interaction' => \App\Models\ComentarioInteraccion::where('comentario_id', $comentarioId)->where('usuario_id', $userId)->value('tipo')
            ], ucfirst($tipo) . ' procesado');

        } catch (\Exception $e) {
            return $this->errorResponse('Error al procesar la interacción: ' . $e->getMessage(), 400);
        }
    }








 /**
     * Obtener TODOS los comentarios del sistema (para el panel de administración)
     * Esta ruta es exclusiva para administradores FUE AGREGAOD POR EL JAVI XD
     */
    public function adminIndexAll(): JsonResponse
    {
        try {
            $comentarios = Comentario::with([
                'usuario:id,nombre,username,foto',
                'proyecto:id,titulo,usuario_id',
                'proyecto.usuario:id,nombre'
            ])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($comentario) {
                return [
                    'id' => $comentario->id,
                    'contenido' => $comentario->contenido,
                    'fecha' => $comentario->created_at->format('d/m/Y H:i'),
                    'aprobado' => $comentario->aprobado,
                    'autor' => $comentario->usuario ? [
                        'id' => $comentario->usuario->id,
                        'nombre' => $comentario->usuario->nombre,
                        'username' => $comentario->usuario->username,
                        'foto' => $comentario->usuario->foto ? $comentario->usuario->foto : null,
                    ] : null,
                    'proyecto' => $comentario->proyecto ? [
                        'id' => $comentario->proyecto->id,
                        'titulo' => $comentario->proyecto->titulo,
                        'usuario' => $comentario->proyecto->usuario ? [
                            'nombre' => $comentario->proyecto->usuario->nombre
                        ] : null
                    ] : null
                ];
            });

            return $this->successResponse($comentarios, 'Comentarios obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 500);
        }
    }
}





    