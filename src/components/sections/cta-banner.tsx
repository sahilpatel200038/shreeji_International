import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { sectionContainer } from "@/lib/utils";

export function CtaBanner() {
  return (
    <section className={sectionContainer}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-white/25 bg-gradient-to-r from-brand-red to-brand-orange p-8 text-white md:p-10"
      >
        <div className="floating-particles absolute inset-0 opacity-40" />
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <h3 className="text-3xl font-bold md:text-4xl">Ship Worldwide With Confidence</h3>
            <p className="mt-2 text-white/80">Start your next international shipment with premium support.</p>
          </div>
          <Button href="#contact" variant="secondary" className="border-white/35 text-white">
            Start Shipping
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
