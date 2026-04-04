<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->enum('role', ['admin', 'usuario'])->default('usuario');
            $table->string('profesion')->nullable();
            $table->string('especialidad')->nullable();
            $table->text('biografia')->nullable();
            $table->string('ubicacion')->nullable();
            $table->string('foto_perfil')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('github')->nullable();
            $table->string('sitio_web')->nullable();
            $table->string('universidad')->nullable();
            $table->string('titulo_academico')->nullable();
            $table->year('anio_graduacion')->nullable();
            $table->boolean('activo')->default(true);
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};