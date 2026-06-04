<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\User\UpdateProfileRequest;
use App\Services\UserService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    use ApiResponseTrait;

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function show(Request $request): JsonResponse
    {
        $profile = $this->userService->getProfile($request->user());
        return $this->successResponse($profile);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $result = $this->userService->updateProfile(
            $request->user(),
            $request->validated(),
            $request->file('foto')
        );

        return $this->successResponse($result['data'], 'Perfil actualizado con éxito');
    }

    public function destroy(Request $request): JsonResponse
    {
        $this->userService->deleteAccount($request->user());
        return $this->successResponse(null, 'Cuenta eliminada permanentemente');
    }

    public function getVisitas(Request $request): JsonResponse
    {
        $user = $request->user();
        
        // Obtener el total de visitas de este mes
        $visitasEsteMes = \App\Models\VisitaPortafolio::where('usuario_id', $user->id)
            ->where('visitado_en', '>=', now()->startOfMonth())
            ->count();

        // Obtener las últimas 5 visitas detalladas de usuarios registrados (visitantes)
        $visitantesRecientes = \App\Models\VisitaPortafolio::with(['visitante'])
            ->where('usuario_id', $user->id)
            ->whereNotNull('visitante_id')
            ->orderBy('visitado_en', 'desc')
            ->take(5)
            ->get()
            ->map(function ($visita) {
                $nombreVisitante = $visita->visitante->nombre;
                // Generar iniciales del nombre
                $words = explode(' ', $nombreVisitante);
                $avatarLetter = '';
                if (count($words) >= 2) {
                    $avatarLetter = mb_substr($words[0], 0, 1) . mb_substr($words[1], 0, 1);
                } else if (count($words) >= 1) {
                    $avatarLetter = mb_substr($words[0], 0, 1);
                }
                $avatarLetter = mb_strtoupper($avatarLetter);

                return [
                    'id' => $visita->id,
                    'nombre' => $nombreVisitante,
                    'cargo' => $visita->visitante->profesion ?? 'Profesional de Software',
                    'especialidad' => $visita->visitante->especialidad ?? 'Software Engineer',
                    'tiempo' => $visita->visitado_en->diffForHumans(),
                    'avatarLetter' => $avatarLetter,
                    'bgColor' => $this->getRandomAvatarBg($visita->visitante->id),
                    'username' => $visita->visitante->username
                ];
            });

        return $this->successResponse([
            'visitas_este_mes' => $visitasEsteMes,
            'visitantes_recientes' => $visitantesRecientes
        ]);
    }

    public function getComentariosRecientes(Request $request): JsonResponse
    {
        $user = $request->user();

        $comentarios = \App\Models\Comentario::with(['usuario', 'proyecto'])
            ->whereHas('proyecto', function ($q) use ($user) {
                $q->where('usuario_id', $user->id);
            })
            ->whereNull('parent_id') // Solo comentarios principales
            ->where('usuario_id', '!=', $user->id) // Que no sean míos
            ->whereHas('usuario', function ($q) {
                $q->where('rol', '!=', 'admin'); // Que no sean del admin
            })
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($comentario) {
                $autor = $comentario->usuario;
                $avatarLetter = '';
                if ($autor) {
                    $words = explode(' ', $autor->nombre);
                    $avatarLetter = count($words) >= 2
                        ? mb_strtoupper(mb_substr($words[0], 0, 1) . mb_substr($words[1], 0, 1))
                        : mb_strtoupper(mb_substr($words[0] ?? '?', 0, 1));
                }

                return [
                    'id'        => $comentario->id,
                    'contenido' => $comentario->contenido,
                    'aprobado'  => $comentario->aprobado,
                    'tiempo'    => $comentario->created_at->diffForHumans(),
                    'proyecto'  => [
                        'id'     => $comentario->proyecto->id,
                        'titulo' => $comentario->proyecto->titulo,
                    ],
                    'autor' => $autor ? [
                        'nombre'       => $autor->nombre,
                        'username'     => $autor->username,
                        'avatarLetter' => $avatarLetter,
                    ] : null,
                ];
            });

        return $this->successResponse($comentarios);
    }

    private function getRandomAvatarBg($id)
    {
        $colors = [
            'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400',
            'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400',
            'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400',
            'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400',
            'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400'
        ];
        return $colors[$id % count($colors)];
    }
}