<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    // HU-04: Registro de nuevos usuarios
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre'   => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:usuarios',
            'email'    => 'required|string|email|max:255|unique:usuarios',
            'password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

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
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ], 201);
    }

    // HU-04: Inicio de sesión
    public function login(Request $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type'   => 'Bearer',
            'user'         => $user
        ]);
    }

    // HU-04: Cerrar sesión (Revocar token)
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    // HU-02: Obtener datos del perfil actual
    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    // HU-02: Actualizar perfil (Incluye foto)
    public function updateProfile(Request $request)
    {
        $user = $request->user();
        
        $validator = Validator::make($request->all(), [
            'nombre'        => 'sometimes|string|max:255',
            'profesion'     => 'nullable|string|max:255',
            'biografia'     => 'nullable|string',
            'ubicacion'     => 'nullable|string|max:255',
            'linkedin'      => 'nullable|url',
            'github_perfil' => 'nullable|url',
            'foto'          => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $data = $request->except(['foto', 'email', 'rol', 'password']);

        if ($request->hasFile('foto')) {
            // Eliminar foto antigua si existe
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $path = $request->file('foto')->store('perfiles', 'public');
            $data['foto'] = $path;
        }

        $user->update($data);

        return response()->json([
            'message' => 'Perfil actualizado con éxito',
            'user'    => $user
        ]);
    }

    public function destroy(Request $request)
    {
        $user = $request->user();

        // 1. Eliminar su foto de perfil del servidor para no dejar basura
        if ($user->foto && Storage::disk('public')->exists($user->foto)) {
            Storage::disk('public')->delete($user->foto);
        }

        // 2. Eliminar al usuario. 
        $user->delete();

        return response()->json([
            'message' => 'Cuenta de usuario eliminada permanentemente'
        ], 200);
    }

}