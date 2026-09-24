import { useEffect, useState } from "react";
import { listCourierProviders } from "@/lib/api/tracking";
import { deleteCourierProvider } from "@/lib/api/providers";
import type { CourierProvider } from "@/lib/api/types";

export function ProvidersPage() {
  const [providers, setProviders] = useState<CourierProvider[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setProviders(await listCourierProviders(true));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onDelete = async (id: number) => {
    if (!confirm("Delete this courier provider record?")) return;
    await deleteCourierProvider(id);
    await load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Courier Providers</h1>
      <p className="mt-1 text-sm text-muted">
        Providers are configured by the backend/tracking integrations. You can remove stale records below.
      </p>

      <div className="mt-6 glass-card rounded-2xl p-6">
        {loading ? (
          <p className="text-sm text-muted">Loading providers...</p>
        ) : providers.length === 0 ? (
          <p className="text-sm text-muted">No provider records.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="pb-3">Name</th>
                <th className="pb-3">Code</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {providers.map((p) => (
                <tr key={p.id} className="border-t border-foreground/10">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3">{p.code}</td>
                  <td className="py-3">
                    <span
                      className={
                        p.is_active
                          ? "rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-600"
                          : "rounded-full bg-foreground/10 px-3 py-1 text-xs font-semibold text-muted"
                      }
                    >
                      {p.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => onDelete(p.id)} className="font-medium text-muted hover:text-brand-red">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
