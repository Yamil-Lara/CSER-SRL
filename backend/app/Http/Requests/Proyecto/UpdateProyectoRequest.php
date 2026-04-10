<?php
// app/Http/Requests/Proyecto/UpdateProyectoRequest.php

namespace App\Http\Requests\Proyecto;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProyectoRequest extends FormRequest
{
    public function authorize(): bool
    {
        $proyecto = $this->route('id');
        $user = auth()->user();
        
        // Solo el dueño o admin pueden actualizar
        return $user && ($user->id === $proyecto->usuario_id || $user->rol === 'admin');
    }

    public function rules(): array
    {
        return [
            'categoria_id' => 'sometimes|required|exists:categorias,id',
            'titulo' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('proyectos', 'titulo')->ignore($this->route('id'))
            ],
            'descripcion' => 'sometimes|required|string|min:50|max:5000',
            'tecnologias' => 'sometimes|required|string|min:3|max:1000',
            'herramientas' => 'nullable|string|max:1000',
            'imagen' => 'nullable|image|mimes:jpeg,png,jpg,webp|max:10240',
            'github' => 'nullable|url|max:255',
            'demo' => 'nullable|url|max:255',
            'cliente' => 'nullable|string|max:255',
            'fecha_proyecto' => 'nullable|date|before_or_equal:today',
            'estado' => [
                'nullable',
                Rule::in(['pendiente', 'aprobado', 'rechazado'])
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'categoria_id.exists' => 'La categoría seleccionada no existe',
            'titulo.unique' => 'Ya existe un proyecto con este título',
            'descripcion.min' => 'La descripción debe tener al menos 50 caracteres',
            'imagen.max' => 'La imagen no puede superar los 10MB',
            'estado.in' => 'El estado debe ser: pendiente, aprobado o rechazado',
        ];
    }
}