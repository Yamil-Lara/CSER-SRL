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
            'name' => 'required|string|max:255|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/',
            'type' => 'required|in:tecnica,blanda',
            'level' => 'required|integer|min:1|max:100',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'El nombre de la habilidad es obligatorio',
            'name.max' => 'El nombre no puede exceder 255 caracteres',
            'name.regex' => 'El nombre de la habilidad solo debe contener letras y espacios',
            'type.required' => 'El tipo de habilidad es obligatorio',
            'type.in' => 'El tipo debe ser: tecnica o blanda',
            'level.required' => 'El nivel de habilidad es obligatorio',
            'level.integer' => 'El nivel debe ser un número entero',
            'level.min' => 'El nivel mínimo es 1',
            'level.max' => 'El nivel máximo es 100',
        ];
    }
}
