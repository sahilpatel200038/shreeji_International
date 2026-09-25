import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LandingPage } from "@/components/sections/landing-page";
import { AdminApp } from "@/admin/admin-app";

// This is a single scrolling page whose URL is kept in sync with scroll
// position (see Navbar's scroll-spy). The browser's own scroll-restoration
// on back/forward otherwise fights the section-scroll effect in
// LandingPage — it can snap the viewport back to wherever it happened to be
// when that history entry was created, right after our effect scrolls to
// the correct section. Manual restoration hands scroll position fully to
// our own logic.
if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/:section?" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
