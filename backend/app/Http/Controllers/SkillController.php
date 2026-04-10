<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Skill\StoreSkillRequest;
use App\Http\Requests\Skill\UpdateSkillRequest;
use App\Services\SkillService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class SkillController extends Controller
{
    use ApiResponseTrait;

    protected $skillService;

    public function __construct(SkillService $skillService)
    {
        $this->skillService = $skillService;
    }

    /**
     * Listar habilidades del usuario autenticado
     */
    public function index(): JsonResponse
    {
        $skills = $this->skillService->getSkillsByUsuario(Auth::id());
        return $this->successResponse($skills, 'Habilidades obtenidas exitosamente');
    }

    /**
     * Crear una nueva habilidad
     */
    public function store(StoreSkillRequest $request): JsonResponse
    {
        try {
            $skill = $this->skillService->createSkill($request->validated());
            return $this->successResponse($skill, 'Habilidad creada exitosamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Ver una habilidad específica
     */
    public function show($id): JsonResponse
    {
        try {
            $skill = $this->skillService->getSkillById($id);
            return $this->successResponse($skill);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Actualizar una habilidad
     */
    public function update(UpdateSkillRequest $request, $id): JsonResponse
    {
        try {
            $skill = $this->skillService->updateSkill($id, $request->validated());
            return $this->successResponse($skill, 'Habilidad actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Eliminar una habilidad
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->skillService->deleteSkill($id);
            return $this->successResponse(null, 'Habilidad eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
