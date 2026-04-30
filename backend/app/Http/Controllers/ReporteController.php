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
        
        // NUEVO: Calculamos las estadísticas para el cuadro de resumen
        $stats = [
            'total' => $usuarios->count(),
            'activos' => $usuarios->where('activo', 1)->count(),
            'inactivos' => $usuarios->where('activo', 0)->count(),
            'admins' => $usuarios->where('rol', 'admin')->count()
        ];

        $data = [
            'titulo' => 'Reporte General de Usuarios',
            'fecha' => date('d/m/Y H:i'),
            'usuarios' => $usuarios,
            'stats' => $stats // Enviamos las estadísticas a la vista
        ];

        $pdf = Pdf::loadView('reportes.usuarios', $data);
        return $pdf->download('reporte_usuarios_' . date('Ymd') . '.pdf');
    }

    /**
     * Reporte de Proyectos y sus métricas
     */
    public function proyectosPDF()
    {
        // Quitamos el ->select(...) para que traiga toda la info y no rompa las relaciones
        $proyectos = Proyecto::with(['usuario', 'categoria'])->get();
            
        $stats = [
            'total' => Proyecto::count(),
            'aprobados' => Proyecto::where('estado', 'aprobado')->count(),
            // Usamos intval() por si la suma de vistas da null al no haber registros
            'vistas_totales' => intval(Proyecto::sum('vistas')) 
        ];

        $pdf = Pdf::loadView('reportes.proyectos', compact('proyectos', 'stats'));
        return $pdf->download('reporte_proyectos_' . date('Ymd') . '.pdf');
    }

    /**
     * Reporte de Comentarios
     */
    public function comentariosPDF()
    {
        // CORRECCIÓN: Cambiamos 'autor' por 'usuario'
        $comentarios = Comentario::with(['usuario', 'proyecto'])->orderBy('id', 'desc')->get();
            
        $stats = [
            'total' => intval(Comentario::count()),
            'pendientes' => intval(Comentario::where('aprobado', 0)->count()),
            'aprobados' => intval(Comentario::where('aprobado', 1)->count()),
            'rechazados' => intval(Comentario::where('aprobado', 2)->count()),
        ];

        $pdf = Pdf::loadView('reportes.comentarios', compact('comentarios', 'stats'));
        return $pdf->download('reporte_comentarios_' . date('Ymd') . '.pdf');
    }
}