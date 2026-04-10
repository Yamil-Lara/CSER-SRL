<?php

namespace App\Http\Controllers;

use App\Models\Categoria;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class CategoriaController extends Controller
{
    use ApiResponseTrait;  // <-- AGREGAR ESTO

    public function index(): JsonResponse
    {
        return $this->successResponse(Categoria::all());  // <-- CAMBIAR ESTO
    }
}