<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained('users')
                  ->onDelete('cascade');
            $table->foreignId('categoria_id')
                  ->constrained('categorias')
                  ->onDelete('restrict');
            $table->string('titulo', 200);
            $table->text('descripcion');
            $table->json('tecnologias');
            $table->json('herramientas')->nullable();
            $table->string('imagen')->nullable();
            $table->string('url_github')->nullable();
            $table->string('url_demo')->nullable();
            $table->string('cliente')->nullable();
            $table->date('fecha_proyecto')->nullable();
            $table->boolean('publicado')->default(false);
            $table->boolean('activo')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('proyectos');
    }
};