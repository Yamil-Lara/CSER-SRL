<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reporte de Usuarios — CSER-SRL</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 11px; color: #1e293b; line-height: 1.5; }
        
        .header { text-align: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 3px solid #2563eb; }
        .logo { font-size: 24px; font-weight: 800; color: #2563eb; letter-spacing: -0.5px; margin-bottom: 2px; }
        .logo span { color: #64748b; font-weight: 400; font-size: 14px; }
        .header h2 { font-size: 16px; color: #334155; margin: 5px 0; }
        .header .meta { font-size: 9px; color: #94a3b8; }
        .header .periodo { font-size: 10px; color: #475569; margin-top: 4px; font-weight: 600; background: #f1f5f9; display: inline-block; padding: 3px 12px; border-radius: 10px; }
        
        .stats-grid { display: table; width: 100%; margin-bottom: 18px; }
        .stat-card { display: table-cell; text-align: center; padding: 10px 8px; background: #f8fafc; border: 1px solid #e2e8f0; }
        .stat-card:first-child { border-radius: 6px 0 0 6px; }
        .stat-card:last-child { border-radius: 0 6px 6px 0; }
        .stat-value { font-size: 22px; font-weight: 800; color: #2563eb; }
        .stat-label { font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 2px; }
        
        .section-title { font-size: 12px; font-weight: 700; color: #334155; margin: 15px 0 8px; padding-left: 8px; border-left: 3px solid #2563eb; }
        
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        th { background: #2563eb; color: #fff; padding: 7px 10px; text-align: left; font-size: 9px; text-transform: uppercase; letter-spacing: 0.5px; }
        td { padding: 6px 10px; border-bottom: 1px solid #f1f5f9; font-size: 10px; }
        tr:nth-child(even) { background: #f8fafc; }
        tr:hover { background: #eff6ff; }
        
        .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 9px; font-weight: 600; }
        .badge-admin { background: #ede9fe; color: #7c3aed; }
        .badge-usuario { background: #dbeafe; color: #2563eb; }
        .badge-moderador { background: #fef3c7; color: #d97706; }
        .badge-activo { background: #dcfce7; color: #16a34a; }
        .badge-inactivo { background: #fee2e2; color: #dc2626; }

        .footer { text-align: center; font-size: 8px; color: #94a3b8; margin-top: 20px; padding-top: 10px; border-top: 1px solid #e2e8f0; }

        .role-dist { margin-bottom: 15px; }
        .role-dist table { width: auto; }
        .role-dist td { padding: 4px 15px; }
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
            <div class="stat-label">Total Registrados</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #16a34a;">{{ $stats['activos'] }}</div>
            <div class="stat-label">Cuentas Activas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #dc2626;">{{ $stats['inactivos'] }}</div>
            <div class="stat-label">Cuentas Inactivas</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="color: #7c3aed;">{{ $stats['admins'] }}</div>
            <div class="stat-label">Administradores</div>
        </div>
    </div>

    @if(isset($porRol) && $porRol->count() > 0)
    <div class="section-title">Distribución por Rol</div>
    <div class="role-dist">
        <table>
            <thead>
                <tr>
                    @foreach($porRol as $rol => $total)
                    <th>{{ ucfirst($rol) }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody>
                <tr>
                    @foreach($porRol as $rol => $total)
                    <td style="text-align: center; font-weight: bold; font-size: 14px;">{{ $total }}</td>
                    @endforeach
                </tr>
            </tbody>
        </table>
    </div>
    @endif

    <div class="section-title">Listado Detallado de Usuarios</div>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Cuenta</th>
                <th>Fecha de Registro</th>
            </tr>
        </thead>
        <tbody>
            @foreach($usuarios as $u)
            <tr>
                <td>{{ $u->nombre }}</td>
                <td>{{ $u->email }}</td>
                <td><span class="badge badge-{{ $u->rol }}">{{ strtoupper($u->rol) }}</span></td>
                <td>{{ ucfirst($u->estado ?? 'N/A') }}</td>
                <td><span class="badge {{ $u->activo ? 'badge-activo' : 'badge-inactivo' }}">{{ $u->activo ? 'Activo' : 'Inactivo' }}</span></td>
                <td>{{ $u->created_at ? $u->created_at->format('d/m/Y') : 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>

    <div class="footer">
        CSER-SRL · Reporte generado automáticamente · {{ $fecha }}
    </div>
</body>
</html>