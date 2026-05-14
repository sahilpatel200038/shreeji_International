import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";

const stages = ["Shipment Booked", "In Transit", "At Destination Hub", "Out for Delivery", "Delivered"];

export function TrackingSection() {
  const [progress, setProgress] = useState(40);

  const activeStage = useMemo(() => Math.min(Math.floor(progress / 25), stages.length - 1), [progress]);

  const onTrack = () => {
    setProgress(10);
    let value = 10;
    const timer = setInterval(() => {
      value += 15;
      setProgress(Math.min(value, 100));
      if (value >= 100) clearInterval(timer);
    }, 350);
  };

  return (
    <section id="tracking" className="mx-auto w-full max-w-7xl px-4 py-16 md:px-8">
      <SectionHeading
        eyebrow="Tracking"
        title="Real-time shipment tracking dashboard"
        description="Track every milestone from dispatch to delivery with transparent status updates."
      />
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            aria-label="Tracking ID"
            defaultValue="SIC-INTL-90231"
            className="h-12 w-full rounded-xl border border-foreground/15 bg-background/75 px-4 outline-none transition focus:border-brand-red/60"
          />
          <Button onClick={onTrack} className="h-12 sm:w-44">
            Track
          </Button>
        </div>
        <div className="mt-8">
          <div className="h-3 rounded-full bg-foreground/10">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-brand-red to-brand-orange"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7 }}
            />
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-5">
            {stages.map((stage, idx) => (
              <div key={stage} className="rounded-xl border border-foreground/10 bg-background/70 p-4">
                <p className={`text-xs ${idx <= activeStage ? "text-brand-red" : "text-muted"}`}>Step {idx + 1}</p>
                <p className="mt-1 text-sm font-medium">{stage}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
