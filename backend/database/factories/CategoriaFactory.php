<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoriaFactory extends Factory
{
    public function definition(): array
    {
        $nombre = $this->faker->unique()->word();
        
        return [
            'nombre' => ucfirst($nombre),
            'slug' => Str::slug($nombre),
            'descripcion' => $this->faker->paragraph(),
            'icono' => $this->faker->randomElement(['fa-code', 'fa-database', 'fa-cloud', 'fa-mobile']),
            'activo' => true,
        ];
    }
}