<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Experience\StoreExperienceRequest;
use App\Http\Requests\Experience\UpdateExperienceRequest;
use App\Repositories\ExperienceRepository;
use App\Services\ExperienceService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ExperienceController extends Controller
{
    use ApiResponseTrait;

    protected $experienceService;
    protected $experienceRepository;

    public function __construct(ExperienceService $experienceService, ExperienceRepository $experienceRepository)
    {
        $this->experienceService = $experienceService;
        $this->experienceRepository = $experienceRepository;
    }

    /**
     * Listar experiencias del usuario autenticado
     */
    public function index(): JsonResponse
    {
        $experiences = $this->experienceService->getExperiencesByUser(Auth::user());
        return $this->successResponse($experiences, 'Experiencias obtenidas exitosamente');
    }

    /**
     * Crear una nueva experiencia
     */
    public function store(StoreExperienceRequest $request): JsonResponse
    {
        try {
            $experience = $this->experienceService->createExperience(Auth::user(), $request->validated());
            return $this->successResponse($experience, 'Experiencia creada exitosamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Ver una experiencia específica
     */
    public function show($id): JsonResponse
    {
        try {
            $experience = $this->experienceRepository->findOrFail($id);
            
            // Verificar que pertenezca al usuario
            if ($experience->usuario_id !== Auth::id()) {
                return $this->errorResponse('No tienes permiso para ver esta experiencia', 403);
            }
            
            return $this->successResponse($experience);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 404);
        }
    }

    /**
     * Actualizar una experiencia
     */
    public function update(UpdateExperienceRequest $request, $id): JsonResponse
    {
        try {
            $experience = $this->experienceService->updateExperience(Auth::user(), $id, $request->validated());
            return $this->successResponse($experience, 'Experiencia actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    /**
     * Eliminar una experiencia
     */
    public function destroy($id): JsonResponse
    {
        try {
            $this->experienceService->deleteExperience(Auth::user(), $id);
            return $this->successResponse(null, 'Experiencia eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
