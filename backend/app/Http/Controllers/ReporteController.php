<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Comentario;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class ReporteController extends Controller
{
    /**
     * Reporte de Usuarios registrados
     */
    public function usuariosPDF()
    {
        $usuarios = User::select('nombre', 'email', 'rol', 'activo', 'created_at')->get();
        $data = [
            'titulo' => 'Reporte General de Usuarios',
            'fecha' => date('d/m/Y'),
            'usuarios' => $usuarios
        ];

        $pdf = Pdf::loadView('reportes.usuarios', $data);
        return $pdf->download('reporte_usuarios_' . date('Ymd') . '.pdf');
    }

    /**
     * Reporte de Proyectos y sus métricas
     */
    public function proyectosPDF()
    {
        $proyectos = Proyecto::with(['usuario', 'categoria'])
            ->select('id', 'titulo', 'usuario_id', 'categoria_id', 'estado', 'vistas', 'created_at')
            ->get();
            
        $stats = [
            'total' => Proyecto::count(),
            'aprobados' => Proyecto::where('estado', 'aprobado')->count(),
            'vistas_totales' => Proyecto::sum('vistas')
        ];

        $pdf = Pdf::loadView('reportes.proyectos', compact('proyectos', 'stats'));
        return $pdf->download('reporte_proyectos_' . date('Ymd') . '.pdf');
    }
}