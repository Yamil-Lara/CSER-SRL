<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('proyectos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->foreignId('categoria_id')->constrained('categorias')->onDelete('restrict');
            $table->string('titulo');
            $table->text('descripcion');
            $table->text('tecnologias');
            $table->text('herramientas')->nullable();
            $table->string('imagen')->nullable();
            $table->string('github')->nullable();
            $table->string('demo')->nullable();
            $table->string('cliente')->nullable();
            $table->date('fecha_proyecto')->nullable();
            $table->enum('estado', ['pendiente', 'aprobado', 'rechazado'])->default('pendiente');
            $table->timestamps();
            
            $table->index('estado');
        });
    }
    public function down(): void { Schema::dropIfExists('proyectos'); }
};