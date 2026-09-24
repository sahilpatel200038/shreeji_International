<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shipments', function (Blueprint $table) {
            $table->id();
            $table->string('tracking_number', 32)->unique();
            $table->string('reference_number', 64)->nullable();

            $table->foreignId('courier_provider_id')->constrained('courier_providers')->restrictOnDelete();

            $table->string('sender_name');
            $table->string('sender_phone')->nullable();
            $table->string('sender_email')->nullable();
            $table->text('sender_address')->nullable();

            $table->string('receiver_name');
            $table->string('receiver_phone')->nullable();
            $table->string('receiver_email')->nullable();
            $table->text('receiver_address')->nullable();

            $table->string('origin_country');
            $table->string('origin_city')->nullable();
            $table->string('destination_country');
            $table->string('destination_city')->nullable();

            $table->enum('shipment_type', ['document', 'parcel', 'cargo'])->default('parcel');
            $table->text('package_description')->nullable();
            $table->decimal('weight_kg', 8, 2)->nullable();
            $table->decimal('length_cm', 8, 2)->nullable();
            $table->decimal('width_cm', 8, 2)->nullable();
            $table->decimal('height_cm', 8, 2)->nullable();

            $table->enum('status', [
                'created',
                'picked_up',
                'at_origin_facility',
                'departed_origin',
                'in_transit',
                'arrived_destination_country',
                'customs_clearance',
                'customs_cleared',
                'out_for_delivery',
                'delivered',
                'delivery_attempted',
                'exception',
                'returned',
                'cancelled',
            ])->default('created');

            $table->string('current_location')->nullable();
            $table->date('estimated_delivery_date')->nullable();
            $table->dateTime('actual_delivery_date')->nullable();

            $table->timestamps();

            $table->index('status');
            $table->index(['destination_country', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('shipments');
    }
};
