<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('test_result_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('test_result_id')->constrained()->onDelete('cascade');
            $table->string('filename', 255);
            $table->string('original_name', 255);
            $table->string('mime_type', 100);
            $table->integer('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('test_result_attachments');
    }
};