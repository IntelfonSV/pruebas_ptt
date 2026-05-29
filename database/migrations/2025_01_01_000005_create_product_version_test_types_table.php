<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_version_types', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_version_id')->constrained()->onDelete('cascade');
            $table->foreignId('test_type_id')->constrained()->onDelete('cascade');
            $table->timestamps();

            $table->unique(['product_version_id', 'test_type_id'], 'pv_types_unique');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_version_types');
    }
};