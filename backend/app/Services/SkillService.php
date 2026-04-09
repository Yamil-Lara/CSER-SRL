<?php

namespace App\Services;

use App\Repositories\SkillRepository;
use Illuminate\Support\Facades\Auth;

class SkillService
{
    protected $skillRepository;

    public function __construct(SkillRepository $skillRepository)
    {
        $this->skillRepository = $skillRepository;
    }

    public function getSkillsByUsuario($usuarioId)
    {
        return $this->skillRepository->getByUsuario($usuarioId);
    }

    public function getSkillsByUsuarioYTipo($usuarioId, $tipo)
    {
        return $this->skillRepository->getByUsuarioYTipo($usuarioId, $tipo);
    }

    public function createSkill(array $data)
    {
        $usuarioId = Auth::id();
        
        // Validar que no exista duplicado
        if ($this->skillRepository->existsByNombre($usuarioId, $data['nombre'], $data['tipo'])) {
            throw new \Exception('Ya existe una habilidad con ese nombre y tipo');
        }

        // Validar nivel
        if ($data['nivel'] < 1 || $data['nivel'] > 100) {
            throw new \Exception('El nivel debe estar entre 1 y 100');
        }

        // Agregar usuario_id
        $data['usuario_id'] = $usuarioId;

        return $this->skillRepository->create($data);
    }

    public function updateSkill($id, array $data)
    {
        $usuarioId = Auth::id();
        
        // Verificar que la habilidad pertenezca al usuario
        if (!$this->skillRepository->belongsToUsuario($id, $usuarioId)) {
            throw new \Exception('No tienes permiso para modificar esta habilidad');
        }

        // Validar nivel si se proporciona
        if (isset($data['nivel']) && ($data['nivel'] < 1 || $data['nivel'] > 100)) {
            throw new \Exception('El nivel debe estar entre 1 y 100');
        }

        return $this->skillRepository->update($id, $data);
    }

    public function deleteSkill($id)
    {
        $usuarioId = Auth::id();
        
        // Verificar que la habilidad pertenezca al usuario
        if (!$this->skillRepository->belongsToUsuario($id, $usuarioId)) {
            throw new \Exception('No tienes permiso para eliminar esta habilidad');
        }

        return $this->skillRepository->delete($id);
    }

    public function getSkillById($id)
    {
        $skill = $this->skillRepository->findById($id);
        
        if (!$skill) {
            throw new \Exception('Habilidad no encontrada');
        }

        return $skill;
    }

    public function getSkillsTecnicas($usuarioId)
    {
        return $this->skillRepository->getByUsuarioYTipo($usuarioId, 'tecnica');
    }

    public function getSkillsBlandas($usuarioId)
    {
        return $this->skillRepository->getByUsuarioYTipo($usuarioId, 'blanda');
    }
}
