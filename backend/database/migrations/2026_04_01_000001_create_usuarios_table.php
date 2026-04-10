<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('usuarios', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('password');
            $table->string('foto')->nullable();
            $table->enum('rol', ['usuario', 'admin', 'moderador'])->default('usuario');
            $table->boolean('activo')->default(true);
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado'])->default('pendiente');
            $table->string('profesion')->nullable();
            $table->string('especialidad')->nullable();
            $table->text('biografia')->nullable();
            $table->string('ubicacion')->nullable();
            $table->string('linkedin')->nullable();
            $table->string('github_perfil')->nullable();
            $table->string('sitio_web')->nullable();
            $table->string('universidad')->nullable();
            $table->string('carrera')->nullable();
            $table->string('nivel_estudios')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('usuarios'); }
};