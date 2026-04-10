<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUsuarioActivo
{
    public function handle(Request $request, Closure $next): Response
    {
        $usuario = $request->user();

        if ($usuario && !$usuario->activo) {
            $usuario->currentAccessToken()->delete();

            return response()->json([
                'message' => 'Tu cuenta ha sido desactivada. Contacta al administrador.',
                'code'    => 'CUENTA_INACTIVA',
            ], 403);
        }

        return $next($request);
    }
}