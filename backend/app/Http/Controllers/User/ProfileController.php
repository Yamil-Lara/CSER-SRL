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
}