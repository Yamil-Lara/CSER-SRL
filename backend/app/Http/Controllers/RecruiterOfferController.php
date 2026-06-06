<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OfertaReclutador;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Facades\Validator;

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
            'nombre' => 'required|string|max:255',
            'empresa' => 'required|string|max:255',
            'email_contacto' => 'required|email|max:255',
            'ciudad' => 'required|string|max:255',
            'pais' => 'required|string|max:255',
            'titulo_puesto' => 'required|string|max:255',
            'modalidad' => 'required|string|in:Remoto,Presencial,Híbrido,Hibrido',
            'tipo_contrato' => 'required|string',
            'salario' => 'nullable|string',
            'tecnologias' => 'required|string',
            'mensaje' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->errorResponse($validator->errors(), 422);
        }

        // Crear la oferta
        // El match se calculará en vivo al visualizar la lista, por lo que aquí lo guardamos como 0 por defecto o no lo calculamos
        $oferta = OfertaReclutador::create(array_merge($validator->validated(), [
            'usuario_id' => $user->id,
            'estado' => 'nuevo',
            'match_score' => 0 // Se calcula "en vivo" cuando el usuario lo visualiza
        ]));

        return $this->successResponse($oferta, 'Oferta enviada con éxito', 201);
    }
}
