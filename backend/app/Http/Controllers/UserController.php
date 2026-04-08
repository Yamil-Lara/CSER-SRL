<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\User\UpdateProfileRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'nombre' => $user->nombre,
            'email' => $user->email,
            'profesion' => $user->profesion,
            'especialidad' => $user->especialidad,
            'biografia' => $user->biografia,
            'ubicacion' => $user->ubicacion,
            'linkedin' => $user->linkedin,
            'github_perfil' => $user->github_perfil,
            'sitio_web' => $user->sitio_web,
            'image_url' => $user->foto ? '/storage/' . $user->foto : null,
        ]);
    }

    public function store(UpdateProfileRequest $request)
    {
        $user = $request->user();
        $validated = $request->validated();

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }

            $image = $request->file('image');
            $filename = Str::uuid() . '.' . $image->getClientOriginalExtension();
            $path = $image->storeAs('profiles', $filename, 'public');
            $validated['foto'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'nombre' => $user->nombre,
            'email' => $user->email,
            'profesion' => $user->profesion,
            'especialidad' => $user->especialidad,
            'biografia' => $user->biografia,
            'ubicacion' => $user->ubicacion,
            'linkedin' => $user->linkedin,
            'github_perfil' => $user->github_perfil,
            'sitio_web' => $user->sitio_web,
            'image_url' => $user->foto ? '/storage/' . $user->foto : null,
        ]);
    }
}
