import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "@/components/sections/landing-page";
import { AdminApp } from "@/admin/admin-app";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </BrowserRouter>
  );
}
