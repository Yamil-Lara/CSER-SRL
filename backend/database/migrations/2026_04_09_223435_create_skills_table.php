
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('skills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('nombre');
            $table->enum('tipo', ['tecnica', 'blanda']);
            $table->integer('nivel'); // 1-100 para barras de progreso
            $table->text('descripcion')->nullable();
            $table->timestamps();
            
            // Índices para mejor rendimiento
            $table->index(['usuario_id', 'tipo']);
            $table->unique(['usuario_id', 'nombre', 'tipo']); // Evitar duplicados por usuario
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('skills');
    }
};
