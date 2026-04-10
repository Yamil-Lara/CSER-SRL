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
        $users = $this->userService->getAllUsers($request->get('per_page', 15));
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
        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'username' => ['sometimes', 'string', 'max:255', Rule::unique('usuarios')->ignore($id)],
            'email' => ['sometimes', 'email', Rule::unique('usuarios')->ignore($id)],
            'rol' => 'sometimes|in:usuario,admin,moderador',
            'activo' => 'sometimes|boolean',
            'estado' => 'sometimes|in:pendiente,aprobado,rechazado',
        ]);

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
}