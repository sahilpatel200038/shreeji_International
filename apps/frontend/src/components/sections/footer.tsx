import { type MouseEvent } from "react";
import {
  Headphones,
  Mail,
  Phone,
  MessageCircle,
  MapPin,
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
          <div className="space-y-4">
            <div className="flex items-center">
              <img src="/logo.png" alt="Shreeji International Courier trusted courier service in Ahmedabad" width={100} height={100} className="rounded-lg object-contain" loading="lazy" />
            </div>
            <p className="max-w-sm text-sm leading-7 text-[var(--muted)]">
              Shreeji International Courier is Ahmedabad&apos;s trusted international courier service.
              We deliver parcels, documents & cargo to 100+ countries with free door pickup from
              Nikol, Naroda, Bapunagar & all of Ahmedabad, Gujarat.
            </p>
            <a
              href="https://wa.me/919510813076?text=Hello%20Shreeji%20International%20Courier%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20international%20shipping."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
              aria-label="Chat on WhatsApp with Shreeji International Courier"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </a>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">Our Services</p>
            <ul className="space-y-3 text-sm text-[var(--muted)]">
              {[
                { label: "International Courier Service", id: "services" },
                { label: "Express Delivery", id: "services" },
                { label: "Document Courier", id: "services" },
                { label: "Student Parcel Service", id: "services" },
                { label: "Door-to-Door Courier", id: "services" },
                { label: "Commercial Shipment", id: "services" },
              ].map((item) => (
                <li key={item.label}>
                  <a href={`#${item.id}`} onClick={(e) => scrollToSection(e, item.id)} className="transition hover:text-brand-red">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">Contact & Support</p>
            <div className="space-y-3 text-sm text-[var(--muted)]">
              <div className="flex items-center gap-3">
                <Headphones size={18} className="text-red-600 shrink-0" />
                <span>Mon – Sat: 10:00 AM – 8:00 PM</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-red-600 shrink-0" />
                <a href="tel:+919909566565" className="transition hover:text-red-600" aria-label="Call Shreeji International Courier">
                  +91 99095 66565
                </a>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={18} className="text-green-600 shrink-0" />
                <a
                  href="https://wa.me/919510813076?text=Hello%20Shreeji%2C%20I%20need%20a%20quote%20for%20international%20shipping."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-green-600"
                  aria-label="WhatsApp Shreeji International Courier"
                >
                  WhatsApp: +91 9510813076
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={18} className="text-red-600 shrink-0 mt-0.5" />
                <a href="mailto:support@shreejiinternationalcourier.com" className="break-all transition hover:text-red-600" aria-label="Email Shreeji International Courier">
                  support@shreejiinternationalcourier.com
                </a>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[var(--foreground)]">Our Locations</p>
            <div className="space-y-4 text-sm text-[var(--muted)]">
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-red-600 shrink-0" />
                  <p className="font-semibold text-[var(--foreground)]">Head Office Nikol</p>
                </div>
                <p>Shop no.4, Shreemad Elegance,</p>
                <p>near Kanba Hospital, Nikol,</p>
                <p>Ahmedabad 380049, Gujarat, India</p>
                <a
                  href="https://maps.google.com/?q=Shreeji+International+Courier+Nikol+Ahmedabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-1 text-red-600 hover:underline text-xs"
                >
                  View on Google Maps →
                </a>
              </div>
              <div className="space-y-2 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-sm transition-colors duration-300">
                <div className="flex items-center gap-2">
                  <MapPin size={15} className="text-red-600 shrink-0" />
                  <p className="font-semibold text-[var(--foreground)]">Service Areas</p>
                </div>
                <p>Nikol · Naroda · Bapunagar · Gota</p>
                <p>& all across Ahmedabad, Gujarat</p>
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
        <div className="mt-12 border-t border-[var(--border)] pt-6 text-center text-xs text-[var(--muted)] space-y-2">
          <p>
            © 2026 Shreeji International Courier. All rights reserved.
            {/* International Courier Service in Ahmedabad, Gujarat, India. */}
          </p>
          {/* <p>
            Serving: Nikol · Naroda · Bapunagar · Gota · Ahmedabad · Gujarat · India
          </p> */}
        </div>
      </div>
    </footer>
  );
}
