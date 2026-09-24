import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { bulkDeleteShipments, deleteShipment, listShipments } from "@/lib/api/tracking";
import type { PaginatedShipments, Shipment } from "@/lib/api/types";
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

export function DashboardPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [meta, setMeta] = useState<PaginatedShipments["meta"] | null>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const load = async (targetPage: number, overrides: { search?: string; status?: string } = {}) => {
    setLoading(true);
    setError("");
    try {
      const searchValue = overrides.search ?? search;
      const statusValue = overrides.status ?? status;
      const result = await listShipments({ search: searchValue || undefined, status: statusValue || undefined, page: targetPage });
      setShipments(result.items);
      setMeta(result.meta);
      setPage(targetPage);
      setSelected(new Set());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load shipments.");
    } finally {
      setLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Search box is debounced (typing settles before firing a request);
  // the status dropdown fires immediately since it's a discrete choice.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      void load(1);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => void load(1), 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const onStatusChange = (value: string) => {
    setStatus(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    void load(1, { status: value });
  };

  const onDelete = async (id: number) => {
    if (!confirm("Delete this shipment? This cannot be undone.")) return;
    await deleteShipment(id);
    void load(page);
  };

  const allSelected = shipments.length > 0 && selected.size === shipments.length;

  const toggleSelectAll = () => {
    setSelected(allSelected ? new Set() : new Set(shipments.map((s) => s.id)));
  };

  const toggleSelectOne = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const onBulkDelete = async () => {
    if (selected.size === 0) return;
    if (!confirm(`Delete ${selected.size} selected shipment(s)? This cannot be undone.`)) return;
    setBulkDeleting(true);
    try {
      await bulkDeleteShipments([...selected]);
      await load(1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to delete selected shipments.");
    } finally {
      setBulkDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Shipments</h1>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <input
          placeholder="Search tracking #, courier, customer #..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-64 rounded-xl border border-foreground/15 bg-background/75 px-3 text-sm outline-none focus:border-brand-red/60"
        />
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="h-10 rounded-xl border border-foreground/15 bg-background/75 px-3 text-sm outline-none"
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        {selected.size > 0 && (
          <Button
            type="button"
            variant="ghost"
            className="h-10 px-5 text-sm text-brand-red"
            disabled={bulkDeleting}
            onClick={() => void onBulkDelete()}
          >
            {bulkDeleting ? "Deleting..." : `Delete Selected (${selected.size})`}
          </Button>
        )}
      </div>

      {error && <p className="mt-4 text-sm text-brand-red">{error}</p>}
      {loading && <p className="mt-6 text-sm text-muted">Loading shipments...</p>}

      {!loading && shipments.length === 0 && (
        <p className="mt-6 text-sm text-muted">No shipments found.</p>
      )}

      {!loading && shipments.length > 0 && (
        <>
          <div className="mt-6 overflow-x-auto rounded-2xl border border-foreground/10">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-foreground/5 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3">
                    <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} />
                  </th>
                  <th className="px-4 py-3">Tracking #</th>
                  <th className="px-4 py-3">Sender → Receiver</th>
                  <th className="px-4 py-3">Courier Company</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Estimated Date</th>
                  <th className="px-4 py-3">Customer Number</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shipments.map((s) => (
                  <tr key={s.id} className="border-t border-foreground/10">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(s.id)} onChange={() => toggleSelectOne(s.id)} />
                    </td>
                    <td className="px-4 py-3 font-medium">{s.tracking_number}</td>
                    <td className="px-4 py-3">
                      {s.sender.name} → {s.receiver.name}
                    </td>
                    <td className="px-4 py-3">{s.courier_provider?.name ?? "—"}</td>
                    <td className="px-4 py-3">
                      {[s.destination.city, s.destination.country].filter(Boolean).join(", ")}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-red/10 px-3 py-1 text-xs font-semibold text-brand-red">
                        {s.status_label}
                      </span>
                    </td>
                    <td className="px-4 py-3">{s.estimated_delivery_date ?? "—"}</td>
                    <td className="px-4 py-3">{s.receiver.phone ?? "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        {/* <Link to={`/admin/shipments/${s.id}`} className="text-sm font-medium text-brand-red hover:underline">
                          Manage
                        </Link> */}
                        <button
                          onClick={() => void onDelete(s.id)}
                          className="text-sm font-medium text-muted hover:text-brand-red"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {meta && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted">
              <span>
                Page {meta.current_page} of {meta.last_page} · {meta.total} total
              </span>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 px-4 text-sm"
                  disabled={meta.current_page <= 1}
                  onClick={() => void load(meta.current_page - 1)}
                >
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="h-9 px-4 text-sm"
                  disabled={meta.current_page >= meta.last_page}
                  onClick={() => void load(meta.current_page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
