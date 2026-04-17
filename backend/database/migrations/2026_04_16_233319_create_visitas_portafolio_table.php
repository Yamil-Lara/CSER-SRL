<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('visitas_portafolio', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->constrained('usuarios')->onDelete('cascade');
            $table->string('ip_address', 45);
            $table->timestamp('visitado_en');
            $table->timestamps();
            
            // Evitar visitas duplicadas (misma IP, mismo usuario, mismo día)
            $table->unique(['usuario_id', 'ip_address', 'visitado_en']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('visitas_portafolio');
    }
};