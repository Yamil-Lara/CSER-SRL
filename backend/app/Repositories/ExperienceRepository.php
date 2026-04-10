<?php

namespace App\Repositories;

use App\Models\Experience;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ExperienceRepository
{
    public function findByUserId(int $userId)
    {
        return Experience::where('usuario_id', $userId)
            ->orderBy('actual', 'desc')
            ->orderBy('fecha_inicio', 'desc')
            ->get();
    }

    public function create(array $data): Experience
    {
        return Experience::create($data);
    }

    public function update(int $id, array $data): Experience
    {
        $experience = $this->findOrFail($id);
        $experience->update($data);
        return $experience->fresh();
    }

    public function delete(int $id): bool
    {
        $experience = $this->findOrFail($id);
        return $experience->delete();
    }

    public function findOrFail(int $id): Experience
    {
        return Experience::findOrFail($id);
    }
}
