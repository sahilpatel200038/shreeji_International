import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { testimonials } from "@/data/site";
import { sectionContainer } from "@/lib/utils";

export function TestimonialsSection() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((prev) => (prev + 1) % testimonials.length), 3600);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="testimonials" className={sectionContainer}>
      <SectionHeading
        eyebrow="Testimonials"
        title="Trusted by fast-growing global businesses"
        description="What our customers say about shipping with Shreeji International Courier."
      />
      <div className="glass-card rounded-3xl p-6 md:p-10">
        <AnimatePresence mode="wait">
          <motion.article
            key={testimonials[active].name}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{ duration: 0.45 }}
            className="space-y-4"
          >
            <p className="text-xl leading-relaxed text-foreground/95 md:text-2xl">“{testimonials[active].quote}”</p>
            <div>
              <p className="font-semibold">{testimonials[active].name}</p>
              <p className="text-sm text-muted">{testimonials[active].role}</p>
            </div>
          </motion.article>
        </AnimatePresence>
        <div className="mt-6 flex gap-2">
          {testimonials.map((item, idx) => (
            <button
              key={item.name}
              onClick={() => setActive(idx)}
              aria-label={`View testimonial by ${item.name}`}
              className={`h-2 rounded-full transition ${idx === active ? "w-8 bg-brand-red" : "w-3 bg-foreground/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
