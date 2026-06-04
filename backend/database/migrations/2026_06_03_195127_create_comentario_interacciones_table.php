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
        Schema::create('comentario_interacciones', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('comentario_id');
            $table->unsignedBigInteger('usuario_id');
            $table->enum('tipo', ['like', 'dislike']);
            $table->timestamps();

            $table->foreign('comentario_id')->references('id')->on('comentarios')->onDelete('cascade');
            $table->foreign('usuario_id')->references('id')->on('usuarios')->onDelete('cascade');
            
            $table->unique(['comentario_id', 'usuario_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comentario_interacciones');
    }
};
