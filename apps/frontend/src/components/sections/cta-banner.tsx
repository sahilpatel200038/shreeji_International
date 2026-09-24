import { motion } from "framer-motion";
import { Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sectionContainer } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className={sectionContainer}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-r from-brand-red to-brand-orange p-8 text-white md:p-12"
      >
        <div className="floating-particles absolute inset-0 opacity-40" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold md:text-4xl">
              Ready to Ship Internationally from Ahmedabad?
            </h2>
            <p className="mt-3 max-w-xl text-white/80">
              Get a free pickup from Nikol, Naroda, Bapunagar & all of Ahmedabad.
              Trusted by 10,000+ customers. Fast delivery to 100+ countries.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href="tel:+919510813076" variant="secondary" className="flex items-center gap-2 border-white/35 text-white cursor-pointer">
              <Phone size={16} />
              Book Free Pickup
            </Button>
            <Button
              href="https://wa.me/919510813076?text=Hello%20Shreeji%20International%20Courier%2C%20I%20would%20like%20to%20get%20a%20quote%20for%20international%20shipping."
              variant="secondary"
              className="flex items-center gap-2 border-white/35 text-white cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={16} />
              WhatsApp Us
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
