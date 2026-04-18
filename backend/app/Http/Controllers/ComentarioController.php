<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Proyecto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ComentarioController extends Controller
{
    public function indexByProyecto($proyectoId)
    {
        $comentarios = Comentario::with('usuario:id,nombre,apellido')
            ->where('proyecto_id', $proyectoId)
            ->where('is_approved', true) // Solo muestra los aprobados
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($comentarios);
    }

    public function store(Request $request, $proyectoId)
    {
        $request->validate(['contenido' => 'required|string|max:1000']);

        $comentario = Comentario::create([
            'proyecto_id' => $proyectoId,
            'usuario_id' => Auth::id(),
            'contenido' => $request->contenido,
            'is_approved' => false, 
        ]);

        return response()->json([
            'message' => 'Comentario enviado exitosamente.',
            'comentario' => $comentario
        ], 201);
    }
}