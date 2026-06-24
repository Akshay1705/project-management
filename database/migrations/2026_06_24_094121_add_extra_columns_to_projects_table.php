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
         Schema::table('projects', function (Blueprint $table) {
            $table->string('privacy')->nullable()->after('status');
            $table->string('default_task_view')->nullable()->after('privacy');
            $table->decimal('budget', 15, 2)->nullable()->after('default_task_view');
            $table->unsignedBigInteger('team_id')->nullable()->after('budget');
            $table->unsignedBigInteger('client_id')->nullable()->after('team_id');
            $table->unsignedBigInteger('project_lead_id')->nullable()->after('client_id');
            $table->foreign('team_id')->references('id')->on('teams')->onDelete('set null');
            $table->foreign('client_id')->references('id')->on('clients')->onDelete('set null');
            $table->foreign('project_lead_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->dropForeign(['team_id']);
            $table->dropForeign(['client_id']);
            $table->dropForeign(['project_lead_id']);
            $table->dropColumn(['privacy', 'default_task_view', 'budget', 'team_id', 'client_id', 'project_lead_id']);
        });
    }
};
