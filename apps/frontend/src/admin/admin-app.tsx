import { Route, Routes } from "react-router-dom";
import { AdminLayout } from "@/admin/admin-layout";
import { LoginPage } from "@/admin/login-page";
import { ProtectedRoute } from "@/admin/protected-route";
import { DashboardPage } from "@/admin/dashboard-page";
import { ShipmentDetailPage } from "@/admin/shipment-detail-page";
import { ProvidersPage } from "@/admin/providers-page";

export function AdminApp() {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="shipments/:id" element={<ShipmentDetailPage />} />
          <Route path="providers" element={<ProvidersPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
