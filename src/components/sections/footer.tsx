export function Footer() {
  return (
    <footer id="contact" className="mt-6 border-t border-foreground/10 bg-foreground/[0.03]">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 md:grid-cols-4 md:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Shreeji logo" width={100} height={100} />
            <p className="font-semibold">Shreeji International</p>
          </div>
          <p className="mt-3 text-sm text-muted">Premium global courier and logistics platform.</p>
        </div>
        <div>
          <p className="font-semibold">Quick Links</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>Services</li>
            <li>Tracking</li>
            <li>Coverage</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Contact</p>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>support@shreejicourier.com</li>
            <li>+91 00000 00000</li>
            <li>Mumbai, India</li>
          </ul>
        </div>
        <div>
          <p className="font-semibold">Newsletter</p>
          <div className="mt-3 flex gap-2">
            <input
              placeholder="Your email"
              className="h-10 w-full rounded-lg border border-foreground/15 bg-background px-3 text-sm"
            />
            <button className="rounded-lg bg-brand-red px-4 text-sm font-semibold text-white">Join</button>
          </div>
        </div>
      </div>
      <div className="gradient-divider h-px w-full" />
      <p className="py-4 text-center text-xs text-muted">© {new Date().getFullYear()} Shreeji International Courier</p>
    </footer>
  );
}
