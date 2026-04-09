<?php

namespace App\Repositories;

use App\Models\Skill;

class SkillRepository
{
    public function getByUsuario($usuarioId)
    {
        return Skill::byUsuario($usuarioId)
            ->with('usuario:id,nombre,email')
            ->orderBy('tipo')
            ->orderBy('nombre')
            ->get();
    }

    public function getByUsuarioYTipo($usuarioId, $tipo)
    {
        return Skill::byUsuario($usuarioId)
            ->byTipo($tipo)
            ->orderBy('nivel', 'desc')
            ->get();
    }

    public function create(array $data)
    {
        return Skill::create($data);
    }

    public function findById($id)
    {
        return Skill::with('usuario:id,nombre,email')->find($id);
    }

    public function update($id, array $data)
    {
        $skill = Skill::find($id);
        if ($skill) {
            $skill->update($data);
            return $skill->fresh();
        }
        return null;
    }

    public function delete($id)
    {
        $skill = Skill::find($id);
        if ($skill) {
            return $skill->delete();
        }
        return false;
    }

    public function existsByNombre($usuarioId, $nombre, $tipo)
    {
        return Skill::where('usuario_id', $usuarioId)
            ->where('nombre', $nombre)
            ->where('tipo', $tipo)
            ->exists();
    }

    public function belongsToUsuario($skillId, $usuarioId)
    {
        return Skill::where('id', $skillId)
            ->where('usuario_id', $usuarioId)
            ->exists();
    }
}
