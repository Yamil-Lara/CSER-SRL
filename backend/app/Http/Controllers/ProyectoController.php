<?php

namespace App\Http\Controllers;

use App\Http\Requests\Proyecto\StoreProyectoRequest;
use App\Http\Requests\Proyecto\UpdateProyectoRequest;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class ProyectoController extends Controller
{
    use ApiResponseTrait;

    // === TOMA LA VERSIÓN DE ÉL (Visibilidad) ===
    public function index(\Illuminate\Http\Request $request): JsonResponse
    {
        $query = Proyecto::with(['categoria', 'usuario:id,nombre,email,foto']);

        $user = auth('sanctum')->user();

        if ($user) {
            if ($user->rol !== 'admin') {
                $query->where('usuario_id', $user->id);
            }
        } else {
            $query->where('estado', 'aprobado');
        }

        $proyectos = $query->latest()->get();
        
        return $this->successResponse($proyectos, 'Proyectos obtenidos exitosamente');
    }

    public function store(StoreProyectoRequest $request): JsonResponse
    {
        $data = $request->validated();
        $data['usuario_id'] = auth()->id();
        $data['estado'] = 'pendiente';

        if ($request->hasFile('imagen')) {
            $data['imagen'] = $request->file('imagen')->store('proyectos', 'public');
        }

        $proyecto = Proyecto::create($data);

        return $this->successResponse(
            $proyecto->load(['categoria', 'usuario']),
            'Proyecto creado exitosamente',
            201
        );
    }

    // === TOMA TU VERSIÓN (prueba_javi) pero MEJORADA ===
    public function show($id): JsonResponse
    {
        // PRIMERO: Verificar si el usuario está autenticado (de él)
        $user = auth('sanctum')->user();
        
        // SEGUNDO: Construir consulta según el usuario (de él)
        $query = Proyecto::with(['categoria', 'usuario:id,nombre,email,foto']);
        
        if (!$user) {
            // Usuario anónimo: solo ve aprobados (de él)
            $query->where('estado', 'aprobado');
        } elseif ($user->rol !== 'admin') {
            // Usuario normal: ve sus proyectos + los aprobados (MEZCLA)
            $query->where(function($q) use ($user) {
                $q->where('usuario_id', $user->id)
                  ->orWhere('estado', 'aprobado');
            });
        }
        // Admin: ve todo (sin filtro)
        
        $proyecto = $query->find($id);

        if (!$proyecto) {
            return $this->errorResponse('Proyecto no disponible', 404);
        }

        // TERCERO: Tu funcionalidad de vistas
        $proyecto->increment('vistas');

        return $this->successResponse($proyecto);
    }

    public function update(UpdateProyectoRequest $request, $id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return $this->errorResponse('Proyecto no encontrado', 404);
        }

        $user = auth()->user();
        if ($user->id !== $proyecto->usuario_id && $user->rol !== 'admin') {
            return $this->errorResponse('No tienes permiso para editar este proyecto', 403);
        }

        $data = $request->validated();

        if ($request->hasFile('imagen')) {
            if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
                Storage::disk('public')->delete($proyecto->imagen);
            }
            $data['imagen'] = $request->file('imagen')->store('proyectos', 'public');
        }

        $proyecto->update($data);

        return $this->successResponse(
            $proyecto->fresh(['categoria', 'usuario']),
            'Proyecto actualizado exitosamente'
        );
    }

    public function destroy($id): JsonResponse
    {
        $proyecto = Proyecto::find($id);

        if (!$proyecto) {
            return $this->errorResponse('Proyecto no encontrado', 404);
        }

        $user = auth()->user();
        if ($user->id !== $proyecto->usuario_id && $user->rol !== 'admin') {
            return $this->errorResponse('No tienes permiso para eliminar este proyecto', 403);
        }

        if ($proyecto->imagen && Storage::disk('public')->exists($proyecto->imagen)) {
            Storage::disk('public')->delete($proyecto->imagen);
        }

        $proyecto->delete();

        return $this->successResponse(null, 'Proyecto eliminado exitosamente');
    }

    // NUEVO MÉTODO PARA EL ADMINISTRADOR
    public function pendientes()
    {
        // Traemos los proyectos con estado 'pendiente', incluyendo datos del usuario y la categoría
        $proyectos = Proyecto::with(['usuario', 'categoria'])
            ->where('estado', 'pendiente')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $proyectos
        ]);
    }

    public function adminIndex(Request $request)
    {
        // Obtenemos los conteos para el dashboard
        $stats = [
            'total' => \App\Models\Proyecto::count(),
            'pendientes' => \App\Models\Proyecto::where('estado', 'pendiente')->count(),
            'aprobados' => \App\Models\Proyecto::where('estado', 'aprobado')->count(),
            'rechazados' => \App\Models\Proyecto::where('estado', 'rechazado')->count(),
        ];

        // Obtenemos la lista de proyectos con sus relaciones
        $query = \App\Models\Proyecto::with(['usuario', 'categoria'])->latest();

        // Filtro opcional por estado
        if ($request->has('estado') && $request->estado !== 'todos') {
            $query->where('estado', $request->estado);
        }

        // Paginamos de 15 en 15
        $proyectos = $query->paginate($request->get('per_page', 15));

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'proyectos' => $proyectos
            ]
        ]);
    }

    public function actualizarEstado(Request $request, $id)
    {
        $request->validate([
            // Asegura que los estados sean válidos, incluyendo 'pendiente'
            'estado' => 'required|in:pendiente,aprobado,rechazado' 
        ]);

        $proyecto = \App\Models\Proyecto::findOrFail($id);
        $proyecto->estado = $request->estado;
        $proyecto->save();

        return response()->json([
            'success' => true,
            'message' => 'Estado del proyecto actualizado.',
            'data' => $proyecto
        ]);
    }
}