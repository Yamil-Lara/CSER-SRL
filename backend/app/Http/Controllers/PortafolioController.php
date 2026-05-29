<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Experience;
use App\Models\VisitaPortafolio;
use App\Models\ConfiguracionVisibilidad;
use App\Traits\ApiResponseTrait;
use Illuminate\Http\Request;

class PortafolioController extends Controller
{
    use ApiResponseTrait;

    /**
     * Ver portafolio público de un usuario
     */
    public function show($username)
    {
        $query = User::where('username', $username);
        
        $authUser = auth('sanctum')->user();
        if (!$authUser || $authUser->rol !== 'admin') {
            $query->where('activo', true);
        }
        
        $user = $query->first();

        if (!$user) {
            return $this->errorResponse('Portafolio no encontrado', 404);
        }

        // Obtener configuración de visibilidad
        $config = ConfiguracionVisibilidad::where('usuario_id', $user->id)->first();
        
        $data = [
            'usuario' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'username' => $user->username,
                'email' => $user->email,
                'universidad' => $user->universidad,
                'carrera' => $user->carrera,
                'telefono' => $user->telefono,
                'profesion' => $user->profesion,
                'especialidad' => $user->especialidad,
                'biografia' => $user->biografia,
                'ubicacion' => $user->ubicacion,
                'foto' => $user->foto ? asset('storage/' . $user->foto) : null,
            ]
        ];

        // Agregar redes sociales SOLO si son visibles
        if (!$config || $config->mostrar_redes) {
            $data['redes_sociales'] = [
                'linkedin' => $user->linkedin,
                'github' => $user->github_perfil,
                'sitio_web' => $user->sitio_web,
                'facebook'   => $user->facebook,
                'instagram'  => $user->instagram,
                'twitter'    => $user->twitter,
                'tiktok'     => $user->tiktok,
                'threads'    => $user->threads,
            ];
        }

        return $this->successResponse($data);
    }

    public function registrarVisita(Request $request, $username)
    {
        $user = User::where('username', $username)->first();
        
        if (!$user) {
            return $this->errorResponse('Usuario no encontrado', 404);
        }

        $ip = $request->ip();
        $now = now();

        // Verificar si ya hubo visita en las últimas 24 horas
        $visitaReciente = VisitaPortafolio::where('usuario_id', $user->id)
            ->where('ip_address', $ip)
            ->where('visitado_en', '>=', $now->copy()->subHours(24))
            ->exists();

        if (!$visitaReciente) {
            VisitaPortafolio::create([
                'usuario_id' => $user->id,
                'ip_address' => $ip,
                'visitado_en' => $now,
            ]);
        }

        return $this->successResponse(null, 'Visita registrada');
    }

    public function proyectos($username)
    {
        $query = User::where('username', $username);
        $authUser = auth('sanctum')->user();
        if (!$authUser || $authUser->rol !== 'admin') {
            $query->where('activo', true);
        }
        $user = $query->first();

        if (!$user) {
            return $this->errorResponse('Usuario no encontrado', 404);
        }

        // Obtener configuración de visibilidad
        $config = ConfiguracionVisibilidad::where('usuario_id', $user->id)->first();
        
        // Si la sección de proyectos está oculta, devolver vacío
        if ($config && !$config->mostrar_proyectos) {
            return $this->successResponse([], 'Proyectos ocultos por el usuario');
        }

        $proyectosQuery = Proyecto::with(['categoria'])->where('usuario_id', $user->id);
        if (!$authUser || $authUser->rol !== 'admin') {
            $proyectosQuery->where('estado', 'aprobado');
        }
        $proyectos = $proyectosQuery->latest()->get();

        return $this->successResponse($proyectos);
    }

    /**
     * Listar experiencias del usuario
     */
    public function experiencias($username)
    {
        $query = User::where('username', $username);
        $authUser = auth('sanctum')->user();
        if (!$authUser || $authUser->rol !== 'admin') {
            $query->where('activo', true);
        }
        $user = $query->first();

        if (!$user) {
            return $this->errorResponse('Usuario no encontrado', 404);
        }

        // Obtener configuración de visibilidad
        $config = ConfiguracionVisibilidad::where('usuario_id', $user->id)->first();
        
        // Si la sección de experiencia está oculta, devolver vacío
        if ($config && !$config->mostrar_experiencia) {
            return $this->successResponse([], 'Experiencia oculta por el usuario');
        }

        $experiencias = Experience::where('usuario_id', $user->id)
            ->orderBy('actual', 'desc')
            ->orderBy('fecha_inicio', 'desc')
            ->get();

        return $this->successResponse($experiencias);
    }

    public function habilidades($username)
    {
        $query = User::where('username', $username);
        $authUser = auth('sanctum')->user();
        if (!$authUser || $authUser->rol !== 'admin') {
            $query->where('activo', true);
        }
        $user = $query->first();
 
        if (!$user) {
            return $this->errorResponse('Usuario no encontrado', 404);
        }
 
        $config = ConfiguracionVisibilidad::where('usuario_id', $user->id)->first();
 
        if ($config && !$config->mostrar_habilidades) {
            return $this->successResponse([], 'Habilidades ocultas por el usuario');
        }
 
        $habilidades = $user->skills()
            ->orderBy('type')
            ->orderBy('level', 'desc')
            ->get(['id', 'name', 'type', 'level']);
 
        return $this->successResponse($habilidades);
    }

}
