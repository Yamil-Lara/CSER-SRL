<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Proyectos</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #10b981; padding-bottom: 10px; }
        .header h1 { margin: 0 0 5px 0; font-size: 20px; }
        .header h2 { margin: 0 0 8px 0; font-size: 15px; color: #555; }
        .stats-box { background: #f8fafc; padding: 12px 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e2e8f0; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; }
        th { background-color: #f1f5f9; color: #334155; font-size: 11px; text-transform: uppercase; }
        .badge { font-weight: bold; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CSER-SRL - Sistema de Portafolios</h1>
        <h2>Auditoría de Proyectos y Métricas</h2>
        <p style="margin:0; font-size: 10px; color:#777;">Generado el: {{ date('d/m/Y H:i') }}</p>
    </div>

    <div class="stats-box">
        <strong>Resumen Global:</strong> 
        Proyectos Totales: {{ $stats['total'] }} &nbsp;|&nbsp; 
        Proyectos Aprobados: {{ $stats['aprobados'] }} &nbsp;|&nbsp; 
        Impacto Global (Vistas): {{ $stats['vistas_totales'] }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Título del Proyecto</th>
                <th>Creador</th>
                <th>Categoría</th>
                <th>Estado</th>
                <th>Vistas</th>
                <th>Fecha Subida</th>
            </tr>
        </thead>
        <tbody>
            @foreach($proyectos as $p)
            <tr>
                <td>{{ $p->titulo }}</td>
                <td>{{ $p->usuario->nombre ?? 'N/A' }}</td>
                <td>{{ $p->categoria->nombre ?? 'General' }}</td>
                <td class="badge">{{ strtoupper($p->estado ?? 'pendiente') }}</td>
                <td>{{ $p->vistas ?? 0 }}</td>
                <td>{{ $p->created_at ? $p->created_at->format('d/m/Y') : 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>