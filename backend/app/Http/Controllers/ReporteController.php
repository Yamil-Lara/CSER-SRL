<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Proyecto;
use App\Models\Comentario;
use App\Models\Categoria;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Carbon\Carbon;

class ReporteController extends Controller
{
    // ================================================================
    // HELPER: Parsear periodo de fechas desde query params
    // ================================================================

    private function parsePeriodo(Request $request): array
    {
        $inicio = $request->query('fecha_inicio');
        $fin = $request->query('fecha_fin');

        if ($inicio && $fin) {
            return [
                Carbon::parse($inicio)->startOfDay(),
                Carbon::parse($fin)->endOfDay(),
            ];
        }

        // Default: mes actual
        return [
            Carbon::now()->startOfMonth(),
            Carbon::now()->endOfDay(),
        ];
    }

    private function periodoTexto(Request $request): string
    {
        $inicio = $request->query('fecha_inicio');
        $fin = $request->query('fecha_fin');

        if ($inicio && $fin) {
            return Carbon::parse($inicio)->format('d/m/Y') . ' - ' . Carbon::parse($fin)->format('d/m/Y');
        }

        return 'Mes actual (' . Carbon::now()->startOfMonth()->format('d/m/Y') . ' - ' . Carbon::now()->format('d/m/Y') . ')';
    }

    // ================================================================
    // DATOS JSON - Para previsualización en pantalla
    // ================================================================

    /**
     * Datos del Reporte de Usuarios
     */
    public function datosUsuarios(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        $totalRegistrados = User::whereBetween('created_at', [$inicio, $fin])->count();
        $activos = User::where('activo', 1)->whereBetween('created_at', [$inicio, $fin])->count();
        $inactivos = User::where('activo', 0)->whereBetween('created_at', [$inicio, $fin])->count();

        // Distribución por rol
        $porRol = User::whereBetween('created_at', [$inicio, $fin])
            ->selectRaw('rol, COUNT(*) as total')
            ->groupBy('rol')
            ->pluck('total', 'rol');

        // Registros por semana
        $porSemana = User::whereBetween('created_at', [$inicio, $fin])
            ->selectRaw('YEARWEEK(created_at, 1) as semana, COUNT(*) as total')
            ->groupBy('semana')
            ->orderBy('semana')
            ->get()
            ->map(function ($item) {
                // Convertir YEARWEEK a fecha legible
                $year = substr($item->semana, 0, 4);
                $week = substr($item->semana, 4);
                $date = Carbon::now()->setISODate($year, $week)->startOfWeek();
                return [
                    'semana' => $date->format('d/m/Y'),
                    'total' => $item->total,
                ];
            });

        // Cuentas desactivadas en el periodo
        $desactivadas = User::where('activo', 0)->whereBetween('updated_at', [$inicio, $fin])->count();

        // Listado detallado
        $usuarios = User::whereBetween('created_at', [$inicio, $fin])
            ->select('nombre', 'email', 'rol', 'activo', 'estado', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'periodo' => $this->periodoTexto($request),
                'total_registrados' => $totalRegistrados,
                'activos' => $activos,
                'inactivos' => $inactivos,
                'desactivadas' => $desactivadas,
                'por_rol' => $porRol,
                'por_semana' => $porSemana,
                'usuarios' => $usuarios,
                'fecha_actualizacion' => now()->format('d/m/Y H:i:s'),
            ]
        ]);
    }

    /**
     * Datos del Reporte de Proyectos
     */
    public function datosProyectos(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        $total = Proyecto::whereBetween('created_at', [$inicio, $fin])->count();
        $aprobados = Proyecto::where('estado', 'aprobado')->whereBetween('created_at', [$inicio, $fin])->count();
        $rechazados = Proyecto::where('estado', 'rechazado')->whereBetween('created_at', [$inicio, $fin])->count();
        $pendientes = Proyecto::where('estado', 'pendiente')->whereBetween('created_at', [$inicio, $fin])->count();

        // Por semana
        $porSemana = Proyecto::whereBetween('created_at', [$inicio, $fin])
            ->selectRaw('YEARWEEK(created_at, 1) as semana, estado, COUNT(*) as total')
            ->groupBy('semana', 'estado')
            ->orderBy('semana')
            ->get()
            ->groupBy('semana')
            ->map(function ($items, $semana) {
                $year = substr($semana, 0, 4);
                $week = substr($semana, 4);
                $date = Carbon::now()->setISODate($year, $week)->startOfWeek();
                $result = ['semana' => $date->format('d/m/Y'), 'creados' => 0, 'aprobados' => 0, 'rechazados' => 0, 'pendientes' => 0];
                foreach ($items as $item) {
                    $result[$item->estado . 's'] = $item->total;
                    if ($item->estado === 'aprobado') $result['aprobados'] = $item->total;
                    if ($item->estado === 'rechazado') $result['rechazados'] = $item->total;
                    if ($item->estado === 'pendiente') $result['pendientes'] = $item->total;
                    $result['creados'] += $item->total;
                }
                return $result;
            })->values();

        // Distribución por categoría
        $porCategoria = Proyecto::whereBetween('proyectos.created_at', [$inicio, $fin])
            ->join('categorias', 'proyectos.categoria_id', '=', 'categorias.id')
            ->selectRaw('categorias.nombre as categoria, COUNT(*) as total')
            ->groupBy('categorias.nombre')
            ->pluck('total', 'categoria');

        $vistasTotal = intval(Proyecto::whereBetween('created_at', [$inicio, $fin])->sum('vistas'));

        // Listado detallado
        $proyectos = Proyecto::with(['usuario:id,nombre', 'categoria:id,nombre'])
            ->whereBetween('created_at', [$inicio, $fin])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'periodo' => $this->periodoTexto($request),
                'total' => $total,
                'aprobados' => $aprobados,
                'rechazados' => $rechazados,
                'pendientes' => $pendientes,
                'vistas_totales' => $vistasTotal,
                'por_semana' => $porSemana,
                'por_categoria' => $porCategoria,
                'proyectos' => $proyectos,
                'fecha_actualizacion' => now()->format('d/m/Y H:i:s'),
            ]
        ]);
    }

    /**
     * Datos del Reporte de Moderación de Comentarios
     */
    public function datosComentarios(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        $total = Comentario::whereBetween('created_at', [$inicio, $fin])->count();
        $aprobados = Comentario::where('aprobado', 1)->whereBetween('created_at', [$inicio, $fin])->count();
        $rechazados = Comentario::where('aprobado', 2)->whereBetween('created_at', [$inicio, $fin])->count();
        $pendientes = Comentario::where('aprobado', 0)->whereBetween('created_at', [$inicio, $fin])->count();

        // Por semana
        $porSemana = Comentario::whereBetween('created_at', [$inicio, $fin])
            ->selectRaw('YEARWEEK(created_at, 1) as semana, aprobado, COUNT(*) as total')
            ->groupBy('semana', 'aprobado')
            ->orderBy('semana')
            ->get()
            ->groupBy('semana')
            ->map(function ($items, $semana) {
                $year = substr($semana, 0, 4);
                $week = substr($semana, 4);
                $date = Carbon::now()->setISODate($year, $week)->startOfWeek();
                $result = ['semana' => $date->format('d/m/Y'), 'revisados' => 0, 'aprobados' => 0, 'rechazados' => 0, 'pendientes' => 0];
                foreach ($items as $item) {
                    if ($item->aprobado === 1) $result['aprobados'] = $item->total;
                    elseif ($item->aprobado === 2) $result['rechazados'] = $item->total;
                    else $result['pendientes'] = $item->total;
                    $result['revisados'] += $item->total;
                }
                return $result;
            })->values();

        // Detalle de comentarios con moderador (admin que cambió el estado)
        $comentarios = Comentario::with(['usuario:id,nombre', 'proyecto:id,titulo'])
            ->whereBetween('created_at', [$inicio, $fin])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'periodo' => $this->periodoTexto($request),
                'total' => $total,
                'aprobados' => $aprobados,
                'rechazados' => $rechazados,
                'pendientes' => $pendientes,
                'por_semana' => $porSemana,
                'comentarios' => $comentarios,
                'fecha_actualizacion' => now()->format('d/m/Y H:i:s'),
            ]
        ]);
    }

    /**
     * Datos del Reporte General (Resumen Ejecutivo)
     */
    public function datosGeneral(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        // Usuarios
        $totalUsuarios = User::whereBetween('created_at', [$inicio, $fin])->count();
        $usuariosActivos = User::where('activo', 1)->whereBetween('created_at', [$inicio, $fin])->count();
        $porRol = User::whereBetween('created_at', [$inicio, $fin])
            ->selectRaw('rol, COUNT(*) as total')
            ->groupBy('rol')
            ->pluck('total', 'rol');

        // Proyectos
        $totalProyectos = Proyecto::whereBetween('created_at', [$inicio, $fin])->count();
        $proyectosAprobados = Proyecto::where('estado', 'aprobado')->whereBetween('created_at', [$inicio, $fin])->count();
        $proyectosRechazados = Proyecto::where('estado', 'rechazado')->whereBetween('created_at', [$inicio, $fin])->count();
        $proyectosPendientes = Proyecto::where('estado', 'pendiente')->whereBetween('created_at', [$inicio, $fin])->count();

        // Comentarios
        $totalComentarios = Comentario::whereBetween('created_at', [$inicio, $fin])->count();
        $comentariosAprobados = Comentario::where('aprobado', 1)->whereBetween('created_at', [$inicio, $fin])->count();
        $comentariosRechazados = Comentario::where('aprobado', 2)->whereBetween('created_at', [$inicio, $fin])->count();
        $comentariosPendientes = Comentario::where('aprobado', 0)->whereBetween('created_at', [$inicio, $fin])->count();

        // Alertas activas
        $alertas = [];
        $pendProyectos = Proyecto::where('estado', 'pendiente')->count();
        $pendComentarios = Comentario::where('aprobado', 0)->count();
        $pendUsuarios = User::where('estado', 'pendiente')->count();

        if ($pendProyectos > 0) {
            $alertas[] = ['tipo' => 'warning', 'mensaje' => "{$pendProyectos} proyecto(s) pendiente(s) de aprobación"];
        }
        if ($pendComentarios > 0) {
            $alertas[] = ['tipo' => 'warning', 'mensaje' => "{$pendComentarios} comentario(s) pendiente(s) de moderación"];
        }
        if ($pendUsuarios > 0) {
            $alertas[] = ['tipo' => 'info', 'mensaje' => "{$pendUsuarios} usuario(s) pendiente(s) de revisión"];
        }

        return response()->json([
            'success' => true,
            'data' => [
                'periodo' => $this->periodoTexto($request),
                'usuarios' => [
                    'total' => $totalUsuarios,
                    'activos' => $usuariosActivos,
                    'por_rol' => $porRol,
                ],
                'proyectos' => [
                    'total' => $totalProyectos,
                    'aprobados' => $proyectosAprobados,
                    'rechazados' => $proyectosRechazados,
                    'pendientes' => $proyectosPendientes,
                ],
                'comentarios' => [
                    'total' => $totalComentarios,
                    'aprobados' => $comentariosAprobados,
                    'rechazados' => $comentariosRechazados,
                    'pendientes' => $comentariosPendientes,
                ],
                'alertas' => $alertas,
                'fecha_actualizacion' => now()->format('d/m/Y H:i:s'),
            ]
        ]);
    }

    // ================================================================
    // EXPORTAR PDF
    // ================================================================

    /**
     * Reporte de Usuarios en PDF
     */
    public function usuariosPDF(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        $usuarios = User::whereBetween('created_at', [$inicio, $fin])
            ->select('nombre', 'email', 'rol', 'activo', 'estado', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => $usuarios->count(),
            'activos' => $usuarios->where('activo', 1)->count(),
            'inactivos' => $usuarios->where('activo', 0)->count(),
            'admins' => $usuarios->where('rol', 'admin')->count(),
        ];

        $porRol = $usuarios->groupBy('rol')->map->count();

        $data = [
            'titulo' => 'Reporte de Usuarios',
            'fecha' => date('d/m/Y H:i'),
            'periodo' => $this->periodoTexto($request),
            'usuarios' => $usuarios,
            'stats' => $stats,
            'porRol' => $porRol,
        ];

        $pdf = Pdf::loadView('reportes.usuarios', $data);
        $pdf->setPaper('A4', 'landscape');
        return $pdf->download('reporte_usuarios_' . date('Ymd_His') . '.pdf');
    }

    /**
     * Reporte de Proyectos en PDF
     */
    public function proyectosPDF(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        $proyectos = Proyecto::with(['usuario', 'categoria'])
            ->whereBetween('created_at', [$inicio, $fin])
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => $proyectos->count(),
            'aprobados' => $proyectos->where('estado', 'aprobado')->count(),
            'rechazados' => $proyectos->where('estado', 'rechazado')->count(),
            'pendientes' => $proyectos->where('estado', 'pendiente')->count(),
            'vistas_totales' => intval($proyectos->sum('vistas')),
        ];

        $porCategoria = $proyectos->groupBy(function ($p) {
            return $p->categoria->nombre ?? 'Sin categoría';
        })->map->count();

        $data = [
            'titulo' => 'Reporte de Proyectos',
            'fecha' => date('d/m/Y H:i'),
            'periodo' => $this->periodoTexto($request),
            'proyectos' => $proyectos,
            'stats' => $stats,
            'porCategoria' => $porCategoria,
        ];

        $pdf = Pdf::loadView('reportes.proyectos', $data);
        $pdf->setPaper('A4', 'landscape');
        return $pdf->download('reporte_proyectos_' . date('Ymd_His') . '.pdf');
    }

    /**
     * Reporte de Comentarios en PDF
     */
    public function comentariosPDF(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        $comentarios = Comentario::with(['usuario', 'proyecto'])
            ->whereBetween('created_at', [$inicio, $fin])
            ->orderBy('created_at', 'desc')
            ->get();

        $stats = [
            'total' => intval($comentarios->count()),
            'pendientes' => intval($comentarios->where('aprobado', 0)->count()),
            'aprobados' => intval($comentarios->where('aprobado', 1)->count()),
            'rechazados' => intval($comentarios->where('aprobado', 2)->count()),
        ];

        $data = [
            'titulo' => 'Reporte de Moderación de Comentarios',
            'fecha' => date('d/m/Y H:i'),
            'periodo' => $this->periodoTexto($request),
            'comentarios' => $comentarios,
            'stats' => $stats,
        ];

        $pdf = Pdf::loadView('reportes.comentarios', $data);
        $pdf->setPaper('A4', 'landscape');
        return $pdf->download('reporte_comentarios_' . date('Ymd_His') . '.pdf');
    }

    /**
     * Reporte General (Resumen Ejecutivo) en PDF
     */
    public function generalPDF(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);

        $data = [
            'titulo' => 'Reporte General del Sistema',
            'fecha' => date('d/m/Y H:i'),
            'periodo' => $this->periodoTexto($request),
            'usuarios' => [
                'total' => User::whereBetween('created_at', [$inicio, $fin])->count(),
                'activos' => User::where('activo', 1)->whereBetween('created_at', [$inicio, $fin])->count(),
                'inactivos' => User::where('activo', 0)->whereBetween('created_at', [$inicio, $fin])->count(),
                'por_rol' => User::whereBetween('created_at', [$inicio, $fin])
                    ->selectRaw('rol, COUNT(*) as total')
                    ->groupBy('rol')
                    ->pluck('total', 'rol'),
            ],
            'proyectos' => [
                'total' => Proyecto::whereBetween('created_at', [$inicio, $fin])->count(),
                'aprobados' => Proyecto::where('estado', 'aprobado')->whereBetween('created_at', [$inicio, $fin])->count(),
                'rechazados' => Proyecto::where('estado', 'rechazado')->whereBetween('created_at', [$inicio, $fin])->count(),
                'pendientes' => Proyecto::where('estado', 'pendiente')->whereBetween('created_at', [$inicio, $fin])->count(),
                'por_categoria' => Proyecto::whereBetween('proyectos.created_at', [$inicio, $fin])
                    ->join('categorias', 'proyectos.categoria_id', '=', 'categorias.id')
                    ->selectRaw('categorias.nombre as categoria, COUNT(*) as total')
                    ->groupBy('categorias.nombre')
                    ->pluck('total', 'categoria'),
            ],
            'comentarios' => [
                'total' => Comentario::whereBetween('created_at', [$inicio, $fin])->count(),
                'aprobados' => Comentario::where('aprobado', 1)->whereBetween('created_at', [$inicio, $fin])->count(),
                'rechazados' => Comentario::where('aprobado', 2)->whereBetween('created_at', [$inicio, $fin])->count(),
                'pendientes' => Comentario::where('aprobado', 0)->whereBetween('created_at', [$inicio, $fin])->count(),
            ],
            'alertas_activas' => $this->getAlertasActivas(),
        ];

        $pdf = Pdf::loadView('reportes.general', $data);
        $pdf->setPaper('A4', 'portrait');
        return $pdf->download('reporte_general_' . date('Ymd_His') . '.pdf');
    }

    private function getAlertasActivas(): array
    {
        $alertas = [];
        $pendProyectos = Proyecto::where('estado', 'pendiente')->count();
        $pendComentarios = Comentario::where('aprobado', 0)->count();
        $pendUsuarios = User::where('estado', 'pendiente')->count();

        if ($pendProyectos > 0) {
            $alertas[] = "{$pendProyectos} proyecto(s) pendiente(s) de aprobación";
        }
        if ($pendComentarios > 0) {
            $alertas[] = "{$pendComentarios} comentario(s) pendiente(s) de moderación";
        }
        if ($pendUsuarios > 0) {
            $alertas[] = "{$pendUsuarios} usuario(s) pendiente(s) de revisión";
        }
        if (empty($alertas)) {
            $alertas[] = "No hay alertas activas — todo al día.";
        }

        return $alertas;
    }

    // ================================================================
    // EXPORTAR EXCEL
    // ================================================================

    /**
     * Estilos base para encabezados de Excel
     */
    private function applyHeaderStyle($sheet, string $range): void
    {
        $sheet->getStyle($range)->applyFromArray([
            'font' => ['bold' => true, 'color' => ['rgb' => 'FFFFFF'], 'size' => 11],
            'fill' => ['fillType' => Fill::FILL_SOLID, 'startColor' => ['rgb' => '2563EB']],
            'alignment' => ['horizontal' => Alignment::HORIZONTAL_CENTER, 'vertical' => Alignment::VERTICAL_CENTER],
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'D1D5DB']]],
        ]);
    }

    private function applyDataStyle($sheet, string $range): void
    {
        $sheet->getStyle($range)->applyFromArray([
            'borders' => ['allBorders' => ['borderStyle' => Border::BORDER_THIN, 'color' => ['rgb' => 'E5E7EB']]],
            'alignment' => ['vertical' => Alignment::VERTICAL_CENTER],
        ]);
    }

    /**
     * Reporte de Usuarios en Excel
     */
    public function usuariosExcel(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);
        $periodoTexto = $this->periodoTexto($request);

        $usuarios = User::whereBetween('created_at', [$inicio, $fin])
            ->select('nombre', 'email', 'rol', 'activo', 'estado', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Usuarios');

        // Título
        $sheet->setCellValue('A1', 'CSER-SRL — Reporte de Usuarios');
        $sheet->mergeCells('A1:F1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->setCellValue('A2', 'Periodo: ' . $periodoTexto);
        $sheet->mergeCells('A2:F2');
        $sheet->setCellValue('A3', 'Generado: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A3:F3');

        // Resumen
        $sheet->setCellValue('A5', 'Total Registrados');
        $sheet->setCellValue('B5', $usuarios->count());
        $sheet->setCellValue('C5', 'Activos');
        $sheet->setCellValue('D5', $usuarios->where('activo', 1)->count());
        $sheet->setCellValue('E5', 'Inactivos');
        $sheet->setCellValue('F5', $usuarios->where('activo', 0)->count());
        $sheet->getStyle('A5:F5')->getFont()->setBold(true);

        // Headers tabla
        $headers = ['Nombre', 'Correo Electrónico', 'Rol', 'Estado Cuenta', 'Activo', 'Fecha Registro'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '7', $header);
            $col++;
        }
        $this->applyHeaderStyle($sheet, 'A7:F7');

        // Data
        $row = 8;
        foreach ($usuarios as $u) {
            $sheet->setCellValue('A' . $row, $u->nombre);
            $sheet->setCellValue('B' . $row, $u->email);
            $sheet->setCellValue('C' . $row, strtoupper($u->rol));
            $sheet->setCellValue('D' . $row, ucfirst($u->estado ?? 'N/A'));
            $sheet->setCellValue('E' . $row, $u->activo ? 'Activo' : 'Inactivo');
            $sheet->setCellValue('F' . $row, $u->created_at ? $u->created_at->format('d/m/Y') : 'N/A');
            $row++;
        }

        if ($row > 8) {
            $this->applyDataStyle($sheet, 'A8:F' . ($row - 1));
        }

        // Auto-size columns
        foreach (range('A', 'F') as $colLetter) {
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        return $this->downloadExcel($spreadsheet, 'reporte_usuarios_' . date('Ymd_His'));
    }

    /**
     * Reporte de Proyectos en Excel
     */
    public function proyectosExcel(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);
        $periodoTexto = $this->periodoTexto($request);

        $proyectos = Proyecto::with(['usuario', 'categoria'])
            ->whereBetween('created_at', [$inicio, $fin])
            ->orderBy('created_at', 'desc')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Proyectos');

        // Título
        $sheet->setCellValue('A1', 'CSER-SRL — Reporte de Proyectos');
        $sheet->mergeCells('A1:G1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->setCellValue('A2', 'Periodo: ' . $periodoTexto);
        $sheet->mergeCells('A2:G2');
        $sheet->setCellValue('A3', 'Generado: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A3:G3');

        // Resumen
        $sheet->setCellValue('A5', 'Total');
        $sheet->setCellValue('B5', $proyectos->count());
        $sheet->setCellValue('C5', 'Aprobados');
        $sheet->setCellValue('D5', $proyectos->where('estado', 'aprobado')->count());
        $sheet->setCellValue('E5', 'Pendientes');
        $sheet->setCellValue('F5', $proyectos->where('estado', 'pendiente')->count());
        $sheet->getStyle('A5:F5')->getFont()->setBold(true);

        // Headers
        $headers = ['Título', 'Creador', 'Categoría', 'Estado', 'Vistas', 'Tecnologías', 'Fecha Subida'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '7', $header);
            $col++;
        }
        $this->applyHeaderStyle($sheet, 'A7:G7');

        // Data
        $row = 8;
        foreach ($proyectos as $p) {
            $sheet->setCellValue('A' . $row, $p->titulo);
            $sheet->setCellValue('B' . $row, $p->usuario->nombre ?? 'N/A');
            $sheet->setCellValue('C' . $row, $p->categoria->nombre ?? 'General');
            $sheet->setCellValue('D' . $row, strtoupper($p->estado ?? 'pendiente'));
            $sheet->setCellValue('E' . $row, $p->vistas ?? 0);
            $sheet->setCellValue('F' . $row, $p->tecnologias ?? 'N/A');
            $sheet->setCellValue('G' . $row, $p->created_at ? $p->created_at->format('d/m/Y') : 'N/A');
            $row++;
        }

        if ($row > 8) {
            $this->applyDataStyle($sheet, 'A8:G' . ($row - 1));
        }

        foreach (range('A', 'G') as $colLetter) {
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        return $this->downloadExcel($spreadsheet, 'reporte_proyectos_' . date('Ymd_His'));
    }

    /**
     * Reporte de Comentarios en Excel
     */
    public function comentariosExcel(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);
        $periodoTexto = $this->periodoTexto($request);

        $comentarios = Comentario::with(['usuario', 'proyecto'])
            ->whereBetween('created_at', [$inicio, $fin])
            ->orderBy('created_at', 'desc')
            ->get();

        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Moderación');

        // Título
        $sheet->setCellValue('A1', 'CSER-SRL — Reporte de Moderación de Comentarios');
        $sheet->mergeCells('A1:E1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->setCellValue('A2', 'Periodo: ' . $periodoTexto);
        $sheet->mergeCells('A2:E2');
        $sheet->setCellValue('A3', 'Generado: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A3:E3');

        // Resumen
        $sheet->setCellValue('A5', 'Total');
        $sheet->setCellValue('B5', $comentarios->count());
        $sheet->setCellValue('C5', 'Aprobados');
        $sheet->setCellValue('D5', $comentarios->where('aprobado', 1)->count());
        $sheet->getStyle('A5:D5')->getFont()->setBold(true);

        // Headers
        $headers = ['Fecha', 'Autor', 'Proyecto Destino', 'Contenido', 'Estado'];
        $col = 'A';
        foreach ($headers as $header) {
            $sheet->setCellValue($col . '7', $header);
            $col++;
        }
        $this->applyHeaderStyle($sheet, 'A7:E7');

        // Data
        $row = 8;
        foreach ($comentarios as $c) {
            $estado = $c->aprobado === 1 ? 'APROBADO' : ($c->aprobado === 2 ? 'RECHAZADO' : 'PENDIENTE');
            $sheet->setCellValue('A' . $row, $c->created_at ? $c->created_at->format('d/m/Y') : 'N/A');
            $sheet->setCellValue('B' . $row, $c->usuario ? $c->usuario->nombre : 'Usuario Eliminado');
            $sheet->setCellValue('C' . $row, $c->proyecto ? $c->proyecto->titulo : 'Proyecto Eliminado');
            $sheet->setCellValue('D' . $row, $c->contenido ?? 'Sin contenido');
            $sheet->setCellValue('E' . $row, $estado);
            $row++;
        }

        if ($row > 8) {
            $this->applyDataStyle($sheet, 'A8:E' . ($row - 1));
        }

        foreach (range('A', 'E') as $colLetter) {
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        return $this->downloadExcel($spreadsheet, 'reporte_comentarios_' . date('Ymd_His'));
    }

    /**
     * Reporte General en Excel
     */
    public function generalExcel(Request $request)
    {
        [$inicio, $fin] = $this->parsePeriodo($request);
        $periodoTexto = $this->periodoTexto($request);

        $spreadsheet = new Spreadsheet();

        // --- Hoja 1: Resumen ---
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setTitle('Resumen General');

        $sheet->setCellValue('A1', 'CSER-SRL — Reporte General del Sistema');
        $sheet->mergeCells('A1:D1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14);
        $sheet->setCellValue('A2', 'Periodo: ' . $periodoTexto);
        $sheet->mergeCells('A2:D2');
        $sheet->setCellValue('A3', 'Generado: ' . date('d/m/Y H:i'));
        $sheet->mergeCells('A3:D3');

        // Usuarios
        $row = 5;
        $sheet->setCellValue('A' . $row, '📊 MÓDULO DE USUARIOS');
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(12);
        $row++;
        $headers = ['Métrica', 'Valor'];
        $sheet->setCellValue('A' . $row, $headers[0]);
        $sheet->setCellValue('B' . $row, $headers[1]);
        $this->applyHeaderStyle($sheet, 'A' . $row . ':B' . $row);
        $row++;

        $totalUsuarios = User::whereBetween('created_at', [$inicio, $fin])->count();
        $activosUsuarios = User::where('activo', 1)->whereBetween('created_at', [$inicio, $fin])->count();
        $inactivosUsuarios = User::where('activo', 0)->whereBetween('created_at', [$inicio, $fin])->count();

        $metricas = [
            'Total Registrados' => $totalUsuarios,
            'Cuentas Activas' => $activosUsuarios,
            'Cuentas Inactivas' => $inactivosUsuarios,
        ];

        // Add roles
        $porRol = User::whereBetween('created_at', [$inicio, $fin])
            ->selectRaw('rol, COUNT(*) as total')
            ->groupBy('rol')
            ->pluck('total', 'rol');
        foreach ($porRol as $rol => $total) {
            $metricas['Rol: ' . ucfirst($rol)] = $total;
        }

        foreach ($metricas as $metrica => $valor) {
            $sheet->setCellValue('A' . $row, $metrica);
            $sheet->setCellValue('B' . $row, $valor);
            $row++;
        }

        // Proyectos
        $row += 1;
        $sheet->setCellValue('A' . $row, '📁 MÓDULO DE PROYECTOS');
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(12);
        $row++;
        $sheet->setCellValue('A' . $row, 'Métrica');
        $sheet->setCellValue('B' . $row, 'Valor');
        $this->applyHeaderStyle($sheet, 'A' . $row . ':B' . $row);
        $row++;

        $metricasP = [
            'Total Proyectos' => Proyecto::whereBetween('created_at', [$inicio, $fin])->count(),
            'Aprobados' => Proyecto::where('estado', 'aprobado')->whereBetween('created_at', [$inicio, $fin])->count(),
            'Rechazados' => Proyecto::where('estado', 'rechazado')->whereBetween('created_at', [$inicio, $fin])->count(),
            'Pendientes' => Proyecto::where('estado', 'pendiente')->whereBetween('created_at', [$inicio, $fin])->count(),
            'Vistas Totales' => intval(Proyecto::whereBetween('created_at', [$inicio, $fin])->sum('vistas')),
        ];

        foreach ($metricasP as $metrica => $valor) {
            $sheet->setCellValue('A' . $row, $metrica);
            $sheet->setCellValue('B' . $row, $valor);
            $row++;
        }

        // Comentarios
        $row += 1;
        $sheet->setCellValue('A' . $row, '💬 MÓDULO DE COMENTARIOS');
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(12);
        $row++;
        $sheet->setCellValue('A' . $row, 'Métrica');
        $sheet->setCellValue('B' . $row, 'Valor');
        $this->applyHeaderStyle($sheet, 'A' . $row . ':B' . $row);
        $row++;

        $metricasC = [
            'Total Comentarios' => Comentario::whereBetween('created_at', [$inicio, $fin])->count(),
            'Aprobados' => Comentario::where('aprobado', 1)->whereBetween('created_at', [$inicio, $fin])->count(),
            'Rechazados' => Comentario::where('aprobado', 2)->whereBetween('created_at', [$inicio, $fin])->count(),
            'Pendientes' => Comentario::where('aprobado', 0)->whereBetween('created_at', [$inicio, $fin])->count(),
        ];

        foreach ($metricasC as $metrica => $valor) {
            $sheet->setCellValue('A' . $row, $metrica);
            $sheet->setCellValue('B' . $row, $valor);
            $row++;
        }

        // Alertas
        $row += 1;
        $sheet->setCellValue('A' . $row, '⚠️ ALERTAS ACTIVAS');
        $sheet->mergeCells('A' . $row . ':D' . $row);
        $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(12);
        $row++;
        foreach ($this->getAlertasActivas() as $alerta) {
            $sheet->setCellValue('A' . $row, '• ' . $alerta);
            $sheet->mergeCells('A' . $row . ':D' . $row);
            $row++;
        }

        foreach (range('A', 'D') as $colLetter) {
            $sheet->getColumnDimension($colLetter)->setAutoSize(true);
        }

        return $this->downloadExcel($spreadsheet, 'reporte_general_' . date('Ymd_His'));
    }

    /**
     * Helper para descargar un archivo Excel
     */
    private function downloadExcel(Spreadsheet $spreadsheet, string $filename): StreamedResponse
    {
        $writer = new Xlsx($spreadsheet);

        return new StreamedResponse(function () use ($writer) {
            $writer->save('php://output');
        }, 200, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.xlsx"',
            'Cache-Control' => 'max-age=0',
        ]);
    }
}