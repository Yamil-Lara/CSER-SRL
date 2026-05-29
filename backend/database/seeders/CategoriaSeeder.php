<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = [
            ['nombre' => 'Desarrollo Web', 'icono' => 'globe', 'color' => '#3B82F6'],
            ['nombre' => 'Desarrollo Móvil', 'icono' => 'smartphone', 'color' => '#10BD83'],
            ['nombre' => 'Software de Escritorio', 'icono' => 'monitor', 'color' => '#6366F1'],
            ['nombre' => 'Inteligencia Artificial', 'icono' => 'cpu', 'color' => '#EF4444'],
            ['nombre' => 'Ciencia de Datos y Big Data', 'icono' => 'bar-chart', 'color' => '#3B82F6'],
            ['nombre' => 'Base de Datos', 'icono' => 'database', 'color' => '#F59E0B'],
            ['nombre' => 'DevOps y Cloud', 'icono' => 'cloud', 'color' => '#06B6D4'],
            ['nombre' => 'Seguridad Informática', 'icono' => 'shield', 'color' => '#14B8A6'],
            ['nombre' => 'Diseño UX/UI', 'icono' => 'layout', 'color' => '#8B5CF6'],
            ['nombre' => 'Internet de las Cosas (IoT) y Robótica', 'icono' => 'cpu', 'color' => '#F97316'],
            ['nombre' => 'Desarrollo de Videojuegos', 'icono' => 'play', 'color' => '#EC4899'],
            ['nombre' => 'Automatización y QA', 'icono' => 'check-circle', 'color' => '#84CC16'],
            ['nombre' => 'Otro', 'icono' => 'grid', 'color' => '#9CA3AF'],
        ];

        foreach ($categorias as $categoria) {
            Categoria::firstOrCreate(
                ['nombre' => $categoria['nombre']],
                $categoria
            );
        }
    }
}