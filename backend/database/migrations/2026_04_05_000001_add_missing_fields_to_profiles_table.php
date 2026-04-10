<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('profiles', function (Blueprint $table) {
            if (! Schema::hasColumn('profiles', 'email')) {
                $table->string('email')->nullable()->after('name');
            }
            if (! Schema::hasColumn('profiles', 'phone')) {
                $table->string('phone')->nullable()->after('location');
            }
            if (! Schema::hasColumn('profiles', 'university')) {
                $table->string('university')->nullable()->after('website');
            }
            if (! Schema::hasColumn('profiles', 'career')) {
                $table->string('career')->nullable()->after('university');
            }
        });
    }

    public function down()
    {
        Schema::table('profiles', function (Blueprint $table) {
            if (Schema::hasColumn('profiles', 'career')) {
                $table->dropColumn('career');
            }
            if (Schema::hasColumn('profiles', 'university')) {
                $table->dropColumn('university');
            }
            if (Schema::hasColumn('profiles', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('profiles', 'email')) {
                $table->dropColumn('email');
            }
        });
    }
};
