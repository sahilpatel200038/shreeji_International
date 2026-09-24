import { motion } from "framer-motion";
import type { TrackingEvent } from "@/lib/api/types";

function formatEventTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function TrackingTimeline({ events, currentStatus }: { events: TrackingEvent[]; currentStatus?: string }) {
  if (events.length === 0) {
    return <p className="mt-6 text-sm text-muted">No tracking history available yet for this shipment.</p>;
  }

  // ACX event timestamps aren't always in strict real-world order (e.g. a
  // customs event can be logged after the delivery event on the same day),
  // so "current" is whichever event matches the shipment's actual overall
  // status the newest such event, since `events` arrives newest-first —
  // not just the most recent timestamp. Falls back to the newest event.
  let currentEvent = events[0];
  if (currentStatus) {
    const match = events.find((event) => event.status === currentStatus);
    if (match) currentEvent = match;
  }

  // Events arrive newest-first; a horizontal timeline reads left (oldest) to right (newest).
  const chronological = [...events].reverse();
  const lastIdx = chronological.length - 1;

  return (
    <>
      {/* Mobile & tablet: vertical timeline, newest first. */}
      <ol className="mt-8 space-y-0 lg:hidden">
        {events.map((event, idx) => {
          const isCurrent = event.id === currentEvent.id;
          return (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="relative flex gap-4 pb-8 last:pb-0"
            >
              <div className="flex flex-col items-center">
                <span
                  className={
                    isCurrent
                      ? "h-3 w-3 shrink-0 rounded-full bg-gradient-to-r from-brand-red to-brand-orange shadow-[0_0_0_4px_rgba(190,20,34,0.18)]"
                      : "h-3 w-3 shrink-0 rounded-full bg-foreground/25"
                  }
                />
                {idx < events.length - 1 && <span className="mt-1 w-px flex-1 bg-foreground/15" />}
              </div>
              <div className="-mt-1 flex-1">
                <p className={isCurrent ? "font-semibold text-foreground" : "font-medium text-foreground/80"}>
                  {event.status_label}
                </p>
                {event.location && <p className="text-sm text-muted">{event.location}</p>}
                <p className="text-xs text-muted">{formatEventTime(event.event_time)}</p>
                {event.description && <p className="mt-1 text-sm text-foreground/70">{event.description}</p>}
              </div>
            </motion.li>
          );
        })}
      </ol>

      {/* Desktop: horizontal scrollable timeline, oldest to newest. */}
      <div className="mt-8 hidden -mx-1 overflow-x-auto pb-2 lg:block">
        <ol className="flex min-w-max gap-0 px-1 pt-4">
          {chronological.map((event, idx) => {
            const isCurrent = event.id === currentEvent.id;
            return (
              <motion.li
                key={event.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="relative w-56 shrink-0 pr-4 last:w-52 last:pr-0"
              >
                <div className="flex items-center">
                  <span
                    className={
                      isCurrent
                        ? "h-3 w-3 shrink-0 rounded-full bg-gradient-to-r from-brand-red to-brand-orange shadow-[0_0_0_4px_rgba(190,20,34,0.18)]"
                        : "h-3 w-3 shrink-0 rounded-full bg-foreground/25"
                    }
                  />
                  {idx < lastIdx && <span className="h-px flex-1 bg-foreground/15" />}
                </div>
                <div className="mt-3 pr-2">
                  <p className={isCurrent ? "font-semibold text-foreground" : "font-medium text-foreground/80"}>
                    {event.status_label}
                  </p>
                  {event.location && <p className="text-sm text-muted">{event.location}</p>}
                  <p className="text-xs text-muted">{formatEventTime(event.event_time)}</p>
                  {event.description && <p className="mt-1 text-sm text-foreground/70">{event.description}</p>}
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </>
  );
}
