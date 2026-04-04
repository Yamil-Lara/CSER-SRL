<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProyectoController;


Route::get('/status', function () {
    return response()->json([
        'status' => 'Conectado',
        'database' => 'OK',
        'mensaje' => 'Hola equipo de CSER, el backend responde!'
    ]);
});

// Endpoint de prueba temporal para ver el usuario auth (Requiere auth posterior)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
}); 

// ApiResource genera automáticamente las rutas index, store, show, update, destroy
Route::apiResource('proyectos', ProyectoController::class);