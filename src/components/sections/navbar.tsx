import { type MouseEvent } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";

const links = [ "About", "Services", "Coverage", "Testimonials" ];

function scrollToSection(event: MouseEvent<HTMLAnchorElement>, sectionId: string) {
  event.preventDefault();

  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

export function Navbar() {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed top-0 left-0 right-0 z-50 mx-auto w-full max-w-7xl px-4 pt-4"
    >
      <nav className="glass-card flex items-center justify-between rounded-2xl px-5 py-3" aria-label="Main navigation">
        <a href="/" className="flex items-center gap-3">
          <img src="/logo.png" alt="Shreeji International Courier logo" width={70} height={70} />
          <div>
            <p className="text-sm font-semibold leading-tight">Shreeji International</p>
            <p className="text-xs text-muted">Courier Network</p>
          </div>
        </a>

        <div className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={(event) => scrollToSection(event, link.toLowerCase())}
              className="hover:text-foreground"
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            aria-label="Toggle dark mode"
            onClick={toggleTheme}
            className="rounded-full border border-foreground/10 bg-background/70 p-2 text-muted transition hover:text-foreground"
          >
            {mounted && theme === "dark" ? <SunMedium size={17} /> : <MoonStar size={17} />}
          </button>
          {/* <Button href="#contact" className="hidden sm:inline-flex">
            Get Quote
          </Button> */}
        </div>
      </nav>
    </motion.header>
  );
}
