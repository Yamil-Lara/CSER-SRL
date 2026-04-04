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
            ['nombre' => 'Diseño UX/UI', 'icono' => 'layout', 'color' => '#8B5CF6'],
            ['nombre' => 'Inteligencia Artificial', 'icono' => 'cpu', 'color' => '#EF4444'],
            ['nombre' => 'Base de Datos', 'icono' => 'database', 'color' => '#F59E0B'],
            ['nombre' => 'DevOps y Cloud', 'icono' => 'cloud', 'color' => '#06B6D4'],
            ['nombre' => 'Seguridad Informática', 'icono' => 'shield', 'color' => '#14B8A6'],
            ['nombre' => 'Software de Escritorio', 'icono' => 'monitor', 'color' => '#6366F1'],
        ];

        foreach ($categorias as $categoria) {
            Categoria::firstOrCreate(
                ['nombre' => $categoria['nombre']],
                $categoria
            );
        }
    }
}