<?php

namespace App\Services;

use App\Repositories\ExperienceRepository;
use Illuminate\Support\Facades\Auth;

class ExperienceService
{
    protected $experienceRepository;

    public function __construct(ExperienceRepository $experienceRepository)
    {
        $this->experienceRepository = $experienceRepository;
    }

    public function getExperiencesByUser($user)
    {
        return $this->experienceRepository->findByUserId($user->id);
    }

    public function createExperience($user, array $data)
    {
        $data['usuario_id'] = $user->id;
        
        // Validar lógica de fechas
        if ($data['actual'] && $data['fecha_fin']) {
            throw new \Exception('No puede tener fecha de fin si es actual');
        }
        
        if (!$data['actual'] && !$data['fecha_fin']) {
            throw new \Exception('Debe tener fecha de fin si no es actual');
        }

        return $this->experienceRepository->create($data);
    }

    public function updateExperience($user, $id, array $data)
    {
        // Verificar que la experiencia pertenezca al usuario
        $experience = $this->experienceRepository->findOrFail($id);
        
        if ($experience->usuario_id !== $user->id) {
            throw new \Exception('No tienes permiso para modificar esta experiencia');
        }

        // Validar lógica de fechas
        if (isset($data['actual']) && $data['actual'] && isset($data['fecha_fin']) && $data['fecha_fin']) {
            throw new \Exception('No puede tener fecha de fin si es actual');
        }

        return $this->experienceRepository->update($id, $data);
    }

    public function deleteExperience($user, $id)
    {
        // Verificar que la experiencia pertenezca al usuario
        $experience = $this->experienceRepository->findOrFail($id);
        
        if ($experience->usuario_id !== $user->id) {
            throw new \Exception('No tienes permiso para eliminar esta experiencia');
        }

        return $this->experienceRepository->delete($id);
    }
}
