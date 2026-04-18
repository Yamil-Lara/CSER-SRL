<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Comentario\StoreComentarioRequest;
use App\Services\ComentarioService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

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
}
