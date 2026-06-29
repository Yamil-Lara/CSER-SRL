<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OfertaReclutador;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;
use App\Mail\OfertaTrabajoMail;

class RecruiterOfferController extends Controller
{
    use ApiResponseTrait;

    public function store(Request $request, $username)
    {
        $user = User::where('username', $username)->first();

        if (!$user) {
            return $this->errorResponse('Usuario no encontrado', 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:255|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \.]+$/',
            'empresa' => 'required|string|max:255|regex:/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9 \.\-&]+$/',
            'email_contacto' => 'required|email:rfc,dns|max:255',
            'ciudad' => 'required|string|max:255',
            'pais' => 'required|string|max:255',
            'titulo_puesto' => 'required|string|max:255',
            'modalidad' => 'required|string|in:Remoto,Presencial,Híbrido,Hibrido',
            'tipo_contrato' => 'required|string',
            'salario' => 'nullable|string|max:50',
            'tecnologias' => 'required|string',
            'mensaje' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse($validator->errors(), 422);
        }

        // Crear la oferta
        $oferta = OfertaReclutador::create(array_merge($validator->validated(), [
            'usuario_id' => $user->id,
            'estado' => 'nuevo',
            'match_score' => 0
        ]));

        try {
            Mail::to($user->email)->send(new OfertaTrabajoMail($oferta));
        } catch (\Exception $e) {
            Log::error('Error enviando correo de oferta SMTP: ' . $e->getMessage());
        }

        return $this->successResponse($oferta, 'Oferta enviada con éxito', 201);
    }
}
