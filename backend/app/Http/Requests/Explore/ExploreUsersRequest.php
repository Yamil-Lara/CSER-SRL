<?php

namespace App\Http\Requests\Explore;

use Illuminate\Foundation\Http\FormRequest;

class ExploreUsersRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search'   => 'nullable|string|max:255',
            'filter'   => 'nullable|in:profesionales,estudiantes',
            'per_page' => 'nullable|integer|min:1|max:50',
        ];
    }

    public function messages(): array
    {
        return [
            'search.max'       => 'El término de búsqueda no puede superar los 255 caracteres',
            'filter.in'        => 'El filtro debe ser: profesionales o estudiantes',
            'per_page.integer' => 'El tamaño de página debe ser un número entero',
            'per_page.min'     => 'El tamaño de página mínimo es 1',
            'per_page.max'     => 'El tamaño de página máximo es 50',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('search') && $this->search !== null) {
            $this->merge([
                'search' => trim($this->search),
            ]);
        }
    }
}
