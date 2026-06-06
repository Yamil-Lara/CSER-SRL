<?php
// app/Http/Requests/Auth/RegisterRequest.php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determinar si el usuario está autorizado a hacer esta request
     */
    public function authorize(): bool
    {
        return true; // Cualquiera puede registrarse
    }

    /**
     * Reglas de validación
     */
    public function rules(): array
    {
        return [
            'nombre'    => 'required|string|max:255',
            'username'  => 'required|string|max:255|unique:usuarios,username',
            'email'     => 'required|string|email|max:255|unique:usuarios,email',
            'password'  => [
                'required',
                'string',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ],
            // Paso 2 — opcionales
            'foto'      => 'nullable|image|mimes:jpg,jpeg,png,webp|max:10240',
            'profesion' => 'nullable|string|max:255',
            'ubicacion' => 'nullable|string|max:255',
            'telefono'  => 'nullable|string|max:30',
        ];
    }

    /**
     * Mensajes personalizados de error
     */
    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre es obligatorio',
            'nombre.max' => 'El nombre no puede superar los 255 caracteres',
            
            'username.required' => 'El nombre de usuario es obligatorio',
            'username.unique' => 'Este nombre de usuario ya está en uso',
            'username.max' => 'El nombre de usuario no puede superar los 255 caracteres',
            
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'Debe ingresar un correo electrónico válido',
            'email.unique' => 'Este correo electrónico ya está registrado',
            
            'password.required' => 'La contraseña es obligatoria',
            'password.confirmed' => 'Las contraseñas no coinciden',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
        ];
    }

    /**
     * Preparar los datos para la validación
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'email' => strtolower($this->email),
            'username' => strtolower($this->username),
        ]);
    }
}