<?php

namespace App\Http\Requests\Experience;

use Illuminate\Foundation\Http\FormRequest;

class StoreExperienceRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'tipo' => 'required|in:laboral,academica',
            'cargo_titulo' => 'required|string|max:255',
            'institucion_empresa' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'required|date',
            'fecha_fin' => 'nullable|date|after:fecha_inicio',
            'actual' => 'required|boolean',
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'tipo.required' => 'El tipo es requerido',
            'tipo.in' => 'El tipo debe ser laboral o académica',
            'cargo_titulo.required' => 'El cargo/título es requerido',
            'cargo_titulo.max' => 'El cargo/título no puede exceder 255 caracteres',
            'institucion_empresa.required' => 'La institución/empresa es requerida',
            'institucion_empresa.max' => 'La institución/empresa no puede exceder 255 caracteres',
            'fecha_inicio.required' => 'La fecha de inicio es requerida',
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida',
            'fecha_fin.date' => 'La fecha de fin debe ser una fecha válida',
            'fecha_fin.after' => 'La fecha de fin debe ser posterior a la fecha de inicio',
            'actual.required' => 'El campo actual es requerido',
            'actual.boolean' => 'El campo actual debe ser verdadero o falso',
        ];
    }
}
