<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Comentarios</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #f59e0b; padding-bottom: 10px; }
        .header h1 { margin: 0 0 5px 0; font-size: 20px; }
        .header h2 { margin: 0 0 8px 0; font-size: 15px; color: #555; }
        .stats-box { background: #f8fafc; padding: 12px 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid #e2e8f0; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #e2e8f0; padding: 8px; text-align: left; vertical-align: top; }
        th { background-color: #f1f5f9; color: #334155; font-size: 11px; text-transform: uppercase; }
        .badge { font-weight: bold; font-size: 10px; }
        .content-cell { font-style: italic; color: #555; max-width: 250px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CSER-SRL - Sistema de Portafolios</h1>
        <h2>Auditoría de Moderación de Comentarios</h2>
        <p style="margin:0; font-size: 10px; color:#777;">Generado el: {{ date('d/m/Y H:i') }}</p>
    </div>

    <div class="stats-box">
        <strong>Resumen Global:</strong> 
        Comentarios Totales: {{ $stats['total'] }} &nbsp;|&nbsp; 
        Aprobados: {{ $stats['aprobados'] }} &nbsp;|&nbsp; 
        Rechazados: {{ $stats['rechazados'] }} &nbsp;|&nbsp;
        Pendientes: {{ $stats['pendientes'] }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Autor</th>
                <th>Proyecto Destino</th>
                <th>Contenido</th>
                <th>Estado</th>
            </tr>
        </thead>
        <tbody>
            @foreach($comentarios as $c)
            <tr>
                <td>{{ $c->fecha ?? ($c->created_at ? $c->created_at->format('d/m/Y') : 'N/A') }}</td>
                <td>{{ $c->usuario ? $c->usuario->nombre : 'Usuario Eliminado' }}</td>
                <td>{{ $c->proyecto ? $c->proyecto->titulo : 'Proyecto Eliminado' }}</td>
                <td class="content-cell">"{{ $c->contenido ?? 'Sin contenido' }}"</td>
                <td class="badge">
                    @if($c->aprobado === 1) APROBADO 
                    @elseif($c->aprobado === 2) RECHAZADO 
                    @else PENDIENTE 
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>