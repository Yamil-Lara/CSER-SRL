
public function handle(Request $request, Closure $next): Response
 {
    if ($request->user() && !$request->user()->activo) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Cuenta desactivada.'], 403);
    }
    return $next($request);
 }