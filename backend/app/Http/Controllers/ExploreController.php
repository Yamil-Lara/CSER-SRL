<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\Explore\ExploreUsersRequest;
use App\Services\ExploreService;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;

class ExploreController extends Controller
{
    use ApiResponseTrait;

    protected ExploreService $exploreService;

    public function __construct(ExploreService $exploreService)
    {
        $this->exploreService = $exploreService;
    }

    public function users(ExploreUsersRequest $request): JsonResponse
    {
        $result = $this->exploreService->searchUsers($request->validated());

        return $this->successResponse($result, 'Usuarios obtenidos exitosamente');
    }
}