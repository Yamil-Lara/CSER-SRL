<?php

namespace App\Http\Requests\Explore;

use Illuminate\Foundation\Http\FormRequest;

class ExploreProjectsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'categoria_id' => 'nullable|integer|exists:categorias,id',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:12',
        ];
    }

    public function messages(): array
    {
        return [
            'categoria_id.integer' => 'El ID de categoría debe ser un número entero',
            'categoria_id.exists' => 'La categoría seleccionada no existe',
            'page.integer' => 'El número de página debe ser un entero',
            'page.min' => 'El número de página mínimo es 1',
            'per_page.integer' => 'El tamaño de página debe ser un número entero',
            'per_page.min' => 'El tamaño de página mínimo es 1',
            'per_page.max' => 'El tamaño de página máximo es 12',
        ];
    }
}
