<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            [
                'nombre'      => 'Desarrollo Web',
                'descripcion' => 'Aplicaciones y sitios web full-stack, frontend y backend.',
                'icono'       => 'globe',
            ],
            [
                'nombre'      => 'Desarrollo Móvil',
                'descripcion' => 'Aplicaciones nativas e híbridas para iOS y Android.',
                'icono'       => 'smartphone',
            ],
            [
                'nombre'      => 'Diseño UX/UI',
                'descripcion' => 'Diseño de interfaces centradas en la experiencia del usuario.',
                'icono'       => 'layout',
            ],
            [
                'nombre'      => 'Inteligencia Artificial',
                'descripcion' => 'Modelos de machine learning, deep learning y procesamiento de datos.',
                'icono'       => 'cpu',
            ],
            [
                'nombre'      => 'Base de Datos',
                'descripcion' => 'Diseño, administración y optimización de bases de datos.',
                'icono'       => 'database',
            ],
            [
                'nombre'      => 'DevOps y Cloud',
                'descripcion' => 'Infraestructura, CI/CD, contenedores y despliegue en la nube.',
                'icono'       => 'cloud',
            ],
            [
                'nombre'      => 'Seguridad Informática',
                'descripcion' => 'Ciberseguridad, pentesting, auditorías y protección de sistemas.',
                'icono'       => 'shield',
            ],
            [
                'nombre'      => 'Software de Escritorio',
                'descripcion' => 'Aplicaciones de escritorio para Windows, Linux y macOS.',
                'icono'       => 'monitor',
            ],
        ];

        foreach ($categorias as $categoria) {
            Categoria::firstOrCreate(
                ['nombre' => $categoria['nombre']],
                $categoria
            );
        }
    }
}
