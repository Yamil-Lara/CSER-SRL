<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('configuracion_visibilidad', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')
                  ->constrained('usuarios')
                  ->unique()
                  ->onDelete('cascade');
            $table->boolean('mostrar_proyectos')->default(true);
            $table->boolean('mostrar_habilidades')->default(true);
            $table->boolean('mostrar_experiencia')->default(true);
            $table->boolean('mostrar_redes')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('configuracion_visibilidad');
    }
};