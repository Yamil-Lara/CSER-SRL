<?php
require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

// Buscar usuario mariagarcia
$user = \App\Models\User::where('username', 'mariagarcia')->first();

if (!$user) {
    echo "Usuario 'mariagarcia' no encontrado.\n";
    echo "Buscando otro usuario...\n";
    $user = \App\Models\User::first();
}

if (!$user) {
    echo "No se encontró ningún usuario.\n";
    exit(1);
}

echo "Usuario encontrado: {$user->nombre} ({$user->username})\n";
echo "ID: {$user->id}\n\n";

// Agregar biografía si no tiene
if (empty($user->biografia)) {
    $user->biografia = "Desarrolladora Full Stack apasionada por crear soluciones tecnológicas innovadoras. Especialista en arquitectura de software, bases de datos y desarrollo de aplicaciones web escalables. Con más de 5 años de experiencia liderando equipos multidisciplinarios y entregando proyectos de alta calidad para clientes internacionales.";
    $user->save();
    echo "✅ Biografía agregada\n";
}

// Agregar especialidad si no tiene
if (empty($user->especialidad)) {
    $user->especialidad = "Arquitectura de Software & Cloud Computing";
    $user->save();
    echo "✅ Especialidad agregada\n";
}

// Agregar ubicación si no tiene
if (empty($user->ubicacion)) {
    $user->ubicacion = "La Paz, Bolivia";
    $user->save();
    echo "✅ Ubicación agregada\n";
}

// Agregar universidad y carrera si no tiene
if (empty($user->universidad)) {
    $user->universidad = "Universidad Mayor de San Andrés (UMSA)";
    $user->carrera = "Ingeniería de Sistemas";
    $user->save();
    echo "✅ Educación agregada\n";
}

// Habilidades de prueba
$skillsData = [
    ['name' => 'React', 'type' => 'tecnica', 'level' => 95],
    ['name' => 'Laravel', 'type' => 'tecnica', 'level' => 90],
    ['name' => 'Node.js', 'type' => 'tecnica', 'level' => 85],
    ['name' => 'TypeScript', 'type' => 'tecnica', 'level' => 88],
    ['name' => 'PostgreSQL', 'type' => 'tecnica', 'level' => 82],
    ['name' => 'Docker', 'type' => 'tecnica', 'level' => 78],
    ['name' => 'AWS', 'type' => 'tecnica', 'level' => 75],
    ['name' => 'GraphQL', 'type' => 'tecnica', 'level' => 70],
    ['name' => 'Liderazgo', 'type' => 'blanda', 'level' => 92],
    ['name' => 'Comunicación', 'type' => 'blanda', 'level' => 88],
];

echo "\n📝 Agregando habilidades...\n";
foreach ($skillsData as $skill) {
    $existing = $user->skills()->where('name', $skill['name'])->first();
    if (!$existing) {
        $user->skills()->create($skill);
        echo "   ✓ {$skill['name']} ({$skill['level']}%)\n";
    } else {
        echo "   ℹ {$skill['name']} ya existe\n";
    }
}

// Experiencias de prueba
$experiencesData = [
    [
        'cargo_titulo' => 'Senior Full Stack Developer',
        'institucion_empresa' => 'TechSolutions Bolivia',
        'descripcion' => 'Liderazgo técnico de equipo de 8 desarrolladores. Diseño de arquitectura de microservicios. Implementación de CI/CD con GitHub Actions. Reducción del 40% en tiempos de despliegue.',
        'fecha_inicio' => '2022-01-01',
        'fecha_fin' => null,
        'actual' => true,
    ],
    [
        'cargo_titulo' => 'Full Stack Developer',
        'institucion_empresa' => 'Startup Innovatech',
        'descripcion' => 'Desarrollo de plataforma SaaS para gestión de inventarios. Stack: React, Node.js, MongoDB. Incremento de eficiencia operativa en 60% para clientes.',
        'fecha_inicio' => '2020-03-01',
        'fecha_fin' => '2021-12-31',
        'actual' => false,
    ],
    [
        'cargo_titulo' => 'Backend Developer',
        'institucion_empresa' => 'Digital Agency Co.',
        'descripcion' => 'Desarrollo de APIs RESTful con Laravel. Integración de pasarelas de pago (Stripe, PayPal). Optimización de consultas SQL mejorando rendimiento en 300%.',
        'fecha_inicio' => '2019-06-01',
        'fecha_fin' => '2020-02-28',
        'actual' => false,
    ],
    [
        'cargo_titulo' => 'Practicante Desarrollo Web',
        'institucion_empresa' => 'Ministerio de Educación',
        'descripcion' => 'Desarrollo de sistema de gestión documentaria. Apoyo en migración de sistemas legacy a tecnologías modernas.',
        'fecha_inicio' => '2018-07-01',
        'fecha_fin' => '2018-12-31',
        'actual' => false,
    ],
];

echo "\n💼 Agregando experiencias...\n";
foreach ($experiencesData as $exp) {
    $existing = $user->experiencias()
        ->where('cargo_titulo', $exp['cargo_titulo'])
        ->where('institucion_empresa', $exp['institucion_empresa'])
        ->first();
    
    if (!$existing) {
        $user->experiencias()->create($exp);
        echo "   ✓ {$exp['cargo_titulo']} en {$exp['institucion_empresa']}\n";
    } else {
        echo "   ℹ {$exp['cargo_titulo']} ya existe\n";
    }
}

// Obtener primera categoría para proyectos
$firstCategoria = \App\Models\Categoria::first();
$categoriaId = $firstCategoria ? $firstCategoria->id : 1;

// Proyectos de prueba (si no tiene suficientes)
$projectsData = [
    [
        'titulo' => 'E-commerce Platform',
        'descripcion' => 'Plataforma completa de comercio electrónico con pasarela de pagos, gestión de inventario en tiempo real y panel de administración.',
        'fecha_proyecto' => '2023-01-01',
        'estado' => 'aprobado',
        'categoria_id' => $categoriaId,
        'tecnologias' => 'React, Node.js, PostgreSQL, Stripe',
    ],
    [
        'titulo' => 'API Gateway Microservicios',
        'descripcion' => 'Sistema de gateway para orquestar 12 microservicios. Implementación de autenticación JWT, rate limiting y documentación Swagger.',
        'fecha_proyecto' => '2022-06-01',
        'estado' => 'aprobado',
        'categoria_id' => $categoriaId,
        'tecnologias' => 'Node.js, Express, Docker, Redis',
    ],
    [
        'titulo' => 'Dashboard Analytics',
        'descripcion' => 'Panel de control con visualización de datos en tiempo real, gráficos interactivos y exportación de reportes. Stack: React, D3.js, WebSocket.',
        'fecha_proyecto' => '2021-09-01',
        'estado' => 'aprobado',
        'categoria_id' => $categoriaId,
        'tecnologias' => 'React, D3.js, WebSocket, MongoDB',
    ],
    [
        'titulo' => 'Mobile Banking App',
        'descripcion' => 'Aplicación móvil para operaciones bancarias con autenticación biométrica, transferencias QR y notificaciones push.',
        'fecha_proyecto' => '2021-03-01',
        'estado' => 'aprobado',
        'categoria_id' => $categoriaId,
        'tecnologias' => 'React Native, Node.js, Firebase',
    ],
    [
        'titulo' => 'Sistema de Reservas',
        'descripcion' => 'Sistema de reservas online para hotel con calendario dinámico, gestión de habitaciones y pagos integrados.',
        'fecha_proyecto' => '2020-08-01',
        'estado' => 'aprobado',
        'categoria_id' => $categoriaId,
        'tecnologias' => 'Laravel, Vue.js, MySQL, PayPal',
    ],
];

echo "\n🚀 Agregando proyectos...\n";
foreach ($projectsData as $project) {
    $existing = $user->proyectos()->where('titulo', $project['titulo'])->first();
    
    if (!$existing) {
        $user->proyectos()->create($project);
        echo "   ✓ {$project['titulo']}\n";
    } else {
        echo "   ℹ {$project['titulo']} ya existe\n";
    }
}

echo "\n✅ DATOS AGREGADOS EXITOSAMENTE\n";
echo "================================\n";
echo "Usuario: {$user->nombre}\n";
echo "Habilidades: " . $user->skills()->count() . "\n";
echo "Experiencias: " . $user->experiencias()->count() . "\n";
echo "Proyectos: " . $user->proyectos()->count() . "\n";
echo "\nAhora puedes ver el CV en: http://localhost:5173/portfolio/{$user->username}\n";
