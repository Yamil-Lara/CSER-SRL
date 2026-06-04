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
            // NUEVAS REGLAS PARA LA IMAGEN:
            'imagen' => [
                'nullable',
                'file',
                'max:10240', // 10MB
                function ($attribute, $value, $fail) {
                    if ($value instanceof \Illuminate\Http\UploadedFile) {
                        $extension = strtolower($value->getClientOriginalExtension());
                        if (!in_array($extension, ['jpeg', 'png', 'jpg', 'webp'])) {
                            $fail('La imagen debe ser de tipo: jpeg, png, jpg, webp');
                        }
                    }
                },
            ],
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
            'imagen.max' => 'La imagen no puede superar los 10MB',
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
    }
}