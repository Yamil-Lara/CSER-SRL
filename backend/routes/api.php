<?php
use App\Http\Controllers\PortafolioController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\User\AdminUserController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\SkillController;

use App\Http\Controllers\VisibilidadController; 

use App\Http\Controllers\ExperienceController;
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





// ===== HU-06: Portafolio público =====
Route::get('/portafolio/{username}', [PortafolioController::class, 'show']);
Route::post('/portafolio/{username}/visita', [PortafolioController::class, 'registrarVisita']);
Route::get('/portafolio/{username}/proyectos', [PortafolioController::class, 'proyectos']);
Route::get('/portafolio/{username}/experiencias', [PortafolioController::class, 'experiencias']);




















// RUTAS PROTEGIDAS
Route::middleware(['auth:sanctum', 'usuario.activo'])->group(function () {
    
    Route::post('/logout', LogoutController::class);
    
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::delete('/', [ProfileController::class, 'destroy']);
    });


      // ===== HU-08: Control de visibilidad =====
        Route::get('/visibilidad', [VisibilidadController::class, 'show']);
        Route::put('/visibilidad', [VisibilidadController::class, 'update']);


    
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
