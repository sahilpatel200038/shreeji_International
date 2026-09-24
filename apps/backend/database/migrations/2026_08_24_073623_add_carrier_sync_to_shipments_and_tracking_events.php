<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->timestamp('last_synced_at')->nullable()->after('actual_delivery_date');
            $table->string('last_sync_error')->nullable()->after('last_synced_at');
            $table->string('carrier_raw_status')->nullable()->after('last_sync_error');
        });

        Schema::table('tracking_events', function (Blueprint $table) {
            $table->enum('source', ['manual', 'carrier'])->default('manual')->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('shipments', function (Blueprint $table) {
            $table->dropColumn(['last_synced_at', 'last_sync_error', 'carrier_raw_status']);
        });

        Schema::table('tracking_events', function (Blueprint $table) {
            $table->dropColumn('source');
        });
    }
};
