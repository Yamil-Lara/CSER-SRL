<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'         => fake()->name(),
            'username'       => fake()->unique()->userName(),
            'email'          => fake()->unique()->safeEmail(),
            'password'       => bcrypt('password'),
            'rol'            => 'usuario',
            'estado'         => 'aprobado',
            'profesion'      => fake()->jobTitle(),
            'especialidad'   => fake()->randomElement(['PHP', 'Python', 'JavaScript', 'Java']),
            'biografia'      => fake()->paragraph(),
            'ubicacion'      => fake()->city() . ', Bolivia',
            'foto'           => null,
            'linkedin'       => null,
            'github_perfil'  => null,
            'sitio_web'      => null,
            'universidad'    => 'Universidad Mayor de San Simón',
            'carrera'        => 'Licenciatura en Informática',
            'nivel_estudios' => 'Estudiante',
            'activo'         => true,
            'remember_token' => Str::random(10),
        ];
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'rol' => 'admin',
        ]);
    }

    public function inactivo(): static
    {
        return $this->state(fn (array $attributes) => [
            'activo' => false,
        ]);
    }
}