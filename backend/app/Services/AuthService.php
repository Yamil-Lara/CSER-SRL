<?php
// app/Services/AuthService.php

namespace App\Services;

use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    protected $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    public function register(array $data): array
    {
        $user = $this->userRepository->create([
            'nombre' => $data['nombre'],
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'rol' => 'usuario',
            'estado' => 'pendiente',
            'activo' => false,
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'success' => true,
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $this->formatUser($user)
            ]
        ];
    }

    public function login(string $email, string $password): array
    {
        $user = $this->userRepository->findByEmail($email);

        if (!$user || !Hash::check($password, $user->password)) {
            return ['success' => false, 'message' => 'Credenciales inválidas', 'code' => 401];
        }

        if ($user->estado === 'pendiente') {
            return ['success' => false, 'message' => 'Cuenta pendiente de aprobación', 'code' => 403];
        }

        if (!$user->activo) {
            return ['success' => false, 'message' => 'Cuenta desactivada', 'code' => 403];
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return [
            'success' => true,
            'data' => [
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => $this->formatUser($user)
            ]
        ];
    }

    public function logout($user): void
    {
        $user->currentAccessToken()->delete();
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'nombre' => $user->nombre,
            'username' => $user->username,
            'email' => $user->email,
            'rol' => $user->rol,
            'foto' => $user->foto ? asset('storage/' . $user->foto) : null,
        ];
    }
}