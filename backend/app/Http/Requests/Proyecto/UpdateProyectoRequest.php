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
                Rule::unique('proyectos', 'titulo')->ignore($this->route('id'))
            ],
            'descripcion' => 'sometimes|required|string|min:50|max:5000',
            'tecnologias' => 'sometimes|required|string|min:3|max:1000',
            'herramientas' => 'nullable|string|max:1000',
            'imagen' => [
                'nullable',
                'file',
                'max:10240',
                function ($attribute, $value, $fail) {
                    if ($value instanceof \Illuminate\Http\UploadedFile) {
                        $extension = strtolower($value->getClientOriginalExtension());
                        if (!in_array($extension, ['jpeg', 'png', 'jpg', 'webp'])) {
                            $fail('La imagen debe ser de tipo: jpeg, png, jpg, webp');
                        }
                    }
                },
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
            'descripcion.min' => 'La descripción debe tener al menos 50 caracteres',
            'imagen.max' => 'La imagen no puede superar los 10MB',
            'estado.in' => 'El estado debe ser: pendiente, aprobado o rechazado',
        ];
    }
}