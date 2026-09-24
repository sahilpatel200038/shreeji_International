import { apiFetch } from "@/lib/api/client";

export function deleteCourierProvider(id: number): Promise<null> {
  return apiFetch<null>(`/courier-providers/${id}`, { method: "DELETE" });
}
