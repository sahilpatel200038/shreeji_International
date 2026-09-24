import { useEffect, useState, type FormEvent } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrackingTimeline } from "@/components/sections/tracking-timeline";
import { addTrackingEvent, getShipment, syncShipmentTracking } from "@/lib/api/tracking";
import type { Shipment } from "@/lib/api/types";
import { ApiError } from "@/lib/api/client";

const STATUSES = [
  "created",
  "picked_up",
  "at_origin_facility",
  "departed_origin",
  "in_transit",
  "arrived_destination_country",
  "customs_clearance",
  "customs_cleared",
  "out_for_delivery",
  "delivered",
  "delivery_attempted",
  "exception",
  "returned",
  "cancelled",
];

export function ShipmentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [eventStatus, setEventStatus] = useState("in_transit");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventError, setEventError] = useState("");
  const [submittingEvent, setSubmittingEvent] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState("");

  const INTEGRATED_CARRIERS = ["ACX", "PATEL"];

  const load = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const result = await getShipment(Number(id));
      setShipment(result);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load shipment.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onAddEvent = async (e: FormEvent) => {
    e.preventDefault();
    if (!shipment) return;
    setSubmittingEvent(true);
    setEventError("");
    try {
      await addTrackingEvent(shipment.id, {
        status: eventStatus,
        location: eventLocation || null,
        description: eventDescription || null,
      });
      setEventLocation("");
      setEventDescription("");
      await load();
    } catch (err) {
      setEventError(err instanceof ApiError ? err.message : "Failed to add tracking event.");
    } finally {
      setSubmittingEvent(false);
    }
  };

  const onSyncTracking = async () => {
    if (!shipment) return;
    setSyncing(true);
    setSyncError("");
    try {
      await syncShipmentTracking(shipment.id);
      await load();
    } catch (err) {
      setSyncError(err instanceof ApiError ? err.message : "Failed to sync tracking from carrier.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) return <p className="text-sm text-muted">Loading shipment...</p>;
  if (error) return <p className="text-sm text-brand-red">{error}</p>;
  if (!shipment) return null;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{shipment.tracking_number}</h1>
          <p className="text-sm text-muted">
            {shipment.sender.name} → {shipment.receiver.name} · {shipment.status_label}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {INTEGRATED_CARRIERS.includes(shipment.courier_provider?.code ?? "") && (
            <Button variant="ghost" className="h-10 px-4 text-sm" onClick={() => void onSyncTracking()} disabled={syncing}>
              {syncing ? "Syncing..." : "Refresh from Carrier"}
            </Button>
          )}
        </div>
      </div>

      {syncError && <p className="mt-2 text-sm text-brand-red">{syncError}</p>}

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="glass-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold">Shipment History</h2>
          <TrackingTimeline events={shipment.tracking_events} currentStatus={shipment.status} />
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Add Tracking Event</h2>
            <form onSubmit={onAddEvent} className="mt-4 space-y-3">
              <select
                value={eventStatus}
                onChange={(e) => setEventStatus(e.target.value)}
                className="h-10 w-full rounded-xl border border-foreground/15 bg-background/75 px-3 text-sm outline-none"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <input
                placeholder="Location"
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                className="h-10 w-full rounded-xl border border-foreground/15 bg-background/75 px-3 text-sm outline-none focus:border-brand-red/60"
              />
              <textarea
                placeholder="Description (optional)"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-foreground/15 bg-background/75 px-3 py-2 text-sm outline-none focus:border-brand-red/60"
              />
              {eventError && <p className="text-xs text-brand-red">{eventError}</p>}
              <Button type="submit" disabled={submittingEvent} className="h-10 w-full">
                {submittingEvent ? "Adding..." : "Add Event"}
              </Button>
            </form>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold">Shipment Details</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Courier</dt>
                <dd>{shipment.courier_provider?.name ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Current Location</dt>
                <dd className="text-right">{shipment.current_location ?? "—"}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Destination</dt>
                <dd className="text-right">
                  {[shipment.destination.city, shipment.destination.country].filter(Boolean).join(", ")}
                </dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-muted">Est. Delivery</dt>
                <dd>{shipment.estimated_delivery_date ?? "—"}</dd>
              </div>
              {INTEGRATED_CARRIERS.includes(shipment.courier_provider?.code ?? "") && (
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Last Synced</dt>
                  <dd className="text-right">
                    {shipment.last_synced_at ? new Date(shipment.last_synced_at).toLocaleString() : "Never"}
                    {shipment.last_sync_error && (
                      <span className="mt-1 block text-xs text-brand-red">{shipment.last_sync_error}</span>
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {shipment.carrier_raw_response && (
            <details className="glass-card rounded-2xl p-6">
              <summary className="cursor-pointer text-lg font-semibold">Raw ACX Response</summary>
              <pre className="mt-3 max-h-96 overflow-auto rounded-xl bg-foreground/5 p-3 text-xs">
                {JSON.stringify(shipment.carrier_raw_response, null, 2)}
              </pre>
            </details>
          )}
        </div>
      </div>
    </div>
  );
}
