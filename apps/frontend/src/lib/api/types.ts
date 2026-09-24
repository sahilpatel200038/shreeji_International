export interface CourierProvider {
  id: number;
  name: string;
  code: string;
  tracking_url_template: string | null;
  logo_path: string | null;
  is_active: boolean;
}

export interface TrackingEvent {
  id: number;
  status: string;
  status_label: string;
  location: string | null;
  description: string | null;
  event_time: string;
  source: "manual" | "carrier";
}

export interface Shipment {
  id: number;
  tracking_number: string;
  reference_number: string | null;
  courier_provider: CourierProvider;
  sender: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
  receiver: {
    name: string;
    phone: string | null;
    email: string | null;
    address: string | null;
  };
  origin: { country: string; city: string | null };
  destination: { country: string; city: string | null };
  shipment_type: "document" | "parcel" | "cargo";
  package_description: string | null;
  weight_kg: string | null;
  dimensions_cm: { length: string | null; width: string | null; height: string | null };
  status: string;
  status_label: string;
  current_location: string | null;
  estimated_delivery_date: string | null;
  actual_delivery_date: string | null;
  carrier_raw_status: string | null;
  carrier_raw_response: Record<string, unknown> | null;
  last_synced_at: string | null;
  last_sync_error: string | null;
  tracking_events: TrackingEvent[];
  created_at: string;
  updated_at: string;
}

export interface PaginatedShipments {
  items: Shipment[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
