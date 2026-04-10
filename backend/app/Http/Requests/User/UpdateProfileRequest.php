<?php
// app/Http/Requests/User/UpdateProfileRequest.php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'nombre' => 'sometimes|string|max:255',
            'username' => ['sometimes', 'string', 'max:255', Rule::unique('usuarios', 'username')->ignore($this->user()->id)],
            'email' => ['sometimes', 'email', 'max:255', Rule::unique('usuarios', 'email')->ignore($this->user()->id)],
            'profesion' => 'nullable|string|max:255',
            'especialidad' => 'nullable|string|max:255',
            'biografia' => 'nullable|string|max:1000',
            'ubicacion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:50',
            'universidad' => 'nullable|string|max:255',
            'carrera' => 'nullable|string|max:255',
            'linkedin' => 'nullable|url|max:255',
            'github_perfil' => 'nullable|url|max:255',
            'sitio_web' => 'nullable|url|max:255',
            'password' => 'nullable|string|min:8',
            'foto' => 'nullable|image|mimes:jpeg,png,jpg|max:2048', // 2MB max
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.max' => 'El nombre no puede superar los 255 caracteres',
            'profesion.max' => 'La profesión no puede superar los 255 caracteres',
            'biografia.max' => 'La biografía no puede superar los 1000 caracteres',
            'linkedin.url' => 'El enlace de LinkedIn debe ser una URL válida',
            'github_perfil.url' => 'El enlace de GitHub debe ser una URL válida',
            'sitio_web.url' => 'El sitio web debe ser una URL válida',
            'foto.image' => 'El archivo debe ser una imagen',
            'foto.mimes' => 'La foto debe ser de tipo: jpeg, png, jpg',
            'foto.max' => 'La foto no puede superar los 2MB',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Sanitizar URLs
        $urlFields = ['linkedin', 'github_perfil', 'sitio_web'];
        
        foreach ($urlFields as $field) {
            if ($this->$field) {
                $this->merge([
                    $field => rtrim($this->$field, '/'),
                ]);
            }
        }
    }
}