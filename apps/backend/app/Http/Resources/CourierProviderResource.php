<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourierProviderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'code' => $this->code,
            'tracking_url_template' => $this->tracking_url_template,
            'logo_path' => $this->logo_path,
            'is_active' => $this->is_active,
        ];
    }
}
