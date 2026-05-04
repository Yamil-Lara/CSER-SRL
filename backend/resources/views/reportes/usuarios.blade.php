<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Usuarios</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 25px; border-bottom: 3px solid #3b82f6; padding-bottom: 10px; }
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
        <h2>{{ $titulo }}</h2>
        <p style="margin:0; font-size: 10px; color:#777;">Generado el: {{ $fecha }}</p>
    </div>

    <div class="stats-box">
        <strong>Resumen Global:</strong> 
        Usuarios Registrados: {{ $stats['total'] }} &nbsp;|&nbsp; 
        Cuentas Activas: {{ $stats['activos'] }} &nbsp;|&nbsp; 
        Cuentas Inactivas: {{ $stats['inactivos'] }} &nbsp;|&nbsp; 
        Administradores: {{ $stats['admins'] }}
    </div>

    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Correo Electrónico</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Fecha de Registro</th>
            </tr>
        </thead>
        <tbody>
            @foreach($usuarios as $u)
            <tr>
                <td>{{ $u->nombre }}</td>
                <td>{{ $u->email }}</td>
                <td class="badge">{{ strtoupper($u->rol) }}</td>
                <td>{{ $u->activo ? 'Activo' : 'Inactivo' }}</td>
                <td>{{ $u->created_at ? $u->created_at->format('d/m/Y') : 'N/A' }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>