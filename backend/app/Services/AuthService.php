<?php
// app/Services/AuthService.php

namespace App\Services;

use App\Mail\PasswordResetMail;
use App\Models\User;
use App\Repositories\UserRepository;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Carbon\Carbon;

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

    /**
     * Genera token de recuperación y envía email al usuario.
     * Por seguridad, no revela si el email existe o no.
     */
    public function sendPasswordResetLink(string $email): array
    {
        $user = $this->userRepository->findByEmail($email);

        // Mensaje genérico para evitar enumeración de usuarios
        $genericResponse = [
            'success' => true,
            'message' => 'Si el email está registrado, recibirás un enlace de recuperación.'
        ];

        if (!$user) {
            return $genericResponse;
        }

        // Generar token aleatorio
        $token = Str::random(64);

        // Guardar token en BD (eliminar previos si existen)
        DB::table('password_reset_tokens')->where('email', $email)->delete();
        DB::table('password_reset_tokens')->insert([
            'email' => $email,
            'token' => Hash::make($token),
            'created_at' => Carbon::now(),
        ]);

        // Construir enlace de recuperación (frontend)
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
        $resetUrl = "{$frontendUrl}/reset-password?token={$token}&email=" . urlencode($email);

        // Enviar email
        try {
            Mail::to($user->email)->send(new PasswordResetMail($user, $resetUrl));
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'No se pudo enviar el email. Intenta más tarde.',
                'code' => 500
            ];
        }

        return $genericResponse;
    }

    /**
     * Valida el token y actualiza la contraseña del usuario.
     * El token expira en 60 minutos y es de un solo uso.
     */
    public function resetPassword(string $email, string $token, string $newPassword): array
    {
        $record = DB::table('password_reset_tokens')->where('email', $email)->first();

        if (!$record) {
            return [
                'success' => false,
                'message' => 'Token inválido o expirado',
                'code' => 400
            ];
        }

        // Verificar expiración (60 minutos)
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            DB::table('password_reset_tokens')->where('email', $email)->delete();
            return [
                'success' => false,
                'message' => 'El enlace ha expirado. Solicita uno nuevo.',
                'code' => 400
            ];
        }

        // Verificar token (comparar hash)
        if (!Hash::check($token, $record->token)) {
            return [
                'success' => false,
                'message' => 'Token inválido',
                'code' => 400
            ];
        }

        // Actualizar contraseña
        $user = $this->userRepository->findByEmail($email);
        if (!$user) {
            return [
                'success' => false,
                'message' => 'Usuario no encontrado',
                'code' => 404
            ];
        }

        $user->password = Hash::make($newPassword);
        $user->save();

        // Eliminar token (uso único)
        DB::table('password_reset_tokens')->where('email', $email)->delete();

        // Invalidar todas las sesiones activas del usuario (seguridad)
        $user->tokens()->delete();

        return [
            'success' => true,
            'message' => 'Contraseña restablecida exitosamente'
        ];
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