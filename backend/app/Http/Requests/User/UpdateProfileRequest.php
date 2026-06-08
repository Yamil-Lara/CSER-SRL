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

            'username' => ['sometimes', 'string', 'max:255', Rule::unique('usuarios')->ignore($this->user()->id)],
        'email' => ['sometimes', 'email', Rule::unique('usuarios')->ignore($this->user()->id)],


           'password' => 'sometimes|string|min:8', 
            'profesion' => 'nullable|string|max:255',
            'especialidad' => 'nullable|string|max:255',
            'universidad' => 'nullable|string|max:255',
            'carrera' => 'nullable|string|max:255',
            'nivel_estudios' => 'nullable|string|max:255',
            'biografia' => 'nullable|string|max:1000',
            'ubicacion' => 'nullable|string|max:255',
            'telefono' => 'nullable|string|max:20',
            'linkedin' => 'nullable|url|max:255',
            'github_perfil' => 'nullable|url|max:255',
            'facebook' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'tiktok' => 'nullable|url|max:255',
            'threads' => 'nullable|url|max:255',
            'sitio_web' => 'nullable|url|max:255',
            'foto' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:jpeg,png,jpg,webp',
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.max' => 'El nombre no puede superar los 255 caracteres',


        'username.unique' => 'Este nombre de usuario ya está en uso',
        'username.max' => 'El nombre de usuario no puede superar los 255 caracteres',
        'email.unique' => 'Este correo electrónico ya está registrado',
        'email.email' => 'Debe ingresar un correo electrónico válido',


         'password.min' => 'La contraseña debe tener al menos 8 caracteres',





            'profesion.max' => 'La profesión no puede superar los 255 caracteres',
            'especialidad.max' => 'La especialidad no puede superar los 255 caracteres',
            'universidad.max' => 'La universidad no puede superar los 255 caracteres',
            'carrera.max' => 'La carrera no puede superar los 255 caracteres',
            'nivel_estudios.max' => 'El nivel de estudios no puede superar los 255 caracteres',
            'biografia.max' => 'La biografía no puede superar los 1000 caracteres',
            'telefono.max' => 'El teléfono no puede superar los 20 caracteres',
            'linkedin.url' => 'El enlace de LinkedIn debe ser una URL válida',
            'github_perfil.url' => 'El enlace de GitHub debe ser una URL válida',
            'facebook.url' => 'El enlace de Facebook debe ser una URL válida',
            'instagram.url' => 'El enlace de Instagram debe ser una URL válida',
            'twitter.url' => 'El enlace de X (Twitter) debe ser una URL válida',
            'tiktok.url' => 'El enlace de TikTok debe ser una URL válida',
            'threads.url' => 'El enlace de Threads debe ser una URL válida',
            'sitio_web.url' => 'El sitio web debe ser una URL válida',
            'foto.image' => 'El archivo debe ser una imagen',
            'foto.mimes' => 'La foto debe ser de tipo: jpeg, png, jpg, webp',
            'foto.max' => 'La foto no puede superar los 10MB',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Sanitizar campos de texto libre contra XSS
        $textFields = [
            'nombre', 'profesion', 'especialidad', 'universidad',
            'carrera', 'nivel_estudios', 'biografia', 'ubicacion'
        ];

        foreach ($textFields as $field) {
            if ($this->has($field) && $this->$field !== null) {
                $this->merge([
                    $field => strip_tags(trim($this->$field)),
                ]);
            }
        }

        // Sanitizar URLs
        $urlFields = [
            'linkedin', 'github_perfil', 'sitio_web', 
            'facebook', 'instagram', 'twitter', 'tiktok', 'threads'
        ];
        
        foreach ($urlFields as $field) {
            if ($this->$field) {
                $this->merge([
                    $field => rtrim($this->$field, '/'),
                ]);
            }
        }
    }
}