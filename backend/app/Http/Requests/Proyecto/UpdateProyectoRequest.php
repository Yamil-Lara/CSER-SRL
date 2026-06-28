<?php
// app/Http/Requests/Proyecto/UpdateProyectoRequest.php

namespace App\Http\Requests\Proyecto;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProyectoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Devolvemos true porque la validación de propiedad (usuario_id vs admin)
        // ya se está manejando de forma excelente en el ProyectoController.
        return true;
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
                'regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \-&]+$/',
                Rule::unique('proyectos', 'titulo')->ignore($this->route('id'))
            ],
            'descripcion' => 'sometimes|required|string|min:50|max:5000',
            'tecnologias' => 'sometimes|required|string|min:3|max:1000',
            'herramientas' => 'nullable|string|max:1000',
            'categoria_personalizada' => 'nullable|string|max:30',
            'imagen' => [
                'nullable',
                'file',
                'max:10240',
                'mimes:jpeg,png,jpg,webp',
            ],
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
            'titulo.regex' => 'El título solo puede contener letras, números, espacios, guiones y &',
            'descripcion.min' => 'La descripción debe tener al menos 50 caracteres',
            'imagen.max' => 'La imagen no puede superar los 10MB',
            'estado.in' => 'El estado debe ser: pendiente, aprobado o rechazado',
        ];
    }

    protected function prepareForValidation(): void
    {
        // Sanitizar campos de texto libre contra XSS
        $textFields = [
            'titulo', 'descripcion', 'tecnologias',
            'herramientas', 'categoria_personalizada', 'cliente'
        ];

        foreach ($textFields as $field) {
            if ($this->has($field) && $this->$field !== null) {
                $this->merge([
                    $field => strip_tags(trim($this->$field)),
                ]);
            }
        }
    }
}