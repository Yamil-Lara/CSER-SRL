<?php
// app/Repositories/UserRepository.php

namespace App\Repositories;

use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

class UserRepository
{
    protected $model;

    public function __construct(User $model)
    {
        $this->model = $model;
    }

    public function create(array $data): User
    {
        return $this->model->create($data);
    }

    public function find(int $id): ?User
    {
        return $this->model->find($id);
    }

    public function findByEmail(string $email): ?User
    {
        return $this->model->where('email', $email)->first();
    }

    public function update(int $id, array $data): bool
    {
        $user = $this->find($id);
        if (!$user) return false;
        return $user->update($data);
    }

    public function delete(int $id): bool
    {
        $user = $this->find($id);
        if (!$user) return false;
        return $user->delete();
    }

    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->withCount('proyectos')->latest()->paginate($perPage);
    }
}