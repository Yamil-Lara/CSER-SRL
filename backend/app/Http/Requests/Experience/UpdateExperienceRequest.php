<?php

namespace App\Http\Requests\Experience;

use Illuminate\Foundation\Http\FormRequest;

class UpdateExperienceRequest extends FormRequest
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
            'tipo' => 'sometimes|in:laboral,academica',
            'cargo_titulo' => 'sometimes|string|max:255',
            'institucion_empresa' => 'sometimes|string|max:255',
            'descripcion' => 'nullable|string',
            'fecha_inicio' => 'sometimes|date',
            'fecha_fin' => 'nullable|date|after_or_equal:fecha_inicio',
            'actual' => 'sometimes|boolean',
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
            'eliminar_imagen' => 'sometimes|boolean',
            'enlace_certificado' => 'nullable|url|max:255',
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
            'tipo.in' => 'El tipo debe ser laboral o académica',
            'cargo_titulo.max' => 'El cargo/título no puede exceder 255 caracteres',
            'institucion_empresa.max' => 'La institución/empresa no puede exceder 255 caracteres',
            'fecha_inicio.date' => 'La fecha de inicio debe ser una fecha válida',
            'fecha_fin.date' => 'La fecha de fin debe ser una fecha válida',
            'fecha_fin.after' => 'La fecha de fin debe ser posterior a la fecha de inicio',
            'actual.boolean' => 'El campo actual debe ser verdadero o falso',
            'enlace_certificado.url' => 'El enlace del certificado debe ser una URL válida',
            'enlace_certificado.max' => 'El enlace no puede superar los 255 caracteres',
        ];
    }
    /**
     * NUEVO: Preparar los datos antes de la validación
     * Esto limpia los datos sucios que provienen del FormData de React
     */
    protected function prepareForValidation(): void
    {
        // 1. Convertir string vacío de fecha_fin a verdader null
        if ($this->has('fecha_fin') && ($this->fecha_fin === '' || $this->fecha_fin === 'null')) {
            $this->merge(['fecha_fin' => null]);
        }
        
        // 2. Convertir string vacío de descripción a verdadero null
        if ($this->has('descripcion') && ($this->descripcion === '' || $this->descripcion === 'null')) {
            $this->merge(['descripcion' => null]);
        }

        // 3. Asegurar que el booleano 'actual' se evalúe correctamente ("0"/"1" a true/false)
        if ($this->has('actual')) {
            $this->merge([
                'actual' => filter_var($this->actual, FILTER_VALIDATE_BOOLEAN)
            ]);
        }
        // Limpiar el enlace
        if ($this->has('enlace_certificado') && ($this->enlace_certificado === '' || $this->enlace_certificado === 'null')) {
            $this->merge(['enlace_certificado' => null]);
        }
    }
}