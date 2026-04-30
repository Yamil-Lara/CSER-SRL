<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    protected function redirectTo(Request $request): ?string
    {
        // Si la petición no espera JSON (ej: entrar desde el navegador),
        // forzamos una respuesta JSON con error 401 en lugar de redirigir.
        if (! $request->expectsJson()) {
            abort(response()->json([
                'success' => false,
                'message' => 'Unauthenticated.'
            ], 401));
        }

        return null;
    }
}