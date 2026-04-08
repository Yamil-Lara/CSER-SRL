<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\CategoriaController;

/* --- RUTAS PÚBLICAS --- */
Route::get('/status', function () {
    return response()->json(['status' => 'OK', 'mensaje' => 'CSER API Conectada']);
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Ver proyectos y categorías es público
Route::get('/proyectos', [ProyectoController::class, 'index']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/proyectos/{id}', [ProyectoController::class, 'show']);


/* --- RUTAS PROTEGIDAS (Requieren Token) --- */
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth & Perfil
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'profile']);
    Route::post('/user/update', [AuthController::class, 'updateProfile']); // Usamos POST por compatibilidad con archivos
    Route::delete('/user', [AuthController::class, 'destroy']);
    
    // Proyectos (Crear, Editar, Borrar)
    Route::post('/proyectos', [ProyectoController::class, 'store']);
    Route::put('/proyectos/{id}', [ProyectoController::class, 'update']);
    Route::delete('/proyectos/{id}', [ProyectoController::class, 'destroy']);
    
});