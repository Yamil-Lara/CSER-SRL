<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Services\UserService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    use ApiResponseTrait;

    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
        $this->middleware('admin');
    }

    public function index(Request $request): JsonResponse
    {
        $filters = [];
        
        if ($request->has('estado') && $request->estado !== 'todos') {
            $filters['estado'] = $request->estado;
        }
        
        // HU17: Búsqueda por nombre, email o profesión
        if ($request->has('search') && !empty($request->search)) {
            $filters['search'] = $request->search;
        }

        $users = $this->userService->getAllUsers($request->get('per_page', 15), $filters);
        return $this->successResponse($users);
    }





    public function show($id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        
        if (!$user) {
            return $this->errorResponse('Usuario no encontrado', 404);
        }

        return $this->successResponse($user);
    }
     




   public function update(Request $request, $id): JsonResponse
    {
        // HU17: Protección de autocuenta
        if ((int) auth()->id() === (int) $id) {
            return $this->errorResponse('No puedes modificar tu propio usuario.', 403);
        }

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'username' => ['sometimes', 'string', 'max:255', Rule::unique('usuarios')->ignore($id)],
            'email' => ['sometimes', 'email', Rule::unique('usuarios')->ignore($id)],
            'rol' => 'sometimes|in:usuario,admin,moderador',
            'activo' => 'sometimes|boolean',
            'estado' => 'sometimes|in:pendiente,aprobado,rechazado',
        ]);

        if (isset($validated['estado'])) {
            if ($validated['estado'] === 'aprobado') {
                $validated['activo'] = true;
            } elseif ($validated['estado'] === 'rechazado') {
                $validated['activo'] = false;
            }
        }

        $result = $this->userService->updateUser($id, $validated);

        if (!$result['success']) {
            return $this->errorResponse($result['message'], 404);
        }

        return $this->successResponse($result['data'], 'Usuario actualizado exitosamente');
    }

    public function destroy($id): JsonResponse
    {
        if (auth()->id() == $id) {
            return $this->errorResponse('No puedes eliminar tu propia cuenta', 403);
        }

        $result = $this->userService->deleteUser($id);

        if (!$result['success']) {
            return $this->errorResponse($result['message'], 404);
        }

        return $this->successResponse(null, 'Usuario eliminado exitosamente');
    }

    public function reenviarNotificacion($id): JsonResponse
    {
        $user = $this->userService->getUserById($id);
        if (!$user) {
            return $this->errorResponse('Usuario no encontrado', 404);
        }

        if ($user->estado === 'pendiente') {
            return $this->errorResponse('El usuario aún está pendiente. Aprueba o rechaza primero.', 400);
        }

        try {
            if ($user->estado === 'aprobado') {
                \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\UserApprovedMail($user));
            } elseif ($user->estado === 'rechazado') {
                \Illuminate\Support\Facades\Mail::to($user->email)->send(new \App\Mail\UserRejectedMail($user));
            }
            
            $this->userService->updateUser($id, ['estado_notificacion' => 'notificado']);
            return $this->successResponse(null, 'Notificación reenviada exitosamente');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error reenviando notificación: ' . $e->getMessage());
            return $this->errorResponse('Error al reenviar notificación', 500);
        }
    }
}