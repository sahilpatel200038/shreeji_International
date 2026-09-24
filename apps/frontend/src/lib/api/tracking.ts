import { apiFetch } from "@/lib/api/client";
import type { CourierProvider, PaginatedShipments, Shipment, TrackingEvent } from "@/lib/api/types";

export function trackShipment(trackingNumber: string): Promise<Shipment> {
  return apiFetch<Shipment>(`/tracking/${encodeURIComponent(trackingNumber.trim())}`);
}

export function listCourierProviders(all = false): Promise<CourierProvider[]> {
  return apiFetch<CourierProvider[]>(`/courier-providers${all ? "?all=1" : ""}`);
}

export function listShipments(params: { search?: string; status?: string; page?: number } = {}): Promise<PaginatedShipments> {
  const query = new URLSearchParams();
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);
  if (params.page) query.set("page", String(params.page));
  const qs = query.toString();
  return apiFetch<PaginatedShipments>(`/shipments${qs ? `?${qs}` : ""}`);
}

export function getShipment(id: number): Promise<Shipment> {
  return apiFetch<Shipment>(`/shipments/${id}`);
}

export function deleteShipment(id: number): Promise<null> {
  return apiFetch<null>(`/shipments/${id}`, { method: "DELETE" });
}

export function bulkDeleteShipments(ids: number[]): Promise<{ deleted: number }> {
  return apiFetch<{ deleted: number }>(`/shipments/bulk-delete`, {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
}

export function addTrackingEvent(shipmentId: number, payload: Record<string, unknown>): Promise<TrackingEvent> {
  return apiFetch<TrackingEvent>(`/shipments/${shipmentId}/tracking-events`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function syncShipmentTracking(shipmentId: number): Promise<Shipment> {
  return apiFetch<Shipment>(`/shipments/${shipmentId}/sync-tracking`, { method: "POST" });
}
