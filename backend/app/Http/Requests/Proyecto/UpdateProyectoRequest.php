<?php

namespace App\Http\Requests\Proyecto;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Models\Proyecto; // <-- Importamos el modelo

class UpdateProyectoRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Obtenemos el ID de la URL (puede llamarse 'id' o 'proyecto' según tus rutas)
        $proyectoId = $this->route('proyecto') ?? $this->route('id');
        
        // Buscamos el proyecto real en la base de datos
        $proyecto = Proyecto::find($proyectoId);
        
        $user = auth()->user();
        
        // Si no existe el proyecto o no hay usuario, bloqueamos la petición
        if (!$proyecto || !$user) {
            return false;
        }
        
        // Solo el dueño o admin pueden actualizar
        return $user->id === $proyecto->usuario_id || $user->rol === 'admin';
    }

    public function rules(): array
    {
        $proyectoId = $this->route('proyecto') ?? $this->route('id');

        return [
            'categoria_id' => 'sometimes|required|exists:categorias,id',
            'titulo' => [
                'sometimes',
                'required',
                'string',
                'max:255',
                Rule::unique('proyectos', 'titulo')->ignore($proyectoId) // Usamos el ID rescatado
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