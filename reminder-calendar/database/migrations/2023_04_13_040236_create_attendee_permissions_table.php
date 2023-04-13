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
        Schema::create('attendee_permissions', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('attendee_id');   
            $table->enum('permission', ['Modify event', 'Invite others', 'See attendees list']);
            $table->timestamps();
            $table->timestamp('deleted_at')->nullable();
            $table->foreign('attendee_id')->references('id')->on('attendees');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendee_permissions');
    }
};
