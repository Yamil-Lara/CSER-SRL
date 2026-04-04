<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'name'              => fake()->name(),
            'email'             => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password'          => bcrypt('password'),
            'role'              => 'usuario',
            'profesion'         => fake()->jobTitle(),
            'especialidad'      => fake()->randomElement(['PHP', 'Python', 'JavaScript', 'Java']),
            'biografia'         => fake()->paragraph(),
            'ubicacion'         => fake()->city() . ', Bolivia',
            'foto_perfil'       => null,
            'linkedin'          => null,
            'github'            => null,
            'sitio_web'         => null,
            'universidad'       => 'Universidad Mayor de San Simón',
            'titulo_academico'  => 'Licenciatura en Informática',
            'anio_graduacion'   => fake()->year(),
            'activo'            => true,
            'remember_token'    => Str::random(10),
        ];
    }

    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'admin',
        ]);
    }
}
