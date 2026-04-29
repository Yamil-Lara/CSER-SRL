<!DOCTYPE html>
<html>
<head>
    <title>Reporte de Usuarios</title>
    <style>
        body { font-family: sans-serif; font-size: 12px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #6366f1; padding-bottom: 10px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f3f4f6; color: #374151; }
        .badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; }
        .active { background: #dcfce7; color: #166534; }
    </style>
</head>
<body>
    <div class="header">
        <h1>CSER-SRL - Sistema de Portafolios</h1>
        <h2>{{ $titulo }}</h2>
        <p>Generado el: {{ $fecha }}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Registro</th>
            </tr>
        </thead>
        <tbody>
            @foreach($usuarios as $u)
            <tr>
                <td>{{ $u->nombre }}</td>
                <td>{{ $u->email }}</td>
                <td>{{ strtoupper($u->rol) }}</td>
                <td>{{ $u->activo ? 'Activo' : 'Inactivo' }}</td>
                <td>{{ $u->created_at->format('d/m/Y') }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>