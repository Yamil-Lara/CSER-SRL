<?php

namespace App\Http\Requests\Skill;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSkillRequest extends FormRequest
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
        // For update we might not always receive 'type', so we fallback to a broader regex if not provided,
        // but typically the frontend sends all fields.
        $type = $this->input('type');
        $nameRegex = $type === 'tecnica'
            ? '/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s\+\-\#\.]+$/'
            : '/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/';

        return [
            'name' => ['sometimes', 'required', 'string', 'max:255', 'regex:' . $nameRegex],
            'type' => 'sometimes|required|in:tecnica,blanda',
            'level' => 'sometimes|required|integer|min:1|max:100',
        ];
    }

    public function messages(): array
    {
        $type = $this->input('type');
        $nameMessage = $type === 'tecnica'
            ? 'El nombre de la habilidad técnica solo debe contener letras, números y caracteres como +, -, #, .'
            : 'El nombre de la habilidad blanda solo debe contener letras, números y espacios';

        return [
            'name.required' => 'El nombre de la habilidad es obligatorio',
            'name.max' => 'El nombre no puede exceder 255 caracteres',
            'name.regex' => $nameMessage,
            'type.required' => 'El tipo de habilidad es obligatorio',
            'type.in' => 'El tipo debe ser: tecnica o blanda',
            'level.required' => 'El nivel de habilidad es obligatorio',
            'level.integer' => 'El nivel debe ser un número entero',
            'level.min' => 'El nivel mínimo es 1',
            'level.max' => 'El nivel máximo es 100',
        ];
    }
}
