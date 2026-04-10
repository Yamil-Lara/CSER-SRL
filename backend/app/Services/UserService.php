<?php
// app/Services/UserService.php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class UserService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function getProfile(User $user): array
    {
        return [
            'id' => $user->id,
            'nombre' => $user->nombre,
            'username' => $user->username,
            'email' => $user->email,
            'rol' => $user->rol,
            'foto' => $user->foto ? asset('storage/' . $user->foto) : null,
            'profesion' => $user->profesion,
            'especialidad' => $user->especialidad,
            'biografia' => $user->biografia,
            'ubicacion' => $user->ubicacion,
            'linkedin' => $user->linkedin,
            'github_perfil' => $user->github_perfil,
            'sitio_web' => $user->sitio_web,
            'universidad' => $user->universidad,
            'carrera' => $user->carrera,
            'nivel_estudios' => $user->nivel_estudios,
            'created_at' => $user->created_at,
        ];
    }

    public function updateProfile(User $user, array $data, $photo = null): array
    {
        if (isset($data['password']) && $data['password']) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        if ($photo) {
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }
            $data['foto'] = $photo->store('perfiles', 'public');
        }

        $user->update($data);

        return ['success' => true, 'data' => $this->getProfile($user->fresh())];
    }

    public function deleteAccount(User $user): void
    {
        if ($user->foto && Storage::disk('public')->exists($user->foto)) {
            Storage::disk('public')->delete($user->foto);
        }
        $user->tokens()->delete();
        $user->delete();
    }

    public function getAllUsers(int $perPage = 15)
    {
        return $this->userRepository->paginate($perPage);
    }

    public function getUserById(int $id)
    {
        return $this->userRepository->find($id);
    }

    public function updateUser(int $id, array $data): array
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return ['success' => false, 'message' => 'Usuario no encontrado'];
        }

        $this->userRepository->update($id, $data);
        return ['success' => true, 'data' => $user->fresh()];
    }

    public function deleteUser(int $id): array
    {
        $user = $this->userRepository->find($id);
        if (!$user) {
            return ['success' => false, 'message' => 'Usuario no encontrado'];
        }

        if ($user->foto && Storage::disk('public')->exists($user->foto)) {
            Storage::disk('public')->delete($user->foto);
        }

        $user->tokens()->delete();
        $this->userRepository->delete($id);

        return ['success' => true];
    }
}
