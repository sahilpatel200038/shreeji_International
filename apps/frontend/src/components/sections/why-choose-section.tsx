import { motion } from "framer-motion";
import { reasons } from "@/data/site";
import { SectionHeading } from "@/components/ui/section-heading";
import { sectionContainer } from "@/lib/utils";

export function WhyChooseSection() {
  return (
    <section className={sectionContainer}>
      <SectionHeading
        eyebrow="Why Choose Shreeji"
        title="Why Ahmedabad Trusts Us for International Courier"
        description="5+ years of reliable international shipping from Ahmedabad. Here's what makes Shreeji the preferred courier partner for families, students, and businesses."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {reasons.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.07 }}
            className="rounded-2xl border border-foreground/10 bg-background/80 p-6 shadow-sm transition hover:shadow-xl"
          >
            <item.icon className="mb-4 text-brand-red" />
            <h3 className="text-xl font-semibold">{item.title}</h3>
            <p className="mt-2 text-muted">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
