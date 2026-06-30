<?php

namespace App\Http\Controllers;

use App\Models\OfertaReclutador;
use Illuminate\Http\Request;
use App\Traits\ApiResponseTrait;
use Illuminate\Support\Str;

class UserOffersController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request)
    {
        $user = $request->user();
        
        $query = OfertaReclutador::where('usuario_id', $user->id);

        if ($request->has('modalidad') && $request->modalidad !== 'Todas') {
            $query->where('modalidad', 'LIKE', "%{$request->modalidad}%");
        }

        if ($request->has('estado') && $request->estado !== 'Todos') {
            $query->where('estado', $request->estado);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->where(function($q) use ($request) {
                $q->where('empresa', 'LIKE', "%{$request->search}%")
                  ->orWhere('titulo_puesto', 'LIKE', "%{$request->search}%")
                  ->orWhere('nombre', 'LIKE', "%{$request->search}%");
            });
        }

        $ofertas = $query->orderBy('created_at', 'desc')->get();

        // Asegúrate de que estas relaciones existan en App\Models\User
        $user->load(['skills', 'proyectos', 'experiencias']);
        
        $userTechSet = collect();
        
        foreach ($user->skills as $skill) {
            $userTechSet->push(Str::lower($skill->name));
        }

        foreach ($user->proyectos as $proyecto) {
            if (!empty($proyecto->tecnologias)) {
                $techs = explode(',', $proyecto->tecnologias);
                foreach ($techs as $tech) {
                    $userTechSet->push(Str::lower(trim($tech)));
                }
            }
        }
        
        $userTechSet = $userTechSet->unique();

        $ofertasTransformadas = $ofertas->map(function($oferta) use ($userTechSet) {
            // FIX 1: Prevenir errores si 'tecnologias' está vacío o es null
            $reqTechs = !empty($oferta->tecnologias) ? explode(',', $oferta->tecnologias) : [];
            $reqTechs = array_map(function($t) { return Str::lower(trim($t)); }, $reqTechs);
            $reqTechs = array_filter($reqTechs);
            
            $matchCount = 0;
            $matchedTechs = [];

            foreach ($reqTechs as $req) {
                if ($userTechSet->contains($req)) {
                    $matchCount++;
                    $matchedTechs[] = $req;
                }
            }

            $totalReq = count($reqTechs);
            $matchScore = $totalReq > 0 ? round(($matchCount / $totalReq) * 100) : 0;

            return [
                'id' => $oferta->id,
                'nombre' => $oferta->nombre,
                'empresa' => $oferta->empresa,
                'email_contacto' => $oferta->email_contacto,
                'ciudad' => $oferta->ciudad,
                'pais' => $oferta->pais,
                'titulo_puesto' => $oferta->titulo_puesto,
                'modalidad' => $oferta->modalidad,
                'tipo_contrato' => $oferta->tipo_contrato,
                'salario' => $oferta->salario,
                'tecnologias' => $oferta->tecnologias,
                'mensaje' => $oferta->mensaje,
                'estado' => $oferta->estado,
                'match_score' => $matchScore,
                'matched_techs' => $matchedTechs,
                'total_techs_required' => $totalReq,
                'created_at' => $oferta->created_at,
                // FIX 2: Validación de null para created_at
                'tiempo' => $oferta->created_at ? $oferta->created_at->diffForHumans() : 'Reciente',
            ];
        });

        return $this->successResponse($ofertasTransformadas);
    }

    public function show(Request $request, $id)
    {
        $oferta = OfertaReclutador::where('usuario_id', $request->user()->id)->findOrFail($id);
        
        if ($oferta->estado === 'nuevo') {
            $oferta->estado = 'visto';
            $oferta->save();
        }

        return $this->successResponse($oferta);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'estado' => 'required|in:visto,en_conversacion,aceptado,rechazado,archivado'
        ]);

        $oferta = OfertaReclutador::where('usuario_id', $request->user()->id)->findOrFail($id);
        $oferta->estado = $request->estado;
        $oferta->save();

        return $this->successResponse($oferta, 'Estado actualizado');
    }
    
    public function getDashboardStats(Request $request)
    {
        $user = $request->user();
        
        $totalProyectos = \App\Models\Proyecto::where('usuario_id', $user->id)->where('estado', 'aprobado')->count();
        $totalVisitas = \App\Models\VisitaPortafolio::where('usuario_id', $user->id)->count();
        
        $totalComentarios = \App\Models\Comentario::whereHas('proyecto', function($q) use ($user) {
            $q->where('usuario_id', $user->id)->where('estado', 'aprobado');
        })
        ->where('aprobado', 1)
        ->whereNull('parent_id')
        ->where('usuario_id', '!=', $user->id)
        ->whereHas('usuario', function ($q) {
            $q->where('rol', '!=', 'admin');
        })
        ->count();
        
        // Asegúrate de que las relaciones 'respuestas' e 'interacciones' 
        // existan de verdad en el modelo App\Models\Comentario
        $comentariosPorResponder = \App\Models\Comentario::whereHas('proyecto', function($q) use ($user) {
            $q->where('usuario_id', $user->id);
        })
        ->where('aprobado', 1)
        ->whereNull('parent_id') 
        ->where('usuario_id', '!=', $user->id) 
        ->whereDoesntHave('respuestas', function ($q) use ($user) {
            $q->where('usuario_id', $user->id);
        })
        ->whereDoesntHave('interacciones', function ($q) use ($user) {
            $q->where('usuario_id', $user->id);
        })
        ->count();
        
        $mensajesNuevosReclutadores = OfertaReclutador::where('usuario_id', $user->id)
            ->where('estado', 'nuevo')
            ->count();
            
        $mensajesAceptadosReclutadores = OfertaReclutador::where('usuario_id', $user->id)
            ->whereIn('estado', ['aceptado', 'en_conversacion'])
            ->count();
            
        $totalReclutadores = OfertaReclutador::where('usuario_id', $user->id)->count();
        
        $ultimosReclutadores = OfertaReclutador::where('usuario_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->take(3)
            ->get()->map(function($of) {
                return [
                    'id' => $of->id,
                    'nombre' => $of->nombre,
                    'empresa' => $of->empresa,
                    'modalidad' => $of->modalidad,
                    'titulo_puesto' => $of->titulo_puesto,
                    'estado' => $of->estado,
                    // FIX 3: Validación de null para created_at
                    'created_at' => $of->created_at ? $of->created_at->format('d/m/Y') : 'N/A',
                ];
            });

        return $this->successResponse([
            'proyectos_publicados' => $totalProyectos,
            'visitas_perfil' => $totalVisitas,
            'comentarios_recibidos' => $totalComentarios,
            'apariciones_busqueda' => $user->apariciones_busqueda ?? 0,
            'comentarios_por_responder' => $comentariosPorResponder,
            'mensajes_reclutadores_nuevos' => $mensajesNuevosReclutadores,
            'mensajes_reclutadores_aceptados' => $mensajesAceptadosReclutadores,
            'mensajes_reclutadores_total' => $totalReclutadores,
            'ultimas_ofertas' => $ultimosReclutadores
        ]);
    }
}