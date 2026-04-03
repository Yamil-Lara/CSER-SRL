<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TestController;

Route::get('/status', function () {
    return response()->json([
        'status' => 'Conectado',
        'database' => 'OK',
        'mensaje' => 'Hola Steve Jason, el backend responde!'
    ]);
});

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
