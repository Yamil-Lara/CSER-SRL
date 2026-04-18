<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->string('facebook')->nullable()->after('sitio_web');
            $table->string('instagram')->nullable()->after('facebook');
            $table->string('twitter')->nullable()->after('instagram');
            $table->string('tiktok')->nullable()->after('twitter');
            $table->string('threads')->nullable()->after('tiktok');
        });
    }

    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropColumn(['facebook', 'instagram', 'twitter', 'tiktok', 'threads']);
        });
    }
};