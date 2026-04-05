<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;

Route::get('/status', function () {
    return response()->json([
        'status' => 'Conectado',
        'database' => 'OK',
        'mensaje' => 'Hola Steve Jason, el backend responde!'
    ]);
});

Route::get('/profile', [ProfileController::class, 'show']);
Route::post('/profile', [ProfileController::class, 'store']);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
