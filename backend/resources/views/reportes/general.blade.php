<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte General del Sistema — CSER-SRL</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.5; }

        .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #7c3aed; }
        .logo { font-size: 24px; font-weight: 800; color: #7c3aed; letter-spacing: -0.5px; margin-bottom: 2px; }
        .logo span { color: #64748b; font-weight: 400; font-size: 14px; }
        .header h2 { font-size: 16px; color: #334155; margin: 5px 0; }
        .header .meta { font-size: 9px; color: #94a3b8; }
        .header .periodo { font-size: 10px; color: #475569; margin-top: 4px; font-weight: 600; background: #f1f5f9; display: inline-block; padding: 3px 12px; border-radius: 10px; }

        .section { margin-bottom: 20px; page-break-inside: avoid; }
        .section-title { font-size: 13px; font-weight: 700; color: #334155; margin-bottom: 10px; padding: 8px 12px; background: #f8fafc; border-left: 4px solid #7c3aed; border-radius: 0 6px 6px 0; }
        .section-title.blue { border-left-color: #2563eb; }
        .section-title.green { border-left-color: #10b981; }
        .section-title.amber { border-left-color: #f59e0b; }
        .section-title.red { border-left-color: #dc2626; }

        .stats-grid { display: table; width: 100%; margin-bottom: 15px; }
        .stat-card { display: table-cell; text-align: center; padding: 10px 6px; background: #f8fafc; border: 1px solid #e2e8f0; }
        .stat-card:first-child { border-radius: 6px 0 0 6px; }
        .stat-card:last-child { border-radius: 0 6px 6px 0; }
        .stat-value { font-size: 24px; font-weight: 800; }
        .stat-label { font-size: 8px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }

        table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        th { background: #475569; color: #fff; padding: 6px 10px; text-align: left; font-size: 9px; text-transform: uppercase; }
        td { padding: 5px 10px; border-bottom: 1px solid #f1f5f9; font-size: 10px; }
        tr:nth-child(even) { background: #f8fafc; }

        .alert-box { padding: 8px 12px; margin-bottom: 6px; border-radius: 6px; font-size: 10px; font-weight: 500; }
        .alert-warning { background: #fef3c7; color: #92400e; border: 1px solid #fde68a; }
        .alert-info { background: #dbeafe; color: #1e40af; border: 1px solid #bfdbfe; }
        .alert-success { background: #dcfce7; color: #166534; border: 1px solid #bbf7d0; }

        .footer { text-align: center; font-size: 8px; color: #94a3b8; margin-top: 25px; padding-top: 10px; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">CSER <span>Sistema de Portafolios</span></div>
        <h2>{{ $titulo }}</h2>
        <div class="periodo">📅 Periodo: {{ $periodo }}</div>
        <p class="meta">Generado el: {{ $fecha }} · Resumen Ejecutivo</p>
    </div>

    {{-- ─── MÓDULO DE USUARIOS ─── --}}
    <div class="section">
        <div class="section-title blue">👥 Módulo de Usuarios</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" style="color: #2563eb;">{{ $usuarios['total'] }}</div>
                <div class="stat-label">Registrados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #16a34a;">{{ $usuarios['activos'] }}</div>
                <div class="stat-label">Activos</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #dc2626;">{{ $usuarios['inactivos'] }}</div>
                <div class="stat-label">Inactivos</div>
            </div>
        </div>

        @if($usuarios['por_rol']->count() > 0)
        <table>
            <thead>
                <tr><th>Rol</th><th>Cantidad</th></tr>
            </thead>
            <tbody>
                @foreach($usuarios['por_rol'] as $rol => $total)
                <tr><td>{{ ucfirst($rol) }}</td><td><strong>{{ $total }}</strong></td></tr>
                @endforeach
            </tbody>
        </table>
        @endif
    </div>

    {{-- ─── MÓDULO DE PROYECTOS ─── --}}
    <div class="section">
        <div class="section-title green">📁 Módulo de Proyectos</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" style="color: #10b981;">{{ $proyectos['total'] }}</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #16a34a;">{{ $proyectos['aprobados'] }}</div>
                <div class="stat-label">Aprobados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #dc2626;">{{ $proyectos['rechazados'] }}</div>
                <div class="stat-label">Rechazados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #d97706;">{{ $proyectos['pendientes'] }}</div>
                <div class="stat-label">Pendientes</div>
            </div>
        </div>

        @if(isset($proyectos['por_categoria']) && $proyectos['por_categoria']->count() > 0)
        <table>
            <thead>
                <tr><th>Categoría</th><th>Cantidad</th></tr>
            </thead>
            <tbody>
                @foreach($proyectos['por_categoria'] as $cat => $total)
                <tr><td>{{ $cat }}</td><td><strong>{{ $total }}</strong></td></tr>
                @endforeach
            </tbody>
        </table>
        @endif
    </div>

    {{-- ─── MÓDULO DE COMENTARIOS ─── --}}
    <div class="section">
        <div class="section-title amber">💬 Módulo de Moderación de Comentarios</div>
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value" style="color: #f59e0b;">{{ $comentarios['total'] }}</div>
                <div class="stat-label">Total</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #16a34a;">{{ $comentarios['aprobados'] }}</div>
                <div class="stat-label">Aprobados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #dc2626;">{{ $comentarios['rechazados'] }}</div>
                <div class="stat-label">Rechazados</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="color: #d97706;">{{ $comentarios['pendientes'] }}</div>
                <div class="stat-label">Pendientes</div>
            </div>
        </div>
    </div>

    {{-- ─── ALERTAS ACTIVAS ─── --}}
    <div class="section">
        <div class="section-title red">⚠️ Alertas Activas del Sistema</div>
        @foreach($alertas_activas as $alerta)
            @if(str_contains($alerta, 'pendiente'))
                <div class="alert-box alert-warning">• {{ $alerta }}</div>
            @elseif(str_contains($alerta, 'todo al día'))
                <div class="alert-box alert-success">✅ {{ $alerta }}</div>
            @else
                <div class="alert-box alert-info">ℹ️ {{ $alerta }}</div>
            @endif
        @endforeach
    </div>

    <div class="footer">
        CSER-SRL · Reporte General del Sistema · Generado automáticamente el {{ $fecha }}
    </div>
</body>
</html>
