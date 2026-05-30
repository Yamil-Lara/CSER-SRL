<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Proyectos — CSER-SRL</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.5; }
        
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #10b981; }
        .logo { font-size: 24px; font-weight: 800; color: #10b981; letter-spacing: -0.5px; margin-bottom: 2px; }
        .logo span { color: #64748b; font-weight: 400; font-size: 14px; }
        .header h2 { font-size: 16px; color: #334155; margin: 5px 0; }
        .header .meta { font-size: 9px; color: #94a3b8; }
        .header .periodo { font-size: 10px; color: #475569; margin-top: 4px; font-weight: 600; background: #f1f5f9; display: inline-block; padding: 3px 12px; border-radius: 10px; }

        .stats-grid { display: table; width: 100%; margin-bottom: 18px; }
        .stat-card { display: table-cell; text-align: center; padding: 10px 8px; background: #f8fafc; border: 1px solid #e2e8f0; }
        .stat-card:first-child { border-radius: 6px 0 0 6px; }
        .stat-card:last-child { border-radius: 0 6px 6px 0; }
        .stat-value { font-size: 22px; font-weight: 800; color: #10b981; }
        .stat-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        .section-title { font-size: 12px; font-weight: 700; color: #334155; margin: 15px 0 8px; padding-left: 8px; border-left: 3px solid #10b981; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #10b981; color: #fff; padding: 7px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-size: 10px; }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #ecfdf5; }

        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 600; }
        .badge-aprobado { background: #dcfce7; color: #16a34a; }
        .badge-pendiente { background: #fef3c7; color: #d97706; }
        .badge-rechazado { background: #fee2e2; color: #dc2626; }

        .footer { text-align: center; font-size: 8px; color: #94a3b8; margin-top: 20px; padding-top: 10px; border-top: 1px solid #e2e8f0; }

        .cat-dist { margin-bottom: 15px; }
        .cat-dist table { width: auto; }
        .cat-dist td { padding: 4px 15px; }
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
            <div class="stat-label">Total Proyectos</div>
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
        <div class="stat-card">
            <div class="stat-value" style="color: #7c3aed;">{{ $stats['vistas_totales'] }}</div>
            <div class="stat-label">Vistas Totales</div>
        </div>
    </div>

    @if(isset($porCategoria) && $porCategoria->count() > 0)
    <div class="section-title">Distribución por Categoría</div>
    <div class="cat-dist">
        <table>
            <thead>
                <tr>
                    @foreach($porCategoria as $cat => $total)
                    <th>{{ $cat }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                <tr>
                    @foreach($porCategoria as $cat => $total)
                    <td style="text-align: center; font-weight: bold; font-size: 14px;">{{ $total }}</td>
                    @endforeach
                </tr>
            </tbody>
        </table>
    </div>
    @endif

    <div class="section-title">Listado Detallado de Proyectos</div>
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
                <td>
                    @php $estado = $p->estado ?? 'pendiente'; @endphp
                    <span class="badge badge-{{ $estado }}">{{ strtoupper($estado) }}</span>
                </td>
                <td>{{ $p->vistas ?? 0 }}</td>
                <td>{{ $p->created_at ? $p->created_at->format('d/m/Y') : 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        CSER-SRL · Reporte generado automáticamente · {{ $fecha }}
    </div>
</body>
</html>