<?php

namespace App\Http\Requests\Comentario;

use Illuminate\Foundation\Http\FormRequest;

class StoreComentarioRequest extends FormRequest
{
    public function authorize(): bool
    {
        return auth()->check();
    }

    public function rules(): array
    {
        return [
            'contenido' => 'required|string|min:1|max:1000',
            'parent_id' => 'nullable|integer|exists:comentarios,id',
        ];
    }

    public function messages(): array
    {
        return [
            'contenido.required' => 'El comentario es obligatorio',
            'contenido.min'      => 'El comentario no puede estar vacío',
            'contenido.max'      => 'El comentario no puede superar los 1000 caracteres',
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('contenido') && $this->contenido !== null) {
            $this->merge([
                'contenido' => strip_tags(trim($this->contenido)),
            ]);
        }
    }
}
