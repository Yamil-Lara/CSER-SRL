<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@cser.com'],
            [
                'nombre'       => 'Administrador CSER',
                'username'     => 'admin_cser',
                'password'     => Hash::make('Admin@2026'),
                'rol'          => 'admin',
                'estado'       => 'aprobado',
                'profesion'    => 'Administrador del Sistema',
                'especialidad' => 'Gestión de plataformas',
                'biografia'    => 'Administrador principal del sistema CSER S.R.L.',
                'ubicacion'    => 'Cochabamba, Bolivia',
                'activo'       => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'maria.garcia@cser.com'],
            [
                'nombre'       => 'María García',
                'username'     => 'mariagarcia',
                'password'     => Hash::make('Usuario@2026'),
                'rol'          => 'usuario',
                'estado'       => 'aprobado',
                'profesion'    => 'Desarrolladora Full Stack',
                'especialidad' => 'PHP, Laravel, React',
                'biografia'    => 'Desarrolladora con 3 años de experiencia en aplicaciones web modernas.',
                'ubicacion'    => 'Cochabamba, Bolivia',
                'linkedin'     => 'https://linkedin.com/in/maria-garcia-dev',
                'github_perfil'=> 'https://github.com/mariagarcia',
                'universidad'  => 'Universidad Mayor de San Simón',
                'carrera'      => 'Licenciatura en Informática',
                'nivel_estudios'=> 'Titulado',
                'activo'       => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'carlos.mamani@cser.com'],
            [
                'nombre'       => 'Carlos Mamani',
                'username'     => 'carlosmamani',
                'password'     => Hash::make('Usuario@2026'),
                'rol'          => 'usuario',
                'estado'       => 'aprobado',
                'profesion'    => 'Ingeniero de Software',
                'especialidad' => 'Python, Django, Machine Learning',
                'biografia'    => 'Apasionado por la inteligencia artificial y el análisis de datos.',
                'ubicacion'    => 'La Paz, Bolivia',
                'linkedin'     => 'https://linkedin.com/in/carlos-mamani-dev',
                'github_perfil'=> 'https://github.com/carlosmamani',
                'universidad'  => 'Universidad Mayor de San Simón',
                'carrera'      => 'Ingeniería de Sistemas',
                'nivel_estudios'=> 'Titulado',
                'activo'       => true,
            ]
        );
    }
}