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
use Illuminate\Support\Facades\Storage;

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
            $data = $request->validated();
            
            // GUARDAR LA IMAGEN SI EXISTE
            if ($request->hasFile('imagen')) {
                $data['imagen'] = $request->file('imagen')->store('formacion', 'public');
            }

            $experience = $this->experienceService->createExperience(Auth::user(), $data);
            return $this->successResponse($experience, 'Experiencia creada exitosamente', 201);
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function update(UpdateExperienceRequest $request, $id): JsonResponse
    {
        try {
            $data = $request->validated();
            // Necesitas el ExperienceRepository (asegúrate de que esté inyectado en el constructor, si no, usa el modelo Experience::findOrFail)
            $experienceOld = $this->experienceRepository->findOrFail($id);
            
            // 1. SI SE ENVÍA UNA IMAGEN NUEVA
            if ($request->hasFile('imagen')) {
                if ($experienceOld->imagen && Storage::disk('public')->exists($experienceOld->imagen)) {
                    Storage::disk('public')->delete($experienceOld->imagen);
                }
                $data['imagen'] = $request->file('imagen')->store('formacion', 'public');
            } 
            // 2. NUEVO: SI EL USUARIO HIZO CLIC EN LA 'X'
            elseif (isset($data['eliminar_imagen']) && $data['eliminar_imagen']) {
                if ($experienceOld->imagen && Storage::disk('public')->exists($experienceOld->imagen)) {
                    Storage::disk('public')->delete($experienceOld->imagen);
                }
                $data['imagen'] = null; // Le indicamos a la base de datos que borre el registro
            }

            // Limpiamos la bandera del array de datos para que no intente guardarse en una columna de la base de datos
            unset($data['eliminar_imagen']);

            $experience = $this->experienceService->updateExperience(Auth::user(), $id, $data);
            return $this->successResponse($experience, 'Experiencia actualizada exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $experience = $this->experienceRepository->findOrFail($id);
            
            // ELIMINAR LA IMAGEN ASOCIADA ANTES DE BORRAR LA EXPERIENCIA
            if ($experience->imagen && Storage::disk('public')->exists($experience->imagen)) {
                Storage::disk('public')->delete($experience->imagen);
            }
            
            $this->experienceService->deleteExperience(Auth::user(), $id);
            return $this->successResponse(null, 'Experiencia eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}