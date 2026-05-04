<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ExploreController;
use App\Http\Controllers\PortafolioController;
use App\Http\Controllers\ProyectoController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\User\AdminUserController;
use App\Http\Controllers\User\ProfileController;
use App\Http\Controllers\VisibilidadController;
use App\Http\Controllers\AdminSystemController;
use Illuminate\Support\Facades\Route;

// ============================================================
// RUTAS PÚBLICAS
// ============================================================

Route::get('/status', function () {
    return response()->json(['status' => 'OK', 'message' => 'CSER API Conectada']);
});

Route::post('/register', RegisterController::class);
Route::post('/login', LoginController::class);

Route::get('/proyectos', [ProyectoController::class, 'index']);
Route::get('/proyectos/{id}', [ProyectoController::class, 'show']);
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/usuarios/{id}', [AdminUserController::class, 'show']);

// HU-06: Portafolio público
Route::get('/portafolio/{username}', [PortafolioController::class, 'show']);
Route::post('/portafolio/{username}/visita', [PortafolioController::class, 'registrarVisita']);
Route::get('/portafolio/{username}/proyectos', [PortafolioController::class, 'proyectos']);
Route::get('/portafolio/{username}/experiencias', [PortafolioController::class, 'experiencias']);
Route::get('/portafolio/{username}/habilidades', [PortafolioController::class, 'habilidades']);

// HU-09: Explorador público
Route::prefix('explore')->group(function () {
    Route::get('/users', [ExploreController::class, 'users']);
    Route::get('/projects', [ExploreController::class, 'projects']);
});

// HU-11: Comentarios (GET es público, POST es protegido - ver abajo)
Route::get('/proyectos/{id}/comentarios', [ComentarioController::class, 'index']);

// ============================================================
// RUTAS PROTEGIDAS (requieren token)
// ============================================================

Route::middleware(['auth:sanctum', 'usuario.activo'])->group(function () {

    Route::post('/logout', LogoutController::class);

    // HU-02: Perfil profesional
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::delete('/', [ProfileController::class, 'destroy']);
    });

    // HU-08: Control de visibilidad
    Route::get('/visibilidad', [VisibilidadController::class, 'show']);
    Route::put('/visibilidad', [VisibilidadController::class, 'update']);

    // HU-03: Gestión de proyectos
    Route::post('/proyectos', [ProyectoController::class, 'store']);
    Route::put('/proyectos/{id}', [ProyectoController::class, 'update']);
    Route::delete('/proyectos/{id}', [ProyectoController::class, 'destroy']);

    // HU-04: Habilidades
    Route::apiResource('skills', SkillController::class);

    // HU-05: Experiencias
    Route::apiResource('experiences', ExperienceController::class);

    // HU-11: Publicar comentario (autenticado)
    Route::post('/proyectos/{id}/comentarios', [ComentarioController::class, 'store']);

    // NUEVAS RUTAS PARA LA ADMINISTRACIÓN DE COMENTARIOS
    Route::get('/proyectos/{id}/comentarios/admin', [ComentarioController::class, 'adminIndex']);
    Route::put('/comentarios/{id}/estado', [ComentarioController::class, 'updateEstado']);
    Route::delete('/comentarios/{id}', [ComentarioController::class, 'destroy']);

    Route::middleware(['admin'])->prefix('gestion')->group(function () {
        Route::apiResource('usuarios', AdminUserController::class);
        Route::get('/comentarios/pendientes', [ComentarioController::class, 'adminIndexAll']);
        
        // AGREGAR ESTAS DOS RUTAS:
        Route::get('/proyectos', [\App\Http\Controllers\ProyectoController::class, 'adminIndex']);
        Route::put('/proyectos/{id}/estado', [\App\Http\Controllers\ProyectoController::class, 'actualizarEstado']);
        
        // Backups
        Route::get('/backups', [\App\Http\Controllers\AdminSystemController::class, 'indexBackups']);
        Route::post('/backups', [\App\Http\Controllers\AdminSystemController::class, 'createBackup']);
        Route::get('/backups/download/{filename}', [\App\Http\Controllers\AdminSystemController::class, 'downloadBackup']);
        Route::delete('/backups/{filename}', [\App\Http\Controllers\AdminSystemController::class, 'deleteBackup']);

        // Logs
        Route::get('/logs', [AdminSystemController::class, 'getLogs']);

        // PDF Reportes
        Route::get('/reportes/usuarios', [\App\Http\Controllers\ReporteController::class, 'usuariosPDF']);
        Route::get('/reportes/proyectos', [\App\Http\Controllers\ReporteController::class, 'proyectosPDF']);
        Route::get('/reportes/comentarios', [\App\Http\Controllers\ReporteController::class, 'comentariosPDF']);
    });

    // En la sección de RUTAS PÚBLICAS (fuera del middleware auth:sanctum)
    Route::get('/proyectos/{proyectoId}/comentarios', [\App\Http\Controllers\ComentarioController::class, 'index']);

    // En la sección de RUTAS PROTEGIDAS (dentro del middleware auth:sanctum)
    Route::post('/proyectos/{proyectoId}/comentarios', [\App\Http\Controllers\ComentarioController::class, 'store']);

});
