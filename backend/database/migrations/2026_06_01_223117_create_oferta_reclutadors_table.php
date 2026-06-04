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
        Schema::create('oferta_reclutadores', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('nombre');
            $table->string('empresa');
            $table->string('email_contacto');
            $table->string('ciudad');
            $table->string('pais');
            $table->string('titulo_puesto');
            $table->string('modalidad'); // remoto, presencial, hibrido
            $table->string('tipo_contrato'); // tiempo_completo, freelance, etc.
            $table->string('salario')->nullable();
            $table->text('tecnologias'); // Json o string separado por comas
            $table->text('mensaje');
            $table->string('estado')->default('nuevo'); // nuevo, visto, en_conversacion, aceptado, rechazado, archivado
            $table->integer('match_score')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('oferta_reclutadores');
    }
};
