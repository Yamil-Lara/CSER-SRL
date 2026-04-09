<?php

namespace App\Http\Requests\Skill;

use Illuminate\Foundation\Http\FormRequest;

class StoreSkillRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Validaremos en el middleware
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'nombre' => 'required|string|max:255',
            'tipo' => 'required|in:tecnica,blanda',
            'nivel' => 'required|integer|min:1|max:100',
            'descripcion' => 'nullable|string|max:500',
        ];
    }

    public function messages(): array
    {
        return [
            'nombre.required' => 'El nombre de la habilidad es obligatorio',
            'nombre.max' => 'El nombre no puede exceder 255 caracteres',
            'tipo.required' => 'El tipo de habilidad es obligatorio',
            'tipo.in' => 'El tipo debe ser: tecnica o blanda',
            'nivel.required' => 'El nivel de habilidad es obligatorio',
            'nivel.integer' => 'El nivel debe ser un número entero',
            'nivel.min' => 'El nivel mínimo es 1',
            'nivel.max' => 'El nivel máximo es 100',
            'descripcion.max' => 'La descripción no puede exceder 500 caracteres',
        ];
    }
}
