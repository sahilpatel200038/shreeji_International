import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { TrackingTimeline } from "@/components/sections/tracking-timeline";
import { sectionContainer } from "@/lib/utils";
import { trackShipment } from "@/lib/api/tracking";
import { ApiError } from "@/lib/api/client";
import type { Shipment } from "@/lib/api/types";

type TrackingState = "idle" | "loading" | "success" | "not-found" | "error";

export function TrackingSection() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [state, setState] = useState<TrackingState>("idle");
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!trackingNumber.trim() || state === "loading") return;

    setState("loading");
    setShipment(null);
    setErrorMessage("");

    try {
      const result = await trackShipment(trackingNumber);
      setShipment(result);
      setState("success");
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        setState("not-found");
      } else {
        setState("error");
        setErrorMessage(error instanceof ApiError ? error.message : "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <section id="tracking" className={sectionContainer}>
      <SectionHeading
        eyebrow="Tracking"
        title="Track your international shipment"
        description="Enter your tracking number to see real-time status and complete delivery history."
      />
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
          <input
            aria-label="Tracking Number"
            placeholder="Enter your tracking number (e.g. SIC2026081001)"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="h-12 w-full rounded-xl border border-foreground/15 bg-background/75 px-4 outline-none transition focus:border-brand-red/60"
          />
          <Button type="submit" disabled={state === "loading"} className="h-12 sm:w-44">
            {state === "loading" ? (
              <span className="flex items-center gap-2">
                <Loader2 size={16} className="animate-spin" />
                Tracking...
              </span>
            ) : (
              "Track Shipment"
            )}
          </Button>
        </form>

        {state === "not-found" && (
          <p className="mt-6 rounded-xl border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-sm text-brand-red">
            No shipment found for tracking number &quot;{trackingNumber}&quot;. Please check the number and try again.
          </p>
        )}

        {state === "error" && (
          <p className="mt-6 rounded-xl border border-brand-red/30 bg-brand-red/5 px-4 py-3 text-sm text-brand-red">
            {errorMessage}
          </p>
        )}

        {state === "success" && shipment && (
          <div className="mt-8">
            <div className="grid gap-4 rounded-2xl border border-foreground/10 bg-background/70 p-5 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Tracking Number</p>
                <p className="mt-1 font-semibold">{shipment.tracking_number}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Courier</p>
                <p className="mt-1 font-semibold">Shreeji International Courier</p>
                {/* <p className="mt-1 font-semibold">{shipment.courier_provider?.name ?? "—"}</p> */}
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Shipper</p>
                <p className="mt-1 font-semibold">{shipment.sender.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Consignee</p>
                <p className="mt-1 font-semibold">{shipment.receiver.name || "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Current Status</p>
                <p className="mt-1 font-semibold text-brand-red">{shipment.status_label}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Current Location</p>
                <p className="mt-1 font-semibold">{shipment.current_location ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">From</p>
                <p className="mt-1 font-semibold">
                  {[shipment.origin.city, shipment.origin.country].filter(Boolean).join(", ")}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">To</p>
                <p className="mt-1 font-semibold">
                  {[shipment.destination.city, shipment.destination.country].filter(Boolean).join(", ")}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Estimated Delivery</p>
                <p className="mt-1 font-semibold">{shipment.estimated_delivery_date ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Package</p>
                <p className="mt-1 font-semibold capitalize">{shipment.shipment_type}</p>
              </div>
            </div>

            <h3 className="mt-8 text-lg font-semibold">Shipment History</h3>
            <TrackingTimeline events={shipment.tracking_events} currentStatus={shipment.status} />
          </div>
        )}
      </div>
    </section>
  );
}
