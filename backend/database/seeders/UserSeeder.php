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
                'name'            => 'Administrador CSER',
                'password'        => Hash::make('Admin@2026'),
                'role'            => 'admin',
                'profesion'       => 'Administrador del Sistema',
                'especialidad'    => 'Gestión de plataformas',
                'biografia'       => 'Administrador principal del sistema CSER S.R.L.',
                'ubicacion'       => 'Cochabamba, Bolivia',
                'email_verified_at' => now(),
                'activo'          => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'maria.garcia@cser.com'],
            [
                'name'             => 'María García',
                'password'         => Hash::make('Usuario@2026'),
                'role'             => 'usuario',
                'profesion'        => 'Desarrolladora Full Stack',
                'especialidad'     => 'PHP, Laravel, React',
                'biografia'        => 'Desarrolladora con 3 años de experiencia en aplicaciones web modernas.',
                'ubicacion'        => 'Cochabamba, Bolivia',
                'linkedin'         => 'https://linkedin.com/in/maria-garcia-dev',
                'github'           => 'https://github.com/mariagarcia',
                'universidad'      => 'Universidad Mayor de San Simón',
                'titulo_academico' => 'Licenciatura en Informática',
                'anio_graduacion'  => 2022,
                'email_verified_at'=> now(),
                'activo'           => true,
            ]
        );

        User::firstOrCreate(
            ['email' => 'carlos.mamani@cser.com'],
            [
                'name'             => 'Carlos Mamani',
                'password'         => Hash::make('Usuario@2026'),
                'role'             => 'usuario',
                'profesion'        => 'Ingeniero de Software',
                'especialidad'     => 'Python, Django, Machine Learning',
                'biografia'        => 'Apasionado por la inteligencia artificial y el análisis de datos.',
                'ubicacion'        => 'La Paz, Bolivia',
                'linkedin'         => 'https://linkedin.com/in/carlos-mamani-dev',
                'github'           => 'https://github.com/carlosmamani',
                'universidad'      => 'Universidad Mayor de San Simón',
                'titulo_academico' => 'Licenciatura en Sistemas de Información',
                'anio_graduacion'  => 2023,
                'email_verified_at'=> now(),
                'activo'           => true,
            ]
        );
    }
}
