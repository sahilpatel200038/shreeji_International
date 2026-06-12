import { type MouseEvent } from "react";
import {
  Headphones,
  Mail,
  Phone,
  MessageSquare,
  Clock,
  ShieldCheck,
  Globe2,
} from "lucide-react";
import { sectionContainer } from "@/lib/utils";

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
  event.preventDefault();

  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Footer() {
  return (
    <footer id="contact" className="bg-[var(--footer-bg)] text-[var(--footer-text)] transition-colors duration-300">
      <div className={`${sectionContainer} sm:px-6 lg:px-8`}>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1">
            <div className="flex items-center">
              <img src="/logo.png" alt="Shreeji International Courier logo" width={100} height={100} className=" rounded-lg object-contain" loading="lazy" />
              {/* <div>
                <p className="text-lg font-semibold tracking-wide text-slate-900">Shreeji International</p>
              </div> */}
            </div>
            <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
              Premium global courier and logistics platform.
            </p>
            {/* <div className="flex items-center gap-3">
              <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-red-600 hover:text-red-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.65 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.38c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.19 2.23.19v2.45h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.35 21.12 22 16.99 22 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-red-600 hover:text-red-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M22.46 6c-.77.35-1.6.58-2.47.69a4.3 4.3 0 0 0 1.88-2.37 8.59 8.59 0 0 1-2.72 1.04 4.28 4.28 0 0 0-7.29 3.9A12.14 12.14 0 0 1 3.2 4.6a4.28 4.28 0 0 0 1.33 5.72 4.24 4.24 0 0 1-1.94-.54v.05a4.28 4.28 0 0 0 3.43 4.19 4.3 4.3 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.97 8.58 8.58 0 0 1-5.31 1.83A8.79 8.79 0 0 1 2 18.29a12.1 12.1 0 0 0 6.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.66 8.66 0 0 0 22.46 6z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-red-600 hover:text-red-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.34 18H6.08v-7.5h2.26V18zM7.21 9.85a1.31 1.31 0 1 1 .01-2.62 1.31 1.31 0 0 1-.01 2.62zM18 18h-2.25v-3.74c0-.89-.02-2.03-1.24-2.03-1.24 0-1.43.97-1.43 1.97V18H11V10.5h2.16v1h.03c.3-.57 1.03-1.17 2.12-1.17 2.27 0 2.69 1.49 2.69 3.43V18z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-700 transition hover:border-red-600 hover:text-red-600">
                <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                  <path d="M7 2C4.24 2 2 4.24 2 7v10c0 2.76 2.24 5 5 5h10c2.76 0 5-2.24 5-5V7c0-2.76-2.24-5-5-5H7zm0 2h10c1.66 0 3 1.34 3 3v10c0 1.66-1.34 3-3 3H7c-1.66 0-3-1.34-3-3V7c0-1.66 1.34-3 3-3zm8 2.5a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                </svg>
              </a>
            </div> */}
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">Quick Links</p>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              {[
                { label: "About Us", id: "about" },
                { label: "Services", id: "services" },
                { label: "Coverage", id: "coverage" },
                { label: "Testimonials", id: "testimonials" },
              ].map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)} className="transition hover:text-brand-red">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em]  text-[var(--foreground)]">Customer Support</p>
            <div className="space-y-3 text-sm text-[var(--muted)]">
              <div className="flex items-center gap-3">
                <Headphones size={18} className="text-red-600" />
                <span>24/7 Customer Support</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-600" />
                <a href="tel:+919909566565" className="transition hover:text-red-600">
                  +91 99095 66565
                </a>
              </div>
              {/* <div className="flex items-center gap-3">
                <MessageSquare size={18} className="text-red-600" />
                <span>Live Chat</span>
                </div> */}
              <div className="flex items-start gap-3">
                <Clock size={18} className="text-red-600 mt-1" />
                <span>Mon - Sat: 10:00 AM - 8:00 PM</span>
              </div>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-red-600" />
                  <a href="mailto:support@shreejiinternationalcourier.com" className="transition hover:text-red-600">
                    support@shreejiinternationalcourier.com
                  </a>
                </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">Branch Address</p>
            <div className="space-y-4 text-sm text-[var(--muted)]">
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-colors duration-300">
                <p className="font-semibold text-[var(--foreground)]">Head Office</p>
                <p>Shreeji International Courier</p>
                <p>Shop no.4, Shreemad Elegance, near Kanba Hospital, Nikol, Ahmedabad-380049, Gujarat</p>
                {/* <p>Andheri East,</p>
                <p>Mumbai - 400093, Maharashtra, India</p> */}
              </div>
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-colors duration-300">
                <p className="font-semibold text-[var(--foreground)]">Other Branches</p>
                <p>Bapunagar • Gota</p>
                {/* <p>Kolkata • Ahmedabad • Surat</p> */}
              </div>
            </div>
          </div>

          {/* <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">Services</p>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-900">Newsletter</p>
            <p className="max-w-sm text-sm leading-7 text-slate-600">
              Subscribe to get updates on our latest services and offers.
            </p>
            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
              <input
                type="email"
                placeholder="Your email"
                className="min-h-[48px] w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-red-600 focus:ring-4 focus:ring-red-100"
              />
              <button className="min-h-[48px] rounded-xl bg-[#d71920] px-6 text-sm font-semibold text-white transition hover:bg-[#b31418]">
                Join
              </button>
            </div>
            <div className="grid gap-3 sm:grid-cols-1">
              <div className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
                <ShieldCheck size={20} className="mt-1 text-red-600" />
                <div>
                  <p className="font-semibold text-slate-900">Secure Deliveries</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
                <Globe2 size={20} className="mt-1 text-red-600" />
                <div>
                  <p className="font-semibold text-slate-900">Worldwide Coverage</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
                <Clock size={20} className="mt-1 text-red-600" />
                <div>
                  <p className="font-semibold text-slate-900">On-time Delivery</p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-3xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600 shadow-sm">
                <Headphones size={20} className="mt-1 text-red-600" />
                <div>
                  <p className="font-semibold text-slate-900">24/7 Support</p>
                </div>
              </div>
            </div>
          </div> */}
        </div>
        <div className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)]">
          © 2026 Shreeji International Courier
        </div>
      </div>
    </footer>
  );
}
