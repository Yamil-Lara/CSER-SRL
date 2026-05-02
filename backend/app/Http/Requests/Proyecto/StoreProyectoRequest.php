<?php
// app/Http/Requests/Proyecto/StoreProyectoRequest.php

namespace App\Http\Requests\Proyecto;

use Illuminate\Foundation\Http\FormRequest;

class StoreProyectoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Solo usuarios autenticados pueden crear proyectos
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'categoria_id' => 'required|exists:categorias,id',
            'titulo' => 'required|string|max:255|unique:proyectos,titulo',
            'descripcion' => 'required|string|min:50|max:5000',
            'tecnologias' => 'required|string|min:3|max:1000',
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
        ];
    }

    public function messages(): array
    {
        return [
            'categoria_id.required' => 'Debe seleccionar una categoría',
            'categoria_id.exists' => 'La categoría seleccionada no existe',
            
            'titulo.required' => 'El título del proyecto es obligatorio',
            'titulo.unique' => 'Ya existe un proyecto con este título',
            'titulo.max' => 'El título no puede superar los 255 caracteres',
            
            'descripcion.required' => 'La descripción es obligatoria',
            'descripcion.min' => 'La descripción debe tener al menos 50 caracteres',
            'descripcion.max' => 'La descripción no puede superar los 5000 caracteres',
            
            'tecnologias.required' => 'Debe especificar las tecnologías usadas',
            'tecnologias.min' => 'Las tecnologías deben tener al menos 3 caracteres',
            
            'imagen.image' => 'El archivo debe ser una imagen',
            'imagen.mimes' => 'La imagen debe ser de tipo: jpeg, png, jpg, webp',
            'imagen.max' => 'La imagen no puede superar los 10MB',
            
            'github.url' => 'El enlace de GitHub debe ser una URL válida',
            'demo.url' => 'El enlace de demo debe ser una URL válida',
            
            'fecha_proyecto.before_or_equal' => 'La fecha del proyecto no puede ser futura',
        ];
    }

    /**
     * Validación personalizada después de las reglas básicas
     */
    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            // Validar que al menos una URL (GitHub o Demo) esté presente
            if (!$this->github && !$this->demo) {
                $validator->errors()->add(
                    'urls',
                    'Debe proporcionar al menos un enlace (GitHub o Demo)'
                );
            }
        });
    }

    protected function prepareForValidation(): void
    {
        // Sanitizar URLs
        if ($this->github) {
            $this->merge([
                'github' => rtrim($this->github, '/'),
            ]);
        }
        
        if ($this->demo) {
            $this->merge([
                'demo' => rtrim($this->demo, '/'),
            ]);
        }
    }
}