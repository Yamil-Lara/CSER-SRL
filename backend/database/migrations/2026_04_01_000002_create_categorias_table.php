<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('categorias', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->unique();
            $table->string('icono')->nullable();
            $table->string('color', 7)->nullable(); // Ej: #3B82F6
            $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('categorias'); }
};