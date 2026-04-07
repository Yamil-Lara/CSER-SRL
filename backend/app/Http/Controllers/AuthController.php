<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    // Registro de nuevos usuarios (usando Form Request)
    public function register(RegisterRequest $request): JsonResponse
    {
        $user = User::create([
            'nombre'   => $request->nombre,
            'username' => $request->username,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'rol'      => 'usuario',
            'estado'   => 'pendiente',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Usuario registrado exitosamente',
            'data' => [
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user
            ]
        ], 201);
    }

    // Inicio de sesión (usando Form Request)
    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales inválidas'
            ], 401);
        }

        // Verificar si el usuario está activo
        if (!$user->activo) {
            return response()->json([
                'success' => false,
                'message' => 'Tu cuenta está desactivada. Contacta al administrador.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Inicio de sesión exitoso',
            'data' => [
                'access_token' => $token,
                'token_type'   => 'Bearer',
                'user'         => $user
            ]
        ]);
    }

    // Cerrar sesión
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    // Obtener datos del perfil actual
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => $request->user()
        ]);
    }

    // Actualizar perfil (usando Form Request)
    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $data = $request->validated();

        // Manejar la foto de perfil
        if ($request->hasFile('foto')) {
            // Eliminar foto anterior si existe
            if ($user->foto && Storage::disk('public')->exists($user->foto)) {
                Storage::disk('public')->delete($user->foto);
            }
            
            $path = $request->file('foto')->store('perfiles', 'public');
            $data['foto'] = $path;
        }

        $user->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Perfil actualizado con éxito',
            'data' => $user
        ]);
    }

    // Eliminar cuenta
    public function destroy(Request $request): JsonResponse
    {
        $user = $request->user();

        // Eliminar foto de perfil si existe
        if ($user->foto && Storage::disk('public')->exists($user->foto)) {
            Storage::disk('public')->delete($user->foto);
        }

        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'Cuenta de usuario eliminada permanentemente'
        ], 200);
    }
}