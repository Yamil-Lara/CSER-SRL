<?php

namespace Database\Seeders;

use App\Models\Categoria;
use App\Models\Proyecto;
use App\Models\User;
use Illuminate\Database\Seeder;

class ProyectoSeeder extends Seeder
{
    public function run(): void
    {
        $maria   = User::where('email', 'maria.garcia@cser.com')->first();
        $carlos  = User::where('email', 'carlos.mamani@cser.com')->first();

        $catWeb  = Categoria::where('nombre', 'Desarrollo Web')->first();
        $catIA   = Categoria::where('nombre', 'Inteligencia Artificial')->first();
        $catMovil = Categoria::where('nombre', 'Desarrollo Móvil')->first();

        Proyecto::firstOrCreate(
            ['titulo' => 'Sistema de Gestión de Inventarios'],
            [
                'user_id'        => $maria->id,
                'categoria_id'   => $catWeb->id,
                'descripcion'    => 'Aplicación web para control de stock, entradas y salidas de productos en una empresa distribuidora.',
                'tecnologias'    => ['PHP', 'Laravel', 'MySQL', 'React', 'TypeScript'],
                'herramientas'   => ['VS Code', 'Postman', 'GitHub', 'Figma'],
                'url_github'     => 'https://github.com/mariagarcia/inventario-sys',
                'url_demo'       => 'https://inventario.mariagarcia.dev',
                'cliente'        => 'Distribuidora La Esperanza S.R.L.',
                'fecha_proyecto' => '2024-06-01',
                'publicado'      => true,
                'activo'         => true,
            ]
        );

        Proyecto::firstOrCreate(
            ['titulo' => 'Clasificador de Imágenes con CNN'],
            [
                'user_id'        => $carlos->id,
                'categoria_id'   => $catIA->id,
                'descripcion'    => 'Modelo de red neuronal convolucional entrenado para clasificar imágenes médicas en categorías de riesgo.',
                'tecnologias'    => ['Python', 'TensorFlow', 'Keras', 'NumPy', 'OpenCV'],
                'herramientas'   => ['Jupyter Notebook', 'Google Colab', 'GitHub'],
                'url_github'     => 'https://github.com/carlosmamani/cnn-clasificador',
                'url_demo'       => null,
                'cliente'        => 'Proyecto Académico - UMSS',
                'fecha_proyecto' => '2023-11-15',
                'publicado'      => true,
                'activo'         => true,
            ]
        );

        Proyecto::firstOrCreate(
            ['titulo' => 'App de Seguimiento de Hábitos'],
            [
                'user_id'        => $maria->id,
                'categoria_id'   => $catMovil->id,
                'descripcion'    => 'Aplicación móvil para registrar y monitorear hábitos diarios con estadísticas de progreso y recordatorios.',
                'tecnologias'    => ['React Native', 'TypeScript', 'Expo', 'SQLite'],
                'herramientas'   => ['Expo CLI', 'VS Code', 'Figma', 'GitHub'],
                'url_github'     => 'https://github.com/mariagarcia/habitos-app',
                'url_demo'       => null,
                'cliente'        => 'Proyecto Personal',
                'fecha_proyecto' => '2025-02-20',
                'publicado'      => false,
                'activo'         => true,
            ]
        );
    }
}