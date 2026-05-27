<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Moderación — CSER-SRL</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.5; }
        
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #f59e0b; }
        .logo { font-size: 24px; font-weight: 800; color: #f59e0b; letter-spacing: -0.5px; margin-bottom: 2px; }
        .logo span { color: #64748b; font-weight: 400; font-size: 14px; }
        .header h2 { font-size: 16px; color: #334155; margin: 5px 0; }
        .header .meta { font-size: 9px; color: #94a3b8; }
        .header .periodo { font-size: 10px; color: #475569; margin-top: 4px; font-weight: 600; background: #f1f5f9; display: inline-block; padding: 3px 12px; border-radius: 10px; }

        .stats-grid { display: table; width: 100%; margin-bottom: 18px; }
        .stat-card { display: table-cell; text-align: center; padding: 10px 8px; background: #f8fafc; border: 1px solid #e2e8f0; }
        .stat-card:first-child { border-radius: 6px 0 0 6px; }
        .stat-card:last-child { border-radius: 0 6px 6px 0; }
        .stat-value { font-size: 22px; font-weight: 800; color: #f59e0b; }
        .stat-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        .section-title { font-size: 12px; font-weight: 700; color: #334155; margin: 15px 0 8px; padding-left: 8px; border-left: 3px solid #f59e0b; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #f59e0b; color: #fff; padding: 7px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-size: 10px; }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #fffbeb; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 600; }
        .badge-aprobado { background: #dcfce7; color: #16a34a; }
        .badge-pendiente { background: #fef3c7; color: #d97706; }
        .badge-rechazado { background: #fee2e2; color: #dc2626; }

        .content-cell { font-style: italic; color: #555; max-width: 250px; word-wrap: break-word; }

        .footer { text-align: center; font-size: 8px; color: #94a3b8; margin-top: 20px; padding-top: 10px; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CSER <span>Sistema de Portafolios</span></div>
        <h2>{{ $titulo }}</h2>
        <div class="periodo">📅 Periodo: {{ $periodo }}</div>
        <p class="meta">Generado el: {{ $fecha }}</p>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-value">{{ $stats['total'] }}</div>
            <div class="stat-label">Total Comentarios</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #16a34a;">{{ $stats['aprobados'] }}</div>
            <div class="stat-label">Aprobados</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #dc2626;">{{ $stats['rechazados'] }}</div>
            <div class="stat-label">Rechazados</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #d97706;">{{ $stats['pendientes'] }}</div>
            <div class="stat-label">Pendientes</div>
        </div>
    </div>

    <div class="section-title">Detalle de Comentarios Moderados</div>
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
                <td>{{ $c->created_at ? $c->created_at->format('d/m/Y') : 'N/A' }}</td>
                <td>{{ $c->usuario ? $c->usuario->nombre : 'Usuario Eliminado' }}</td>
                <td>{{ $c->proyecto ? $c->proyecto->titulo : 'Proyecto Eliminado' }}</td>
                <td class="content-cell">"{{ $c->contenido ?? 'Sin contenido' }}"</td>
                <td>
                    @if($c->aprobado === 1)
                        <span class="badge badge-aprobado">APROBADO</span>
                    @elseif($c->aprobado === 2)
                        <span class="badge badge-rechazado">RECHAZADO</span>
                    @else
                        <span class="badge badge-pendiente">PENDIENTE</span>
                    @endif
                </td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        CSER-SRL · Reporte generado automáticamente · {{ $fecha }}
    </div>
</body>
</html>