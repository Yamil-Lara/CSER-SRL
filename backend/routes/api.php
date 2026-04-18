<?php
use App\Http\Controllers\PublicPortafolioController;  // ← Usar el de él
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\AdminUserController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ExploreController;
use Illuminate\Support\Facades\Route;

// RUTAS PÚBLICAS
Route::get('/status', function () {
    return response()->json(['status' => 'OK', 'message' => 'CSER API Conectada']);
});

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);

Route::get('/proyectos', [ProyectoController::class, 'index']);
Route::get('/proyectos/{id}', [ProyectoController::class, 'show']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/usuarios/{id}', [AdminUserController::class, 'show']);

// ===== HU-06: Portafolio público (VERSIÓN DE ÉL) =====
Route::get('/portafolio/{username}', [PublicPortafolioController::class, 'show']);

// ===== Explore users (VERSIÓN DE ÉL) =====
Route::prefix('explore')->group(function () {
    Route::get('/users', [ExploreController::class, 'users']);
    Route::get('/projects', [ExploreController::class, 'projects']);
});

// RUTAS PROTEGIDAS
Route::middleware(['auth:sanctum', 'usuario.activo'])->group(function () {
    
    Route::post('/logout', LogoutController::class);
    
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::delete('/', [ProfileController::class, 'destroy']);
    });

    // ===== HU-08: Control de visibilidad (VERSIÓN DE ÉL) =====
    Route::get('/visibilidad', [\App\Http\Controllers\VisibilidadController::class, 'show']);
    Route::put('/visibilidad', [\App\Http\Controllers\VisibilidadController::class, 'update']);
    
    Route::post('/proyectos', [ProyectoController::class, 'store']);
    Route::put('/proyectos/{id}', [ProyectoController::class, 'update']);
    Route::delete('/proyectos/{id}', [ProyectoController::class, 'destroy']);
    
    // RENTAS DE HABILIDADES (HU-04)
    Route::apiResource('skills', SkillController::class);
    
    // RUTAS DE EXPERIENCIAS (HU-05)
    Route::apiResource('experiences', ExperienceController::class);
    
    // RUTAS DE ADMINISTRADOR
    Route::middleware(['admin'])->prefix('admin')->group(function () {
        Route::apiResource('usuarios', AdminUserController::class);
    });
});