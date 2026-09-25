import { useEffect, useState, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { MoonStar, SunMedium, PackageSearch, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

// Order matches the page's actual scroll order, so the active nav item
// tracks smoothly as the user scrolls from one section to the next.
const links = ["Home", "Tracking", "About", "Services", "Testimonials", "Contact"];

// Section ids driven by the header links, used to validate the `/:section`
// route param so unknown paths don't attempt to scroll to a missing element.
export const SECTION_IDS = links.map((link) => link.toLowerCase());

export function pathForSection(sectionId: string) {
  return sectionId === "home" ? "/" : `/${sectionId}`;
}

export function scrollToSection(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
  event.preventDefault();

  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme, mounted } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy: this site is a single scrolling page (one route, anchor
  // sections), not multiple routes, so "which menu item is active" is
  // derived from which section is currently in view rather than from
  // react-router path matching. Recomputed directly off scroll position
  // (the section whose top has most recently crossed a reference line near
  // the top of the viewport) on every scroll — correct on load/refresh,
  // while scrolling, and for instant/large jumps alike. An
  // IntersectionObserver with a narrow threshold band was tried first but
  // is unreliable for fast/instant scrolls that skip past a thin band
  // between two observer callbacks; this direct calculation isn't.
  //
  // The same computation also keeps the address bar in sync with whichever
  // section is on screen, via history.replaceState — not navigate()/pushState,
  // so scrolling never floods browser history or fights back/forward; those
  // still walk the entries created by actual nav clicks, replaceState just
  // silently keeps the *current* entry's URL accurate. history.state is
  // preserved (only the URL portion changes) so react-router's own
  // bookkeeping for that entry stays intact.
  useEffect(() => {
    const sectionIds = links.map((link) => link.toLowerCase());
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    let lastSyncedSection = sections[0].id;

    const computeActive = (syncUrl: boolean) => {
      const referenceY = window.innerHeight * 0.35;
      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= referenceY) {
          current = section.id;
        }
      }
      setActiveSection(current);

      if (syncUrl && current !== lastSyncedSection) {
        lastSyncedSection = current;
        const path = pathForSection(current);
        if (window.location.pathname !== path) {
          window.history.replaceState(window.history.state, "", path);
        }
      }
    };

    // Establish the initial active section (and baseline for lastSyncedSection)
    // from scroll position alone, without touching the URL — a direct visit to
    // /about must keep that URL until the user actually scrolls elsewhere,
    // rather than being clobbered back to "/" before the deep-link scroll runs.
    computeActive(false);
    const handleScroll = () => computeActive(true);
    const handleResize = () => computeActive(true);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onNavLinkClick = (event: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    event.preventDefault();
    navigate(pathForSection(sectionId));
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  };

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-x-0 top-0 z-50"
    >
      {/*
        Full-width background layer: only this fades/shadows in on scroll.
        It never touches the container below, so the nav's width, padding,
        rounding, and alignment stay pixel-identical in both states.
      */}
      <div
        aria-hidden="true"
        className={cn(
          "absolute inset-0 bg-background/90 backdrop-blur-md transition-[opacity,box-shadow] duration-200 ease-out",
          scrolled ? "opacity-100 shadow-[0_4px_20px_rgba(8,10,15,0.08)]" : "opacity-0 shadow-none",
        )}
      />

      <div className="relative px-4 py-4">
        <nav
          className={cn("glass-card mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-5 py-3", scrolled ? "scrolled" : "")}
          aria-label="Main navigation"
        >
          <a href="/" className="flex items-center gap-3">
            <img src="/logo.png" alt="Shreeji International Courier logo" width={70} height={70} />
            {/* <div>
              <p className="text-sm font-semibold leading-tight">Shreeji International</p>
              <p className="text-xs text-muted">Courier Network</p>
            </div> */}
          </a>

          <div className="hidden items-center gap-7 text-base text-muted lg:flex">
            {links.map((link) => {
              const sectionId = link.toLowerCase();
              const isActive = activeSection === sectionId;
              return (
                <a
                  key={link}
                  href={pathForSection(sectionId)}
                  onClick={(event) => onNavLinkClick(event, sectionId)}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative py-1 transition-colors hover:text-foreground",
                    isActive && "font-semibold text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:rounded-full after:bg-brand-red",
                  )}
                >
                  {link}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle dark mode"
              onClick={toggleTheme}
              className="rounded-full border border-foreground/10 bg-background/70 p-2 text-muted transition hover:text-foreground"
            >
              {mounted && theme === "dark" ? <SunMedium size={17} /> : <MoonStar size={17} />}
            </button>
            <a
              href="#tracking"
              onClick={(event) => scrollToSection(event, "tracking")}
              className="hidden sm:inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-red to-brand-orange px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(190,20,34,0.4)] transition hover:translate-y-[-1px] hover:shadow-[0_12px_28px_rgba(190,20,34,0.5)]"
              aria-label="Track your shipment"
            >
              <PackageSearch size={14} />
              Track Shipment
            </a>
            <button
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
              onClick={() => setMobileOpen((open) => !open)}
              className="rounded-full border border-foreground/10 bg-background/70 p-2 text-muted transition hover:text-foreground lg:hidden"
            >
              {mobileOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              id="mobile-nav-panel"
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="glass-card mx-auto mt-2 max-w-7xl overflow-hidden rounded-2xl lg:hidden"
            >
              <div className="flex flex-col gap-1 px-5 py-4 text-base text-muted">
                {links.map((link) => {
                  const sectionId = link.toLowerCase();
                  const isActive = activeSection === sectionId;
                  return (
                    <a
                      key={link}
                      href={pathForSection(sectionId)}
                      onClick={(event) => onNavLinkClick(event, sectionId)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-2 transition-colors hover:bg-foreground/5 hover:text-foreground",
                        isActive && "bg-brand-red/10 font-semibold text-brand-red",
                      )}
                    >
                      {link}
                    </a>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
