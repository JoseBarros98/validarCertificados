<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->string('certificate_image')->nullable();
    });
}

public function down()
{
    Schema::table('certificates', function (Blueprint $table) {
        $table->dropColumn('certificate_image');
    });
}
};
