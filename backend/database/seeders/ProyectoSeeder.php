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

        // Validamos que existan los usuarios y categorías antes de insertar
        if (!$maria || !$carlos || !$catWeb || !$catIA || !$catMovil) {
            return;
        }

        Proyecto::firstOrCreate(
            ['titulo' => 'Sistema de Gestión de Inventarios'],
            [
                'usuario_id'     => $maria->id,
                'categoria_id'   => $catWeb->id,
                'descripcion'    => 'Aplicación web para control de stock, entradas y salidas de productos en una empresa distribuidora.',
                'tecnologias'    => 'PHP, Laravel, MySQL, React, TypeScript',
                'herramientas'   => 'VS Code, Postman, GitHub, Figma',
                'github'         => 'https://github.com/mariagarcia/inventario-sys',
                'demo'           => 'https://inventario.mariagarcia.dev',
                'cliente'        => 'Distribuidora La Esperanza S.R.L.',
                'fecha_proyecto' => '2024-06-01',
                'estado'         => 'aprobado',
            ]
        );

        Proyecto::firstOrCreate(
            ['titulo' => 'Clasificador de Imágenes con CNN'],
            [
                'usuario_id'     => $carlos->id,
                'categoria_id'   => $catIA->id,
                'descripcion'    => 'Modelo de red neuronal convolucional entrenado para clasificar imágenes médicas en categorías de riesgo.',
                'tecnologias'    => 'Python, TensorFlow, Keras, NumPy, OpenCV',
                'herramientas'   => 'Jupyter Notebook, Google Colab, GitHub',
                'github'         => 'https://github.com/carlosmamani/cnn-clasificador',
                'demo'           => null,
                'cliente'        => 'Proyecto Académico - UMSS',
                'fecha_proyecto' => '2023-11-15',
                'estado'         => 'aprobado',
            ]
        );

        Proyecto::firstOrCreate(
            ['titulo' => 'App de Seguimiento de Hábitos'],
            [
                'usuario_id'     => $maria->id,
                'categoria_id'   => $catMovil->id,
                'descripcion'    => 'Aplicación móvil para registrar y monitorear hábitos diarios con estadísticas de progreso y recordatorios.',
                'tecnologias'    => 'React Native, TypeScript, Expo, SQLite',
                'herramientas'   => 'Expo CLI, VS Code, Figma, GitHub',
                'github'         => 'https://github.com/mariagarcia/habitos-app',
                'demo'           => null,
                'cliente'        => 'Proyecto Personal',
                'fecha_proyecto' => '2025-02-20',
                'estado'         => 'pendiente',
            ]
        );
    }
}